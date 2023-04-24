import axios from "axios";
import { API_BASE_URL } from "../..";
import { headerConfig } from "../../authentication";
 
  export const getPersonaData = async () => {
    return await axios
    .get(`${API_BASE_URL}/engage-personas`, headerConfig)
    .then((res)=>{
        return res.data;
    })
    .catch(err => {
     return err;
    })
  };
  
  
  export const addPersonaData = async ({name, short_code, remarks}) => {
    return await axios
    .post(`${API_BASE_URL}/engage-personas`, {name, short_code, remarks, created_on : new Date()}, headerConfig)
    .then((res)=>{
            return res;
    })
    .catch(err => {
     return err;
    })
  };


   
  export const updatePersonaData = async ({id, name, short_code, remarks}) => {
    return await axios
    .patch(`${API_BASE_URL}/engage-personas/${id}`, {name, short_code, remarks, modified_on : new Date()}, headerConfig)
    .then((res)=>{
      return res;
    })
    .catch(err => {
     return err;
    })
  };


  export const deletePersonaData = async (id) => {
    return await axios
    .delete(`${API_BASE_URL}/engage-personas/${id}`, headerConfig)
    .then((res)=>{
      return res;
    })
    .catch(err => {
     return err;
    })
  };
     