# Discord CS2 FACEIT & PREMIER BOT

A Discord bot that automatically updates user nicknames with their gaming statistics from CSWatch.in. The bot displays FACEIT level, ELO, and CS2 Premier rank with fully configurable display options.

## Features

- Automatically scrapes gaming stats from cswatch.in
- Updates Discord nicknames with FACEIT level, ELO, and CS2 Premier rank
- Fully configurable display options (show/hide any combination of stats)
- Supports multiple users with individual Steam IDs
- Per-user configuration overrides
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

# Global display settings (defaults for all users)
SHOW_FACEIT_INFO=true
SHOW_FACEIT_ELO=true
SHOW_PREMIER_INFO=true

USER_1_DISCORD_ID=123456789012345678
USER_1_STEAM_ID=123456789012345678
USER_1_NICKNAME=ShyaM

USER_2_DISCORD_ID=123456789012345678
USER_2_STEAM_ID=123456789012345678
USER_2_NICKNAME=PlayerTwo
# Optional: Override global settings for this user
USER_2_SHOW_FACEIT_ELO=false

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

### Basic Settings
- `DISCORD_BOT_TOKEN`: Your Discord bot token
- `GUILD_ID`: The Discord server ID where the bot will operate
- `UPDATE_INTERVAL_MINUTES`: How often to update nicknames (default: 30 minutes)

### Global Display Settings
- `SHOW_FACEIT_INFO`: Show FACEIT level/ELO section (default: true)
- `SHOW_FACEIT_ELO`: Show ELO number when FACEIT info is enabled (default: true)
- `SHOW_PREMIER_INFO`: Show CS2 Premier rank (default: true)

### User Configuration
- `USER_X_DISCORD_ID`: Discord user ID for each user
- `USER_X_STEAM_ID`: Steam ID for each user (found in their Steam profile URL)
- `USER_X_NICKNAME`: Preferred nickname base for each user

### Per-User Overrides (Optional)
- `USER_X_SHOW_FACEIT_INFO`: Override global FACEIT info setting for this user
- `USER_X_SHOW_FACEIT_ELO`: Override global FACEIT ELO setting for this user
- `USER_X_SHOW_PREMIER_INFO`: Override global Premier info setting for this user

## Getting Steam IDs

To find a Steam ID:
1. Go to the user's Steam profile
2. Copy the number from the URL (e.g., `132456789` from `https://cswatch.in/player/123456789`)

## Example Output

The bot will format nicknames based on your configuration:

### All stats enabled (default):
- `ShyaM[Lvl9-1796Elo][Prem22767]`
- `PlayerTwo[Lvl7-1245Elo][Prem18234]`

### FACEIT level only (no ELO):
- `ShyaM[Lvl9][Prem22767]`

### Premier only:
- `ShyaM[Prem22767]`

### FACEIT only (level + ELO):
- `ShyaM[Lvl9-1796Elo]`

### No stats:
- `ShyaM`

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