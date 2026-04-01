const { EmbedBuilder } = require("discord.js");
const logo = process.env.BASE_URL ? `${process.env.BASE_URL}/zamboni.png` : undefined;

const zamboniMaintenance = async (interaction) => {
  const embed = new EmbedBuilder()
    .setColor(0xf2432c)
    .setAuthor({ name: "Zamboni Maintenance Times", iconURL: logo })
    .setDescription(`
Zamboni plans to be updated during the times below. Please note all times are in PST and you may experience bugs/glitches during maintenance.

**Time:**
**Reason:**
    `);
  await interaction.reply({ embeds: [embed] });
};

module.exports = { zamboniMaintenance };
