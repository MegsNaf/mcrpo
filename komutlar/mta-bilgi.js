const Discord = require('discord.js');
const Gamedig = require('gamedig');
exports.run = (client, message, args) => {
if(!args[0]) return message.channel.send('Bir IP girmelisin!') ;
Gamedig.query({
type: 'mtasa',
host: args[0]
}).then((state) => {
const CodAre = new Discord.MessageEmbed()
.setColor('BLACK')
.setTitle('MTA Sunucu İstatistikleri')
.addField('Sunucu Adı: ', state.name)
.addField('Sunucu Host/IP: ', args[0])
.addField('Aktif Oyuncu Sayısı: ', state.raw.numplayers + '/' + state.maxplayers)
.addField('Gecikme Süresi (ms): ', state.ping)
message.channel.send(CodAre)
}).catch(err => message.channel.send('Sunucu Kapalı veya bu IPde bir sunucu bulunamadı!'))
};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['d'],
  permLevel: 0
};

exports.help = {
  description: 'Mesajınızı botun bulunduğu sunucudaki insanlara duyurur.',
  name: 'mta',
  usage: 'dmduyuru [mesaj]'
};
