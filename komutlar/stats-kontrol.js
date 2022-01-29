const Discord = require("discord.js");
const Database = require("../Helpers/Database");
const vt = new Database("Database", "Voice");
const mdb = new Database("Database", "Message");
const moment = require("moment");
const Ashira = new Set();
require("moment-duration-format");
// exports.onLoad = (client) => {};
/**
 *
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array<String>} args
 */
exports.run = async (client, message, args) => {
  let kişi = message.mentions.users.first() || message.author;
  let mentionMember = message.guild.members.cache.get(kişi.id);
  let voiceData = vt.get(`stats.${message.guild.id}.${kişi.id}`) || {
    voice: 0,
    channels: {}
  };
  let messageData = mdb.get(`stats.${message.guild.id}.${kişi.id}`) || {
    messages: 0,
    channels: {}
  };

  let voiceList = Object.keys(voiceData.channels)
    .map(vd => {
      return {
        Id: vd,
        Total: voiceData.channels[vd]
      };
    })
    .sort((a, b) => b.Total - a.Total);

  let messageList = Object.keys(messageData.channels)
    .map(md => {
      return {
        Id: md,
        Total: messageData.channels[md]
      };
    })
    .sort((a, b) => b.Total - a.Total);

  voiceList = voiceList.length > 10 ? voiceList.splice(0, 10) : voiceList;
  voiceList = voiceList
    .map(
      (vd, index) =>
        `\`${index + 1}.\` ${
          client.channels.cache.has(vd.Id)
            ? client.channels.cache.get(vd.Id).toString()
            : "#deleted-channel"
        }: \`${moment
          .duration(vd.Total)
          .format("H [hours,] m [minutes] s [seconds]")}\``
    )
    .join("\n║");
  messageList =
    messageList.length > 10 ? messageList.splice(0, 10) : messageList;
  messageList = messageList
    .map(
      (md, index) =>
        `\`${index + 1}.\` ${
          client.channels.cache.has(md.Id)
            ? client.channels.cache.get(md.Id).toString()
            : "#deleted-channel"
        }: \`${md.Total} message\``
    )
    .join("\n║");

  let embed = new Discord.MessageEmbed();
  embed
    .setColor("#00ffd0")
    .setFooter("")
    .setThumbnail(kişi.avatarURL({ dynamic: true }))
    .addField(
      "Kullanıcı Bilgileri;",
      ` 
    ╔═══════════◥◣❖◢◤════════════╗
    ║\`ID:\` **${kişi.id}**
    ║\`Rolleri:\` ${
      mentionMember.roles.cache.size >= 7
        ? "Kişinin 7 den fazla rolü var..."
        : mentionMember.roles.cache.map(role => role.toString())
    }
    ║\`Kullanıcı Adı:\` **${mentionMember.displayName}**
    ╚═══════════◥◣❖◢◤════════════╝
    `
    )
    .addField(
      "Ses Aktifliği;",
      `
    \`\`\`En Çok Aktif Olduğu Kanallar Ve Süreleri;\`\`\`
    ╔═══════════◥◣❖◢◤════════════╗
    ║
    ║**${voiceList}**
    ║
    ╚═══════════◥◣❖◢◤════════════╝
    `
    )
    .addField(
      "Sohbet Aktifliği;",
      `
   \`\`\`En Çok Sohbet Ettiği Kanallar Ve Mesaj Sayısı;\`\`\`
    ╔═══════════◥◣❖◢◤════════════╗
    ║
    ║**${messageList}**
    ║
    ╚═══════════◥◣❖◢◤════════════╝
    `
    );

  message.channel.send(embed);

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};
exports.help = {
  name: "ist",
  description: "Etiketlediğiniz rol hakkında bilgi alırsınız.",
  usage: "rol-bilgi [rol]"
};
