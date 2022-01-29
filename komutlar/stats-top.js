const Discord = require("discord.js");
const Database = require("../Helpers/Database");
const vt = new Database("Database", "Voice");
const mdb = new Database("Database", "Message");
const moment = require("moment");
require("moment-duration-format");

// exports.onLoad = (client) => {};
/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array<String>} args 
 */
exports.run = async (client, message, args) => {
   
    const voiceData = vt.get(`stats.${message.guild.id}`) || undefined;
    const messageData = mdb.get(`stats.${message.guild.id}`) || undefined;

    let messageList = "Bilgi Bulunamadı.";
    if(messageData){
        messageList = Object.keys(messageData || {}).map(md => {
            return {
                Id: md,
                Total: Object.values(messageData[md].channels || {}).reduce((a, b) => a + b, 0)
            };
        }).sort((a, b) => b.Total - a.Total).splice(0, 10).map((user, index) => `\`${index + 1}.\` <@${user.Id}> \`${user.Total} message\``).join("\n║");    
    }

    let voiceList = "Bilgi Bulunamadı.";
    if(voiceData){
        voiceList = Object.keys(voiceData || {}).map(md => {
            return {
                Id: md,
                Total: Object.values(voiceData[md].channels || {}).reduce((a, b) => a + b, 0)
            };
        }).sort((a, b) => b.Total - a.Total).splice(0, 10).map((user, index) => `\`${index + 1}.\` <@${user.Id}> \`${moment.duration(user.Total).format("H [hours,] m [minutes] s [seconds]")}\``).join("\n║");
    }

    let embed = new Discord.MessageEmbed();
  embed.setColor('#00ffd0')
    .setFooter('by. MegsNaf')
    .setThumbnail(message.author.avatarURL({dynamic: true}))
    .setDescription(`Aşağıda Ses Ve Mesaj Aktiflik Sıralamasını Görebilirsiniz.`)
    .addField("Ses Sıralaması;", `
    \`\`\`En Çok Seste Duran Kişilerin Sıralaması;\`\`\`
    ╔═══════════◥◣❖◢◤════════════╗
    ║
    ║**${voiceList}**
    ║
    ╚═══════════◥◣❖◢◤════════════╝
    `)
    .addField("Sohbet Sıralaması;", `
   \`\`\`En Çok Mesaj Atan Kişilerin Sıralaması;\`\`\`
    ╔═══════════◥◣❖◢◤════════════╗
    ║
    ║**${messageList}**
    ║
    ╚═══════════◥◣❖◢◤════════════╝
    `);  
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["sunucu", "sunucu-bilgi", "sbilgi", "sb"],
  permLevel: 0,
}
exports.help = {
  name: 'ist-sıralama',
  description: 'Etiketlediğiniz rol hakkında bilgi alırsınız.',
  usage: 'rol-bilgi [rol]'
};