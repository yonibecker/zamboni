const { REST, Routes, SlashCommandBuilder } = require("discord.js");
require("dotenv").config();

const commands = [
  new SlashCommandBuilder()
    .setName("seasonstats")
    .setDescription("Returns a player's current season stats.")
    .addStringOption((o) =>
      o.setName("player").setDescription("Player name (e.g. Connor McDavid)").setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("careerstats")
    .setDescription("Returns a player's career stats.")
    .addStringOption((o) =>
      o.setName("player").setDescription("Player name (e.g. Wayne Gretzky)").setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("statsbyyear")
    .setDescription("Returns a player's stats for a specific season.")
    .addStringOption((o) =>
      o.setName("player").setDescription("Player name (e.g. Jaromir Jagr)").setRequired(true)
    )
    .addStringOption((o) =>
      o.setName("year").setDescription("Season (e.g. 19951996)").setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("playerinfo")
    .setDescription("Returns a player's basic info.")
    .addStringOption((o) =>
      o.setName("player").setDescription("Player name (e.g. Connor McDavid)").setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("onpace")
    .setDescription("Returns a player's on-pace stats for the current season.")
    .addStringOption((o) =>
      o.setName("player").setDescription("Player name (e.g. Artemi Panarin)").setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("teaminfo")
    .setDescription("Returns a team's basic info.")
    .addStringOption((o) =>
      o.setName("team").setDescription("Team name (e.g. Washington Capitals)").setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("teamseasonstats")
    .setDescription("Returns a team's current season stats.")
    .addStringOption((o) =>
      o.setName("team").setDescription("Team name (e.g. Carolina Hurricanes)").setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("teamstatsbyyear")
    .setDescription("Returns a team's stats for a specific season.")
    .addStringOption((o) =>
      o.setName("team").setDescription("Team name (e.g. Tampa Bay Lightning)").setRequired(true)
    )
    .addStringOption((o) =>
      o.setName("year").setDescription("Season (e.g. 20182019)").setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("teamroster")
    .setDescription("Returns a team's roster.")
    .addStringOption((o) =>
      o.setName("team").setDescription("Team name (e.g. Minnesota Wild)").setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("draftselections")
    .setDescription("Returns draft picks from start pick to end pick.")
    .addIntegerOption((o) =>
      o.setName("year").setDescription("Draft year (e.g. 2015)").setRequired(true)
    )
    .addIntegerOption((o) =>
      o.setName("start").setDescription("Start pick number").setRequired(true)
    )
    .addIntegerOption((o) =>
      o.setName("end").setDescription("End pick number").setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("seasonleagueleaders")
    .setDescription("Returns current season league leaders."),
  new SlashCommandBuilder()
    .setName("leagueleadersbyyear")
    .setDescription("Returns league leaders for a specific season.")
    .addStringOption((o) =>
      o.setName("year").setDescription("Season (e.g. 20102011)").setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("alltimeleagueleaders")
    .setDescription("Returns all-time league leaders."),
  new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows all commands or help for a specific command.")
    .addStringOption((o) =>
      o.setName("command").setDescription("Command name").setRequired(false)
    ),
  new SlashCommandBuilder()
    .setName("info")
    .setDescription("Returns Zamboni's information."),
  new SlashCommandBuilder()
    .setName("say")
    .setDescription("Repeats a phrase back at you.")
    .addStringOption((o) =>
      o.setName("phrase").setDescription("The phrase to repeat").setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Vote for Zamboni on top.gg!"),
  new SlashCommandBuilder()
    .setName("maintenance")
    .setDescription("Lists Zamboni's maintenance times."),
].map((cmd) => cmd.toJSON());

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
  try {
    console.log(`Registering ${commands.length} slash commands...`);
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    });
    console.log("Slash commands registered successfully.");
  } catch (error) {
    console.error(error);
  }
})();
