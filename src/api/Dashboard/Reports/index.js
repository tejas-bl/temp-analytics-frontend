import axios from "axios";
import { API_BASE_URL } from "../..";

export const getClientReports = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/reports/getClientReports`, { site_id: siteIdInput }, headerConfigPassed)
    .then((res) => {
      return res.data;
    })
    .catch(err => {
      return err.response;
    })
};
export const getScreenshots = async ({ siteIdInput, startDate, endDate }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/reports/getScreenshots`, { site_id: siteIdInput }, headerConfigPassed)
    .then((res) => {
      return res.data;
    })
    .catch(err => {
      return err.response;
    })
};
export const getShopperScreenshotsCount = async ({ siteIdInput, screenshotType, reportType }, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/reports/getShopperScreenshotsCount`, { site_id: siteIdInput, screenshot_type: screenshotType, report_type: reportType }, headerConfigPassed)
    .then((res) => {
      return res.data;
    })
    .catch(err => {
      return err.response;
    })
};
export const checkClientReportExist = async (data, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/reports/checkClientReportExist`, data, headerConfigPassed)
    .then((res) => {
      return res.data;
    })
    .catch(err => {
      return err.response;
    })
};

export const createReport = async (data, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/report/createReport`, data, headerConfigPassed)
    .then((res) => {
      return res.data;
    })
    .catch(err => {
      return err;
    })
};

export const uploadScreenshot = async (data, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/report/uploadScreenshot`, data, headerConfigPassed)
    .then((res) => {
      return res.data;
    })
    .catch(err => {
      return err;
    })
};

export const updateScreenshot = async (data, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/report/updateScreenshot`, data, headerConfigPassed)
    .then((res) => {
      return res.data;
    })
    .catch(err => {
      return err;
    })
};

export const deleteReport = async (data, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/reports/deleteClientReport`, data, headerConfigPassed)
    .then((res) => {
      return res.data;
    })
    .catch(err => {
      return err;
    })
};
export const deleteScreenshot = async (data, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/reports/deleteScreenshot`, data, headerConfigPassed)
    .then((res) => {
      return res.data;
    })
    .catch(err => {
      return err;
    })
};
export const getShopperTopData = async (data, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/reports/getShopperTopData`, { "query" : data }, headerConfigPassed)
    .then((res) => {
      return res.data;
    })
    .catch(err => {
      return err;
    })
};


export const createAllReport = async (data, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/report/createAllReport`, data, headerConfigPassed)
    .then((res) => {
      return res.data;
    })
    .catch(err => {
      return err;
    })
};
export const getAllClientsSalesReportData = async (data, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/reports/getAllClientsSalesReportData`, data, headerConfigPassed)
    .then((res) => {
      return res.data;
    })
    .catch(err => {
      return err;
    })
};

export const getAllClientsShopperGroupOverviewData = async (data, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/reports/getAllClientsShopperGroupOverviewData`, data, headerConfigPassed)
    .then((res) => {
      return res.data;
    })
    .catch(err => {
      return err;
    })
};

export const getAllClientsShopperGroupAllData = async (data, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/reports/getAllClientsShopperGroupAllData`, data, headerConfigPassed)
    .then((res) => {
      return res.data;
    })
    .catch(err => {
      return err;
    })
};

export const getPersonaSplitDateData = async (data, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/reports/getPersonaSplitDateData`, data, headerConfigPassed)
    .then((res) => {
      return res.data;
    })
    .catch(err => {
      return err;
    })
};

export const getShopperGroupMonthwiseData = async (data, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/reports/getShopperGroupMonthwiseData`, data, headerConfigPassed)
    .then((res) => {
      return res.data;
    })
    .catch(err => {
      return err;
    })
};

export const getShopperGroupWeekwiseData = async (data, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/reports/getShopperGroupWeekwiseData`, data, headerConfigPassed)
    .then((res) => {
      return res.data;
    })
    .catch(err => {
      return err;
    })
};
export const getShopperGroupDaywiseData = async (data, headerConfigPassed) => {
  return await axios
    .post(`${API_BASE_URL}/reports/getShopperGroupDaywiseData`, data, headerConfigPassed)
    .then((res) => {
      return res.data;
    })
    .catch(err => {
      return err;
    })
};
