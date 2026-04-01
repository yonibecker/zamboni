const Discord = require("discord.js");
const prefix = "h:";
const { getPlayerId } = require("@nhl-api/players");
const { getPlayerLanding, isGoalie } = require("../../utils/nhlapi.js");
const { checkParams } = require("../error-handling/checkparams.js");

const careerStats = async (message) => {
  try {
    var args = message.content.slice(prefix.length).trim().split(" ");
    args.shift();
    var player = args[0] + " " + args[1];
    const id = getPlayerId(player);
    if (!id) { checkParams(message, args); return; }

    const data = await getPlayerLanding(id);
    const stats = data.careerTotals.regularSeason;
    const name = `${data.firstName.default} ${data.lastName.default}`;

    if (isGoalie(data.position)) {
      var embed = new Discord.MessageEmbed()
        .setColor(`#f2432c`)
        .setThumbnail(data.headshot)
        .setTitle(`${name} Career Stats`)
        .setDescription(`
**Wins:** ${stats.wins}
**Losses:** ${stats.losses}
**OT Losses:** ${stats.otLosses}
**Shutouts:** ${stats.shutouts}
**Save Percentage:** ${stats.savePctg ? stats.savePctg.toFixed(3) : "N/A"}
**Goals Against Average:** ${stats.goalsAgainstAvg ? stats.goalsAgainstAvg.toFixed(2) : "N/A"}
**Games Played:** ${stats.gamesPlayed}
**Games Started:** ${stats.gamesStarted}
        `);
    } else {
      var embed = new Discord.MessageEmbed()
        .setColor(`#f2432c`)
        .setThumbnail(data.headshot)
        .setTitle(`${name} Career Stats`)
        .setDescription(`
**Goals:** ${stats.goals}
**Assists:** ${stats.assists}
**Points:** ${stats.points}
**Shots:** ${stats.shots}
**Shooting Percentage:** ${stats.shootingPctg ? (stats.shootingPctg * 100).toFixed(2) : "N/A"}%
**Plus-Minus:** ${stats.plusMinus}
**PIM:** ${stats.pim}
**Power Play Goals:** ${stats.powerPlayGoals}
**Game-Winning Goals:** ${stats.gameWinningGoals}
**Avg TOI:** ${stats.avgToi}
        `);
    }
    message.channel.send(embed);
  } catch (e) {
    checkParams(message, args);
  }
};
module.exports = {
  careerStats,
};
