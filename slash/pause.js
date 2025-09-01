const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: "pause",
    description: '⏸ Pause a giveaway',

    options: [
        {
            name: 'giveaway',
            description: 'The giveaway to pause (message ID or giveaway prize)',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    run: async (client, interaction) => {

        // If the member doesn't have enough permissions
        if (!interaction.member.permissions.has('ManageMessages') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
            return interaction.reply({
                content: ':x: Çekilişleri duraklatmak için "Mesajları Yönet" iznine sahip olmalısınız.',
                ephemeral: true
            });
        }

        const query = interaction.options.getString('giveaway');

        // try to find the giveaway with prize alternatively with ID
        const giveaway =
            // Search with giveaway prize
            client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) ||
            // Search with giveaway ID
            client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);

        // If no giveaway was found
        if (!giveaway) {
            return interaction.reply({
                content: '`' + query + '` için bir çekiliş bulunamadı.',
                ephemeral: true
            });
        }

        if (giveaway.pauseOptions.isPaused) {
            return interaction.reply({
                content: `**[Bu çekiliş](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** zaten duraklatılmış.`,
                ephemeral: true
            });
        }

        // Edit the giveaway
        client.giveawaysManager.pause(giveaway.messageId)
            // Success message
            .then(() => {
                // Success message
                interaction.reply(`**[Bu çekiliş](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** artık duraklatıldı!`);
            })
            .catch((e) => {
                interaction.reply({
                    content: e,
                    ephemeral: true
                });
            });

    }
};
