const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
const { getTeamAbbreviation } = require("../../utils/nhlapi.js");
const { checkParams } = require("../error-handling/checkparams.js");

const teamStatsByYear = async (interaction) => {
  try {
    const team = interaction.options.getString("team");
    const year = interaction.options.getString("year");
    const abbrev = getTeamAbbreviation(team);
    if (!abbrev || !year) { await checkParams(interaction); return; }

    await interaction.deferReply();
    const { data } = await axios.get(
      `https://api.nhle.com/stats/rest/en/team/summary?isAggregate=false&isGame=false&cayenneExp=seasonId=${year}%20and%20gameTypeId=2`
    );

    const teamData = data.data.find((t) => t.teamTriCode === abbrev);
    if (!teamData) {
      await interaction.editReply(`No stats found for ${team} in ${year}.`);
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0xf2432c)
      .setTitle(`${teamData.teamFullName} ${year} Team Stats`)
      .setDescription(`
**Wins:** ${teamData.wins}
**Losses:** ${teamData.losses}
**OT Losses:** ${teamData.otLosses}
**Points:** ${teamData.points}
**Point Percentage:** ${(teamData.pointPctg * 100).toFixed(1)}%
**Goals For:** ${teamData.goalsFor}
**Goals Against:** ${teamData.goalsAgainst}
**Goals Per Game:** ${teamData.goalsForPerGame.toFixed(2)}
**Goals Against Per Game:** ${teamData.goalsAgainstPerGame.toFixed(2)}
**Power Play Percentage:** ${(teamData.powerPlayPctg * 100).toFixed(1)}%
**Penalty Kill Percentage:** ${(teamData.penaltyKillPctg * 100).toFixed(1)}%
**Shots Per Game:** ${teamData.shotsForPerGame.toFixed(1)}
**Shots Against Per Game:** ${teamData.shotsAgainstPerGame.toFixed(1)}
**Faceoff Win Percentage:** ${(teamData.faceoffWinPctg * 100).toFixed(1)}%
      `);
    await interaction.editReply({ embeds: [embed] });
  } catch (e) {
    if (interaction.deferred) {
      await interaction.editReply("Check your parameters!");
    } else {
      await checkParams(interaction);
    }
  }
};
module.exports = { teamStatsByYear };
