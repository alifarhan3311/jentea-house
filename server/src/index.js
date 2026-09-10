import 'dotenv/config'
import dns from 'node:dns'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import Product from './models/Product.js'
import { productCategories, seedProducts } from './data/products.js'

// Some local DNS resolvers refuse Atlas SRV lookups; use reliable public resolvers.
dns.setServers(['8.8.8.8', '1.1.1.1'])

const app = express()
const port = process.env.PORT || 4000

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'jentea-house-api' }))
app.get('/api/products', async (_req, res) => {
  if (mongoose.connection.readyState === 1) {
    const products = await Product.find({ available: true }).sort({ bestSeller: -1, category: 1, code: 1 }).lean()
    return res.json({ products, categories: productCategories, source: 'mongodb' })
  }
  res.json({ products: seedProducts, categories: productCategories, source: 'fallback' })
})

app.get('/api/products/:code', async (req, res) => {
  const code = req.params.code.toUpperCase()
  const product = mongoose.connection.readyState === 1
    ? await Product.findOne({ code, available: true }).lean()
    : seedProducts.find(item => item.code === code)
  if (!product) return res.status(404).json({ message: 'Product not found.' })
  res.json({ product, source: mongoose.connection.readyState === 1 ? 'mongodb' : 'fallback' })
})

app.post('/api/orders', async (req, res) => {
  const { items, customer, fulfillment } = req.body
  if (!Array.isArray(items) || items.length === 0 || !customer?.name || !customer?.phone) {
    return res.status(400).json({ message: 'Name, phone and at least one item are required.' })
  }
  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0)
  const order = { id: `JH-${Date.now().toString().slice(-6)}`, items, customer, fulfillment, subtotal, total: subtotal, status: 'Received', createdAt: new Date().toISOString() }
  res.status(201).json({ order })
})

async function start() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI)
      console.log('MongoDB connected')
    } catch (error) {
      console.error('MongoDB unavailable; continuing with API fallback:', error.message)
    }
  } else {
    console.log('MONGODB_URI not set; using in-memory product/order fallback')
  }
  app.listen(port, () => console.log(`Jentea House API listening on http://localhost:${port}`))
}

start()
