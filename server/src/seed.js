import 'dotenv/config'
import dns from 'node:dns'
import mongoose from 'mongoose'
import Product from './models/Product.js'
import { seedProducts } from './data/products.js'

dns.setServers(['8.8.8.8', '1.1.1.1'])

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is required. Copy server/.env.example to server/.env first.')
  process.exit(1)
}

try {
  await mongoose.connect(process.env.MONGODB_URI)
  await Product.deleteMany({})
  await Product.insertMany(seedProducts.map(product => ({ ...product, bestSeller: product.tag === 'Bestseller' })))
  console.log(`Seeded ${seedProducts.length} products into MongoDB.`)
} catch (error) {
  console.error('Product seed failed:', error.message)
  process.exitCode = 1
} finally {
  await mongoose.disconnect()
}
