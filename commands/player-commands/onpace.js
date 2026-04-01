const Discord = require("discord.js");
const prefix = "h:";
const { getPlayerId } = require("@nhl-api/players");
const { getPlayerLanding, isGoalie, calculateOnPace, calculateOnPaceRate } = require("../../utils/nhlapi.js");
const { checkParams } = require("../error-handling/checkparams.js");

const onPace = async (message) => {
  try {
    var args = message.content.slice(prefix.length).trim().split(" ");
    args.shift();
    var player = args[0] + " " + args[1];
    const id = getPlayerId(player);
    if (!id) { checkParams(message, args); return; }

    const data = await getPlayerLanding(id);
    const stats = data.featuredStats.regularSeason.subSeason;
    const name = `${data.firstName.default} ${data.lastName.default}`;
    const gp = stats.gamesPlayed;

    if (!gp) {
      message.channel.send(`${name} has no games played this season.`);
      return;
    }

    if (isGoalie(data.position)) {
      var embed = new Discord.MessageEmbed()
        .setColor(`#f2432c`)
        .setThumbnail(data.headshot)
        .setTitle(`${name} On-Pace Season Stats`)
        .setDescription(`
**Wins:** ${calculateOnPace(stats.wins, gp)}
**Losses:** ${calculateOnPace(stats.losses, gp)}
**OT Losses:** ${calculateOnPace(stats.otLosses, gp)}
**Shutouts:** ${calculateOnPace(stats.shutouts, gp)}
**Games Played:** 82
**Games Started:** ${calculateOnPace(stats.gamesStarted, gp)}
        `);
    } else {
      var embed = new Discord.MessageEmbed()
        .setColor(`#f2432c`)
        .setThumbnail(data.headshot)
        .setTitle(`${name} On-Pace Season Stats`)
        .setDescription(`
**Goals:** ${calculateOnPace(stats.goals, gp)}
**Assists:** ${calculateOnPace(stats.assists, gp)}
**Points:** ${calculateOnPace(stats.points, gp)}
**Shots:** ${calculateOnPace(stats.shots, gp)}
**Plus-Minus:** ${calculateOnPace(stats.plusMinus, gp)}
**PIM:** ${calculateOnPace(stats.pim, gp)}
**Power Play Goals:** ${calculateOnPace(stats.powerPlayGoals, gp)}
**Game-Winning Goals:** ${calculateOnPace(stats.gameWinningGoals, gp)}
        `);
    }
    message.channel.send(embed);
  } catch (e) {
    checkParams(message, args);
  }
};
module.exports = {
  onPace,
};
