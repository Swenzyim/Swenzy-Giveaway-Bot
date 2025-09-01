const Discord = require('discord.js'),
  { EmbedBuilder } = Discord,
  parsec = require('parsec'),
  messages = require('../utils/message');

module.exports.run = async (client, message) => {
    // Eğer üyenin yeterli izinleri yoksa
    if (
      !message.member.permissions.has("ManageMessages") &&
      !message.member.roles.cache.some(r => r.name === "Giveaways")
    ) {
      return message.reply(
        ":x: Çekiliş başlatabilmek için mesajları yönetme iznine sahip olmalısınız."
      );
    }
    
  const collector = message.channel.createMessageCollector({
    filter: (m) => m.author.id === message.author.id,
    time: 60000,
  });

  let xembed = new EmbedBuilder()
  .setTitle("Hups! Görünüşe Göre Bir Zaman Aşımına Uğradık! 🕖")
  .setColor("#FF0000")
  .setDescription('💥 Şansımıza bir darbe!\nÇok fazla zaman harcadınız!\nYeni bir çekiliş başlatmak için ``create`` komutunu tekrar kullanın!\nBu sefer **30 saniye** içinde yanıt verin!')
  .setFooter({
     text: `${client.user.username}`,
     iconURL: client.user.displayAvatarURL()
  })  
  .setTimestamp()

  function waitingEmbed(title, desc) {
    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: `${message.author.tag} + ' | Çekiliş Ayarı'`,
            iconURL: message.member.displayAvatarURL()
          })
          .setTitle('Çekiliş ' + title)
          .setDescription(desc + ' önümüzdeki 60 saniye içinde.')
          .setFooter({
            text: "Bu işlemi sonlandırmak için 'cancel' yazın.",
            iconURL: client.user.displayAvatarURL()
           })
          .setTimestamp()
          .setColor('#2F3136'),
      ],
    });
  }

  let winnerCount, channel, duration, prize, cancelled;

  await waitingEmbed('Ödül', 'Lütfen çekiliş ödülünü gönderin');

  collector.on('collect', async (m) => {
    if (cancelled) return;

    async function failed(options, ...cancel) {
      if (typeof cancel[0] === 'boolean')
        (cancelled = true) && (await m.reply(options));
      else {
        await m.reply(
          options instanceof EmbedBuilder ? { embeds: [options] } : options
        );
        return await waitingEmbed(...cancel);
      }
    }

    if (m.content === 'cancel'){ 
  collector.stop()
 return await failed('Çekiliş Oluşturma İptal Edildi.', true) 
}

    switch (true) {
      case !prize: {
        if (m.content.length > 256)
          return await failed(
            'Ödül 256 karakterden uzun olamaz.',
            'Ödül',
            'Lütfen çekiliş ödülünü gönderin'
          );
        else {
          prize = m.content;
          await waitingEmbed('Kanal', 'Lütfen çekiliş kanalını gönderin');
        }

        break;
      }

      case !channel: {
        if (!(_channel = m.mentions.channels.first() || m.guild.channels.cache.get(m.content)))
          return await failed(
            'Lütfen geçerli bir kanal / kanal ID\'si gönderin.',
            'Kanal',
            'Lütfen çekiliş kanalını gönderin'
          );
        else if (!_channel.isTextBased())
          return await failed(
            'Kanal bir metin kanalı olmalıdır.',
            'Kanal',
            'Lütfen çekiliş kanalını gönderin'
          );
        else {
          channel = _channel;
          await waitingEmbed(
            'Kazanan Sayısı',
            'Lütfen çekiliş kazanan sayısını gönderin.'
          );
        }

        break;
      }

      case !winnerCount: {
        if (!(_w = parseInt(m.content)))
          return await failed(
            'Kazanan sayısı bir tamsayı olmalıdır.',
            'Kazanan Sayısı',
            'Lütfen çekiliş kazanan sayısını gönderin.'
          );
        if (_w < 1)
          return await failed(
            'Kazanan sayısı 1\'den fazla olmalıdır.',
            'Kazanan Sayısı',
            'Lütfen çekiliş kazanan sayısını gönderin.'
          );
        else if (_w > 15)
          return await failed(
            'Kazanan sayısı 15\'ten az olmalıdır.',
            'Kazanan Sayısı',
            'Lütfen çekiliş kazanan sayısını gönderin.'
          );
        else {
          winnerCount = _w;
          await waitingEmbed('Süre', 'Lütfen çekiliş süresini gönderin');
        }

        break;
      }

      case !duration: {
        if (!(_d = parsec(m.content).duration))
          return await failed(
            'Lütfen geçerli bir süre girin.',
            'Süre',
            'Lütfen çekiliş süresini gönderin'
          );
        if (_d > parsec('21d').duration)
          return await failed(
            'Süre 21 günden az olmalıdır!',
            'Süre',
            'Lütfen çekiliş süresini gönderin'
          );
        else {
          duration = _d;
        }

        return client.giveawaysManager.start(channel, {
          prize,
          duration,
          winnerCount,
          hostedBy: client.config.hostedBy ? message.author : null,
          messages,
        });
      }
    }
  });
  collector.on('end', (collected, reason) => {
    if (reason == 'time') {
       message.reply({ embeds: [xembed]})
    }
  })
};
