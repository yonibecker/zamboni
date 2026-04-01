const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
const { getTeamAbbreviation, getStandings, getTeamFromStandings, getTeamAdvancedStats, pct, fix2 } = require("../../utils/nhlapi.js");
const { getCurrentSeason } = require("../../utils/season.js");
const { checkParams } = require("../error-handling/checkparams.js");

const teamSeasonStats = async (interaction) => {
  try {
    const team = interaction.options.getString("team");
    const abbrev = getTeamAbbreviation(team);
    if (!abbrev) { await checkParams(interaction); return; }

    await interaction.deferReply();
    const season = getCurrentSeason();

    const [standings, { data: summary }, adv] = await Promise.all([
      getStandings(),
      axios.get(`https://api.nhle.com/stats/rest/en/team/summary?isAggregate=false&isGame=false&cayenneExp=seasonId=${season}%20and%20gameTypeId=2`),
      getTeamAdvancedStats(season),
    ]);

    const t = getTeamFromStandings(standings, abbrev);
    if (!t) { await interaction.editReply("Team not found."); return; }

    const teamSummary = summary.data.find((s) => s.teamFullName === t.teamName.default);
    const teamPct = adv.percentages.find((s) => s.teamFullName === t.teamName.default);
    const teamRt = adv.realtime.find((s) => s.teamFullName === t.teamName.default);

    const embed = new EmbedBuilder()
      .setColor(0xf2432c)
      .setTitle(`${t.teamName.default} Season Stats`)
      .setThumbnail(t.teamLogo);

    // Record
    embed.addFields(
      { name: "Record", value: `${t.wins}-${t.losses}-${t.otLosses}`, inline: true },
      { name: "Points", value: `${t.points} (${pct(t.pointPctg)})`, inline: true },
      { name: "Streak", value: `${t.streakCode}${t.streakCount}`, inline: true },
    );

    // Scoring
    embed.addFields(
      { name: "GF", value: `${t.goalFor}`, inline: true },
      { name: "GA", value: `${t.goalAgainst}`, inline: true },
      { name: "Diff", value: `${t.goalDifferential > 0 ? "+" : ""}${t.goalDifferential}`, inline: true },
    );

    if (teamSummary) {
      embed.addFields(
        { name: "GF/GP", value: fix2(teamSummary.goalsForPerGame), inline: true },
        { name: "GA/GP", value: fix2(teamSummary.goalsAgainstPerGame), inline: true },
        { name: "SO", value: `${teamSummary.teamShutouts}`, inline: true },
        { name: "PP%", value: pct(teamSummary.powerPlayPct), inline: true },
        { name: "PK%", value: pct(teamSummary.penaltyKillPct), inline: true },
        { name: "FO%", value: pct(teamSummary.faceoffWinPct), inline: true },
        { name: "SF/GP", value: fix2(teamSummary.shotsForPerGame), inline: true },
        { name: "SA/GP", value: fix2(teamSummary.shotsAgainstPerGame), inline: true },
      );
    }

    // Advanced stats
    if (teamPct) {
      embed.addFields(
        { name: "CF%", value: pct(teamPct.satPct), inline: true },
        { name: "FF%", value: pct(teamPct.usatPct), inline: true },
        { name: "5v5 SV%", value: pct(teamPct.savePct5v5), inline: true },
        { name: "5v5 S%", value: pct(teamPct.shootingPct5v5), inline: true },
        { name: "PDO", value: pct(teamPct.shootingPlusSavePct5v5), inline: true },
        { name: "OZ Start%", value: pct(teamPct.zoneStartPct5v5), inline: true },
      );
    }

    if (teamRt) {
      embed.addFields(
        { name: "Hits/60", value: fix2(teamRt.hitsPer60), inline: true },
        { name: "Blocks/60", value: fix2(teamRt.blockedShotsPer60), inline: true },
        { name: "Takeaways/60", value: fix2(teamRt.takeawaysPer60), inline: true },
      );
    }

    await interaction.editReply({ embeds: [embed] });
  } catch (e) {
    if (interaction.deferred) await interaction.editReply("Check your parameters!");
    else await checkParams(interaction);
  }
};
module.exports = { teamSeasonStats };
