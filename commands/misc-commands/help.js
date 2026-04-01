const { EmbedBuilder } = require("discord.js");
const logo = process.env.BASE_URL ? `${process.env.BASE_URL}/zamboni.png` : undefined;

const commands = {
  careerstats: {
    Syntax: "`/careerstats [Player]`",
    Category: "Player Commands",
    Description: "Returns a player's career stats.",
    Example: "`/careerstats Wayne Gretzky`",
  },
  playerinfo: {
    Syntax: "`/playerinfo [Player]`",
    Category: "Player Commands",
    Description: "Returns a player's basic info.",
    Example: "`/playerinfo Connor McDavid`",
  },
  seasonstats: {
    Syntax: "`/seasonstats [Player]`",
    Category: "Player Commands",
    Description: "Returns a player's season stats.",
    Example: "`/seasonstats Nathan MacKinnon`",
  },
  statsbyyear: {
    Syntax: "`/statsbyyear [Player] [Year]`",
    Category: "Player Commands",
    Description: "Returns a player's stats in a certain year.",
    Example: "`/statsbyyear Jaromir Jagr 19951996`",
  },
  onpace: {
    Syntax: "`/onpace [Player]`",
    Category: "Player Commands",
    Description: "Returns a player's on-pace stats for the current season.",
    Example: "`/onpace Artemi Panarin`",
  },
  teaminfo: {
    Syntax: "`/teaminfo [Team]`",
    Category: "Team Commands",
    Description: "Returns a team's basic info.",
    Example: "`/teaminfo Washington Capitals`",
  },
  teamseasonstats: {
    Syntax: "`/teamseasonstats [Team]`",
    Category: "Team Commands",
    Description: "Returns a team's season stats.",
    Example: "`/teamseasonstats Carolina Hurricanes`",
  },
  teamstatsbyyear: {
    Syntax: "`/teamstatsbyyear [Team] [Year]`",
    Category: "Team Commands",
    Description: "Returns a team's stats for a specific year.",
    Example: "`/teamstatsbyyear Tampa Bay Lightning 20182019`",
  },
  teamroster: {
    Syntax: "`/teamroster [Team]`",
    Category: "Team Commands",
    Description: "Returns a team's roster.",
    Example: "`/teamroster Minnesota Wild`",
  },
  draftselections: {
    Syntax: "`/draftselections [Year] [Start] [End]`",
    Category: "Draft Commands",
    Description: "Returns draft picks from start pick to end pick.",
    Example: "`/draftselections 2015 1 3`",
  },
  seasonleagueleaders: {
    Syntax: "`/seasonleagueleaders`",
    Category: "League Leader Commands",
    Description: "Returns season league leaders.",
    Example: "`/seasonleagueleaders`",
  },
  leagueleadersbyyear: {
    Syntax: "`/leagueleadersbyyear [Year]`",
    Category: "League Leader Commands",
    Description: "Returns league leaders for a specific year.",
    Example: "`/leagueleadersbyyear 20102011`",
  },
  alltimeleagueleaders: {
    Syntax: "`/alltimeleagueleaders`",
    Category: "League Leader Commands",
    Description: "Returns all-time league leaders.",
    Example: "`/alltimeleagueleaders`",
  },
  info: {
    Syntax: "`/info`",
    Category: "Misc Commands",
    Description: "Returns Zamboni's information.",
    Example: "`/info`",
  },
  maintenance: {
    Syntax: "`/maintenance`",
    Category: "Misc Commands",
    Description: "Lists Zamboni's maintenance times.",
    Example: "`/maintenance`",
  },
  say: {
    Syntax: "`/say [Phrase]`",
    Category: "Misc Commands",
    Description: "Repeats a phrase back at you.",
    Example: "`/say Let's Go Caps!`",
  },
  vote: {
    Syntax: "`/vote`",
    Category: "Misc Commands",
    Description: "Vote for Zamboni on top.gg!",
    Example: "`/vote`",
  },
};

const sendHelp = async (interaction) => {
  const cmd = interaction.options.getString("command");

  if (cmd) {
    const info = commands[cmd];
    if (!info) {
      await interaction.reply({ content: `Unknown command: \`${cmd}\`. Use \`/help\` to see all commands.`, ephemeral: true });
      return;
    }
    const embed = new EmbedBuilder()
      .setAuthor({ name: "Command Help - " + cmd, iconURL: logo })
      .setColor(0xf2432c)
      .setDescription(`
**Syntax**: ${info.Syntax}
**Category:** ${info.Category}
**Description**: ${info.Description}
**Example**: ${info.Example}
      `);
    await interaction.reply({ embeds: [embed] });
    return;
  }

  const embed = new EmbedBuilder()
    .setColor(0xf2432c)
    .setAuthor({ name: "Zamboni Help", iconURL: logo })
    .setDescription(`
**Player Commands**
\`/careerstats\` - Returns a player's career stats.
\`/onpace\` - Returns a player's on-pace stats for the current season.
\`/playerinfo\` - Returns a player's basic info.
\`/seasonstats\` - Returns a player's current season stats.
\`/statsbyyear\` - Returns a player's stats in a certain year.

**Team Commands**
\`/teaminfo\` - Returns a team's basic info.
\`/teamroster\` - Returns a team's roster.
\`/teamseasonstats\` - Returns a team's season stats.
\`/teamstatsbyyear\` - Returns a team's season stats for a specific year.

**League Leader Commands**
\`/alltimeleagueleaders\` - Returns all-time league leaders.
\`/leagueleadersbyyear\` - Returns league leaders for a specific year.
\`/seasonleagueleaders\` - Returns current league leaders.

**Draft Commands**
\`/draftselections\` - Returns draft picks from start pick to end pick.

**Misc Commands**
\`/info\` - Returns Zamboni's information.
\`/maintenance\` - Returns Zamboni maintenance times.
\`/say\` - Repeats a phrase back at you.
\`/vote\` - Vote for Zamboni on top.gg!
    `)
    .setFooter({ text: "Use /help [command] for help on a specific command." });
  await interaction.reply({ embeds: [embed] });
};

module.exports = { sendHelp };
