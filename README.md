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
   CLIENT_ID=your_bot_application_id
   BASE_URL=https://yonibecker.github.io/zamboni
   PORT=4000
   ```
   - `TOKEN` (required): Your Discord bot token
   - `CLIENT_ID` (required): Your bot's application ID (from the Discord Developer Portal)
   - `BASE_URL` (optional): Public URL for static assets like the bot logo (defaults to GitHub Pages: `https://yonibecker.github.io/zamboni`)
   - `PORT` (optional): Port for the Express webserver (defaults to 4000)

3. Register slash commands (run once, or after adding new commands):
   ```
   npm run deploy
   ```

4. Start the bot:
   ```
   npm start
   ```

## Commands

Zamboni uses Discord slash commands. Type `/` in any channel to see available commands.

**Player Commands**
- `/careerstats [Player]` - Career stats
- `/seasonstats [Player]` - Current season stats
- `/statsbyyear [Player] [Year]` - Stats for a specific season
- `/playerinfo [Player]` - Player biographical info
- `/onpace [Player]` - On-pace projections for the current season

**Team Commands**
- `/teaminfo [Team]` - Team info with logo
- `/teamseasonstats [Team]` - Current season team stats
- `/teamstatsbyyear [Team] [Year]` - Historical team stats
- `/teamroster [Team]` - Full roster

**League Leader Commands**
- `/seasonleagueleaders` - Current season leaders
- `/leagueleadersbyyear [Year]` - Historical league leaders
- `/alltimeleagueleaders` - All-time leaders

**Draft Commands**
- `/draftselections [Year] [Start] [End]` - Draft picks

**Misc Commands**
- `/help` - List all commands
- `/info` - Bot info and invite link
- `/say [Phrase]` - Repeats a phrase back at you
- `/vote` - Vote for Zamboni on top.gg
- `/maintenance` - Scheduled maintenance times

## Tech Stack

- [discord.js](https://discord.js.org/) v14 - Discord API (slash commands)
- [Express](https://expressjs.com/) - Keepalive webserver
- [axios](https://axios-http.com/) - HTTP client for NHL API calls
- [@nhl-api/players](https://www.npmjs.com/package/@nhl-api/players) / [@nhl-api/teams](https://www.npmjs.com/package/@nhl-api/teams) - Player/team name lookups

## License

MIT
