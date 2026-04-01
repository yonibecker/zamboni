const { EmbedBuilder } = require("discord.js");
const { getPlayerLanding, resolvePlayerId, formatHeight, positionName } = require("../../utils/nhlapi.js");
const { checkParams } = require("../error-handling/checkparams.js");

const playerInfo = async (interaction) => {
  try {
    const player = interaction.options.getString("player");
    const id = await resolvePlayerId(player);
    if (!id) { await checkParams(interaction); return; }

    await interaction.deferReply();
    const data = await getPlayerLanding(id);
    const name = `${data.firstName.default} ${data.lastName.default}`;

    const embed = new EmbedBuilder()
      .setColor(0xf2432c)
      .setAuthor({ name: data.fullTeamName.default, iconURL: data.teamLogo })
      .setTitle(name)
      .setThumbnail(data.headshot)
      .addFields(
        { name: "Position", value: positionName(data.position), inline: true },
        { name: "Jersey", value: `#${data.sweaterNumber}`, inline: true },
        { name: "Shoots/Catches", value: data.shootsCatches, inline: true },
        { name: "Height", value: formatHeight(data.heightInInches), inline: true },
        { name: "Weight", value: `${data.weightInPounds} lbs`, inline: true },
        { name: "Born", value: data.birthDate, inline: true },
        { name: "Birthplace", value: `${data.birthCity.default}, ${data.birthCountry}`, inline: true },
      );

    if (data.draftDetails) {
      const d = data.draftDetails;
      embed.addFields({
        name: "Drafted",
        value: `${d.year} R${d.round} #${d.overallPick} (${d.teamAbbrev})`,
        inline: true,
      });
    }

    if (data.inHHOF) embed.addFields({ name: "Hall of Fame", value: "Yes", inline: true });

    await interaction.editReply({ embeds: [embed] });
  } catch (e) {
    if (interaction.deferred) await interaction.editReply("Check your parameters!");
    else await checkParams(interaction);
  }
};
module.exports = { playerInfo };
