const { EmbedBuilder } = require("discord.js");
const { getPlayerLanding, resolvePlayerId, isGoalie, pct, fix3, teamLogo } = require("../../utils/nhlapi.js");
const { checkParams } = require("../error-handling/checkparams.js");

const statsByYear = async (interaction) => {
  try {
    const player = interaction.options.getString("player");
    const year = interaction.options.getString("year");
    const id = await resolvePlayerId(player);
    if (!id || !year) { await checkParams(interaction); return; }

    await interaction.deferReply();
    const data = await getPlayerLanding(id);
    const name = `${data.firstName.default} ${data.lastName.default}`;
    const seasonStr = `${year.slice(0, 4)}-${year.slice(6)}`;

    const seasonEntries = data.seasonTotals.filter(
      (s) => s.season === parseInt(year) && s.gameTypeId === 2 && s.leagueAbbrev === "NHL"
    );

    if (seasonEntries.length === 0) {
      await interaction.editReply(`No NHL stats found for ${name} in ${seasonStr}.`);
      return;
    }

    const s = seasonEntries.reduce((acc, entry) => {
      for (const key of Object.keys(entry)) {
        if (typeof entry[key] === "number") acc[key] = (acc[key] || 0) + entry[key];
      }
      return acc;
    }, {});
    const teams = seasonEntries.map((e) => e.teamCommonName?.default || "").join(", ");
    const abbrev = data.currentTeamAbbrev;
    const logo = teamLogo(abbrev);

    const embed = new EmbedBuilder()
      .setColor(0xf2432c)
      .setAuthor({ name: seasonStr, iconURL: logo })
      .setTitle(name)
      .setThumbnail(data.headshot)
      .setFooter({ text: teams });

    if (isGoalie(data.position)) {
      const sv = seasonEntries.length === 1 ? seasonEntries[0].savePctg : null;
      const gaa = seasonEntries.length === 1 ? seasonEntries[0].goalsAgainstAvg : null;
      embed.addFields(
        { name: "Record", value: `${s.wins}W-${s.losses}L-${s.otLosses || 0}OTL`, inline: true },
        { name: "GAA", value: gaa != null ? gaa.toFixed(2) : "N/A", inline: true },
        { name: "SV%", value: sv != null ? fix3(sv) : "N/A", inline: true },
        { name: "SO", value: `${s.shutouts}`, inline: true },
        { name: "GP", value: `${s.gamesPlayed}`, inline: true },
        { name: "GS", value: `${s.gamesStarted}`, inline: true },
      );
    } else {
      embed.addFields(
        { name: "G", value: `${s.goals}`, inline: true },
        { name: "A", value: `${s.assists}`, inline: true },
        { name: "P", value: `${s.points}`, inline: true },
        { name: "GP", value: `${s.gamesPlayed}`, inline: true },
        { name: "+/-", value: `${s.plusMinus}`, inline: true },
        { name: "PIM", value: `${s.pim || 0}`, inline: true },
        { name: "S", value: `${s.shots}`, inline: true },
        { name: "PPG", value: `${s.powerPlayGoals}`, inline: true },
        { name: "GWG", value: `${s.gameWinningGoals}`, inline: true },
      );
    }
    await interaction.editReply({ embeds: [embed] });
  } catch (e) {
    if (interaction.deferred) await interaction.editReply("Check your parameters!");
    else await checkParams(interaction);
  }
};
module.exports = { statsByYear };
