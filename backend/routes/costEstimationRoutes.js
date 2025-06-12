// routes/estimationCostRoute.js
const express = require('express');
const router = express.Router();
const {
  costEstimation,
  regressionEstimate,
  expertEstimate,
  estimateAll
} = require('../controllers/costEstimationController');

const { functionPointsEstimate } = require('../controllers/costEstimationController');

router.post('/functionpoints', functionPointsEstimate);
router.post('/cocomo', costEstimation);
router.post('/regression', regressionEstimate);
router.post('/expert', expertEstimate);
router.post('/all', estimateAll);

module.exports = router;
