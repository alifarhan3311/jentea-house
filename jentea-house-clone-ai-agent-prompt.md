# AI Agent Prompt — Vietnamese Restaurant Online Ordering Platform (Jentea House Clone)

Copy is prompt ko AI coding agent (Cursor / Claude Code / Bolt.new / Windsurf) mein paste kardo project shuru karne ke liye.

---

## 1. PROJECT OVERVIEW

Mujhe ek **full-stack online food ordering platform** banana hai, scratch se, jo **Jentea House** restaurant (Oshawa, Ontario, Canada) ke liye hai. Design purani site ki bilkul copy nahi karni — **content/business data same rakhna hai** lekin **UI/UX bilkul modern, attractive aur updated banana hai**.

**Reference site:** https://jenteahouse.com/ (sirf content/data reference ke liye, design reference nahi)

### Supplied Business Sources

In links ko research/reference ke liye use karo. Source content ko scrape karke copyrighted photos, reviews, logos ya third-party text ko blindly copy mat karo.

- **Google Business Profile / location:** https://www.google.com/maps/place/Jentea+House/@43.897991,-78.8614404,17z/data=!3m1!4b1!4m6!3m5!1s0x89d51d986c5e5b1b:0xd0db76548d4ef07b!8m2!3d43.897991!4d-78.8614404!16s%2Fg%2F11x5h1y5bf
- **Uber Eats ordering reference:** https://www.ubereats.com/ca/store/jentea-house-55-king-st-e/NYVjPqAnVDSu_49BLUhCvg
- **Facebook photos/social reference:** https://www.facebook.com/fb-answers/jentea-house-photos/

**Access note:** supplied Uber Eats page may redirect or block automated access, aur supplied Facebook URL ko official Jentea House page ke taur par verify nahi kiya ja saka. In pages se data reliably available na ho to manually confirmed values ya original licensed assets use karo; fabricated menu, hours, reviews ya social posts mat banao.

**Source-of-truth rule:** location, current rating, hours and third-party order links ko Google Business Profile se verify karo. Menu names/prices ko restaurant/Uber Eats source se verify karo. Agar sources conflict karein, admin-editable database values use karo, UI mein unverified fact invent mat karo, aur README mein conflict note karo. External pages inaccessible hon to clearly marked placeholder use karo.

### Business Content (yeh same use karo)
- **Restaurant Name:** Jentea House
- **Cuisine:** Vietnamese, Asian
- **Tagline:** Order online for delivery or pick up at Jentea House restaurant — serving delicious traditional Vietnamese food
- **Address:** 55 King St E, Oshawa, ON, Canada L1H 1B4 (Google Business Profile listing se verify; hard-code karne ke bajaye admin-editable rakho)
- **Phone:** +1 905-728-5888
- **Rating:** 4.9 stars shown on the supplied Google Business Profile reference; review count ko verify kiye baghair show mat karo
- **Coordinates:** 43.897991, -78.8614404
- **Order modes:** Delivery + Pickup (avg pickup time ~15 min)
- **Third-party ordering:** Uber Eats link ko prominent external CTA ke taur par show karo; Uber Eats menu/prices ko automatically copy na karo

### Menu Categories (same rakhni hain)
1. Spring Rolls & Salad
2. Vietnamese Sandwiches - Banh Mi
3. Vietnamese Noodle Soups - Pho
4. Vermicelli - Bun
5. Rice & Wonton Soup
6. Drinks (Milk Tea, Fruit Tea)

### Sample Best-Seller Products (same names/prices seed data ke liye use karo)
| Product | Price |
|---|---|
| S1. Traditional Assorted Cold-Cut Sandwich - Banh Mi Thap Cam | $6.99 |
| S2. Grilled Chicken Sandwich - Banh Mi Ga Nuong | $7.99 |
| S3. Grilled Pork Sandwich - Banh Mi Heo Nuong | $7.99 |
| S4. Grilled Beef Sandwich - Banh Mi Bo Nuong | $8.99 |
| P1. Rare Beef Noodle Soup - Pho Bo Tai | $14.99 |
| P5. Special Chicken Noodle Soup - Pho Ga | $14.99 |

Baqi products/categories ke liye realistic Vietnamese menu items khud generate kar (spring rolls, vermicelli bowls, wonton soups, milk teas, fruit teas) same style ke naming convention (code prefix jese S1, P1, V1 etc + English + Vietnamese name) ke sath.

---

## 2. TECH STACK (Mandatory)

- **Frontend:** React.js (Vite) + React Router + Context API / Redux Toolkit for state (cart, auth)
- **Styling:** TailwindCSS + Framer Motion (animations) — no plain bootstrap-type basic UI
- **Backend:** Node.js + Express.js (REST API, MVC structure)
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (access + refresh token), bcrypt for password hashing
- **Realtime (chat support):** Socket.io
- **Image handling:** Multer + Cloudinary (ya local `/uploads`)
- **Validation:** express-validator (backend), react-hook-form + zod (frontend)
- **State persistence:** localStorage for cart/session fallback

---

## 3. DESIGN REQUIREMENTS (bohot important — purani site ki design bekar hai)

- **Modern, premium, attractive UI** — Vietnamese/Asian restaurant vibe (warm tones: deep red/maroon, gold/mustard accents, cream background, dark mode option)
- **Splash screen** — animated logo intro (2-3 sec) on first load, fade out into homepage
- **On-scroll animations** — Framer Motion / AOS (fade-up, stagger, parallax on hero, scale-in cards) on every section
- **Text animations** — hero heading letter/word reveal animation, animated counters (e.g. "500+ orders served")
- **Micro-interactions** — hover effects on product cards (image zoom, add-to-cart bounce), animated buttons, skeleton loaders
- **Lazy loading** — images (`loading="lazy"` + blur-up placeholder), route-based code splitting (`React.lazy` + `Suspense`) for all pages
- **Sticky glassmorphism header** with scroll-shrink effect
- **Fully responsive** — mobile-first, bottom sticky "Add to Cart" bar on mobile product pages
- **Toast notifications** for cart add/remove, order status, errors (react-hot-toast)
- **Empty states & loading skeletons** everywhere (menu load, orders, chat)
- **Smooth page transitions** between routes (Framer Motion AnimatePresence)

---

## 4. PAGES & FEATURES (complete list)

### 4.1 Public Pages
- **Home Page**
  - Splash screen → Hero section (animated headline, CTA "Order Now" / "Pickup")
  - Best sellers carousel (auto-scroll, animated cards)
  - Category grid (icons/images, on-scroll reveal)
  - About preview section, testimonials/reviews slider, map + address, newsletter signup
- **Menu Page**
  - Sticky category sidebar/tabs (sticky sub-nav on scroll)
  - Product grid with filters (see 4.2)
  - Search bar with live filter (debounced)
  - Add-to-cart with quantity stepper directly from card (mini modal for customizable items)
- **Product Detail Page**
  - Image gallery, description, price, ingredient/customization options (size, add-ons, spice level, remove-ingredient checkboxes)
  - Quantity selector, special instructions text box, dynamic price calculation
  - Related products section
- **About Us Page** — restaurant story, chef/team, gallery, values, animated timeline
- **Contact Us Page** — contact form (name, email, phone, message) + map embed + address/phone/hours + "report a problem" form (jaisa original site pe tha)
- **Location Page** — map, address, hours, directions link

### 4.2 Header / Footer / Side Menu
- **Header:** Logo, nav links (Home, Menu, About, Contact, Location), cart icon with live item-count badge (animated), search icon, login/profile dropdown, mobile hamburger → animated side drawer
- **Side Menu (mobile/drawer):** nav links, login/signup, cart summary, dark mode toggle
- **Footer:** nav links, address/phone/hours, social icons, Terms & Conditions, Privacy Policy, newsletter, "Created by [your brand]" credit, copyright

### 4.3 Filters (Menu Page)
- Category filter
- Price range slider
- Dietary tags: Vegetarian, Vegan, Gluten-Free, Spicy
- Sort by: Popularity, Price (low-high/high-low), Best sellers
- "Available now" toggle (based on item availability flag)

### 4.4 Auth
- **Signup** — name, email, phone, password, confirm password; email verification (OTP or link)
- **Login** — email/phone + password, "remember me", social login optional (Google)
- **Forgot Password** — email input → reset link/OTP → new password form
- **Authorization** — JWT-protected routes; role-based (customer vs admin) middleware on backend; protected route wrapper on frontend

### 4.5 Customer Dashboard
- Overview (recent order status, quick reorder)
- **Profile** — edit name/email/phone/password, saved addresses (add/edit/delete), avatar upload
- **Previous Orders** — order history list with status badges, "reorder" button, invoice/receipt view
- **Order Tracking** — live status stepper (Order Placed → Confirmed → Preparing → Ready for Pickup/Out for Delivery → Delivered), estimated time, map for delivery tracking (optional)
- **Chat Support** — floating chat widget, real-time messaging with admin/support (Socket.io), chat history

### 4.6 Checkout & Payment
- Cart review page (edit qty, remove item, apply coupon code)
- Pickup vs Delivery toggle
- **Pickup Page** — select pickup time slot, store location confirm
- Delivery address selection/add new address
- **Payment:** abhi sirf **Cash on Delivery (COD)** enable karo. Payment gateway ka structure/abstraction is tarah banao ke future mein **bank/card payment (Stripe)** easily add ho sake (payment method ko modular/strategy pattern mein rakho, ek `paymentMethod` field enum: `COD`, `CARD` — CARD abhi disabled/"coming soon" dikhe)
- Order summary + place order → confirmation page with animated success state

### 4.7 Admin Panel
- **Admin Dashboard** — stats overview (today's orders, revenue, pending orders, top products) with animated charts (recharts)
- **Order Management** — view all orders, update order status, filter by status/date
- **Product Management** — CRUD for products/categories, image upload, availability toggle, mark best-seller
- **Customer Management** — view customer list, order history per customer
- **Admin Chat Support Panel** — list of active customer chats, reply in real-time, mark resolved, unread badge count
- **Coupon/Discount management** (optional but recommended)
- Admin login uses same auth system with `role: admin` middleware protection

---

## 5. NON-FUNCTIONAL REQUIREMENTS

- SEO: meta tags, sitemap, semantic HTML, Open Graph tags
- Performance: image optimization (WebP), route-based code splitting, lazy loading everywhere, Lighthouse score 90+
- Security: input sanitization, rate limiting on auth routes, helmet.js, CORS config, hashed passwords, HttpOnly cookies for refresh token
- Error handling: global error boundary (frontend), centralized error middleware (backend)
- Folder structure: clean MVC (backend) + feature-based folder structure (frontend components/pages/hooks/context/services)
- Environment variables via `.env` for DB URI, JWT secrets, Cloudinary keys etc.
- **Secrets:** kabhi bhi MongoDB URI, password, JWT secret ya API key source code, README, seed data, screenshots, logs, client bundle ya git history mein commit mat karo. Sirf `.env`/secret manager use karo, `.env.example` mein placeholders rakho, aur server-only variables ko `VITE_` prefix mat do.
- **Database safety:** development ke liye least-privilege MongoDB user aur restricted network access use karo. Agar koi real connection string chat, issue ya file mein expose ho chuki ho to us credential ko immediately revoke/rotate karo.
- **Privacy:** customer data, addresses, phone numbers and chat messages ko minimum required fields tak limit karo; privacy policy, deletion request flow, validation and access controls include karo.
- API documentation (basic README with endpoint list)

---

## 6. DELIVERABLE EXPECTATION FROM AI AGENT

1. Full project scaffolding (`/client` React+Vite, `/server` Node+Express)
2. MongoDB schemas: User, Product, Category, Order, Address, Coupon, ChatMessage
3. All pages/components listed above, fully functional and connected to backend API
4. Seed script with sample menu data (categories + products above)
5. Responsive, animated, production-ready UI as per Section 3
6. README with setup instructions (install, env vars, run dev)

Is prompt ko follow kar ke poora project step by step banao — pehle backend schema + API structure, phir frontend pages, phir animations/polish.
