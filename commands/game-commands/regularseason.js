const Discord = require("discord.js");
const prefix = "h:";
const { getPlayerId } = require("@nhl-api/players");
const { getTeamId } = require("@nhl-api/teams");
const axios = require("axios");
const { checkParams } = require("../error-handling/checkparams.js");

const regularSeason = async(message) => {
  var args = message.content.slice(prefix.length).trim().split(" ");
  args.shift();
  const game = args[0];
  var response = await axios.get(`https://statsapi.web.nhl.com/api/v1/game/${game}/feed/live`)
  const data = await response.data;
  
}
module.exports = {
  regularSeason,
}