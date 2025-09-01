const Discord = require("discord.js")
const { ApplicationCommandOptionType } = require("discord.js");
const messages = require("../utils/message");
const ms = require("ms")
module.exports = {
  name: 'start',
  description: '🎉 Bir çekiliş başlat',

  options: [
    {
      name: 'duration',
      description: 'Çekilişin ne kadar süreceğini belirleyin. Örnek değerler: 1m, 1h, 1d',
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: 'winners',
      description: 'Çekilişin kaç kazananı olacağını belirleyin',
      type: ApplicationCommandOptionType.Integer,
      required: true
    },
    {
      name: 'prize',
      description: 'Çekilişin ödülünü belirleyin',
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: 'channel',
      description: 'Çekilişi başlatmak için kanal seçin',
      type: ApplicationCommandOptionType.Channel,
      required: true
    },
    {
      name: 'bonusrole',
      description: 'Bonus giriş hakkı alacak rolü seçin',
      type: ApplicationCommandOptionType.Role,
      required: false
    },
    {
      name: 'bonusamount',
      description: 'Rolün alacağı bonus giriş sayısını belirleyin',
      type: ApplicationCommandOptionType.Integer,
      required: false
    },
    {
      name: 'invite',
      description: 'Çekilişe katılım şartı olarak eklemek istediğiniz sunucu davet linki',
      type: ApplicationCommandOptionType.String,
      required: false
    },
    {
      name: 'role',
      description: 'Çekilişe katılım şartı olarak eklemek istediğiniz rol',
      type: ApplicationCommandOptionType.Role,
      required: false
    },
  ],

  run: async (client, interaction) => {

    // Eğer üyenin yeterli izinleri yoksa
    if (!interaction.member.permissions.has('ManageMessages') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
      return interaction.reply({
        content: ':x: Çekiliş başlatabilmek için mesajları yönetme iznine sahip olmalısınız.',
        ephemeral: true
      });
    }

    const giveawayChannel = interaction.options.getChannel('channel');
    const giveawayDuration = interaction.options.getString('duration');
    const giveawayWinnerCount = interaction.options.getInteger('winners');
    const giveawayPrize = interaction.options.getString('prize');

    if (!giveawayChannel.isTextBased()) {
      return interaction.reply({
        content: ':x: Lütfen bir metin kanalı seçin!',
        ephemeral: true
      });
    }
   if(isNaN(ms(giveawayDuration))) {
    return interaction.reply({
      content: ':x: Lütfen geçerli bir süre seçin!',
      ephemeral: true
    });
  }
    if (giveawayWinnerCount < 1) {
      return interaction.reply({
        content: ':x: Lütfen geçerli bir kazanan sayısı seçin! 1 veya daha büyük olmalı.',
      })
    }

    const bonusRole = interaction.options.getRole('bonusrole')
    const bonusEntries = interaction.options.getInteger('bonusamount')
    let rolereq = interaction.options.getRole('role')
    let invite = interaction.options.getString('invite')

    if (bonusRole) {
      if (!bonusEntries) {
        return interaction.reply({
          content: `:x: ${bonusRole} rolü için kaç bonus giriş hakkı verileceğini belirtmelisiniz!`,
          ephemeral: true
        });
      }
    }


    await interaction.deferReply({ ephemeral: true })
    let reqinvite;
    if (invite) {
      let invitex = await client.fetchInvite(invite)
      let client_is_in_server = client.guilds.cache.get(
        invitex.guild.id
      )
      reqinvite = invitex
      if (!client_is_in_server) {
          const gaEmbed = {
            author: {
              name: client.user.username,
              iconURL: client.user.displayAvatarURL() 
            },
            title: "Sunucu Kontrolü!",
            url: "https://www.youtube.com/@luriXgithub",
            description:
              "Yeni bir sunucu görüyorum! Benim orada olduğumdan emin misiniz? Beni oraya davet etmeniz gerek!",
            timestamp: new Date(),
            footer: {
              iconURL: client.user.displayAvatarURL(),
              text: "Sunucu Kontrolü"
            }
          }  
        return interaction.editReply({ embeds: [gaEmbed]})
      }
    }

    if (rolereq && !invite) {
      messages.inviteToParticipate = `**🎉 ile tepki vererek katılın!**\n>>> - Bu çekilişe sadece ${rolereq} rolüne sahip üyeler katılabilir!`
    }
    if (rolereq && invite) {
      messages.inviteToParticipate = `**🎉 ile tepki vererek katılın!**\n>>> - Bu çekilişe sadece ${rolereq} rolüne sahip üyeler katılabilir!\n- Katılmak için [bu sunucuya](${invite}) katılmanız gerekiyor!`
    }
    if (!rolereq && invite) {
      messages.inviteToParticipate = `**🎉 ile tepki vererek katılın!**\n>>> - Katılmak için [bu sunucuya](${invite}) katılmanız gerekiyor!`
    }


    // çekilişi başlat
    client.giveawaysManager.start(giveawayChannel, {
      // Çekiliş süresi
      duration: ms(giveawayDuration),
      // Çekiliş ödülü
      prize: giveawayPrize,
      // Kazanan sayısı
      winnerCount: parseInt(giveawayWinnerCount),
      // Kim tarafından düzenlendi
      hostedBy: client.config.hostedBy ? interaction.user : null,
      // Bonus Giriş Eğer Verildiyse
      bonusEntries: [
        {
          // Bonus giriş hakkı verilen üyeler
          bonus: new Function('member', `return member.roles.cache.some((r) => r.name === \'${bonusRole ?.name}\') ? ${bonusEntries} : null`),
          cumulative: false
        }
      ],
      // Mesajlar
      messages,
      extraData: {
        server: reqinvite == null ? "null" : reqinvite.guild.id,
        role: rolereq == null ? "null" : rolereq.id,
      }
    });
    interaction.editReply({
      content:
        `${giveawayChannel} kanalında çekiliş başlatıldı!`,
      ephemeral: true
    })

    if (bonusRole) {
      let giveaway = new Discord.EmbedBuilder()
        .setAuthor({ name: `Bonus Giriş Duyurusu!` })
        .setDescription(
          `**${bonusRole}** rolü bu çekilişte **${bonusEntries}** ekstra giriş hakkı kazanıyor!`
        )
        .setColor("#2F3136")
        .setTimestamp();
      giveawayChannel.send({ embeds: [giveaway] });
    }

  }

};
