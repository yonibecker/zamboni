const { EmbedBuilder } = require("discord.js");

const checkParams = async (interaction) => {
  const embed = new EmbedBuilder()
    .setColor(0xf2432c)
    .setDescription("Check your parameters!");
  await interaction.reply({ embeds: [embed], ephemeral: true });
};

module.exports = {
  checkParams,
};
