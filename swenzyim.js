const Discord = require("discord.js")
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const client = new Client({
  partials: [
    Partials.Message, // mesajlar için
    Partials.Channel, // metin kanalları için
    Partials.GuildMember, // sunucu üyeleri için
    Partials.Reaction, // mesaj tepkileri için
  ],
  intents: [
    GatewayIntentBits.Guilds, // sunucu ile ilgili işlemler için
    GatewayIntentBits.GuildInvites, // sunucu davet yönetimi için
    GatewayIntentBits.GuildMessages, // sunucu mesajları için
    GatewayIntentBits.GuildMessageReactions, // mesaj tepkileri için
    GatewayIntentBits.MessageContent, // mesaj içeriklerini etkinleştirmek için
  ],
});
const fs = require("fs");
const config = require("./config.json");
client.config = config;

// Discord çekilişlerini başlat
const { GiveawaysManager } = require("discord-giveaways");
client.giveawaysManager = new GiveawaysManager(client, {
  storage: "./storage/giveaways.json",
  default: {
    botsCanWin: false,
    embedColor: "#2F3136",
    reaction: "🎉",
    lastChance: {
      enabled: true,
      content: `🛑 **Son şans, katılmak için acele et!** 🛑`,
      threshold: 5000,
      embedColor: '#FF0000'
    }
  }
});
// Kodlayan: lurixgithub (YouTube)

/* Tüm olayları yükle (Discord tabanlı) */

fs.readdir("./events/discord", (_err, files) => {
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/discord/${file}`);
    let eventName = file.split(".")[0];
    console.log(`[Olay]   ✅  Yüklendi: ${eventName}`);
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/discord/${file}`)];
  });
});

/* Tüm olayları yükle (çekiliş tabanlı) */

fs.readdir("./events/giveaways", (_err, files) => {
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/giveaways/${file}`);
    let eventName = file.split(".")[0];
    console.log(`[Olay]   🎉 Yüklendi: ${eventName}`);
    client.giveawaysManager.on(eventName, (...file) => event.execute(...file, client)), delete require.cache[require.resolve(`./events/giveaways/${file}`)];
  })
})

// Komutlar koleksiyon olarak tanımlanıyor (mesaj komutları)
client.commands = new Discord.Collection();
/* Tüm komutları yükle */
fs.readdir("./commands/", (_err, files) => {
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    client.commands.set(commandName, {
      name: commandName,
      ...props
    });
    console.log(`[Komut] ✅  Yüklendi: ${commandName}`);
  });
});

// Etkileşimler koleksiyon olarak tanımlanıyor (slash komutları)
client.interactions = new Discord.Collection();
// Slash komutları kaydı için boş bir dizi oluşturuluyor
client.register_arr = []
/* Tüm slash komutları yükle */
fs.readdir("./slash/", (_err, files) => {
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./slash/${file}`);
    let commandName = file.split(".")[0];
    client.interactions.set(commandName, {
      name: commandName,
      ...props
    });
    client.register_arr.push(props)
  });
});

// İstemci ile giriş yap
client.login(config.token);
