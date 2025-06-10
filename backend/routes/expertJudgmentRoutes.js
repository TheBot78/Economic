const express = require('express');
const router = express.Router();
const { estimateByExpertJudgment } = require('../controllers/expertJudgmentController');

router.post('/estimate-expert', estimateByExpertJudgment);

module.exports = router;
