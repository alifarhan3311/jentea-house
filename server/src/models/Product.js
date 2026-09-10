import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  vietnamese: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true, index: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, required: true },
  tag: { type: String, default: '' },
  image: { type: String, required: true },
  ingredients: { type: [String], default: [] },
  available: { type: Boolean, default: true },
  bestSeller: { type: Boolean, default: false }
}, { timestamps: true })

export default mongoose.model('Product', productSchema)
