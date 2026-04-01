const { EmbedBuilder } = require("discord.js");
const { getPlayerId } = require("@nhl-api/players");
const { getPlayerLanding, isGoalie, calculateOnPace } = require("../../utils/nhlapi.js");
const { checkParams } = require("../error-handling/checkparams.js");

const onPace = async (interaction) => {
  try {
    const player = interaction.options.getString("player");
    const id = getPlayerId(player);
    if (!id) { await checkParams(interaction); return; }

    await interaction.deferReply();
    const data = await getPlayerLanding(id);
    const stats = data.featuredStats.regularSeason.subSeason;
    const name = `${data.firstName.default} ${data.lastName.default}`;
    const gp = stats.gamesPlayed;

    if (!gp) {
      await interaction.editReply(`${name} has no games played this season.`);
      return;
    }

    let embed;
    if (isGoalie(data.position)) {
      embed = new EmbedBuilder()
        .setColor(0xf2432c)
        .setThumbnail(data.headshot)
        .setTitle(`${name} On-Pace Season Stats`)
        .setDescription(`
**Wins:** ${calculateOnPace(stats.wins, gp)}
**Losses:** ${calculateOnPace(stats.losses, gp)}
**OT Losses:** ${calculateOnPace(stats.otLosses, gp)}
**Shutouts:** ${calculateOnPace(stats.shutouts, gp)}
**Games Played:** 82
**Games Started:** ${calculateOnPace(stats.gamesStarted, gp)}
        `);
    } else {
      embed = new EmbedBuilder()
        .setColor(0xf2432c)
        .setThumbnail(data.headshot)
        .setTitle(`${name} On-Pace Season Stats`)
        .setDescription(`
**Goals:** ${calculateOnPace(stats.goals, gp)}
**Assists:** ${calculateOnPace(stats.assists, gp)}
**Points:** ${calculateOnPace(stats.points, gp)}
**Shots:** ${calculateOnPace(stats.shots, gp)}
**Plus-Minus:** ${calculateOnPace(stats.plusMinus, gp)}
**PIM:** ${calculateOnPace(stats.pim, gp)}
**Power Play Goals:** ${calculateOnPace(stats.powerPlayGoals, gp)}
**Game-Winning Goals:** ${calculateOnPace(stats.gameWinningGoals, gp)}
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
module.exports = { onPace };
