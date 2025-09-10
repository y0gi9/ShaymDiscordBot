require('dotenv').config();

function parseUsers() {
    const users = [];
    let i = 1;
    
    // Global defaults
    const globalShowFaceitInfo = process.env.SHOW_FACEIT_INFO !== 'false';
    const globalShowFaceitElo = process.env.SHOW_FACEIT_ELO !== 'false';
    const globalShowPremierInfo = process.env.SHOW_PREMIER_INFO !== 'false';
    
    while (process.env[`USER_${i}_DISCORD_ID`]) {
        users.push({
            discordId: process.env[`USER_${i}_DISCORD_ID`],
            steamId: process.env[`USER_${i}_STEAM_ID`],
            nickname: process.env[`USER_${i}_NICKNAME`] || 'Unknown',
            showFaceitInfo: process.env[`USER_${i}_SHOW_FACEIT_INFO`] !== undefined ? 
                process.env[`USER_${i}_SHOW_FACEIT_INFO`] === 'true' : globalShowFaceitInfo,
            showFaceitElo: process.env[`USER_${i}_SHOW_FACEIT_ELO`] !== undefined ? 
                process.env[`USER_${i}_SHOW_FACEIT_ELO`] === 'true' : globalShowFaceitElo,
            showPremierInfo: process.env[`USER_${i}_SHOW_PREMIER_INFO`] !== undefined ? 
                process.env[`USER_${i}_SHOW_PREMIER_INFO`] === 'true' : globalShowPremierInfo
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