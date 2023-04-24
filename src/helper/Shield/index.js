import { getCurrencySymbol, metricsPerNumberOfUsers } from "../Utils";

export function processShieldMetrics(shieldDataAPI, currency = null) {
    let data =  [
        {
            name: "Bounce Rate",
            pg: shieldDataAPI.data.total_bounce_rate_pg * 100,
            cg: shieldDataAPI.data.total_bounce_rate_cg * 100,
            difference: shieldDataAPI.data.total_bounce_rate_lift,
            icon: shieldDataAPI.data.total_bounce_rate_lift > 0 ? "text-success fa fa-arrow-down" : "d-none fa fa-arrow-up",
            "unit": "%",
            "currency": false
        },
        {
            name: "Pages Per Session",
            pg: shieldDataAPI.data.total_pps_pg,
            cg: shieldDataAPI.data.total_pps_cg,
            difference: shieldDataAPI.data.total_pps_lift,
            icon: shieldDataAPI.data.total_pps_lift > 0 ? "text-success fa fa-arrow-up" : "d-none fa fa-arrow-down",
            "unit": "",
            "currency": false
        },
        /*             {
              name: "Exit Rate",
              pg: shieldDataAPI.data.total_exit_rate_pg,
              cg: shieldDataAPI.data.total_exit_rate_cg,
              difference: shieldDataAPI.data.total_exit_rate_lift,
              icon: shieldDataAPI.data.total_exit_rate_lift > 0 ? "text-success fa fa-arrow-down" : "d-none fa fa-arrow-up"
            }, */

        {
            name: "Session Duration",
            pg: shieldDataAPI.data.total_session_duration_pg,
            cg: shieldDataAPI.data.total_session_duration_cg,
            difference: shieldDataAPI.data.total_session_duration_diff,
            icon: shieldDataAPI.data.total_session_duration_diff > 0 ? "text-success fa fa-arrow-up" : "d-none fa fa-arrow-down",
            "unit": "",
            "currency": false
        },
        {
            name: "Revenue Per 1000 Sessions",
            pg: metricsPerNumberOfUsers(shieldDataAPI.data.total_rps_pg, 1, 1000, 0, ''),
            cg: metricsPerNumberOfUsers(shieldDataAPI.data.total_rps_cg, 1, 1000, 0, ''),
            difference: shieldDataAPI.data.rps_lift,
            icon: shieldDataAPI.data.rps_lift > 0 ? "text-success fa fa-arrow-up" : "d-none fa fa-arrow-down",
            "unit": getCurrencySymbol(currency),
            "currency": true
        },
        {
            name: "CR",
            pg: shieldDataAPI.data.total_conversion_rate_pg * 100,
            cg: shieldDataAPI.data.total_conversion_rate_cg * 100,
            difference: shieldDataAPI.data.conversion_lift,
            icon: shieldDataAPI.data.conversion_lift > 0 ? "text-success fa fa-arrow-up" : "d-none fa fa-arrow-down",
            "unit": "%",
            "currency": false
        },
        {
            name: "AOV",
            pg: shieldDataAPI.data.total_aov_pg,
            cg: shieldDataAPI.data.total_aov_cg,
            difference: shieldDataAPI.data.total_aov_lift_perc,
            icon: shieldDataAPI.data.total_aov_lift_perc > 0 ? "text-success fa fa-arrow-up" : "d-none fa fa-arrow-down",
            "unit": getCurrencySymbol(currency),
            "currency": true
        },
        {
            name: "OPV",
            pg: shieldDataAPI.data.total_opv_pg,
            cg: shieldDataAPI.data.total_opv_cg,
            difference: shieldDataAPI.data.total_opv_lift,
            icon: shieldDataAPI.data.total_opv_lift > 0 ? "text-success fa fa-arrow-up" : "d-none fa fa-arrow-down",
            "unit": "",
            "currency": false
        },
    ]

    const limitedData = data.sort((a, b) => b.difference - a.difference).slice(0, 5);
    return limitedData;
}

export function processShieldMetricsIndustryStd(industyStdData, currency = null) {
    let data =  [
/*         {
            name: "Bounce Rate",
            pg: shieldDataAPI.data.total_bounce_rate_pg * 100,
            cg: shieldDataAPI.data.total_bounce_rate_cg * 100,
            difference: shieldDataAPI.data.total_bounce_rate_lift,
            icon: shieldDataAPI.data.total_bounce_rate_lift > 0 ? "text-success fa fa-arrow-down" : "d-none fa fa-arrow-up",
            "unit": "%",
            "currency": false
        }, */
        {
            name: "Pages Per Session",
            pg: industyStdData.pages_per_session !== undefined && industyStdData.pages_per_session !== null ? industyStdData.pages_per_session * 1.031 : 0,
            cg: industyStdData.pages_per_session !== undefined && industyStdData.pages_per_session !== null ? industyStdData.pages_per_session : 0,
            difference: industyStdData.pages_per_session !== undefined && industyStdData.pages_per_session !== null ? 3.10 : 0,
            icon: "text-success fa fa-arrow-up",
            "unit": "",
            "currency": false
        },


        {
            name: "Session Duration",
            pg: industyStdData.session_duration !== undefined && industyStdData.session_duration !== null ? industyStdData.session_duration * 1.036 : 0,
            cg: industyStdData.session_duration !== undefined && industyStdData.session_duration !== null ? industyStdData.session_duration : 0,
            difference: industyStdData.session_duration !== undefined && industyStdData.session_duration !== null ? 3.60 : 0,
            icon: "text-success fa fa-arrow-up",
            "unit": "",
            "currency": false
        },
        {
            name: "Revenue Per 1000 Sessions",
            pg: metricsPerNumberOfUsers(industyStdData.revenue_per_session, 1.05, 1000),
            cg: metricsPerNumberOfUsers(industyStdData.revenue_per_session, 1, 1000),
            difference: industyStdData.revenue_per_session !== undefined && industyStdData.revenue_per_session !== null ? 5 : 0,
            icon: "text-success fa fa-arrow-up",
            "unit": getCurrencySymbol(currency),
            "currency": true
        },
        {
            name: "CR",
            pg: industyStdData.conversion_rate !== undefined && industyStdData.conversion_rate !== null ? industyStdData.conversion_rate * 1.06 : 0,
            cg: industyStdData.conversion_rate !== undefined && industyStdData.conversion_rate !== null ? industyStdData.conversion_rate : 0,
            difference: industyStdData.conversion_rate !== undefined && industyStdData.conversion_rate !== null ? 6 : 0,
            icon: "text-success fa fa-arrow-up",
            "unit": "%",
            "currency": false
        },
        {
            name: "AOV",
            pg: industyStdData.aov !== undefined && industyStdData.aov !== null ? industyStdData.aov * 1.03 : 0,
            cg: industyStdData.aov !== undefined && industyStdData.aov !== null ? industyStdData.aov : 0,
            difference: industyStdData.aov !== undefined && industyStdData.aov !== null ? 3 : 0,
            icon: "text-success fa fa-arrow-up",
            "unit": getCurrencySymbol(currency),
            "currency": true
        }
    ]

    const limitedData = data.sort((a, b) => b.difference - a.difference).slice(0, 5);
    return limitedData;
}


export function processPostPhaseShieldMetrics(shieldDataAPI, currency = null) {
    let data = [
        {
            name: "Pages Per Session",
            pg: shieldDataAPI.data[0].e_pages_per_session,
            cg: shieldDataAPI.data[0].c_pages_per_session,
            difference: shieldDataAPI.data[0].improvement_in_pages_per_session,
            icon: shieldDataAPI.data[0].improvement_in_pages_per_session > 0 ? "text-success fa fa-arrow-up" : "d-none fa fa-arrow-down",
            "unit": "",
            "currency": false
        },
        {
            name: "Session Duration",
            pg: shieldDataAPI.data[0].e_avg_session_duration,
            cg: shieldDataAPI.data[0].c_avg_session_duration,
            difference: shieldDataAPI.data[0].improvement_in_avg_session_duration,
            icon: shieldDataAPI.data[0].improvement_in_avg_session_duration > 0 ? "text-success fa fa-arrow-up" : "d-none fa fa-arrow-down",
            "unit": "",
            "currency": false
        },
        {
            name: "Revenue Per 1000 Sessions",
            pg: metricsPerNumberOfUsers(shieldDataAPI.data[0].e_rps, 1, 1000),
            cg: metricsPerNumberOfUsers(shieldDataAPI.data[0].c_rps, 1, 1000),
            difference: shieldDataAPI.data[0].improvement_in_rps,
            icon: shieldDataAPI.data[0].improvement_in_rps > 0 ? "text-success fa fa-arrow-up" : "d-none fa fa-arrow-down",
            "unit": getCurrencySymbol(currency),
            "currency": true
        },
        {
            name: "CR",
            pg: shieldDataAPI.data[0].e_cr,
            cg: shieldDataAPI.data[0].c_cr,
            difference: shieldDataAPI.data[0].improvement_in_cr,
            icon: shieldDataAPI.data[0].improvement_in_cr > 0 ? "text-success fa fa-arrow-up" : "d-none fa fa-arrow-down",
            "unit": "%",
            "currency": false
        }
    ]

    const limitedData = data.sort((a, b) => b.difference - a.difference).slice(0, 5);
    return limitedData;
}


export function processPostPhaseShieldMetricsIndustryStd(shieldDataAPI, currency = null) {
    let data = [
        {
            name: "Pages Per Session",
            pg: 4.85,
            cg: 4.70,
            difference: 3.19,
            icon: 3.19 > 0 ? "text-success fa fa-arrow-up" : "d-none fa fa-arrow-down",
            "unit": "",
            "currency": false
        },
        {
            name: "Session Duration",
            pg: 343,
            cg: 200,
            difference: 7.66,
            icon: 7.66 > 0 ? "text-success fa fa-arrow-up" : "d-none fa fa-arrow-down",
            "unit": "",
            "currency": false
        },
        {
            name: "Revenue Per 1000 Sessions",
            pg: 485,
            cg: 470,
            difference: 3.19,
            icon: 3.19 > 0 ? "text-success fa fa-arrow-up" : "d-none fa fa-arrow-down",
            "unit": getCurrencySymbol(currency),
            "currency": true
        },
        {
            name: "CR",
            pg: 4.85,
            cg: 4.70,
            difference: 3.19,
            icon: 3.19 > 0 ? "text-success fa fa-arrow-up" : "d-none fa fa-arrow-down",
            "unit": "%",
            "currency": false
        }
    ]

    const limitedData = data.sort((a, b) => b.difference - a.difference).slice(0, 5);
    return limitedData;
}
