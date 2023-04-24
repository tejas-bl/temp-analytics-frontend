import axios from "axios";
import { API_BASE_URL } from "../..";
import { headerConfig } from "../../authentication";

export const getPromoCodeData = async ({siteIdInput}, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/getengage-site-promo-codes`, {"site_id": parseInt(siteIdInput)}, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};



export const addPromoCodeData = async ({ persona, ...values }) => {
  const data = {...values, created_on: new Date()}
  return await axios
    .post(`${API_BASE_URL}/engage-promo-codes`, data, headerConfig)
    .then((res) => {
      return res;
    })
    .catch(err => {
      return err;
    })
};


export const updatePromoCodeData = async ({persona, ...values }) => {
  const data = {...values, modified_on: new Date()};

  return await axios
    .post(`${API_BASE_URL}/engage/updateengage-site-promo-code`, data, headerConfig)
    .then((res) => {
      return res;
    })
    .catch(err => {
      return err;
    })
};


export const deletePromoCodeData = async (id) => {
  return await axios
    .delete(`${API_BASE_URL}/engage-promo-codes/${id}`, headerConfig)
    .then(async(res) => {
      await axios
        .delete(`${API_BASE_URL}/engage-persona-promo-codes/promo_code_id/${id}`, headerConfig)
        .then((res) => {
          return res;
        })
        .catch(err => {
          return err;
        })
    })
    .catch(err => {
      return err;
    })
};

export const addPersonaPromoCode = async (data) => {
  return await axios
    .post(`${API_BASE_URL}/engage-persona-promo-codes`, data, headerConfig)
    .then((res) => {
      return res;
    })
    .catch(err => {
      return err;
    })
};


export const updatePersonaPromoCode = async (data) => {

  // Delete the Row


  // Insert the row
  return await axios
    .post(`${API_BASE_URL}/engage-persona-promo-codes`, data, headerConfig)
    .then((res) => {
      return res;
    })
    .catch(err => {
      return err;
    })
};


export const deletePersonaPromoCode = async (id) => {
  return await axios
    .delete(`${API_BASE_URL}/engage-persona-promo-codes/promo_code_id/${id}`, headerConfig)
    .then((res) => {
      return res;
    })
    .catch(err => {
      return err;
    })
};



export const getPersonaPromoCode = async ({siteIdInput, promoCodeId}, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/engage/getengage-persona-promo-codes`, {"site_id": parseInt(siteIdInput), "promo_code_id": parseInt(promoCodeId)}, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};


export const getCouponsMappedtoPersona = async ({siteIdInput}, headerConfigPassed) => {

  return await axios
    .post(`${API_BASE_URL}/engage/get-coupons-mapped-to-persona`, {"site_id": parseInt(siteIdInput)}, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};
