import puppeteer from 'puppeteer-core';

export const scrapeAmazonBright = async (query, startIndex, endIndex) => {

  const browser = await puppeteer.connect({

  browserWSEndpoint: 'wss://brd-customer-hl_dcc91e8a-zone-scraping_browser1:vh5pk5gtoli0@brd.superproxy.io:9222'

  })

  const page = await browser.newPage();


  await page.setViewport({

  width: 1080,

  height: 768

  })


  page.setDefaultNavigationTimeout(60 * 1000)

  page.setDefaultNavigationTimeout(2 *60 * 1000); // 60 seconds  1

  await page.goto(`https://www.amazon.com/s?k=${query}`, { waitUntil: 'networkidle2' });

  await page.screenshot("bot.png")
    

// await page.waitForSelector('div.s-result-item div.a-section div.s-title-instructions-style a')


await page.waitForSelector('div.s-result-item');

// Extract product listings

  const products = await page.evaluate(({ startIndex, endIndex }) => {

    const items = [];

    const nodeList = document.querySelectorAll('div.s-result-item')

    console.log("---------NodelIst------")

    console.log(nodeList)

    const productsArray = Array.from(nodeList)

    productsArray.slice(startIndex, endIndex).forEach((product) => {

    const title = product.querySelector('a h2 span')?.innerText;

    const price = product.querySelector('.a-price span')?.innerText;

      

    let rating = product.querySelector('div.s-card-container div.a-size-small span.a-declarative a')?.getAttribute('aria-label');

    rating = rating ? rating : null

    let description =product.querySelector('[data-cy="delivery-recipe"]')

    description = description ? description.textContent : null;

      

    const link = product.querySelector('div.a-section div.s-title-instructions-style a')?.href;

    const imageUrl = product.querySelector('div.s-product-image-container img')?.src

    if (link?.startsWith('https://') && Object.keys({ title, price, link, imageUrl }).length > 2) {
        items.push({ title, price, rating, link, description, imageUrl });
      }

    });

    return items;

  }, { startIndex, endIndex });

  
  

console.log("\n--------Original---------\n")

  

console.log(products)

  

// const filteredProducts = products.filter(product => Object.keys(product).length > 3 && product.link?.startsWith("https://"))

// allProducts = allProducts.filter((product) => product.link.startsWith("https://"))

  

console.log("\n--------Filtered---------\n")

  

// console.log(filteredProducts)

  

  

// Close the browser

await browser.close();

  

return products

}

  

// await scrapeAmazonBright("gaming laptops", 0, 10)