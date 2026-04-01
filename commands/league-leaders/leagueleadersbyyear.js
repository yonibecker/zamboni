const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

const leagueLeadersByYear = async (interaction) => {
  try {
    await interaction.deferReply();
    const year = interaction.options.getString("year");

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
      {data: {data: rookieGoals} },
      {data: {data: rookieAssists} },
      {data: {data: rookiePoints} },
      {data: {data: rookiePenaltyMinutes} },
      {data: {data: rookiePointsPerGame} },
    ] = await getData(year);

    const embed = new EmbedBuilder()
      .setColor(0xf2432c)
      .setTitle(`${year} League Leaders`).setDescription(`
    **Skaters**
    Goals: ${goals[0].skaterFullName}, ${goals[0].teamAbbrevs}: ${goals[0].goals}
    Assists: ${assists[0].skaterFullName}, ${assists[0].teamAbbrevs}: ${assists[0].assists}
    Points: ${points[0].skaterFullName}, ${points[0].teamAbbrevs}: ${points[0].points}
    PIM: ${penaltyMinutes[0].skaterFullName}, ${penaltyMinutes[0].teamAbbrevs}: ${penaltyMinutes[0].penaltyMinutes}
    P/GP: ${pointsPerGame[0].skaterFullName}, ${pointsPerGame[0].teamAbbrevs}: ${pointsPerGame[0].pointsPerGame.toFixed(2)}
    Shots: ${shots[0].skaterFullName}, ${shots[0].teamAbbrevs}: ${shots[0].shots}
    Blocked Shots: ${blockedShots[0].skaterFullName}, ${blockedShots[0].teamAbbrevs}: ${blockedShots[0].blockedShots}
    Hits: ${hits[0].skaterFullName}, ${hits[0].teamAbbrevs}: ${hits[0].hits}

    **Goalies**
    Goals Against Average: ${gaa[0].goalieFullName}, ${gaa[0].teamAbbrevs}: ${gaa[0].goalsAgainstAverage.toFixed(2)}
    Save Percentage: ${savePct[0].goalieFullName}, ${savePct[0].teamAbbrevs}: ${savePct[0].savePct.toFixed(3)}%
    Wins: ${wins[0].goalieFullName}, ${wins[0].teamAbbrevs}: ${wins[0].wins}

    **Defensemen**
    Goals: ${defensemanGoals[0].skaterFullName}, ${defensemanGoals[0].teamAbbrevs}: ${defensemanGoals[0].goals}
    Assists: ${defensemanAssists[0].skaterFullName}, ${defensemanAssists[0].teamAbbrevs}: ${defensemanAssists[0].assists}
    Points: ${defensemanPoints[0].skaterFullName}, ${defensemanPoints[0].teamAbbrevs}: ${defensemanPoints[0].points}
    PIM: ${defensemanPenaltyMinutes[0].skaterFullName}, ${defensemanPenaltyMinutes[0].teamAbbrevs}: ${defensemanPenaltyMinutes[0].penaltyMinutes}
    P/GP: ${defensemanPointsPerGame[0].skaterFullName}, ${defensemanPointsPerGame[0].teamAbbrevs}: ${defensemanPointsPerGame[0].pointsPerGame.toFixed(2)}

    **Rookies**
    Goals: ${rookieGoals[0].skaterFullName}, ${rookieGoals[0].teamAbbrevs}: ${rookieGoals[0].goals}
    Assists: ${rookieAssists[0].skaterFullName}, ${rookieAssists[0].teamAbbrevs}: ${rookieAssists[0].assists}
    Points: ${rookiePoints[0].skaterFullName}, ${rookiePoints[0].teamAbbrevs}: ${rookiePoints[0].points}
    PIM: ${rookiePenaltyMinutes[0].skaterFullName}, ${rookiePenaltyMinutes[0].teamAbbrevs}: ${rookiePenaltyMinutes[0].penaltyMinutes}
    P/GP: ${rookiePointsPerGame[0].skaterFullName}, ${rookiePointsPerGame[0].teamAbbrevs}: ${rookiePointsPerGame[0].pointsPerGame.toFixed(2)}
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

const getData = async (year) => {
  const sk = (prop, extra = "gamesPlayed%3E=1") =>
    axios.get(`https://api.nhle.com/stats/rest/en/skater/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22${prop}%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=50&factCayenneExp=${extra}&cayenneExp=gameTypeId=2%20and%20seasonId%3C=${year}%20and%20seasonId%3E=${year}`);
  const skD = (prop, extra = "gamesPlayed%3E=1") =>
    axios.get(`https://api.nhle.com/stats/rest/en/skater/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22${prop}%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=50&factCayenneExp=${extra}&cayenneExp=gameTypeId=2%20and%20positionCode%3D%22D%22%20and%20seasonId%3C=${year}%20and%20seasonId%3E=${year}`);
  const skR = (prop, extra = "gamesPlayed%3E=1") =>
    axios.get(`https://api.nhle.com/stats/rest/en/skater/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22${prop}%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=50&factCayenneExp=${extra}&cayenneExp=gameTypeId=2%20and%20isRookie=%221%22%20and%20seasonId%3C=${year}%20and%20seasonId%3E=${year}`);
  const gl = (prop, extra = "gamesPlayed%3E=1") =>
    axios.get(`https://api.nhle.com/stats/rest/en/goalie/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22${prop}%22,%22direction%22:%22${prop === "goalsAgainstAverage" ? "ASC" : "DESC"}%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=50&factCayenneExp=${extra}&cayenneExp=gameTypeId=2%20and%20seasonId%3C=${year}%20and%20seasonId%3E=${year}`);
  const rt = (prop) =>
    axios.get(`https://api.nhle.com/stats/rest/en/skater/realtime?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22${prop}%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=50&factCayenneExp=gamesPlayed%3E=1&cayenneExp=gameTypeId=2%20and%20seasonId%3C=${year}%20and%20seasonId%3E=${year}`);

  return Promise.all([
    sk("goals"), sk("assists"), sk("points"), sk("penaltyMinutes"),
    sk("pointsPerGame", "gamesPlayed%3E=10"), sk("shots"),
    gl("goalsAgainstAverage", "gamesPlayed%3E=1%20and%20gamesPlayed%3E=10"),
    gl("savePct", "gamesPlayed%3E=1%20and%20gamesPlayed%3E=10"),
    gl("wins"),
    rt("hits"), rt("blockedShots"),
    skD("points"), skD("goals"), skD("assists"), skD("penaltyMinutes"),
    skD("pointsPerGame", "gamesPlayed%3E=1%20and%20gamesPlayed%3E=10"),
    skR("goals"), skR("assists"), skR("points"), skR("penaltyMinutes"),
    skR("pointsPerGame", "gamesPlayed%3E=1%20and%20gamesPlayed%3E=10"),
  ]);
};

module.exports = { leagueLeadersByYear };
