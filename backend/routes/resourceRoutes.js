const express = require('express');
const router = express.Router();
const {
  levelResources,
  smoothResources,
  analyzeScenarios
} = require('../controllers/resourceController');

router.post('/leveling', levelResources);
router.post('/smoothing', smoothResources);
router.post('/scenarios', analyzeScenarios);

module.exports = router;
