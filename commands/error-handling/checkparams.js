const Discord = require("discord.js");

const checkParams = (message) => {
  var embed = new Discord.MessageEmbed().setColor(`#f2432c`).setDescription(`
    Check your parameters!
  `);
  message.channel.send(embed);
};

module.exports = {
  checkParams,
};
