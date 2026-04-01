const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
const { checkParams } = require("../error-handling/checkparams.js");

const draftSelections = async (interaction) => {
  try {
    const year = interaction.options.getInteger("year");
    const startPick = interaction.options.getInteger("start");
    const endPick = interaction.options.getInteger("end");

    if (!year || !startPick || !endPick || startPick > endPick) {
      await checkParams(interaction);
      return;
    }

    await interaction.deferReply();
    const { data } = await axios.get(
      `https://records.nhl.com/site/api/draft?cayenneExp=draftYear=${year}&sort=[{%22property%22:%22overallPickNumber%22,%22direction%22:%22ASC%22}]`
    );

    const picks = data.data.filter(
      (p) => p.overallPickNumber >= startPick && p.overallPickNumber <= endPick
    );

    if (picks.length === 0) {
      await interaction.editReply(`No draft picks found for ${year} picks ${startPick}-${endPick}.`);
      return;
    }

    let embed_desc = "";
    picks.forEach((pick) => {
      embed_desc += `**${pick.roundNumber}-${pick.pickInRound}:** ${pick.playerName}, ${pick.triCode}\n`;
    });

    const embed = new EmbedBuilder()
      .setColor(0xf2432c)
      .setTitle(`${year} NHL Entry Draft Picks ${startPick}-${endPick}`)
      .setDescription(embed_desc);
    await interaction.editReply({ embeds: [embed] });
  } catch (e) {
    if (interaction.deferred) {
      await interaction.editReply("Check your parameters!");
    } else {
      await checkParams(interaction);
    }
  }
};
module.exports = { draftSelections };
