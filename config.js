require('dotenv').config();

function parseUsers() {
    const users = [];
    let i = 1;
    
    while (process.env[`USER_${i}_DISCORD_ID`]) {
        users.push({
            discordId: process.env[`USER_${i}_DISCORD_ID`],
            steamId: process.env[`USER_${i}_STEAM_ID`],
            nickname: process.env[`USER_${i}_NICKNAME`] || 'Unknown'
        });
        i++;
    }
    
    return users;
}

module.exports = {
    discord: {
        token: process.env.DISCORD_BOT_TOKEN,
        guildId: process.env.GUILD_ID
    },
    users: parseUsers(),
    updateInterval: parseInt(process.env.UPDATE_INTERVAL_MINUTES) || 30
};