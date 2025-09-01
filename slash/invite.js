const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'invite',
    description: '➕ Botu sunucunuza davet edin!',
    run: async (client, interaction) => {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel(`${client.user.username} Botunu Davet Et`)
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=applications.commands%20bot`),
                new ButtonBuilder()
                    .setLabel('Destek Sunucusu')
                    .setStyle(ButtonStyle.Link)
                    .setURL("https://discord.gg/excode"),
            );

        const davet = new EmbedBuilder()
            .setAuthor({
                name: `${client.user.username} Botunu Davet Et`,
                iconURL: client.user.displayAvatarURL(),
            })
            .setTitle("Davet ve Destek Bağlantısı!")
            .setDescription(`${client.user} botunu bugün sunucunuza ekleyin ve gelişmiş özelliklerle kesintisiz çekilişlerin keyfini çıkarın!`)
            .setColor('#2F3136')
            .setTimestamp()
            .setFooter({
                text: `Talep Eden: ${interaction.user.username} | ` + config.copyright,
                iconURL: interaction.user.displayAvatarURL(),
            });

        interaction.reply({ embeds: [davet], components: [row] });
    },
};
