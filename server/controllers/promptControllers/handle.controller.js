import { getUserProductPrompt } from "../../utils/promptHandle.js"
import { scrapeAmazon, scrapeEbay } from "../../utils/scrapeGraphAi.js"
import { fetchImages, updateProductImageUrls } from "../../utils/unsplash/unsplash.js"
import { saveProductToDatabase } from "./savingtoDB.js"
import { v4 as uuidv4 } from 'uuid'

export const handlePrompt = async (req, res, next) => {
    const { prompt, page = 1 } = req.body

    try {
        console.log("Getting query from the prompt")
        const returnedResult = await getUserProductPrompt(prompt)
        const { productQuery: query } = returnedResult

        console.log("Scraping from both Amazon and eBay...")
        const [amazonProducts, ebayProducts] = await Promise.all([
            scrapeAmazon(query, page),
            scrapeEbay(query, page)
        ])

        // Add source and UUID to each product
        const labeledAmazon = amazonProducts.map(product => ({
            id: uuidv4(),
            query,
            source: "amazon",
            ...product
        }))

        const labeledEbay = ebayProducts.map(product => ({
            id: uuidv4(),
            query,
            source: "ebay",
            ...product
        }))

        // Combine both product lists without slicing
        let allProducts = [...labeledAmazon, ...labeledEbay]

        console.log("Getting images...")
        const images = await fetchImages(query)

        console.log("Validating images")
        allProducts = await updateProductImageUrls(allProducts, images)

        console.log("Fetch done")
        res.status(200).json({
            data: allProducts,
            page,
            query
        })

        // Save to DB
        try {
            await saveProductToDatabase(allProducts)
        } catch (dbErr) {
            console.error("Database save error:", dbErr.message)
        }

    } catch (err) {
        console.error("Error occurred:", err)
        if (!res.headersSent) {
            res.status(500).json({
                error: `Error while fetching: ${err.message}`
            })
        } else {
            console.error("Headers already sent. Cannot respond with error.")
        }
    }
}
