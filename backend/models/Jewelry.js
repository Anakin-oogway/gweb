import mongoose from 'mongoose';

const JewelrySchema = new mongoose.Schema({
  modelId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  material: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  description: { 
    type: String 
  },
  weight: { 
    type: String 
  },
  glbPath: { 
    type: String, 
    required: true 
  }
}, {
  timestamps: true
});

export default mongoose.model('Jewelry', JewelrySchema);
