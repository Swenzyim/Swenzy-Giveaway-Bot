const Discord = require("discord.js")
module.exports = {
  async execute(giveaway, winners) {
    winners.forEach((member) => {
      member.send({
        embeds: [new Discord.EmbedBuilder()
          .setTitle(`🎁 Hadi Başlayalım!`)
          .setColor("#2F3136")
          .setDescription(`Merhaba ${member.user}\n **[[Bu Çekiliş]](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** kazandığını duydum\n **${giveaway.prize}** için Tebrikler!\nÖdülünü talep etmek için host ile özelden iletişime geç!`)
          .setTimestamp()
          .setFooter({
            text: `${member.user.username}`, 
            iconURL: member.user.displayAvatarURL()
           })
        ]
      }).catch(e => {})
    });

  }
}
