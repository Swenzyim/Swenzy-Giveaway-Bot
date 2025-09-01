const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ping',
    description: '🏓 Pingimi kontrol et!',
    run: async (client, interaction) => {
      let pembed = new EmbedBuilder()
		  .setColor('#2F3136')	
		  .setTitle('Client Ping')
		  .addFields({ name: '**Gecikme**', 
                   value: `\`${Date.now() - interaction.createdTimestamp}ms\``
                 })
		  .addFields({ name: '**API Gecikmesi**', 
                   value: `\`${Math.round(client.ws.ping)}ms\``
                 })
		  .setTimestamp()
                  .setFooter({
                     text: `${interaction.user.username}`,
                     iconURL: interaction.user.displayAvatarURL()
                  })
        interaction.reply({
          embeds: [pembed]
        });
    },
};
