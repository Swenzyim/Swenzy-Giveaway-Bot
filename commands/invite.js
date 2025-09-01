const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config.json');

module.exports.run = async (client, message, args) => {
    const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setLabel(`${client.user.username} Davet Et`)
        .setStyle(ButtonStyle.Link)
        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=applications.commands%20bot`),
        new ButtonBuilder()
        .setLabel('Destek Sunucusu')
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.gg/excode"),
    )
    let invite = new EmbedBuilder()
     .setAuthor({ 
          name: `${client.user.username} Davet Et`, 
          iconURL: client.user.displayAvatarURL() 
     })  
    .setTitle("Davet & Destek Linki!")
    .setDescription(`${client.user} botunu sunucunuza davet edin ve gelişmiş özelliklerle sorunsuz çekilişlerin tadını çıkarın!`)
    .setColor('#2F3136')
    .setTimestamp()
    .setFooter({
      text: `Talep Eden: ${message.author.username} | ` + config.copyright, 
      iconURL: message.author.displayAvatarURL()
    });
    message.reply({ embeds: [invite], components: [row]});
}
