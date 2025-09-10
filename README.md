# Discord Gaming Stats Bot

A Discord bot that automatically updates user nicknames with their gaming statistics from CSWatch.in. The bot displays FACEIT level, ELO, and CS2 Premier rank in the format: `Nickname - LVL# #### - Premier #####`

## Features

- Automatically scrapes gaming stats from cswatch.in
- Updates Discord nicknames with FACEIT level, ELO, and CS2 Premier rank
- Supports multiple users with individual Steam IDs
- Configurable update intervals
- Handles missing data gracefully
- Rate limiting to avoid being blocked

## Setup

### 1. Prerequisites

- Node.js (version 16 or higher)
- A Discord bot token
- Discord server with "Manage Nicknames" permission for the bot

### 2. Installation

```bash
npm install
```

### 3. Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` with your configuration:

```env
DISCORD_BOT_TOKEN=your_discord_bot_token_here
GUILD_ID=your_discord_server_id_here

USER_1_DISCORD_ID=123456789012345678
USER_1_STEAM_ID=123456789012345678
USER_1_NICKNAME=ShyaM

USER_2_DISCORD_ID=123456789012345678
USER_2_STEAM_ID=123456789012345678
USER_2_NICKNAME=PlayerTwo

UPDATE_INTERVAL_MINUTES=30
```

### 4. Discord Bot Setup

1. Go to https://discord.com/developers/applications
2. Create a new application and bot
3. Copy the bot token to your `.env` file
4. Invite the bot to your server with "Manage Nicknames" permission

### 5. Running the Bot

```bash
npm start
```

## Configuration Options

- `DISCORD_BOT_TOKEN`: Your Discord bot token
- `GUILD_ID`: The Discord server ID where the bot will operate
- `USER_X_DISCORD_ID`: Discord user ID for each user
- `USER_X_STEAM_ID`: Steam ID for each user (found in their Steam profile URL)
- `USER_X_NICKNAME`: Preferred nickname base for each user
- `UPDATE_INTERVAL_MINUTES`: How often to update nicknames (default: 30 minutes)

## Getting Steam IDs

To find a Steam ID:
1. Go to the user's Steam profile
2. Copy the number from the URL (e.g., `132456789` from `https://cswatch.in/player/123456789`)

## Example Output

The bot will format nicknames like:
- `ShyaM - LVL9 1796 - Premier 22767`
- `PlayerTwo - LVL7 1245 - Premier 18234`

## Troubleshooting

- Make sure the bot has "Manage Nicknames" permission
- Verify Steam IDs are correct (18-digit numbers starting with 765)
- Check that CSWatch.in has data for the provided Steam IDs
- The bot needs time to scrape data - first update may take a few minutes

## Support

If you encounter issues, check the console logs for error messages. Common issues include:
- Invalid Discord bot token
- Missing permissions
- Incorrect Steam IDs
- CSWatch.in being temporarily unavailable