exports.run = async (client, message, args) => {

    // Eğer üyenin yeterli izinleri yoksa
    if (!message.member.permissions.has('ManageMessages') && !message.member.roles.cache.some((r) => r.name === "Giveaways")) {
      return message.reply(':x: Çekiliş tekrar çekilişi başlatmak için mesajları yönetme iznine sahip olmalısınız.');
    }
  
    // Eğer mesaj ID'si ya da çekiliş adı belirtilmemişse
    if (!args[0]) {
      return message.reply(':x: Geçerli bir mesaj ID\'si belirtmelisiniz!');
    }
  
    // Öncelikle çekiliş ödülü ile sonra ID ile arama yapmaya çalış
    let giveaway = 
    // Çekiliş ödülü ile ara
    client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
    // Çekiliş ID'si ile ara
    client.giveawaysManager.giveaways.find((g) => g.messageId == args[0]);
  
    // Eğer çekiliş bulunamadıysa
    if (!giveaway) {
      return message.reply('`' + args.join(' ') + '` için bir çekiliş bulunamadı.');
    }
  
    // Çekilişi bitir
    client.giveawaysManager.end(giveaway.messageId)
      // Başarı mesajı
      .then(() => {
        message.reply('Çekiliş Sonlandırıldı.');
      }).catch((e) => {
        message.reply({
          content: e
        });
      })
  
  };
  