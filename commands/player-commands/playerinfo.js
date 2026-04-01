const { EmbedBuilder } = require("discord.js");
const { getPlayerId } = require("@nhl-api/players");
const { getPlayerLanding, formatHeight, positionName } = require("../../utils/nhlapi.js");
const { checkParams } = require("../error-handling/checkparams.js");

const playerInfo = async (interaction) => {
  try {
    const player = interaction.options.getString("player");
    const id = getPlayerId(player);
    if (!id) { await checkParams(interaction); return; }

    await interaction.deferReply();
    const data = await getPlayerLanding(id);

    const embed = new EmbedBuilder()
      .setColor(0xf2432c)
      .setThumbnail(data.headshot)
      .setTitle(`${data.firstName.default} ${data.lastName.default} Info`)
      .setDescription(`
**Name:** ${data.firstName.default} ${data.lastName.default}
**Current Team:** ${data.fullTeamName.default}
**Position:** ${positionName(data.position)}
**Jersey Number:** ${data.sweaterNumber}
**Birthdate:** ${data.birthDate}
**Height:** ${formatHeight(data.heightInInches)}
**Weight:** ${data.weightInPounds} lbs
**Birth Country:** ${data.birthCountry}
**Shoots/Catches:** ${data.shootsCatches}
      `);
    await interaction.editReply({ embeds: [embed] });
  } catch (e) {
    if (interaction.deferred) {
      await interaction.editReply("Check your parameters!");
    } else {
      await checkParams(interaction);
    }
  }
};
module.exports = { playerInfo };
