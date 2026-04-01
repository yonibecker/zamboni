const { EmbedBuilder } = require("discord.js");
const { getPlayerLanding, resolvePlayerId, isGoalie, getMoneyPuckPlayer, getMoneyPuckGoalie, pct, fix2, fix3, teamLogo } = require("../../utils/nhlapi.js");
const { checkParams } = require("../error-handling/checkparams.js");

const seasonStats = async (interaction) => {
  try {
    const player = interaction.options.getString("player");
    const id = await resolvePlayerId(player);
    if (!id) { await checkParams(interaction); return; }

    await interaction.deferReply();

    const data = await getPlayerLanding(id);
    const s = data.featuredStats.regularSeason.subSeason;
    const name = `${data.firstName.default} ${data.lastName.default}`;
    const season = data.featuredStats.season;
    const seasonStr = `${String(season).slice(0, 4)}-${String(season).slice(6)}`;
    const abbrev = data.currentTeamAbbrev;
    const logo = teamLogo(abbrev);

    const embed = new EmbedBuilder()
      .setColor(0xf2432c)
      .setAuthor({ name: `${data.fullTeamName.default} | ${seasonStr}`, iconURL: logo })
      .setTitle(name)
      .setThumbnail(data.headshot);

    if (isGoalie(data.position)) {
      const mp = await getMoneyPuckGoalie(id).catch(() => null);
      embed.addFields(
        { name: "Record", value: `${s.wins}W-${s.losses}L-${s.otLosses}OTL`, inline: true },
        { name: "GAA", value: fix2(s.goalsAgainstAvg), inline: true },
        { name: "SV%", value: fix3(s.savePctg), inline: true },
        { name: "Shutouts", value: `${s.shutouts}`, inline: true },
        { name: "GP", value: `${s.gamesPlayed}`, inline: true },
        { name: "GS", value: `${s.gamesStarted}`, inline: true },
      );
      if (mp) {
        embed.addFields(
          { name: "\u200B", value: "**MoneyPuck Analytics**", inline: false },
          { name: "xGA", value: fix2(mp.xGoals), inline: true },
          { name: "GA", value: `${mp.goals}`, inline: true },
          { name: "GSAx", value: fix2(Number(mp.xGoals) - Number(mp.goals)), inline: true },
          { name: "HD SV%", value: Number(mp.highDangerShots) > 0 ? pct(1 - Number(mp.highDangerGoals) / Number(mp.highDangerShots)) : "N/A", inline: true },
        );
      }
    } else {
      const mp = await getMoneyPuckPlayer(id).catch(() => null);
      embed.addFields(
        { name: "G", value: `${s.goals}`, inline: true },
        { name: "A", value: `${s.assists}`, inline: true },
        { name: "P", value: `${s.points}`, inline: true },
        { name: "GP", value: `${s.gamesPlayed}`, inline: true },
        { name: "+/-", value: `${s.plusMinus}`, inline: true },
        { name: "PIM", value: `${s.pim}`, inline: true },
        { name: "S", value: `${s.shots}`, inline: true },
        { name: "S%", value: pct(s.shootingPctg), inline: true },
        { name: "PPG/PPP", value: `${s.powerPlayGoals}/${s.powerPlayPoints}`, inline: true },
        { name: "SHG/SHP", value: `${s.shorthandedGoals}/${s.shorthandedPoints}`, inline: true },
        { name: "GWG", value: `${s.gameWinningGoals}`, inline: true },
        { name: "OTG", value: `${s.otGoals}`, inline: true },
      );
      if (mp) {
        const xGF = Number(mp.I_F_xGoals);
        const goals = Number(mp.I_F_goals);
        embed.addFields(
          { name: "\u200B", value: "**MoneyPuck Analytics**", inline: false },
          { name: "xG", value: fix2(xGF), inline: true },
          { name: "G-xG", value: fix2(goals - xGF), inline: true },
          { name: "Game Score", value: fix2(mp.gameScore), inline: true },
          { name: "CF%", value: pct(Number(mp.onIce_corsiPercentage)), inline: true },
          { name: "xGF%", value: pct(Number(mp.onIce_xGoalsPercentage)), inline: true },
          { name: "HD Goals", value: `${mp.I_F_highDangerGoals}`, inline: true },
          { name: "1st Assists", value: `${mp.I_F_primaryAssists}`, inline: true },
          { name: "Hits", value: `${mp.I_F_hits}`, inline: true },
          { name: "Takeaways", value: `${mp.I_F_takeaways}`, inline: true },
        );
      }
    }

    embed.setFooter({ text: "Data: NHL API + MoneyPuck" });
    await interaction.editReply({ embeds: [embed] });
  } catch (e) {
    if (interaction.deferred) await interaction.editReply("Check your parameters!");
    else await checkParams(interaction);
  }
};
module.exports = { seasonStats };
