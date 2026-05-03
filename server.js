const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// ─── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── In-Memory Data Stores ───────────────────────────────────

// Users store
let users = [];

// Products store (20 default products)
let products = [
    { id: 1, name: "Urban Explorer Jacket", price: 59.99, category: "Clothing", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400", description: "Water-resistant, fleece-lined adventure gear.", rating: 4.8 },
    { id: 2, name: "NoiseBuds X2", price: 24.99, category: "Electronics", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400", description: "Active noise cancellation and 30hr battery.", rating: 4.5 },
    { id: 3, name: "Retro Sneakers", price: 44.99, category: "Footwear", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400", description: "Premium leather with anti-skid rubber soles.", rating: 4.7 },
    { id: 4, name: "Smart LED Bulb", price: 10.99, category: "Electronics", image: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=400", description: "WiFi controlled with 16 million colors.", rating: 4.3 },
    { id: 5, name: "Minimalist Backpack", price: 29.99, category: "Accessories", image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400", description: "Water-repellent fabric with laptop sleeve.", rating: 4.9 },
    { id: 6, name: "Graphic Tee", price: 12.99, category: "Clothing", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", description: "100% organic cotton oversized fit.", rating: 4.4 },
    { id: 7, name: "Analog Gold Watch", price: 89.99, category: "Accessories", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400", description: "Stainless steel classic luxury time-piece.", rating: 4.8 },
    { id: 8, name: "Pro Yoga Mat", price: 19.99, category: "Fitness", image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=400", description: "Extra thick non-slip eco-friendly grip.", rating: 4.6 },
    { id: 9, name: "RGB Gaming Mouse", price: 35.99, category: "Electronics", image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400", description: "High-precision sensor with 7 programmable buttons.", rating: 4.7 },
    { id: 10, name: "Polarized Sunglasses", price: 22.99, category: "Accessories", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400", description: "UV400 protection with classic aviator frame.", rating: 4.5 },
    { id: 11, name: "Denim Slim Jeans", price: 34.99, category: "Clothing", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400", description: "Stretchable denim for maximum comfort.", rating: 4.6 },
    { id: 12, name: "Wireless Keyboard", price: 49.99, category: "Electronics", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400", description: "Mechanical switches with multi-device pairing.", rating: 4.9 },
    { id: 13, name: "Running Performance Shoes", price: 65.00, category: "Footwear", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", description: "Cloud-foam cushioning for long distance.", rating: 4.7 },
    { id: 14, name: "Leather Bi-Fold Wallet", price: 15.99, category: "Accessories", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400", description: "Genuine cowhide with RFID protection.", rating: 4.5 },
    { id: 15, name: "Winter Puffer Hoodie", price: 39.99, category: "Clothing", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400", description: "Extra warm insulation for sub-zero temps.", rating: 4.8 },
    { id: 16, name: "Smart Fitness Tracker", price: 28.00, category: "Electronics", image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400", description: "Heart rate and sleep monitoring 24/7.", rating: 4.4 },
    { id: 17, name: "Duffle Gym Bag", price: 21.99, category: "Fitness", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400", description: "Separate shoe compartment and waterproof.", rating: 4.7 },
    { id: 18, name: "Classic Baseball Cap", price: 9.99, category: "Accessories", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400", description: "Adjustable strap 100% cotton twill.", rating: 4.3 },
    { id: 19, name: "Portable Power Bank", price: 18.50, category: "Electronics", image: "https://images.unsplash.com/photo-1609592424521-5f3c97351b4c?w=400", description: "20000mAh fast-charging capability.", rating: 4.6 },
    { id: 20, name: "Adjustable Phone Stand", price: 7.99, category: "Accessories", image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400", description: "Foldable aluminum desk accessory.", rating: 4.2 }
];

let orders = [];
let nextProductId = 21;

// ─── Auth Routes ─────────────────────────────────────────────

// POST /api/signup
app.post('/api/signup', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Fill all feilds (name, email, password)' });
    }

    const exists = users.find(u => u.email === email);
    if (exists) {
        return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        password, // In production: hash this with bcrypt
        createdAt: new Date().toISOString()
    };
    users.push(newUser);

    return res.status(201).json({
        success: true,
        message: `🎉 Account has benn created Welcome ${name}. Now login please .`,
        user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });
});

// POST /api/login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: ' Enter Email and password ' });
    }

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ success: false, message: 'Email or password is wrong' });
    }

    return res.json({
        success: true,
        message: `✅ Login successful Welcome again, ${user.name}!`,
        user: { id: user.id, name: user.name, email: user.email }
    });
});

// ─── Products Routes ─────────────────────────────────────────

// GET all products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// POST add new product (Admin)
app.post('/api/products', (req, res) => {
    const { name, price, category, image, description, rating } = req.body;
    if (!name || !price) {
        return res.status(400).json({ success: false, message: 'Name and price are required' });
    }
    const newProduct = {
        id: nextProductId++,
        name,
        price: parseFloat(price),
        category: category || 'General',
        image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        description: description || '',
        rating: parseFloat(rating) || 4.0
    };
    products.push(newProduct);
    res.status(201).json({ success: true, message: '✅ Product added!', product: newProduct });
});

// PUT update product (Admin)
app.put('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Product not found' });

    products[index] = { ...products[index], ...req.body, id };
    res.json({ success: true, message: '✅ Product updated!', product: products[index] });
});

// DELETE product (Admin)
app.delete('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Product not found' });

    products.splice(index, 1);
    res.json({ success: true, message: '🗑️ Product deleted!' });
});

// ─── Orders Routes ────────────────────────────────────────────

// GET all orders
app.get('/api/orders', (req, res) => {
    res.json(orders);
});

// POST create order
app.post('/api/orders', (req, res) => {
    const newOrder = {
        id: Date.now(),
        ...req.body,
        status: 'Pending',
        createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    res.status(201).json(newOrder);
});

// PUT update order status (Admin)
app.put('/api/orders/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Order not received' });

    orders[index] = { ...orders[index], ...req.body };
    res.json({ success: true, message: '✅ Order status is updated!', order: orders[index] });
});

// ─── Health Check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'TREND HIVE Backend is running ✅', users: users.length, products: products.length, orders: orders.length });
});

// ─── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 TREND HIVE Backend server port ${PORT} is running`);
});

module.exports = app;
