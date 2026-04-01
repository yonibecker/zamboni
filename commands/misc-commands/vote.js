const Discord = require("discord.js");
const logo = process.env.BASE_URL ? `${process.env.BASE_URL}/zamboni.png` : undefined;

function voteForZamboni(message) {
  var embed = new Discord.MessageEmbed()
    .setColor(`#f2432c`)
    .setAuthor("Vote For Zamboni", logo).setDescription(`
Check out Zamboni's page [here](https://top.gg/bot/816064566412836904) and click [this link](https://top.gg/bot/816064566412836904/vote) to vote right away!
    `);
  message.channel.send(embed);
}
module.exports = {
  voteForZamboni
};
