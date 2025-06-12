const express = require('express');
const router = express.Router();
const {
  sensitivityAnalysis,
  decisionTree,
  monteCarlo
} = require('../controllers/riskController');

router.post('/sensitivity', sensitivityAnalysis);
router.post('/decision-tree', decisionTree);
router.post('/monte-carlo', monteCarlo);

module.exports = router;
