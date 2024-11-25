const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  
  // List of URLs to fetch data from
  const urls = [
      'https://www.mfasco.com/reorder-lists.html?mak=16999',
      'https://www.mfasco.com/s.nl/it.A/id.16999/.f',
      'https://www.mfasco.com/s.nl/it.A/id.16999/.f'
  ];

  let productsData = [];  // Store the products data

  for (const url of urls) {
    const page = await browser.newPage();
    
    await page.goto(url, { waitUntil: 'networkidle0' });  // Wait for the page to fully load
    
    // Extract SKU, Quantity, and Title from the current page
    const scrapedData = await page.evaluate((pageurl) => {
      let products = [];
      // Get all product rows
      document.querySelectorAll('#mylistTable tr').forEach((row) => {
        // Find elements that match the SKU, Quantity, and Title
        const titleElement = row.querySelector('.kitname');
        const skuElement = row.querySelector('.itemid');
        const quantityElement = row.querySelector('input[type="tel"]');

        if (titleElement && skuElement && quantityElement) {
          const product = {
            pageurl: pageurl,  // Use the pageurl passed into the function
            title: titleElement.textContent.trim(),
            sku: skuElement.textContent.trim().replace('Item #:', '').trim(),
            quantity: quantityElement.value
          };
          products.push(product);
        }
      });
      return products;
    }, url);  // Pass the current URL as an argument to page.evaluate
    
    productsData = [...productsData, ...scrapedData];
    console.log(`Scraped ${scrapedData.length} products from ${url}.`);
    
    await page.close();  // Close the page after scraping
  }

  console.log(`Total products scraped: ${productsData.length}`);
  console.log(productsData);  // Output the products data
  
  await browser.close();
})();
