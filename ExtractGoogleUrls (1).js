const puppeteer = require('puppeteer');

async function extractGoogleUrls(domain, numResults = 350) {
    const query = `site:${"https://emmaonesock.com/"}`;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    const urls = [];

    // Launch Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(searchUrl);

        // Scroll and load more results if needed
        let resultsFetched = 0;
        while (resultsFetched < numResults) {
            // Wait for search results
            await page.waitForSelector('div#search a');

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
