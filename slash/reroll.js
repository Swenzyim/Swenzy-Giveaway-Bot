const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: "reroll",
    description: '🎉 Bir çekilişi yeniden yapın',

    options: [
        {
            name: 'giveaway',
            description: 'Yeniden yapılacak çekiliş (mesaj ID veya ödül)',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    run: async (client, interaction) => {

        // Eğer üyenin yeterli izinleri yoksa
        if (!interaction.member.permissions.has('ManageMessages') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
            return interaction.reply({
                content: ':x: Çekilişleri yeniden yapabilmek için mesajları yönetme iznine sahip olmalısınız.',
                ephemeral: true
            });
        }

        const query = interaction.options.getString('giveaway');

        // Verilen ödülle veya ID ile çekilişi bulmaya çalışıyoruz
        const giveaway =
            // Çekilişi ödül ile ara
            client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) ||
            // Çekiliş ID'si ile ara
            client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);

        // Çekiliş bulunamazsa
        if (!giveaway) {
            return interaction.reply({
                content: `'${query}' için bir çekiliş bulunamadı.`,
                ephemeral: true
            });
        }

        if (!giveaway.ended) {
            return interaction.reply({
                content: `[Bu Çekiliş](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) henüz sona ermedi`,
                ephemeral: true
            });
        }

        // Çekilişi yeniden yap
        client.giveawaysManager.reroll(giveaway.messageId)
            .then(() => {
                // Başarı mesajı
                interaction.reply(`**[Bu Çekiliş](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** yeniden yapıldı!`);
            })
            .catch((e) => {
                interaction.reply({
                    content: e,
                    ephemeral: true
                });
            });

    }
};
