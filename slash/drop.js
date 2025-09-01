const messages = require("../utils/message");
const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'drop',
    description: 'Bir çekiliş başlat',
    options: [
        {
            name: 'winners',
            description: 'Çekilişte kaç kazanan olmalı',
            type: ApplicationCommandOptionType.Integer,
            required: true
        },
        {
            name: 'prize',
            description: 'Çekiliş ödülü ne olmalı',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'channel',
            description: 'Çekilişin başlatılacağı kanal',
            type: ApplicationCommandOptionType.Channel,
            required: true
        }
    ],

    run: async (client, interaction) => {

        // Eğer üyenin yeterli yetkisi yoksa
        if (!interaction.member.permissions.has('ManageMessages') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
            return interaction.reply({
                content: ':x: Çekiliş başlatmak için "mesajları yönet" yetkisine sahip olmalısınız.',
                ephemeral: true
            });
        }

        const giveawayChannel = interaction.options.getChannel('channel');
        const giveawayWinnerCount = interaction.options.getInteger('winners');
        const giveawayPrize = interaction.options.getString('prize');

        if (!giveawayChannel.isTextBased()) {
            return interaction.reply({
                content: ':x: Lütfen bir metin kanalı seçin!',
                ephemeral: true
            });
        }
        if (giveawayWinnerCount < 1) {
            return interaction.reply({
                content: ':x: Lütfen geçerli bir kazanan sayısı seçin! En az bir olmalı.',
            });
        }

        // Çekilişi başlat
        client.giveawaysManager.start(giveawayChannel, {
            // Bu çekiliş için kazanan sayısı
            winnerCount: giveawayWinnerCount,
            // Çekilişin ödülü
            prize: giveawayPrize,
            // Çekilişi kim düzenliyor
            hostedBy: client.config.hostedBy ? interaction.user : null,
            // "Drop" özelliği belirt
            isDrop: true,
            // Mesajlar
            messages
        });

        interaction.reply(`Çekiliş ${giveawayChannel} kanalında başlatıldı! 🎉`);
    }
};
