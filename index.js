const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const cron = require('node-cron');
const config = require('./config');
const CSWatchScraper = require('./scraper');

class StatsBot {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers
            ]
        });
        
        this.scraper = new CSWatchScraper();
        this.isUpdating = false;
        
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.client.once('ready', () => {
            console.log(`Bot logged in as ${this.client.user.tag}`);
            console.log(`Monitoring ${config.users.length} users`);
            
            this.scheduleUpdates();
            
            setTimeout(() => {
                this.updateAllNicknames();
            }, 5000);
        });

        this.client.on('error', console.error);
    }

    async updateAllNicknames() {
        if (this.isUpdating) {
            console.log('Update already in progress, skipping...');
            return;
        }

        this.isUpdating = true;
        console.log('Starting nickname update cycle...');

        try {
            const guild = await this.client.guilds.fetch(config.discord.guildId);
            
            for (const user of config.users) {
                try {
                    console.log(`Processing user: ${user.nickname} (${user.discordId})`);
                    
                    const member = await guild.members.fetch(user.discordId);
                    if (!member) {
                        console.log(`Member ${user.discordId} not found in guild`);
                        continue;
                    }

                    const stats = await this.scraper.getPlayerStats(user.steamId);
                    const formatOptions = {
                        showFaceitInfo: user.showFaceitInfo,
                        showFaceitElo: user.showFaceitElo,
                        showPremierInfo: user.showPremierInfo
                    };
                    const newNickname = this.scraper.formatNickname(user.nickname, stats, formatOptions);
                    const currentNickname = member.nickname || member.displayName;

                    console.log(`Current nickname: "${currentNickname}"`);
                    console.log(`New nickname: "${newNickname}"`);

                    if (currentNickname !== newNickname) {
                        await member.setNickname(newNickname);
                        console.log(`Updated ${user.nickname}: ${newNickname}`);
                    } else {
                        console.log(`No change needed for ${user.nickname}`);
                    }

                    await this.delay(2000);
                    
                } catch (error) {
                    console.error(`Error updating ${user.nickname}:`, error.message);
                }
            }
            
        } catch (error) {
            console.error('Error during nickname update cycle:', error);
        } finally {
            this.isUpdating = false;
            console.log('Nickname update cycle completed');
        }
    }

    scheduleUpdates() {
        const cronExpression = `*/${config.updateInterval} * * * *`;
        console.log(`Scheduling updates every ${config.updateInterval} minutes`);
        
        cron.schedule(cronExpression, () => {
            this.updateAllNicknames();
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async start() {
        try {
            await this.client.login(config.discord.token);
        } catch (error) {
            console.error('Failed to start bot:', error);
            process.exit(1);
        }
    }

    async stop() {
        console.log('Shutting down bot...');
        await this.scraper.close();
        await this.client.destroy();
    }
}

const bot = new StatsBot();

process.on('SIGINT', async () => {
    await bot.stop();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await bot.stop();
    process.exit(0);
});

bot.start();