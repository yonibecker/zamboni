const { EmbedBuilder } = require("discord.js");
const { getTeamAbbreviation, getStandings, getTeamFromStandings } = require("../../utils/nhlapi.js");
const { checkParams } = require("../error-handling/checkparams.js");

const teamInfo = async (interaction) => {
  try {
    const team = interaction.options.getString("team");
    const abbrev = getTeamAbbreviation(team);
    if (!abbrev) { await checkParams(interaction); return; }

    await interaction.deferReply();
    const standings = await getStandings();
    const data = getTeamFromStandings(standings, abbrev);
    if (!data) { await interaction.editReply("Team not found."); return; }

    const embed = new EmbedBuilder()
      .setColor(0xf2432c)
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
    await interaction.editReply({ embeds: [embed] });
  } catch (e) {
    if (interaction.deferred) {
      await interaction.editReply("Check your parameters!");
    } else {
      await checkParams(interaction);
    }
  }
};
module.exports = { teamInfo };
