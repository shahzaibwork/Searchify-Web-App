import { Product } from "../../models/product.model.js";
import { ProductDetails } from "../../models/productDetails.model.js";
import { scrapeDetails } from "../../utils/Details-scrape/FireewallScrape.js";
import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from 'uuid'
import { Wishlist } from "../../models/wishlist.model.js";




// const client = new MongoClient(process.env.MONGO_URI)
// const database = client.db('searchifyDB')

export const getProductDetails = async (req, res, next) => {

  
  const { productTitle } = req.params;
  const { id } = req.query

  console.log("The product details: ", productTitle)
  
    try{

        // const detailsFromDB = await fetchProductDetailsDB(productTitle, id)

        // if(detailsFromDB){
        //   res.status(200).json({ product: detailsFromDB })
        //   return
        // }

        console.log("details not in db")

        const product = await getProductLink(productTitle, id)
    
        if(!product){
          res.status(404).json({ message: 'Product not found' })
          return
        }

        const { link, imageUrl } = product

        

        let productDetails = await scrapeDetails(link)
    
        console.log('Product details: ', productDetails)
    
        productDetails = {
            productId: id,
            imageUrl,
            link,
            ...productDetails
        }
    
        res.status(200).json({ product: productDetails })
    
        addProductDetailsDB(productDetails, product.title)
    }catch(err){
        next(err)
    }


}

export const addToWishlist = async (req, res, next) => {

    const { userId, productId, title} = req.body

    // console.log("userId: ", userId)
    // console.log("productId: ", productId)

    try {
      // Find the user's wishlist
      let wishlist = await Wishlist.findOne({ userId });
  
      // If the wishlist doesn't exist, create a new one
      if (!wishlist) {
        wishlist = new Wishlist({ userId, products: [] });
      }
  
      // Check if the product is already in the wishlist
      const productExists = wishlist.products.some(
        (product) => product.productId === productId
      );
  
      if (!productExists) {
        // Add the product to the wishlist
        wishlist.products.push({ productId, title });

        await wishlist.save();
        console.log("added to wishlist")
        return res.status(200).json({ success: true, message: 'Product added to wishlist' });
      } else {
        return res.status(500).json({ success: false, message: 'Product already in wishlist' });
      }
     
    } catch (error) {
      console.error('Error adding product to wishlist:', error);
      throw error;
    }
  };



  export const removeFromWishlist = async (req, res, next) => {

    const { userId, productId } = req.body;
  
    try {
      // Find the user's wishlist
      const wishlist = await Wishlist.findOne({ userId });
  
      // If the wishlist doesn't exist, return an error
      if (!wishlist) {
        return res.status(404).json({ success: false, message: 'Wishlist not found' });
      }
  
      // Check if the product exists in the wishlist
      const productIndex = wishlist.products.findIndex(
        (product) => product.productId === productId
      );
  
      if (productIndex === -1) {
        // Product not found in the wishlist
        return res.status(400).json({ success: false, message: 'Product not found in wishlist' });
      }
  
      // Remove the product from the wishlist
      wishlist.products.splice(productIndex, 1); // Remove 1 element at the found index
      console.log("Removed from wishlist")
      await wishlist.save();
  
      return res.status(200).json({ success: true, message: 'Product removed from wishlist' });
    } catch (error) {
      console.error('Error removing product from wishlist:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };

  export const checkIfProductInWishlist = async (req, res, next) => {
    const { userId, productId } = req.body; // Use query parameters
  
    try {
      // Find the user's wishlist
      const wishlist = await Wishlist.findOne({ userId });
  
      if (!wishlist) {
        return res.status(200).json({ isWishlisted: false });
      }
  
      // Check if the product is in the wishlist
      const isWishlisted = wishlist.products.some(
        (product) => product.productId === productId
      );
  
      return res.status(200).json({ isWishlisted });
    } catch (error) {
      console.error('Error checking wishlist:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };

export const getWishlistItems = async (req, res, next) => {

    const { userId } = req.query

    try{

      const wishlist = await Wishlist.findOne({ userId })

      
      if(!wishlist){
        return
        // return res.status(500).json({message: "Not found wishlist", success: false})
      }

      console.log("unfiltered: ", wishlist.products)

      const productIds = wishlist.products.map(product => product.productId);

      console.log("productIds: ", productIds)

      const products = await ProductDetails.find({ productId : { $in: productIds } });

      console.log("The products filtered: ", products)

      return res.status(200).json({products})

    }catch(err){
      res.status(500).json({message: err.message})
    }

  }

export const deleteFromWishlist = async (req, res, next) => {

  const { id, title } = req.body;

  if (!id || !title) {
    return res.status(400).json({ message: "Either 'id' or 'title' is required." });
  }

  try {
    // Find the wishlist for the user (assuming userId is available in the request)
    const userId = req.body.userId; // You need to send userId from the client
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Find the wishlist for the user
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found for the user." });
    }

    // Remove the product from the wishlist
    wishlist.products = wishlist.products.filter(
      (product) => product.productId !== id || product.title !== title
    );

    // Save the updated wishlist
    await wishlist.save();

    res.status(200).json({ message: "Product removed from wishlist.", wishlist });
  } catch (error) {
    console.error("Error deleting product from wishlist:", error);
    res.status(500).json({ message: "Internal server error." });
  }

}

const addProductDetailsDB  = async (productDetails, title) => {
    
  const filter = { ProductTitle: title }

  const update = { $set: productDetails }; 

  const options = { upsert: true }; // Insert if not found, update if found
  
  const doc = await ProductDetails.updateOne(filter, update, options)

  console.log("The Product Detials inserted")

}

const getProductLink = async (productTitle, productId) => {

    // try{
        const product = await Product.findOne({
            $or: [
              { id: productId }, // Try to match by ID
              { title: productTitle }, // Try to match by title
            ],
          }).lean();

          console.log("The productID looking for: ", productId)
          console.log("The product tiel looking for: ", productTitle)
          console.log("The found product: ", product)

          return product

    // }catch(err){
        // console.log(err)
    // }

}


const fetchProductDetailsDB = async (title, id) => {

  if(!title || !id) return

  try{
    const product = await ProductDetails.findOne({
      $or: [
        {productId: id},
        {ProductTitle: title}
      ]
    })

    return product

  }catch(err){
    console.log(err)
  }

}

export const getSearchResults = async (req, res, next) => {

  const { userId, searchTerm } = req.body

  try{

    const wishlist = await Wishlist.findOne({ userId })

    if(!wishlist){
      return 
    }

    const products = wishlist.products

    const matchedProducts = products.filter(
      (product) => new RegExp(searchTerm, 'i').test(product.title)
    ).map(product => ({
      productId: product.productId,
      title: product.title
    }))

    const matchedIds = matchedProducts.map(product => product.productId)

    const Mquery = {
        productId : { $in: matchedIds } 
    }

    const results = await ProductDetails.find(Mquery)

    res.status(200).json({matchedProducts: results})

  }catch(err){
    console.log('Error in search results: ', err)
    res.status(500).json({ message: err.message })
  }

  
}