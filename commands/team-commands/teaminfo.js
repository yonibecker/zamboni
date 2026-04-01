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

const teamInfo = async (message) => {
  try {
    var args = message.content.slice(prefix.length).trim().split(" ");
    args.shift();
    var team = args.join(" ");
    const id = getTeamId(team);
    var response = await axios.get(
      `https://statsapi.web.nhl.com/api/v1/teams/${id}`
    );
    var data = response.data;

    const imageFilePath = await convertSVGStringToImage(id);
    const fullyQualifiedPath = `${process.env.BASE_URL || ""}${imageFilePath}`;

    var embed = new Discord.MessageEmbed()
      .setColor(`#f2432c`)
      .setTitle(`${data["teams"][0]["name"]} Team Info`)
      .setThumbnail(fullyQualifiedPath)
      .setDescription(`
**Team Name:** ${data["teams"][0]["name"]}
**Stadium:** ${data["teams"][0]["venue"]["name"]}
**City:** ${data["teams"][0]["venue"]["city"]}
**Division:** ${data["teams"][0]["division"]["name"]} Division
**Conference:** ${data["teams"][0]["conference"]["name"]} Conference
**Team Website:** ${data["teams"][0]["officialSiteUrl"]}
      `);
    message.channel.send(embed);
  } catch (e) {
    checkParams(message, args);
  }
};
module.exports = {
  teamInfo,
};
