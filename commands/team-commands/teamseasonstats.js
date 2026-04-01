const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
const { getTeamAbbreviation, getStandings, getTeamFromStandings, getTeamAdvancedStats, teamLogo, pct, fix2 } = require("../../utils/nhlapi.js");
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

    const ts = summary.data.find((s) => s.teamFullName === t.teamName.default);
    const tp = adv.percentages.find((s) => s.teamFullName === t.teamName.default);
    const tr = adv.realtime.find((s) => s.teamFullName === t.teamName.default);
    const tpen = adv.penalties.find((s) => s.teamFullName === t.teamName.default);

    const embed = new EmbedBuilder()
      .setColor(0xf2432c)
      .setTitle(`${t.teamName.default} Season Stats`)
      .setThumbnail(teamLogo(abbrev))
      .addFields(
        { name: "Record", value: `${t.wins}-${t.losses}-${t.otLosses}`, inline: true },
        { name: "Points", value: `${t.points} (${pct(t.pointPctg)})`, inline: true },
        { name: "Streak", value: `${t.streakCode}${t.streakCount}`, inline: true },
      );

    if (ts) {
      embed.addFields(
        { name: "\u200B", value: "**Scoring**", inline: false },
        { name: "GF/GP", value: fix2(ts.goalsForPerGame), inline: true },
        { name: "GA/GP", value: fix2(ts.goalsAgainstPerGame), inline: true },
        { name: "Diff", value: `${t.goalDifferential > 0 ? "+" : ""}${t.goalDifferential}`, inline: true },
        { name: "PP%", value: pct(ts.powerPlayPct), inline: true },
        { name: "PK%", value: pct(ts.penaltyKillPct), inline: true },
        { name: "FO%", value: pct(ts.faceoffWinPct), inline: true },
        { name: "SF/GP", value: fix2(ts.shotsForPerGame), inline: true },
        { name: "SA/GP", value: fix2(ts.shotsAgainstPerGame), inline: true },
        { name: "SO", value: `${ts.teamShutouts}`, inline: true },
      );
    }

    if (tp) {
      embed.addFields(
        { name: "\u200B", value: "**Advanced (5v5)**", inline: false },
        { name: "CF%", value: pct(tp.satPct), inline: true },
        { name: "FF%", value: pct(tp.usatPct), inline: true },
        { name: "PDO", value: pct(tp.shootingPlusSavePct5v5), inline: true },
        { name: "S% 5v5", value: pct(tp.shootingPct5v5), inline: true },
        { name: "SV% 5v5", value: pct(tp.savePct5v5), inline: true },
        { name: "OZ Start%", value: pct(tp.zoneStartPct5v5), inline: true },
      );
    }

    if (tr) {
      embed.addFields(
        { name: "\u200B", value: "**Physical**", inline: false },
        { name: "Hits/60", value: fix2(tr.hitsPer60), inline: true },
        { name: "Blocks/60", value: fix2(tr.blockedShotsPer60), inline: true },
        { name: "Takeaways/60", value: fix2(tr.takeawaysPer60), inline: true },
        { name: "Giveaways/60", value: fix2(tr.giveawaysPer60), inline: true },
      );
    }

    if (tpen) {
      embed.addFields(
        { name: "PIM/GP", value: fix2(tpen.penaltySecondsPerGame / 60), inline: true },
        { name: "Net Pen/60", value: fix2(tpen.netPenaltiesPer60), inline: true },
      );
    }

    embed.setFooter({ text: "Data: NHL API" });
    await interaction.editReply({ embeds: [embed] });
  } catch (e) {
    if (interaction.deferred) await interaction.editReply("Check your parameters!");
    else await checkParams(interaction);
  }
};
module.exports = { teamSeasonStats };
