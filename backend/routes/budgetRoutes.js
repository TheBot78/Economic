const express = require('express');
const router = express.Router();
const { financialMetrics } = require('../controllers/budgetController');

router.post('/financial-metrics', financialMetrics);

module.exports = router;
