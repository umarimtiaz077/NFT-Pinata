// server.mjs
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { create } from 'ipfs-http-client';
import dotenv from 'dotenv';
import userRoutes from './routes/users.mjs'; // Ensure path and extension match

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Adjust this to your front-end's URL if needed
  credentials: true,
}));

// Increase the payload size limit for JSON and URL-encoded data
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Initialize IPFS
const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
app.set('ipfs', ipfs);

// Sample IPFS route to add a file
app.post('/api/ipfs/add', async (req, res) => {
  try {
    const { data } = req.body; // Assuming data is a base64 string or plain text
    const buffer = Buffer.from(data, 'utf-8');
    const result = await ipfs.add(buffer);
    res.json({ cid: result.path, url: `https://ipfs.infura.io/ipfs/${result.path}` });
  } catch (error) {
    console.error('Error adding to IPFS:', error);
    res.status(500).send(error.toString());
  }
});

// Use the imported routes
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
