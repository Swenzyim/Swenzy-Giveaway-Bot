module.exports.run = async (client, message) => {
  const Discord = require("discord.js");
  const ms = require("ms");

  // Eğer üyenin yeterli izinleri yoksa
  if (
    !message.member.permissions.has("ManageMessages") &&
    !message.member.roles.cache.some(r => r.name === "Giveaways")
  ) {
    return message.reply(
      ":x: Çekiliş başlatabilmek için mesajları yönetme iznine sahip olmalısınız."
    );
  }
  
  let time = "";
  let winnersCount;
  let prize = "";
  let giveawayx = "";
  let embed = new Discord.EmbedBuilder()
    .setTitle("Bir Çekilişi Düzenle!")
    .setColor('#2F3136')
    .setFooter({ 
      text: `${client.user.username}`, 
      iconURL: client.user.displayAvatarURL() 
    })
    .setTimestamp();
  
  const msg = await message.reply({
    embeds: [
      embed.setDescription(
        "Hangi Çekilişi Düzenlemek İstersiniz?\nÇekiliş Mesajının ID'sini Verin\n **30 saniye içinde yanıt vermelisiniz!**"
      )
    ]
  });
  
  let xembed = new Discord.EmbedBuilder()
    .setTitle("Oops! Zaman Aşımına Uğradık! 🕖")
    .setColor("#FF0000")
    .setDescription('💥 Şansımızı kaybettik!\nÇok zaman harcadınız!\nÇekilişi düzenlemek için ``edit`` komutunu tekrar kullanın!\nBu sefer **30 saniye içinde** yanıt vermeye çalışın!')
    .setFooter({ 
      text: `${client.user.username}`, 
      iconURL: client.user.displayAvatarURL() 
    })
    .setTimestamp();

  const filter = m => m.author.id === message.author.id && !m.author.bot;
  const collector = await message.channel.createMessageCollector(filter, {
    max: 3,
    time: 30000
  });

  collector.on("collect", async collect => {
    const response = collect.content;
    let gid = response;
    // ID'nin geçerli olup olmadığını kontrol et

    await collect.delete();
    if (!client.giveawaysManager.giveaways.find((g) => g.messageID === gid)) {
      return msg.edit({
        embeds: [
          embed.setDescription(
            "Uh-Oh! Geçersiz bir Mesaj ID'si verdiniz!\n**Tekrar Denemek İster misiniz?**\n Örnek: ``677813783523098627``"
          )
        ]
      });
    } else {
      collector.stop();
      msg.edit({
        embeds: [
          embed.setDescription(
            `Tamam! Şimdi, Çekilişin bitiş süresi ne olmalı?\n**30 saniye içinde yanıt verin!**`
          )
        ]
      });
    }

    const collector2 = await message.channel.createMessageCollector(filter, {
      max: 3,
      time: 30000
    });
    
    collector2.on("collect", async collect2 => {
      let mss = ms(collect2.content);
      await collect2.delete();
      if (!mss) {
        return msg.edit({
          embeds: [
            embed.setDescription(
              "Üzgünüm! Geçersiz bir süre sağladınız\n**Tekrar Denemek İster misiniz?**\n Örnek: ``-10 dakika``,``-10m``,``-10``\n **Not: - (eksi) işareti zamanı azaltmak için kullanılır!**"
            )
          ]
        });
      } else {
        time = mss;
        collector2.stop();
        msg.edit({
          embeds: [
            embed.setDescription(
              `Tamam! Şimdi, Çekiliş için kaç kazanan seçmeliyim?\n**30 saniye içinde yanıt verin!**`
            )
          ]
        });
      }

      const collector3 = await message.channel.createMessageCollector(filter, {
        max: 3,
        time: 30000,
        errors: ['time']
      });
      
      collector3.on("collect", async collect3 => {
        const response3 = collect3.content.toLowerCase();
        await collect3.delete();
        if (parseInt(response3) < 1 || isNaN(parseInt(response3))) {
          return msg.edit({
            embeds: [
              embed.setDescription(
                "Kazanan sayısı bir sayı olmalı veya birden büyük olmalı!\n**Tekrar Denemek İster misiniz?**\n Örnek ``1``,``10``, vb."
              )
            ]
          });
        } else {
          winnersCount = parseInt(response3);
          collector3.stop();
          msg.edit({
            embeds: [
              embed.setDescription(
                `Tamam, Şimdi, Çekilişin yeni ödülü ne olmalı?\n**30 saniye içinde yanıt verin!**`
              )
            ]
          });
        }

        const collector4 = await message.channel.createMessageCollector(filter, {
          max: 3,
          time: 30000,
          errors: ['time']
        });
        
        collector4.on("collect", async collect4 => {
          const response4 = collect4.content.toLowerCase();
          prize = response4;
          await collect4.delete();
          collector4.stop();
          console.log(giveawayx);
          msg.edit({
            embeds: [
              embed.setDescription(
                `Çekiliş başarıyla düzenlendi`
              )
            ]
          });
          
          client.giveawaysManager.edit(gid, {
            newWinnerCount: winnersCount,
            newPrize: prize,
            addTime: time
          });
        });
      });
    });
  });

  collector.on('end', (collected, reason) => {
    if (reason == 'time') {
      message.reply({ embeds: [xembed] });
    }
  });

  try {
    collector2.on('end', (collected, reason) => {
      if (reason == 'time') {
        message.reply({ embeds: [xembed] });
      }
    });
    
    collector3.on('end', (collected, reason) => {
      if (reason == 'time') {
        message.reply({ embeds: [xembed] });
      }
    });
    
    collector4.on('end', (collected, reason) => {
      if (reason == 'time') {
        message.reply({ embeds: [xembed] });
      }
    });
  } catch (e) { }
};
