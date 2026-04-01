const { EmbedBuilder } = require("discord.js");
const { getTeamAbbreviation, getRoster, getStandings, getTeamFromStandings, teamLogo } = require("../../utils/nhlapi.js");
const { checkParams } = require("../error-handling/checkparams.js");

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

    const formatGroup = (players, label) => {
      if (!players || players.length === 0) return "";
      const lines = players.map(
        (p) => `#${p.sweaterNumber} ${p.firstName.default} ${p.lastName.default}`
      );
      return `**${label}**\n${lines.join("\n")}`;
    };

    const sections = [
      formatGroup(roster.forwards, "Forwards"),
      formatGroup(roster.defensemen, "Defensemen"),
      formatGroup(roster.goalies, "Goalies"),
    ].filter(Boolean);

    const embed = new EmbedBuilder()
      .setTitle(`${teamName} Roster`)
      .setColor(0xf2432c)
      .setThumbnail(teamLogo(abbrev))
      .setDescription(sections.join("\n\n"));
    await interaction.editReply({ embeds: [embed] });
  } catch (e) {
    if (interaction.deferred) await interaction.editReply("Check your parameters!");
    else await checkParams(interaction);
  }
};
module.exports = { teamRoster };
