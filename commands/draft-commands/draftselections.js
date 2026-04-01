const Discord = require("discord.js");
const prefix = "h:";
const axios = require("axios");
const { checkParams } = require("../error-handling/checkparams.js");

const draftSelections = async (message) => {
  try {
    var args = message.content.slice(prefix.length).trim().split(" ");
    args.shift();
    const year = args[0];
    const startPick = parseInt(args[1]);
    const endPick = parseInt(args[2]);

    if (!year || !startPick || !endPick || startPick > endPick) {
      checkParams(message, args);
      return;
    }

    const { data } = await axios.get(
      `https://records.nhl.com/site/api/draft?cayenneExp=draftYear=${year}&sort=[{%22property%22:%22overallPickNumber%22,%22direction%22:%22ASC%22}]`
    );

    const picks = data.data.filter(
      (p) => p.overallPickNumber >= startPick && p.overallPickNumber <= endPick
    );

    if (picks.length === 0) {
      message.channel.send(`No draft picks found for ${year} picks ${startPick}-${endPick}.`);
      return;
    }

    var embed_desc = "";
    picks.forEach((pick) => {
      embed_desc += `**${pick.roundNumber}-${pick.pickInRound}:** ${pick.playerName}, ${pick.triCode}\n`;
    });

    var embed = new Discord.MessageEmbed()
      .setColor(`#f2432c`)
      .setTitle(`${year} NHL Entry Draft Picks ${startPick}-${endPick}`)
      .setDescription(embed_desc);
    message.channel.send(embed);
  } catch (e) {
    checkParams(message, args);
  }
};
module.exports = {
  draftSelections,
};
