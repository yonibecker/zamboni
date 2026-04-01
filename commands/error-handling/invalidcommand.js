const { EmbedBuilder } = require("discord.js");

const invalidCommand = async (interaction) => {
  const embed = new EmbedBuilder()
    .setColor(0xf2432c)
    .setDescription("Invalid command. Use `/help` for valid commands.");
  await interaction.reply({ embeds: [embed], ephemeral: true });
};

module.exports = {
  invalidCommand,
};
