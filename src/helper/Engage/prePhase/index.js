export async function processWhyNotPersonaImpactResult(personaMetricsResult, data = null, websiteRecord = null, getEngagePersonaMetricsWhyNotShopperData = null) {
    let impact = [];
    let totalUsers = null;
    let industryStd = null;
    let totalSessions = null;
    let indStdSessionsthatReducedCart = null;
    let indStdCheckoutUsers = null;
    let indStdCheckoutSessions = null;
    let indStdItemReduced = null;
    let indStdRevenueLost = null;
    if (personaMetricsResult.hasOwnProperty("data") && personaMetricsResult.data.length > 0 && Object.keys(personaMetricsResult.data[0].whyNotShopper).length !== 0) {
        let checkoutUsers = personaMetricsResult.data[0].allShoppers.checkout_users * 1;
        let checkoutSessions = personaMetricsResult.data[0].allShoppers.checkout_sessions * 1;
        let projectedcheckoutSessions = personaMetricsResult.data[0].allShoppers.projected_checkout_sessions * 1;
        let checkoutConversions = personaMetricsResult.data[0].allShoppers.checkout_conversions * 1;
        let projectedCheckoutConversions = personaMetricsResult.data[0].allShoppers.projected_checkout_conversions * 1;
        let allSessionsWithCartReductions = personaMetricsResult.data[0].whyNotShopper.all_sessions_with_cart_reductions * 1;
        let projectedAllSessionsWithCartReductions = personaMetricsResult.data[0].whyNotShopper.projected_sessions_with_product_removal * 1;
        let usersThatReducedCart = personaMetricsResult.data[0].whyNotShopper.all_converting_users_with_cart_reductions_summed * 1;

        let reducedCartUsersinPerc = checkoutUsers !== 0 ? (usersThatReducedCart / checkoutUsers) * 100 : null
        let itemReduced = personaMetricsResult.data[0].whyNotShopper.products_removed_in_converted_session * 1;
        let projectedItemReduced = personaMetricsResult.data[0].whyNotShopper.projected_products_removed_in_converted_session * 1;
        let revenueLost = personaMetricsResult.data[0].whyNotShopper.total_revenue_from_removed_items_in_converted_session * 1;

        let projectedRevenueLost = personaMetricsResult.data[0].whyNotShopper.projected_total_revenue_from_removed_items_in_converted_session * 1;
        if ((checkoutConversions !== null && !isNaN(checkoutConversions) && checkoutConversions !== 0) || (allSessionsWithCartReductions !== null && allSessionsWithCartReductions !== 0) || (itemReduced !== 0 && itemReduced !== null) || (revenueLost !== undefined && revenueLost !== null && !isNaN(revenueLost) && revenueLost !== 0)) {
            impact.push(
                {
                    "Converting sessions that reached checkout":
                    {
                        actual: checkoutConversions !== null && !isNaN(checkoutConversions) && checkoutConversions !== 0 ? checkoutConversions : null,
                        projected: projectedCheckoutConversions !== null && !isNaN(projectedCheckoutConversions) && projectedCheckoutConversions !== 0 ? projectedCheckoutConversions : null
                    },
                },
                {
                    "Converting sessions with products removals":
                    {
                        actual: allSessionsWithCartReductions !== null && allSessionsWithCartReductions !== 0 ? allSessionsWithCartReductions : null,
                        projected: projectedAllSessionsWithCartReductions !== null && projectedAllSessionsWithCartReductions !== 0 ? projectedAllSessionsWithCartReductions : null
                    }
                },
                {
                    "Total items reduced in converting sessions": {
                        actual: itemReduced !== null && itemReduced !== 0 ? itemReduced : null,
                        projected: projectedItemReduced !== null && projectedItemReduced !== 0 ? projectedItemReduced : null,
                    }
                },
                {
                    "Revenue lost due to reduced items in converting sessions": {
                        actual: revenueLost !== undefined && revenueLost !== null && revenueLost !== 0 ? Math.round(revenueLost).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }) : null,
                        projected: projectedRevenueLost !== undefined && projectedRevenueLost !== null && projectedRevenueLost !== 0 ? Math.round(projectedRevenueLost).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }) : null
                    }
                })
            industryStd = false;

        }

    }

    if (websiteRecord.data[0].ab_perc !== 100) {
        totalUsers = data.total_visitors_pg + data.total_visitors_cg;
        totalSessions = data.protected_sessions + data.controlled_sessions;
    } else {
        totalUsers = data.total_visitors_pg;
        totalSessions = data.protected_sessions;
    }



    indStdCheckoutUsers = Math.round(0.07 * totalUsers);
    indStdCheckoutSessions = Math.round(0.07 * totalSessions);
    indStdSessionsthatReducedCart = Math.round(indStdCheckoutSessions * 0.14 * 0.34);
    indStdItemReduced = Math.round(3 * 0.34 * 0.14 * 0.07 * totalSessions);
    indStdRevenueLost = ((data.total_aov * 1.20) / 1.28) * indStdItemReduced;

    if (industryStd === null) {
        if ((indStdCheckoutSessions !== null && indStdCheckoutSessions !== 0) || (indStdSessionsthatReducedCart !== null && indStdSessionsthatReducedCart !== 0) || (indStdItemReduced !== 0 && indStdItemReduced !== null) || (indStdRevenueLost !== undefined && indStdRevenueLost !== null && !isNaN(indStdRevenueLost) && indStdRevenueLost !== 0)) {

            impact.push({
                "Converting sessions that reached checkout": {
                    projected: !isNaN(indStdCheckoutSessions) && indStdCheckoutSessions !== 0 ? Math.round(indStdCheckoutSessions * 0.33) : null
                }
            },
                {
                    "Converting sessions with products removals": {
                        projected: indStdSessionsthatReducedCart
                    }
                },
                {
                    "Total items reduced in converting sessions": {
                        projected: !isNaN(indStdItemReduced) && indStdItemReduced !== 0 ? Math.round(indStdItemReduced) : null
                    }
                },
                {
                    "Revenue lost due to reduced items in converting sessions": {
                        projected: !isNaN(indStdRevenueLost) && indStdRevenueLost !== 0 ? Math.round(indStdRevenueLost).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }) : null
                    }
                });

            industryStd = true

        }
    }

    return {
        data: impact,
        industryStd,
        users: getEngagePersonaMetricsWhyNotShopperData.hasOwnProperty("data") && getEngagePersonaMetricsWhyNotShopperData.data.length > 0 ? getEngagePersonaMetricsWhyNotShopperData.data[0].all_users_with_cart_reductions_summed : indStdCheckoutUsers,
        dayCount: personaMetricsResult.hasOwnProperty("data") && personaMetricsResult.data.length > 0 && personaMetricsResult.data[0].whyNotDayCount,
    }
}


export async function processWrongCouponPersonaImpactResult(personaMetricsResult, data = null, websiteRecord = null) {
    let impact = [];
    let impactCR = [];
    let impactIndStdStatus = null;
    let impactCRIndStdStatus = null;
    let totalUsers = null;
    let totalSessions = null;
    let indStdWcUsersDroppedOff = null;
    let indStdRevenueLost = null;
    let indStdWcSessions = null;
    let indStdWcUsers = null;
    let indStdRcSessions = null;
    let indStdCheckoutSessions = null;
    let indStdWcOrders = null;
    let indStdRcOrders = null;
    let indStdCheckoutOrders = null;
    let indStdUserDropOffRate = null;
    let wcUsers = null;
    if (personaMetricsResult.hasOwnProperty("data") && personaMetricsResult.data.length > 0 && Object.keys(personaMetricsResult.data[0].wrongCoupon).length !== 0) {

        let buyersLostDueToWrongCoupon = personaMetricsResult.data[0].wrongCoupon.hasOwnProperty('buyers_lost_due_to_wrong_coupon') ? personaMetricsResult.data[0].wrongCoupon.buyers_lost_due_to_wrong_coupon * 1 : 0;
        let revenueLost = buyersLostDueToWrongCoupon * data.total_aov;
        let checkoutUsers = personaMetricsResult.data[0].allShoppers.checkout_users * 1;
        let checkoutSessions = personaMetricsResult.data[0].allShoppers.checkout_sessions * 1;
        wcUsers = personaMetricsResult.data[0].wrongCoupon.wc_users * 1;
        let wcSessions = personaMetricsResult.data[0].wrongCoupon.wc_sessions * 1;
        let rcUsers = personaMetricsResult.data[0].wrongCoupon.rc_users * 1;
        let rcSessions = personaMetricsResult.data[0].wrongCoupon.rc_sessions * 1;
        let checkoutConversions = personaMetricsResult.data[0].allShoppers.checkout_conversions * 1;
        let rcConversions = personaMetricsResult.data[0].wrongCoupon.rc_conversions * 1;
        let wcConversions = personaMetricsResult.data[0].wrongCoupon.wc_conversions * 1;
        let checkoutCR = checkoutSessions !== 0 ? (checkoutConversions / checkoutSessions) * 100 : null;
        let rcConversionRate = personaMetricsResult.data[0].wrongCoupon.rc_conversion_rate * 1;
        let wcConversionRate = personaMetricsResult.data[0].wrongCoupon.wc_conversion_rate * 1;
        let wcDeltaWRc = personaMetricsResult.data[0].wrongCoupon.hasOwnProperty('wc_delta_w_rc') ? personaMetricsResult.data[0].wrongCoupon.wc_delta_w_rc * 1 : 0;
        if ((rcConversionRate !== null && rcConversionRate !== 0) ||
            (wcConversionRate !== null && wcConversionRate !== 0) ||
            (checkoutCR !== null && checkoutCR !== 0)) {
            rcConversionRate !== null && rcConversionRate !== 0 && rcConversionRate > wcConversionRate && !isNaN(rcSessions) && !isNaN(rcConversions) && impactCR.push({
                rc: {
                    "Checkout users with right coupons": rcConversionRate !== null && rcConversionRate !== 0 && rcConversionRate > wcConversionRate ? `${parseFloat(rcConversionRate).toFixed(2)}%` : null,
                    users: rcSessions,
                    orders: rcConversions
                }
            })
            wcConversionRate !== null && wcConversionRate !== 0  && !isNaN(wcSessions) && !isNaN(wcConversions) && impactCR.push({
                wc: {
                    "Checkout users with wrong coupons": wcConversionRate !== null && wcConversionRate !== 0 ? `${parseFloat(wcConversionRate).toFixed(2)}%` : null,
                    users: wcSessions,
                    orders: wcConversions
                },
            })
            checkoutCR !== null && checkoutCR !== 0 && checkoutCR > wcConversionRate && !isNaN(checkoutSessions) && !isNaN(checkoutConversions) && impactCR.push({
                checkout: {
                    "Checkout users with no coupons": checkoutCR !== null && checkoutCR !== 0 && checkoutCR > wcConversionRate ? `${parseFloat(checkoutCR).toFixed(2)}%` : null,
                    users: checkoutSessions,
                    orders: checkoutConversions
                }
            })
            impactCRIndStdStatus = false;

        }
        if ((wcDeltaWRc !== null && wcDeltaWRc !== 0) ||
            (buyersLostDueToWrongCoupon !== null && buyersLostDueToWrongCoupon !== 0) ||
            (revenueLost !== undefined && revenueLost !== null && !isNaN(revenueLost) && revenueLost !== 0)) {
            impact.push(
                { "User Drop off rate higher %": wcDeltaWRc !== null && wcDeltaWRc !== 0 ? `${parseFloat(personaMetricsResult.data[0].wrongCoupon.wc_delta_w_rc).toFixed(2)}%` : null },
                { "Conversions lost": buyersLostDueToWrongCoupon !== null && buyersLostDueToWrongCoupon !== 0 ? `${Math.round(buyersLostDueToWrongCoupon)}` : null },
                /* { "Revenue lost due to additional drop offs.": revenueLost !== undefined && revenueLost !== null && !isNaN(revenueLost) && revenueLost !== 0 ? Math.round(revenueLost).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }) : null } */
            )
            impactIndStdStatus = false;
        }

    }

    if (websiteRecord.data[0].ab_perc !== 100) {
        totalUsers = data.total_visitors_pg + data.total_visitors_cg;
        totalSessions = data.protected_sessions + data.controlled_sessions;
    } else {
        totalUsers = data.total_visitors_pg;
        totalSessions = data.protected_sessions;
    }

    indStdRevenueLost = 0.0006 * data.total_transactions * data.total_aov;

    indStdWcSessions = Math.round(0.005 * totalSessions);
    indStdWcUsers = Math.round(0.005 * totalUsers);
    indStdRcSessions = Math.round(0.02 * totalSessions);
    indStdCheckoutSessions = Math.round(0.07 * totalSessions);


    indStdWcOrders = Math.round(0.31 * indStdWcSessions);
    indStdRcOrders = Math.round(0.43 * indStdRcSessions);
    indStdCheckoutOrders = Math.round(0.33 * indStdCheckoutSessions);

    let indStdWcCr = (indStdWcOrders / indStdWcSessions) * 100
    let indStdRcCr = (indStdRcOrders / indStdRcSessions) * 100
    let indStdCheckoutCr = (indStdCheckoutOrders / indStdCheckoutSessions) * 100
    if (indStdRcCr > indStdWcCr) {
        indStdWcUsersDroppedOff = ((indStdRcCr - indStdWcCr) / 100) * indStdWcSessions
        indStdUserDropOffRate = indStdRcCr - indStdWcCr
    } else if (indStdCheckoutCr > indStdWcCr) {
        indStdWcUsersDroppedOff = ((indStdCheckoutCr - indStdWcCr) / 100) * indStdWcSessions
        indStdUserDropOffRate = indStdCheckoutCr - indStdWcCr
    }
    if (impactCRIndStdStatus === null) {

        (indStdRcCr > indStdWcCr) && impactCR.push(
            {
                rc: { "Checkout users with right coupons": `${parseFloat(indStdRcCr).toFixed(2)}%`, sessions: indStdRcSessions, orders: indStdRcOrders }
            });
        (indStdWcSessions !== 0 && indStdWcOrders !== 0 && !isNaN(indStdWcCr) && indStdWcCr !== 0) && impactCR.push(
            { wc: { "Checkout users with wrong coupons": `${parseFloat(indStdWcCr).toFixed(2)}%`, sessions: indStdWcSessions, orders: indStdWcOrders } });

        (indStdCheckoutCr > indStdWcCr) && impactCR.push({
            chekout: {
                "Checkout users with no coupons":
                    `${parseFloat(indStdCheckoutCr).toFixed(2)}%`, sessions: indStdCheckoutSessions, orders: indStdCheckoutOrders
            }
        });
        impactCRIndStdStatus = true;
    }

    if (((indStdWcUsersDroppedOff !== null && indStdWcUsersDroppedOff !== 0) || (indStdRevenueLost !== undefined && indStdRevenueLost !== null && !isNaN(indStdRevenueLost) && indStdRevenueLost !== 0)) && impactIndStdStatus === null) {
        impact.push(
            { "User Drop off rate higher %": indStdUserDropOffRate !== null && indStdUserDropOffRate !== 0 ? `${parseFloat(indStdUserDropOffRate).toFixed(2)}%` : '38%' },
            { "Conversions lost": indStdWcUsersDroppedOff !== null && indStdWcUsersDroppedOff !== 0 ? `${Math.round(indStdWcUsersDroppedOff)}` : null },
            /* { "Revenue lost due to additional drop offs.": indStdRevenueLost !== undefined && indStdRevenueLost !== null && !isNaN(indStdRevenueLost) && indStdRevenueLost !== 0 ? Math.round(indStdRevenueLost).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }) : null } */
        )
        impactIndStdStatus = true;
    }

    return {
        data: {
            impact: impactIndStdStatus !== null ? impact : [],
            impactCR: impactCRIndStdStatus !== null ? impactCR : [],
        },
        users: wcUsers !== null && !isNaN(wcUsers) ? wcUsers * 1 : indStdWcUsers !== null && !isNaN(indStdWcUsers) ? indStdWcUsers : 0,
        dayCount: personaMetricsResult.hasOwnProperty("data") && personaMetricsResult.data.length > 0 && personaMetricsResult.data[0].dayCount,
        impactIndStdStatus,
        impactCRIndStdStatus
    };
}


export async function processExtensionShopperPersonaImpactResult(personaMetricsResult, data = null, websiteRecord = null) {
    let impact = {};
    let indStdCashbackUsers = null;
    let indStdCashbackSessions = null;
    let totalUsers = null;
    let totalSessions = null;
    let indStdMpaCashbackConversions = null;
    let indStdRevenueLost = null;
    let indStdMpaUsers = null;
    let indStdMpaSessions = null;
    let indStdFpaSessions = null;
    let indStdFpaConversions = null;
    let industryStd = null;

    if (personaMetricsResult.hasOwnProperty("data") && personaMetricsResult.data.length > 0 && Object.keys(personaMetricsResult.data[0].extensionShopper).length !== 0) {
        let cashbackConversions = personaMetricsResult.data[0].extensionShopper.cashback_conversions * 1;
        let projectedCashbackConversions = personaMetricsResult.data[0].extensionShopper.projected_cashback_conversions * 1;
        let revenueLost = cashbackConversions * data.total_aov;
        let projectedRvenueLost = projectedCashbackConversions * data.total_aov;
        let cashbackUsers = personaMetricsResult.data[0].extensionShopper.cashback_users * 1;
        let mpaCashbackUsers = personaMetricsResult.data[0].extensionShopper.mpa_cashback_users * 1;
        let fpaCashbackUsers = personaMetricsResult.data[0].extensionShopper.fpa_cashback_users * 1;
        let mpaCashbackSessions = personaMetricsResult.data[0].extensionShopper.mpa_cashback_sessions * 1;
        let fpaCashbackSessions = personaMetricsResult.data[0].extensionShopper.fpa_cashback_sessions * 1;
        let mpaCashbackConversions = personaMetricsResult.data[0].extensionShopper.mpa_cashback_conversions * 1;
        let fpaCashbackConversions = personaMetricsResult.data[0].extensionShopper.fpa_cashback_conversions * 1;
        let recyledUsers = cashbackUsers !== 0 ? (mpaCashbackUsers / cashbackUsers) * 100 : null


        if (revenueLost !== undefined && revenueLost !== null && !isNaN(revenueLost) && revenueLost !== 0) {


            impact = {
                sah: {
                    mpa_sessions: mpaCashbackSessions,
                    fpa_sessions: fpaCashbackSessions
                },
                oah: {
                    mpa_orders: mpaCashbackConversions,
                    fpa_orders: fpaCashbackConversions
                }, ...impact
            }

            impact = {
                ...{
                    "revenue_lost": {
                        actual: revenueLost !== undefined && revenueLost !== null && revenueLost !== 0 ? Math.round(revenueLost).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }) : null,
                        projected: projectedRvenueLost !== undefined && projectedRvenueLost !== null && projectedRvenueLost !== 0 ? Math.round(projectedRvenueLost).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }) : null
                    }
                }, ...impact
            }

            industryStd = false
        }

    }

    if (websiteRecord.data[0].ab_perc !== 100) {
        totalUsers = data.total_visitors_pg + data.total_visitors_cg;
        totalSessions = data.protected_sessions + data.controlled_sessions;
    } else {
        totalUsers = data.total_visitors_pg;
        totalSessions = data.protected_sessions;
    }

    indStdCashbackUsers = 0.01 * totalUsers;
    indStdCashbackSessions = 0.01 * totalSessions;
    indStdMpaUsers = 0.2 * 0.01 * totalUsers;
    indStdMpaSessions = 0.2 * 0.01 * totalSessions;
    indStdFpaSessions = 0.17 * 0.01 * totalSessions;
    indStdFpaConversions = 0.12 * 0.17 * 0.01 * totalSessions;
    indStdMpaCashbackConversions = 0.26 * 0.2 * 0.01 * totalSessions;
    indStdRevenueLost = 0.0005 * data.total_transactions * data.total_aov;
    if (industryStd !== false) {

        impact = {
            sah: {
                mpa_sessions: indStdMpaSessions !== 0 ? parseFloat(indStdMpaSessions).toFixed(2) : 0,
                fpa_sessions: indStdFpaSessions !== 0 ? parseFloat(indStdFpaSessions).toFixed(2) : 0,
            },
            oah: {
                mpa_orders: indStdMpaCashbackConversions !== 0 ? parseFloat(indStdMpaCashbackConversions).toFixed(2) : 0,
                fpa_orders: indStdFpaConversions !== 0 ? parseFloat(indStdFpaConversions).toFixed(2) : 0
            }, ...impact
        }


        if (indStdRevenueLost !== undefined && indStdRevenueLost !== null && !isNaN(indStdRevenueLost) && indStdRevenueLost !== 0) {

            impact = {
                /* { "Coupon and Cashback Extension users": indStdCashbackUsers !== null && indStdCashbackUsers !== 0 ? `${Math.round(indStdCashbackUsers)}` : null },
                { "Cashback conversion rate": cashbackCR !== null && cashbackCR !== 0 ? `${parseFloat( cashbackCR * 100).toFixed(2)}%` : null },
                { "Cashback recycled users": '16%' },
                { "Coupon and Cashback Extension users recycled": indStdMpaUsers !== null && indStdMpaUsers !== 0 ? `${parseFloat(indStdMpaUsers).toFixed(2)}%` : null },
                { "Recycled users conversion rate": mpaCR !== null && mpaCR !== 0 ? `${parseFloat(mpaCR * 100).toFixed(2)}%` : null },
                { "Recycled conversions": indStdMpaCashbackConversions !== null && indStdMpaCashbackConversions !== 0 ? `${Math.round(indStdMpaCashbackConversions)}` : null }, */
                ...{
                    "revenue_lost": {
                        projected: indStdRevenueLost !== undefined && indStdRevenueLost !== null && indStdRevenueLost !== 0 ? Math.round(indStdRevenueLost).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }) : null
                    }
                },
                ...impact
            }
        }
        industryStd = true
    }

    return {
        data: impact,
        industryStd,
        users: personaMetricsResult.data !== undefined && personaMetricsResult.data.length && personaMetricsResult.data[0].hasOwnProperty('extensionShopper') && personaMetricsResult.data[0].extensionShopper.hasOwnProperty('cashback_users') ? personaMetricsResult.data[0].extensionShopper.cashback_users * 1 : parseInt(Math.round(indStdCashbackUsers)),
        dayCount: personaMetricsResult.hasOwnProperty("data") && personaMetricsResult.data.length > 0 && personaMetricsResult.data[0].dayCount,
    };
}



export async function processCouponRunnerPersonaImpactResult(personaMetricsResult, data = null, websiteRecord = null) {
    let impact = [];
    let totalUsers = null;
    let couponRunnerUsers = null;
    let industryStd = null;
    let indStdRvenueLost = null;
    let indStdCouponRunnerConversions = null;
    let indStdCouponRunnerUsers = null;
    if (personaMetricsResult.hasOwnProperty("data") && personaMetricsResult.data.length > 0 && Object.keys(personaMetricsResult.data[0].couponRunner).length !== 0) {
        let couponRunnerUsers = personaMetricsResult.data[0].couponRunner.coupon_runner_users * 1;
        let projectedCouponRunnerUsers = personaMetricsResult.data[0].couponRunner.projected_coupon_runner_users * 1;
        let couponRunnerConversions = personaMetricsResult.data[0].couponRunner.coupon_runner_conversions * 1;
        let projectedCouponRunnerConversions = personaMetricsResult.data[0].couponRunner.projected_coupon_runner_conversions * 1;
        let revenueLost = couponRunnerConversions * data.total_aov;
        let projectedRevenueLost = projectedCouponRunnerConversions * data.total_aov;

        if ((couponRunnerUsers !== null && couponRunnerUsers !== 0) || (couponRunnerConversions !== null && couponRunnerConversions !== 0) || (revenueLost !== undefined && revenueLost !== null && !isNaN(revenueLost) && revenueLost !== 0)) {
            impact.push(
                {
                    "Coupon runner users": {
                        actual: couponRunnerUsers !== null && couponRunnerUsers !== 0 ? `${Math.round(couponRunnerUsers)}` : null,
                        projected: projectedCouponRunnerUsers !== null && projectedCouponRunnerUsers !== 0 ? `${Math.round(projectedCouponRunnerUsers)}` : null
                    }
                },
                {
                    "Falsely attributed conversions": {
                        actual: couponRunnerConversions !== null && couponRunnerConversions !== 0 ? `${Math.round(couponRunnerConversions)}` : null,
                        projected: projectedCouponRunnerConversions !== null && projectedCouponRunnerConversions !== 0 ? `${Math.round(projectedCouponRunnerConversions)}` : null
                    }
                },
                {
                    "Revenue falsely attributed conversions": {
                        actual: revenueLost !== undefined && revenueLost !== null && revenueLost !== 0 ? Math.round(revenueLost).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }) : null,
                        projected: projectedRevenueLost !== undefined && projectedRevenueLost !== null && projectedRevenueLost !== 0 ? Math.round(projectedRevenueLost).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }) : null
                    }
                })

            industryStd = false
        }
    }
    if (websiteRecord.data[0].ab_perc !== 100) {
        totalUsers = data.total_visitors_pg + data.total_visitors_cg;
    } else {
        totalUsers = data.total_visitors_pg;
    }
    indStdCouponRunnerUsers = 0.032 * totalUsers;

    indStdCouponRunnerConversions = 0.0029 * data.total_transactions;
    indStdRvenueLost = 0.0029 * data.total_transactions * data.total_aov;

    if (industryStd === null) {
        if ((indStdCouponRunnerUsers !== null && indStdCouponRunnerUsers !== 0) || (indStdCouponRunnerConversions !== null && indStdCouponRunnerConversions !== 0) || (indStdRvenueLost !== undefined && indStdRvenueLost !== null && !isNaN(indStdRvenueLost) && indStdRvenueLost !== 0)) {
            impact.push(
                {
                    "Coupon Runner Users": {
                        projected: indStdCouponRunnerUsers !== null && indStdCouponRunnerUsers !== 0 ? `${parseInt(Math.round(indStdCouponRunnerUsers))}` : null
                    }
                },
                {
                    "Falsely attributed conversions": {
                        projected: indStdCouponRunnerConversions !== null && indStdCouponRunnerConversions !== 0 ? `${parseInt(Math.round(indStdCouponRunnerConversions))}` : null
                    }
                },
                {
                    "Revenue falsely attributed conversions": {
                        projected: indStdRvenueLost !== undefined && indStdRvenueLost !== null && indStdRvenueLost !== 0 ? Math.round(indStdRvenueLost).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }) : null
                    }
                })
            industryStd = true;
        }
    }

    return {
        data: impact,
        industryStd,
        users: personaMetricsResult.data !== undefined && personaMetricsResult.data.length && personaMetricsResult.data[0].hasOwnProperty('couponRunner') && personaMetricsResult.data[0].couponRunner.hasOwnProperty('coupon_runner_users') ? personaMetricsResult.data[0].couponRunner.coupon_runner_users * 1 : parseInt(Math.round(indStdCouponRunnerUsers)),
        dayCount: personaMetricsResult.hasOwnProperty("data") && personaMetricsResult.data.length > 0 && personaMetricsResult.data[0].dayCount
    }
}


