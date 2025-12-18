import { Product } from "../../models/product.model.js";
import { promptOpenAi } from "../../utils/azure-openai.js";
import FirecrawlApp from "@mendable/firecrawl-js";
import { z } from "zod";

const featureSchema = {
  feature1: 'feature1 name here',
  feature2: 'feature2 name here',
  feature3: 'feature3 name here',
  recommendation: 'AI Recommendation here'
}

const msgs = [{
  "role": "system",
  "content": `
  You will be provided two different product names, you have to analyse those products and based on the products, 
  give 3 common feature names. Provide your own objective recommendation.In the response refer to products by their 
  names. Output the result as a JSON object according to this schema: ${featureSchema}

  Example Output:
  {
  "feature1": "Price",
  "feature2": "Battery Life",
  "feature3": "Camera Quality",
  "recommendation": "Based on the comparison, Product A is better due to its lower price and superior camera quality, despite Product B having a slightly longer battery life."
}


  ` 
}  
]

export const fetchProductCardDetails = async (req, res, next) => {

  try{
    const compareProducts = req.body

    
    const [ product1, product2 ] = compareProducts
    
    if(!product1 || !product2) {
      res.status(500).json({
        error: 'No products to compare'
      })
      return
    }

    const productCard1 = await Product.findOne({
        $or: [ { title: product1.title } ]
    })
      
    const productCard2 = await Product.findOne({
        $or: [ { title: product2.title } ]
    })
    
      console.log("Found Products: ", [productCard1, productCard2])

      msgs.push({
        "role": "user",
        "content": `
        product1: ${product1.title},
        product2: ${product2.title}
        `
      })
      console.log("prompting ai")
      const featuresToCompare = await promptOpenAi(msgs)

      console.log("-----Features to compare-----")
      console.log(featuresToCompare)

      const AIresponse = await getComparisonDetails(productCard1.link, productCard2.link, featuresToCompare)

      res.status(200).json({
        compareProduct1: productCard1,
        compareProduct2: productCard2,
        AIResponse: AIresponse
      })

    }catch(err){
        next(err)
    }


}


const getComparisonDetails = async (url1, url2, featuresToCompare) => {

    console.log("scraping 1st product")
    const product1Details = await getProductDetails(url1, featuresToCompare);

    // Extract details for the second product
    console.log("scraping 2nd product")
    const product2Details = await getProductDetails(url2, featuresToCompare);

    console.log("Now starting comparison")
    // Combine the results for comparison
    const comparisonResult = {
      product1: product1Details,
      product2: product2Details,
    };

    console.log("Comparison Result:", comparisonResult);
    return comparisonResult;
};


const getProductDetails = async (url, featuresToCompare) => {

  const { feature1, feature2, feature3 } = featuresToCompare

  const app = new FirecrawlApp({
    apiKey: "fc-6d74df6872c0461ebef360fce2f44ca0"
  });

  const productUrls = {
    url1 : url,
  }

  const ProductFeatureSchema = z.object({
    feature: z.string(), // Feature name
    details: z.string()  // Feature details
  });

  const schema = z.object({
      features: z.array(ProductFeatureSchema),
      currentPrice: z.number(),
      sellerRating: z.number(),
      sellerReviews: z.number(),
      customerRating: z.number(),
      customerReviews: z.number()  
  })

  const systemPrompt = `
    You are a helpful shopping assistant. Your task is to extract data about these 3 product features from the given URL: 
    ${feature1}, ${feature2}, ${feature3},then extract currentPrice, sellerRating, sellerReviews, customerRating, customerReviews  
    and return the result in a structured JSON format.
  `;

    const scrapeResult = await app.extract([
      productUrls.url1
    ], {
      prompt: systemPrompt,
      schema: schema
    });

    if (!scrapeResult.success) {
      throw new Error(`Failed to scrape: ${scrapeResult.error}`);
    }

    console.log("Scrape Result:", scrapeResult.data);
    return scrapeResult.data;

};




// msgs.push({
//   "role": "user",
//   "content": `
//   product1: ${'Nividia gtx 1080 '},
//   product2: ${'Nividia rtx 3060ti '}
//   `
// })

// const featuresToCompare = await promptOpenAi(msgs)

// console.log(featuresToCompare)