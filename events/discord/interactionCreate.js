module.exports = (client, interaction) => {
  // Etkileşimin bir slash komutu olup olmadığını kontrol et
     if (interaction.isCommand()) {
 
  // Slash komut koleksiyonumuzdan komutu al
     const command = client.interactions.get(interaction.commandName);
 
 // Komut mevcut değilse hata mesajı döndür
     if (!command) return interaction.reply({
       content: "Bir şeyler ters gitti | Komut belki kaydedilmemiştir?",
       ephemeral: true
     });
 
     command.run(client, interaction);
   }
 }
 