const Discord = require("discord.js");
const prefix = "h:";
const { getPlayerId } = require("@nhl-api/players");
const axios = require("axios");
const { checkParams } = require("../error-handling/checkparams.js");

const playerInfo = async (message) => {
  try {
    var args = message.content.slice(prefix.length).trim().split(" ");
    args.shift();
    var player = args[0] + " " + args[1];
    const id = getPlayerId(player);
    var response = await axios.get(
      `https://statsapi.web.nhl.com/api/v1/people/${id}/`
    );
    var data = await response.data;

    var embed = new Discord.MessageEmbed()
      .setColor(`#f2432c`)
      .setThumbnail(
        `http://nhl.bamcontent.com/images/headshots/current/168x168/${id}.jpg`
      )
      .setTitle(`${data["people"][0]["fullName"]} Info`).setDescription(`
**Name:** ${data["people"][0]["fullName"]}
**Current Team** ${data["people"][0]["currentTeam"]["name"]}
**Position:** ${data["people"][0]["primaryPosition"]["name"]}
**Jersey Number:** ${data["people"][0]["primaryNumber"]}
**Birthdate:** ${data["people"][0]["birthDate"]}
**Age:** ${data["people"][0]["currentAge"]}
**Height:** ${data["people"][0]["height"]}
**Weight:** ${data["people"][0]["weight"]}
**Birth Country:** ${data["people"][0]["nationality"]}
  `);
    message.channel.send(embed);
  } catch (e) {
    checkParams(message, args);
  }
};
module.exports = {
  playerInfo,
};
