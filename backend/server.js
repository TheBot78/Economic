// server.js
const express = require('express');
const cors = require('cors');
const costEstimationRoutes = require('./routes/costEstimationRoutes');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes (à étendre)
app.use('/api', costEstimationRoutes);
app.get('/', (req, res) => {
  res.send('Economic Decision Tool API is running');
});

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
