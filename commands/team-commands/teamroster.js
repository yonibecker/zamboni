const Discord = require("discord.js");
const prefix = "h:";
const { getTeamAbbreviation, getRoster, getStandings, getTeamFromStandings } = require("../../utils/nhlapi.js");
const { checkParams } = require("../error-handling/checkparams.js");

const POSITION_LABELS = { C: "C", L: "LW", R: "RW", D: "D", G: "G" };

const teamRoster = async (message) => {
  try {
    var args = message.content.slice(prefix.length).trim().split(" ");
    args.shift();
    var team = args.join(" ");
    const abbrev = getTeamAbbreviation(team);
    if (!abbrev) { checkParams(message, args); return; }

    const [roster, standings] = await Promise.all([
      getRoster(abbrev),
      getStandings(),
    ]);

    const teamData = getTeamFromStandings(standings, abbrev);
    const teamName = teamData ? teamData.teamName.default : team;
    const teamLogo = teamData ? teamData.teamLogo : undefined;

    // Combine all position groups
    const allPlayers = [
      ...(roster.forwards || []),
      ...(roster.defensemen || []),
      ...(roster.goalies || []),
    ];

    var description = "";
    allPlayers.forEach((p) => {
      const pos = POSITION_LABELS[p.positionCode] || p.positionCode;
      description += `**${p.firstName.default} ${p.lastName.default}**, ${pos}, #${p.sweaterNumber}\n`;
    });

    var embed = new Discord.MessageEmbed()
      .setTitle(`${teamName} Roster`)
      .setColor("#f2432c")
      .setDescription(description);
    if (teamLogo) embed.setThumbnail(teamLogo);
    message.channel.send(embed);
  } catch (e) {
    checkParams(message, args);
  }
};
module.exports = {
  teamRoster,
};
