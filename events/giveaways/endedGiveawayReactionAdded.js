const Discord = require('discord.js');
module.exports = {
  async execute(giveaway, member, reaction) {
    reaction.users.remove(member.user);
    member.send({
        embeds: [
          new Discord.EmbedBuilder()
            .setTitle(`Çekiliş Zaten Sona Erdi!`)
            .setColor('#b50505')
            .setDescription(
              `Hey ${member.user} **[[Bu Çekiliş]](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** ki buna tepki verdin, zaten sona erdi :sob:\nBir dahaki sefere hızlı ol!`
            )
            .setTimestamp(),
        ],
      })
      .catch((e) => {});
  },
};
