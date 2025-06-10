const express = require('express');
const router = express.Router();
const { estimateCost } = require('../controllers/costEstimationController');

router.post('/estimate-cost', estimateCost);

module.exports = router;