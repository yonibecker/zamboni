const { EmbedBuilder } = require("discord.js");
const logo = process.env.BASE_URL ? `${process.env.BASE_URL}/zamboni.png` : undefined;

const voteForZamboni = async (interaction) => {
  const embed = new EmbedBuilder()
    .setColor(0xf2432c)
    .setAuthor({ name: "Vote For Zamboni", iconURL: logo })
    .setDescription(`
Check out Zamboni's page [here](https://top.gg/bot/1488895664019476510) and click [this link](https://top.gg/bot/1488895664019476510/vote) to vote right away!
    `);
  await interaction.reply({ embeds: [embed] });
};

module.exports = { voteForZamboni };
