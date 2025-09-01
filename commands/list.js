const Discord = require('discord.js');
const config = require('../config.json');

module.exports.run = async (client, message, args) => {
  const select = new Discord.SelectMenuBuilder().setCustomId("select").setPlaceholder("Görüntülemek için bir çekiliş türü seçin!").addOptions([
    {
      label: '🎉 Normal Çekilişler',
      description: 'Sunucunuzda şu anda devam eden normal çekilişleri kontrol edin!',
      value: 'normal',
    },
  ])
  const row = new Discord.ActionRowBuilder().addComponents([select])
  let giveaways = client.giveawaysManager.giveaways.filter(g => g.guildId === `${message.guild.id}` && !g.ended);
  if (!giveaways.some(e => e.messageId)) {
    return message.reply('💥 Görüntülenecek Çekiliş Yok')
  }
  const msg = await message.reply({ embeds: [new Discord.EmbedBuilder().setDescription("Başlamak için seçmeli menüde bir seçenek seçin!").setColor("#2F3136").setTimestamp()], components: [row] })
  let embed = new Discord.EmbedBuilder()
    .setTitle("Şu Anda Aktif Olan Çekilişler")
    .setColor("#2F3136")
    .setFooter({
      text: `${client.user.username}`, 
      iconURL: client.user.displayAvatarURL()
    })
    .setTimestamp()

  const filter = x => x.customId == "select" && x.user.id == message.author.id
  const collector = await message.channel.createMessageComponentCollector({ filter, time: 60000, max: 1 })
  collector.on("collect", async (i) => {
    i.update({ components: [] });
    const val = i.values[0]
    if (val == "normal") {
      await Promise.all(giveaways.map(async (x) => {
            embed.addFields({ name:
              `Normal Çekiliş:`, value: `**Ödül:** **[${x.prize}](https://discord.com/channels/${x.guildId}/${x.channelId}/${x.messageId})\nBaşlangıç:** <t:${((x.startAt)/1000).toFixed(0)}:R> (<t:${((x.startAt)/1000).toFixed(0)}:f>)\n**Bitiş:** <t:${((x.endAt)/1000).toFixed(0)}:R> (<t:${((x.endAt)/1000).toFixed(0)}:f>)`
              });
      })); 
     msg.edit({ embeds: [embed] })
    }

  })
  collector.on("end",(collected, reason) => {
   if(reason == "time")
   msg.edit({ content: "👀 Toplayıcı Sonlandırıldı, Tekrar Deneyin!", components: [] })
  })
}
