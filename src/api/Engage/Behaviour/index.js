import axios from "axios";
import { API_BASE_URL } from "../..";
import { headerConfig } from "../../authentication";
 
  export const getBehaviourData = async () => {

    return await axios
    .get(`${API_BASE_URL}/engage-behaviours`, headerConfig)
    .then((res)=>{
        return res.data;
    })
    .catch(err => {
     return err;
    })
  };
  
  
  export const addBehaviourData = async (data) => {

    const behaviourData = {
      behaviour: data.behaviour, 
      definition: data.definition, 
      behaviour_dimension_id: parseInt(data.behaviourDimensions), 
      operator: data.operator, 
      value: data.value, 
      platform: data.platform, 
      remarks: data.remarks,
      created_on : new Date()
    };
    return await axios
    .post(`${API_BASE_URL}/engage-behaviours`, behaviourData, headerConfig)
    .then((res)=>{
            return res;
    })
    .catch(err => {
     return err;
    })
  };


   
  export const updateBehaviourData = async (data) => {

    const behaviourData = {
      behaviour: data.behaviour, 
      definition: data.definition, 
      behaviour_dimension_id: parseInt(data.behaviourDimensions), 
      operator: data.operator, 
      value: data.value, 
      platform: data.platform, 
      remarks: data.remarks,
      modified_on : new Date()
    };

    return await axios
    .patch(`${API_BASE_URL}/engage-behaviours/${data.id}`, behaviourData, headerConfig)
    .then((res)=>{
      return res;
    })
    .catch(err => {
     return err;
    })
  };


  export const deleteBehaviourData = async (id) => {
    return await axios
    .delete(`${API_BASE_URL}/engage-behaviours/${id}`, headerConfig)
    .then((res)=>{
      return res;
    })
    .catch(err => {
     return err;
    })
  };
     
