import { scrapeAmazon, scrapeEbay } from "../../utils/scrapeGraphAi.js"
import { fetchImages, updateProductImageUrls } from "../../utils/unsplash/unsplash.js"
import { saveProductToDatabase } from "./savingtoDB.js"
import { v4 as uuidv4 } from 'uuid'

export const preFetchNextPage = async (page, query) => {

    // let pageNo = Number(page)

    let store = page % 2 === 0 ? 'Ebay' : 'Amazon'

    console.log("The page: ", page)
    console.log("The page type: ", typeof page)
    console.log("The query: ", query)

    console.log(`PreFetching from ${store} for page ${page}`)

    const nextPageDataPromise = store === 'Amazon'
    ? scrapeAmazon(query, page)
    : scrapeEbay(query, page)

    let nextPageData = await nextPageDataPromise
    
    const images = await fetchImages(query)

    nextPageData = await updateProductImageUrls(nextPageData, images)

    nextPageData = nextPageData.slice(0, 9).map((product) => { //the prefetched products
        return {
            id: uuidv4(),
            query,
            ...product
        }
    })
    
    // console.log("prefetch cached??????: ", cache.get(cacheKey))

    console.log("---Saving prefetched data to db----")

    await saveProductToDatabase(nextPageData)
    
        
    
    return nextPageData

}