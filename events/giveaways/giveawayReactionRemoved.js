const Discord = require("discord.js")
module.exports = {
  async execute(giveaway, member) {
    return member.send({
      embeds: [new Discord.EmbedBuilder()
        .setTimestamp()
        .setTitle('❓ Dur, Bir Çekilişten Tepki Mi Çekildin?')
        .setColor("#2F3136")
        .setDescription(
          `[Bu Çekiliş](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) için katılımınız kaydedildi ancak tepkinizi geri çektiniz, çünkü **${giveaway.prize}**'ye ihtiyacınız yok, bu yüzden başkasını seçmek zorunda kalacağım 😭`
        )
        .setFooter({ text: "Yanlışlıkla mı oldu? Tekrar tepki ver!" })
      ]
    }).catch(e => {})
  }
}
