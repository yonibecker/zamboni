const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");
const app = express();
require("dotenv").config();

app.use(express.static("static"));
app.get("/", (req, res) => res.send("Zamboni Webserver is online!"));
app.listen(process.env.PORT || 4000);

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const { statsByYear } = require("./commands/player-commands/statsbyyear.js");
const { seasonStats } = require("./commands/player-commands/seasonstats.js");
const { careerStats } = require("./commands/player-commands/careerstats.js");
const { playerInfo } = require("./commands/player-commands/playerinfo.js");
const { onPace } = require("./commands/player-commands/onpace.js");
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
const { seasonLeagueLeaders } = require("./commands/league-leaders/seasonleagueleaders.js");
const { leagueLeadersByYear } = require("./commands/league-leaders/leagueleadersbyyear.js");
const { allTimeLeagueLeaders } = require("./commands/league-leaders/alltimeleagueleaders.js");

const commandHandlers = {
  statsbyyear: statsByYear,
  seasonstats: seasonStats,
  careerstats: careerStats,
  playerinfo: playerInfo,
  onpace: onPace,
  help: sendHelp,
  say: sayMessage,
  info: zamboniInfo,
  maintenance: zamboniMaintenance,
  vote: voteForZamboni,
  teaminfo: teamInfo,
  teamseasonstats: teamSeasonStats,
  teamstatsbyyear: teamStatsByYear,
  teamroster: teamRoster,
  draftselections: draftSelections,
  seasonleagueleaders: seasonLeagueLeaders,
  leagueleadersbyyear: leagueLeadersByYear,
  alltimeleagueleaders: allTimeLeagueLeaders,
};

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    activities: [{ name: "/help", type: 0 }],
    status: "online",
  });
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const handler = commandHandlers[interaction.commandName];
  if (handler) {
    await handler(interaction);
  }
});

client.login(process.env.TOKEN);
