// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const costEstimationRoutes = require('./routes/costEstimationRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const riskRoutes = require('./routes/riskRoutes');

app.use('/api/estimate', costEstimationRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/risk', riskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
