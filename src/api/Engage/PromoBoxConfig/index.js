import axios from "axios";
import { API_BASE_URL } from "../..";
import { headerConfig } from "../../authentication";
 
  export const getPromoBoxConfigData = async () => {
    return await axios
    .get(`${API_BASE_URL}/promo-box-configs`, headerConfig)
    .then((res)=>{
        return res.data;
    })
    .catch(err => {
     return err;
    })
  };
  
  
  export const addPromoBoxConfigData = async ({...values}) => {
    const data = {...values, created_on: new Date()};
    return await axios
    .post(`${API_BASE_URL}/promo-box-configs`, data, headerConfig)
    .then((res)=>{
            return res;
    })
    .catch(err => {
     return err;
    })
  };


   
  export const updatePromoBoxConfigData = async ({...values}) => {

    const data = {...values, modified_on: new Date()};
    return await axios
    .patch(`${API_BASE_URL}/promo-box-configs/${values.id}`, data, headerConfig)
    .then((res)=>{
      return res;
    })
    .catch(err => {
     return err;
    })
  };


  export const deletePromoBoxConfigData = async (id) => {
    return await axios
    .delete(`${API_BASE_URL}/promo-box-configs/${id}`, headerConfig)
    .then((res)=>{
      return res;
    })
    .catch(err => {
     return err;
    })
  };
     