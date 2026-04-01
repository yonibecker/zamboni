const Discord = require("discord.js");
const prefix = "h:";
const axios = require("axios");
const { checkParams } = require("../error-handling/checkparams.js");

const draftSelections = async (message) => {
  try {
    var args = message.content.slice(prefix.length).trim().split(" ");
    args.shift();
    const year = args[0];
    var xSelectionsStart = args[1];
    var xSelectionsEnd = args[2];
    var xSelectionsStart_unchanged = xSelectionsStart;
    var xSelectionsEnd_unchanged = xSelectionsEnd;
    if (!xSelectionsEnd_unchanged || !xSelectionsStart_unchanged || xSelectionsStart_unchanged > xSelectionsEnd_unchanged) {
      checkParams(message, args);
      return;
    }
    var response = await axios.get(
      `https://statsapi.web.nhl.com/api/v1/draft/${year}`
    );
    const data = await response.data;

    var embed_desc = "";
    var target = data["drafts"][0]["rounds"][0]["picks"];
    var round = 1;
    for (var i = xSelectionsStart - 1; i < xSelectionsEnd; i++) {
      if (data["drafts"][0]["rounds"][0]["picks"][i] === undefined) {
        round += 1;
        target = data["drafts"][0]["rounds"][round - 1]["picks"];
        i -= data["drafts"][0]["rounds"][0]["picks"].length + 1;
        xSelectionsEnd -= data["drafts"][0]["rounds"][0]["picks"].length;
        continue;
      }
      embed_desc += `**${round}-${target[i]["pickInRound"]}:** ${target[i]["prospect"]["fullName"]}, ${target[i]["team"]["name"]}\n`;
    }
    var embed = new Discord.MessageEmbed()
      .setColor(`#f2432c`)
      .setTitle(
        `${year} NHL Entry Draft Picks ${xSelectionsStart_unchanged}-${xSelectionsEnd_unchanged}`
      )
      .setDescription(embed_desc);
    message.channel.send(embed);
  } catch (e) {
    checkParams(message, args);
  }
};
module.exports = {
  draftSelections,
};
