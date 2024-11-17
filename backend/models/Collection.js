// models/Collection.js
const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },  // URL or path to the uploaded image
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
}, { timestamps: true });

module.exports = mongoose.model("Collection", collectionSchema);
