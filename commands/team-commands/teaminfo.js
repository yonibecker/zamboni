const Discord = require("discord.js");
const prefix = "h:";
const { getTeamAbbreviation, getStandings, getTeamFromStandings } = require("../../utils/nhlapi.js");
const { checkParams } = require("../error-handling/checkparams.js");

const teamInfo = async (message) => {
  try {
    var args = message.content.slice(prefix.length).trim().split(" ");
    args.shift();
    var team = args.join(" ");
    const abbrev = getTeamAbbreviation(team);
    if (!abbrev) { checkParams(message, args); return; }

    const standings = await getStandings();
    const data = getTeamFromStandings(standings, abbrev);
    if (!data) { checkParams(message, args); return; }

    var embed = new Discord.MessageEmbed()
      .setColor(`#f2432c`)
      .setTitle(`${data.teamName.default} Team Info`)
      .setThumbnail(data.teamLogo)
      .setDescription(`
**Team Name:** ${data.teamName.default}
**Abbreviation:** ${data.teamAbbrev.default}
**Division:** ${data.divisionName} Division
**Conference:** ${data.conferenceName} Conference
**Record:** ${data.wins}-${data.losses}-${data.otLosses}
**Points:** ${data.points}
      `);
    message.channel.send(embed);
  } catch (e) {
    checkParams(message, args);
  }
};
module.exports = {
  teamInfo,
};
