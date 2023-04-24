import axios from "axios";
import { API_BASE_URL } from "../..";
import { headerConfig } from "../../authentication";

export const getPromoBoxData = async () => {
  return await axios
    .get(`${API_BASE_URL}/engage-persona-promo-boxes`, headerConfig)
    .then((res) => {
      return res.data;
    })
    .catch(err => {
      return err;
    })
};

export const addPromoBoxData = async ({
  site_id,
  persona_id,
  heading,
  sub_heading,
  footer,
  status,
  message,
  promo_code,
  platform,
  is_active,
  remarks
 }) => {

  return await axios
    .post(`${API_BASE_URL}/engage-persona-promo-boxes`, {
      site_id,
      persona_id: parseInt(persona_id),
      heading,
      sub_heading,
      footer,
      status,
      message,
      promo_code,
      platform,
      is_active,
      remarks, 
      created_on: new Date() }, headerConfig)
    .then((res) => {
      return res;
    })
    .catch(err => {
      return err;
    })
};


export const updatePromoBoxData = async ({
  id,
  site_id,
  persona_id,
  heading,
  sub_heading,
  footer,
  status,
  message,
  promo_code,
  platform,
  is_active,
  remarks
}) => {
  return await axios
    .patch(`${API_BASE_URL}/engage-persona-promo-boxes/${id}`, { 
      site_id,
      persona_id: parseInt(persona_id),
      heading,
      sub_heading,
      footer,
      status,
      message,
      promo_code,
      platform,
      is_active,
      remarks, 
      modified_on: new Date() }, headerConfig)
    .then((res) => {
      return res;
    })
    .catch(err => {
      return err;
    })
};


export const deletePromoBoxData = async (id) => {
  return await axios
    .delete(`${API_BASE_URL}/engage-persona-promo-boxes/${id}`, headerConfig)
    .then((res) => {
      return res;
    })
    .catch(err => {
      return err;
    })
};
