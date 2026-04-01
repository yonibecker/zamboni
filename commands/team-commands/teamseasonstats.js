const Discord = require("discord.js");
const prefix = "h:";
const { getTeamAbbreviation, getStandings, getTeamFromStandings } = require("../../utils/nhlapi.js");
const { checkParams } = require("../error-handling/checkparams.js");

const teamSeasonStats = async (message) => {
  try {
    var args = message.content.slice(prefix.length).trim().split(" ");
    args.shift();
    var team = args.join(" ");
    const abbrev = getTeamAbbreviation(team);
    if (!abbrev) { checkParams(message, args); return; }

    const standings = await getStandings();
    const data = getTeamFromStandings(standings, abbrev);
    if (!data) { checkParams(message, args); return; }

    const gpg = (data.goalFor / data.gamesPlayed).toFixed(2);
    const gapg = (data.goalAgainst / data.gamesPlayed).toFixed(2);

    var embed = new Discord.MessageEmbed()
      .setColor(`#f2432c`)
      .setTitle(`${data.teamName.default} Season Stats`)
      .setThumbnail(data.teamLogo)
      .setDescription(`
**Wins:** ${data.wins}
**Losses:** ${data.losses}
**OT Losses:** ${data.otLosses}
**Points:** ${data.points}
**Point Percentage:** ${(data.pointPctg * 100).toFixed(1)}%
**Goals For:** ${data.goalFor}
**Goals Against:** ${data.goalAgainst}
**Goal Differential:** ${data.goalDifferential > 0 ? "+" : ""}${data.goalDifferential}
**Goals Per Game:** ${gpg}
**Goals Against Per Game:** ${gapg}
**Regulation Wins:** ${data.regulationWins}
**Home Record:** ${data.homeWins}-${data.homeLosses}-${data.homeOtLosses}
**Road Record:** ${data.roadWins}-${data.roadLosses}-${data.roadOtLosses}
**L10 Record:** ${data.l10Wins}-${data.l10Losses}-${data.l10OtLosses}
**Streak:** ${data.streakCode}${data.streakCount}
      `);
    message.channel.send(embed);
  } catch (e) {
    checkParams(message, args);
  }
};
module.exports = {
  teamSeasonStats,
};
