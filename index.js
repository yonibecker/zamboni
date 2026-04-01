const Discord = require("discord.js");
const prefix = "h:";
const client = new Discord.Client();
const express = require("express");
const app = express();
require("dotenv").config();

app.use(express.static("static"));
app.get("/", (req, res) => res.send("Zamboni Webserver is online!"));
app.listen(process.env.PORT || 4000);


const { statsByYear } = require("./commands/player-commands/statsbyyear.js");
const { seasonStats } = require("./commands/player-commands/seasonstats.js");
const { careerStats } = require("./commands/player-commands/careerstats.js");
const { playerInfo } = require("./commands/player-commands/playerinfo.js");
const { sendHelp } = require("./commands/misc-commands/help.js");
const { sayMessage } = require("./commands/misc-commands/say.js");
const { zamboniInfo } = require("./commands/misc-commands/info.js");
const { zamboniMaintenance } = require("./commands/misc-commands/maintenance.js");
const { voteForZamboni } = require("./commands/misc-commands/vote.js");
const { teamInfo } = require("./commands/team-commands/teaminfo.js");
const { teamSeasonStats } = require("./commands/team-commands/teamseasonstats.js");
const { teamStatsByYear } = require("./commands/team-commands/teamstatsbyyear.js");
const { teamRoster } = require("./commands/team-commands/teamroster.js");
const { draftSelections } = require("./commands/draft-commands/draftselections.js");
const { invalidCommand } = require("./commands/error-handling/invalidcommand.js");
const { checkParams } = require("./commands/error-handling/checkparams.js");
const { seasonLeagueLeaders } = require("./commands/league-leaders/seasonleagueleaders.js");
const { leagueLeadersByYear } = require("./commands/league-leaders/leagueleadersbyyear.js");
const { allTimeLeagueLeaders } = require("./commands/league-leaders/alltimeleagueleaders.js")
const { onPace } = require("./commands/player-commands/onpace.js");

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  var activity = `h:help`
  client.user.setPresence({
    activity: {
      name: activity,
      type: "PLAYING"
    },
    status: "online"
  })
})

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (command == "statsbyyear") {
    statsByYear(message, args);
  } else if (command == "help") {
    sendHelp(message, args);
  } else if (command == "say") {
    sayMessage(message, args);
  } else if (command == "seasonstats") {
    seasonStats(message, args);
  } else if (command == "careerstats") {
    careerStats(message, args);
  } else if (command == "playerinfo") {
    playerInfo(message, args);
  } else if (command == "teaminfo") {
    teamInfo(message, args);
  } else if (command == "teamseasonstats") {
    teamSeasonStats(message, args);
  } else if (command == "teamstatsbyyear") {
    teamStatsByYear(message, args);
  } else if (command == "info") {
    zamboniInfo(message, args);
  } else if (command == "draftselections") {
    draftSelections(message, args);
  } else if (command == "maintenance") {
    zamboniMaintenance(message, args);
  } else if (command == "vote") {
    voteForZamboni(message, args);
  } else if (command == "teamroster") {
    teamRoster(message, args);
  } else if (command == "seasonleagueleaders") {
    seasonLeagueLeaders(message, args);
  } else if (command == "leagueleadersbyyear") {
    leagueLeadersByYear(message, args)
  } else if (command == "alltimeleagueleaders") {
    allTimeLeagueLeaders(message, args)
  } else if (command == "onpace") {
    onPace(message, args)
  }
  else if (command == "") {
    checkParams(message, args);
  } else {
    invalidCommand(message, args);
  }
});
client.login(process.env.TOKEN);
