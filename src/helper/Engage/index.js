import { metricsPerNumberOfUsers } from "../Utils";

export async function processWhyNotPersonaMetricsResult(personaMetricsResult, data = [], dayCount, numberOfDays, currency = null) {

    if (personaMetricsResult.data.length !== 0 && personaMetricsResult.statuscode === 200) {
        const cr = personaMetricsResult.data[0].group_user_conversion_rate;
        const cr_lift = (cr * 1.20);
        const revImpactWhyNot = personaMetricsResult.data[0].size_of_group * personaMetricsResult.data[0].aov;
        let revImpactProjected = null
        const rpu = revImpactWhyNot / personaMetricsResult.data[0].all_users_with_cart_reductions_summed;
        data.personaMetricsResultLoading = false;
        if (!isNaN(dayCount) && dayCount !== 0) {
            revImpactProjected = (personaMetricsResult.data[0].size_of_group * numberOfDays / dayCount) * personaMetricsResult.data[0].aov;
        }
        data.personaMetrics = [
            {
                "metricName": "Transaction Per 1000 Users",
                "brandlock_off": metricsPerNumberOfUsers(cr, 1, 10, 0, ''),
                "brandlock_on": metricsPerNumberOfUsers(cr, 1.20, 10, 0, ''),
                "gain": data.personaPotentialCRLift * 100,
                "unit": ""
            },
            {
                "metricName": "Revenue Impact",
                "brandlock_off": !isNaN(revImpactWhyNot) ? `${parseFloat(revImpactWhyNot).toFixed(3).toLocaleString('en-US', { style: 'currency', currency: currency })}` : 0,
                "brandlock_on": !isNaN(revImpactWhyNot) ? `${parseFloat(revImpactWhyNot * 1.20).toFixed(3).toLocaleString('en-US', { style: 'currency', currency: currency })}` : 0,
                "brandlock_on_projected": !isNaN(revImpactProjected) && revImpactProjected !== 0 ? `${parseFloat(revImpactProjected * 1.20).toFixed(3).toLocaleString('en-US', { style: 'currency', currency: currency })}` : 0,
                "gain": data.personaPotentialCRLift * 100,
                "unit": "$",
                "show": false
            },
            {
                "metricName": "Revenue Per 1000 Users",
                "brandlock_off": metricsPerNumberOfUsers(rpu, 1, 1000, 0, currency),
                "brandlock_on": metricsPerNumberOfUsers(rpu, 1.20, 1000, 0, currency),
                "gain": data.personaPotentialCRLift * 100,
                "unit": "$"
            },
        ];
        data.no_data = false;

    } else if (data.personaRev !== 0) {
        data.personaMetricsResultLoading = false;
        data.personaMetrics = [
            {
                "metricName": "Transaction Per 1000 Users",
                "brandlock_off": metricsPerNumberOfUsers(480, 1, 1, 0, ''),
                "brandlock_on": metricsPerNumberOfUsers(480, 1.20, 1, 0, ''),
                "gain": data.personaPotentialCRLift * 100,
                "unit": ""
            },
            {
                "metricName": "Revenue Impact",
                "brandlock_off": !isNaN(data.personaRev) ? `${parseFloat(data.personaRev).toFixed(3).toLocaleString('en-US', { style: 'currency', currency: currency })}` : 0,
                "brandlock_on": !isNaN(data.personaRev) ? `${parseFloat(data.personaRev * 1.20)}` : 0,
                "gain": data.personaPotentialCRLift * 100,
                "unit": "$",
                "show": false
            }
        ];
        data.no_data = false;
    } else {
        data.personaMetricsResultLoading = false;
        data.no_data = true;
        data.personaMetrics = [
            {
                "metricName": "Lift",
                "gain": 20,
                "unit": "%"
            },
        ];
    }
    return data;
}


export async function processHesitantPersonaMetricsResult(personaMetricsResult, data = [], dayCount, numberOfDays, listening_phase_aov_30_days = null, currency = null) {
    if (personaMetricsResult.hasOwnProperty("data") &&
        personaMetricsResult.data.length > 0 &&
        (personaMetricsResult.data[0].conversion_rate > 0 &&
            personaMetricsResult.data[0].users_greater_than_60_conversions !== 0 &&
            personaMetricsResult.data[0].conversion_rate !== null &&
            personaMetricsResult.data[0].users_greater_than_60_conversions !== null)
    ) {
        let cr = null;
        let revImpactProjected = null;
        let revImpactHesitant = null;
        let rpu = null;
        cr = personaMetricsResult.data[0].conversion_rate;


        if (data.totalAOV !== 0) {
            revImpactHesitant = personaMetricsResult.data[0].users_greater_than_60_conversions * data.totalAOV;
            if (!isNaN(dayCount) && dayCount !== 0) {
                revImpactProjected = ((personaMetricsResult.data[0].users_greater_than_60_conversions * numberOfDays) / dayCount) * data.totalAOV;
            }
        } else if (listening_phase_aov_30_days !== null) {
            revImpactHesitant = personaMetricsResult.data[0].users_greater_than_60_conversions * listening_phase_aov_30_days;
            if (!isNaN(dayCount) && dayCount !== 0) {
                revImpactProjected = ((personaMetricsResult.data[0].users_greater_than_60_conversions * numberOfDays) / dayCount) * listening_phase_aov_30_days;
            }
        }
        rpu = revImpactHesitant / personaMetricsResult.data[0].users_greater_than_60_overall;
        const cr_lift = (cr * 1.15);
        data.personaMetricsResultLoading = false;
        data.personaMetrics = [
            {
                "metricName": "Transaction Per 1000 Users",
                "brandlock_off": metricsPerNumberOfUsers(cr, 1, 1000, 0, ''),
                "brandlock_on": metricsPerNumberOfUsers(cr, 1.15, 1000, 0, ''),
                "gain": data.personaPotentialCRLift * 100,
                "unit": ""
            },
            {
                "metricName": "Revenue Impact",
                "brandlock_off": !isNaN(revImpactHesitant) ? `${parseFloat(revImpactHesitant).toFixed(3).toLocaleString('en-US', { style: 'currency', currency: currency })}` : 0,
                "brandlock_on": !isNaN(revImpactHesitant) ? `${parseFloat(revImpactHesitant * 1.15)}` : 0,
                "brandlock_on_projected": !isNaN(revImpactProjected) && revImpactProjected !== 0 ? `${parseFloat(revImpactProjected * 1.15)}` : 0,
                "gain": data.personaPotentialCRLift * 100,
                "unit": "$",
                "show": false
            },
            {
                "metricName": "Revenue Per 1000 Users",
                "brandlock_off": metricsPerNumberOfUsers(rpu, 1, 1000, 0, currency),
                "brandlock_on": metricsPerNumberOfUsers(rpu, 1.15, 1000, 0, currency),
                "gain": data.personaPotentialCRLift * 100,
                "unit": "$"
            }
        ];
        data.no_data = false;
    } else if (data.personaRev !== 0) {
        data.personaMetricsResultLoading = false;
        data.personaMetrics = [
            {
                "metricName": "Transaction Per 1000 Users",
                "brandlock_off": metricsPerNumberOfUsers(110, 1, 1, 0, ''),
                "brandlock_on": metricsPerNumberOfUsers(110, 1.15, 1, 0, ''),
                "gain": data.personaPotentialCRLift * 100,
                "unit": ""
            },
            {
                "metricName": "Revenue Impact",
                "brandlock_off": !isNaN(data.personaRev) ? `${parseFloat(data.personaRev).toFixed(3).toLocaleString('en-US', { style: 'currency', currency: currency })}` : 0,
                "brandlock_on": !isNaN(data.personaRev) ? `${parseFloat(data.personaRev * 1.15)}` : 0,
                "gain": data.personaPotentialCRLift * 100,
                "unit": "$",
                "show": false
            }
        ];
        data.no_data = false;
    } else {
        data.personaMetricsResultLoading = false;
        data.no_data = true;
        data.personaMetrics = [
            {
                "metricName": "Lift",
                "gain": 15,
                "unit": "%"
            },
        ];
    }
    return data;
}


export async function processEEIPersonaMetricsResult(personaMetricsResult, data = [], dayCount, numberOfDays, listening_phase_aov_30_days = null, currency = null) {
    if (personaMetricsResult.hasOwnProperty("data") &&
        personaMetricsResult.data.length > 0 &&
        (personaMetricsResult.data[0].cashback_conversions > 0 &&
            personaMetricsResult.data[0].cashback_users > 0 &&
            personaMetricsResult.data[0].cashback_conversions !== null &&
            personaMetricsResult.data[0].cashback_users !== null)) {
        const eei_conversion = personaMetricsResult.data[0].cashback_conversions;
        const eei_users = personaMetricsResult.data[0].cashback_users;
        const cr = (eei_conversion / eei_users);
        let revImpactProjected = null;
        let revImpactEEI = null;
        let affiliate_savings = null;
        const cr_lift = ((eei_conversion / eei_users) * 1.07);


        let rpu = null;

        if (data.totalAOV !== 0) {
            revImpactEEI = (eei_conversion * data.totalAOV)
            if (!isNaN(dayCount) && dayCount !== 0) {
                revImpactProjected = ((eei_conversion * numberOfDays) / dayCount) * data.totalAOV;
            }
            affiliate_savings = eei_conversion * data.totalAOV * 0.02;
        } else if (listening_phase_aov_30_days !== null) {
            revImpactEEI = (eei_conversion * listening_phase_aov_30_days)
            if (!isNaN(dayCount) && dayCount !== 0) {
                revImpactProjected = ((eei_conversion * numberOfDays) / dayCount) * listening_phase_aov_30_days;
            }
            affiliate_savings = eei_conversion * listening_phase_aov_30_days * 0.02;
        }
        rpu = revImpactEEI / eei_users;

        data.personaMetricsResultLoading = false;
        data.personaMetrics = [
            {
                "metricName": "Transaction Per 1000 Users",
                "brandlock_off": metricsPerNumberOfUsers(cr, 1, 1000, 0, ''),
                "brandlock_on": metricsPerNumberOfUsers(cr, 1.07, 1000, 0, ''),
                "gain": data.personaPotentialCRLift * 100,
                "unit": ""
            },
            {
                "metricName": "Revenue Impact",
                "brandlock_off": !isNaN(revImpactEEI) ? `${parseFloat(revImpactEEI).toFixed(3)}` : 0,
                "brandlock_on": !isNaN(revImpactEEI) ? `${parseFloat(revImpactEEI * 1.07).toFixed(3)}` : 0,
                "brandlock_on_projected": !isNaN(revImpactProjected) && revImpactProjected !== 0 ? `${parseFloat(revImpactProjected * 1.07).toFixed(3)}` : 0,
                "gain": data.personaPotentialCRLift * 100,
                "unit": "$",
                "show": false
            },
            {
                "metricName": "Revenue Per 1000 Users",
                "brandlock_off": metricsPerNumberOfUsers(rpu, 1, 1000, 0, currency),
                "brandlock_on": metricsPerNumberOfUsers(rpu, 1.07, 1000, 0, currency),
                "gain": data.personaPotentialCRLift * 100,
                "unit": "$"
            },
            {
                "metricName": "Affiliate Savings",
                "brandlock_off": 0,
                "brandlock_on": metricsPerNumberOfUsers(affiliate_savings, 1, 1, 0, currency),
                "gain": metricsPerNumberOfUsers(affiliate_savings, 1, 1, 0, ''),
                "unit": "$"
            },
        ];
        data.no_data = false;
    } else if (data.personaRev !== 0) {
        data.personaMetricsResultLoading = false;
        data.personaMetrics = [
            {
                "metricName": "Transaction Per 1000 Users",
                "brandlock_off": metricsPerNumberOfUsers(80, 1, 1, 0, ''),
                "brandlock_on": metricsPerNumberOfUsers(80, 1.07, 1, 0, ''),
                "gain": data.personaPotentialCRLift * 100,
                "unit": ""
            },
            {
                "metricName": "Revenue Impact",
                "brandlock_off": !isNaN(data.personaRev) ? `${parseFloat(data.personaRev).toFixed(3).toLocaleString('en-US', { style: 'currency', currency: currency })}` : 0,
                "brandlock_on": !isNaN(data.personaRev) ? `${parseFloat(data.personaRev * 1.07)}` : 0,
                "gain": data.personaPotentialCRLift * 100,
                "unit": "$",
                "show": false
            }
        ];
        data.no_data = false;

    } else {
        data.personaMetricsResultLoading = false;
        data.no_data = true;
        data.personaMetrics = [
            {
                "metricName": "Lift",
                "gain": 0.7,
                "unit": "%"
            },
        ];
    }
    return data;
}

export async function processCRPersonaMetricsResult(personaMetricsResult, data = [], dayCount, numberOfDays, listening_phase_aov_30_days = null, currency = null) {

    if (personaMetricsResult.hasOwnProperty("data") &&
        personaMetricsResult.data.length > 0 &&
        (personaMetricsResult.data[0].coupon_runner_conversions > 0 &&
            personaMetricsResult.data[0].coupon_runner_users > 0 &&
            personaMetricsResult.data[0].coupon_runner_conversions !== null &&
            personaMetricsResult.data[0].coupon_runner_users !== null
        )) {

        let revImpactProjected = null;
        let revImpactCR = null;
        let affiliate_savings = null;
        const coupon_runner_conversion = parseFloat(personaMetricsResult.data[0].coupon_runner_conversions).toFixed(3);
        const coupon_runner_users = parseFloat(personaMetricsResult.data[0].coupon_runner_users).toFixed(3);
        const cr_lift = ((coupon_runner_conversion / coupon_runner_users) * 1.05);
        const cr = (coupon_runner_conversion / coupon_runner_users);

        let rpu = null;

        if (data.totalAOV !== 0) {
            revImpactCR = (coupon_runner_conversion * data.totalAOV);
            affiliate_savings = coupon_runner_conversion * data.totalAOV * 0.02;
            if (!isNaN(dayCount) && dayCount !== 0) {
                revImpactProjected = ((coupon_runner_conversion * numberOfDays / dayCount)) * data.totalAOV;
            }
        } else if (listening_phase_aov_30_days !== null) {
            revImpactCR = (coupon_runner_conversion * listening_phase_aov_30_days);
            affiliate_savings = coupon_runner_conversion * listening_phase_aov_30_days * 0.02;
            if (!isNaN(dayCount) && dayCount !== 0) {
                revImpactProjected = ((coupon_runner_conversion * numberOfDays / dayCount)) * listening_phase_aov_30_days;
            }
        }
        rpu = revImpactCR / coupon_runner_users;

        data.personaMetricsResultLoading = false;
        data.personaMetrics = [
            {
                "metricName": "Transaction Per 1000 Users",
                "brandlock_off": metricsPerNumberOfUsers(cr, 1, 1000, 0, ''),
                "brandlock_on": metricsPerNumberOfUsers(cr, 1.05, 1000, 0, ''),
                "gain": data.personaPotentialCRLift * 100,
                "unit": ""
            },
            {
                "metricName": "Revenue Impact",
                "brandlock_off": !isNaN(revImpactCR) ? `${parseFloat(revImpactCR).toFixed(3)}` : 0,
                "brandlock_on": !isNaN(revImpactCR) ? `${parseFloat(revImpactCR * 1.05).toFixed(3)}` : 0,
                "brandlock_on_projected": !isNaN(revImpactCR) && revImpactProjected !== 0 ? `${parseFloat(revImpactProjected * 1.05).toFixed(3)}` : 0,
                "gain": data.personaPotentialCRLift * 100,
                "unit": "$",
                "show": false
            },
            {
                "metricName": "Revenue Per 1000 Users",
                "brandlock_off": metricsPerNumberOfUsers(rpu, 1, 1000, 0, currency),
                "brandlock_on": metricsPerNumberOfUsers(rpu, 1.05, 1000, 0, currency),
                "gain": data.personaPotentialCRLift * 100,
                "unit": "$"
            },
            {
                "metricName": "Affiliate Savings",
                "brandlock_off": 0,
                "brandlock_on": metricsPerNumberOfUsers(affiliate_savings, 1, 1, 0, currency),
                "gain": metricsPerNumberOfUsers(affiliate_savings, 1, 1, 0, ''),
                "unit": "$"
            },
        ];
        data.no_data = false;

    } else if (data.personaRev !== 0) {
        data.personaMetricsResultLoading = false;
        data.personaMetrics = [
            {
                "metricName": "Transaction Per 1000 Users",
                "brandlock_off": metricsPerNumberOfUsers(210, 1, 1, 0, currency),
                "brandlock_on": metricsPerNumberOfUsers(210, 1.05, 1, 0, currency),
                "gain": data.personaPotentialCRLift * 100,
                "unit": ""
            },
            {
                "metricName": "Revenue Impact",
                "brandlock_off": !isNaN(data.personaRev) ? `${parseFloat(data.personaRev).toFixed(3).toLocaleString('en-US', { style: 'currency', currency: currency })}` : 0,
                "brandlock_on": !isNaN(data.personaRev) ? `${parseFloat(data.personaRev * 1.05)}` : 0,
                "gain": data.personaPotentialCRLift * 100,
                "unit": "$",
                "show": false
            }
        ];
        data.no_data = false;

    } else {
        data.personaMetricsResultLoading = false;
        data.no_data = true;
        data.personaMetrics = [
            {
                "metricName": "Lift",
                "gain": 5,
                "unit": "%"
            },
        ];
    }
    return data;
}


export async function processWCPersonaMetricsResult(personaMetricsResult, data = {}, dayCount, numberOfDays, listening_phase_aov_30_days = null, currency = null) {


    if (personaMetricsResult.hasOwnProperty("data") &&
        personaMetricsResult.data.length > 0 &&
        (personaMetricsResult.data[0].wc_users > 0 &&
            personaMetricsResult.data[0].wc_conversions > 0 &&
            personaMetricsResult.data[0].wc_users !== null &&
            personaMetricsResult.data[0].wc_conversions !== null)
    ) {
        let revImpactProjected = null
        let revImpactWC = null
        let affiliate_savings = null
        const wc_conversion = personaMetricsResult.data[0].wc_conversions;
        const wc_users = personaMetricsResult.data[0].wc_users;
        const wc_affiliate_conversions = personaMetricsResult.data[0].wc_affiliate_conversions;

        const cr = (wc_conversion / wc_users) * 1;
        const cr_lift = ((wc_conversion / wc_users) * 1.1);
        let rpu = null;
        if (data.totalAOV !== 0) {
            revImpactWC = (wc_conversion * data.totalAOV);
            affiliate_savings = wc_affiliate_conversions * data.totalAOV * 0.02;
            if (!isNaN(dayCount) && dayCount !== 0) {
                revImpactProjected = ((wc_conversion * numberOfDays) / dayCount) * data.totalAOV;
            }
        } else if (listening_phase_aov_30_days !== null) {
            revImpactWC = (wc_conversion * listening_phase_aov_30_days);
            affiliate_savings = wc_affiliate_conversions * listening_phase_aov_30_days * 0.02;
            if (!isNaN(dayCount) && dayCount !== 0) {
                revImpactProjected = ((wc_conversion * numberOfDays) / dayCount) * listening_phase_aov_30_days;
            }
        }
        rpu = revImpactWC / wc_users;

        data.personaMetricsResultLoading = false;
        data.personaMetrics = [
            {
                "metricName": "Transaction Per 1000 Users",
                "brandlock_off": metricsPerNumberOfUsers(cr, 1, 1000, 0, ''),
                "brandlock_on": metricsPerNumberOfUsers(cr, 1.10, 1000, 0, ''),
                "gain": data.personaPotentialCRLift * 100,
                "unit": ""
            },
            {
                "metricName": "Revenue Impact",
                "brandlock_off": `${parseFloat(revImpactWC).toFixed(3)}`,
                "brandlock_on": !isNaN(revImpactWC) ? `${parseFloat(revImpactWC * 1.10).toFixed(3)}` : 0,
                "brandlock_on_projected": !isNaN(revImpactProjected) && revImpactProjected !== 0 ? `${parseFloat(revImpactProjected * 1.10).toFixed(3)}` : 0,
                "gain": data.personaPotentialCRLift * 100,
                "unit": "$",
                "show": false
            },
            {
                "metricName": "Revenue Per 1000 Users",
                "brandlock_off": metricsPerNumberOfUsers(rpu, 1, 1000, 0, currency),
                "brandlock_on": metricsPerNumberOfUsers(rpu, 1.10, 1000, 0, currency),
                "gain": data.personaPotentialCRLift * 100,
                "unit": "$"
            },
            {
                "metricName": "Affiliate Savings",
                "brandlock_off": 0,
                "brandlock_on": metricsPerNumberOfUsers(affiliate_savings, 1, 1, 0, currency),
                "gain": metricsPerNumberOfUsers(affiliate_savings, 1, 1, 0, ''),
                "unit": "$"
            },
        ];
        data.no_data = false;
    } else if (data.personaRev !== 0) {
        data.personaMetricsResultLoading = false;
        data.personaMetrics = [
            {
                "metricName": "Transaction Per 1000 Users",
                "brandlock_off": metricsPerNumberOfUsers(490, 1, 1, 0, ''),
                "brandlock_on": metricsPerNumberOfUsers(490, 1.10, 1, 0, ''),
                "gain": data.personaPotentialCRLift * 100,
                "unit": ""
            },
            {
                "metricName": "Revenue Impact",
                "brandlock_off": !isNaN(data.personaRev) ? `${parseFloat(data.personaRev).toFixed(3).toLocaleString('en-US', { style: 'currency', currency: currency })}` : 0,
                "brandlock_on": !isNaN(data.personaRev) ? `${parseFloat(data.personaRev * 1.10)}` : 0,
                "gain": data.personaPotentialCRLift * 100,
                "unit": "$",
                "show": false
            }
        ];
        data.no_data = false;

    } else {
        data.personaMetricsResultLoading = false;
        data.no_data = true;
        data.personaMetrics = [
            {
                "metricName": "Lift",
                "gain": 10,
                "unit": "%"
            },
        ];
    }
    return data;
}

export async function processWCPersonaMetricsResultDuring(personaMetricsResult, data = {}, affiliateSavingsFlag = false, currency = null) {


    if (personaMetricsResult !== undefined) {

        const pg_cr = parseFloat(personaMetricsResult.pg_cr).toFixed(3);
        const cg_cr = parseFloat(personaMetricsResult.cg_cr).toFixed(3);
        const cr_lift = parseFloat(personaMetricsResult.lift).toFixed(3);

        const pg_aov = parseFloat(personaMetricsResult.pg_aov).toFixed(3);
        const cg_aov = parseFloat(personaMetricsResult.cg_aov).toFixed(3);
        const aov_lift = parseFloat(personaMetricsResult.aov_lift).toFixed(3);

        const pg_rpu = parseFloat(personaMetricsResult.pg_rpu).toFixed(3);
        const cg_rpu = parseFloat(personaMetricsResult.cg_rpu).toFixed(3);

        const rpu_lift = parseFloat(personaMetricsResult.revenue_lift).toFixed(3);

        const affiliate_savings = !isNaN(data.personaRev) ? data.personaRev * 0.02 : 0;
        data.personaMetricsResultLoading = false;
        data.personaMetrics = [
            {
                "metricName": "Transaction Per 1000 Users",
                "brandlock_off": metricsPerNumberOfUsers(cg_cr, 1, 1000, 0, ''),
                "brandlock_on": metricsPerNumberOfUsers(pg_cr, 1, 1000, 0, ''),
                "gain": metricsPerNumberOfUsers(cr_lift, 1, 1, 2, ''),
                "unit": ""
            },
            {
                "metricName": "Avg. Order Value",
                "brandlock_off": metricsPerNumberOfUsers(cg_aov, 1, 1, 0, currency),
                "brandlock_on": metricsPerNumberOfUsers(pg_aov, 1, 1, 0, currency),
                "gain": metricsPerNumberOfUsers(aov_lift, 1, 1, 2, ''),
                "unit": "$"
            },
            {
                "metricName": "Revenue Per 1000 Users",
                "brandlock_off": metricsPerNumberOfUsers(cg_rpu, 1, 1000, 0, currency),
                "brandlock_on": metricsPerNumberOfUsers(pg_rpu, 1, 1000, 0, currency),
                "gain": metricsPerNumberOfUsers(rpu_lift, 1, 1, 2, ''),
                "unit": "$"
            },
        ];
        if (affiliateSavingsFlag) {
            data.personaMetrics.push({
                "metricName": "Affiliate Savings",
                "brandlock_off": 0,
                "brandlock_on": metricsPerNumberOfUsers(affiliate_savings, 1, 1, 0, currency),
                "gain": metricsPerNumberOfUsers(affiliate_savings, 1, 1, 2, ''),
                "unit": "$"
            })
        }
        data.no_data = false;

    } else {
        data.personaMetricsResultLoading = false;
        data.no_data = true;
        data.personaMetrics = [
            {
                "metricName": "Lift",
                "gain": 10,
                "unit": "%"
            },
        ];
    }
    return data;
}

export async function processPersonaMetricsResultPost(personaMetricsResult, data = {}, affiliateSavingsFlag = false, AOVFlag = false, currency = null) {
    if (personaMetricsResult !== undefined) {

        const pg_cr = parseFloat(personaMetricsResult.pg_cr).toFixed(3);
        const cg_cr = parseFloat(personaMetricsResult.cg_cr).toFixed(3);
        const cr_lift = parseFloat(personaMetricsResult.cr_lift).toFixed(3);
        const pg_aov = parseFloat(personaMetricsResult.pg_aov).toFixed(3);
        const cg_aov = parseFloat(personaMetricsResult.cg_aov).toFixed(3);
        const aov_lift = parseFloat(personaMetricsResult.aov_lift).toFixed(3);

        const pg_rpu = parseFloat(personaMetricsResult.pg_rpu).toFixed(3);
        const cg_rpu = parseFloat(personaMetricsResult.cg_rpu).toFixed(3);

        const rpu_lift = parseFloat(personaMetricsResult.rpu_lift).toFixed(3);

        const affiliate_savings = !isNaN(data.personaRev) ? data.personaRev * 0.02 : 0;
        data.personaMetricsResultLoading = false;
        data.personaMetrics = [
            {
                "metricName": "Transaction Per 1000 Users",
                "brandlock_off": metricsPerNumberOfUsers(cg_cr, 1, 1000, 0, ''),
                "brandlock_on": metricsPerNumberOfUsers(pg_cr, 1, 1000, 0, ''),
                "gain": metricsPerNumberOfUsers(cr_lift, 1, 1, 2, ''),
                "unit": ""
            },
            {
                "metricName": "Revenue Per 1000 Users",
                "brandlock_off": metricsPerNumberOfUsers(cg_rpu, 1, 1000, 0, currency),
                "brandlock_on": metricsPerNumberOfUsers(pg_rpu, 1, 1000, 0, currency),
                "gain": metricsPerNumberOfUsers(rpu_lift, 1, 1, 2, ''),
                "unit": "$"
            }
        ];
        if (AOVFlag) {
            data.personaMetrics.push({
                "metricName": "Avg. Order Value",
                "brandlock_off": metricsPerNumberOfUsers(cg_aov, 1, 1, 0, currency),
                "brandlock_on": metricsPerNumberOfUsers(pg_aov, 1, 1, 0, currency),
                "gain": metricsPerNumberOfUsers(aov_lift, 1, 1, 2, ''),
                "unit": "$"
            })
        }

        if (affiliateSavingsFlag) {
            data.personaMetrics.push({
                "metricName": "Affiliate Savings",
                "brandlock_off": 0,
                "brandlock_on": metricsPerNumberOfUsers(affiliate_savings, 1, 1, 0, currency),
                "gain": metricsPerNumberOfUsers(affiliate_savings, 1, 1, 2, ''),
                "unit": "$"
            })
        }
        data.no_data = false;
    } else {
        data.personaMetricsResultLoading = false;
        data.no_data = true;
        data.personaMetrics = [
            {
                "metricName": "Lift",
                "gain": 10,
                "unit": "%"
            },
        ];
    }
    return data;
}

export function processIneligibleShopper(d) {
    return {
        personaStatus: "NA",
        personaRev: 0,
        personaPotentialCRLift: parseFloat(d.industry_std_lift - 1).toFixed(2),
        personaRevProjected: 0,
        personaRevPotential: 0,
        personaShortCode: d.short_code,
        ...d
    }
}

/* 
export async function processPersonaMetricsResultPost(personaMetricsResult, data = {}, affiliateSavingsFlag = false, currency = null) {

    if (personaMetricsResult !== undefined) {
        const pg_sessions = parseFloat(personaMetricsResult.pg_sessions);
        const pg_transactions = parseFloat(personaMetricsResult.pg_transactions);
        const pg_revenue = parseFloat(personaMetricsResult.pg_revenue);
        const pg_aov = pg_revenue / pg_transactions;

        const affiliate_savings = !isNaN(pg_revenue) ? pg_revenue * 0.02 : 0;
        data.personaMetricsResultLoading = false;
        data.personaMetrics = [
            {
                "metricName": "Sessions",
                "brandlock_off": null,
                "brandlock_on": !isNaN(pg_sessions) ? `${parseFloat(pg_sessions).toFixed(3)}` : 0,
                "gain": null,
                "unit": ""
            },
            {
                "metricName": "Transactions",
                "brandlock_off": null,
                "brandlock_on": !isNaN(pg_transactions) ? `${parseFloat(pg_transactions).toFixed(3)}` : 0,
                "gain": null,
                "unit": ""
            },
            {
                "metricName": "Revenue",
                "brandlock_off": null,
                "brandlock_on": !isNaN(pg_revenue) ? `${parseFloat(pg_revenue).toFixed(3)}` : 0,
                "gain": null,
                "unit": "$"
            },
            {
                "metricName": "Avg. Order Value",
                "brandlock_off": null,
                "brandlock_on": !isNaN(pg_aov) ? `${parseFloat(pg_aov).toFixed(3)}` : 0,
                "gain": null,
                "unit": "$"
            },
        ];

        if (affiliateSavingsFlag) {
            data.personaMetrics.push({
                "metricName": "Affiliate Savings",
                "brandlock_off": 0,
                "brandlock_on": !isNaN(affiliate_savings) ? `${parseFloat(affiliate_savings).toFixed(3)}` : 0,
                "gain": !isNaN(affiliate_savings) ? `${parseFloat(affiliate_savings).toFixed(3)}` : 0,
                "unit": "$"
            })
        }
    } else {
        data.personaMetricsResultLoading = false;
        data.no_data = true;
        data.personaMetrics = [
            {
                "metricName": "Lift",
                "gain": 10,
                "unit": "%"
            },
        ];
    }
    return data;
} */
