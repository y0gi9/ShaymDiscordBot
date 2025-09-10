const { chromium } = require('playwright');

class CSWatchScraper {
    constructor() {
        this.browser = null;
    }

    async init() {
        if (!this.browser) {
            this.browser = await chromium.launch({
                headless: true
            });
        }
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }

    async getPlayerStats(steamId) {
        try {
            await this.init();
            const context = await this.browser.newContext({
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            });
            const page = await context.newPage();
            
            const url = `https://cswatch.in/player/${steamId}`;
            console.log(`Scraping: ${url}`);
            
            await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
            
            // Wait for content to load
            await page.waitForTimeout(5000);
            
            const stats = await page.evaluate(() => {
                const data = {
                    playerName: null,
                    faceitLevel: null,
                    faceitElo: null,
                    premierRank: null
                };

                // Get player name from h1
                const nameElement = document.querySelector('h1');
                if (nameElement) {
                    data.playerName = nameElement.textContent.trim();
                }

                // Get FACEIT level from skill level image alt text
                const skillLevelImg = document.querySelector('img[alt*="Skill Level"]');
                if (skillLevelImg) {
                    const altText = skillLevelImg.alt;
                    const levelMatch = altText.match(/Skill Level (\d+)/);
                    if (levelMatch) {
                        data.faceitLevel = levelMatch[1];
                    }
                }

                // Get ELO from FACEIT section
                const eloElements = document.querySelectorAll('*');
                for (let element of eloElements) {
                    const text = element.textContent;
                    if (text && text.includes('ELO:')) {
                        // Look for the number in the next sibling or nearby elements
                        const parent = element.parentElement;
                        if (parent) {
                            const eloMatch = parent.textContent.match(/ELO:\s*(\d+)/);
                            if (eloMatch) {
                                data.faceitElo = eloMatch[1];
                                break;
                            }
                        }
                    }
                }

                // Get Premier rank - look for Premier section and its associated rank
                const premierElements = document.querySelectorAll('*');
                for (let element of premierElements) {
                    const text = element.textContent;
                    if (text && text.trim() === 'Premier') {
                        // Look for the parent container that holds both Premier text and rank
                        let current = element.parentElement;
                        while (current && !data.premierRank) {
                            // Look for rank number in child elements
                            const rankElements = current.querySelectorAll('*');
                            for (let rankEl of rankElements) {
                                const rankText = rankEl.textContent.trim();
                                // Look for numbers with commas (like 22,767) or large numbers
                                const rankMatch = rankText.match(/^(\d{1,3}(?:,\d{3})+|\d{4,})$/);
                                if (rankMatch && rankText !== data.faceitElo) {
                                    data.premierRank = rankMatch[1];
                                    break;
                                }
                            }
                            if (!data.premierRank) {
                                current = current.parentElement;
                            }
                        }
                        if (data.premierRank) break;
                    }
                }

                return data;
            });

            await context.close();
            
            console.log(`Scraped data for ${steamId}:`, stats);
            return stats;
            
        } catch (error) {
            console.error(`Error scraping data for ${steamId}:`, error.message);
            return null;
        }
    }

    formatNickname(nickname, stats) {
        if (!stats) {
            return `${nickname} - Stats N/A`;
        }

        const faceitLevel = stats.faceitLevel || 'N/A';
        const faceitElo = stats.faceitElo || 'N/A';
        const premierRank = stats.premierRank || 'N/A';
        
        // Shortened format to fit Discord 32 char limit
        const formattedName = `${nickname}[Lvl${faceitLevel}-${faceitElo}Elo][Prem${premierRank}]`;
        
        // Ensure it doesn't exceed 32 characters
        if (formattedName.length > 32) {
            // Truncate if still too long
            return formattedName.substring(0, 32);
        }
        
        return formattedName;
    }
}

module.exports = CSWatchScraper;