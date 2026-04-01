const Discord = require("discord.js");
const prefix = "h:";
const axios = require("axios");
const { getTeamAbbreviation } = require("../../utils/nhlapi.js");
const { checkParams } = require("../error-handling/checkparams.js");

const teamStatsByYear = async (message) => {
  try {
    var args = message.content.slice(prefix.length).trim().split(" ");
    args.shift();
    const year = args.pop();
    var team = args.join(" ");
    const abbrev = getTeamAbbreviation(team);
    if (!abbrev || !year) { checkParams(message, args); return; }

    // Use the nhle stats API (same one league leaders use) for historical team data
    const { data } = await axios.get(
      `https://api.nhle.com/stats/rest/en/team/summary?isAggregate=false&isGame=false&cayenneExp=seasonId=${year}%20and%20gameTypeId=2`
    );

    const teamData = data.data.find((t) => t.teamTriCode === abbrev);
    if (!teamData) {
      message.channel.send(`No stats found for ${team} in ${year}.`);
      return;
    }

    var embed = new Discord.MessageEmbed()
      .setColor(`#f2432c`)
      .setTitle(`${teamData.teamFullName} ${year} Team Stats`)
      .setDescription(`
**Wins:** ${teamData.wins}
**Losses:** ${teamData.losses}
**OT Losses:** ${teamData.otLosses}
**Points:** ${teamData.points}
**Point Percentage:** ${(teamData.pointPctg * 100).toFixed(1)}%
**Goals For:** ${teamData.goalsFor}
**Goals Against:** ${teamData.goalsAgainst}
**Goals Per Game:** ${teamData.goalsForPerGame.toFixed(2)}
**Goals Against Per Game:** ${teamData.goalsAgainstPerGame.toFixed(2)}
**Power Play Percentage:** ${(teamData.powerPlayPctg * 100).toFixed(1)}%
**Penalty Kill Percentage:** ${(teamData.penaltyKillPctg * 100).toFixed(1)}%
**Shots Per Game:** ${teamData.shotsForPerGame.toFixed(1)}
**Shots Against Per Game:** ${teamData.shotsAgainstPerGame.toFixed(1)}
**Faceoff Win Percentage:** ${(teamData.faceoffWinPctg * 100).toFixed(1)}%
      `);
    message.channel.send(embed);
  } catch (e) {
    checkParams(message, args);
  }
};
module.exports = {
  teamStatsByYear,
};
