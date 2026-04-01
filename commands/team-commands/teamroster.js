const { EmbedBuilder } = require("discord.js");
const { getTeamAbbreviation, getRoster, getStandings, getTeamFromStandings } = require("../../utils/nhlapi.js");
const { checkParams } = require("../error-handling/checkparams.js");

const POSITION_LABELS = { C: "C", L: "LW", R: "RW", D: "D", G: "G" };

const teamRoster = async (interaction) => {
  try {
    const team = interaction.options.getString("team");
    const abbrev = getTeamAbbreviation(team);
    if (!abbrev) { await checkParams(interaction); return; }

    await interaction.deferReply();
    const [roster, standings] = await Promise.all([
      getRoster(abbrev),
      getStandings(),
    ]);

    const teamData = getTeamFromStandings(standings, abbrev);
    const teamName = teamData ? teamData.teamName.default : team;
    const teamLogo = teamData ? teamData.teamLogo : undefined;

    const allPlayers = [
      ...(roster.forwards || []),
      ...(roster.defensemen || []),
      ...(roster.goalies || []),
    ];

    let description = "";
    allPlayers.forEach((p) => {
      const pos = POSITION_LABELS[p.positionCode] || p.positionCode;
      description += `**${p.firstName.default} ${p.lastName.default}**, ${pos}, #${p.sweaterNumber}\n`;
    });

    const embed = new EmbedBuilder()
      .setTitle(`${teamName} Roster`)
      .setColor(0xf2432c)
      .setDescription(description);
    if (teamLogo) embed.setThumbnail(teamLogo);
    await interaction.editReply({ embeds: [embed] });
  } catch (e) {
    if (interaction.deferred) {
      await interaction.editReply("Check your parameters!");
    } else {
      await checkParams(interaction);
    }
  }
};
module.exports = { teamRoster };
