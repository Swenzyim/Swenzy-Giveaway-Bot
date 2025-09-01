const Discord = require("discord.js")
module.exports = {
  async execute(giveaway, winners) {
    winners.forEach((member) => {
      member.send({
        embeds: [new Discord.EmbedBuilder()
          .setTitle(`🎁 Hadi Başlayalım! Yeni Bir Kazananımız Var`)
          .setColor("#2F3136")
          .setDescription(`Merhaba ${member.user}\n Sunucunun çekilişi yeniden yapıldığını duydum ve sen **[[Bu Çekilişi]](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** kazandın!\n **${giveaway.prize}** kazanmanızı kutlarız!\n Ödülünü almak için sunucu sahibine özel mesaj gönder!`)
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
