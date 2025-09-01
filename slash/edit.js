const { ApplicationCommandOptionType } = require('discord.js');
const ms = require("ms");

module.exports = {
  name: 'edit',
  description: '🎉 Bir çekilişi düzenle',

  options: [
    {
      name: 'giveaway',
      description: 'Düzenlenecek çekiliş (mesaj ID)',
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: 'duration',
      description: 'Çekiliş süresini ayarla. Örn: 1h, çekilişi bir saat sonra bitirecek şekilde ayarlar!',
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: 'winners',
      description: 'Çekilişte kaç kazanan olmalı',
      type: ApplicationCommandOptionType.Integer,
      required: true
    },
    {
      name: 'prize',
      description: 'Çekiliş ödülü ne olmalı',
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],

  run: async (client, interaction) => {

    // Eğer üyenin yeterli yetkisi yoksa
    if (!interaction.member.permissions.has('ManageMessages') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
      return interaction.reply({
        content: ':x: Çekilişleri düzenlemek için "mesajları yönet" yetkisine sahip olmalısınız.',
        ephemeral: true
      });
    }

    const gid = interaction.options.getString('giveaway');
    const time = interaction.options.getString('duration');
    const winnersCount = interaction.options.getInteger('winners');
    const prize = interaction.options.getString('prize');
    let duration;

    if (time.startsWith("-")) {
      duration = -ms(time.substring(1));
    } else {
      duration = ms(time);
    }

    if (isNaN(duration)) {
      return interaction.reply({
        content: ":x: Lütfen geçerli bir süre seçin!",
        ephemeral: true,
      });
    }

    await interaction.deferReply({
      ephemeral: true
    });

    // Çekilişi düzenle
    try {
      await client.giveawaysManager.edit(gid, {
        newWinnerCount: winnersCount,
        newPrize: prize,
        addTime: time
      });
    } catch (e) {
      return interaction.editReply({
        content: `Belirtilen mesaj ID'siyle eşleşen bir çekiliş bulunamadı: \`${gid}\``,
        ephemeral: true
      });
    }

    interaction.editReply({
      content: `Bu çekiliş başarıyla düzenlendi! 🎉`,
      ephemeral: true
    });
  }
};
