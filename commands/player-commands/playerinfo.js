const Discord = require("discord.js");
const prefix = "h:";
const { getPlayerId } = require("@nhl-api/players");
const { getPlayerLanding, formatHeight, positionName } = require("../../utils/nhlapi.js");
const { checkParams } = require("../error-handling/checkparams.js");

const playerInfo = async (message) => {
  try {
    var args = message.content.slice(prefix.length).trim().split(" ");
    args.shift();
    var player = args[0] + " " + args[1];
    const id = getPlayerId(player);
    if (!id) { checkParams(message, args); return; }

    const data = await getPlayerLanding(id);

    var embed = new Discord.MessageEmbed()
      .setColor(`#f2432c`)
      .setThumbnail(data.headshot)
      .setTitle(`${data.firstName.default} ${data.lastName.default} Info`)
      .setDescription(`
**Name:** ${data.firstName.default} ${data.lastName.default}
**Current Team:** ${data.fullTeamName.default}
**Position:** ${positionName(data.position)}
**Jersey Number:** ${data.sweaterNumber}
**Birthdate:** ${data.birthDate}
**Height:** ${formatHeight(data.heightInInches)}
**Weight:** ${data.weightInPounds} lbs
**Birth Country:** ${data.birthCountry}
**Shoots/Catches:** ${data.shootsCatches}
      `);
    message.channel.send(embed);
  } catch (e) {
    checkParams(message, args);
  }
};
module.exports = {
  playerInfo,
};
