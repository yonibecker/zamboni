const Discord = require("discord.js");
const logo = process.env.BASE_URL ? `${process.env.BASE_URL}/zamboni.png` : undefined;

const zamboniMaintenance = (message) => {
  var embed = new Discord.MessageEmbed()
    .setColor(`#f2432c`)
    .setAuthor("Zamboni Maintenance Times", logo).setDescription(`
Zamboni plans to be updated during the times below. Please note all times are in PST and you may experience bugs/glitches during maintenance.

**Time:**
**Reason:**
    `);
  message.channel.send(embed);
};
module.exports = {
  zamboniMaintenance,
};
