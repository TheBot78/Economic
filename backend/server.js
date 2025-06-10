// server.js
const express = require('express');
const cors = require('cors');
const costEstimationRoutes = require('./routes/costEstimationRoutes');
const expertRoutes = require('./routes/expertJudgmentRoutes');
const delphiRoutes = require('./routes/delphiRoutes');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', costEstimationRoutes);
app.get('/', (req, res) => {
  res.send('Economic Decision Tool API is running');
});
app.use('/api', expertRoutes);
app.use('/api', delphiRoutes);


// Port
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
