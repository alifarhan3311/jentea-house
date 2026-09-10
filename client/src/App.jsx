import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, ChevronDown, Clock3, MapPin, Minus, Phone, Plus, Search, ShoppingBag, Sparkles, X } from 'lucide-react'

const fallbackProducts = [
  { code: 'S1', name: 'Traditional Assorted Cold-Cut Banh Mi', vietnamese: 'Banh Mi Thap Cam', category: 'Banh Mi', price: 6.99, description: 'Crisp baguette, house pate, cold cuts, pickled carrot and daikon.', tag: 'Bestseller', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85' },
  { code: 'S2', name: 'Grilled Chicken Banh Mi', vietnamese: 'Banh Mi Ga Nuong', category: 'Banh Mi', price: 7.99, description: 'Lemongrass chicken, cucumber, cilantro and bright house pickles.', tag: 'Popular', image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=900&q=85' },
  { code: 'P1', name: 'Rare Beef Noodle Soup', vietnamese: 'Pho Bo Tai', category: 'Pho', price: 14.99, description: 'Slow-simmered aromatic broth, rare beef, rice noodles and herbs.', tag: 'Bestseller', image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=900&q=85' },
  { code: 'P5', name: 'Special Chicken Noodle Soup', vietnamese: 'Pho Ga', category: 'Pho', price: 14.99, description: 'Silky chicken broth with tender chicken, rice noodles and greens.', tag: 'Comfort', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=85' },
  { code: 'V1', name: 'Grilled Pork Vermicelli Bowl', vietnamese: 'Bun Thit Nuong', category: 'Vermicelli', price: 15.49, description: 'Charred pork, vermicelli, fresh greens, herbs and nuoc cham.', tag: 'Fresh', image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=85' },
  { code: 'D1', name: 'Jasmine Milk Tea', vietnamese: 'Tra Sua Hoa Nhai', category: 'Drinks', price: 5.25, description: 'Creamy jasmine tea with your choice of sweetness and ice.', tag: 'New', image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=900&q=85' },
  { code: 'D2', name: 'Mango Green Tea', vietnamese: 'Tra Xanh Xoai', category: 'Drinks', price: 5.75, description: 'Fragrant green tea, ripe mango and a citrusy finish.', tag: 'Bright', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=85' },
  { code: 'S5', name: 'Crispy Vegetable Spring Rolls', vietnamese: 'Cha Gio Chay', category: 'Spring Rolls', price: 8.49, description: 'Golden rolls filled with vegetables, served with tangy dip.', tag: 'Vegan', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=85' }
]

const categories = ['All', 'Banh Mi', 'Pho', 'Vermicelli', 'Spring Rolls', 'Drinks']
const money = value => `$${value.toFixed(2)}`

function App() {
  const path = window.location.pathname
  const [products, setProducts] = useState(fallbackProducts)
  const [activeCategory, setActiveCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [fulfillment, setFulfillment] = useState('Pickup')
  const [submittedOrder, setSubmittedOrder] = useState(null)
  const [notice, setNotice] = useState('')
  const [productDetail, setProductDetail] = useState(null)

  useEffect(() => {
    fetch('/api/products').then(response => response.ok ? response.json() : null).then(data => data?.products && setProducts(data.products)).catch(() => {})
  }, [])

  useEffect(() => {
    if (!path.startsWith('/product/')) return
    const code = path.split('/').pop()
    fetch(`/api/products/${code}`).then(response => response.ok ? response.json() : null).then(data => setProductDetail(data?.product || null)).catch(() => setProductDetail(null))
  }, [path])

  const filtered = useMemo(() => products.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory
    const haystack = `${product.name} ${product.vietnamese} ${product.description}`.toLowerCase()
    return matchesCategory && haystack.includes(query.toLowerCase())
  }), [activeCategory, products, query])

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const addToCart = product => {
    setCart(current => {
      const existing = current.find(item => item.code === product.code)
      return existing ? current.map(item => item.code === product.code ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { ...product, quantity: 1 }]
    })
    setNotice(`${product.name} added to your order`)
    setTimeout(() => setNotice(''), 2200)
  }

  const adjustQuantity = (code, amount) => setCart(current => current.map(item => item.code === code ? { ...item, quantity: item.quantity + amount } : item).filter(item => item.quantity > 0))

  const placeOrder = async event => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const payload = { items: cart, fulfillment, customer: { name: form.get('name'), phone: form.get('phone'), notes: form.get('notes') } }
    try {
      const response = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const result = response.ok ? await response.json() : null
      setSubmittedOrder(result?.order || { id: `JH-${Date.now().toString().slice(-6)}`, status: 'Received' })
    } catch {
      setSubmittedOrder({ id: `JH-${Date.now().toString().slice(-6)}`, status: 'Received' })
    }
    setCart([])
    setCheckoutOpen(false)
    setCartOpen(false)
  }

  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="/" aria-label="Jentea House home"><span className="brand-mark">J</span><span><strong>Jentea</strong><em>HOUSE</em></span></a>
      <nav><a href="/menu">Menu</a><a href="/about">Our story</a><a href="/contact">Visit us</a></nav>
      <button className="cart-button" onClick={() => setCartOpen(true)} aria-label="Open cart"><ShoppingBag size={18} /><span>Order</span>{cartCount > 0 && <b>{cartCount}</b>}</button>
    </header>

    <main id="top">
      {path !== '/' && <RoutePage path={path} products={products} productDetail={productDetail} filtered={filtered} activeCategory={activeCategory} setActiveCategory={setActiveCategory} query={query} setQuery={setQuery} addToCart={addToCart} />}
      {path === '/' && <>
      <section className="hero luxe-hero">
        <div className="hero-copy"><p className="eyebrow"><Sparkles size={14} /> Est. in Oshawa · Vietnamese kitchen</p><h1>An ode to<br /><i>good taste.</i></h1><p className="hero-text">Where every bowl is built with patience, every tea has a bright side, and every visit feels like a little occasion.</p><div className="hero-actions"><a className="primary-button" href="/menu">Explore the menu <ArrowRight size={17} /></a><a className="text-link" href="/reservation">Make a reservation <ArrowRight size={15} /></a></div></div>
        <div className="hero-image"><div className="hero-image-label"><span>Jentea House</span><strong>Vietnamese comfort,<br />beautifully served.</strong></div></div>
      </section>

      <section className="why-section"><div className="why-heading"><p className="eyebrow">Why choose Jentea</p><h2>Crafted for the<br /><i>curious palate.</i></h2></div><div className="why-grid"><div><span className="why-number">01</span><Sparkles size={22} /><h3>Slow-made comfort</h3><p>Broths, pickles and sauces that are given the time they deserve.</p></div><div><span className="why-number">02</span><MapPin size={22} /><h3>Freshly local</h3><p>Bright herbs, crisp vegetables and familiar ingredients, every day.</p></div><div><span className="why-number">03</span><Clock3 size={22} /><h3>Warm service</h3><p>A neighbourhood table where you can stay for one more sip.</p></div></div></section>

      <section className="menu-section" id="menu"><div className="section-heading"><div><p className="eyebrow">The good stuff</p><h2>Order your favourites</h2></div><div className="search-box"><Search size={17} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search the menu" /></div></div><div className="category-row">{categories.map(category => <button className={activeCategory === category ? 'active' : ''} key={category} onClick={() => setActiveCategory(category)}>{category}</button>)}</div><div className="product-grid">{filtered.map((product, index) => <ProductCard product={product} index={index} onAdd={addToCart} key={product.code} />)}</div></section>

      <section className="stats-strip"><div><strong>4.9</strong><span>Google rating</span></div><div><strong>15<span>m</span></strong><span>Pickup time</span></div><div><strong>8</strong><span>House favourites</span></div><div><strong>100<span>%</span></strong><span>Made with care</span></div></section>

      <section className="story-section" id="story"><div className="story-image" /><div className="story-copy"><p className="eyebrow">A little about us</p><h2>Rooted in tradition.<br /><i>Open to now.</i></h2><p>Jentea House is a neighbourhood kitchen for the meals you crave and the little moments you keep. Our menu moves between Vietnamese comfort food and the tea drinks we cannot stop experimenting with.</p><a className="text-link" href="https://www.ubereats.com/ca/store/jentea-house-55-king-st-e/NYVjPqAnVDSu_49BLUhCvg" target="_blank" rel="noreferrer">Order on Uber Eats <ArrowRight size={15} /></a></div></section>

      <section className="home-gallery"><div className="section-heading"><div><p className="eyebrow">A seat at our table</p><h2>Follow the flavour.</h2></div><a className="text-link" href="/gallery">View gallery <ArrowRight size={15} /></a></div><div className="home-gallery-grid"><img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=85" alt="Jentea House dining room" /><img src="https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=900&q=85" alt="Pho bowl" /><img src="https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=900&q=85" alt="Milk tea" /><img src="https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=85" alt="Spring rolls" /></div></section>

      <section className="reservation-cta"><div><p className="eyebrow">Make an evening of it</p><h2>Reserve your<br /><i>Jentea moment.</i></h2><p>Gather your people, choose your favourites and let us take care of the rest.</p><a className="primary-button" href="/reservation">Book a table <ArrowRight size={16} /></a></div></section>

      <section className="visit-section" id="visit"><div><p className="eyebrow">Come say hi</p><h2>Find us in<br /><i>downtown Oshawa.</i></h2></div><div className="visit-details"><div><MapPin size={20} /><span>55 King St E<br />Oshawa, ON L1H 1B4</span></div><div><Clock3 size={20} /><span>Open today<br />11:00 AM – 8:00 PM</span></div><div><Phone size={20} /><span>905-728-5888</span></div><a className="primary-button" href="https://www.google.com/maps/place/Jentea+House/@43.897991,-78.8614404,17z" target="_blank" rel="noreferrer">Get directions <ArrowRight size={16} /></a></div></section>
      </>}
    </main>

    <footer><a className="brand" href="/"><span className="brand-mark">J</span><span><strong>Jentea</strong><em>HOUSE</em></span></a><p>Vietnamese food, tea and good company.<br />Oshawa, Ontario.</p><div className="footer-links"><a href="/about">About</a><a href="/menu">Menu</a><a href="/gallery">Gallery</a><a href="/reservation">Reservation</a><a href="/contact">Contact</a></div><span>© 2026 Jentea House</span></footer>

    <AnimatePresence>{notice && <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} className="toast"><Check size={16} /> {notice}</motion.div>}</AnimatePresence>
    <AnimatePresence>{cartOpen && <CartDrawer cart={cart} subtotal={subtotal} onClose={() => setCartOpen(false)} onAdjust={adjustQuantity} onCheckout={() => setCheckoutOpen(true)} />}</AnimatePresence>
    <AnimatePresence>{checkoutOpen && <CheckoutModal fulfillment={fulfillment} setFulfillment={setFulfillment} subtotal={subtotal} onClose={() => setCheckoutOpen(false)} onSubmit={placeOrder} />}</AnimatePresence>
    <AnimatePresence>{submittedOrder && <motion.div className="success-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><div className="success-card"><span className="success-icon"><Check size={28} /></span><p className="eyebrow">You're all set</p><h2>Order received.</h2><p>We'll have it ready for you soon. Your order number is <strong>{submittedOrder.id}</strong>.</p><button className="primary-button" onClick={() => setSubmittedOrder(null)}>Back to menu <ArrowRight size={16} /></button></div></motion.div>}</AnimatePresence>
  </div>
}

function RoutePage({ path, products, productDetail, filtered, activeCategory, setActiveCategory, query, setQuery, addToCart }) {
  if (path.startsWith('/product/')) return <ProductDetail product={productDetail} products={products} onAdd={addToCart} />
  if (path === '/menu') return <section className="page-view menu-page"><PageHero eyebrow="The Jentea menu" title={<>Come hungry.<br /><i>Leave happy.</i></>} text="Vietnamese classics, bright teas and little things worth sharing." image="https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1500&q=90" /><MenuCatalog products={products} filtered={filtered} activeCategory={activeCategory} setActiveCategory={setActiveCategory} query={query} setQuery={setQuery} onAdd={addToCart} /></section>
  if (path === '/about') return <section className="page-view"><PageHero eyebrow="Our story" title={<>Made with care.<br /><i>Served with heart.</i></>} text="A neighbourhood kitchen for Vietnamese comfort food, tea and good company." image="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1500&q=90" /><section className="legacy-section"><div><p className="eyebrow">A Jentea house note</p><h2>Tradition gives us<br /><i>somewhere to start.</i></h2></div><div><p>Jentea House is built around the Vietnamese meals that make a day feel better: broth that takes its time, bread still warm from the oven, herbs that wake everything up and tea for the walk home.</p><p>We keep the classics close and leave a little room for the present. That means honest ingredients, generous portions and a room that feels like yours.</p></div></section><ValuesSection /></section>
  if (path === '/gallery') return <section className="page-view"><PageHero eyebrow="Inside Jentea" title={<>A table for<br /><i>every mood.</i></>} text="A peek at the food, people and little rituals that make our house." image="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1500&q=90" /><GallerySection /></section>
  if (path === '/reservation') return <section className="page-view"><PageHero eyebrow="Make it a plan" title={<>Save us<br /><i>a seat.</i></>} text="For larger groups, celebrations or simply a meal you want to take slowly, send us a note." image="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1500&q=90" /><ReservationForm /></section>
  return <section className="page-view"><PageHero eyebrow="Come say hi" title={<>Find your way<br /><i>to Jentea.</i></>} text="55 King St E, downtown Oshawa. We are here for lunch, dinner and the tea in between." image="https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1500&q=90" /><ContactSection /></section>
}

function PageHero({ eyebrow, title, text, image }) { return <section className="page-hero"><div className="page-hero-copy"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="hero-text">{text}</p></div><div className="page-hero-image" style={{ backgroundImage: `linear-gradient(180deg,rgba(24,22,16,.05),rgba(24,22,16,.55)),url(${image})` }} /></section> }
function MenuCatalog({ products, filtered, activeCategory, setActiveCategory, query, setQuery, onAdd }) { return <section className="menu-section route-menu"><div className="section-heading"><div><p className="eyebrow">From our kitchen</p><h2>Signature creations</h2></div><div className="search-box"><Search size={17} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search the menu" /></div></div><div className="category-row">{categories.map(category => <button className={activeCategory === category ? 'active' : ''} key={category} onClick={() => setActiveCategory(category)}>{category}</button>)}</div><div className="product-grid">{filtered.map((product, index) => <ProductCard product={product} index={index} onAdd={onAdd} key={product.code} />)}</div></section> }
function ValuesSection() { return <section className="values-section"><div><span>01</span><h3>Slow broth</h3><p>Comfort starts with the things that cannot be rushed.</p></div><div><span>02</span><h3>Bright herbs</h3><p>Freshness in every bowl, baguette and glass.</p></div><div><span>03</span><h3>Warm welcome</h3><p>Come as you are. Stay for one more bite.</p></div></section> }
function GallerySection() { const images = ['https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85', 'https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=900&q=85', 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=85', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=900&q=85', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=85']; return <section className="gallery-grid">{images.map((image, index) => <img src={image} alt={`Jentea House detail ${index + 1}`} loading="lazy" key={image} />)}</section> }
function ReservationForm() { return <section className="form-section"><div><p className="eyebrow">Group dining</p><h2>Tell us what<br /><i>you are planning.</i></h2><p>We will get back to you by phone to confirm your table. For same-day pickup orders, use our menu instead.</p></div><form onSubmit={event => event.preventDefault()}><label>Name<input required placeholder="Your name" /></label><label>Phone<input required type="tel" placeholder="905-555-0123" /></label><div className="form-row"><label>Date<input required type="date" /></label><label>Guests<select defaultValue="2"><option>2 guests</option><option>3-4 guests</option><option>5-8 guests</option><option>9+ guests</option></select></label></div><label>Note<textarea placeholder="Tell us about your occasion..." /></label><button className="primary-button" type="submit">Request a table <ArrowRight size={16} /></button></form></section> }
function ContactSection() { return <section className="contact-grid"><div className="contact-card"><MapPin size={21} /><h3>Come by</h3><p>55 King St E<br />Oshawa, ON L1H 1B4</p><a className="text-link" href="https://www.google.com/maps/place/Jentea+House/@43.897991,-78.8614404,17z" target="_blank" rel="noreferrer">Open in Maps <ArrowRight size={15} /></a></div><div className="contact-card"><Clock3 size={21} /><h3>Hours</h3><p>Monday – Sunday<br />11:00 AM – 8:00 PM</p></div><div className="contact-card"><Phone size={21} /><h3>Talk to us</h3><p>905-728-5888<br />hello@jenteahouse.com</p><a className="text-link" href="tel:+19057285888">Call Jentea <ArrowRight size={15} /></a></div></section> }

function ProductCard({ product, index, onAdd }) { return <motion.article className="product-card" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: index * 0.05 }}><div className="product-image"><img src={product.image} alt={product.name} loading="lazy" /><span>{product.tag}</span><button onClick={() => onAdd(product)} aria-label={`Add ${product.name}`}><Plus size={19} /></button></div><div className="product-meta"><div><p>{product.vietnamese}</p><h3>{product.name}</h3></div><strong>{money(product.price)}</strong></div><p className="product-description">{product.description}</p><a className="product-detail-link" href={`/product/${product.code}`}>View details <ArrowRight size={14} /></a></motion.article> }

function ProductDetail({ product, products, onAdd }) {
  if (!product) return <section className="detail-loading"><p className="eyebrow">Jentea menu</p><h1>Finding that bowl...</h1><a className="text-link" href="/menu">Back to menu <ArrowRight size={15} /></a></section>
  const related = products.filter(item => item.code !== product.code && item.category === product.category).slice(0, 3)
  return <section className="product-detail-page"><div className="detail-breadcrumb"><a href="/menu">Menu</a><span>/</span><span>{product.category}</span></div><div className="detail-layout"><div className="detail-image"><img src={product.image} alt={product.name} /></div><div className="detail-copy"><p className="eyebrow">{product.tag} · {product.vietnamese}</p><h1>{product.name}</h1><strong className="detail-price">{money(product.price)}</strong><p className="detail-description">{product.description}</p><div className="ingredient-list"><p>What is in it</p><div>{(product.ingredients || []).map(ingredient => <span key={ingredient}>{ingredient}</span>)}</div></div><button className="primary-button" onClick={() => onAdd(product)}>Add to order <Plus size={17} /></button><a className="detail-back" href="/menu">← Continue browsing</a></div></div>{related.length > 0 && <section className="related-section"><div className="section-heading"><div><p className="eyebrow">More from {product.category}</p><h2>You might also like</h2></div></div><div className="product-grid">{related.map((item, index) => <ProductCard product={item} index={index} onAdd={onAdd} key={item.code} />)}</div></section>}</section>
}

function CartDrawer({ cart, subtotal, onClose, onAdjust, onCheckout }) { return <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}><motion.aside className="cart-drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} onClick={event => event.stopPropagation()}><div className="drawer-header"><div><p className="eyebrow">Your order</p><h2>{cart.length ? 'Looking good.' : 'Your cart is empty.'}</h2></div><button className="icon-button" onClick={onClose}><X size={19} /></button></div>{cart.length ? <><div className="cart-items">{cart.map(item => <div className="cart-item" key={item.code}><img src={item.image} alt="" /><div><h3>{item.name}</h3><p>{money(item.price)}</p><div className="quantity"><button onClick={() => onAdjust(item.code, -1)}><Minus size={13} /></button><span>{item.quantity}</span><button onClick={() => onAdjust(item.code, 1)}><Plus size={13} /></button></div></div></div>)}</div><div className="cart-total"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><button className="primary-button full" onClick={onCheckout}>Continue to checkout <ArrowRight size={16} /></button></> : <div className="empty-cart"><ShoppingBag size={32} /><p>Add something warm, crisp or sweet.</p><a href="#menu" onClick={onClose}>Browse menu <ArrowRight size={15} /></a></div>}</motion.aside></motion.div> }

function CheckoutModal({ fulfillment, setFulfillment, subtotal, onClose, onSubmit }) { return <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div className="checkout-modal" initial={{ y: 25, opacity: 0 }} animate={{ y: 0, opacity: 1 }}><div className="drawer-header"><div><p className="eyebrow">Almost there</p><h2>Complete your order</h2></div><button className="icon-button" onClick={onClose}><X size={19} /></button></div><div className="fulfillment-toggle">{['Pickup', 'Delivery'].map(option => <button className={fulfillment === option ? 'active' : ''} key={option} onClick={() => setFulfillment(option)}>{option}<small>{option === 'Pickup' ? 'Ready in ~15 min' : 'Address at checkout'}</small></button>)}</div><form onSubmit={onSubmit}><label>Name<input name="name" required placeholder="Your name" /></label><label>Phone<input name="phone" required type="tel" placeholder="905-555-0123" /></label>{fulfillment === 'Delivery' && <label>Delivery address<input name="address" required placeholder="Street and unit" /></label>}<label>Notes <span className="optional">optional</span><textarea name="notes" placeholder="Extra herbs, no onions..." /></label><div className="checkout-summary"><span>Cash on {fulfillment.toLowerCase()}</span><strong>{money(subtotal)}</strong></div><button className="primary-button full" type="submit">Place order <ArrowRight size={16} /></button></form></motion.div></motion.div> }

export default App
