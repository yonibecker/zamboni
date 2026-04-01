const { EmbedBuilder } = require("discord.js");
const logo = process.env.BASE_URL ? `${process.env.BASE_URL}/zamboni.png` : undefined;

const zamboniInfo = async (interaction) => {
  const embed = new EmbedBuilder()
    .setColor(0xf2432c)
    .setAuthor({ name: "Zamboni Info", iconURL: logo })
    .setDescription(`
**General**
Latency: ${Date.now() - interaction.createdTimestamp}ms

**Bot Dev Info**
Zamboni is being actively monitored and developed. If you have any comments, questions, or concerns please feel free to reach out.

**Bot Links**
Click on [this link](https://discord.com/api/oauth2/authorize?client_id=1488895664019476510&permissions=75776&scope=bot%20applications.commands) to add Zamboni to your server and [click here](https://top.gg/bot/1488895664019476510/vote/) to vote for Zamboni on top.gg!
    `);
  await interaction.reply({ embeds: [embed] });
};

module.exports = { zamboniInfo };
