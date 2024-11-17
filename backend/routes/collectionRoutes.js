const express = require("express");
const { createCollection, getAllCollections,getUserCollections,getCollectionById } = require("../controllers/collectionController");
const multer = require("multer");

const router = express.Router();

// Configure multer for disk storage with unique filenames
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

// Route to create a new collection
router.post("/create-collection", upload.single("file"), createCollection);

// Route to get all collections
router.get("/", getAllCollections);

router.get("/user/:userId", getUserCollections);
router.get("/:collectionId", getCollectionById);


//new
router.get('/list/:timeRange', async (req, res) => {
    const { timeRange } = req.params;
    const now = new Date();
    let pastDate;
  
    // Define the past date based on the time range
    switch (timeRange) {
      case '24hours':
        pastDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7days':
        pastDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        pastDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        return res.status(400).json({ message: "Invalid time range" });
    }
  
    try {
      const categories = await Category.aggregate([
        {
          $lookup: {
            from: 'nfts',
            localField: '_id',
            foreignField: 'category',
            as: 'nfts'
          }
        },
        {
          $addFields: {
            nftsInRange: {
              $filter: {
                input: "$nfts",
                as: "nft",
                cond: { $gte: ["$$nft.createdAt", pastDate] }
              }
            }
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            image: 1,
            nftsCount: { $size: "$nftsInRange" }
          }
        },
        { $sort: { nftsCount: -1 } }
      ]);
  
      res.status(200).json({ categories, timeRange });
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  });
  
  
  
  module.exports = router;
  


module.exports = router;
