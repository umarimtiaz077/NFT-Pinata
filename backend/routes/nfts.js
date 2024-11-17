// routes/nftRoutes.js
const express = require('express');
const { createNFT, getAllNFTs } = require('../controllers/nftController');
const router = express.Router();
const NFT = require('../models/NFT');

// http://localhost:5000/api/nfts/creat

// Route for creating an NFT
router.post('/create', createNFT);

// Route for fetching all NFTs
router.get('/', getAllNFTs);



//new
// Like an NFT
router.post('/like/:id', async (req, res) => {
    const { userAddress } = req.body; // Get the wallet address from the request body
    const nftId = req.params.id;
  
    // Validate userAddress
    if (!userAddress) {
      return res.status(400).json({ message: "User address is required." });
    }
  
    try {
      const nft = await NFT.findById(nftId);
      if (!nft) {
        return res.status(404).json({ message: "NFT not found" });
      }
  
      // Check if the user already liked the NFT
      if (!nft.likes.includes(userAddress)) {
        nft.likes.push(userAddress); // Add userAddress to the likes array
        await nft.save();
        return res.status(200).json({ message: "NFT liked successfully", likes: nft.likes.length });
      } else {
        return res.status(400).json({ message: "You have already liked this NFT" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error liking NFT", error });
    }
  });
  
  // Unlike an NFT
  router.post('/unlike/:id', async (req, res) => {
    const { userAddress } = req.body; // Get the wallet address from the request body
    const nftId = req.params.id;
  
    // Validate userAddress
    if (!userAddress) {
      return res.status(400).json({ message: "User address is required." });
    }
  
    try {
      const nft = await NFT.findById(nftId);
      if (!nft) {
        return res.status(404).json({ message: "NFT not found" });
      }
  
      // Check if the user has liked the NFT
      if (nft.likes.includes(userAddress)) {
        nft.likes = nft.likes.filter(address => address !== userAddress); // Remove userAddress from the likes array
        await nft.save();
        return res.status(200).json({ message: "NFT unliked successfully", likes: nft.likes.length });
      } else {
        return res.status(400).json({ message: "You have not liked this NFT yet" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error unliking NFT", error });
    }
  });
  
// Like an NFT by image string
router.post('/like', async (req, res) => {
  const { userAddress, imageString } = req.body; // Get the wallet address and image string from the request body

  // Validate userAddress and imageString
  if (!userAddress || !imageString) {
    return res.status(400).json({ message: "User address and image string are required." });
  }

  console.log("userAddress", userAddress, "imageUrl", imageString);
  
  try {
    const nft = await NFT.findOne({ imageUrl: imageString }); // Query NFT by image string
    console.log("nft", nft);
    if (!nft) {
      return res.status(404).json({ message: "NFT not found" });
    }

    
    // Check if the user already liked the NFT
    if (!nft.likes.includes(userAddress)) {
      nft.likes.push(userAddress); // Add userAddress to the likes array
      await nft.save();
      return res.status(200).json({ message: "NFT liked successfully", likes: nft.likes.length });
    } else {
      return res.status(400).json({ message: "You have already liked this NFT" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error liking NFT", error });
  }
});

// Unlike an NFT by image string
router.post('/unlike', async (req, res) => {
  const { userAddress, imageString } = req.body; // Get the wallet address and image string from the request body

  // Validate userAddress and imageString
  if (!userAddress || !imageString) {
    return res.status(400).json({ message: "User address and image string are required." });
  }

  try {
    const nft = await NFT.findOne({ imageUrl: imageString }); // Query NFT by image string
    if (!nft) {
      return res.status(404).json({ message: "NFT not found" });
    }

    // Check if the user has liked the NFT
    if (nft.likes.includes(userAddress)) {
      nft.likes = nft.likes.filter(address => address !== userAddress); // Remove userAddress from the likes array
      await nft.save();
      return res.status(200).json({ message: "NFT unliked successfully", likes: nft.likes.length });
    } else {
      return res.status(400).json({ message: "You have not liked this NFT yet" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error unliking NFT", error });
  }
});

// Check the like count and whether a specific wallet has liked the NFT by image string
router.post('/check-like', async (req, res) => {
  
  const { userAddress, imageString } = req.body; // Get the wallet address and image string from the request body

  // Validate userAddress and imageString
  if (!userAddress || !imageString) {
    return res.status(400).json({ message: "User address and image string are required." });
  }

  
  try {
    const nft = await NFT.findOne({ imageUrl: imageString }); // Query NFT by image string
    if (!nft) {
      return res.status(404).json({ message: "NFT not found" });
    }

    // Check if the user has liked the NFT
    const hasLiked = nft.likes.includes(userAddress); // Check if userAddress is in the likes array
    const likeCount = nft.likes.length; // Get the like count

    return res.status(200).json({
      hasLiked: hasLiked, // True or False depending on if the user liked the NFT
      likeCount: likeCount  // The total number of likes for the NFT
    });
  } catch (error) {
    res.status(500).json({ message: "Error checking like status", error });
  }
});


// Route to fetch all liked NFTs by a specific wallet address
router.get('/user-liked', async (req, res) => {
  const { userAddress } = req.query; // Extract wallet address from the query parameter

  // Validate userAddress
  if (!userAddress) {
    return res.status(400).json({ message: "User address is required." });
  }

  try {
    // Find all NFTs where the likes array includes the given wallet address
    const likedNFTs = await NFT.find({ likes: userAddress });
    console.log("likedNFTs", likedNFTs);
    
    // Respond with the list of liked NFTs
    return res.status(200).json({ likedNFTs });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: "Error fetching liked NFTs", error });
  }
});


// Route to fetch all liked NFTs by a specific wallet address
router.get('/user-created', async (req, res) => {
  const { userAddress } = req.query; // Extract wallet address from the query parameter

  // Validate userAddress
  if (!userAddress) {
    return res.status(400).json({ message: "User address is required." });
  }

  try {
    // Find all NFTs where the likes array includes the given wallet address
    const likedNFTs = await NFT.find({ userAddress: userAddress });
    
    // Respond with the list of liked NFTs
    return res.status(200).json({ likedNFTs });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: "Error fetching liked NFTs", error });
  }
});


// Route to fetch all liked NFTs by a specific wallet address
router.get('/collection', async (req, res) => {
  const { category } = req.body; // Extract wallet address from the query parameter

  // Validate category
  if (!category) {
    return res.status(400).json({ message: "category is required." });
  }

  try {
    // Find all NFTs where the likes array includes the given wallet address
    const likedNFTs = await NFT.find({ category: category });
    
    // Respond with the list of liked NFTs
    return res.status(200).json({ likedNFTs });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: "Error fetching liked NFTs", error });
  }
});


router.post('/collection-wise-nft', async (req, res) => {
  const { category } = req.body;

  if (!category) {
    return res.status(400).json({ message: "Category is required." });
  }

  try {
    // Case-insensitive match for multi-word categories
    const matchingNFTs = await NFT.find({ category: { $regex: new RegExp(`^${category}$`, "i") } });

    return res.status(200).json({ matchingNFTs });
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    res.status(500).json({ message: "Error fetching NFTs", error });
  }
});


module.exports = router;
