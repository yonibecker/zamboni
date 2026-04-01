const axios = require("axios");
const teams = require("@nhl-api/teams").default;

const API_BASE = "https://api-web.nhle.com/v1";

const POSITION_NAMES = {
  C: "Center",
  L: "Left Wing",
  R: "Right Wing",
  D: "Defenseman",
  G: "Goalie",
};

const getPlayerLanding = async (id) => {
  const { data } = await axios.get(`${API_BASE}/player/${id}/landing`);
  return data;
};

const getStandings = async () => {
  const { data } = await axios.get(`${API_BASE}/standings/now`);
  return data.standings;
};

const getRoster = async (teamAbbrev) => {
  const { data } = await axios.get(`${API_BASE}/roster/${teamAbbrev}/current`);
  return data;
};

const getTeamAbbreviation = (teamName) => {
  const normalized = teamName.toUpperCase();
  const team = teams.find(
    (t) =>
      t.name === normalized ||
      t.abbreviation === normalized ||
      t.name.includes(normalized) ||
      normalized.includes(t.name.split(" ").pop()) ||
      (t.nicknames && t.nicknames.some((n) => normalized.includes(n)))
  );
  return team ? team.abbreviation : null;
};

const getTeamFromStandings = (standings, teamAbbrev) => {
  return standings.find((t) => t.teamAbbrev.default === teamAbbrev);
};

const formatHeight = (inches) => {
  return `${Math.floor(inches / 12)}' ${inches % 12}"`;
};

const positionName = (code) => POSITION_NAMES[code] || code;

const isGoalie = (position) => position === "G";

const calculateOnPace = (stat, gamesPlayed, totalGames = 82) => {
  if (!gamesPlayed) return 0;
  return Math.round((stat / gamesPlayed) * totalGames);
};

module.exports = {
  getPlayerLanding,
  getStandings,
  getRoster,
  getTeamAbbreviation,
  getTeamFromStandings,
  formatHeight,
  positionName,
  isGoalie,
  calculateOnPace,
};
