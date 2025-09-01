const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, ComponentType } = require("discord.js");
const config = require('../config.json');

module.exports.run = async (client, message, args) => {

  const embed = new EmbedBuilder()
    .setTitle(`${client.user.username} Komutları`)
    .setColor('#2F3136')
    .setDescription('**Lütfen tüm komutları görmek için bir kategori seçin**')
    .addFields({ name: `Bağlantılar:`, value: `- [Youtube Kanalı](https://www.youtube.com/@swenzyimm)\n- [Discord Sunucusu](https://discord.gg/excode)\n- [GitHub](https://github.com/Swenzyim)`, inline: true })
    .setTimestamp()
    .setFooter({
      text: `Talep Eden: ${message.author.username} | ` + config.copyright, 
      iconURL: message.author.displayAvatarURL()
    });

  const giveaway = new EmbedBuilder()
    .setTitle("Kategoriler » Çekiliş")
    .setColor('#2F3136')
    .setDescription("```yaml\nİşte çekiliş komutları:```")
    .addFields(
      { name: 'Create / Start'  , value: `Sunucunuzda bir çekiliş başlatın!\n > **Türler: __\`slash\` / \`message\`__**`, inline: true },
      { name: 'Drop' , value: `Bir drop çekilişi başlatın!\n > **Türler: __\`slash\` / \`message\`__**`, inline: true },
      { name: 'Edit' , value: `Zaten aktif bir çekilişi düzenleyin!\n > **Türler: __\`slash\` / \`message\`__**`, inline: true },
      { name: 'End' , value: `Zaten aktif bir çekilişi sonlandırın!\n > **Türler: __\`slash\` / \`message\`__**`, inline: true },
      { name: 'List' , value: `Bu sunucudaki tüm aktif çekilişleri listeleyin!\n > **Türler: __\`slash\` / \`message\`__**`, inline: true },
      { name: 'Pause' , value: `Zaten aktif bir çekilişi duraklatın!\n > **Tür: __\`slash\`__**`, inline: true },
      { name: 'Reroll' , value: `Sonlandırılmış bir çekilişi yeniden çekin!\n > **Türler: __\`slash\` / \`message\`__**`, inline: true },
      { name: 'Resume' , value: `Duraklatılmış bir çekilişi tekrar başlatın!\n > **Tür: __\`slash\`__**`, inline: true },
    )
    .setTimestamp()
    .setFooter({
      text: `Talep Eden: ${message.author.username} | ` + config.copyright, 
      iconURL: message.author.displayAvatarURL()
    });

  const general = new EmbedBuilder()
    .setTitle("Kategoriler » Genel")
    .setColor('#2F3136')
    .setDescription("```yaml\nİşte genel bot komutları:```")
    .addFields(
      { name: 'Yardım'  , value: `Bu botun tüm komutlarını gösterir!\n > **Türler: __\`slash\` / \`message\`__**`, inline: true },
      { name: 'Davet' , value: `Botun davet bağlantısını alın!\n > **Türler: __\`slash\` / \`message\`__**`, inline: true },
      { name: 'Ping' , value: `Botun websocket gecikmesini kontrol edin!\n > **Türler: __\`slash\` / \`message\`__**`, inline: true },
    )
    .setTimestamp()
    .setFooter({
      text: `Talep Eden: ${message.author.username} | ` + config.copyright, 
      iconURL: message.author.displayAvatarURL()
    });

  const components = (state) => [
    new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId("help-menu")
        .setPlaceholder("Lütfen Bir Kategori Seçin")
        .setDisabled(state)
        .addOptions([
          {
            label: `Çekilişler`,
            value: `giveaway`,
            description: `Tüm çekiliş komutlarını görün!`,
            emoji: `🎉`
          },
          {
            label: `Genel`,
            value: `general`,
            description: `Tüm genel bot komutlarını görün!`,
            emoji: `⚙`
          }
        ])
    ),
  ];

  const initialMessage = await message.reply({ embeds: [embed], components: components(false) });

  const filter = (interaction) => interaction.user.id === message.author.id;

  const collector = message.channel.createMessageComponentCollector({
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

  collector.on("end", (collected, reason) => {
    if (reason == "time") {
      initialMessage.edit({
        content: "Collector Sonlandırıldı, Tekrar Deneyin!",
        components: [],
      });
    }
  });
};
