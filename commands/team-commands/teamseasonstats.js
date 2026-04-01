const Discord = require("discord.js");
const prefix = "h:";
const { getTeamId } = require("@nhl-api/teams");
const axios = require("axios");
const svg2img = require("svg2img");
const fs = require("fs");
const { checkParams } = require("../error-handling/checkparams.js");

const getSVGSource = async (id) => {
  const { data } = await axios.get(
    `https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${id}.svg`
  );
  return data;
};

const convertSVGStringToImage = async (id) => {
  var svgString = await getSVGSource(id);
  return new Promise((resolve, reject) => {
    svg2img(svgString, (error, buffer) => {
      if (error) return reject(error);
      const publicFilePath = `/team-images/${id}.png`;
      const fullFilePath = `static${publicFilePath}`;
      fs.writeFileSync(fullFilePath, buffer);
      resolve(publicFilePath);
    });
  });
};

const teamSeasonStats = async (message) => {
  try {
    var args = message.content.slice(prefix.length).trim().split(" ");
    args.shift();
    var team = args.join(" ");
    const id = getTeamId(team);
    var response = await axios.get(
      `https://statsapi.web.nhl.com/api/v1/teams/${id}/?expand=team.stats`
    );
    var data = response.data;

    const imageFilePath = await convertSVGStringToImage(id);
    const fullyQualifiedPath = `${process.env.BASE_URL || ""}${imageFilePath}`;

    var embed = new Discord.MessageEmbed()
      .setColor(`#f2432c`)
      .setTitle(`${data["teams"][0]["name"]} Team Stats`)
      .setThumbnail(fullyQualifiedPath)
      .setDescription(`
**Wins:** ${data["teams"][0]["teamStats"][0]["splits"][0]["stat"]["wins"]}
**Losses:** ${data["teams"][0]["teamStats"][0]["splits"][0]["stat"]["losses"]}
**Overtime Losses:** ${data["teams"][0]["teamStats"][0]["splits"][0]["stat"]["ot"]}
**Points:** ${data["teams"][0]["teamStats"][0]["splits"][0]["stat"]["pts"]}
**Point Percentage:** ${Number(data["teams"][0]["teamStats"][0]["splits"][0]["stat"]["ptPctg"]) ? Number(data["teams"][0]["teamStats"][0]["splits"][0]["stat"]["ptPctg"]).toFixed(2) : "undefined"}%
**Goals Per Game:** ${data["teams"][0]["teamStats"][0]["splits"][0]["stat"]["goalsPerGame"] ? data["teams"][0]["teamStats"][0]["splits"][0]["stat"]["goalsPerGame"].toFixed(2) : "undefined"}
**Power Play Percentage:** ${Number(data["teams"][0]["teamStats"][0]["splits"][0]["stat"]["powerPlayPercentage"]) ? Number(data["teams"][0]["teamStats"][0]["splits"][0]["stat"]["powerPlayPercentage"]).toFixed(2) : "undefined"}%
**Penalty Kill Percentage:** ${Number(data["teams"][0]["teamStats"][0]["splits"][0]["stat"]["penaltyKillPercentage"]) ? Number(data["teams"][0]["teamStats"][0]["splits"][0]["stat"]["penaltyKillPercentage"]).toFixed(2) : "undefined"}%
**Shots Per Game:** ${data["teams"][0]["teamStats"][0]["splits"][0]["stat"]["shotsPerGame"] ? data["teams"][0]["teamStats"][0]["splits"][0]["stat"]["shotsPerGame"].toFixed(2) : "undefined"}
**Shots Allowed Per Game:** ${data["teams"][0]["teamStats"][0]["splits"][0]["stat"]["shotsAllowed"] ? data["teams"][0]["teamStats"][0]["splits"][0]["stat"]["shotsAllowed"].toFixed(2) : "undefined"}
**Faceoff Win Percentage:** ${Number(data["teams"][0]["teamStats"][0]["splits"][0]["stat"]["faceOffWinPercentage"]) ? Number(data["teams"][0]["teamStats"][0]["splits"][0]["stat"]["faceOffWinPercentage"]).toFixed(2) : "undefined"}%
    `);
    message.channel.send(embed);
  } catch (e) {
    checkParams(message, args);
  }
}
module.exports = {
  teamSeasonStats
};
