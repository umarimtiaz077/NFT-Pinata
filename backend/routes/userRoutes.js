// userRoutes.js
const express = require("express");
const multer = require("multer");
const {
  registerOrLoginUser,
  updateUserProfile,
  getUserProfile,
  getUserProfileById,
  getAllUsers,
  followUser,
  getFollowers,
  getFollowing,
  getFollowCount,
  getLikedNFTs,
  getOwnedNFTs,
  getCreatedNFTs,
  unfollowUser,
} = require("../controllers/userController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/register", registerOrLoginUser);
router.put("/update-profile", upload.single("file"), updateUserProfile);
router.get("/:account", getUserProfile);
router.get("/profile/:userId", getUserProfileById);

router.get("/", getAllUsers);
router.post("/follow", followUser);
router.post("/unfollow", unfollowUser);
router.get("/:userId/followers", getFollowers);
router.get("/:userId/following", getFollowing);
router.get("/:userId/follow-count", getFollowCount);
router.get("/:userId/liked-nfts", getLikedNFTs);
router.get("/:userId/owned-nfts", getOwnedNFTs);
router.get("/:userId/created-nfts", getCreatedNFTs);

//new 
// Get all users
// router.get("/", async (req, res) => {
//   try {
//     const users = await User.find(); // Fetch all users from the database
//     res.status(200).json(users); // Send the list of users as a JSON response
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ message: "Error fetching users", error });
//   }
// });

// Follow another user
router.post("/follow", async (req, res) => {
  const { userId, followId } = req.body; // userId is the logged-in user, followId is the user to follow

  try {
    // Find both users in the database
    const user = await User.findById(userId);
    const userToFollow = await User.findById(followId);

    // Check if both users exist
    if (!user || !userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is already following the userToFollow
    if (user.following.includes(followId)) {
      return res
        .status(400)
        .json({ message: "You are already following this user" });
    }

    // Add followId to the user's following list
    user.following.push(followId);
    await user.save();

    // Add userId to the userToFollow's followers list
    if (!userToFollow.followers.includes(userId)) {
      userToFollow.followers.push(userId);
      await userToFollow.save();
    }

    res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({ message: "Error following user", error });
  }
});

// Get followers list
router.get("/:userId/followers", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate("followers");
    res.status(200).json(user.followers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching followers", error });
  }
});

// Get following list
router.get("/:userId/following", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate("following");
    res.status(200).json(user.following);
  } catch (error) {
    res.status(500).json({ message: "Error fetching following", error });
  }
});

// Get follow count
router.get("/:userId/follow-count", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    res
      .status(200)
      .json({
        followersCount: user.followers.length,
        followingCount: user.following.length,
      });
  } catch (error) {
    res.status(500).json({ message: "Error fetching follow count", error });
  }
});

// Get liked NFTs
router.get("/:userId/liked-nfts", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate("likedNFTs");
    res.status(200).json(user.likedNFTs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching liked NFTs", error });
  }
});

// Unliking an NFT
router.post("/:userId/unlike-nft", async (req, res) => {
  const { userId } = req.params;
  const { nftId } = req.body; // NFT ID to be unliked
  
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the NFT is already liked
    if (!user.likedNFTs.includes(nftId)) {
      return res.status(400).json({ message: "NFT is not in your liked list" });
    }

    // Remove the NFT ID from the likedNFTs array
    user.likedNFTs = user.likedNFTs.filter((id) => id.toString() !== nftId);

    await user.save(); // Save the changes
    res.status(200).json({ message: "NFT unliked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error unliking NFT", error });
  }
});


// Get owned NFTs
router.get("/:userId/owned-nfts", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate("ownedNFTs");
    res.status(200).json(user.ownedNFTs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching owned NFTs", error });
  }
});

// Get created NFTs
router.get("/:userId/created-nfts", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate("createdNFTs");
    res.status(200).json(user.createdNFTs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching created NFTs", error });
  }
});


module.exports = router;
