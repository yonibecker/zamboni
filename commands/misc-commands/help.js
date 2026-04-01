const Discord = require("discord.js");
const prefix = "h:";
const logo = process.env.BASE_URL ? `${process.env.BASE_URL}/zamboni.png` : undefined;
const { invalidCommand } = require("../error-handling/invalidcommand.js");

const sendHelp = (message) => {
  var commands = {
    careerstats: {
      Syntax: "`h:careerstats [Player]`",
      Category: "Player Commands",
      Description: "Returns a player's career stats.",
      Example: "`h:careerstats Wayne Gretzky`",
    },
    playerinfo: {
      Syntax: "`h:playerinfo [Player]`",
      Category: "Player Commands",
      Description: "Returns a player's basic info.",
      Example: "`h:playerinfo Connor McDavid`",
    },
    seasonstats: {
      Syntax: "`h:seasonstats [Player]`",
      Category: "Player Commands",
      Description: "Returns a player's season stats.",
      Example: "`h:seasonstats Nathan MacKinnon`",
    },
    statsbyyear: {
      Syntax: "`h:statsbyyear [Player] [Year]`",
      Category: "Player Commands",
      Description: "Returns a player's stats in a certain year.",
      Example: "`h:statsbyyear Jaromir Jagr 19951996`",
    },
    teaminfo: {
      Syntax: "`h:teaminfo [Team]`",
      Category: "Team Commands",
      Description: "Returns a team's basic info.",
      Example: "`h:teaminfo Washington Capitals`",
    },
    teamseasonstats: {
      Syntax: "`h:teamseasonstats [Team]`",
      Category: "Team Commands",
      Description: "Returns a team's season stats.",
      Example: "`h:teamseasonstats Carolina Hurricanes`",
    },
    teamstatsbyyear: {
      Syntax: "`h:teamstatsbyyear [Team] [Year]`",
      Category: "Team Commands",
      Description: "Returns a team's stats for a specific year.",
      Example: "`h:teamstatsbyyear Tampa Bay Lightning 20182019`",
    },
    draftselections: {
      Syntax: "`h:draftselections [Year] [Start Pick] [End Pick]`",
      Category: "Team Commands",
      Description: "Returns draft picks from start pick to end pick.",
      Example: "`h:draftselections 2015 1 3`",
    },
    info: {
      Syntax: "`h:info`",
      Category: "Misc Commands",
      Description: "Returns Zamboni's information.",
      Example: "`h:info`",
    },
    maintenance: {
      Syntax: "`h:maintenance`",
      Category: "Misc Commands",
      Description: "Lists Zamboni's maintenance times.",
      Example: "`h:maintenance`",
    },
    say: {
      Syntax: "`h:say [Phrase]`",
      Category: "Misc Commands",
      Description: "Repeats a phrase back at you.",
      Example: "`h:say Let's Go Caps!`",
    },
    vote: {
      Syntax: "`h:vote`",
      Category: "Misc Commands",
      Description: "Vote for Zamboni on top.gg!",
      Example: "`h:vote`",
    },
    teamroster: {
      Syntax: "`h:teamroster [Team]`",
      Category: "Team Commands",
      Description: "Returns a team's roster.",
      Example: "`h:teamroster Minnesota Wild`",
    },
    seasonleagueleaders: {
      Syntax: "`h:seasonleagueleaders`",
      Category: "League Leader Commands",
      Description: "Returns season league leaders.",
      Example: "`h:seasonleagueleaders`",
    },
    leagueleadersbyyear: {
      Syntax: "`h:leagueleadersbyyear [Year]`",
      Category: "League Leader Commands",
      Description: "Returns league leaders for a specific year.",
      Example: "`h:leagueleadersbyyear 20102011`",
    },
    alltimeleagueleaders: {
      Syntax: "`h:alltimeleagueleaders`",
      Category: "League Leader Commands",
      Description: "Returns all-time league leaders.",
      Example: "`h:alltimeleagueleaders`",
    },
    onpace: {
      Syntax: "`h:onpace [Player]`",
      Category: "Player Commands",
      Description: "Returns a player's on-pace stats for the current season.",
      Example: "`h:onpace Artemi Panarin`",
    },
  };
  var args = message.content.slice(prefix.length).trim().split(" ");
  args.shift();
  if (args.length > 0 && args[0] !== "") {
    if (commands[args] == undefined) {
      invalidCommand(message, args);
      return;
    } else {
      var embed = new Discord.MessageEmbed()
        .setAuthor("Command Help - " + args, logo)
        .setColor(`#f2432c`).setDescription(`
**Syntax**: ${commands[args]["Syntax"]}
**Category:** ${commands[args]["Category"]} 
**Description**: ${commands[args]["Description"]} 
**Example**: ${commands[args]["Example"]}  
    `);
      message.channel.send(embed);
      return;
    }
  }
  var embed = new Discord.MessageEmbed()
    .setColor(`#f2432c`)
    .setAuthor("Zamboni Help", logo)
    .setDescription(`
**Player Commands**
\`careerstats\` - Returns a player's career stats.
\`onpace\` - Returns a player's on-pace stats for the current season.
\`playerinfo\` - Returns a player's basic info.
\`seasonstats\` - Returns a player's current season stats.
\`statsbyyear\` - Returns a player's stats in a certain year.

**Team Commands**
\`teaminfo\` - Returns a team's basic info.
\`teamroster\` - Returns a team's roster.
\`teamseasonstats\` - Returns a team's season stats.
\`teamstatsbyyear\` - Returns a team's season stats for a specific year.

**League Leader Commands**
\`alltimeleagueleaders\` - Returns all-time league leaders.
\`leagueleadersbyyear\` - Returns league leaders for a specific year.
\`seasonleagueleaders\` - Returns current league leaders.

**Draft Commands**
\`draftselections\` - Returns draft picks from start pick to end pick.

**Misc Commands**
\`info\` - Returns Zamboni's information.
\`maintenance\` - Returns Zamboni maintenance times.
\`say\` - Repeats a phrase back at you.
\`vote\` - Vote for Zamboni on top.gg!
  `)
    .setFooter(`Do h:help [command] for help on a specific command.`);
  message.channel.send(embed);
};
module.exports = {
  sendHelp,
};
