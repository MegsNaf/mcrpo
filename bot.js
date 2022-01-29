const Discord = require('discord.js');
let _client = new Discord.Client();
if (ayarlar.Private_Server === true) {
    _client = new Discord.Client({
        fetchAllMembers: true
    });
}
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const fs = require('fs');
const { promisify } = require("util");
require('./util/eventLoader')(client);


var prefix = ayarlar.prefix;

const log = message => {
    console.log(`${message}`);
};


console.log("--------------------------------");
console.log("Eventler Yükleniyor");
fs.readdirSync("./Events", { encoding: "utf-8" }).filter(file => file.endsWith(".js")).forEach(file => {
    let prop = require(`./Events/${file}`);
    client.on(prop.conf.event, prop.execute);
    console.log(`[EVENT] ${file} is loaded.`);
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
    if (err) console.error(err);
    log(`${files.length} komut yüklenecek.`);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        log(`Yüklenen komut: ${props.help.name}.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});




client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};




client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.elevation = message => {
    if (!message.guild) {
        return;
    }
    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === ayarlar.sahip) permlvl = 4;
    return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on('warn', e => {
    console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
    console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(ayarlar.token);

const gamedig = require("gamedig");

var serverIP = "193.164.7.184";
var channelID = "920225524574453770";

const CodAre = new Discord.MessageEmbed()
.setAuthor("Mercia Roleplay Sunucu İstatistik","https://i.hizliresim.com/147yq49.png")
.setColor("#FF7F00")
.setThumbnail("https://i.hizliresim.com/147yq49.png");
setInterval(() => {
gamedig.query({
  type: "mtasa",
  host: serverIP
})
.then(state => {
  CodAre
  .setDescription(`
     **Sunucu Durumu:** :green_circle:
     **Sunucu İsim:** ${state.name}
     **Sunucu IP:** mtasa://193.164.7.184:22003
     **Oyuncu Sayısı:** ${state.raw.numplayers}/${state.maxplayers}
     **Sunucu Pingi:** ${state.ping}
    `)
   client.channels.cache.get(channelID).send(CodAre);
})
  .catch(e => {
  CodAre
  .setDescription(`
    **Sunucu Durumu:** :red_circle:
    **Sunucu IP:** ${serverIP}
    Sunucuya ulaşılamıyor veya veri çekilemiyor.
    `)
  client.channels.cache.get(channelID).send(CodAre);
});
},900000);


client.on("voiceStateUpdate", (old, neww) => {
  let ses = old.voiceChannel;
  if (!neww.voiceChannel) {
    if (neww.id === client.user.id) {
      console.log(`BOT: Bot yeniden başlatılıyor...`);
      process.exit(0);
      console.clear();
    }
  }
});
