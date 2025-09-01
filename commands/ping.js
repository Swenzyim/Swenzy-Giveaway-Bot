const Discord = require('discord.js');
const config = require('../config.json');
module.exports.run = async (client, message, args) => {
  let m = await message.reply("WebSocket'e istek gönderiliyor...")
  let pong = new Discord.EmbedBuilder()
    .setAuthor({
      name: `🏓 Pong!`, 
      iconURL: message.author.displayAvatarURL()
    })
    .setTitle("Bot'un Ping Değeri")
    .setColor('#2F3136')	
    .setTimestamp()
                 
    .addFields([
   { name: '**Gecikme**', value: `\`${Date.now() - message.createdTimestamp}ms\`` },
   { name: '**API Gecikmesi**', value: `\`${Math.round(client.ws.ping)}ms\`` },
    ])
    .setFooter({
      text: `İstediği: ${message.author.tag}`, 
      iconURL: message.author.displayAvatarURL()
    });

     m.delete()
  message.reply({ content: " ", embeds: [pong] })
}
