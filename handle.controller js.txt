import { getUserProductPrompt } from "../../utils/promptHandle.js"
import { scrapeAmazon, scrapeEbay } from "../../utils/scrapeGraphAi.js"
import { fetchImages, updateProductImageUrls } from "../../utils/unsplash/unsplash.js"
import { saveProductToDatabase } from "./savingtoDB.js"
import { v4 as uuidv4 } from 'uuid'

let useAmazon = true

export const handlePrompt = async (req, res, next) => {

    const { prompt, page = 1 } = req.body

try{

    console.log("Getting query from the prompt")
    const returnedResult = await getUserProductPrompt(prompt) //geting query from prompt

    const { productQuery: query} = returnedResult

    console.log("Scraping from ", useAmazon ? 'Amazon' : 'Ebay')

    let allProducts = useAmazon 
    ? await scrapeAmazon(query, page)
    : await scrapeEbay(query, page)

    console.log("Getting images...")
    const images = await fetchImages(query)
    
    console.log("Validating images")
    allProducts = await updateProductImageUrls(allProducts, images)

    allProducts = allProducts.slice(0, 9).map((product) => {
        return {
            id: uuidv4(),
            query,
            ...product
        }
    })
    console.log("fetch done")
    res.status(200).json({
        data: allProducts,  
        page,
        query
    })

    await saveProductToDatabase(allProducts)

}catch(err){
    res.status(500).json({
        error: `Error while fetching: ${err.message}` 
    })
}


}