const axios = require("axios");

const API_BASE = "https://api-web.nhle.com/v1";
const STATS_BASE = "https://api.nhle.com/stats/rest/en";

const POSITION_NAMES = {
  C: "Center", L: "Left Wing", R: "Right Wing", D: "Defenseman", G: "Goalie",
};

// Current NHL teams
const NHL_TEAMS = [
  { abbrev: "ANA", name: "Anaheim Ducks", nicknames: ["ducks", "mighty ducks"] },
  { abbrev: "BOS", name: "Boston Bruins", nicknames: ["bruins", "b's"] },
  { abbrev: "BUF", name: "Buffalo Sabres", nicknames: ["sabres", "swords"] },
  { abbrev: "CGY", name: "Calgary Flames", nicknames: ["flames"] },
  { abbrev: "CAR", name: "Carolina Hurricanes", nicknames: ["hurricanes", "canes"] },
  { abbrev: "CHI", name: "Chicago Blackhawks", nicknames: ["blackhawks", "hawks"] },
  { abbrev: "COL", name: "Colorado Avalanche", nicknames: ["avalanche", "avs"] },
  { abbrev: "CBJ", name: "Columbus Blue Jackets", nicknames: ["blue jackets", "jackets"] },
  { abbrev: "DAL", name: "Dallas Stars", nicknames: ["stars"] },
  { abbrev: "DET", name: "Detroit Red Wings", nicknames: ["red wings", "wings"] },
  { abbrev: "EDM", name: "Edmonton Oilers", nicknames: ["oilers"] },
  { abbrev: "FLA", name: "Florida Panthers", nicknames: ["panthers", "cats"] },
  { abbrev: "LAK", name: "Los Angeles Kings", nicknames: ["kings"] },
  { abbrev: "MIN", name: "Minnesota Wild", nicknames: ["wild"] },
  { abbrev: "MTL", name: "Montreal Canadiens", nicknames: ["canadiens", "habs"] },
  { abbrev: "NSH", name: "Nashville Predators", nicknames: ["predators", "preds"] },
  { abbrev: "NJD", name: "New Jersey Devils", nicknames: ["devils", "devs"] },
  { abbrev: "NYI", name: "New York Islanders", nicknames: ["islanders", "isles"] },
  { abbrev: "NYR", name: "New York Rangers", nicknames: ["rangers"] },
  { abbrev: "OTT", name: "Ottawa Senators", nicknames: ["senators", "sens"] },
  { abbrev: "PHI", name: "Philadelphia Flyers", nicknames: ["flyers"] },
  { abbrev: "PIT", name: "Pittsburgh Penguins", nicknames: ["penguins", "pens"] },
  { abbrev: "SJS", name: "San Jose Sharks", nicknames: ["sharks"] },
  { abbrev: "SEA", name: "Seattle Kraken", nicknames: ["kraken"] },
  { abbrev: "STL", name: "St. Louis Blues", nicknames: ["blues"] },
  { abbrev: "TBL", name: "Tampa Bay Lightning", nicknames: ["lightning", "bolts"] },
  { abbrev: "TOR", name: "Toronto Maple Leafs", nicknames: ["maple leafs", "leafs"] },
  { abbrev: "UTA", name: "Utah Mammoth", nicknames: ["mammoth", "utah hockey club", "utah hc"] },
  { abbrev: "VAN", name: "Vancouver Canucks", nicknames: ["canucks", "nucks"] },
  { abbrev: "VGK", name: "Vegas Golden Knights", nicknames: ["golden knights", "knights", "vgk"] },
  { abbrev: "WSH", name: "Washington Capitals", nicknames: ["capitals", "caps"] },
  { abbrev: "WPG", name: "Winnipeg Jets", nicknames: ["jets"] },
];

// ─── API fetchers ──────────────────────────────────────────

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

const getNHLStats = async (type, season, playerId) => {
  const filter = playerId
    ? `&cayenneExp=gameTypeId=2%20and%20seasonId%3C=${season}%20and%20seasonId%3E=${season}%20and%20playerId=${playerId}`
    : `&cayenneExp=gameTypeId=2%20and%20seasonId%3C=${season}%20and%20seasonId%3E=${season}`;
  const { data } = await axios.get(
    `${STATS_BASE}/${type}?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22playerId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=100&factCayenneExp=gamesPlayed%3E=1${filter}`
  );
  return data.data;
};

const getTeamAdvancedStats = async (season) => {
  const [{ data: pct }, { data: rt }, { data: pen }] = await Promise.all([
    axios.get(`${STATS_BASE}/team/percentages?isAggregate=false&isGame=false&cayenneExp=seasonId=${season}%20and%20gameTypeId=2`),
    axios.get(`${STATS_BASE}/team/realtime?isAggregate=false&isGame=false&cayenneExp=seasonId=${season}%20and%20gameTypeId=2`),
    axios.get(`${STATS_BASE}/team/penalties?isAggregate=false&isGame=false&cayenneExp=seasonId=${season}%20and%20gameTypeId=2`),
  ]);
  return { percentages: pct.data, realtime: rt.data, penalties: pen.data };
};

// ─── MoneyPuck ─────────────────────────────────────────────

const getMoneyPuckSkaters = async (season = 2025) => {
  const { data } = await axios.get(
    `https://moneypuck.com/moneypuck/playerData/seasonSummary/${season}/regular/skaters.csv`
  );
  return parseCSV(data);
};

const getMoneyPuckGoalies = async (season = 2025) => {
  const { data } = await axios.get(
    `https://moneypuck.com/moneypuck/playerData/seasonSummary/${season}/regular/goalies.csv`
  );
  return parseCSV(data);
};

const parseCSV = (text) => {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const obj = {};
    headers.forEach((h, i) => (obj[h] = values[i]));
    return obj;
  });
};

const getMoneyPuckPlayer = async (playerId, situation = "all") => {
  const rows = await getMoneyPuckSkaters();
  return rows.find((r) => r.playerId === String(playerId) && r.situation === situation);
};

const getMoneyPuckGoalie = async (playerId, situation = "all") => {
  const rows = await getMoneyPuckGoalies();
  return rows.find((r) => r.playerId === String(playerId) && r.situation === situation);
};

// ─── Player search ─────────────────────────────────────────

const searchPlayer = async (name) => {
  const { data } = await axios.get(
    `https://search.d3.nhle.com/api/v1/search/player?culture=en-us&limit=1&q=${encodeURIComponent(name)}`
  );
  return data.length > 0 ? parseInt(data[0].playerId) : null;
};

let getPlayerId;
try {
  getPlayerId = require("@nhl-api/players").getPlayerId;
} catch (e) {
  getPlayerId = () => null;
}

const resolvePlayerId = async (name) => {
  try {
    const staticId = getPlayerId(name);
    if (staticId) return staticId;
  } catch (e) { /* fall through */ }
  return searchPlayer(name);
};

// ─── Team lookup ───────────────────────────────────────────

const getTeamAbbreviation = (teamName) => {
  const q = teamName.toLowerCase().trim();
  const byAbbrev = NHL_TEAMS.find((t) => t.abbrev.toLowerCase() === q);
  if (byAbbrev) return byAbbrev.abbrev;
  const byName = NHL_TEAMS.find((t) => t.name.toLowerCase() === q);
  if (byName) return byName.abbrev;
  const byNick = NHL_TEAMS.find(
    (t) =>
      t.nicknames.some((n) => n === q) ||
      t.name.toLowerCase().includes(q) ||
      q.includes(t.name.toLowerCase().split(" ").pop())
  );
  return byNick ? byNick.abbrev : null;
};

const getTeamFromStandings = (standings, teamAbbrev) => {
  return standings.find((t) => t.teamAbbrev.default === teamAbbrev);
};

const teamLogo = (abbrev) =>
  `https://a.espncdn.com/i/teamlogos/nhl/500/${abbrev.toLowerCase()}.png`;

// ─── Helpers ───────────────────────────────────────────────

const formatHeight = (inches) =>
  `${Math.floor(inches / 12)}'${inches % 12}"`;

const positionName = (code) => POSITION_NAMES[code] || code;
const isGoalie = (position) => position === "G";

const calculateOnPace = (stat, gamesPlayed, totalGames = 82) => {
  if (!gamesPlayed) return 0;
  return Math.round((stat / gamesPlayed) * totalGames);
};

const pct = (val) => (val != null ? (val * 100).toFixed(1) + "%" : "N/A");
const fix2 = (val) => (val != null ? Number(val).toFixed(2) : "N/A");
const fix3 = (val) => (val != null ? Number(val).toFixed(3) : "N/A");

module.exports = {
  getPlayerLanding,
  getStandings,
  getRoster,
  getNHLStats,
  getTeamAdvancedStats,
  getMoneyPuckPlayer,
  getMoneyPuckGoalie,
  resolvePlayerId,
  getTeamAbbreviation,
  getTeamFromStandings,
  teamLogo,
  formatHeight,
  positionName,
  isGoalie,
  calculateOnPace,
  pct, fix2, fix3,
  NHL_TEAMS,
};
