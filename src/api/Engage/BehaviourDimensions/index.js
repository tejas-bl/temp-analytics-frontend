import axios from "axios";
import { API_BASE_URL } from "../..";
import { headerConfig } from "../../authentication";
 
  export const getBehaviourDimensionsData = async () => {
    return await axios
    .get(`${API_BASE_URL}/engage-behaviour-dimensions`, headerConfig)
    .then((res)=>{
        return res.data;
    })
    .catch(err => {
     return err;
    })
  };
  
  
  export const addBehaviourDimensionsData = async (values) => {

    const insertBehaviourDimensions = {
      name: values.name,
      code: values.code,
      remarks: (values.remarks !== "") ?  values.remarks : "",
      created_on : new Date()
    }

    return await axios
    .post(`${API_BASE_URL}/engage-behaviour-dimensions`, insertBehaviourDimensions, headerConfig)
    .then((res)=>{
            return res;
    })
    .catch(err => {
     return err;
    })
  };


   
  export const updateBehaviourDimensionsData = async (values) => {

    
    const updateBehaviourDimensions = {
      name: values.name,
      code: values.code,
      remarks: (values.remarks !== "") ?  values.remarks : "",
      modified_on : new Date()
    }

    return await axios
    .patch(`${API_BASE_URL}/engage-behaviour-dimensions/${values.id}`, updateBehaviourDimensions, headerConfig)
    .then((res)=>{
      return res;
    })
    .catch(err => {
     return err;
    })
  };


  export const deleteBehaviourDimensionsData = async (id) => {
    return await axios
    .delete(`${API_BASE_URL}/engage-behaviour-dimensions/${id}`, headerConfig)
    .then((res)=>{
      return res;
    })
    .catch(err => {
     return err;
    })
  };
     

  export const getBehaviourDimensionById = async (id) => {
    return await axios
    .get(`${API_BASE_URL}/engage-behaviour-dimensions/${id}`, headerConfig)
    .then((res)=>{
        return res.data;
    })
    .catch(err => {
     return err;
    })
  };
  