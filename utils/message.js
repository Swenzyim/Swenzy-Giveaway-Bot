const config = require('../config.json');
module.exports = {
  giveaway:
    (config.everyoneMention ? "@everyone\n\n" : "") +
    "🎉 **ÇEKİLİŞ** 🎉",
  giveawayEnded:
    (config.everyoneMention ? "@everyone\n\n" : "") +
    "🎉 **ÇEKİLİŞ SONA ERDİ** 🎉",
  drawing: `Bitiş: **{timestamp}**`,
  inviteToParticipate: `Katılmak için 🎉 emojisine tıkla!`,
  winMessage: "Tebrikler, {winners}! **{this.prize}** kazandınız! 🎊",
  embedFooter: "{this.winnerCount} kazanan(lar)",
  noWinner: "Çekiliş iptal edildi, geçerli katılım yok.",
  hostedBy: "Düzenleyen: {this.hostedBy}",
  winners: "kazanan(lar)",
  endedAt: "Bitiş tarihi"
}
