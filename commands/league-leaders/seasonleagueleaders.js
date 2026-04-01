const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
const { getCurrentSeason } = require("../../utils/season.js");

const seasonLeagueLeaders = async (interaction) => {
  try {
    await interaction.deferReply();
    const season = getCurrentSeason();
    const seasonStr = `${season.slice(0, 4)}-${season.slice(6)}`;

    const [
      { data: { data: goals } },
      { data: { data: assists } },
      { data: { data: points } },
      { data: { data: gaa } },
      { data: { data: savePct } },
      { data: { data: wins } },
      { data: { data: hits } },
      { data: { data: blockedShots } },
    ] = await getData(season);

    const fmt = (p, stat) => `${p.skaterFullName} (${p.teamAbbrevs}) - **${p[stat]}**`;
    const fmtG = (p, stat, fn) => `${p.goalieFullName} (${p.teamAbbrevs}) - **${fn ? fn(p[stat]) : p[stat]}**`;

    const embed = new EmbedBuilder()
      .setColor(0xf2432c)
      .setTitle(`${seasonStr} League Leaders`)
      .addFields(
        { name: "Goals", value: fmt(goals[0], "goals"), inline: true },
        { name: "Assists", value: fmt(assists[0], "assists"), inline: true },
        { name: "Points", value: fmt(points[0], "points"), inline: true },
        { name: "Hits", value: `${hits[0].skaterFullName} (${hits[0].teamAbbrevs}) - **${hits[0].hits}**`, inline: true },
        { name: "Blocked Shots", value: `${blockedShots[0].skaterFullName} (${blockedShots[0].teamAbbrevs}) - **${blockedShots[0].blockedShots}**`, inline: true },
        { name: "\u200B", value: "\u200B", inline: true },
        { name: "GAA", value: fmtG(gaa[0], "goalsAgainstAverage", (v) => v.toFixed(2)), inline: true },
        { name: "SV%", value: fmtG(savePct[0], "savePct", (v) => v.toFixed(3)), inline: true },
        { name: "Wins", value: fmtG(wins[0], "wins"), inline: true },
      );

    await interaction.editReply({ embeds: [embed] });
  } catch (e) {
    if (interaction.deferred) await interaction.editReply("Something went wrong fetching league leaders.");
    else await interaction.reply({ content: "Something went wrong.", ephemeral: true });
  }
};

const getData = async (season) => {
  const sk = (prop, extra = "gamesPlayed%3E=1") =>
    axios.get(`https://api.nhle.com/stats/rest/en/skater/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22${prop}%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=1&factCayenneExp=${extra}&cayenneExp=gameTypeId=2%20and%20seasonId%3C=${season}%20and%20seasonId%3E=${season}`);
  const gl = (prop, dir = "DESC", extra = "gamesPlayed%3E=10") =>
    axios.get(`https://api.nhle.com/stats/rest/en/goalie/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22${prop}%22,%22direction%22:%22${dir}%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=1&factCayenneExp=${extra}&cayenneExp=gameTypeId=2%20and%20seasonId%3C=${season}%20and%20seasonId%3E=${season}`);
  const rt = (prop) =>
    axios.get(`https://api.nhle.com/stats/rest/en/skater/realtime?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22${prop}%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=1&factCayenneExp=gamesPlayed%3E=1&cayenneExp=gameTypeId=2%20and%20seasonId%3C=${season}%20and%20seasonId%3E=${season}`);

  return Promise.all([
    sk("goals"), sk("assists"), sk("points"),
    gl("goalsAgainstAverage", "ASC"), gl("savePct"), gl("wins"),
    rt("hits"), rt("blockedShots"),
  ]);
};

module.exports = { seasonLeagueLeaders };
