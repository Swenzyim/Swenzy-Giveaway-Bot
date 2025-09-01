module.exports = (client, message) => {
    // Yazar bir bot ise geri dön
    if (message.author.bot) return;
  
    // Eğer mesaj prefix ile başlamıyorsa geri dön
    if (message.content.indexOf(client.config.prefix) !== 0) return;
  
    // Argümanlar ve komutları tanımlıyoruz
    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
  
    // Komut verisini client.commands Enmap'inden alıyoruz
    const cmd = client.commands.get(command);
  
    // Eğer komut yoksa geri dön
    if (!cmd) return;
  
    // Komutu çalıştır
    cmd.run(client, message, args);
};
