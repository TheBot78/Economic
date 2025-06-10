const express = require('express');
const router = express.Router();
const { runDelphi } = require('../controllers/delphiController');

router.post('/estimate-delphi', runDelphi);

module.exports = router;
