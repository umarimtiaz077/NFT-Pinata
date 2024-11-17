const mongoose = require('mongoose');

const nftSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  website: { type: String },
  description: { type: String },
  royalties: { type: String },
  fileSize: { type: String },
  category: { type: String },
  properties: { type: String },
  price: { type: String },
  userAddress: { type: String, required: true },
  imageUrl: { type: String }, 
  likes: [{ type: String }], 

}, { timestamps: true });

module.exports = mongoose.model('NFT', nftSchema);