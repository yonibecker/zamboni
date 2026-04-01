const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
const { getCurrentSeason } = require("../../utils/season.js");

const allTimeLeagueLeaders = async (interaction) => {
  try {
    await interaction.deferReply();

    const [
      {data: {data: goals} },
      {data: {data: assists} },
      {data: {data: points} },
      {data: {data: penaltyMinutes} },
      {data: {data: pointsPerGame} },
      {data: {data: shots} },
      {data: {data: gaa} },
      {data: {data: savePct} },
      {data: {data: wins} },
      {data: {data: hits} },
      {data: {data: blockedShots} },
      {data: {data: defensemanPoints} },
      {data: {data: defensemanGoals} },
      {data: {data: defensemanAssists } },
      {data: {data: defensemanPenaltyMinutes} },
      {data: {data: defensemanPointsPerGame} },
    ] = await getData();

    const embed = new EmbedBuilder()
      .setColor(0xf2432c)
      .setTitle(`All Time League Leaders`)
      .setDescription(`
    **Skaters**
    Goals: ${goals[0].skaterFullName}: ${goals[0].goals}
    Assists: ${assists[0].skaterFullName}: ${assists[0].assists}
    Points: ${points[0].skaterFullName}: ${points[0].points}
    PIM: ${penaltyMinutes[0].skaterFullName}: ${penaltyMinutes[0].penaltyMinutes}
    P/GP: ${pointsPerGame[0].skaterFullName}: ${pointsPerGame[0].pointsPerGame.toFixed(2)}
    Shots: ${shots[0].skaterFullName}: ${shots[0].shots}
    Blocked Shots: ${blockedShots[0].skaterFullName}: ${blockedShots[0].blockedShots}
    Hits: ${hits[0].skaterFullName}: ${hits[0].hits}

    **Goalies**
    Goals Against Average: ${gaa[0].goalieFullName}: ${gaa[0].goalsAgainstAverage.toFixed(2)}
    Save Percentage: ${savePct[0].goalieFullName}: ${savePct[0].savePct.toFixed(3)}%
    Wins: ${wins[0].goalieFullName}: ${wins[0].wins}

    **Defensemen**
    Goals: ${defensemanGoals[0].skaterFullName}: ${defensemanGoals[0].goals}
    Assists: ${defensemanAssists[0].skaterFullName}: ${defensemanAssists[0].assists}
    Points: ${defensemanPoints[0].skaterFullName}: ${defensemanPoints[0].points}
    PIM: ${defensemanPenaltyMinutes[0].skaterFullName}: ${defensemanPenaltyMinutes[0].penaltyMinutes}
    P/GP: ${defensemanPointsPerGame[0].skaterFullName}: ${defensemanPointsPerGame[0].pointsPerGame.toFixed(2)}
`);
    await interaction.editReply({ embeds: [embed] });
  } catch (e) {
    if (interaction.deferred) {
      await interaction.editReply("Something went wrong fetching league leaders.");
    } else {
      await interaction.reply({ content: "Something went wrong.", ephemeral: true });
    }
  }
};

const getData = async () => {
  const season = getCurrentSeason();
  const sk = (prop) =>
    axios.get(`https://api.nhle.com/stats/rest/en/skater/summary?isAggregate=true&isGame=false&sort=%5B%7B%22property%22:%22${prop}%22,%22direction%22:%22DESC%22%7D%5D&start=0&limit=50&factCayenneExp=gamesPlayed%3E=1&cayenneExp=gameTypeId=2%20and%20seasonId%3C=${season}%20and%20seasonId%3E=19171918`);
  const skD = (prop) =>
    axios.get(`https://api.nhle.com/stats/rest/en/skater/summary?isAggregate=true&isGame=false&sort=%5B%7B%22property%22:%22${prop}%22,%22direction%22:%22DESC%22%7D%5D&start=0&limit=50&factCayenneExp=gamesPlayed%3E=1&cayenneExp=gameTypeId=2%20and%20positionCode%3D%22D%22%20and%20seasonId%3C=${season}%20and%20seasonId%3E=19171918`);
  const gl = (prop, extra = "gamesPlayed%3E=1") =>
    axios.get(`https://api.nhle.com/stats/rest/en/goalie/summary?isAggregate=true&isGame=false&sort=%5B%7B%22property%22:%22${prop}%22,%22direction%22:%22${prop === "goalsAgainstAverage" ? "ASC" : "DESC"}%22%7D%5D&start=0&limit=50&factCayenneExp=${extra}&cayenneExp=gameTypeId=2%20and%20seasonId%3C=${season}%20and%20seasonId%3E=19171918`);
  const rt = (prop) =>
    axios.get(`https://api.nhle.com/stats/rest/en/skater/realtime?isAggregate=true&isGame=false&sort=%5B%7B%22property%22:%22${prop}%22,%22direction%22:%22DESC%22%7D%5D&start=0&limit=50&factCayenneExp=gamesPlayed%3E=1&cayenneExp=gameTypeId=2%20and%20seasonId%3C=${season}%20and%20seasonId%3E=19171918`);

  return Promise.all([
    sk("goals"), sk("assists"), sk("points"), sk("penaltyMinutes"),
    sk("pointsPerGame"), sk("shots"),
    gl("goalsAgainstAverage", "gamesPlayed%3E=1%20and%20gamesPlayed%3E=100"),
    gl("savePct", "gamesPlayed%3E=1%20and%20gamesPlayed%3E=100"),
    gl("wins"),
    rt("hits"), rt("blockedShots"),
    skD("points"), skD("goals"), skD("assists"), skD("penaltyMinutes"),
    skD("pointsPerGame"),
  ]);
};

module.exports = { allTimeLeagueLeaders };
