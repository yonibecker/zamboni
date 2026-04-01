const { EmbedBuilder } = require("discord.js");
const { getPlayerLanding, resolvePlayerId, isGoalie, calculateOnPace } = require("../../utils/nhlapi.js");
const { checkParams } = require("../error-handling/checkparams.js");

const onPace = async (interaction) => {
  try {
    const player = interaction.options.getString("player");
    const id = await resolvePlayerId(player);
    if (!id) { await checkParams(interaction); return; }

    await interaction.deferReply();
    const data = await getPlayerLanding(id);
    const s = data.featuredStats.regularSeason.subSeason;
    const name = `${data.firstName.default} ${data.lastName.default}`;
    const gp = s.gamesPlayed;

    if (!gp) {
      await interaction.editReply(`${name} has no games played this season.`);
      return;
    }

    const pace = (stat) => `${calculateOnPace(stat, gp)}`;
    const embed = new EmbedBuilder()
      .setColor(0xf2432c)
      .setAuthor({ name: "82-Game Pace", iconURL: data.teamLogo })
      .setTitle(name)
      .setThumbnail(data.headshot)
      .setFooter({ text: `Based on ${gp} GP` });

    if (isGoalie(data.position)) {
      embed.addFields(
        { name: "Wins", value: pace(s.wins), inline: true },
        { name: "Losses", value: pace(s.losses), inline: true },
        { name: "OTL", value: pace(s.otLosses), inline: true },
        { name: "Shutouts", value: pace(s.shutouts), inline: true },
        { name: "GS", value: pace(s.gamesStarted), inline: true },
      );
    } else {
      embed.addFields(
        { name: "G", value: pace(s.goals), inline: true },
        { name: "A", value: pace(s.assists), inline: true },
        { name: "P", value: pace(s.points), inline: true },
        { name: "S", value: pace(s.shots), inline: true },
        { name: "+/-", value: pace(s.plusMinus), inline: true },
        { name: "PIM", value: pace(s.pim), inline: true },
        { name: "PPG", value: pace(s.powerPlayGoals), inline: true },
        { name: "PPP", value: pace(s.powerPlayPoints), inline: true },
        { name: "GWG", value: pace(s.gameWinningGoals), inline: true },
      );
    }
    await interaction.editReply({ embeds: [embed] });
  } catch (e) {
    if (interaction.deferred) await interaction.editReply("Check your parameters!");
    else await checkParams(interaction);
  }
};
module.exports = { onPace };
