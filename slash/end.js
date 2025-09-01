const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: "end",
    description: '🎉 Zaten devam eden bir çekilişi sonlandır',

    options: [
        {
            name: 'giveaway',
            description: 'Sonlandırılacak çekiliş (mesaj ID veya çekiliş ödülü)',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    run: async (client, interaction) => {

        // Eğer üyenin yeterli yetkisi yoksa
        if (!interaction.member.permissions.has('ManageMessages') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
            return interaction.reply({
                content: ':x: Çekilişleri sonlandırmak için "mesajları yönet" yetkisine sahip olmalısınız.',
                ephemeral: true
            });
        }

        const query = interaction.options.getString('giveaway');

        // Mesaj ID veya ödül ile çekilişi bul
        const giveaway =
            // Ödüle göre ara
            client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) ||
            // Mesaj ID'sine göre ara
            client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);

        // Eğer belirtilen çekiliş bulunamazsa
        if (!giveaway) {
            return interaction.reply({
                content: 'Belirtilen `' + query + '` için bir çekiliş bulunamadı.',
                ephemeral: true
            });
        }

        if (giveaway.ended) {
            return interaction.reply({
                content: 'Bu çekiliş zaten sona erdi!',
                ephemeral: true
            });
        }

        // Çekilişi sonlandır
        client.giveawaysManager.end(giveaway.messageId)
            // Başarı mesajı
            .then(() => {
                interaction.reply(`**[Bu Çekiliş](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** şimdi sona erdi! 🎉`);
            })
            .catch((e) => {
                interaction.reply({
                    content: e,
                    ephemeral: true
                });
            });
    }
};
