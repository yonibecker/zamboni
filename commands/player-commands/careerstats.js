const { EmbedBuilder } = require("discord.js");
const { getPlayerId } = require("@nhl-api/players");
const { getPlayerLanding, isGoalie } = require("../../utils/nhlapi.js");
const { checkParams } = require("../error-handling/checkparams.js");

const careerStats = async (interaction) => {
  try {
    const player = interaction.options.getString("player");
    const id = getPlayerId(player);
    if (!id) { await checkParams(interaction); return; }

    await interaction.deferReply();
    const data = await getPlayerLanding(id);
    const stats = data.careerTotals.regularSeason;
    const name = `${data.firstName.default} ${data.lastName.default}`;

    let embed;
    if (isGoalie(data.position)) {
      embed = new EmbedBuilder()
        .setColor(0xf2432c)
        .setThumbnail(data.headshot)
        .setTitle(`${name} Career Stats`)
        .setDescription(`
**Wins:** ${stats.wins}
**Losses:** ${stats.losses}
**OT Losses:** ${stats.otLosses}
**Shutouts:** ${stats.shutouts}
**Save Percentage:** ${stats.savePctg ? stats.savePctg.toFixed(3) : "N/A"}
**Goals Against Average:** ${stats.goalsAgainstAvg ? stats.goalsAgainstAvg.toFixed(2) : "N/A"}
**Games Played:** ${stats.gamesPlayed}
**Games Started:** ${stats.gamesStarted}
        `);
    } else {
      embed = new EmbedBuilder()
        .setColor(0xf2432c)
        .setThumbnail(data.headshot)
        .setTitle(`${name} Career Stats`)
        .setDescription(`
**Goals:** ${stats.goals}
**Assists:** ${stats.assists}
**Points:** ${stats.points}
**Shots:** ${stats.shots}
**Shooting Percentage:** ${stats.shootingPctg ? (stats.shootingPctg * 100).toFixed(2) : "N/A"}%
**Plus-Minus:** ${stats.plusMinus}
**PIM:** ${stats.pim}
**Power Play Goals:** ${stats.powerPlayGoals}
**Game-Winning Goals:** ${stats.gameWinningGoals}
**Avg TOI:** ${stats.avgToi}
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
module.exports = { careerStats };
