const Discord = require("discord.js");
const prefix = "h:";
const { checkParams } = require("../error-handling/checkparams.js");

const sayMessage = (message) => {
  var args = message.content.slice(prefix.length + 3).trim().split(" "); 
  let botmessage = args.join(" ");

  if (botmessage) {
    message.delete();
    message.channel.send(botmessage);
  }
  if (!botmessage) {
    message.delete();
    checkParams(message, args);
  }
};

module.exports = {
  sayMessage,
};
