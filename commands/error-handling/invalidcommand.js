const Discord = require("discord.js");

const invalidCommand = (message) => {
  var embed = new Discord.MessageEmbed().setColor(`#f2432c`).setDescription(`
    Invalid command. Check \`h:help\` for valid commands.
  `);
  message.channel.send(embed);
};

module.exports = {
  invalidCommand,
};
