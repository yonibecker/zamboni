const sayMessage = async (interaction) => {
  const phrase = interaction.options.getString("phrase");
  await interaction.reply(phrase);
};

module.exports = { sayMessage };
