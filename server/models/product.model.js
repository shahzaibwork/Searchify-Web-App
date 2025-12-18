import mongoose from "mongoose";
import { validate } from "uuid";
import { Schema } from "zod";

// id: string,  
//     title: string, 
//     description: string,  
//     price: number,  
//     rating: number,   
//     imageUrl: string, 
//     link: string

const productSchema = new mongoose.Schema({

    id: {
        type: String,
    },

    title: {
        type: String
    },
    
    query: {
        type: String
    },

    source: {
     type: String,
     enum: ["amazon", "ebay"],
     required: true
     },
     
    description: {
        type: String,
        default: "N/A"
    },

    price: {
        type: mongoose.Schema.Types.Mixed, // Allows any type
        default: "N/A",
        validate: {
        validator: function(value) {
            // Check if the value is a number or a string
            return typeof value === 'number' || typeof value === 'string';
        },
      message: 'Price must be either a number or a string.'
    }
        
        
    },

    rating: {
        type: String
    },

    imageUrl: {
        type: String
    },

    link: {
        type: String
    } 

}, { timestamps: true })

export const Product = mongoose.model('Product', productSchema);