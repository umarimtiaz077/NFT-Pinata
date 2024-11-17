// controllers/collectionController.js
const Collection = require("../models/Collection");
const User = require("../models/User");
const mongoose = require("mongoose");

exports.createCollection = async (req, res) => {
  try {
    const { name, description, userId } = req.body;
    const file = req.file;

    console.log("Received data:", { name, description, userId });

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Correctly save the image path using the server URL
    const image = file ? `http://localhost:5000/uploads/${file.filename}` : null;

    const newCollection = new Collection({
      name,
      description,
      image,  // Store the full URL of the uploaded image
      user: user._id,
    });

    await newCollection.save();

    res.status(201).json({
      message: "Collection created successfully",
      collection: newCollection,
    });
  } catch (error) {
    console.error("Error creating collection:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


// Get all collections
exports.getAllCollections = async (req, res) => {
  try {
    // Retrieve all collections and populate the user field
    const collections = await Collection.find().populate("user", "username walletAddress profileImage");

    res.status(200).json({ collections });
  } catch (error) {
    console.error("Error fetching collections:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// collectionController.js

exports.getUserCollections = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    // Fetch collections for the specified user
    const collections = await Collection.find({ user: userId }).populate("user", "username walletAddress profileImage");

    res.status(200).json({ collections });
  } catch (error) {
    console.error("Error fetching user's collections:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getCollectionById = async (req, res) => {
  try {
    const { collectionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(collectionId)) {
      return res.status(400).json({ message: "Invalid collection ID format" });
    }

    // Fetch the collection by ID and populate user data
    const collection = await Collection.findById(collectionId).populate("user", "username walletAddress profileImage");

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    res.status(200).json({ collection });
  } catch (error) {
    console.error("Error fetching collection by ID:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
