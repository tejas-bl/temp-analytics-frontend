import axios from "axios";
import { API_BASE_URL } from "../..";

export const getClientHistory = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/client-history`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};
export const getSplitClientHistory = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/split-client-history`, { "site_id": parseInt(siteIdInput), "start_date": startDate, "end_date": endDate }, headerConfigPassed)
    .then((res) => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    })
};

export const getUsers = async (headerConfigPassed) => {
  return await axios
    .get(`${API_BASE_URL}/users/all`, headerConfigPassed)
    .then((res) => {
      return res.data;
    })
    .catch(err => {
      return err.response;
    })
};

export const createUser = async (data, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/users`, data, headerConfigPassed)
    .then((res) => {
      return res.data;
    })
    .catch(err => {
      return err;
    })
};

export const updateUsers = async (data, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/users/update`, data, headerConfigPassed)
    .then((res) => {
      return res.data;
    })
    .catch(err => {
      return err;
    })
};

export const deleteUser = async (id, headerConfigPassed) => {
  return await axios
    .delete(`${API_BASE_URL}/users/delete/${id}`, headerConfigPassed)
    .then((res) => {
      return res.data;
    })
    .catch(err => {
      return err;
    })
};

export const editUserProfile = async (data, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/users/editProfile`, data, headerConfigPassed)
    .then((res) => {
      return res.data;
    })
    .catch(err => {
      return err;
    })
};


export const getExistingAnalyticsClientDetails = async ({ siteIdInput }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/analytics/getExistingAnalyticsClientDetails`, { "site_id": parseInt(siteIdInput) }, headerConfigPassed)
    .then((res) => {
      return res.data;
    })
    .catch(err => {
      return err.response;
    })
};


export const getAnalytics = async ({ siteIdInput }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/analytics/all`, { "site_id": parseInt(siteIdInput) }, headerConfigPassed)
    .then((res) => {
      return res.data;
    })
    .catch(err => {
      return err.response;
    })
};

export const createAnalytics = async (data, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/analytics/addAnalytics`, data, headerConfigPassed)
    .then((res) => {
      return res.data;
    })
    .catch(err => {
      return err;
    })
};

export const updateAnalytics = async (data, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/analytics/updateAnalytics`, data, headerConfigPassed)
    .then((res) => {
      return res.data;
    })
    .catch(err => {
      return err;
    })
};
export const deleteAnalytics = async (data, headerConfigPassed) => {
  console.log(data)
  return await axios
    .post(`${API_BASE_URL}/analytics/deleteAnalytics`, data, headerConfigPassed)
    .then((res) => {
      return res.data;
    })
    .catch(err => {
      return err;
    })
};