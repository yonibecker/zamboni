const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
const { getCurrentSeason } = require("../../utils/season.js");

const allTimeLeagueLeaders = async (interaction) => {
  try {
    await interaction.deferReply();

    const [
      { data: { data: goals } },
      { data: { data: assists } },
      { data: { data: points } },
      { data: { data: gaa } },
      { data: { data: savePct } },
      { data: { data: wins } },
    ] = await getData();

    const fmt = (p, stat) => `${p.skaterFullName} - **${p[stat]}**`;
    const fmtG = (p, stat, fn) => `${p.goalieFullName} - **${fn ? fn(p[stat]) : p[stat]}**`;

    const embed = new EmbedBuilder()
      .setColor(0xf2432c)
      .setTitle("All-Time League Leaders")
      .addFields(
        { name: "Goals", value: fmt(goals[0], "goals"), inline: true },
        { name: "Assists", value: fmt(assists[0], "assists"), inline: true },
        { name: "Points", value: fmt(points[0], "points"), inline: true },
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

const getData = async () => {
  const season = getCurrentSeason();
  const sk = (prop) =>
    axios.get(`https://api.nhle.com/stats/rest/en/skater/summary?isAggregate=true&isGame=false&sort=%5B%7B%22property%22:%22${prop}%22,%22direction%22:%22DESC%22%7D%5D&start=0&limit=1&factCayenneExp=gamesPlayed%3E=1&cayenneExp=gameTypeId=2%20and%20seasonId%3C=${season}%20and%20seasonId%3E=19171918`);
  const gl = (prop, dir = "DESC", extra = "gamesPlayed%3E=100") =>
    axios.get(`https://api.nhle.com/stats/rest/en/goalie/summary?isAggregate=true&isGame=false&sort=%5B%7B%22property%22:%22${prop}%22,%22direction%22:%22${dir}%22%7D%5D&start=0&limit=1&factCayenneExp=${extra}&cayenneExp=gameTypeId=2%20and%20seasonId%3C=${season}%20and%20seasonId%3E=19171918`);

  return Promise.all([
    sk("goals"), sk("assists"), sk("points"),
    gl("goalsAgainstAverage", "ASC"), gl("savePct"), gl("wins", "DESC", "gamesPlayed%3E=1"),
  ]);
};

module.exports = { allTimeLeagueLeaders };
