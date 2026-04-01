const axios = require("axios");

const API_BASE = "https://api-web.nhle.com/v1";
const STATS_BASE = "https://api.nhle.com/stats/rest/en";

const POSITION_NAMES = {
  C: "Center",
  L: "Left Wing",
  R: "Right Wing",
  D: "Defenseman",
  G: "Goalie",
};

// Current NHL teams — kept in-code so we don't depend on outdated npm packages
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

const getTeamAdvancedStats = async (season) => {
  const [{ data: pct }, { data: rt }] = await Promise.all([
    axios.get(`${STATS_BASE}/team/percentages?isAggregate=false&isGame=false&cayenneExp=seasonId=${season}%20and%20gameTypeId=2`),
    axios.get(`${STATS_BASE}/team/realtime?isAggregate=false&isGame=false&cayenneExp=seasonId=${season}%20and%20gameTypeId=2`),
  ]);
  return { percentages: pct.data, realtime: rt.data };
};

// Player search fallback for players not in the static @nhl-api/players list
const searchPlayer = async (name) => {
  const { data } = await axios.get(
    `https://search.d3.nhle.com/api/v1/search/player?culture=en-us&limit=1&q=${encodeURIComponent(name)}`
  );
  return data.length > 0 ? parseInt(data[0].playerId) : null;
};

// ─── Team lookup ───────────────────────────────────────────

const getTeamAbbreviation = (teamName) => {
  const q = teamName.toLowerCase().trim();
  // Direct abbreviation match
  const byAbbrev = NHL_TEAMS.find((t) => t.abbrev.toLowerCase() === q);
  if (byAbbrev) return byAbbrev.abbrev;
  // Full name match
  const byName = NHL_TEAMS.find((t) => t.name.toLowerCase() === q);
  if (byName) return byName.abbrev;
  // Nickname / partial match
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

// ─── Player ID lookup ──────────────────────────────────────

let getPlayerId;
try {
  getPlayerId = require("@nhl-api/players").getPlayerId;
} catch (e) {
  getPlayerId = () => null;
}

const resolvePlayerId = async (name) => {
  // Try the static package first (fast, offline)
  try {
    const staticId = getPlayerId(name);
    if (staticId) return staticId;
  } catch (e) {
    // Package throws for unknown players — fall through to search
  }
  // Fall back to NHL search API for newer players
  return searchPlayer(name);
};

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
const fix2 = (val) => (val != null ? val.toFixed(2) : "N/A");
const fix3 = (val) => (val != null ? val.toFixed(3) : "N/A");

module.exports = {
  getPlayerLanding,
  getStandings,
  getRoster,
  getTeamAdvancedStats,
  resolvePlayerId,
  getTeamAbbreviation,
  getTeamFromStandings,
  formatHeight,
  positionName,
  isGoalie,
  calculateOnPace,
  pct,
  fix2,
  fix3,
  NHL_TEAMS,
};
