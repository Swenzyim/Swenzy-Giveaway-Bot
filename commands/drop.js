const messages = require("../utils/message");
module.exports.run = async (client, message, args) => {
  // Eğer üyenin yeterli izinleri yoksa
  if (
    !message.member.permissions.has("ManageMessages") &&
    !message.member.roles.cache.some(r => r.name === "Giveaways")
  ) {
    return message.reply(
      ":x: Çekiliş başlatabilmek için mesajları yönetme iznine sahip olmalısınız."
    );
  }

  // Çekiliş kanalı
  let giveawayChannel = message.mentions.channels.first();
  // Eğer kanal belirtilmemişse
  if (!giveawayChannel) {
    return message.reply(":x: Geçerli bir kanal belirtmelisiniz!");
  }

  // Kazanan sayısı
  let giveawayNumberWinners = parseInt(args[1]);
  // Eğer belirtilen kazanan sayısı geçerli bir sayı değilse
  if (isNaN(giveawayNumberWinners) || parseInt(giveawayNumberWinners) <= 0) {
    return message.reply(
      ":x: Geçerli bir kazanan sayısı belirtmelisiniz!"
    );
  }

  // Çekiliş ödülü
  let giveawayPrize = args.slice(2).join(" ");
  // Eğer ödül belirtilmemişse
  if (!giveawayPrize) {
    return message.reply(":x: Geçerli bir ödül belirtmelisiniz!");
  }
  
  // Çekilişi başlat
  await client.giveawaysManager.start(giveawayChannel, {
    // Çekiliş ödülü
    prize: giveawayPrize,
    // Çekiliş kazanan sayısı
    winnerCount: parseInt(giveawayNumberWinners),
    // Bu çekilişi kim düzenliyor
    hostedBy: client.config.hostedBy ? message.author : null,
    // Belirtilen "drop" etkinliği
    isDrop: true,
    // Mesajlar
    messages
  });
  message.reply(`Çekiliş ${giveawayChannel} kanalında başlatıldı!`);
}
