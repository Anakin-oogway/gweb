import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Jewelry from './models/Jewelry.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern_db';

// Middleware
app.use(cors());
app.use(express.json());

// Seed Data definition
const defaultJewelry = [
  {
    modelId: 'gold_necklace',
    name: 'Classic 18K Gold Rope Chain',
    material: '18K Yellow Gold Solid',
    price: 1299.00,
    description: 'A classic 18-karat solid yellow gold rope chain, featuring diamond-cut detailing for maximum light reflection and sparkle.',
    weight: '24.5g',
    glbPath: '/models/gold_necklace__chain.glb'
  },
  {
    modelId: 'cuban_chain',
    name: 'Miami Cuban Link Choker',
    material: '14K Yellow Gold Solid',
    price: 3450.00,
    description: 'An iconic heavy Miami Cuban link choker, featuring hand-polished solid 14-karat gold with a custom security clasp.',
    weight: '62.1g',
    glbPath: '/models/cuban_chain.glb'
  },
  {
    modelId: 'chain_set',
    name: 'Signature Double Chain Combo',
    material: '18K Gold & Sterling Silver',
    price: 7800.00,
    description: 'A premium double-layered necklace set combining a thick Cuban link in sterling silver and a classic rope chain in 18K solid yellow gold.',
    weight: '88.3g',
    glbPath: '/models/chain_set.glb'
  }
];

// Helper to seed the database
const seedDatabase = async () => {
  try {
    const count = await Jewelry.countDocuments();
    if (count === 0) {
      await Jewelry.insertMany(defaultJewelry);
      console.log('Seeded default jewelry items in database.');
    }
  } catch (err) {
    console.error('Error seeding jewelry database:', err.message);
  }
};

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    seedDatabase();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    console.log('Ensure MongoDB is running locally on port 27017, or update MONGO_URI in backend/.env');
  });

// Define a simple Schema & Model for demonstration (from initial setup)
const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  createdAt: { type: Date, default: Date.now }
});

const Item = mongoose.model('Item', ItemSchema);

// API Routes

// Health check endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    message: 'Express server is running and configured!',
    mongoConnected: mongoose.connection.readyState === 1
  });
});

// GET all jewelry items (for 3D viewer specs)
app.get('/api/jewelry', async (req, res) => {
  try {
    const jewelryList = await Jewelry.find();
    res.json(jewelryList);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving jewelry items', error: error.message });
  }
});

// GET all items (from initial setup)
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving items', error: error.message });
  }
});

// POST a new item (from initial setup)
app.post('/api/items', async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const newItem = new Item({ name, description });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Error creating item', error: error.message });
  }
});

// Root Route
app.get('/', (req, res) => {
  res.send('MERN Backend API is running. Access endpoints via /api/...');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
