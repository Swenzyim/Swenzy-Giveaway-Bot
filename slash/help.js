const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, ComponentType } = require('discord.js');
const config = require('../config.json');

module.exports = {
  name: 'help',
  description: '📜 Botun kullanılabilir tüm komutlarını görüntüleyin!',
  run: async (client, interaction) => {
    const embed = new EmbedBuilder()
      .setTitle(`${client.user.username} Komutları`)
      .setColor('#2F3136')
      .setDescription('**Tüm komutları görmek için bir kategori seçin.**')
      .addFields({
        name: `Bağlantılar:`,
        value: `- [YouTube Kanalı](https://www.youtube.com/@swenzyimm)\n- [Discord Sunucusu](https://discord.gg/excode)\n- [GitHub](https://github.com/Swenzyim)`,
        inline: true,
      })
      .setTimestamp()
      .setFooter({
        text: `Talep Eden: ${interaction.user.username} | ` + config.copyright,
        iconURL: interaction.user.displayAvatarURL(),
      });

    const giveaway = new EmbedBuilder()
      .setTitle("Kategoriler » Çekiliş")
      .setColor('#2F3136')
      .setDescription("```yaml\nİşte çekiliş komutları:```")
      .addFields(
        { name: 'Create / Start', value: `Sunucunuzda bir çekiliş başlatın!\n > **Türler: __\`slash\` / \`mesaj\`__**`, inline: true },
        { name: 'Drop', value: `Hızlı bir çekiliş başlatın!\n > **Türler: __\`slash\` / \`mesaj\`__**`, inline: true },
        { name: 'Edit', value: `Devam eden bir çekilişi düzenleyin!\n > **Türler: __\`slash\` / \`mesaj\`__**`, inline: true },
        { name: 'End', value: `Devam eden bir çekilişi sonlandırın!\n > **Türler: __\`slash\` / \`mesaj\`__**`, inline: true },
        { name: 'List', value: `Sunucuda devam eden tüm çekilişleri listeleyin!\n > **Türler: __\`slash\` / \`mesaj\`__**`, inline: true },
        { name: 'Pause', value: `Devam eden bir çekilişi durdurun!\n > **Tür: __\`slash\`__**`, inline: true },
        { name: 'Reroll', value: `Sona eren bir çekilişi yeniden çekin!\n > **Türler: __\`slash\` / \`mesaj\`__**`, inline: true },
        { name: 'Resume', value: `Durdurulan bir çekilişi devam ettirin!\n > **Tür: __\`slash\`__**`, inline: true },
      )
      .setTimestamp()
      .setFooter({
        text: `Talep Eden: ${interaction.user.username} | ` + config.copyright,
        iconURL: interaction.user.displayAvatarURL(),
      });

    const general = new EmbedBuilder()
      .setTitle("Kategoriler » Genel")
      .setColor('#2F3136')
      .setDescription("```yaml\nİşte genel bot komutları:```")
      .addFields(
        { name: 'Help', value: `Bu botun tüm kullanılabilir komutlarını gösterir!\n > **Türler: __\`slash\` / \`mesaj\`__**`, inline: true },
        { name: 'Invite', value: `Botun davet bağlantısını alın!\n > **Türler: __\`slash\` / \`mesaj\`__**`, inline: true },
        { name: 'Ping', value: `Botun gecikme süresini kontrol edin!\n > **Türler: __\`slash\` / \`mesaj\`__**`, inline: true },
      )
      .setTimestamp()
      .setFooter({
        text: `Talep Eden: ${interaction.user.username} | ` + config.copyright,
        iconURL: interaction.user.displayAvatarURL(),
      });

    const components = (state) => [
      new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
          .setCustomId("help-menu")
          .setPlaceholder("Bir Kategori Seçin")
          .setDisabled(state)
          .addOptions([
            {
              label: `Çekilişler`,
              value: `giveaway`,
              description: `Tüm çekiliş tabanlı komutları görüntüleyin!`,
              emoji: `🎉`,
            },
            {
              label: `Genel`,
              value: `general`,
              description: `Tüm genel bot komutlarını görüntüleyin!`,
              emoji: `⚙`,
            },
          ]),
      ),
    ];

    const initialMessage = await interaction.reply({ embeds: [embed], components: components(false) });

    const filter = (interaction) => interaction.user.id === interaction.member.id;

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      componentType: ComponentType.SelectMenu,
      idle: 300000,
      dispose: true,
    });

    collector.on('collect', (interaction) => {
      if (interaction.values[0] === "giveaway") {
        interaction.update({ embeds: [giveaway], components: components(false) }).catch((e) => {});
      } else if (interaction.values[0] === "general") {
        interaction.update({ embeds: [general], components: components(false) }).catch((e) => {});
      }
    });

    collector.on('end', (collected, reason) => {
      if (reason == "time") {
        initialMessage.edit({
          content: "Zaman aşımı! Lütfen tekrar deneyin.",
          components: [],
        });
      }
    });
  },
};
