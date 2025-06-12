// services/estimation.js

function cocomo_basic(kloc, eaf, mode = 'organic', cost_per_pm = 10000) {
    const params = {
        organic: { a: 2.4, b: 1.05, c: 2.5, d: 0.38 },
        'semi-detached': { a: 3.0, b: 1.12, c: 2.5, d: 0.35 },
        embedded: { a: 3.6, b: 1.20, c: 2.5, d: 0.32 }
    };

    if (!params[mode]) {
        throw new Error(`Invalid mode '${mode}'`);
    }

    const p = params[mode];
    const effort = eaf * p.a * Math.pow(kloc, p.b);
    const time = p.c * Math.pow(effort, p.d);
    const teamSize = effort / time;
    const totalCost = effort * cost_per_pm;

    return {
        model: "COCOMO",
        effort_pm: +effort.toFixed(2),
        time_months: +time.toFixed(2),
        team_size: +teamSize.toFixed(2),
        total_cost: +totalCost.toFixed(2)
    };
}

function regression_model(loc, team_experience_factor = 1.0) {
    const effort = (loc / 900) * team_experience_factor;
    const duration = effort / 3;
    const cost = effort * 9000;
    return {
        model: "Regression Model",
        effort: +effort.toFixed(2),
        duration: +duration.toFixed(2),
        cost: +cost.toFixed(2)
    };
}

function expert_judgment(loc, complexity_factor = 1.0) {
    const effort = (loc / 800) * complexity_factor;
    const duration = effort / 2.8;
    const cost = effort * 11000;
    return {
        model: "Expert Judgment",
        effort: +effort.toFixed(2),
        duration: +duration.toFixed(2),
        cost: +cost.toFixed(2)
    };
}

// services/estimation.js

function functionPoints_estimate(counts, vaf = 1.0, costPerFP = 1000) {
    /*
    counts: {
        EI: { low: n, avg: n, high: n },
        EO: { low: n, avg: n, high: n },
        EQ: { low: n, avg: n, high: n },
        ILF: { low: n, avg: n, high: n },
        EIF: { low: n, avg: n, high: n }
    }
    vaf: Value Adjustment Factor (typical range 0.65 - 1.35)
    costPerFP: cost per Function Point
    */

    // Pondérations classiques par type et complexité
    const weights = {
        EI: { low: 3, avg: 4, high: 6 },
        EO: { low: 4, avg: 5, high: 7 },
        EQ: { low: 3, avg: 4, high: 6 },
        ILF: { low: 7, avg: 10, high: 15 },
        EIF: { low: 5, avg: 7, high: 10 }
    };

    // Calcul UFP
    let ufp = 0;
    for (const type in counts) {
        for (const level in counts[type]) {
            ufp += (counts[type][level] || 0) * weights[type][level];
        }
    }

    // Adjusted FP
    const afp = ufp * vaf;

    // Estimation effort simplifiée
    const effort = afp * 0.5; // effort en person-month (exemple, à ajuster)
    const duration = effort / 3; // duration en mois (exemple)
    const cost = afp * costPerFP;

    return {
        model: "Function Points",
        unadjusted_fp: ufp,
        adjusted_fp: afp.toFixed(2),
        effort_pm: effort.toFixed(2),
        duration_months: duration.toFixed(2),
        cost: cost.toFixed(2)
    };
}

module.exports = {
    cocomo_basic,
    regression_model,
    expert_judgment,
    functionPoints_estimate,
};

