const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
const { getTeamAbbreviation, teamLogo, pct, fix2 } = require("../../utils/nhlapi.js");
const { checkParams } = require("../error-handling/checkparams.js");

const STATS_BASE = "https://api.nhle.com/stats/rest/en";

const teamStatsByYear = async (interaction) => {
  try {
    const team = interaction.options.getString("team");
    const year = interaction.options.getString("year");
    const abbrev = getTeamAbbreviation(team);
    if (!abbrev || !year) { await checkParams(interaction); return; }

    await interaction.deferReply();
    const seasonStr = `${year.slice(0, 4)}-${year.slice(6)}`;

    const [{ data: summary }, { data: pctData }, { data: rtData }] = await Promise.all([
      axios.get(`${STATS_BASE}/team/summary?isAggregate=false&isGame=false&cayenneExp=seasonId=${year}%20and%20gameTypeId=2`),
      axios.get(`${STATS_BASE}/team/percentages?isAggregate=false&isGame=false&cayenneExp=seasonId=${year}%20and%20gameTypeId=2`),
      axios.get(`${STATS_BASE}/team/realtime?isAggregate=false&isGame=false&cayenneExp=seasonId=${year}%20and%20gameTypeId=2`),
    ]);

    // Match team by name
    const ts = summary.data.find((s) => {
      const name = (s.teamFullName || "").toLowerCase();
      return name.includes(team.toLowerCase()) || name.includes(abbrev.toLowerCase());
    });

    if (!ts) {
      await interaction.editReply(`No stats found for ${team} in ${seasonStr}.`);
      return;
    }

    const tp = pctData.data.find((p) => p.teamId === ts.teamId);
    const tr = rtData.data.find((r) => r.teamId === ts.teamId);

    const embed = new EmbedBuilder()
      .setColor(0xf2432c)
      .setTitle(`${ts.teamFullName} ${seasonStr}`)
      .setThumbnail(teamLogo(abbrev))
      .addFields(
        { name: "Record", value: `${ts.wins}-${ts.losses}-${ts.otLosses}`, inline: true },
        { name: "Points", value: `${ts.points} (${pct(ts.pointPct)})`, inline: true },
        { name: "ROW", value: `${ts.regulationAndOtWins}`, inline: true },
        { name: "\u200B", value: "**Scoring**", inline: false },
        { name: "GF/GP", value: fix2(ts.goalsForPerGame), inline: true },
        { name: "GA/GP", value: fix2(ts.goalsAgainstPerGame), inline: true },
        { name: "SO", value: `${ts.teamShutouts}`, inline: true },
        { name: "PP%", value: pct(ts.powerPlayPct), inline: true },
        { name: "PK%", value: pct(ts.penaltyKillPct), inline: true },
        { name: "FO%", value: pct(ts.faceoffWinPct), inline: true },
        { name: "SF/GP", value: fix2(ts.shotsForPerGame), inline: true },
        { name: "SA/GP", value: fix2(ts.shotsAgainstPerGame), inline: true },
      );

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
        { name: "Hits/60", value: fix2(tr.hitsPer60), inline: true },
        { name: "Blocks/60", value: fix2(tr.blockedShotsPer60), inline: true },
        { name: "Takeaways/60", value: fix2(tr.takeawaysPer60), inline: true },
      );
    }

    embed.setFooter({ text: "Data: NHL API" });
    await interaction.editReply({ embeds: [embed] });
  } catch (e) {
    if (interaction.deferred) await interaction.editReply("Check your parameters!");
    else await checkParams(interaction);
  }
};
module.exports = { teamStatsByYear };
