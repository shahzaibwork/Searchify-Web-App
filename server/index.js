import express from 'express'
import promptRoutes from "./routes/prompt.route.js" 
import productRoutes from "./routes/product.route.js"
import userRoutes from "./routes/user.route.js"
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import http from 'http'


import { ProductDetails } from './models/productDetails.model.js'
import { getSocketIO, initializeSocket } from './socket-io.js'

dotenv.config()



// console.log("THE MONGO URI: ", process.env.MONGO_URI)

const app = express()
const httpServer = http.createServer(app)



app.use(cors())

app.use(express.json());

const io = initializeSocket(httpServer)

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    console.log("connected to MONGO")
    // await removeDuplicatesFromOriginal()
    // const io = getSocketIO()

    // io.emit('check', { message: 'working'})
    

})
.catch((err) => console.log("Coudlnt connect to DB: ", err))


// console.log("Mongouri: ", process.env.MONGO_URI)


app.use('/api', userRoutes)
app.use('/api', promptRoutes)
app.use('/api', productRoutes)



app.use((err, req, res, next) => {

    console.log('The error handler ran...: ', err)

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error Occured"

    res.status(statusCode).json({
        success : false,
        statusCode,
        message

    })
})

const server = httpServer.listen(3000, () => {
    console.log("Server is running on port 3000")
})




async function removeDuplicates() {
    try {
      // Step 1: Identify duplicates and write to a new collection
      await ProductDetails.aggregate([
        {
          $group: {
            _id: "$ProductTitle", // Group by the title field
            uniqueIds: { $addToSet: "$_id" }, // Collect all unique _ids for each title
            count: { $sum: 1 }, // Count the number of documents per title
          },
        },
        {
          $match: {
            count: { $gt: 1 }, // Filter only titles with duplicates
          },
        },
        {
          $unwind: "$uniqueIds", // Unwind the uniqueIds array
        },
        {
          $group: {
            _id: "$_id", // Group by title again
            duplicateIds: { $push: "$uniqueIds" }, // Collect all _ids of duplicates
          },
        },
        {
          $project: {
            _id: 0, // Exclude the _id field
            title: "$_id", // Include the title field
            duplicateIds: 1, // Include the duplicateIds array
          },
        },
        {
          $out: "duplicates", // Write the results to a new collection called "duplicates"
        },
      ]);
  
      console.log("Duplicates identified and written to the 'duplicates' collection.");
    } catch (error) {
      console.error("Error identifying duplicates:", error);
    }
  }

  async function removeDuplicatesFromOriginal() {
    try {
      // Step 2: Remove duplicates from the original collection
      const duplicates = await mongoose.connection.db.collection("duplicates").find().toArray();
  
      for (const doc of duplicates) {
        // Remove all duplicates except the first one
        await ProductDetails.deleteMany({
          _id: { $in: doc.duplicateIds.slice(1) }, // Keep the first _id and delete the rest
        });
      }
  
      console.log("Duplicates removed from the original collection.");
    } catch (error) {
      console.error("Error removing duplicates:", error);
    }
  }