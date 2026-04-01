const { EmbedBuilder } = require("discord.js");
const { getTeamAbbreviation, getStandings, getTeamFromStandings } = require("../../utils/nhlapi.js");
const { checkParams } = require("../error-handling/checkparams.js");

const teamSeasonStats = async (interaction) => {
  try {
    const team = interaction.options.getString("team");
    const abbrev = getTeamAbbreviation(team);
    if (!abbrev) { await checkParams(interaction); return; }

    await interaction.deferReply();
    const standings = await getStandings();
    const data = getTeamFromStandings(standings, abbrev);
    if (!data) { await interaction.editReply("Team not found."); return; }

    const gpg = (data.goalFor / data.gamesPlayed).toFixed(2);
    const gapg = (data.goalAgainst / data.gamesPlayed).toFixed(2);

    const embed = new EmbedBuilder()
      .setColor(0xf2432c)
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
    await interaction.editReply({ embeds: [embed] });
  } catch (e) {
    if (interaction.deferred) {
      await interaction.editReply("Check your parameters!");
    } else {
      await checkParams(interaction);
    }
  }
};
module.exports = { teamSeasonStats };
