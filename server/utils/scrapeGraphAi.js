import { smartScraper } from 'scrapegraph-js';
import { z } from "zod"
import dotenv from 'dotenv'

dotenv.config()

const apiKey = process.env.S_API_KEY;

export const schema = z.object({
  title: z.string().describe('The title of the product'),
  price: z.number().describe("the price of the product"),
  rating: z.number().describe("it should be like this for exmaple: 4.5"),
  description: z.string(),
  imageUrl: z.string().url(),
  link: z.string().url()

})

let prompt = `Only Extract 8 products data and return the result in json format with fields, 
title, price, rating, description, imageUrl, link. if description is not scraped, add your own
according to the product title. If any other data is not found write "N/A" for that field`

export const scrapeAmazon = async (queryParams, page) => {


// prompt = `Only Extract 8 products data and return the result in json format with fields, 
// title, price, rating, description, imageUrl, link. if description is not scraped, add your own
// according to the product title. If any other data is not found write "N/A" for that field`

const url = `https://amazon.com/s?k=${queryParams}&page=${page}`;


  const response = await smartScraper(apiKey, url, prompt, schema);
  console.log("----- amazon products----")
  // console.log(response.result.products)
  console.log("scrapped amazon succesfully");

  if(response === undefined ||response ===  null){
    return [ ]
  }


  if(response.result.products){
    response.result.products = response.result.products.filter((product) => product.link && product.link?.startsWith("https"))
  }

  return response.result.products ? response.result.products :  [response.result]

};

export const scrapeEbay = async (queryParams, page) => {
  
  // prompt = `Only Extract 8 products data and return the result in json format with fields, 
  // title, price, rating, description, imageUrl, link. if any image is not found.
  // take any one image randomly from here, dont use the same image twice: 
  // ${images}
  // if any other data is not found write "N/A" for that field`

  console.log("The passed params: ", queryParams)

  const url = `https://www.ebay.com/sch/i.html?_nkw=${queryParams}&_pgn=${page}`

    const response = await smartScraper(apiKey, url, prompt, schema);

    console.log("----- Ebay products----")
    // console.log(response.result.products)
    console.log("scraped ebay successfully");

    if(response === undefined ||response === null){
      return [ ]
    }

    if(response.result.products){
      response.result.products = response.result.products.filter((product) => product.link && product.link?.startsWith("https"))
    }

    return response.result.products ? response.result.products :  [response.result] // if more than one product, if not...return array


   
}


// await scrapeAmazon("ipads", 1)

export const scrapedData = { scrapeAmazon, scrapeEbay } ;
