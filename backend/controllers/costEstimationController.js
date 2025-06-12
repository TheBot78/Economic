// controllers/costEstimationController.js
const { cocomo_basic, regression_model, expert_judgment } = require('../services/estimation');

exports.costEstimation = (req, res) => {
    try {
        const data = req.body;
        const kloc = parseFloat(data.kloc);
        const costPerPm = parseFloat(data.cost_per_pm || 10000);
        const mode = (data.mode || 'organic').toLowerCase();

        const rely = parseFloat(data.RELY);
        const dataSize = parseFloat(data.DATA);
        const cplx = parseFloat(data.CPLX);
        const time = parseFloat(data.TIME);
        const stor = parseFloat(data.STOR);

        if ([kloc, rely, dataSize, cplx, time, stor].some(val => isNaN(val))) {
            return res.status(400).json({ error: "Invalid input" });
        }

        const eaf = rely * dataSize * cplx * time * stor;
        const cocomoResult = cocomo_basic(kloc, eaf, mode, costPerPm);

        res.json(cocomoResult);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.regressionEstimate = (req, res) => {
    const { loc, team_experience_factor = 1.0 } = req.body;
    if (!loc || isNaN(loc)) return res.status(400).json({ error: "Invalid LOC input" });
    const result = regression_model(loc, team_experience_factor);
    res.json(result);
};

exports.expertEstimate = (req, res) => {
    const { loc, complexity_factor = 1.0 } = req.body;
    if (!loc || isNaN(loc)) return res.status(400).json({ error: "Invalid LOC input" });
    const result = expert_judgment(loc, complexity_factor);
    res.json(result);
};

exports.estimateAll = (req, res) => {
    try {
        const data = req.body;

        // Pour COCOMO
        const kloc = parseFloat(data.kloc);
        const costPerPm = parseFloat(data.cost_per_pm || 10000);
        const mode = (data.mode || 'organic').toLowerCase();

        const rely = parseFloat(data.RELY);
        const dataSize = parseFloat(data.DATA);
        const cplx = parseFloat(data.CPLX);
        const time = parseFloat(data.TIME);
        const stor = parseFloat(data.STOR);

        if ([kloc, rely, dataSize, cplx, time, stor].some(val => isNaN(val))) {
            return res.status(400).json({ error: "Invalid input for COCOMO" });
        }

        const eaf = rely * dataSize * cplx * time * stor;
        const cocomo = cocomo_basic(kloc, eaf, mode, costPerPm);

        // Pour Regression
        const loc = parseFloat(data.loc || kloc * 1000);
        const teamExperience = parseFloat(data.team_experience_factor || 1.0);
        const regression = regression_model(loc, teamExperience);

        // Pour Expert
        const complexity = parseFloat(data.complexity_factor || 1.0);
        const expert = expert_judgment(loc, complexity);

        res.json({
            cocomo,
            regression,
            expert
        });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// controllers/costEstimationController.js

const { functionPoints_estimate } = require('../services/estimation');

exports.functionPointsEstimate = (req, res) => {
    try {
        const counts = req.body.counts;
        const vaf = parseFloat(req.body.vaf) || 1.0;
        const costPerFP = parseFloat(req.body.cost_per_fp) || 1000;

        if (!counts) {
            return res.status(400).json({ error: "Missing counts data" });
        }

        const result = functionPoints_estimate(counts, vaf, costPerFP);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

