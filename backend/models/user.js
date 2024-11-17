const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  username: { type: String, default: "" },
  email: { type: String, default: "" },
  description: { type: String, default: "" },
  website: { type: String, default: "" },
  socialLinks: {
    facebook: { type: String, default: "" },
    twitter: { type: String, default: "" },
    instagram: { type: String, default: "" },
  },
  profileImage: { type: String, default: "" },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
}, { timestamps: true, collection: 'users' }); 

module.exports = mongoose.model('User', userSchema);
