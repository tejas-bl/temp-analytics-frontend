export const ON_WEBSITE_RECORD_CHANGE = "websiteReducer/ON_WEBSITE_RECORD_CHANGE";
export const SET_WEBSITE_RECORDS = "websiteReducer/SET_WEBSITE_RECORDS";
export const SET_PERSONA_RECORDS = "websiteReducer/SET_PERSONA_RECORDS";
export const ON_DASHBOARD_DATE_CHANGE = "websiteReducer/ON_DASHBOARD_DATE_CHANGE";
export const SET_DASHBOARD_LOADING = "websiteReducer/SET_DASHBOARD_LOADING";


export const websiteRecordAction = (val) => (disptch) => {
  disptch({
    type: ON_WEBSITE_RECORD_CHANGE,
    payload: val,
  });
};

export const setWebsiteRecordsAction = (val) => (disptch) => {
  disptch({
    type: SET_WEBSITE_RECORDS,
    payload: val,
  });
};
export const setPersonaRecordsAction = (val) => (disptch) => {
  disptch({
    type: SET_PERSONA_RECORDS,
    payload: val,
  });
};


export const setDashboardDateRange = (val) => (disptch) => {
  disptch({
    type: ON_DASHBOARD_DATE_CHANGE,
    payload: val,
  });
};

export const setDashboardLoading = (val) => (disptch) => {
  disptch({
    type: SET_DASHBOARD_LOADING,
    payload: val,
  });
};

