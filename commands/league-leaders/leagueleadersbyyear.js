const Discord = require("discord.js");
const prefix = "h:";
const axios = require("axios");
const { checkParams } = require("../error-handling/checkparams.js");

const leagueLeadersByYear = async (message) => {
  try {
  var args = message.content.slice(prefix.length).trim().split(" ");
  args.shift();
  const year = args[0];

  const getData = async () => {
    return await Promise.all([
      axios.get(
        `https://api.nhle.com/stats/rest/en/skater/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22goals%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=50&factCayenneExp=gamesPlayed%3E=1&cayenneExp=gameTypeId=2%20and%20seasonId%3C=${year}%20and%20seasonId%3E=${year}`
      ),
      axios.get(
        `https://api.nhle.com/stats/rest/en/skater/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22assists%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=50&factCayenneExp=gamesPlayed%3E=1&cayenneExp=gameTypeId=2%20and%20seasonId%3C=${year}%20and%20seasonId%3E=${year}`
      ),
      axios.get(
        `https://api.nhle.com/stats/rest/en/skater/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22points%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=50&factCayenneExp=gamesPlayed%3E=1&cayenneExp=gameTypeId=2%20and%20seasonId%3C=${year}%20and%20seasonId%3E=${year}`
      ),
      axios.get(
        `https://api.nhle.com/stats/rest/en/skater/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22penaltyMinutes%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=50&factCayenneExp=gamesPlayed%3E=1&cayenneExp=gameTypeId=2%20and%20seasonId%3C=${year}%20and%20seasonId%3E=${year}`
      ),
      axios.get(
        `https://api.nhle.com/stats/rest/en/skater/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22pointsPerGame%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=50&factCayenneExp=gamesPlayed%3E=10&cayenneExp=gameTypeId=2%20and%20seasonId%3C=${year}%20and%20seasonId%3E=${year}`
      ),
      axios.get(
        `https://api.nhle.com/stats/rest/en/skater/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22shots%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=50&factCayenneExp=gamesPlayed%3E=1&cayenneExp=gameTypeId=2%20and%20seasonId%3C=${year}%20and%20seasonId%3E=${year}`
      ),
      axios.get(
        `https://api.nhle.com/stats/rest/en/goalie/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22goalsAgainstAverage%22,%22direction%22:%22ASC%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=50&factCayenneExp=gamesPlayed%3E=1%20and%20gamesPlayed%3E=10&cayenneExp=gameTypeId=2%20and%20seasonId%3C=${year}%20and%20seasonId%3E=${year}`
      ),
      axios.get(
        `https://api.nhle.com/stats/rest/en/goalie/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22savePct%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=50&factCayenneExp=gamesPlayed%3E=1%20and%20gamesPlayed%3E=10&cayenneExp=gameTypeId=2%20and%20seasonId%3C=${year}%20and%20seasonId%3E=${year}`
      ),  
      axios.get(
        `https://api.nhle.com/stats/rest/en/goalie/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22wins%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=50&factCayenneExp=gamesPlayed%3E=1&cayenneExp=gameTypeId=2%20and%20seasonId%3C=${year}%20and%20seasonId%3E=${year}`
      ),
      axios.get(
        `https://api.nhle.com/stats/rest/en/skater/realtime?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22hits%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=50&factCayenneExp=gamesPlayed%3E=1&cayenneExp=gameTypeId=2%20and%20seasonId%3C=${year}%20and%20seasonId%3E=${year}`
      ),
      axios.get(
        `https://api.nhle.com/stats/rest/en/skater/realtime?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22blockedShots%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=50&factCayenneExp=gamesPlayed%3E=1&cayenneExp=gameTypeId=2%20and%20seasonId%3C=${year}%20and%20seasonId%3E=${year}`
      ),
      axios.get(
        `https://api.nhle.com/stats/rest/en/skater/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22points%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=50&factCayenneExp=gamesPlayed%3E=1&cayenneExp=gameTypeId=2%20and%20positionCode%3D%22D%22%20and%20seasonId%3C=${year}%20and%20seasonId%3E=${year}`
      ),
      axios.get(
        `https://api.nhle.com/stats/rest/en/skater/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22goals%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=50&factCayenneExp=gamesPlayed%3E=1&cayenneExp=gameTypeId=2%20and%20positionCode%3D%22D%22%20and%20seasonId%3C=${year}%20and%20seasonId%3E=${year}`
      ),
      axios.get(
        `https://api.nhle.com/stats/rest/en/skater/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22assists%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=50&factCayenneExp=gamesPlayed%3E=1&cayenneExp=gameTypeId=2%20and%20positionCode%3D%22D%22%20and%20seasonId%3C=${year}%20and%20seasonId%3E=${year}`
      ),
      axios.get(
        `https://api.nhle.com/stats/rest/en/skater/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22penaltyMinutes%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=50&factCayenneExp=gamesPlayed%3E=1&cayenneExp=gameTypeId=2%20and%20positionCode%3D%22D%22%20and%20seasonId%3C=${year}%20and%20seasonId%3E=${year}`
      ),
      axios.get(
        `https://api.nhle.com/stats/rest/en/skater/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22pointsPerGame%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=50&factCayenneExp=gamesPlayed%3E=1%20and%20gamesPlayed%3E=10&cayenneExp=gameTypeId=2%20and%20positionCode%3D%22D%22%20and%20seasonId%3C=${year}%20and%20seasonId%3E=${year}`
      ),
      axios.get(
        `https://api.nhle.com/stats/rest/en/skater/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22goals%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=50&factCayenneExp=gamesPlayed%3E=1&cayenneExp=gameTypeId=2%20and%20isRookie=%221%22%20and%20seasonId%3C=${year}%20and%20seasonId%3E=${year}`
      ),
      axios.get(
        `https://api.nhle.com/stats/rest/en/skater/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22assists%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=50&factCayenneExp=gamesPlayed%3E=1&cayenneExp=gameTypeId=2%20and%20isRookie=%221%22%20and%20seasonId%3C=${year}%20and%20seasonId%3E=${year}`
      ),
      axios.get(
        `https://api.nhle.com/stats/rest/en/skater/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22points%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=50&factCayenneExp=gamesPlayed%3E=1&cayenneExp=gameTypeId=2%20and%20isRookie=%221%22%20and%20seasonId%3C=${year}%20and%20seasonId%3E=${year}`
      ),
      axios.get(
        `https://api.nhle.com/stats/rest/en/skater/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22penaltyMinutes%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=50&factCayenneExp=gamesPlayed%3E=1&cayenneExp=gameTypeId=2%20and%20isRookie=%221%22%20and%20seasonId%3C=${year}%20and%20seasonId%3E=${year}`
      ),
      axios.get(
        `https://api.nhle.com/stats/rest/en/skater/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22pointsPerGame%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=50&factCayenneExp=gamesPlayed%3E=1%20and%20gamesPlayed%3E=10&cayenneExp=gameTypeId=2%20and%20isRookie=%221%22%20and%20seasonId%3C=${year}%20and%20seasonId%3E=${year}`
      ),
    ])
  }
  
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
  ] = await getData()

  var embed = new Discord.MessageEmbed()
    .setColor(`#f2432c`)
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
    
    **Defenseman**
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
  message.channel.send(embed);
} catch (e) {
    checkParams(message, args)
  }
}

module.exports = {
  leagueLeadersByYear
};