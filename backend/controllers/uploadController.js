// controllers/uploadController.js
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

// const uploadToPinata = async (fileBuffer, fileName, group) => {
//     const formData = new FormData();
//     formData.append('file', fileBuffer, { filename: fileName });

//     const metadata = JSON.stringify({
//         name: group === 'profiles' ? 'Profile Image' : 'NFT Image',
//         keyvalues: {
//             group: group, // Adds "profiles" or "nfts" as metadata
//         },
//     });
//     formData.append('pinataMetadata', metadata);

//     const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
//         headers: {
//             'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
//             pinata_api_key: process.env.PINATA_API_KEY,
//             pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
//         },
//     });

//     return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
// };

const handleFileUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        res.status(200).json({ url: fileUrl });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ message: 'Failed to upload file', error });
    }
};

module.exports = { handleFileUpload };
