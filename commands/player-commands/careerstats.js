const { EmbedBuilder } = require("discord.js");
const { getPlayerLanding, resolvePlayerId, isGoalie, pct, fix2, fix3 } = require("../../utils/nhlapi.js");
const { checkParams } = require("../error-handling/checkparams.js");

const careerStats = async (interaction) => {
  try {
    const player = interaction.options.getString("player");
    const id = await resolvePlayerId(player);
    if (!id) { await checkParams(interaction); return; }

    await interaction.deferReply();
    const data = await getPlayerLanding(id);
    const s = data.careerTotals.regularSeason;
    const name = `${data.firstName.default} ${data.lastName.default}`;

    const embed = new EmbedBuilder()
      .setColor(0xf2432c)
      .setAuthor({ name: "Career Stats", iconURL: data.teamLogo })
      .setTitle(name)
      .setThumbnail(data.headshot);

    if (isGoalie(data.position)) {
      embed.addFields(
        { name: "Record", value: `${s.wins}W-${s.losses}L-${s.otLosses}OTL`, inline: true },
        { name: "GAA", value: fix2(s.goalsAgainstAvg), inline: true },
        { name: "SV%", value: fix3(s.savePctg), inline: true },
        { name: "Shutouts", value: `${s.shutouts}`, inline: true },
        { name: "GP", value: `${s.gamesPlayed}`, inline: true },
        { name: "GS", value: `${s.gamesStarted}`, inline: true },
      );
    } else {
      embed.addFields(
        { name: "G", value: `${s.goals}`, inline: true },
        { name: "A", value: `${s.assists}`, inline: true },
        { name: "P", value: `${s.points}`, inline: true },
        { name: "GP", value: `${s.gamesPlayed}`, inline: true },
        { name: "+/-", value: `${s.plusMinus}`, inline: true },
        { name: "PIM", value: `${s.pim}`, inline: true },
        { name: "S", value: `${s.shots}`, inline: true },
        { name: "S%", value: pct(s.shootingPctg), inline: true },
        { name: "PPG", value: `${s.powerPlayGoals}`, inline: true },
        { name: "PPP", value: `${s.powerPlayPoints}`, inline: true },
        { name: "SHG", value: `${s.shorthandedGoals}`, inline: true },
        { name: "GWG", value: `${s.gameWinningGoals}`, inline: true },
        { name: "Avg TOI", value: s.avgToi || "N/A", inline: true },
        { name: "FO%", value: pct(s.faceoffWinningPctg), inline: true },
        { name: "OTG", value: `${s.otGoals}`, inline: true },
      );
    }
    await interaction.editReply({ embeds: [embed] });
  } catch (e) {
    if (interaction.deferred) await interaction.editReply("Check your parameters!");
    else await checkParams(interaction);
  }
};
module.exports = { careerStats };
