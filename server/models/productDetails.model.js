import mongoose from "mongoose";

const ProductFeatureSchema = new mongoose.Schema({
  feature: { type: String },
  details: { type: String },
});

const ProductSchema = new mongoose.Schema({
  productId: {
    type: String
  },
  ProductTitle: { type: String },
  imageUrl: String,
  price: {
    listPrice: { type: mongoose.Schema.Types.Mixed }, // Can be string or number
    currentPrice: { type: mongoose.Schema.Types.Mixed },
    savings: { type: mongoose.Schema.Types.Mixed },
  },

  sellerInfo: {
    sellerName: { type: String },
    sellerRating: { type: mongoose.Schema.Types.Mixed }, // Can be string or number
    numReviews: { type: mongoose.Schema.Types.Mixed },
  },

  customerReviews: {
    overallRating: { type: mongoose.Schema.Types.Mixed },
    numReviews: { type: mongoose.Schema.Types.Mixed },
  },

  productFeatures: [ProductFeatureSchema],

  shipping: { type: String },
});

export const ProductDetails = mongoose.model("ProductDetails", ProductSchema);


// Product details:  {
//   price: { savings: '', listPrice: '', currentPrice: '$550.99' },
//   shipping: 'Free FedEx Ground Economy.',
//   sellerInfo: {
//     numReviews: 18776,
//     sellerName: 'cellularprofessor',
//     sellerRating: 99
//   },
//   ProductTitle: 'Apple MacBook Pro 13" 2020 M1 Space Gray Silver All Storage All RAM - Good',
//   customerReviews: { numReviews: 19311, overallRating: 4.9 },
//   productFeatures: [
//     { details: 'Good - Refurbished', feature: 'Condition' },
//     { details: 'Apple M1', feature: 'Processor' },
//     { details: '8GB or 16GB', feature: 'RAM Size' },
//     { details: '13.3 in', feature: 'Screen Size' },
//     { details: '256GB, 512GB, 1TB, 2TB', feature: 'SSD Capacity' }
//   ]
// }
