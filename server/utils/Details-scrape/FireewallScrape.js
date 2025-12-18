import FirecrawlApp from "@mendable/firecrawl-js";
import { z } from "zod";

const app = new FirecrawlApp({
  apiKey: "fc-de1900bcf33e484e8327c6a35e83f24b"
});

// Define schema to extract contents into
const ProductFeatureSchema = z.object({
    feature: z.string(), // Feature name
    details: z.string(), // Feature details
  });
  
  // Define the schema for the product
  const ProductSchema = z.object({
    ProductTitle: z.string(), // Product title
    price: z.object({
      listPrice: z.string(), // Listed price
      currentPrice: z.string(), // Current price
      savings: z.string(), // Savings
    }),
    sellerInfo: z.object({
      sellerName: z.string(), // Seller name
      sellerRating: z.number(), // Seller rating (float)
      numReviews: z.number(), // Number of reviews
    }),
    customerReviews: z.object({
      overallRating: z.number(), // Overall rating (float)
      numReviews: z.number(), // Number of reviews
    }),
    productFeatures: z.array(ProductFeatureSchema), // Array of product features
    shipping: z.string(), // Shipping details
  });

export const scrapeDetails = async (url) => {

  try{

    console.log("\n---starting scraping details of: ", url)
  
    const productUrls = {
      // amazonUrl: `https://amazon.com/Logitech-G502-Performance-Gaming-Mouse/dp/B07GBZ4Q68/ref=sr_1_1?dib=eyJ2IjoiMSJ9.D51lWxt7OD5GPXMrCM-hnnHpwbQ5ea1aTLHft-lQuIl-kmXwBzdrjy57OsEMOjI4N-80uT-ie9iGtmHqJocIrt_NLD4y3E3qnGpJ1m_F3ahSIPt_ILMkP24K7pCaGMgGTWgT0fEfd9zQ1Vt3sPRmCfp6hR9qQFmB2_QoSqE7Qe-X-gUUQ8HO6PWawHDyb0OCR-kfQjcRe7ye5yCzQfZBcT9lX1HD-g54UkO1gR_-m-o.JfgqaGJvpMOY7SvYmooHuZEsvC5UExCXHg_eJ7P8mj8&dib_tag=se&keywords=gaming+mouse&qid=1738457675&sr=8-1'`,
      // ebayUrl: `https://www.ebay.com/itm/387863605258`,
      // amzUrl2: `https://amazon.com/Redragon-M612-Predator-Programmable-Software/dp/B08SJ5Z8JL/ref=sr_1_3`,
      // amzurl4: `https://www.amazon.com/Apple-iPhone-Pro-256GB-Gold/dp/B0BYLJVFHW/ref=sr_1_13?dib=eyJ2IjoiMSJ9.ULXJeJeFguO99Rj-_OlHIK0IAxFnh-7xLELABf6b8e0cZG2pW-4SGx17YRn2aWZ9xSzxDtiFgkIUkAYP0-vWokeJbAqnd58XkyWrvDWppdqEvS4cpuGtPmf_5cgZjpgl60giRqP7Q99uV6F92hxmW0mG4yQJMFsw5f5S26Dv5m2keb9Fbr8nj9yzE-E4YYCoSRJ-PqPPzAvujPcdrnfHEU-r4o4FXagY76wi2Mz8fPI.r4VlaPEwvctiYAtBJN20d8lKkULbzlxn-sTlljzN6Xs&dib_tag=se&keywords=iPhone&qid=1738803012&sr=8-13`,
      amzOrigUrl: url
    }
    
    const scrapeResult = await app.extract([
    productUrls.amzOrigUrl
    ], {
    prompt: `You are a web scraping assistant that extracts product details from a given URL and returns the information in the structured JSON format
    Make sure to scrape out the the current price and ratings and shipping details as these are most important .
    If some important fields are empty, mention those according to the product
    If there's some info that you dont find. return "N/A" for that field`,
    schema: ProductSchema
    });
    
    if (!scrapeResult.success) {
    throw new Error(`Failed to scrape: ${scrapeResult.error}`)
    }
    
    console.log("logging....")
    console.log(scrapeResult.data);
  
    return scrapeResult.data
  }catch(err){
    console.log("The error while firecrawl: ", err)
  }
}

// const url = "https://www.amazon.com/iBUYPOWER-Computer-Desktop-Y60BA9N47TS03-GeForce/dp/B0DDZ92PD5/ref=sr_1_3?dib=eyJ2IjoiMSJ9.e0abnAo7g_f1OO7uMwwbrWk-owPIVi2IAYbunLmf71y9YwZ_8V9S2UViIUW41RdHn1hCQJgJRifTj-0SS05F1TznyTiC-ryY5jBvhU2fKdXQeeVc7fBbfH0JqkXWEezbYB8DX40P33B3MY_UKTWalNVzQAyWDpVL6KHwWFO62famIEN2udGiRS_OC7KGWI6inFjx9bK0XlhmL8YvKTCiq_7DSipuvCOdXaCjayBNsIs.NyFnuFG5Jhk__uY12TzQZRV2hKxZAP-6bMTf0LGp3U4&dib_tag=se&keywords=gaming+desktops&qid=1738850902&sr=8-3"

// await scrapeDetails("df")