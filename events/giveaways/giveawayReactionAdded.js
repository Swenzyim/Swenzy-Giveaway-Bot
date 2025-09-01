const Discord = require("discord.js")
module.exports = {
  async execute(giveaway, reactor, messageReaction) {
    let approved =  new Discord.EmbedBuilder()
    .setTimestamp()
    .setColor("#2F3136")
    .setTitle("Katılım Onaylandı! | Kazanma Şansınız Var!!")
    .setDescription(
      `[Bu Çekiliş](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) için katılımınız onaylandı!`
    )
    .setFooter({ text: "luriXgithub'a YT'den Abone Olun!" })
    .setTimestamp()
    
    let denied =  new Discord.EmbedBuilder()
    .setTimestamp()
    .setColor("#2F3136")
    .setTitle(":x: Katılım Reddedildi | Veritabanı Kaydı Bulunamadı ve Geri Döndü!")
    .setDescription(
      `[Bu Çekiliş](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) için katılımınız reddedildi, lütfen çekilişin gereksinimlerini doğru şekilde gözden geçirin.`
    )
    .setFooter({ text: "luriXgithub'a YT'den Abone Olun!" })

    let client = messageReaction.message.client
    if (reactor.user.bot) return;
    if(giveaway.extraData) {
      if (giveaway.extraData.server !== "null") {
        try { 
        await client.guilds.cache.get(giveaway.extraData.server).members.fetch(reactor.id)
        return reactor.send({
          embeds: [approved]
        });
        } catch(e) {
          messageReaction.users.remove(reactor.user);
          return reactor.send({
            embeds: [denied]
          }).catch(e => {})
        }
      }
      if (giveaway.extraData.role !== "null" && !reactor.roles.cache.get(giveaway.extraData.role)){ 
        messageReaction.users.remove(reactor.user);
        return reactor.send({
          embeds: [denied]
        }).catch(e => {})
      }

      return reactor.send({
        embeds: [approved]
      }).catch(e => {})
    } else {
        return reactor.send({
          embeds: [approved]
        }).catch(e => {})
    }
  }
}
