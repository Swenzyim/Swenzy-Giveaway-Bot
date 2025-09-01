const ms = require("ms");
const messages = require("../utils/message");
module.exports.run = async (client, message, args) => {
  // Eğer üyenin yeterli izni yoksa
  if (
    !message.member.permissions.has("ManageMessages") &&
    !message.member.roles.cache.some(r => r.name === "Giveaways")
  ) {
    return message.reply(
      ":x: Çekiliş başlatmak için mesajları yönetme izniniz olmalı."
    );
  }

  // Çekiliş kanalı
  let giveawayChannel = message.mentions.channels.first();
  // Eğer kanal belirtilmemişse
  if (!giveawayChannel) {
    return message.reply(":x: Geçerli bir kanal belirtmelisiniz!");
  }

  // Çekiliş süresi
  let giveawayDuration = args[1];
  // Eğer süre geçerli değilse
  if (!giveawayDuration || isNaN(ms(giveawayDuration))) {
    return message.reply(":x: Geçerli bir süre belirtmelisiniz!");
  }

  // Kazanan sayısı
  let giveawayNumberWinners = parseInt(args[2]);
  // Eğer belirtilen kazanan sayısı geçerli değilse
  if (isNaN(giveawayNumberWinners) || parseInt(giveawayNumberWinners) <= 0) {
    return message.reply(
      ":x: Geçerli bir kazanan sayısı belirtmelisiniz!"
    );
  }

  // Çekiliş ödülü
  let giveawayPrize = args.slice(3).join(" ");
  // Eğer ödül belirtilmemişse
  if (!giveawayPrize) {
    return message.reply(":x: Geçerli bir ödül belirtmelisiniz!");
  }
  // Çekilişi başlat
  await client.giveawaysManager.start(giveawayChannel, {
    // Çekiliş süresi
    duration: ms(giveawayDuration),
    // Çekiliş ödülü
    prize: giveawayPrize,
    // Kazanan sayısı
    winnerCount: parseInt(giveawayNumberWinners),
    // Çekilişi kim düzenliyor
    hostedBy: client.config.hostedBy ? message.author : null,
    // Mesajlar
    messages
  });
  message.reply(`Çekiliş ${giveawayChannel} kanalında başlatıldı!`);
};
