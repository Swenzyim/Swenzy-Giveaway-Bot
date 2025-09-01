const ms = require('ms');
module.exports.run = async (client, message, args) => {

    // Eğer üyenin yeterli izni yoksa
    if(!message.member.permissions.has('ManageMessages') && !message.member.roles.cache.some((r) => r.name === "Giveaways")){
        return message.reply(':x: Çekilişleri tekrar çekmek için mesajları yönetme izniniz olmalı.');
    }

    // Eğer mesaj ID'si veya çekiliş adı belirtilmemişse
    if(!args[0]){
        return message.reply(':x: Geçerli bir mesaj ID\'si belirtmelisiniz!');
    }

    // Ödül ile veya ID ile çekilişi bulmayı deneyin
    let giveaway = 
    // Çekilişi ödülle arayın
    client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
    // Çekilişi ID ile arayın
    client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

    // Eğer çekiliş bulunamazsa
    if(!giveaway){
        return message.reply('`'+ args.join(' ') +'` için bir çekiliş bulunamadı.');
    }

    // Çekilişi yeniden başlat
    client.giveawaysManager.reroll(giveaway.messageID)
    .then(() => {
        // Başarı mesajı
        message.reply('Çekiliş tekrar başlatıldı!');
    })
    .catch((e) => {
        if(e.startsWith(`Giveaway with message ID ${giveaway.messageID} is not ended.`)){
            message.reply('Bu çekiliş sona ermedi!');
        } else {
            console.error(e);
            message.reply(e);
        }
    });

};
