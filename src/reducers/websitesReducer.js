import { subDays } from "date-fns";
import {
    ON_WEBSITE_RECORD_CHANGE,
    SET_WEBSITE_RECORDS,
    SET_PERSONA_RECORDS,
    ON_DASHBOARD_DATE_CHANGE,
    SET_DASHBOARD_LOADING
} from "../actions/websitesAction";

import { getWebsiteData, setWebsiteData, getCurrentUser } from "../helper/Utils";

const websiteData = getWebsiteData();
let sessionClient = {};

sessionClient = { websiteLoading: true, web_id: 0, currency: 'USD' }
if (websiteData !== undefined && websiteData !== null) {
    let dummyClient = websiteData.find(item => item.web_url === "myclothing.com")
    sessionClient = { web_id: dummyClient !== null ? dummyClient.web_id : 0, currency: websiteData !== null && websiteData.length > 0 && dummyClient.currency !== undefined && dummyClient.currency !== null && dummyClient.currency !== 'select' ? dummyClient.currency : 'USD', web_account_id: 508 }
}
let initialState = {
    websiteRecord: [],
    sessionClient,
    websiteLoading: true,
    dashboardStartDate: subDays(new Date(), 120),
    dashboardEndDate: subDays(new Date(), 30),
    shopperRecord: {
        'wc': 'Wrong Coupon',
        'ti3': 'Hesitant Shopper',
        'e-ei': 'Extension Shopper',
        'epr': 'Coupon Runner Shopper',
        'cs': 'Wishlist Shopper',
        'shield': 'Hijacked Shopper'
    }
}

const websiteRecordReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_WEBSITE_RECORDS: {
            setWebsiteData(action.payload);
            let user = getCurrentUser();
            let sessionClient = [];
            if (user.data.data.roles === 'superadmin' || user.data.data.roles === 'admin') {
                if (user.data.data.web_account_id === 0) {
                    sessionClient = action.payload.find(item => item.web_url === "myclothing.com")
                } else {
                    sessionClient = action.payload[0]
                }
            } else {
                sessionClient = action.payload[0]
            }
            return {
                ...state,
                websiteRecord: action.payload,
                sessionClient: sessionClient,
                websiteLoading: false
            };
        }
        case SET_PERSONA_RECORDS: {
            let shopperData = {}
            action.payload.map((shopper) => {
                shopperData[shopper.short_code] = shopper.name
            })
            return {
                ...state,
                shopperRecord: shopperData
            };
        }
        case ON_WEBSITE_RECORD_CHANGE: {
            return {
                ...state,
                sessionClient: action.payload,
            };
        }
        case ON_DASHBOARD_DATE_CHANGE: {
            return {
                ...state,
                dashboardStartDate: action.payload.startDate,
                dashboardEndDate: action.payload.endDate
            }
        }
        case SET_DASHBOARD_LOADING: {
            return {
                ...state,
                websiteLoading: action.payload,
            }
        }
        default:
            return {
                websiteRecord: state.websiteRecord,
                sessionClient: state.sessionClient,
                websiteLoading: state.websiteLoading,
                shopperRecord: state.shopperRecord,
                dashboardStartDate: subDays(new Date(), 30),
                dashboardEndDate: subDays(new Date(), 0)
            }
    }
}



export default websiteRecordReducer;