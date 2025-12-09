const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// simple API route to get products
app.get('/api/products', (req, res) => {
  fs.readFile(path.join(__dirname, 'products.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read products' });
    res.json(JSON.parse(data));
  });
});

// get single product by id
app.get('/api/products/:id', (req, res) => {
  fs.readFile(path.join(__dirname, 'products.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read products' });
    const products = JSON.parse(data);
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
