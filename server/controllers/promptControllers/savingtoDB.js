import { Product } from "../../models/product.model.js";


export const saveProductToDatabase = async (productData) => {

    const operations = productData.map(product => ({
        updateOne: {
          filter: { title: product.title }, // Filter by the unique field (e.g., title)
          update: { $set: product }, // Update with the new data
          upsert: true // Insert if not found, update if found
        }
      }));
      console.log("Bulkwriting product to db")
      const result = await Product.bulkWrite(operations);

} 