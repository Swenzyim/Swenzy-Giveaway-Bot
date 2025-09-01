const Discord = require('discord.js');
const config = require('../config.json');

module.exports = {
  name: 'list',
  description: '🎉 Bu sunucuda aktif olan tüm çekilişleri listele.',
  run: async (client, interaction) => {
    const select = new Discord.SelectMenuBuilder()
      .setCustomId('select')
      .setPlaceholder('Görüntülemek için bir çekiliş türü seçin!')
      .addOptions([
        {
          label: '🎉 Normal Çekilişler',
          description: 'Sunucunuzda şu anda devam eden çekilişleri görüntüleyin!',
          value: 'normal',
        },
      ]);

    const row = new Discord.ActionRowBuilder().addComponents([select]);
    let giveaways = client.giveawaysManager.giveaways.filter(
      (g) => g.guildId === `${interaction.guild.id}` && !g.ended
    );

    if (!giveaways.some((e) => e.messageId)) {
      return interaction.reply('💥 Gösterilecek çekiliş yok.');
    }

    const msg = await interaction.channel.send({
      embeds: [
        new Discord.EmbedBuilder()
          .setDescription('Başlamak için menüden bir seçenek seçin!')
          .setColor('#f542ec')
          .setTimestamp(),
      ],
      components: [row],
    });

    let embed = new Discord.EmbedBuilder()
      .setTitle('Şu Anda Aktif Çekilişler')
      .setColor('#f58142')
      .setFooter({
        text: `Talep Eden: ${interaction.user.username} | ` + config.copyright,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();

    const filter = (x) =>
      x.customId == 'select' && x.user.id == interaction.member.id;

    const collector = await interaction.channel.createMessageComponentCollector({
      filter,
      time: 60000,
      max: 1,
    });

    await interaction.deferReply();

    collector.on('collect', async (i) => {
      const val = i.values[0];
      if (val == 'normal') {
        await Promise.all(
          giveaways.map(async (x) => {
            embed.addFields({
              name: `Normal Çekiliş:`,
              value: `**Ödül:** **[${x.prize}](https://discord.com/channels/${x.guildId}/${x.channelId}/${x.messageId})**\n**Başlangıç:** <t:${((x.startAt) / 1000).toFixed(0)}:R> (<t:${((x.startAt) / 1000).toFixed(0)}:f>)\n**Bitiş:** <t:${((x.endAt) / 1000).toFixed(0)}:R> (<t:${((x.endAt) / 1000).toFixed(0)}:f>)`,
            });
          })
        );
        msg.delete();
        interaction.editReply({ embeds: [embed], components: [] });
      }
    });

    collector.on('end', (collected, reason) => {
      if (reason == 'time') {
        interaction.editReply({
          content: 'Zaman Aşımı: Tekrar Deneyin!',
          components: [],
        });
      }
    });
  },
};
