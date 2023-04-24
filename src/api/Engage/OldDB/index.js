import axios from "axios";
import { API_BASE_URL } from "../..";

export const getRecycledUsersDataUngroupedByPublisher = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/getrecycled-users-data-ungrouped-by-publisher`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const getRecycledUsersData = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/recycled-users-data`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const getExtensionShopperRecycledAffiliateSessions = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/recycled-users-data`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const getEngageGAData = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/gaData`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const getAffiliatePartnerEngageOrdersBreakdownResponse = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/affiliate-partner-engage-orders-breakdown`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};
export const geteEngageConsolidateRevenue = async ({ siteIdInput, startDate, endDate }, numberOfDays, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/getengage-consolidate-revenue`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate, "number_Of_days": numberOfDays }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const getMonthlyAffiliatePartnerEngageOrdersBreakdownResponse = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/get-monthly-affiliate-partner-engage-orders-breakdown`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const getBrandlockEngageOrdersBreakdown = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/brandlock-engage-orders-breakdown`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};


export const getMonthlyBrandlockEngageOrdersBreakdown = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/get-monthly-brandlock-engage-orders-breakdown`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};


export const getEngageTopCodes = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/get-engage-top-codes`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};


export const getEngageTopCouponsCashback = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/engage-top-coupons-cashback-data`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};



export const getExtensionShopperTopCouponsCashback = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/extension-shopper-top-coupons-cashback-data`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const getEngageTop5CouponsCashback = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/engage-top-5-coupons-cashback-data`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};



export const getCheckoutPageConversionRate = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/getCheckoutPageConversionRate`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};



export const getCouponUsed = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/getCouponUsed`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};


export const getEngageTopPublisherWc = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/engage-top-publisher-wc`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};


export const getClientHistory = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/get-client-history`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const geteEngageCouponBreakdown = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/getengage-coupon-breakdown`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};
export const getPublisherBreakdownByUserType = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/getPublisherBreakdownByUserType`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const getEngagePersonaCoupon = async ({ siteIdInput, startDate, endDate, persona_id }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/getengage-persona-promocode`, { "site_id": parseInt(siteIdInput), "persona_id": parseInt(persona_id), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const getEngagePersonaMetricsWhyNotShopper = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/getengage-persona-metrics-why-not-shopper`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const getEngagePersonaMetricsHesitantShopper = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/getengage-persona-metrics-hesitant-shopper`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const getHesitantShopperTopDropoffPages = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/getHesitantShopperTopDropoffPages`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const getHesitantShopperTriggerTimings = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/getHesitantShopperTriggerTimingsData`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const getEngagePersonaMetricsWC_EEI_CR = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/getengage-persona-metrics-wc-eei-cr`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const getEngagePrePhasePersonaImpact = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/getengage-prephase-persona-impact`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};


export const getEngagePrePhasePersonaImpactDayCount = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/getengage-prephase-persona-impact-day-count`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const getEngagePrePhaseWhyNotPersonaImpactDayCount = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/getengage-prephase-why-not-persona-impact-day-count`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const getEngagePrePhaseHesitantPersonaImpactDayCount = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/getengage-prephase-hesitant-persona-impact-day-count`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};


export const getEngageWrongCouponPrePhasePersonaImpact = async ({ siteIdInput, startDate, endDate }, getShieldGADataData, getWebsitesRecordByIdData, getEngagePrePhasePersonaImpactDayCountData, currency, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/getengage-wrong-coupon-prephase-persona-impact`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate, getShieldGADataData, getWebsitesRecordByIdData, getEngagePrePhasePersonaImpactDayCountData, currency }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};


export const getEngageExtensionPrePhasePersonaImpact = async ({ siteIdInput, startDate, endDate }, getShieldGADataData, getWebsitesRecordByIdData, getEngagePrePhasePersonaImpactDayCountData, currency, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/getengage-extension-prephase-persona-impact`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate, getShieldGADataData, getWebsitesRecordByIdData, getEngagePrePhasePersonaImpactDayCountData, currency }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};


export const getEngageCouponRunnerPrePhasePersonaImpact = async ({ siteIdInput, startDate, endDate }, getShieldGADataData, getWebsitesRecordByIdData, getEngagePrePhasePersonaImpactDayCountData, currency, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/getengage-coupon-runner-prephase-persona-impact`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate, getShieldGADataData, getWebsitesRecordByIdData, getEngagePrePhasePersonaImpactDayCountData, currency }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};


export const getEngageWhynotPrePhasePersonaImpact = async ({ siteIdInput, startDate, endDate }, getShieldGADataData, getWebsitesRecordByIdData, getEngagePersonaMetricsWhyNotShopperData, getEngagePrePhasePersonaImpactDayCountData, currency, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/getengage-whynot-prephase-persona-impact`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate, getShieldGADataData, getWebsitesRecordByIdData, getEngagePersonaMetricsWhyNotShopperData, getEngagePrePhasePersonaImpactDayCountData, currency }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};


export const getEngagePersonaMetricsDuring = async ({ siteIdInput, startDate, endDate }, headerConfigPassed, personaId = 0) => {
  return await axios
    .post(`${API_BASE_URL}/engage/getengage-persona-metrics-wc-eei-cr-during`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate, "persona_id": personaId }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};


export const getPostPhaseShoppersMetricsData = async ({ siteIdInput, startDate, endDate }, headerConfigPassed, personaId = 0) => {
  return await axios
    .post(`${API_BASE_URL}/engage/getPostPhaseShoppersMetricsData`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate, "persona_id": personaId }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const getEngagePersonaWhynot_During = async ({ siteIdInput, startDate, endDate }, headerConfigPassed, personaId = 0) => {
  return await axios
    .post(`${API_BASE_URL}/engage/getengage-persona-metrics-whynot-during`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate, "persona_id": personaId }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const getEngagePersona = async (headerConfigPassed) => {
  return await axios
    .get(`${API_BASE_URL}/engage/getengage-persona`, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const addEngagePromoCodeData = async ({ persona, valid_from_timezone, valid_to_timezone, ...values }, headerConfigPassed) => {
  if (!valid_from_timezone.hasOwnProperty("value")) {
    valid_from_timezone.value = valid_from_timezone.name;
  }
  if (!valid_to_timezone.hasOwnProperty("value")) {
    valid_to_timezone.value = valid_to_timezone.name;
  }

  const data = { ...values, created_on: new Date(), valid_from_timezone: JSON.stringify(valid_from_timezone), valid_to_timezone: JSON.stringify(valid_to_timezone), reported_status: "queue", persona: JSON.stringify(persona) }

  return await axios
    .post(`${API_BASE_URL}/engage/add-engage-promo-codes`, data, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};



export const updateEngagePromoCodeData = async ({ persona, valid_from_timezone, valid_to_timezone, ...values }, headerConfigPassed) => {

  if (!valid_from_timezone.hasOwnProperty("value")) {
    valid_from_timezone.value = valid_from_timezone.name;
  }
  if (!valid_to_timezone.hasOwnProperty("value")) {
    valid_to_timezone.value = valid_to_timezone.name;
  }

  const data = { ...values, modified_on: new Date(), valid_from_timezone: JSON.stringify(valid_from_timezone), valid_to_timezone: JSON.stringify(valid_to_timezone), reported_status: "queue", persona: JSON.stringify(persona) }


  return await axios
    .post(`${API_BASE_URL}/engage/update-engage-site-promo-code`, data, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};


export const addEngagePersonaPromoCode = async (data, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/add-engage-persona-promo-codes`, data, headerConfigPassed)
    .then((res) => {
      return res;
    })
    .catch(err => {
      return err;
    })
};

export const deleteEngagePersonaPromoCode = async ({ persona, valid_from_timezone, valid_to_timezone, ...values }, headerConfigPassed) => {

  if (!valid_from_timezone.hasOwnProperty("value")) {
    valid_from_timezone.value = valid_from_timezone.name;
  }
  if (!valid_to_timezone.hasOwnProperty("value")) {
    valid_to_timezone.value = valid_to_timezone.name;
  }

  const data = { ...values, modified_on: new Date(), valid_from_timezone: JSON.stringify(valid_from_timezone), valid_to_timezone: JSON.stringify(valid_to_timezone), reported_status: "queue", persona: JSON.stringify(persona) }


  return await axios
    .post(`${API_BASE_URL}/engage/delete-engage-site-promo-code`, data, headerConfigPassed)
    .then(async (res) => {
      await axios
        .post(`${API_BASE_URL}/engage/delete-engage-persona-promo-codes`, { id: parseInt(data.id), site_id: parseInt(data.site_id) }, headerConfigPassed)
        .then((res) => {
          return res.data.data;
        })
        .catch(err => {
          return err;
        })
    })
    .catch(err => {
      return err;
    })
};

export const deleteEngageSitePersonaPromoCode = async (data, headerConfigPassed) => {
  await axios
    .post(`${API_BASE_URL}/engage/delete-engage-persona-promo-codes`, { id: parseInt(data.id), site_id: parseInt(data.site_id) }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};


export const getEngageSplitClientHistory = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage-split-client-history`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};




export const getEngagePersonaDuringSizeOFGroup = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/getEngagePersonaDuringSizeOFGroup`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const getEngageWhyNotSplit = async ({ siteIdInput }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage-whynot-split-client-history`, { "site_id": parseInt(siteIdInput) }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const getCouponQualityMetrics = async ({ siteIdInput, startDate, endDate, shopperShortCode }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/getCouponQualityMetrics`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate, "shopperShortCode": shopperShortCode }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const getEngageWrongCouponSplit = async ({ siteIdInput }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage-wrong-coupon-client-history`, { "site_id": parseInt(siteIdInput) }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const getEngageHesitantShopperSplit = async ({ siteIdInput }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage-hesitant-shopper-client-history`, { "site_id": parseInt(siteIdInput) }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const getEngageCouponRunnerSplit = async ({ siteIdInput }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage-coupon-runner-client-history`, { "site_id": parseInt(siteIdInput) }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const getEngagePremiumProductSplit = async ({ siteIdInput }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage-premium-product-client-history`, { "site_id": parseInt(siteIdInput) }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const getEngageExtensionTriggerSplit = async ({ siteIdInput }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage-extension-trigger-client-history`, { "site_id": parseInt(siteIdInput) }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const getEngagePersonaSettings = async ({ siteIdInput, persona_id }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage-persona-coupon-settings`, { "site_id": parseInt(siteIdInput), "persona_id": parseInt(persona_id) }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const addEngagePersonaCouponSettings = async ({ site_id, persona_id, coupon_message, status }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/add-engage-persona-coupon-settings`, { "site_id": parseInt(site_id), "persona_id": parseInt(persona_id), "coupon_message": coupon_message, "status": status }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const updateEngagePersonaCouponSettings = async ({ site_id, persona_id, id }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/update-engage-persona-coupon-settings`, { "site_id": parseInt(site_id), "persona_id": parseInt(persona_id), "id": parseInt(id) }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};



export const getWCSessionHijackSourceFlow = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/getWCSessionHijackSourceFlow`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const getDuringAndPostWCSessionHijackSourceFlow = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/getDuringAndPostWCSessionHijackSourceFlow`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const getEPRSessionHijackSourceFlow = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/getEPRSessionHijackSourceFlow`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const getDuringAndPostEPRSessionHijackSourceFlow = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/getDuringAndPostEPRSessionHijackSourceFlow`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};
export const getEEISessionHijackSourceFlow = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/getEEISessionHijackSourceFlow`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const getDuringAndPostEEISessionHijackSourceFlow = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/getDuringAndPostEEISessionHijackSourceFlow`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};
export const getMTDReportClients = async ({ siteIdInput, startDate, endDate, webAccountId }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/getMTDReportClients`, { site_id: siteIdInput, start_date: startDate, end_date: endDate, web_account_id: webAccountId }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const sendMTDReportEmail = async (emailReportData, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/sendMTDReportEmail`, emailReportData, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const updateReportApprove = async (reportData, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/report/updateReportApprove`, reportData, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};


export const getMTDReportClientEmails = async (web_account_id, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/getMTDReportClientEmails`, {web_account_id}, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};