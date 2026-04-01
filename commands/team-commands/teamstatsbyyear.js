const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
const { getTeamAbbreviation, pct, fix2 } = require("../../utils/nhlapi.js");
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

    // Match by triCode from standings or by teamFullName
    const t = summary.data.find((s) => s.teamFullName && s.teamFullName.toUpperCase().includes(abbrev));
    // Fallback: match by teamId
    const teamById = summary.data.find((s) => {
      const tp = pctData.data.find((p) => p.teamId === s.teamId);
      return tp != null;
    });
    const teamSummary = t || summary.data.find((s) => {
      // try matching abbreviation from known list
      const tName = s.teamFullName?.toLowerCase() || "";
      return tName.includes(team.toLowerCase());
    });

    if (!teamSummary) {
      await interaction.editReply(`No stats found for ${team} in ${seasonStr}.`);
      return;
    }

    const teamPct = pctData.data.find((p) => p.teamId === teamSummary.teamId);
    const teamRt = rtData.data.find((r) => r.teamId === teamSummary.teamId);

    const embed = new EmbedBuilder()
      .setColor(0xf2432c)
      .setTitle(`${teamSummary.teamFullName} ${seasonStr}`)
      .addFields(
        { name: "Record", value: `${teamSummary.wins}-${teamSummary.losses}-${teamSummary.otLosses}`, inline: true },
        { name: "Points", value: `${teamSummary.points} (${pct(teamSummary.pointPct)})`, inline: true },
        { name: "ROW", value: `${teamSummary.regulationAndOtWins}`, inline: true },
        { name: "GF/GP", value: fix2(teamSummary.goalsForPerGame), inline: true },
        { name: "GA/GP", value: fix2(teamSummary.goalsAgainstPerGame), inline: true },
        { name: "SO", value: `${teamSummary.teamShutouts}`, inline: true },
        { name: "PP%", value: pct(teamSummary.powerPlayPct), inline: true },
        { name: "PK%", value: pct(teamSummary.penaltyKillPct), inline: true },
        { name: "FO%", value: pct(teamSummary.faceoffWinPct), inline: true },
        { name: "SF/GP", value: fix2(teamSummary.shotsForPerGame), inline: true },
        { name: "SA/GP", value: fix2(teamSummary.shotsAgainstPerGame), inline: true },
      );

    if (teamPct) {
      embed.addFields(
        { name: "CF%", value: pct(teamPct.satPct), inline: true },
        { name: "FF%", value: pct(teamPct.usatPct), inline: true },
        { name: "5v5 SV%", value: pct(teamPct.savePct5v5), inline: true },
        { name: "PDO", value: pct(teamPct.shootingPlusSavePct5v5), inline: true },
      );
    }

    if (teamRt) {
      embed.addFields(
        { name: "Hits/60", value: fix2(teamRt.hitsPer60), inline: true },
        { name: "Blocks/60", value: fix2(teamRt.blockedShotsPer60), inline: true },
      );
    }

    await interaction.editReply({ embeds: [embed] });
  } catch (e) {
    if (interaction.deferred) await interaction.editReply("Check your parameters!");
    else await checkParams(interaction);
  }
};
module.exports = { teamStatsByYear };
