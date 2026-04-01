const Discord = require("discord.js");
const prefix = "h:";
const { getPlayerId } = require("@nhl-api/players");
const axios = require("axios");
const { checkParams } = require("../error-handling/checkparams.js");

const statsByYear = async (message) => {
  try {
    var args = message.content.slice(prefix.length).trim().split(" ");
    args.shift();
    var player = args[0] + " " + args[1];
    const id = getPlayerId(player);
    const year = args[2];
    if (!id || !year) {
      checkParams(message, args);
      return;
    }
    var response = await axios.get(
      `https://statsapi.web.nhl.com/api/v1/people/${id}/stats?stats=statsSingleSeason&season=${year}`
    );
    var data = await response.data;
    var response2 = await axios.get(
      `https://statsapi.web.nhl.com/api/v1/people/${id}`
    );
    var human = await response2.data;
    if (human["people"][0]["primaryPosition"]["abbreviation"] == "G") {
      var embed = new Discord.MessageEmbed()
        .setColor(`#f2432c`)
        .setThumbnail(
          `http://nhl.bamcontent.com/images/headshots/current/168x168/${id}.jpg`
        )
        .setTitle(`${human["people"][0]["fullName"]} ${year} Stats`)
        .setDescription(`
**Wins:** ${data["stats"][0]["splits"][0]["stat"]["wins"]}
**Losses:** ${data["stats"][0]["splits"][0]["stat"]["losses"]}
**Overtime Losses:** ${data["stats"][0]["splits"][0]["stat"]["ot"]}
**Shutouts:** ${data["stats"][0]["splits"][0]["stat"]["shutouts"]}
**Saves:** ${data["stats"][0]["splits"][0]["stat"]["saves"]}
**Save Percentage:** ${data["stats"][0]["splits"][0]["stat"]["savePercentage"] ? data["stats"][0]["splits"][0]["stat"]["savePercentage"].toFixed(3) : "undefined"}%
**Goals Against:** ${data["stats"][0]["splits"][0]["stat"]["goalsAgainst"]}
**Goals Against Average:** ${data["stats"][0]["splits"][0]["stat"]["goalAgainstAverage"] ? data["stats"][0]["splits"][0]["stat"]["goalAgainstAverage"].toFixed(2) : "undefined"}
**Games:** ${data["stats"][0]["splits"][0]["stat"]["games"]}
**Games Started:** ${data["stats"][0]["splits"][0]["stat"]["gamesStarted"]}
    `);
      message.channel.send(embed);
    } else {
      var embed = new Discord.MessageEmbed()
        .setColor(`#f2432c`)
        .setThumbnail(
          `http://nhl.bamcontent.com/images/headshots/current/168x168/${id}.jpg`
        )
        .setTitle(`${human["people"][0]["fullName"]} ${year} Stats`)
        .setDescription(`
**Goals:** ${data["stats"][0]["splits"][0]["stat"]["goals"]}
**Assists:** ${data["stats"][0]["splits"][0]["stat"]["assists"]}
**Points:** ${data["stats"][0]["splits"][0]["stat"]["points"]}
**Shots Taken:** ${data["stats"][0]["splits"][0]["stat"]["shots"]}
**Shooting Percentage:** ${data["stats"][0]["splits"][0]["stat"]["shotPct"] ? data["stats"][0]["splits"][0]["stat"]["shotPct"].toFixed(2) : "undefined"}%
**Faceoff Percentage:** ${data["stats"][0]["splits"][0]["stat"]["faceOffPct"] ? data["stats"][0]["splits"][0]["stat"]["faceOffPct"].toFixed(2) : "undefined"}%
**Shots Blocked:** ${data["stats"][0]["splits"][0]["stat"]["blocked"]}
**Plus-Minus:** ${data["stats"][0]["splits"][0]["stat"]["plusMinus"]}
**Shifts:** ${data["stats"][0]["splits"][0]["stat"]["shifts"]}
**TOI Per Game:** ${data["stats"][0]["splits"][0]["stat"]["timeOnIcePerGame"]}
		`);
      message.channel.send(embed);
    }
  } catch (e) {
    checkParams(message, args);
  }
}
module.exports = {
  statsByYear
};
