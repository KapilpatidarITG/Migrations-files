const puppeteer = require('puppeteer');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const puppeteerExtra = require('puppeteer-extra');

puppeteerExtra.use(StealthPlugin());

async function extractGoogleUrls(domain, numResults = 301) {
    const query = `site:${roofvents.com};
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    const urls = [];

    // Launch Puppeteer with stealth mode and user-agent
    const browser = await puppeteerExtra.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
    );
    await page.setViewport({ width: 1280, height: 800 });

    try {
        await page.goto(searchUrl, { waitUntil: 'networkidle2' });

        // Scroll and load more results if needed
        let resultsFetched = 0;
        while (resultsFetched < numResults) {
            // Wait for search results (extend timeout)
            await page.waitForSelector('div#search a', { timeout: 60000 });

            // Extract URLs
            const newUrls = await page.$$eval('div#search a', links =>
                links
                    .map(link => link.href)
                    .filter(href => href.startsWith('http') && !href.includes('google'))
            );
            urls.push(...newUrls);

            // Deduplicate URLs
            const uniqueUrls = [...new Set(urls)];

            // Update result count
            resultsFetched = uniqueUrls.length;

            // Break if there are no more results to fetch
            const nextButton = await page.$('#pnnext');
            if (!nextButton || resultsFetched >= numResults) {
                break;
            }

            // Click on the "Next" button to load more results
            await Promise.all([
                page.click('#pnnext'),
                page.waitForNavigation({ waitUntil: 'networkidle2' }),
            ]);
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await browser.close();
    }

    return urls.slice(0, numResults); // Return only requested number of results
}

// Usage
const domain = 'lashgod.ca';
const numResults = 350;

extractGoogleUrls(domain, numResults).then(urls => {
    console.log(`Extracted ${urls.length} URLs:`);
    urls.forEach(url => console.log(url));
}).catch(error => console.error(error));
