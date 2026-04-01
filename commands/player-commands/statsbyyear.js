const { EmbedBuilder } = require("discord.js");
const { getPlayerId } = require("@nhl-api/players");
const { getPlayerLanding, isGoalie } = require("../../utils/nhlapi.js");
const { checkParams } = require("../error-handling/checkparams.js");

const statsByYear = async (interaction) => {
  try {
    const player = interaction.options.getString("player");
    const year = interaction.options.getString("year");
    const id = getPlayerId(player);
    if (!id || !year) { await checkParams(interaction); return; }

    await interaction.deferReply();
    const data = await getPlayerLanding(id);
    const name = `${data.firstName.default} ${data.lastName.default}`;

    const seasonEntries = data.seasonTotals.filter(
      (s) => s.season === parseInt(year) && s.gameTypeId === 2 && s.leagueAbbrev === "NHL"
    );

    if (seasonEntries.length === 0) {
      await interaction.editReply(`No NHL stats found for ${name} in ${year}.`);
      return;
    }

    const stats = seasonEntries.reduce((acc, s) => {
      for (const key of Object.keys(s)) {
        if (typeof s[key] === "number") acc[key] = (acc[key] || 0) + s[key];
      }
      return acc;
    }, {});
    stats.gamesPlayed = seasonEntries.reduce((sum, s) => sum + s.gamesPlayed, 0);

    let embed;
    if (isGoalie(data.position)) {
      const savePctg = seasonEntries.length === 1 ? seasonEntries[0].savePctg : null;
      const gaa = seasonEntries.length === 1 ? seasonEntries[0].goalsAgainstAvg : null;
      embed = new EmbedBuilder()
        .setColor(0xf2432c)
        .setThumbnail(data.headshot)
        .setTitle(`${name} ${year} Stats`)
        .setDescription(`
**Wins:** ${stats.wins}
**Losses:** ${stats.losses}
**OT Losses:** ${stats.otLosses}
**Shutouts:** ${stats.shutouts}
**Save Percentage:** ${savePctg ? savePctg.toFixed(3) : "N/A"}
**Goals Against Average:** ${gaa ? gaa.toFixed(2) : "N/A"}
**Games Played:** ${stats.gamesPlayed}
**Games Started:** ${stats.gamesStarted}
        `);
    } else {
      embed = new EmbedBuilder()
        .setColor(0xf2432c)
        .setThumbnail(data.headshot)
        .setTitle(`${name} ${year} Stats`)
        .setDescription(`
**Goals:** ${stats.goals}
**Assists:** ${stats.assists}
**Points:** ${stats.points}
**Shots:** ${stats.shots}
**Plus-Minus:** ${stats.plusMinus}
**PIM:** ${stats.pim}
**Power Play Goals:** ${stats.powerPlayGoals}
**Game-Winning Goals:** ${stats.gameWinningGoals}
        `);
    }
    await interaction.editReply({ embeds: [embed] });
  } catch (e) {
    if (interaction.deferred) {
      await interaction.editReply("Check your parameters!");
    } else {
      await checkParams(interaction);
    }
  }
};
module.exports = { statsByYear };
