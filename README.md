# Zamboni

Zamboni is a Discord bot that can track NHL player stats, team stats, league leaders, and draft history.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   TOKEN=your_discord_bot_token
   BASE_URL=https://yonibecker.github.io/zamboni
   PORT=4000
   ```
   - `TOKEN` (required): Your Discord bot token
   - `BASE_URL` (optional): Public URL for static assets like the bot logo (defaults to GitHub Pages: `https://yonibecker.github.io/zamboni`)
   - `PORT` (optional): Port for the Express webserver (defaults to 4000)

3. Start the bot:
   ```
   npm start
   ```

## Commands

All commands use the `h:` prefix. Use `h:help` for a full list or `h:help [command]` for details on a specific command.

**Player Commands**
- `h:careerstats [Player]` - Career stats
- `h:seasonstats [Player]` - Current season stats
- `h:statsbyyear [Player] [Year]` - Stats for a specific season (e.g. `h:statsbyyear Wayne Gretzky 19851986`)
- `h:playerinfo [Player]` - Player biographical info
- `h:onpace [Player]` - On-pace projections for the current season

**Team Commands**
- `h:teaminfo [Team]` - Team info with logo
- `h:teamseasonstats [Team]` - Current season team stats
- `h:teamstatsbyyear [Team] [Year]` - Historical team stats
- `h:teamroster [Team]` - Full roster

**League Leader Commands**
- `h:seasonleagueleaders` - Current season leaders
- `h:leagueleadersbyyear [Year]` - Historical league leaders
- `h:alltimeleagueleaders` - All-time leaders

**Draft Commands**
- `h:draftselections [Year] [Start] [End]` - Draft picks (e.g. `h:draftselections 2015 1 5`)

**Misc Commands**
- `h:help` - List all commands
- `h:info` - Bot info and invite link
- `h:say [Phrase]` - Repeats a phrase back at you
- `h:vote` - Vote for Zamboni on top.gg
- `h:maintenance` - Scheduled maintenance times

## Tech Stack

- [discord.js](https://discord.js.org/) v12 - Discord API
- [Express](https://expressjs.com/) - Keepalive webserver
- [axios](https://axios-http.com/) - HTTP client for NHL API calls
- [@nhl-api/players](https://www.npmjs.com/package/@nhl-api/players) / [@nhl-api/teams](https://www.npmjs.com/package/@nhl-api/teams) - Player/team ID lookups
- [svg2img](https://www.npmjs.com/package/svg2img) - Team logo SVG to PNG conversion

## License

MIT
