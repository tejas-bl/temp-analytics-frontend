import axios from "axios";
import { API_BASE_URL } from "..";

  export const getShieldDashboardData = async ({siteIdInput, startDate, endDate}, headerConfigPassed) => {
    return await axios
    .post(`${API_BASE_URL}/getAnalyticsForShield`, {"site_id": siteIdInput,"start_date": startDate, "end_date": endDate}, headerConfigPassed)
    .then((res)=>{
        if(res.data.data.statuscode !== 200){
            return res.data.data;
        }else{
            return res.data.data;
        }
    })
    .catch(err => {
     return err;
    })
  };
  
  export const getShieldGAData = async ({siteIdInput, startDate, endDate}, headerConfigPassed) => {
    return await axios
    .post(`${API_BASE_URL}/shield/ga-data`, {"site_id": parseInt(siteIdInput),"start_date": startDate, "end_date": endDate}, headerConfigPassed)
    .then((res)=>{
      return res.data.data;
    })
    .catch(err => {
     return err;
    })
  };
    
  export const getListeningPhaseIndustryStd = async ({siteIdInput}, headerConfigPassed) => {
    return await axios
    .post(`${API_BASE_URL}/shield/listeningPhaseIndustryStd`, {"site_id": parseInt(siteIdInput)}, headerConfigPassed)
    .then((res)=>{
      return res.data.data;
    })
    .catch(err => {
     return err;
    })
  };
  
  export const getShieldYTD = async ({siteIdInput, startDate, endDate}, splitDates, headerConfigPassed) => {
    return await axios
    .post(`${API_BASE_URL}/shield/ytd-data`, {"site_id": parseInt(siteIdInput),"start_date": startDate, "end_date": endDate, "split_date": splitDates}, headerConfigPassed)
    .then((res)=>{
      return res.data.data;
    })
    .catch(err => {
     return err;
    })
  };
  
  export const getPostPhaseAdwareShopperData = async ({siteIdInput, startDate, endDate}, headerConfigPassed) => {
    return await axios
    .post(`${API_BASE_URL}/engage/getPostPhaseAdwareShopperData`, {"site_id": parseInt(siteIdInput),"start_date": startDate, "end_date": endDate}, headerConfigPassed)
    .then((res)=>{
      return res.data.data;
    })
    .catch(err => {
     return err;
    })
  };
  
  export const getTopInjectionTypes = async ({siteIdInput, startDate, endDate}, headerConfigPassed) => {

    return await axios
    .post(`${API_BASE_URL}/shield/top-injection-types`, {"site_id": parseInt(siteIdInput),"start_date": startDate, "end_date": endDate}, headerConfigPassed)
    .then((res)=>{
      return res.data.data;
    })
    .catch(err => {
     return err;
    })
  };
    
  export const getTopCompetitorsAdvertising = async ({siteIdInput, startDate, endDate}, headerConfigPassed) => {

    return await axios
    .post(`${API_BASE_URL}/shield/top-competitors-advertising`, {"site_id": parseInt(siteIdInput),"start_date": startDate, "end_date": endDate}, headerConfigPassed)
    .then((res)=>{
      return res.data.data;
    })
    .catch(err => {
     return err;
    })
  };
  
  export const getTopCompetitorsProducts = async ({siteIdInput, startDate, endDate}, headerConfigPassed) => {

    return await axios
    .post(`${API_BASE_URL}/shield/top-competitors-products`, {"site_id": parseInt(siteIdInput),"start_date": startDate, "end_date": endDate}, headerConfigPassed)
    .then((res)=>{
      return res.data.data;
    })
    .catch(err => {
     return err;
    })
  };
  
  export const getTopMaliciousPages = async ({siteIdInput, startDate, endDate}, headerConfigPassed) => {
    return await axios
    .post(`${API_BASE_URL}/shield/top-malicious-pages`, {"site_id": parseInt(siteIdInput),"start_date": startDate, "end_date": endDate}, headerConfigPassed)
    .then((res)=>{
      return res.data.data;
    })
    .catch(err => {
     return err;
    })
  };
  export const getTopMaliciousScripts = async ({siteIdInput, startDate, endDate}, headerConfigPassed) => {
    return await axios
    .post(`${API_BASE_URL}/shield/top-malicious-scripts`, {"site_id": parseInt(siteIdInput),"start_date": startDate, "end_date": endDate}, headerConfigPassed)
    .then((res)=>{
      return res.data.data;
    })
    .catch(err => {
     return err;
    })
  };
    
  export const getWebsitesRecord = async (refreshToken, headerConfigPassed) => {

    const webRecord = await axios
    .post(`${API_BASE_URL}/shield/websites-record`, {refreshToken: refreshToken}, headerConfigPassed)
    .then((res)=>{
      return res.data.data;
    })
    .catch(err => {
     return err;
    })
    return webRecord;
  };
      
  export const getWebsitesRecordById = async (id, headerConfigPassed) => {
    return await axios
    .get(`${API_BASE_URL}/shield/websites-record-by-id/${id}`, headerConfigPassed)
    .then((res)=>{
      return res.data.data;
    })
    .catch(err => {
     return err;
    })
  };
  