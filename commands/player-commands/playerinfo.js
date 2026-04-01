const { EmbedBuilder } = require("discord.js");
const { getPlayerLanding, resolvePlayerId, formatHeight, positionName, teamLogo } = require("../../utils/nhlapi.js");
const { checkParams } = require("../error-handling/checkparams.js");

const playerInfo = async (interaction) => {
  try {
    const player = interaction.options.getString("player");
    const id = await resolvePlayerId(player);
    if (!id) { await checkParams(interaction); return; }

    await interaction.deferReply();
    const data = await getPlayerLanding(id);
    const name = `${data.firstName.default} ${data.lastName.default}`;
    const abbrev = data.currentTeamAbbrev;
    const logo = teamLogo(abbrev);

    const embed = new EmbedBuilder()
      .setColor(0xf2432c)
      .setAuthor({ name: data.fullTeamName.default, iconURL: logo })
      .setTitle(`${name} #${data.sweaterNumber}`)
      .setThumbnail(data.headshot)
      .setImage(data.heroImage)
      .addFields(
        { name: "Position", value: positionName(data.position), inline: true },
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
        value: `${d.year} R${d.round} #${d.overallPick} overall (${d.teamAbbrev})`,
        inline: false,
      });
    }

    if (data.inHHOF) embed.addFields({ name: "Hall of Fame", value: "Inducted", inline: true });

    // Show last 5 games
    if (data.last5Games && data.last5Games.length > 0) {
      const last5 = data.last5Games.map((g) => {
        const vs = g.homeRoadFlag === "H" ? `vs ${g.opponentAbbrev}` : `@ ${g.opponentAbbrev}`;
        return `${g.gameDate.slice(5)} ${vs}: **${g.goals}G ${g.assists}A** (${g.plusMinus >= 0 ? "+" : ""}${g.plusMinus})`;
      }).join("\n");
      embed.addFields({ name: "Last 5 Games", value: last5, inline: false });
    }

    await interaction.editReply({ embeds: [embed] });
  } catch (e) {
    if (interaction.deferred) await interaction.editReply("Check your parameters!");
    else await checkParams(interaction);
  }
};
module.exports = { playerInfo };
