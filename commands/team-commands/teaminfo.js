const { EmbedBuilder } = require("discord.js");
const { getTeamAbbreviation, getStandings, getTeamFromStandings, teamLogo } = require("../../utils/nhlapi.js");
const { checkParams } = require("../error-handling/checkparams.js");

const teamInfo = async (interaction) => {
  try {
    const team = interaction.options.getString("team");
    const abbrev = getTeamAbbreviation(team);
    if (!abbrev) { await checkParams(interaction); return; }

    await interaction.deferReply();
    const standings = await getStandings();
    const t = getTeamFromStandings(standings, abbrev);
    if (!t) { await interaction.editReply("Team not found in current standings."); return; }

    const embed = new EmbedBuilder()
      .setColor(0xf2432c)
      .setTitle(t.teamName.default)
      .setThumbnail(teamLogo(abbrev))
      .addFields(
        { name: "Division", value: `${t.divisionName}`, inline: true },
        { name: "Conference", value: `${t.conferenceName}`, inline: true },
        { name: "League Rank", value: `#${t.leagueSequence}`, inline: true },
        { name: "Record", value: `${t.wins}-${t.losses}-${t.otLosses}`, inline: true },
        { name: "Points", value: `${t.points} (${(t.pointPctg * 100).toFixed(1)}%)`, inline: true },
        { name: "Streak", value: `${t.streakCode}${t.streakCount}`, inline: true },
        { name: "Home", value: `${t.homeWins}-${t.homeLosses}-${t.homeOtLosses}`, inline: true },
        { name: "Away", value: `${t.roadWins}-${t.roadLosses}-${t.roadOtLosses}`, inline: true },
        { name: "L10", value: `${t.l10Wins}-${t.l10Losses}-${t.l10OtLosses}`, inline: true },
        { name: "GF/GA", value: `${t.goalFor}/${t.goalAgainst} (${t.goalDifferential > 0 ? "+" : ""}${t.goalDifferential})`, inline: true },
        { name: "ROW", value: `${t.regulationPlusOtWins}`, inline: true },
        { name: "RW", value: `${t.regulationWins}`, inline: true },
      );
    await interaction.editReply({ embeds: [embed] });
  } catch (e) {
    if (interaction.deferred) await interaction.editReply("Check your parameters!");
    else await checkParams(interaction);
  }
};
module.exports = { teamInfo };
