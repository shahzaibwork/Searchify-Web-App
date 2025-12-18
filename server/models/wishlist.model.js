import mongoose from "mongoose";


const wishlistSchema = new mongoose.Schema({
    userId: { 
      type: String, 
      required: true 
    },
    products: [
        {
          productId: {
            type: String, // Use String for UUID
            required: true,
          },
          title: {
            type: String,
            required: true
          }
        }
      ],
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  });
  
  export const Wishlist = mongoose.model('Wishlist', wishlistSchema);