const Discord = require("discord.js");
const prefix = "h:";
const { getPlayerId } = require("@nhl-api/players");
const { getPlayerLanding, isGoalie } = require("../../utils/nhlapi.js");
const { checkParams } = require("../error-handling/checkparams.js");

const statsByYear = async (message) => {
  try {
    var args = message.content.slice(prefix.length).trim().split(" ");
    args.shift();
    var player = args[0] + " " + args[1];
    const id = getPlayerId(player);
    const year = args[2];
    if (!id || !year) { checkParams(message, args); return; }

    const data = await getPlayerLanding(id);
    const name = `${data.firstName.default} ${data.lastName.default}`;

    // Find the season in seasonTotals, filter to NHL regular season only
    const seasonEntries = data.seasonTotals.filter(
      (s) => s.season === parseInt(year) && s.gameTypeId === 2 && s.leagueAbbrev === "NHL"
    );

    if (seasonEntries.length === 0) {
      message.channel.send(`No NHL stats found for ${name} in ${year}.`);
      return;
    }

    // Sum stats if player was on multiple teams that season
    const stats = seasonEntries.reduce((acc, s) => {
      for (const key of Object.keys(s)) {
        if (typeof s[key] === "number") acc[key] = (acc[key] || 0) + s[key];
      }
      return acc;
    }, {});
    stats.gamesPlayed = seasonEntries.reduce((sum, s) => sum + s.gamesPlayed, 0);

    if (isGoalie(data.position)) {
      // Recalculate rate stats for goalies
      const savePctg = seasonEntries.length === 1 ? seasonEntries[0].savePctg : null;
      const gaa = seasonEntries.length === 1 ? seasonEntries[0].goalsAgainstAvg : null;
      var embed = new Discord.MessageEmbed()
        .setColor(`#f2432c`)
        .setThumbnail(data.headshot)
        .setTitle(`${name} ${year} Stats`)
        .setDescription(`
**Wins:** ${stats.wins}
**Losses:** ${stats.losses}
**OT Losses:** ${stats.otLosses}
**Shutouts:** ${stats.shutouts}
**Save Percentage:** ${savePctg ? savePctg.toFixed(3) : "N/A"}
**Goals Against Average:** ${gaa ? gaa.toFixed(2) : "N/A"}
**Games Played:** ${stats.gamesPlayed}
**Games Started:** ${stats.gamesStarted}
        `);
    } else {
      var embed = new Discord.MessageEmbed()
        .setColor(`#f2432c`)
        .setThumbnail(data.headshot)
        .setTitle(`${name} ${year} Stats`)
        .setDescription(`
**Goals:** ${stats.goals}
**Assists:** ${stats.assists}
**Points:** ${stats.points}
**Shots:** ${stats.shots}
**Plus-Minus:** ${stats.plusMinus}
**PIM:** ${stats.pim}
**Power Play Goals:** ${stats.powerPlayGoals}
**Game-Winning Goals:** ${stats.gameWinningGoals}
        `);
    }
    message.channel.send(embed);
  } catch (e) {
    checkParams(message, args);
  }
};
module.exports = {
  statsByYear,
};
