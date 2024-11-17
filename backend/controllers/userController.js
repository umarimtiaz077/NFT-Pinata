// @ts-nocheck
const User = require("../models/User"); 

const registerOrLoginUser = async (req, res) => {
  try {
    const walletAddress = req.body.walletAddress.toLowerCase();

    let user = await User.findOne({ walletAddress });
    if (!user) {
      user = new User({ walletAddress, username: "", email: "", description: "", website: "" });
      await user.save();
      return res.status(201).json({ message: "User registered successfully", user });
    }

    res.status(200).json({ message: "User already exists", user });
  } catch (error) {
    res.status(500).json({ message: "Error registering or logging in user", error });
  }
};


const updateUserProfile = async (req, res) => {
  try {
    const walletAddress = req.body.walletAddress;
    const { username, email, description, website, socialLinks } = req.body;

    console.log("Received data:", {
      walletAddress,
      username,
      email,
      description,
      website,
      socialLinks,
    });

    
    if (!walletAddress) {
      return res.status(400).json({ message: "Wallet address is required" });
    }

    let profileImageUrl = req.body.profileImage; 
    if (req.file) {
   
      profileImageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }

  
    const updatedUser = await User.findOneAndUpdate(
      { walletAddress },
      {
        username,
        email,
        description,
        website,
        socialLinks,
        profileImage: profileImageUrl, 
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile", error });
  }
};


const getUserProfile = async (req, res) => {
  try {
    const { account } = req.params;
    const user = await User.findOne({ walletAddress: account.toLowerCase() }); 

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   
    res.status(200).json({ message: "User profile fetched successfully", user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getUserProfileById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error fetching user profile" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users", error });
  }
};

const followUser = async (req, res) => {
  const { userId, followId } = req.body;
  try {
    // Retrieve both users simultaneously
    const [user, userToFollow] = await Promise.all([
      User.findById(userId),
      User.findById(followId),
    ]);

    if (!user || !userToFollow) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.following.includes(followId)) {
      return res.status(400).json({ success: false, message: "Already following this user" });
    }

    // Add followId to user's following and userId to userToFollow's followers
    user.following.push(followId);
    userToFollow.followers.push(userId);

    // Save both updates concurrently
    await Promise.all([user.save(), userToFollow.save()]);

    return res.status(200).json({
      success: true,
      message: "User followed successfully",
      updatedFollowing: user.following,
      updatedFollowers: userToFollow.followers,
    });
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({ success: false, message: "Error following user", error: error.message });
  }
};

const unfollowUser = async (req, res) => {
  const { userId, unfollowId } = req.body;
  try {
    // Retrieve both users simultaneously
    const [user, userToUnfollow] = await Promise.all([
      User.findById(userId),
      User.findById(unfollowId),
    ]);

    if (!user || !userToUnfollow) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Filter out the unfollowId from user's following and userId from userToUnfollow's followers
    user.following = user.following.filter((id) => id.toString() !== unfollowId);
    userToUnfollow.followers = userToUnfollow.followers.filter((id) => id.toString() !== userId);

    // Save both updates concurrently
    await Promise.all([user.save(), userToUnfollow.save()]);

    return res.status(200).json({
      success: true,
      message: "User unfollowed successfully",
      updatedFollowing: user.following,
      updatedFollowers: userToUnfollow.followers,
    });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res.status(500).json({ success: false, message: "Error unfollowing user", error: error.message });
  }
};

const getFollowers = async (req, res) => {
  const { userId } = req.params;  
  try {
    const user = await User.findById(userId).populate("followers");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching followers", error });
  }
};

const getFollowing = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate("following");
    res.status(200).json(user.following);
  } catch (error) {
    res.status(500).json({ message: "Error fetching following", error });
  }
};

const getFollowCount = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    res.status(200).json({
      followersCount: user.followers.length,
      followingCount: user.following.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching follow count", error });
  }
};

const getLikedNFTs = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate("likedNFTs");
    res.status(200).json(user.likedNFTs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching liked NFTs", error });
  }
};

const getOwnedNFTs = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate("ownedNFTs");
    res.status(200).json(user.ownedNFTs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching owned NFTs", error });
  }
};

const getCreatedNFTs = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate("createdNFTs");
    res.status(200).json(user.createdNFTs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching created NFTs", error });
  }
};

module.exports = {
  registerOrLoginUser,
  updateUserProfile,
  getUserProfile,
  getUserProfileById,
  getAllUsers,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getFollowCount,
  getLikedNFTs,
  getOwnedNFTs,
  getCreatedNFTs,
};
