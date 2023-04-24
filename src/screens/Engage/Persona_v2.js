import React from "react";
import { connect } from "react-redux";
import LogoiCON from "../../assets/images/logo-icon.svg";
import coupon_runner_alt from "../../assets/images/engage/persona/coupon_runner_alt.png";
import why_not_shopper_alt from "../../assets/images/engage/persona/why_not_shopper_alt.png";
import adware_shopper_alt from "../../assets/images/engage/persona/adware_shopper_alt.png";
import wrong_coupon_alt from "../../assets/images/engage/persona/wrong_coupon_alt.png";
import hesitant_shopper_alt from "../../assets/images/engage/persona/hesitant_shopper_alt.png";
import extension_shopper_alt from "../../assets/images/engage/persona/extension_shopper_alt.png";


import PageHeader from "../../components/PageHeader";
import {
    websiteRecordAction
} from "../../actions";


import PersonaListTable from "../../components/Engage/PersonaListTable";
import { adwareShopperOverviewCardData, couponRunnerOverviewCardData, extensionTriggerOverviewCardData, permiumShopperOverviewCardData, personaRecoveredRevData, ti3OverviewCardData, wcOverviewCardData, whyNotShopperOverviewCardData } from "../../Data/EngagePersonaData";
import PersonaRecoveredRevenue from "../../components/Engage/PersonaRecoveredRevenue";
import PersonaDetailCard_v2 from "../../components/Engage/PersonaDetailCard_v2";
import { getListeningPhaseIndustryStd, getPostPhaseAdwareShopperData, getShieldGAData, getShieldYTD, getTopInjectionTypes, getTopMaliciousPages, getTopMaliciousScripts, getWebsitesRecordById } from "../../api/shieldDashboard";
import { convertDateTOLocale, convertNumbertoCurrencyFormat, getCurrencySymbol, getCurrentUser, sendGAHit } from "../../helper/Utils";
import {
    getEngagePersona, getEngagePersonaCoupon,
    getEngagePersonaMetricsHesitantShopper,
    getEngagePersonaMetricsWC_EEI_CR,
    getEngagePersonaMetricsDuring,
    getEngagePersonaMetricsWhyNotShopper,
    getEngagePersonaWhynot_During,
    getEngagePersonaDuringSizeOFGroup,
    getEngageWhyNotSplit,
    getEngagePremiumProductSplit,
    getEngageCouponRunnerSplit,
    getEngageHesitantShopperSplit,
    getEngageWrongCouponSplit,
    getEngageExtensionTriggerSplit,
    getEngagePersonaSettings,
    getEngageTopCodes,
    getEngageTopPublisherWc,
    getCouponUsed,
    getCheckoutPageConversionRate,
    getExtensionShopperRecycledAffiliateSessions,
    getEngageWhynotPrePhasePersonaImpact,
    getEngagePrePhasePersonaImpactDayCount,
    getEngageWrongCouponPrePhasePersonaImpact,
    getEngageExtensionPrePhasePersonaImpact,
    getEngageCouponRunnerPrePhasePersonaImpact,
    getEngagePrePhaseWhyNotPersonaImpactDayCount,
    getEngagePrePhaseHesitantPersonaImpactDayCount,
    geteEngageConsolidateRevenue,
    getEngageTop5CouponsCashback,
    getEngageTopCouponsCashback,
    getWCSessionHijackSourceFlow,
    getEPRSessionHijackSourceFlow,
    getEEISessionHijackSourceFlow,
    getDuringAndPostEEISessionHijackSourceFlow,
    getDuringAndPostEPRSessionHijackSourceFlow,
    getDuringAndPostWCSessionHijackSourceFlow,
    getPublisherBreakdownByUserType,
    getExtensionShopperTopCouponsCashback,
    getHesitantShopperTopDropoffPages,
    getHesitantShopperTriggerTimings,
    getCouponQualityMetrics,
    getPostPhaseShoppersMetricsData
} from "../../api/Engage/OldDB";
import { differenceInDays, subDays } from "date-fns";
import DateRange from "../../helper/DateRange";
import ShieldDateRange from "../../helper/DateRangeWithSplit";
import Loader from "../../helper/Loader";
import PdfDownloader from "../../helper/PdfDownloader";
import { processCRPersonaMetricsResult, processEEIPersonaMetricsResult, processHesitantPersonaMetricsResult, processWCPersonaMetricsResult, processWCPersonaMetricsResultDuring, processPersonaMetricsResultPost, processWhyNotPersonaMetricsResult, processIneligibleShopper } from "../../helper/Engage";
import { onPressSideMenuTab } from '../../actions';
import { Checkout_Page_Conversion_Rate_Column, Coupon_Used_Column, Engage_Coupon_Quality_Metrics_Columns, Engage_EEI_Recycle_Affiliate_Sessions_Columns, Engage_EEI_Recycle_Publisher_Breakdown_Columns, Engage_Insights_Cashback_percentage, Engage_Insights_Wrong_Coupon_affilate_Column, Engage_Insights_Wrong_Coupon_Data_Column, Extension_Shopper_Cashback_Coupons, Hesitant_Shopper_Trigger_Timing, Hesitant_Shopper_User_Drop_Off } from "../../helper/GetColumnsConfig";
import { getDataTableConfig } from "../../helper/GetDatatableConfig";
import { processPostPhaseShieldMetrics, processShieldMetrics, processShieldMetricsIndustryStd } from "../../helper/Shield";
import { getSplitClientHistory } from "../../api/Dashboard/OldDB";
import { Toast } from "react-bootstrap";

class Persona_v2 extends React.Component {
    personaId = null;
    constructor(props) {

        super(props);
        const searchParams = this.props.location.search;
        this.personaId = new URLSearchParams(searchParams).get("personaId");
        this.state = {
            loadPersonaDetails: false,
            singlePersonaData: {},
            singlePersonaPromoCodeData: {},
            singlePersonaPromoCodeDataLoading: true,
            message: '',
            siteIdInput: this.props.sessionClient.web_id,
            startDate: this.props.sessionClient.web_account_id != 508 ? subDays(new Date(), 31) : new Date('2022-12-01'),
            endDate: this.props.sessionClient.web_account_id != 508 ? subDays(new Date(), 2) : new Date('2022-12-31'),
            compareStartDate: subDays(new Date(), 60),
            compareEndDate: subDays(new Date(), 30),
            personaRecoveredRevState: [],
            websiteRecordById: {},
            websiteRecordByIdLoading: true,
            impactRevenue: 0,
            impactRevenueLoading: true,
            personaDetailLoader: false,
            personaRowId: null,
            personaDetailMessage: <div className="text-center"><span className="badge personaDetailMessage">Click a Persona to display it's Details</span></div>,
            currentPersonaId: null,
            personaMetricsResultLoading: false,
            engagePersonaList: {},
            engagePersonaListLoading: true,
            updatedEngagePersonaList: [],
            updatedEngagePersonaListLoading: true,
            metricsData: {},
            metricsDataLoading: true,
            sitePhase: "",
            loading: {
                status: true,
                message: "loading"
            },
            engagePersonaSplitList: [],
            splitDateRangeData: {},
            splitDateRangeDataLoading: true,
            engagePersonaMessages: [],

            engageTopCodesData: [],
            engageTopCodesDataIsLoading: true,
            engageTopPublisherWcData: [],
            engageTopPublisherWcDataIsLoading: true,
            couponUsedData: [],
            couponUsedDataIsLoading: true,
            checkoutPageConversionRateData: [],
            checkoutPageConversionRateDataIsLoading: true,
            recycleAffilaiteSessionsEEI: {},
            isRecycleAffilaiteSessionsEEILoading: true,
            newcouponcashbackpercentage: {},
            isnewCouponCashbackPercentageLoading: true,
            extensionShopperCashbackCoupons: {},
            extensionShopperCashbackCouponsLoading: true,
            extensionPublisherBreakdownData: {},
            extensionPublisherBreakdownDataLoading: true,
            indStdRevenue30Days: null,
            indStdRevenue30DaysIsLoading: true,
            engageTopCouponsCashbackData: [],
            engageTopCouponsCashbackDataIsLoading: true,
            activeStartDate: "",
            activeEndDate: "",
            isLiveSelected: false,
            isLiveSelectedLoading: true,
            adwareShopperABPerc: null,
            loadToaster: false,
            toasterMessage: null,
            topInjectionTypes: {},
            topInjectionTypesLoading: false,
            topMaliciousPages: {},
            topMaliciousPagesLoading: true,
            potentialRevenueTotal: 0,
            potentialRevenueTotalIsLoading: true,
        };
        this.downloadEngagePersonaDashboardRef = React.createRef();
        this.handlePersonaDetails = this.handlePersonaDetails.bind(this);
        this.handleDymaniDetailRoute = this.handleDymaniDetailRoute.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handlePersonaUpdates = this.handlePersonaUpdates.bind(this);
        this.handlePostPhasePersonaUpdates = this.handlePostPhasePersonaUpdates.bind(this);
        this.handlePrePhasePersonaUpdates = this.handlePrePhasePersonaUpdates.bind(this);
        this.handleSinglePersonaPromoCodeData = this.handleSinglePersonaPromoCodeData.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
    }

    setSiteInputsBasedOnWebAccountId(prevProps = null) {
        let siteInputs = {};
        if (this.props.sessionClient.web_account_id === 508) {
            this.setState({
                startDate: new Date('2022-12-01'),
                endDate: new Date('2022-12-31')
            })
            siteInputs = { siteIdInput: this.props.sessionClient.web_id, startDate: '2022-12-01', endDate: '2022-12-31' };
        } else if (prevProps !== null && prevProps.sessionClient.web_account_id === 508) {
            let startDate = subDays(new Date(), 31);
            let endDate = subDays(new Date(), 2);
            this.setState({
                startDate: startDate,
                endDate: endDate
            })
            siteInputs = { siteIdInput: this.props.sessionClient.web_id, startDate: convertDateTOLocale(startDate), endDate: convertDateTOLocale(endDate) };
        } else {
            siteInputs = { siteIdInput: this.props.sessionClient.web_id, startDate: convertDateTOLocale(this.state.startDate), endDate: convertDateTOLocale(this.state.endDate) };
        }

        return siteInputs;
    }
    async componentDidUpdate(prevProps) {
        if (prevProps.sessionClient.web_id !== this.props.sessionClient.web_id) {
            const searchParams = this.props.location.search;
            this.personaId = new URLSearchParams(searchParams).get("personaId");
            this.setState({
                loading: {
                    status: true,
                    message: "loading"
                },
                activeStartDate: "",
                activeEndDate: "",
                engageTopCodesDataIsLoading: true,
                engageTopPublisherWcDataIsLoading: true,
                isnewCouponCashbackPercentageLoading: true,
                websiteRecordByIdLoading: true,
                extensionShopperCashbackCouponsLoading: true,

            })
            const siteInputs = this.setSiteInputsBasedOnWebAccountId(prevProps)
            // const compareSiteInputs = { siteIdInput: this.props.sessionClient.web_id, startDate: convertDateTOLocale(this.state.compareStartDate), endDate: convertDateTOLocale(this.state.compareEndDate) };
            const headerConfigPassed = {
                headers: {
                    Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${getCurrentUser().data.data.refresh_token}`,
                }
            }

            getEngageTopCodes(siteInputs, headerConfigPassed).then(res => {
                // if (res.data && res.data.length !== 0) {
                this.createEngageWrongCouponDataTable(res.data);
                // }
            })
            getEngageTopPublisherWc(siteInputs, headerConfigPassed).then(res => {
                // if (res.data && res.data.length !== 0) {
                this.createEngageWrongCouponByAffilateDatatable(res.data);
                // }
            })

            getCouponUsed(siteInputs, headerConfigPassed).then(res => {
                // if (res.data && res.data.length !== 0) {
                this.createCouponUsedDataTable(res.data);
                // }
            })

            getCheckoutPageConversionRate(siteInputs, headerConfigPassed).then(res => {
                // if (res.data && res.data.length !== 0) {
                this.createCheckoutPageConversionRateDataTable(res.data);
                // }
            })


            getExtensionShopperRecycledAffiliateSessions(siteInputs, headerConfigPassed).then(res => {
                // if (res.data && res.data.length !== 0) {
                this.createExtensionShopperRecycledUserDataTable(res.data);
                // }
            })

            getEngageTopCouponsCashback(siteInputs, headerConfigPassed).then(res => {
                // if (res.data && res.data.length !== 0) {
                this.createEngageCashbackCouponDatatable(res.data);
                // }
            })

            getEngageTop5CouponsCashback(siteInputs, headerConfigPassed).then(res => {
                this.setState({
                    engageTopCouponsCashbackData: res.data,
                    engageTopCouponsCashbackDataIsLoading: false,
                })
            });

            getTopInjectionTypes(siteInputs, headerConfigPassed).then(getTopInjectionTypesData => {
                this.setState({
                    topInjectionTypes: getTopInjectionTypesData,
                    topInjectionTypesLoading: false,
                })
            });
            getTopMaliciousPages(siteInputs, headerConfigPassed).then(getTopMaliciousPagesData => {
                this.setState({
                    topMaliciousPages: getTopMaliciousPagesData,
                    topMaliciousPagesLoading: false,
                })
            });
            getExtensionShopperTopCouponsCashback(siteInputs, headerConfigPassed).then(res => {
                // if (res.data && res.data.length !== 0) {
                this.createExtensionShopperCashbackCouponDatatable(res.data);
                // }
            })

            this.handleSplitDateRange()
            const getWebsitesRecordByIdData = await getWebsitesRecordById(this.props.sessionClient.web_id, headerConfigPassed)


            this.setState({
                websiteRecordById: getWebsitesRecordByIdData.data[0],
                websiteRecordByIdLoading: false
            });

            let sitePhaseStatus = {
                name: "",
                id: null
            };
            if (getWebsitesRecordByIdData.data.length > 0) {
                if ((getWebsitesRecordByIdData.data[0].engage && getWebsitesRecordByIdData.data[0].engage_ab === false) || getWebsitesRecordByIdData.data[0].ab_status === true && getWebsitesRecordByIdData.data[0].ab_perc === 100) {
                    sitePhaseStatus = {
                        name: "Post Phase",
                        id: 1,
                        engageAnalytics: getWebsitesRecordByIdData.data[0].engage_analytics
                    }
                    await this.handlePostPhasePersonaUpdates(siteInputs, sitePhaseStatus, getWebsitesRecordByIdData.data[0].ab_perc);
                } else if ((getWebsitesRecordByIdData.data[0].engage && getWebsitesRecordByIdData.data[0].engage_ab) || (getWebsitesRecordByIdData.data[0].ab_status === true && getWebsitesRecordByIdData.data[0].ab_perc !== 100)) {
                    sitePhaseStatus = {
                        name: "POC Phase",
                        id: 0,
                        engageAnalytics: getWebsitesRecordByIdData.data[0].engage_analytics
                    }
                    await this.handlePersonaUpdates(siteInputs, sitePhaseStatus, getWebsitesRecordByIdData.data[0].ab_perc);
                } else if ((getWebsitesRecordByIdData.data[0].engage === false && getWebsitesRecordByIdData.data[0].engage_ab === false) || (getWebsitesRecordByIdData.data[0].ab_status === false || getWebsitesRecordByIdData.data[0].ab_status === null || getWebsitesRecordByIdData.data[0].ab_status === '')) {
                    sitePhaseStatus = {
                        name: "Pre Phase",
                        id: -1
                    }
                    await this.handlePrePhasePersonaUpdates(siteInputs, sitePhaseStatus, getWebsitesRecordByIdData.data[0].ab_perc);
                }
            }
            if (this.personaId) {
                await this.handlePersonaDetailRouting();
            }
        }
    }
    async componentDidMount() {
        window.scrollTo(0, 0);
        this.loadDataCard();

        this.props.onPressSideMenuTab(2);

        const headerConfigPassed = {
            headers: {
                Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${getCurrentUser().data.data.refresh_token}`,
            }
        }

        const { startDate, endDate } = this.state;
        const siteIdInput = this.props.sessionClient.web_id;
        const siteInputs = { siteIdInput, startDate: convertDateTOLocale(startDate), endDate: convertDateTOLocale(endDate) };

        const [getEngagePersonaData, getWebsitesRecordByIdData] = await Promise.all([
            getEngagePersona(headerConfigPassed),
            getWebsitesRecordById(this.props.sessionClient.web_id, headerConfigPassed),
        ])

        getEngageTopCodes(siteInputs, headerConfigPassed).then(res => {
            // if (res.data && res.data.length !== 0) {
            this.createEngageWrongCouponDataTable(res.data);
            // }
        })
        getEngageTopPublisherWc(siteInputs, headerConfigPassed).then(res => {
            // if (res.data && res.data.length !== 0) {
            this.createEngageWrongCouponByAffilateDatatable(res.data);
            // }
        })

        getCouponUsed(siteInputs, headerConfigPassed).then(res => {
            // if (res.data && res.data.length !== 0) {
            this.createCouponUsedDataTable(res.data);
            // }
        })

        getCheckoutPageConversionRate(siteInputs, headerConfigPassed).then(res => {
            // if (res.data && res.data.length !== 0) {
            this.createCheckoutPageConversionRateDataTable(res.data);
            // }
        })


        getExtensionShopperRecycledAffiliateSessions(siteInputs, headerConfigPassed).then(res => {
            // if (res.data && res.data.length !== 0) {
            this.createExtensionShopperRecycledUserDataTable(res.data);
            // }
        })

        getEngageTopCouponsCashback(siteInputs, headerConfigPassed).then(res => {
            // if (res.data && res.data.length !== 0) {
            this.createEngageCashbackCouponDatatable(res.data);
            // }
        })


        getEngageTop5CouponsCashback(siteInputs, headerConfigPassed).then(res => {
            this.setState({
                engageTopCouponsCashbackData: res.data,
                engageTopCouponsCashbackDataIsLoading: false,
            })
        });

        getTopInjectionTypes(siteInputs, headerConfigPassed).then(getTopInjectionTypesData => {
            this.setState({
                topInjectionTypes: getTopInjectionTypesData,
                topInjectionTypesLoading: false,
            })
        });
        getTopMaliciousPages(siteInputs, headerConfigPassed).then(getTopMaliciousPagesData => {
            this.setState({
                topMaliciousPages: getTopMaliciousPagesData,
                topMaliciousPagesLoading: false,
            })
        });
        getExtensionShopperTopCouponsCashback(siteInputs, headerConfigPassed).then(res => {
            // if (res.data && res.data.length !== 0) {
            this.createExtensionShopperCashbackCouponDatatable(res.data);
            // }
        })

        this.setState({
            personaRecoveredRevState: [...personaRecoveredRevData],
            engagePersonaList: getEngagePersonaData.data,
            engagePersonaListLoading: false,
            websiteRecordById: getWebsitesRecordByIdData.data[0],
            websiteRecordByIdLoading: false
        });
        this.handleSplitDateRange()
        // const getEngagePersonaData = await getEngagePersona(headerConfigPassed);
        // const getWebsitesRecordByIdData = await getWebsitesRecordById(siteInputs, headerConfigPassed)
        let sitePhaseStatus = {};
        if (getWebsitesRecordByIdData && getWebsitesRecordByIdData.hasOwnProperty('data') && getWebsitesRecordByIdData.data.length > 0) {
            if ((getWebsitesRecordByIdData.data[0].engage && getWebsitesRecordByIdData.data[0].engage_ab === false) || (getWebsitesRecordByIdData.data[0].ab_status === true && getWebsitesRecordByIdData.data[0].ab_perc === 100)) {
                sitePhaseStatus = {
                    name: "Post Phase",
                    id: 1,
                    engageAnalytics: getWebsitesRecordByIdData.data[0].engage_analytics
                }
                await this.handlePostPhasePersonaUpdates(siteInputs, sitePhaseStatus, getWebsitesRecordByIdData.data[0].ab_perc);
            } else if ((getWebsitesRecordByIdData.data[0].engage && getWebsitesRecordByIdData.data[0].engage_ab) || (getWebsitesRecordByIdData.data[0].ab_status === true && getWebsitesRecordByIdData.data[0].ab_perc !== 100)) {
                sitePhaseStatus = {
                    name: "POC Phase",
                    id: 0,
                    engageAnalytics: getWebsitesRecordByIdData.data[0].engage_analytics
                }
                await this.handlePersonaUpdates(siteInputs, sitePhaseStatus, getWebsitesRecordByIdData.data[0].ab_perc);
            } else if ((getWebsitesRecordByIdData.data[0].engage === false && getWebsitesRecordByIdData.data[0].engage_ab === false) || (getWebsitesRecordByIdData.data[0].ab_status === false || getWebsitesRecordByIdData.data[0].ab_status === null || getWebsitesRecordByIdData.data[0].ab_status === '')) {
                sitePhaseStatus = {
                    name: "Pre Phase",
                    id: -1
                }
                await this.handlePrePhasePersonaUpdates(siteInputs, sitePhaseStatus, getWebsitesRecordByIdData.data[0].ab_perc);
            }
        }
        if (this.personaId) {
            await this.handlePersonaDetailRouting();
        }
    }
    async loadDataCard() {
        const { personaRecoveredRevState } = this.state;
        var allCardData = personaRecoveredRevState;
        personaRecoveredRevState.map((data, i) => {
            var uData = [];
            data.sparklineData.data.map((d, j) => {
                uData[j] = Math.floor(Math.random() * 10) + 1;
            });
            allCardData[i].sparklineData.data = [...uData];
        });
        this.setState({ cardData: [...allCardData] });
    }

    async getSplitClientHistory(siteInputs, headerConfigPassed) {
        let splitDatesWithAB = [];
        const handleSplitClientHistoryData = await getSplitClientHistory(siteInputs, headerConfigPassed)
        if (handleSplitClientHistoryData && handleSplitClientHistoryData.hasOwnProperty('data') && handleSplitClientHistoryData.data.length) {
            splitDatesWithAB = handleSplitClientHistoryData.data.map((d) => {
                return {
                    split_date: convertDateTOLocale(d.prod_invalidated_on),
                    split: d.ab_perc
                }
            })
            return splitDatesWithAB;
        }
        return splitDatesWithAB;
    }
    /* PRE PHASE PERSONA UPDATE */
    async handlePrePhasePersonaUpdates(siteInputs, sitePhaseStatus, adwareShopperABPerc = null) {
        let currency = this.props.sessionClient.currency;
        const headerConfigPassed = {
            headers: {
                Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${getCurrentUser().data.data.refresh_token}`,
            }
        }

        let impactRevenueResult = 0;
        let listening_phase_aov_30_days = null;
        let listening_phase_orders_30_days = null;
        let numberOfDays = differenceInDays(this.state.endDate, this.state.startDate) + 1;
        let indStdRevenue30Days = null;
        if(numberOfDays < 30){
            numberOfDays = 30;
            indStdRevenue30Days = true;
        }

        let adwareShopperRev = 0;

        let splitDates = await this.getSplitClientHistory(siteInputs, headerConfigPassed)

        const [getEngagePersonaMetricsWhyNotShopperData, getEngagePersonaMetricsHesitantShopperData, getEngagePersonaMetricsWC_EEI_CRData, getWebsitesRecordByIdData, getShieldGADataData, getEngagePrePhasePersonaImpactDayCountData] = await Promise.all([
            getEngagePersonaMetricsWhyNotShopper(siteInputs, headerConfigPassed),
            getEngagePersonaMetricsHesitantShopper(siteInputs, headerConfigPassed),
            getEngagePersonaMetricsWC_EEI_CR(siteInputs, headerConfigPassed),
            getWebsitesRecordById(this.props.sessionClient.web_id, headerConfigPassed),
            getShieldGAData(siteInputs, headerConfigPassed),
            getEngagePrePhasePersonaImpactDayCount(siteInputs, headerConfigPassed)
        ])
        const getShieldYTDData = await getShieldYTD(siteInputs, splitDates, headerConfigPassed)

        if (getWebsitesRecordByIdData !== undefined && getWebsitesRecordByIdData.hasOwnProperty('data') && getWebsitesRecordByIdData.data.length) {
            listening_phase_aov_30_days = getWebsitesRecordByIdData.data[0].listening_phase_aov_30_days;
            listening_phase_orders_30_days = getWebsitesRecordByIdData.data[0].listening_phase_orders_30_days;
        }
        if (!this.state.engagePersonaListLoading) {
            const prePhasePersonaData = await Promise.all(this.state.engagePersonaList.map(async (d) => {
                if (d.short_code === "shield") {

                    let ab_status = null;
                    let personaPhase = "protection";
                    let totalAOV = null;
                    let industryBased = null;
                    let personaSizeOfGroup = null;

                    if (!this.state.topInjectionTypesLoading && this.state.topInjectionTypes !== undefined && this.state.topInjectionTypes !== null && this.state.topInjectionTypes !== 0 && this.state.topInjectionTypes.hasOwnProperty('data') && this.state.topInjectionTypes.data.length && this.state.topInjectionTypes.data[0].adware_sog !== null && this.state.topInjectionTypes.data[0].adware_sog !== 0) {
                        personaSizeOfGroup = this.state.topInjectionTypes.data[0].adware_sog;
                        industryBased = false;
                    } else {
                        personaSizeOfGroup = d.industry_std_sog;
                        industryBased = true
                    }
                    if (getShieldGADataData.data.total_aov != 0) {
                        totalAOV = parseFloat(getShieldGADataData.data.total_aov).toFixed(2)
                    } else if (!isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
                        totalAOV = listening_phase_aov_30_days
                    }
                    if (getWebsitesRecordByIdData.hasOwnProperty("data") && getWebsitesRecordByIdData.data.length !== 0) {
                        ab_status = getWebsitesRecordByIdData.data[0].ab_status;
                    }
                    if (ab_status === false || ab_status === null || ab_status === '') {

                        const getListeningPhaseIndustryStdData = await getListeningPhaseIndustryStd(siteInputs, headerConfigPassed);
                        if (getListeningPhaseIndustryStdData.hasOwnProperty('data') && getListeningPhaseIndustryStdData.data.length) {
                            let industyStdData = getListeningPhaseIndustryStdData.data[0];
                            const conversionLift = 6;
                            const rpsLift = 5;
                            const recoveredRevenue = industyStdData.projected_recovered_revenue
                            impactRevenueResult += recoveredRevenue * 1;
                            return {
                                personaOverview: adwareShopperOverviewCardData,
                                personaStatus: ab_status,
                                personaOneLineDesc: adwareShopperOverviewCardData.description,
                                conversionLift: conversionLift > 0 ? `${parseFloat(conversionLift).toFixed(2)}%` : 0,
                                revenuePerSessionLift: rpsLift > 0 ? `${parseFloat(rpsLift).toFixed(2)}%` : 0,
                                recoveredRevenue: recoveredRevenue > 0 ? `${parseFloat(recoveredRevenue).toFixed(2)}` : 0,
                                personaRev: recoveredRevenue !== undefined && recoveredRevenue !== null && recoveredRevenue > 0 ? recoveredRevenue : 0,
                                personaRevProjected: recoveredRevenue !== undefined && recoveredRevenue !== null && recoveredRevenue > 0 ? recoveredRevenue : 0,
                                totalAOV: totalAOV !== null ? totalAOV : 0,
                                personaSizeOfGroup: personaSizeOfGroup,
                                industryBased,
                                personaPhase: "",
                                industryStd: true,
                                metricsData: processShieldMetricsIndustryStd(industyStdData, currency),
                                metricsDataLoading: false,
                                personaImage: adware_shopper_alt,
                                personaShortCode: d.short_code,
                                ...d
                            }
                        } else {
                            return {
                                personaOneLineDesc: adwareShopperOverviewCardData.description,
                                personaOverview: adwareShopperOverviewCardData,
                                conversionLift: 0,
                                revenuePerSessionLift: 0,
                                recoveredRevenue: 0,
                                personaRev: 0,
                                protectedSessions: 0,
                                personaSizeOfGroup: personaSizeOfGroup,
                                industryBased,
                                metricsData: null,
                                metricsDataLoading: false,
                                personaStatus: ab_status,
                                personaPhase,
                                personaImage: adware_shopper_alt,
                                personaShortCode: d.short_code,
                                ...d
                            }
                        }
                    } else if (adwareShopperABPerc !== null && adwareShopperABPerc !== 100) {

                        let recoveredRevenueYTD = 0;
                        if (getShieldYTDData.statuscode !== undefined && getShieldYTDData.statuscode === 200) {
                            recoveredRevenueYTD = getShieldYTDData.data.recovered_revenue;
                            adwareShopperRev = parseInt(recoveredRevenueYTD) >= 0 ? parseInt(recoveredRevenueYTD) : 0
                        }
                        if (getShieldGADataData.statuscode !== undefined && getShieldGADataData.statuscode === 200 && !getShieldGADataData.data.hasOwnProperty('noData')) {
                            const conversionLift = getShieldGADataData.data.conversion_lift
                            const rpsLift = getShieldGADataData.data.rps_lift
                            return {
                                personaOneLineDesc: adwareShopperOverviewCardData.description,
                                personaOverview: adwareShopperOverviewCardData,
                                personaStatus: ab_status,
                                conversionLift: conversionLift > 0 ? `${parseFloat(conversionLift).toFixed(2)}%` : 0,
                                revenuePerSessionLift: rpsLift > 0 ? `${parseFloat(rpsLift).toFixed(2)}%` : 0,
                                recoveredRevenue: adwareShopperRev > 0 ? `${parseFloat(adwareShopperRev).toFixed(2)}` : 0,
                                personaRev: adwareShopperRev > 0 ? adwareShopperRev : 0,
                                totalAOV: totalAOV !== null ? totalAOV : 0,
                                personaSizeOfGroup: personaSizeOfGroup,
                                industryBased,
                                personaPhase,
                                industryStd: false,
                                metricsData: processShieldMetrics(getShieldGADataData, currency),
                                metricsDataLoading: false,
                                personaImage: adware_shopper_alt,
                                personaShortCode: d.short_code,
                                ...d
                            }
                        } else {
                            return {
                                personaOneLineDesc: adwareShopperOverviewCardData.description,
                                personaOverview: adwareShopperOverviewCardData,
                                conversionLift: 0,
                                revenuePerSessionLift: 0,
                                recoveredRevenue: 0,
                                personaRev: 0,
                                personaSizeOfGroup: personaSizeOfGroup,
                                industryBased,
                                protectedSessions: 0,
                                metricsData: null,
                                metricsDataLoading: false,
                                personaStatus: ab_status,
                                personaPhase,
                                personaImage: adware_shopper_alt,
                                personaShortCode: d.short_code,
                                ...d
                            }
                        }
                    } else {
                        let protectedSessions = 0;
                        const postPhaseMetrics = await getPostPhaseAdwareShopperData(siteInputs, headerConfigPassed)
                        let industryStd = false;
                        let processedPostPhaseMetricsData = null;
                        let conversionLift = 0;
                        let rpsLift = 0;
                        let recoveredRevenueYTD = 0;
                        if (getShieldYTDData.statuscode !== undefined && getShieldYTDData.statuscode === 200) {
                            recoveredRevenueYTD = getShieldYTDData.data.recovered_revenue;
                            adwareShopperRev = getShieldYTDData.data.recovered_revenue;
                        }

                        if (postPhaseMetrics !== undefined && postPhaseMetrics.statuscode && postPhaseMetrics.hasOwnProperty('data') && postPhaseMetrics.data.length) {
                            conversionLift = postPhaseMetrics.data[0].improvement_in_cr
                            rpsLift = postPhaseMetrics.data[0].improvement_in_rps
                            /* recoveredRevenue = postPhaseMetrics.data[0].c_revenue
                            adwareShopperRev = parseInt(recoveredRevenue) >= 0 ? parseInt(recoveredRevenue) : 0 */
                            processedPostPhaseMetricsData = processPostPhaseShieldMetrics(postPhaseMetrics)
                        }
                        if (getShieldGADataData.statuscode !== undefined && getShieldGADataData.statuscode === 200 && !getShieldGADataData.data.hasOwnProperty('noData')) {
                            protectedSessions = getShieldGADataData.data.protected_sessions;
                        }
                        const topMaliciousScripts = await getTopMaliciousScripts(siteInputs, headerConfigPassed);
                        return {
                            personaOneLineDesc: adwareShopperOverviewCardData.description,
                            personaOverview: adwareShopperOverviewCardData,
                            topMaliciousScripts: topMaliciousScripts.data[0],
                            personaStatus: ab_status,
                            personaPhase: "live",
                            industryStd: industryStd,
                            conversionLift: conversionLift > 0 ? `${parseFloat(conversionLift).toFixed(2)}%` : 0,
                            revenuePerSessionLift: rpsLift > 0 ? `${parseFloat(rpsLift).toFixed(2)}%` : 0,
                            recoveredRevenue: recoveredRevenueYTD > 0 ? `${parseFloat(recoveredRevenueYTD).toFixed(2)}` : 0,
                            personaRev: recoveredRevenueYTD > 0 ? `${parseFloat(recoveredRevenueYTD).toFixed(2)}` : 0,
                            metricsData: processedPostPhaseMetricsData !== null ? processedPostPhaseMetricsData : [],
                            metricsDataLoading: false,
                            personaSizeOfGroup: personaSizeOfGroup,
                            industryBased,
                            personaRev: 0,
                            protectedSessions,
                            personaImage: adware_shopper_alt,
                            personaShortCode: d.short_code,
                            ...d
                        }
                    }
                } else if (d.short_code === "wc") {
                    if (!getWebsitesRecordByIdData.data[0].wrong_coupon_eligible) {
                        return processIneligibleShopper(d)
                    }
                    let personaRevProjected = 0;
                    let dayCount = null;
                    let indStdRevenue = null;
                    let totalAOV = null;
                    if (getShieldGADataData.data.total_aov != 0) {
                        totalAOV = parseFloat(getShieldGADataData.data.total_aov).toFixed(2)
                    } else if (!isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
                        totalAOV = listening_phase_aov_30_days
                    }
                    if (getEngagePrePhasePersonaImpactDayCountData !== undefined && getEngagePrePhasePersonaImpactDayCountData.hasOwnProperty('data')) {
                        dayCount = getEngagePrePhasePersonaImpactDayCountData.data[0].days_with_wc_count * 1;
                    }
                    const wcData = await processWCPersonaMetricsResult(getEngagePersonaMetricsWC_EEI_CRData, { totalAOV: getShieldGADataData.data.total_aov }, dayCount, numberOfDays, listening_phase_aov_30_days, currency);
                    const wrongCouponShopperImpactData = await getEngageWrongCouponPrePhasePersonaImpact(siteInputs, getShieldGADataData.data, getWebsitesRecordByIdData, getEngagePrePhasePersonaImpactDayCountData, currency, headerConfigPassed);

                    let personaRev = wcData.personaMetrics[1].hasOwnProperty('brandlock_on') && wcData.personaMetrics[1].brandlock_on != 0 ? wcData.personaMetrics[1].brandlock_on : 0;
                    if (wcData.personaMetrics[1].hasOwnProperty('brandlock_on_projected') && wcData.personaMetrics[1].brandlock_on_projected != 0) {
                        personaRevProjected = wcData.personaMetrics[1].brandlock_on_projected;
                    } else if (getShieldGADataData.data.total_transactions != 0 && getShieldGADataData.data.total_aov != 0) {
                        personaRevProjected = getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift;
                        indStdRevenue = true;
                    } else if (!isNaN(listening_phase_orders_30_days) && listening_phase_orders_30_days !== 0 && !isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
                        personaRevProjected = listening_phase_orders_30_days * d.industry_std_transaction_sog * listening_phase_aov_30_days * d.industry_std_lift;
                        indStdRevenue30Days = true;
                    }
                    impactRevenueResult += !isNaN(personaRevProjected) ? personaRevProjected * d.apply_ratio : 0;

                    const rc_users = parseFloat(getEngagePersonaMetricsWC_EEI_CRData.data[0].rc_users);
                    const wc_users = parseFloat(getEngagePersonaMetricsWC_EEI_CRData.data[0].wc_users);
                    const checkout_users = parseFloat(getEngagePersonaMetricsWC_EEI_CRData.data[0].checkout_users);
                    const total_users = parseFloat(getEngagePersonaMetricsWC_EEI_CRData.data[0].total_users);
                    let wc_sog = null;
                    let checkout_of_all_users = null;
                    if (wc_users !== null && checkout_users !== null && wc_users !== 0 && checkout_users !== 0 && !isNaN(wc_users) && !isNaN(checkout_users)) {
                        wc_sog = (wc_users * 1.0 / (checkout_users) * 100).toFixed(2);
                        checkout_of_all_users = (wc_users * 1.0 / (total_users) * 100).toFixed(2);
                    }

                    return {
                        personaStatus: false, //getWebsitesRecordByIdData.data[0].wrong_coupon,
                        personaRev: !isNaN(personaRev) && personaRev * d.apply_ratio,
                        personaRevProjected: !isNaN(personaRevProjected) && personaRevProjected * d.apply_ratio,
                        totalAOV: totalAOV !== null ? totalAOV : 0,
                        personaPotentialCRLift: parseFloat(d.industry_std_lift - 1).toFixed(2),
                        personaShortCode: d.short_code,
                        indStdRevenue,
                        indStdRevenue30Days,
                        numberOfDays,
                        personaOneLineDesc: wcOverviewCardData.description,
                        personaSizeOfGroup: wc_sog != 0 && wc_sog != null ? wc_sog : d.industry_std_sog,
                        industryBased: wc_sog != 0 && wc_sog != null ? false : true,
                        personaImage: wrong_coupon_alt,
                        checkout_of_all_users: checkout_of_all_users,
                        impactData: wrongCouponShopperImpactData !== null && wrongCouponShopperImpactData.hasOwnProperty('data') && wrongCouponShopperImpactData.data,
                        personaImageGif: getWebsitesRecordByIdData.data[0].wrong_coupon ? `//debuficgraftb.cloudfront.net/analytics/img/custom/engage_trigger_images/gif/${getWebsitesRecordByIdData.data[0].web_id}_wc_gif.gif` : false,
                        /*        personaImage: getWebsitesRecordByIdData.data[0].wrong_coupon ? `//debuficgraftb.cloudfront.net/analytics/img/custom/engage_trigger_images/gif/${getWebsitesRecordByIdData.data[0].web_id}_wc_gif.gif` : `//debuficgraftb.cloudfront.net/analytics/img/custom/engage_trigger_images/images/notactivetrigger.png`,*/
                        ...d
                    }
                } else if (d.short_code === "e-ei") {

                    let personaRevProjected = 0;
                    let dayCount = null;
                    let indStdRevenue = null;
                    let totalAOV = null;
                    if (getShieldGADataData.data.total_aov != 0) {
                        totalAOV = parseFloat(getShieldGADataData.data.total_aov).toFixed(2)
                    } else if (!isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
                        totalAOV = listening_phase_aov_30_days
                    }
                    if (getEngagePrePhasePersonaImpactDayCountData !== undefined && getEngagePrePhasePersonaImpactDayCountData.hasOwnProperty('data')) {
                        dayCount = getEngagePrePhasePersonaImpactDayCountData.data[0].days_with_cashback_count * 1;
                    }

                    const eeiData = await processEEIPersonaMetricsResult(getEngagePersonaMetricsWC_EEI_CRData, { totalAOV: getShieldGADataData.data.total_aov }, dayCount, numberOfDays, listening_phase_aov_30_days, currency);
                    let extensionShopperImpactData = await getEngageExtensionPrePhasePersonaImpact(siteInputs, getShieldGADataData.data, getWebsitesRecordByIdData, getEngagePrePhasePersonaImpactDayCountData, currency, headerConfigPassed);
                    /*let extensionShopperImpactData = await processExtensionShopperPersonaImpactResult(getEngagePrePhasePersonaImpactData, getShieldGADataData.data, getWebsitesRecordByIdData); */

                    let personaRev = eeiData.personaMetrics[1].hasOwnProperty('brandlock_on') && eeiData.personaMetrics[1].brandlock_on != 0 ? eeiData.personaMetrics[1].brandlock_on : 0;
                    if (eeiData.personaMetrics[1].hasOwnProperty('brandlock_on_projected') && eeiData.personaMetrics[1].brandlock_on_projected != 0) {
                        personaRevProjected = eeiData.personaMetrics[1].brandlock_on_projected;
                    } else if (getShieldGADataData.data.total_transactions != 0 && getShieldGADataData.data.total_aov != 0) {
                        personaRevProjected = getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift;
                        indStdRevenue = true;
                    } else if (!isNaN(listening_phase_orders_30_days) && listening_phase_orders_30_days !== 0 && !isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
                        personaRevProjected = listening_phase_orders_30_days * d.industry_std_transaction_sog * listening_phase_aov_30_days * d.industry_std_lift;
                        indStdRevenue30Days = true;
                    }

                    impactRevenueResult += !isNaN(personaRevProjected) ? personaRevProjected * d.apply_ratio : 0;
                    const eei_users = parseFloat(getEngagePersonaMetricsWC_EEI_CRData.data[0].cashback_users);
                    const total_users = parseFloat(getEngagePersonaMetricsWC_EEI_CRData.data[0].total_users);
                    let eei_sog = null;
                    if (eei_users !== null && total_users !== null && !isNaN(eei_users) && !isNaN(total_users)) {
                        eei_sog = ((eei_users * 1.0 / total_users) * 100).toFixed(2);
                    }
                    return {
                        personaStatus: false, //getWebsitesRecordByIdData.data[0].extension_trigger,
                        personaRev: !isNaN(personaRev) && personaRev * d.apply_ratio,
                        personaRevProjected: !isNaN(personaRevProjected) && personaRevProjected * d.apply_ratio,
                        totalAOV: totalAOV !== null ? totalAOV : 0,
                        personaPotentialCRLift: parseFloat(d.industry_std_lift - 1).toFixed(2),
                        personaShortCode: d.short_code,
                        indStdRevenue,
                        numberOfDays,
                        personaOneLineDesc: extensionTriggerOverviewCardData.description,
                        personaSizeOfGroup: eei_sog != 0 && eei_sog != null ? eei_sog : d.industry_std_sog,
                        industryBased: eei_sog != 0 && eei_sog != null ? false : true,
                        //personaImage: getWebsitesRecordByIdData.data[0].extension_trigger ? `//debuficgraftb.cloudfront.net/analytics/img/custom/engage_trigger_images/images/${getWebsitesRecordByIdData.data[0].web_id}_extension_trigger.png` : `//debuficgraftb.cloudfront.net/analytics/img/custom/engage_trigger_images/images/notactivetrigger.png`,
                        personaImage: extension_shopper_alt,
                        impactData: extensionShopperImpactData !== null && extensionShopperImpactData.hasOwnProperty('data') && extensionShopperImpactData.data,
                        ...d
                    }
                } else if (d.short_code === "ti3") {

                    let personaRevProjected = 0;
                    let dayCount = null;
                    let indStdRevenue = null;
                    let totalAOV = null;
                    if (getShieldGADataData.data.total_aov != 0) {
                        totalAOV = parseFloat(getShieldGADataData.data.total_aov).toFixed(2)
                    } else if (!isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
                        totalAOV = listening_phase_aov_30_days
                    }
                    const hesitantShopperImpactDayCount = await getEngagePrePhaseHesitantPersonaImpactDayCount(siteInputs, headerConfigPassed);

                    if (hesitantShopperImpactDayCount !== undefined && hesitantShopperImpactDayCount.hasOwnProperty('data')) {
                        dayCount = hesitantShopperImpactDayCount.data[0].days_with_hesitant_session_count * 1;
                    }
                    const hesitantData = await processHesitantPersonaMetricsResult(getEngagePersonaMetricsHesitantShopperData, { totalAOV: getShieldGADataData.data.total_aov }, dayCount, numberOfDays, listening_phase_aov_30_days, currency);

                    let personaRev = hesitantData.personaMetrics[1].hasOwnProperty('brandlock_on') && hesitantData.personaMetrics[1].brandlock_on != 0 ? hesitantData.personaMetrics[1].brandlock_on : 0;
                    if (hesitantData.personaMetrics[1].hasOwnProperty('brandlock_on_projected') && hesitantData.personaMetrics[1].brandlock_on_projected != 0) {
                        personaRevProjected = hesitantData.personaMetrics[1].brandlock_on_projected;
                    } else if (getShieldGADataData.data.total_transactions != 0 && getShieldGADataData.data.total_aov != 0) {
                        personaRevProjected = getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift;
                        indStdRevenue = true;
                    } else if (!isNaN(listening_phase_orders_30_days) && listening_phase_orders_30_days !== 0 && !isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
                        personaRevProjected = listening_phase_orders_30_days * d.industry_std_transaction_sog * listening_phase_aov_30_days * d.industry_std_lift;
                        indStdRevenue30Days = true;
                    }

                    let hesitant_sog = null;
                    impactRevenueResult += !isNaN(personaRevProjected) ? personaRevProjected * d.apply_ratio : 0;
                    if (!getWebsitesRecordByIdData.data[0].hesitant_trigger && getEngagePersonaMetricsHesitantShopperData.data.length > 0 && getEngagePersonaMetricsHesitantShopperData.data[0].size_of_group != 0) {
                        hesitant_sog = getEngagePersonaMetricsHesitantShopperData.data[0].size_of_group;
                    }
                    return {
                        personaStatus: false, //getWebsitesRecordByIdData.data[0].hesitant_trigger,
                        personaRev: !isNaN(personaRev) && personaRev * d.apply_ratio,
                        personaRevProjected: !isNaN(personaRevProjected) && personaRevProjected * d.apply_ratio,
                        totalAOV: totalAOV !== null ? totalAOV : 0,
                        personaPotentialCRLift: parseFloat(d.industry_std_lift - 1).toFixed(2),
                        personaShortCode: d.short_code,
                        indStdRevenue,
                        numberOfDays,
                        personaOneLineDesc: ti3OverviewCardData.description,
                        personaSizeOfGroup: hesitant_sog != 0 && hesitant_sog != null ? hesitant_sog : d.industry_std_sog,
                        industryBased: hesitant_sog != 0 && hesitant_sog != null ? false : true,
                        /* personaImage: getWebsitesRecordByIdData.data[0].hesitant_trigger ? `//debuficgraftb.cloudfront.net/analytics/img/custom/engage_trigger_images/images/${getWebsitesRecordByIdData.data[0].web_id}_hesitant_trigger.png` : `//debuficgraftb.cloudfront.net/analytics/img/custom/engage_trigger_images/images/notactivetrigger.png`,
                         */
                        personaImage: hesitant_shopper_alt,

                        ...d
                    }
                } else if (d.short_code === "epr") {
                    let personaRevProjected = 0;
                    let dayCount = null;
                    let indStdRevenue = null;
                    let totalAOV = null;
                    if (getShieldGADataData.data.total_aov != 0) {
                        totalAOV = parseFloat(getShieldGADataData.data.total_aov).toFixed(2)
                    } else if (!isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
                        totalAOV = listening_phase_aov_30_days
                    }
                    if (getEngagePrePhasePersonaImpactDayCountData !== undefined && getEngagePrePhasePersonaImpactDayCountData.hasOwnProperty('data')) {
                        dayCount = getEngagePrePhasePersonaImpactDayCountData.data[0].days_with_coupon_runner_count * 1;
                    }

                    const CRData = await processCRPersonaMetricsResult(getEngagePersonaMetricsWC_EEI_CRData, { totalAOV: getShieldGADataData.data.total_aov }, dayCount, numberOfDays, listening_phase_aov_30_days, currency);
                    /* let couponRunnerImpactData = await processCouponRunnerPersonaImpactResult(getEngagePrePhasePersonaImpactData, getShieldGADataData.data, getWebsitesRecordByIdData); */
                    let couponRunnerImpactData = await getEngageCouponRunnerPrePhasePersonaImpact(siteInputs, getShieldGADataData.data, getWebsitesRecordByIdData, getEngagePrePhasePersonaImpactDayCountData, currency, headerConfigPassed);

                    let personaRev = CRData.personaMetrics[1].hasOwnProperty('brandlock_on') && CRData.personaMetrics[1].brandlock_on != 0 ? CRData.personaMetrics[1].brandlock_on : 0;
                    if (CRData.personaMetrics[1].hasOwnProperty('brandlock_on_projected') && CRData.personaMetrics[1].brandlock_on_projected != 0) {
                        personaRevProjected = CRData.personaMetrics[1].brandlock_on_projected;
                    } else if (getShieldGADataData.data.total_transactions != 0 && getShieldGADataData.data.total_aov != 0) {
                        personaRevProjected = getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift;
                        indStdRevenue = true;
                    } else if (!isNaN(listening_phase_orders_30_days) && listening_phase_orders_30_days !== 0 && !isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
                        personaRevProjected = listening_phase_orders_30_days * d.industry_std_transaction_sog * listening_phase_aov_30_days * d.industry_std_lift;
                        indStdRevenue30Days = true;
                    }

                    impactRevenueResult += !isNaN(personaRevProjected) ? personaRevProjected * d.apply_ratio : 0;
                    /* impactRevenueResult += getEngagePersonaMetricsWC_EEI_CRData.data.length > 0 ? CRData.personaMetrics[1].brandlock_on * 1 : 0;
 */
                    const coupon_runner_users = parseFloat(getEngagePersonaMetricsWC_EEI_CRData.data[0].coupon_runner_users);
                    const total_users = parseFloat(getEngagePersonaMetricsWC_EEI_CRData.data[0].total_users);
                    let coupon_runner_sog = null;
                    if (coupon_runner_users !== null && total_users !== null && !isNaN(coupon_runner_users) && !isNaN(total_users)) {
                        coupon_runner_sog = parseFloat((coupon_runner_users * 1.0 / total_users) * 100).toFixed(2);
                    }
                    return {
                        personaStatus: false, //getWebsitesRecordByIdData.data[0].prediction_trigger,
                        personaRev: !isNaN(personaRev) && personaRev * d.apply_ratio,
                        personaRevProjected: !isNaN(personaRevProjected) && personaRevProjected * d.apply_ratio,
                        totalAOV: totalAOV !== null ? totalAOV : 0,
                        personaPotentialCRLift: parseFloat(d.industry_std_lift - 1).toFixed(2),
                        personaShortCode: d.short_code,
                        indStdRevenue,
                        numberOfDays,
                        personaOneLineDesc: couponRunnerOverviewCardData.description,
                        personaSizeOfGroup: coupon_runner_sog != 0 && coupon_runner_sog != null ? coupon_runner_sog : d.industry_std_sog,
                        industryBased: coupon_runner_sog != 0 && coupon_runner_sog != null ? false : true,
                        //personaImage: getWebsitesRecordByIdData.data[0].prediction_trigger ? `//debuficgraftb.cloudfront.net/analytics/img/custom/engage_trigger_images/images/${getWebsitesRecordByIdData.data[0].web_id}_prediction_trigger.png` : coupon_runner_alt,
                        personaImage: coupon_runner_alt,
                        impactData: couponRunnerImpactData !== null && couponRunnerImpactData.hasOwnProperty('data') && couponRunnerImpactData.data,
                        ...d
                    }
                } else if (d.short_code === "cs") {
                    let whyNotShopperImpactData = null;
                    let dayCount = null;
                    let prePhaseCSData = null;
                    let prePhaseCSMetricsData = null;
                    let prePhaseCSDataProjected = null;
                    let indStdRevenue = null;
                    let totalAOV = null;
                    if (getShieldGADataData.data.total_aov != 0) {
                        totalAOV = parseFloat(getShieldGADataData.data.total_aov).toFixed(2)
                    } else if (!isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
                        totalAOV = listening_phase_aov_30_days
                    }
                    const whyNotShopperImpactDayCount = await getEngagePrePhaseWhyNotPersonaImpactDayCount(siteInputs, headerConfigPassed);

                    whyNotShopperImpactData = await getEngageWhynotPrePhasePersonaImpact(siteInputs, getShieldGADataData.data, getWebsitesRecordByIdData, getEngagePersonaMetricsWhyNotShopperData, getEngagePrePhasePersonaImpactDayCountData, currency, headerConfigPassed);


                    if (whyNotShopperImpactDayCount !== undefined && whyNotShopperImpactDayCount.hasOwnProperty('data')) {
                        dayCount = whyNotShopperImpactDayCount.data[0].days_with_cart_reduction * 1;
                    }

                    /*                             whyNotImpactData = await processWhyNotPersonaImpactResult(getEngagePrePhasePersonaImpactData, getShieldGADataData.data, getWebsitesRecordByIdData, getEngagePersonaMetricsWhyNotShopperData); */


                    prePhaseCSMetricsData = await processWhyNotPersonaMetricsResult
                        (getEngagePersonaMetricsWhyNotShopperData, { totalAOV: getShieldGADataData.data.total_aov }, dayCount, numberOfDays, currency);


                    prePhaseCSData = prePhaseCSMetricsData.personaMetrics[1].hasOwnProperty('brandlock_on') && prePhaseCSMetricsData.personaMetrics[1].brandlock_on != 0 ? prePhaseCSMetricsData.personaMetrics[1].brandlock_on : 0;



                    if (prePhaseCSMetricsData.personaMetrics[1].hasOwnProperty('brandlock_on_projected') && prePhaseCSMetricsData.personaMetrics[1].brandlock_on_projected != 0) {

                        prePhaseCSDataProjected = prePhaseCSMetricsData.personaMetrics[1].brandlock_on_projected


                    } else if (getShieldGADataData.data.total_transactions != 0 && getShieldGADataData.data.total_aov != 0) {


                        prePhaseCSDataProjected = getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift;
                        indStdRevenue = true;


                    } else if (!isNaN(listening_phase_orders_30_days) && listening_phase_orders_30_days !== 0 && !isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
                        prePhaseCSDataProjected = listening_phase_orders_30_days * d.industry_std_transaction_sog * listening_phase_aov_30_days * d.industry_std_lift;
                        indStdRevenue30Days = true;
                    }
                    impactRevenueResult += !isNaN(prePhaseCSDataProjected) ? prePhaseCSDataProjected * d.apply_ratio : 0;
                    let cs_sog = null;
                    let cs_reduce_cart = null;
                    if (!getWebsitesRecordByIdData.data[0].whynot_trigger && getEngagePersonaMetricsWhyNotShopperData.data.length > 0 && getEngagePersonaMetricsWhyNotShopperData.statuscode === 200 && getEngagePersonaMetricsWhyNotShopperData.data[0].size_of_users_that_add_to_cart != 0) {
                        cs_sog = getEngagePersonaMetricsWhyNotShopperData.data[0].size_of_users_that_add_to_cart;
                        cs_reduce_cart = getEngagePersonaMetricsWhyNotShopperData.data[0].size_of_users_that_reduce_cart;
                    }
                    return {
                        personaStatus: false, //getWebsitesRecordByIdData.data[0].whynot_trigger,
                        personaRev: !isNaN(prePhaseCSData) && prePhaseCSData * d.apply_ratio,
                        personaRevProjected: !isNaN(prePhaseCSDataProjected) && prePhaseCSDataProjected * d.apply_ratio,
                        indStdRevenue,
                        numberOfDays,
                        personaRevDayCount: dayCount,
                        totalAOV: totalAOV !== null ? totalAOV : 0,
                        personaPotentialCRLift: parseFloat(d.industry_std_lift - 1).toFixed(2),
                        personaShortCode: d.short_code,
                        personaOneLineDesc: whyNotShopperOverviewCardData.description,
                        personaSizeOfGroup: cs_sog != 0 && cs_sog != null ? parseFloat(cs_sog).toFixed(2) : d.industry_std_sog,
                        industryBased: cs_sog != 0 && cs_sog != null ? false : true,
                        cs_reduce_cart: cs_reduce_cart != 0 && cs_reduce_cart != null ? parseFloat(cs_reduce_cart).toFixed(2) : 0,
                        //personaImage: getWebsitesRecordByIdData.data[0].whynot_trigger ? why_not_shopper_alt : `//debuficgraftb.cloudfront.net/analytics/img/custom/engage_trigger_images/images/notactivetrigger.png`,
                        personaImage: why_not_shopper_alt,
                        impactData: whyNotShopperImpactData !== null && whyNotShopperImpactData.hasOwnProperty('data') && whyNotShopperImpactData.data,
                        ...d
                    }
                }
                /* else if (d.short_code === "pp" && this.props.sessionClient.web_id === 246) {

                    // const premiumProductData = await this.processWhyNotPersonaMetricsResult(getEngagePersonaMetricsWC_EEI_CRData);
                    return {
                        personaStatus: false,
                        personaRev: 0,
                        totalAOV: totalAOV !== null ? totalAOV : 0,
                        personaPotentialCRLift: "0",
                        personaShortCode: d.short_code,
                        personaOneLineDesc: "",
                        personaImage: `//debuficgraftb.cloudfront.net/analytics/img/custom/engage_trigger_images/images/notactivetrigger.png`,
                        ...d
                    }
                } */
            }));

            this.setState(prevState => {
                return {
                    loading: {
                        status: false,
                        message: ""
                    },
                    impactRevenue: impactRevenueResult,
                    impactRevenueLoading: false,
                    loadPersonaDetails: false,
                    personaDetailLoader: false,
                    updatedEngagePersonaList: prePhasePersonaData,
                    updatedEngagePersonaListLoading: false,
                    sitePhase: sitePhaseStatus,
                    adwareShopperABPerc,
                    indStdRevenue30Days,
                    indStdRevenue30DaysIsLoading: false,

                }
            })
        }

    }


    /* DURING PHASE PERSONA DATA */
    async handlePersonaUpdates(siteInputs, sitePhaseStatus, adwareShopperABPerc = null) {
        let currency = this.props.sessionClient.currency;
        const headerConfigPassed = {
            headers: {
                Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${getCurrentUser().data.data.refresh_token}`,
            }
        }
        let prePhasePersonaData = [];
        let impactRevenueResult = 0;
        let potentialRevenueTotal = 0;
        let adwareShopperRev = 0;
        let listening_phase_aov_30_days = null;
        let engageEnable = null;
        let listening_phase_orders_30_days = null;
        let numberOfDays = differenceInDays(this.state.endDate, this.state.startDate) + 1;
        let indStdRevenue30Days = null;
        let splitDates = await this.getSplitClientHistory(siteInputs, headerConfigPassed)

        let getEngageGADataData, getEngagePersonaMetricsWhyNotShopperData, getEngagePersonaMetricsHesitantShopperData, getEngagePersonaDuringSizeOFGroupData, getEngagePersonaMetricsWC_EEI_CRData, getWebsitesRecordByIdData, getShieldGADataData, getEngagePrePhasePersonaImpactDayCountData = null;

        [getEngageGADataData, getEngagePersonaMetricsWhyNotShopperData, getEngagePersonaMetricsHesitantShopperData, getEngagePersonaDuringSizeOFGroupData, getEngagePersonaMetricsWC_EEI_CRData, getWebsitesRecordByIdData, getShieldGADataData, getEngagePrePhasePersonaImpactDayCountData] = await Promise.all([
            geteEngageConsolidateRevenue(siteInputs, numberOfDays, headerConfigPassed),
            // geteEngageCouponBreakdown(siteInputs, headerConfigPassed),
            getEngagePersonaMetricsWhyNotShopper(siteInputs, headerConfigPassed),
            getEngagePersonaMetricsHesitantShopper(siteInputs, headerConfigPassed),
            getEngagePersonaDuringSizeOFGroup(siteInputs, headerConfigPassed),
            getEngagePersonaMetricsWC_EEI_CR(siteInputs, headerConfigPassed),
            // getEngagePersonaMetricsDuring(siteInputs, headerConfigPassed),
            getWebsitesRecordById(this.props.sessionClient.web_id, headerConfigPassed),
            getShieldGAData(siteInputs, headerConfigPassed),
            getEngagePrePhasePersonaImpactDayCount(siteInputs, headerConfigPassed)
        ]);

        const getShieldYTDData = await getShieldYTD(siteInputs, splitDates, headerConfigPassed)
        if (getWebsitesRecordByIdData !== undefined && getWebsitesRecordByIdData.hasOwnProperty('data') && getWebsitesRecordByIdData.data.length) {
            listening_phase_aov_30_days = getWebsitesRecordByIdData.data[0].listening_phase_aov_30_days;
            listening_phase_orders_30_days = getWebsitesRecordByIdData.data[0].listening_phase_orders_30_days;
            engageEnable = getWebsitesRecordByIdData.data[0].engage;
        }
        if (!this.state.engagePersonaListLoading) {
            prePhasePersonaData = await Promise.all(
                this.state.engagePersonaList.map(async (d) => {

                    if (d.short_code === "shield") {

                        let ab_status = null;
                        let personaPhase = "protection";
                        let totalAOV = null;
                        let industryBased = null;
                        let personaSizeOfGroup = null;
                        if (!this.state.topInjectionTypesLoading && this.state.topInjectionTypes !== undefined && this.state.topInjectionTypes !== null && this.state.topInjectionTypes !== 0 && this.state.topInjectionTypes.hasOwnProperty('data') && this.state.topInjectionTypes.data.length && this.state.topInjectionTypes.data[0].adware_sog !== null && this.state.topInjectionTypes.data[0].adware_sog !== 0) {
                            personaSizeOfGroup = this.state.topInjectionTypes.data[0].adware_sog;
                            industryBased = false;
                        } else {
                            personaSizeOfGroup = d.industry_std_sog;
                            industryBased = true
                        } if (getShieldGADataData.data.total_aov != 0) {
                            totalAOV = parseFloat(getShieldGADataData.data.total_aov).toFixed(2)
                        } else if (!isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
                            totalAOV = listening_phase_aov_30_days
                        }
                        if (getWebsitesRecordByIdData.hasOwnProperty("data") && getWebsitesRecordByIdData.data.length !== 0) {
                            ab_status = getWebsitesRecordByIdData.data[0].ab_status;
                        }
                        if (ab_status === false || ab_status === null || ab_status === '') {
                            const getListeningPhaseIndustryStdData = await getListeningPhaseIndustryStd(siteInputs, headerConfigPassed);
                            if (getListeningPhaseIndustryStdData.hasOwnProperty('data') && getListeningPhaseIndustryStdData.data.length) {
                                let industyStdData = getListeningPhaseIndustryStdData.data[0];
                                const conversionLift = 6;
                                const rpsLift = 5;
                                const recoveredRevenue = industyStdData.projected_recovered_revenue;
                                potentialRevenueTotal = recoveredRevenue !== null ? potentialRevenueTotal * 1 + recoveredRevenue * 1 : potentialRevenueTotal;
                                return {
                                    personaOneLineDesc: adwareShopperOverviewCardData.description,
                                    personaOverview: adwareShopperOverviewCardData,
                                    personaStatus: ab_status,
                                    conversionLift: conversionLift > 0 ? `${parseFloat(conversionLift).toFixed(2)}%` : 0,
                                    revenuePerSessionLift: rpsLift > 0 ? `${parseFloat(rpsLift).toFixed(2)}%` : 0,
                                    personaRev: recoveredRevenue !== undefined && recoveredRevenue !== null && recoveredRevenue > 0 ? `${parseFloat(recoveredRevenue).toFixed(2)}` : 0,
                                    recoveredRevenue: recoveredRevenue > 0 ? `${parseFloat(recoveredRevenue).toFixed(2)}` : 0,
                                    personaRevProjected: recoveredRevenue !== undefined && recoveredRevenue !== null && recoveredRevenue > 0 ? recoveredRevenue : 0,
                                    totalAOV: totalAOV !== null ? totalAOV : 0,
                                    personaPhase: "",
                                    personaSizeOfGroup: personaSizeOfGroup,
                                    industryBased,
                                    industryStd: true,
                                    metricsData: processShieldMetricsIndustryStd(industyStdData, currency),
                                    metricsDataLoading: false,
                                    personaImage: adware_shopper_alt,
                                    personaShortCode: d.short_code,
                                    ...d
                                }
                            } else {
                                return {
                                    personaOneLineDesc: adwareShopperOverviewCardData.description,
                                    personaOverview: adwareShopperOverviewCardData,
                                    conversionLift: 0,
                                    revenuePerSessionLift: 0,
                                    recoveredRevenue: 0,
                                    personaRev: 0,
                                    protectedSessions: 0,
                                    personaSizeOfGroup: personaSizeOfGroup,
                                    industryBased,
                                    metricsData: null,
                                    metricsDataLoading: false,
                                    personaStatus: ab_status,
                                    personaPhase,
                                    personaImage: adware_shopper_alt,
                                    personaShortCode: d.short_code,
                                    ...d
                                }
                            }
                        } else if (adwareShopperABPerc !== null && adwareShopperABPerc !== 100) {


                            let recoveredRevenueYTD = 0;
                            let adwareDayCount = 0;
                            let personaRevProjected = 0;
                            let abPerc = 0;


                            if (getShieldYTDData.statuscode !== undefined && getShieldYTDData.statuscode === 200) {
                                recoveredRevenueYTD = getShieldYTDData.data.recovered_revenue;
                                adwareDayCount = getShieldYTDData.data.adware_day_count;
                                adwareShopperRev = parseInt(recoveredRevenueYTD) >= 0 ? parseInt(recoveredRevenueYTD) : 0;
                                abPerc = getWebsitesRecordByIdData.data[0].ab_perc
                                personaRevProjected = adwareShopperRev !== 0 && adwareDayCount !== 0 && abPerc !== 0 && abPerc !== null ? Math.round((((adwareShopperRev * (100 - abPerc)) / abPerc) * numberOfDays) / adwareDayCount) : 0;
                                potentialRevenueTotal = potentialRevenueTotal * 1 + personaRevProjected * 1;
                            }
                            if (getShieldGADataData.statuscode !== undefined && getShieldGADataData.statuscode === 200 && !getShieldGADataData.data.hasOwnProperty('noData')) {
                                const conversionLift = getShieldGADataData.data.conversion_lift
                                const rpsLift = getShieldGADataData.data.rps_lift
                                const recoveredRevenue = getShieldGADataData.data.recovered_revenue
                                return {
                                    personaOneLineDesc: adwareShopperOverviewCardData.description,
                                    personaOverview: adwareShopperOverviewCardData,
                                    personaStatus: ab_status,
                                    conversionLift: conversionLift > 0 ? `${parseFloat(conversionLift).toFixed(2)}%` : 0,
                                    revenuePerSessionLift: rpsLift > 0 ? `${parseFloat(rpsLift).toFixed(2)}%` : 0,
                                    recoveredRevenue: recoveredRevenueYTD > 0 ? `${parseInt(recoveredRevenueYTD)}` : 0,
                                    personaRev: recoveredRevenueYTD > 0 ? `${parseInt(recoveredRevenueYTD)}` : 0,
                                    personaRevProjected: personaRevProjected > 0 ? `${parseInt(personaRevProjected)}` : 0,
                                    personaSizeOfGroup: personaSizeOfGroup,
                                    industryBased,
                                    totalAOV: totalAOV !== null ? totalAOV : 0,
                                    personaPhase,
                                    industryStd: false,
                                    metricsData: processShieldMetrics(getShieldGADataData, currency),
                                    personaImage: adware_shopper_alt,
                                    personaShortCode: d.short_code,
                                    ...d
                                }
                            } else {
                                return {
                                    personaOneLineDesc: adwareShopperOverviewCardData.description,
                                    personaOverview: adwareShopperOverviewCardData,
                                    conversionLift: 0,
                                    revenuePerSessionLift: 0,
                                    recoveredRevenue: 0,
                                    personaRev: 0,
                                    personaSizeOfGroup: personaSizeOfGroup,
                                    industryBased,
                                    protectedSessions: 0,
                                    metricsData: null,
                                    metricsDataLoading: false,
                                    personaStatus: ab_status,
                                    personaPhase,
                                    personaImage: adware_shopper_alt,
                                    personaShortCode: d.short_code,
                                    ...d
                                }
                            }
                        } else {
                            let protectedSessions = 0;
                            const postPhaseMetrics = await getPostPhaseAdwareShopperData(siteInputs, headerConfigPassed)
                            let industryStd = false;
                            let processedPostPhaseMetricsData = null;
                            let conversionLift = 0;
                            let rpsLift = 0;
                            let recoveredRevenueYTD = 0;
                            if (getShieldYTDData.statuscode !== undefined && getShieldYTDData.statuscode === 200) {
                                recoveredRevenueYTD = getShieldYTDData.data.recovered_revenue;
                                adwareShopperRev = getShieldYTDData.data.recovered_revenue;
                            }
                            if (postPhaseMetrics !== undefined && postPhaseMetrics.statuscode && postPhaseMetrics.hasOwnProperty('data') && postPhaseMetrics.data.length) {
                                conversionLift = postPhaseMetrics.data[0].improvement_in_cr
                                rpsLift = postPhaseMetrics.data[0].improvement_in_rps
                                /* recoveredRevenue = postPhaseMetrics.data[0].c_revenue
                                adwareShopperRev = parseInt(recoveredRevenue) >= 0 ? parseInt(recoveredRevenue) : 0 */
                                //potentialRevenueTotal = potentialRevenueTotal * 1 + adwareShopperRev * 1;
                                processedPostPhaseMetricsData = processPostPhaseShieldMetrics(postPhaseMetrics)
                            }
                            if (getShieldGADataData.statuscode !== undefined && getShieldGADataData.statuscode === 200 && !getShieldGADataData.data.hasOwnProperty('noData')) {
                                protectedSessions = getShieldGADataData.data.protected_sessions;
                            }
                            const topMaliciousScripts = await getTopMaliciousScripts(siteInputs, headerConfigPassed);
                            return {
                                personaOneLineDesc: adwareShopperOverviewCardData.description,
                                personaOverview: adwareShopperOverviewCardData,
                                topMaliciousScripts: topMaliciousScripts.data[0],
                                personaStatus: ab_status,
                                personaPhase: "live",
                                industryStd: industryStd,
                                conversionLift: conversionLift > 0 ? `${parseFloat(conversionLift).toFixed(2)}%` : 0,
                                revenuePerSessionLift: rpsLift > 0 ? `${parseFloat(rpsLift).toFixed(2)}%` : 0,
                                recoveredRevenue: recoveredRevenueYTD > 0 ? `${parseFloat(recoveredRevenueYTD).toFixed(2)}` : 0,
                                personaRev: recoveredRevenueYTD > 0 ? `${parseFloat(recoveredRevenueYTD).toFixed(2)}` : 0,
                                personaSizeOfGroup: personaSizeOfGroup,
                                industryBased,
                                metricsData: processedPostPhaseMetricsData !== null ? processedPostPhaseMetricsData : [],
                                metricsDataLoading: false,
                                personaRev: 0,
                                protectedSessions,
                                personaImage: adware_shopper_alt,
                                personaShortCode: d.short_code,
                                ...d
                            }
                        }
                    } else if (d.short_code === "wc") {
                        if (!getWebsitesRecordByIdData.data[0].wrong_coupon_eligible) {
                            return processIneligibleShopper(d)
                        }
                        // let duringPhaseWCData = await processWCPersonaMetricsResultDuring(getEngagePersonaMetricsDuringData);
                        let wc_sog = null;
                        let wc_revenue = null;
                        let wc_potential_revenue = null;
                        let industryBased = null;
                        let checkout_of_all_users = null;
                        let wrongCouponShopperImpactData = null;
                        let personaPhase = getWebsitesRecordByIdData.data[0].wrong_coupon_trigger_split === 100 ? "post" : "during";
                        let personaRevProjected = 0;
                        let totalAOV = null;
                        if (getShieldGADataData.data.total_aov != 0) {
                            totalAOV = parseFloat(getShieldGADataData.data.total_aov).toFixed(2)
                        } else if (!isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
                            totalAOV = listening_phase_aov_30_days
                        }
                        if (getWebsitesRecordByIdData.hasOwnProperty("data") && !getWebsitesRecordByIdData.data[0].wrong_coupon) {
                            let dayCount = null;
                            let indStdRevenue = null;
                            if (getEngagePrePhasePersonaImpactDayCountData !== undefined && getEngagePrePhasePersonaImpactDayCountData.hasOwnProperty('data')) {
                                dayCount = getEngagePrePhasePersonaImpactDayCountData.data[0].days_with_wc_count * 1;
                            }
                            const wcData = await processWCPersonaMetricsResult(getEngagePersonaMetricsWC_EEI_CRData, { totalAOV: getShieldGADataData.data.total_aov }, dayCount, numberOfDays, listening_phase_aov_30_days, currency);
                            /* let wrongCouponImpactData = await processWrongCouponPersonaImpactResult(getEngagePrePhasePersonaImpactData, getShieldGADataData.data, getWebsitesRecordByIdData); */
                            /*                             let personaRev = wcData.personaMetrics[1].brandlock_on != 0 ? wcData.personaMetrics[1].brandlock_on : getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift; */


                            let personaRev = wcData.personaMetrics[1].hasOwnProperty('brandlock_on') && wcData.personaMetrics[1].brandlock_on != 0 ? wcData.personaMetrics[1].brandlock_on : 0;
                            if (wcData.personaMetrics[1].hasOwnProperty('brandlock_on_projected') && wcData.personaMetrics[1].brandlock_on_projected != 0) {
                                personaRevProjected = wcData.personaMetrics[1].brandlock_on_projected;
                            } else if (getShieldGADataData.data.total_transactions != 0 && getShieldGADataData.data.total_aov != 0) {
                                personaRevProjected = getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift;
                                indStdRevenue = true;
                            } else if (!isNaN(listening_phase_orders_30_days) && listening_phase_orders_30_days !== 0 && !isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
                                personaRevProjected = listening_phase_orders_30_days * d.industry_std_transaction_sog * listening_phase_aov_30_days * d.industry_std_lift;
                                indStdRevenue30Days = true;
                            }

                            wc_revenue = personaRevProjected !== null ? personaRevProjected * d.apply_ratio * 1 : 0;
                            potentialRevenueTotal = potentialRevenueTotal * 1 + wc_revenue;
                            /*   wrongCouponShopperImpactData = await processWrongCouponPersonaImpactResult(getEngagePrePhasePersonaImpactData, getShieldGADataData.data, getWebsitesRecordByIdData);
   */
                            wrongCouponShopperImpactData = await getEngageWrongCouponPrePhasePersonaImpact(siteInputs, getShieldGADataData.data, getWebsitesRecordByIdData, getEngagePrePhasePersonaImpactDayCountData, currency, headerConfigPassed);

                            const rc_users = parseFloat(getEngagePersonaMetricsWC_EEI_CRData.data[0].rc_users);
                            const wc_users = parseFloat(getEngagePersonaMetricsWC_EEI_CRData.data[0].wc_users);
                            const checkout_users = parseFloat(getEngagePersonaMetricsWC_EEI_CRData.data[0].checkout_users);
                            const total_users = parseFloat(getEngagePersonaMetricsWC_EEI_CRData.data[0].total_users);

                            if (checkout_users !== null && wc_users !== null && wc_users !== 0 && checkout_users !== 0 && !isNaN(wc_users) && !isNaN(checkout_users)) {

                                wc_sog = parseFloat((wc_users * 1.0 / checkout_users) * 100).toFixed(2);
                                checkout_of_all_users = (wc_users * 1.0 / (total_users) * 100).toFixed(2);
                            }
                            personaPhase = "";


                        } else if (getEngagePersonaDuringSizeOFGroupData.hasOwnProperty('data') && getEngagePersonaDuringSizeOFGroupData.data.length > 0) {
                            const wc_users = parseFloat(getEngagePersonaDuringSizeOFGroupData.data[0].wc_users);
                            const coupon_users = parseFloat(getEngagePersonaDuringSizeOFGroupData.data[0].coupon_users);
                            const checkout_users = parseFloat(getEngagePersonaDuringSizeOFGroupData.data[0].checkout_users);
                            const total_users = parseFloat(getEngagePersonaDuringSizeOFGroupData.data[0].users);
                            wc_sog = checkout_users !== 0 && checkout_users !== undefined && !isNaN(checkout_users) ? ((wc_users / checkout_users) * 100).toFixed(2) : 0;
                            checkout_of_all_users = (wc_users * 1.0 / (total_users) * 100).toFixed(2);
                        }

                        if (getWebsitesRecordByIdData.hasOwnProperty("data") && getWebsitesRecordByIdData.data[0].wrong_coupon && getEngageGADataData.data.length) {

                            wc_revenue = getEngageGADataData.data[0].wc_revenue !== null ? parseInt(getEngageGADataData.data[0].wc_revenue) : 0;
                            wc_potential_revenue = getEngageGADataData.data[0].wc_potential_revenue !== null ? parseInt(getEngageGADataData.data[0].wc_potential_revenue) : 0;
                            potentialRevenueTotal = wc_potential_revenue !== null ? potentialRevenueTotal * 1 + wc_potential_revenue * 1 : 0;

                            //impactRevenueResult += wc_revenue
                        }

                        return {
                            personaStatus: getWebsitesRecordByIdData.data[0].wrong_coupon,
                            // personaRev: (duringPhaseWCData !== null && getEngagePersonaMetricsDuringData.data.length > 0 && !isNaN(duringPhaseWCData.personaMetrics[1].brandlock_on)) ? duringPhaseWCData.personaMetrics[1].brandlock_on : 0,
                            personaRev: (wc_revenue !== null && !isNaN(wc_revenue)) ? wc_revenue : 0,
                            personaRevProjected: (wc_potential_revenue !== null && !isNaN(wc_potential_revenue)) ? wc_potential_revenue : 0,
                            totalAOV: totalAOV !== null ? totalAOV : 0,
                            personaPotentialCRLift: parseFloat(d.industry_std_lift - 1).toFixed(2),
                            personaShortCode: d.short_code,
                            personaOneLineDesc: wcOverviewCardData.description,
                            personaPhase: personaPhase,
                            personaSizeOfGroup: wc_sog !== null ? wc_sog : d.industry_std_sog,
                            checkout_of_all_users: checkout_of_all_users,
                            industryBased: wc_sog != 0 && wc_sog != null ? false : true,
                            personaImage: wrong_coupon_alt,
                            /* impactData: wrongCouponImpactData, */
                            impactData: wrongCouponShopperImpactData !== null && wrongCouponShopperImpactData.hasOwnProperty('data') && wrongCouponShopperImpactData.data,
                            personaImageGif: getWebsitesRecordByIdData.data[0].wrong_coupon ? `//debuficgraftb.cloudfront.net/analytics/img/custom/engage_trigger_images/gif/${getWebsitesRecordByIdData.data[0].web_id}_wc_gif.gif` : false,
                            ...d
                        }
                    } else if (d.short_code === "e-ei") {
                        let prePhaseEEIData = null;
                        let personaRevProjected = 0;
                        let eei_sog = null;
                        let eei_revenue = null;
                        let eei_potential_revenue = null;
                        let industryBased = null;
                        let extensionShopperImpactData = null;
                        let dayCount = null;
                        let indStdRevenue = null;
                        let personaPhase = getWebsitesRecordByIdData.data[0].extension_trigger_split === 100 ? "post" : "during";
                        let totalAOV = null;
                        if (getShieldGADataData.data.total_aov != 0) {
                            totalAOV = parseFloat(getShieldGADataData.data.total_aov).toFixed(2)
                        } else if (!isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
                            totalAOV = listening_phase_aov_30_days
                        }
                        if (getWebsitesRecordByIdData.hasOwnProperty("data") && !getWebsitesRecordByIdData.data[0].extension_trigger) {
                            /*            extensionShopperImpactData = await processExtensionShopperPersonaImpactResult(getEngagePrePhasePersonaImpactData, getShieldGADataData.data, getWebsitesRecordByIdData); */

                            if (getEngagePrePhasePersonaImpactDayCountData !== undefined && getEngagePrePhasePersonaImpactDayCountData.hasOwnProperty('data')) {
                                dayCount = getEngagePrePhasePersonaImpactDayCountData.data[0].days_with_cashback_count * 1;
                            }

                            extensionShopperImpactData = await getEngageExtensionPrePhasePersonaImpact(siteInputs, getShieldGADataData.data, getWebsitesRecordByIdData, getEngagePrePhasePersonaImpactDayCountData, currency, headerConfigPassed);

                            prePhaseEEIData = await processEEIPersonaMetricsResult(getEngagePersonaMetricsWC_EEI_CRData, { totalAOV: getShieldGADataData.data.total_aov }, dayCount, numberOfDays, listening_phase_aov_30_days, currency);

                            /*                         prePhaseEEIData = prePhaseEEIData.personaMetrics[1].brandlock_on != 0 && !isNaN(prePhaseEEIData.personaMetrics[1].brandlock_on) ? prePhaseEEIData.personaMetrics[1].brandlock_on : getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift; */

                            if (prePhaseEEIData.personaMetrics[1].hasOwnProperty('brandlock_on_projected') && prePhaseEEIData.personaMetrics[1].brandlock_on_projected != 0) {
                                personaRevProjected = prePhaseEEIData.personaMetrics[1].brandlock_on_projected;
                            } else if (getShieldGADataData.data.total_transactions != 0 && getShieldGADataData.data.total_aov != 0) {
                                personaRevProjected = getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift;
                                indStdRevenue = true;
                            } else if (!isNaN(listening_phase_orders_30_days) && listening_phase_orders_30_days !== 0 && !isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
                                personaRevProjected = listening_phase_orders_30_days * d.industry_std_transaction_sog * listening_phase_aov_30_days * d.industry_std_lift;
                                indStdRevenue30Days = true;
                            }


                            prePhaseEEIData = personaRevProjected * d.apply_ratio;
                            potentialRevenueTotal = potentialRevenueTotal * 1 + prePhaseEEIData;

                            const eei_users = parseFloat(getEngagePersonaMetricsWC_EEI_CRData.data[0].cashback_users);
                            const total_users = parseFloat(getEngagePersonaMetricsWC_EEI_CRData.data[0].total_users);
                            if (eei_users !== null && total_users !== null && !isNaN(eei_users) && !isNaN(total_users)) {
                                eei_sog = parseFloat((eei_users * 1.0 / total_users) * 100).toFixed(2);
                            }
                            personaPhase = "";
                        } else if (getEngagePersonaDuringSizeOFGroupData.hasOwnProperty('data') && getEngagePersonaDuringSizeOFGroupData.data.length > 0) {

                            const eei_users = parseFloat(getEngagePersonaDuringSizeOFGroupData.data[0].eei_users);
                            const total_users = parseFloat(getEngagePersonaDuringSizeOFGroupData.data[0].users);
                            eei_sog = total_users !== 0 && total_users !== undefined && !isNaN(total_users) ? parseFloat(eei_users / total_users).toFixed(2) * 100 : 0;
                        }


                        if (getEngageGADataData.data.length && getWebsitesRecordByIdData.data[0].extension_trigger) {
                            eei_revenue = getEngageGADataData.data[0].eei_revenue !== null ? parseInt(getEngageGADataData.data[0].eei_revenue) : 0;
                            eei_potential_revenue = getEngageGADataData.data[0].eei_potential_revenue !== null ? parseInt(getEngageGADataData.data[0].eei_potential_revenue) : 0;
                            potentialRevenueTotal = eei_potential_revenue !== null ? potentialRevenueTotal * 1 + eei_potential_revenue * 1 : potentialRevenueTotal;

                            //impactRevenueResult += eei_revenue
                        }
                        return {
                            personaStatus: getWebsitesRecordByIdData.data[0].extension_trigger,
                            personaRev: (prePhaseEEIData !== null && !isNaN(prePhaseEEIData)) ? prePhaseEEIData : !isNaN(eei_revenue) ? eei_revenue : 0,
                            personaRevProjected: (eei_potential_revenue !== null && !isNaN(eei_potential_revenue)) ? eei_potential_revenue : 0,
                            totalAOV: totalAOV !== null ? totalAOV : 0,
                            personaPotentialCRLift: parseFloat(d.industry_std_lift - 1).toFixed(2),
                            personaShortCode: d.short_code,
                            personaOneLineDesc: extensionTriggerOverviewCardData.description,
                            personaPhase: personaPhase,
                            personaSizeOfGroup: eei_sog != 0 && eei_sog !== null ? eei_sog : d.industry_std_sog,
                            industryBased: eei_sog != 0 && eei_sog != null ? false : true,
                            // personaImage: getWebsitesRecordByIdData.data[0].extension_trigger ? `//debuficgraftb.cloudfront.net/analytics/img/custom/engage_trigger_images/images/${getWebsitesRecordByIdData.data[0].web_id}_extension_trigger.png` : `//debuficgraftb.cloudfront.net/analytics/img/custom/engage_trigger_images/images/notactivetrigger.png`,
                            personaImage: extension_shopper_alt,
                            impactData: extensionShopperImpactData !== null && extensionShopperImpactData.hasOwnProperty('data') && extensionShopperImpactData.data,
                            ...d
                        }
                    } else if (d.short_code === "ti3") {
                        let prePhaseTI3Data = null;
                        let personaPhase = getWebsitesRecordByIdData.data[0].hesitant_trigger_split === 100 ? "post" : "during";
                        let personaRevProjected = 0;
                        let ti3_sog = null;
                        let ti3_revenue = null;
                        let ti3_potential_revenue = null;
                        let industryBased = null;
                        let dayCount = null;
                        let indStdRevenue = null;
                        let totalAOV = null;
                        if (getShieldGADataData.data.total_aov != 0) {
                            totalAOV = parseFloat(getShieldGADataData.data.total_aov).toFixed(2)
                        } else if (!isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
                            totalAOV = listening_phase_aov_30_days
                        }
                        if (getWebsitesRecordByIdData.hasOwnProperty("data") && !getWebsitesRecordByIdData.data[0].hesitant_trigger && getEngagePersonaMetricsHesitantShopperData.data.length > 0) {

                            const hesitantShopperImpactDayCount = await getEngagePrePhaseHesitantPersonaImpactDayCount(siteInputs, headerConfigPassed);

                            if (hesitantShopperImpactDayCount !== undefined && hesitantShopperImpactDayCount.hasOwnProperty('data')) {
                                dayCount = hesitantShopperImpactDayCount.data[0].days_with_hesitant_session_count * 1;
                            }

                            prePhaseTI3Data = await processHesitantPersonaMetricsResult(getEngagePersonaMetricsHesitantShopperData, { totalAOV: getShieldGADataData.data.total_aov }, dayCount, numberOfDays, listening_phase_aov_30_days, currency);

                            /*                          prePhaseTI3Data = prePhaseTI3Data.personaMetrics[1].brandlock_on != 0 ? prePhaseTI3Data.personaMetrics[1].brandlock_on : getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift; */

                            if (prePhaseTI3Data.personaMetrics[1].hasOwnProperty('brandlock_on_projected') && prePhaseTI3Data.personaMetrics[1].brandlock_on_projected != 0) {
                                personaRevProjected = prePhaseTI3Data.personaMetrics[1].brandlock_on_projected;
                            } else if (getShieldGADataData.data.total_transactions != 0 && getShieldGADataData.data.total_aov != 0) {
                                personaRevProjected = getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift;
                                indStdRevenue = true;
                            } else if (!isNaN(listening_phase_orders_30_days) && listening_phase_orders_30_days !== 0 && !isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
                                personaRevProjected = listening_phase_orders_30_days * d.industry_std_transaction_sog * listening_phase_aov_30_days * d.industry_std_lift;
                                indStdRevenue30Days = true;
                            }

                            prePhaseTI3Data = personaRevProjected * d.apply_ratio;
                            potentialRevenueTotal = potentialRevenueTotal * 1 + prePhaseTI3Data;

                            ti3_sog = getEngagePersonaMetricsHesitantShopperData.data[0].size_of_group != 0 ? getEngagePersonaMetricsHesitantShopperData.data[0].size_of_group : 0;
                            personaPhase = "";
                        } else if (getEngagePersonaDuringSizeOFGroupData.hasOwnProperty('data') && getEngagePersonaDuringSizeOFGroupData.data.length > 0) {
                            const hesitant_users = parseFloat(getEngagePersonaDuringSizeOFGroupData.data[0].hesitant_users);
                            const total_users = parseFloat(getEngagePersonaDuringSizeOFGroupData.data[0].users);
                            ti3_sog = total_users !== 0 && total_users !== undefined && !isNaN(total_users) ? ((hesitant_users / total_users) * 100).toFixed(2) : 0;
                        }
                        if (getEngageGADataData.data.length && getWebsitesRecordByIdData.data[0].hesitant_trigger) {

                            ti3_revenue = getEngageGADataData.data[0].ti3_revenue !== null ? parseInt(getEngageGADataData.data[0].ti3_revenue) : 0;
                            ti3_potential_revenue = getEngageGADataData.data[0].ti3_potential_revenue !== null ? parseInt(getEngageGADataData.data[0].ti3_potential_revenue) : 0;
                            potentialRevenueTotal = ti3_potential_revenue !== null ? potentialRevenueTotal * 1 + ti3_potential_revenue * 1 : potentialRevenueTotal;
                            //impactRevenueResult += ti3_revenue
                        }

                        return {
                            personaStatus: getWebsitesRecordByIdData.data[0].hesitant_trigger,
                            personaRev: (prePhaseTI3Data !== null && !isNaN(prePhaseTI3Data)) ? prePhaseTI3Data : !isNaN(ti3_revenue) ? ti3_revenue : 0,
                            personaRevProjected: (ti3_potential_revenue !== null && !isNaN(ti3_potential_revenue)) ? ti3_potential_revenue : 0,
                            totalAOV: totalAOV !== null ? totalAOV : 0,
                            personaPotentialCRLift: parseFloat(d.industry_std_lift - 1).toFixed(2),
                            personaShortCode: d.short_code,
                            personaOneLineDesc: ti3OverviewCardData.description,
                            personaPhase: personaPhase,
                            // personaSizeOfGroup: !getWebsitesRecordByIdData.data[0].hesitant_trigger && getEngagePersonaMetricsHesitantShopperData.data.length > 0 && getEngagePersonaMetricsHesitantShopperData.data.length > 0 ? getEngagePersonaMetricsHesitantShopperData.data[0].size_of_group : 0,
                            personaSizeOfGroup: ti3_sog != 0 && ti3_sog !== null ? ti3_sog : d.industry_std_sog,
                            industryBased: ti3_sog != 0 && ti3_sog !== null ? false : true,
                            // personaImage: getWebsitesRecordByIdData.data[0].hesitant_trigger ? `//debuficgraftb.cloudfront.net/analytics/img/custom/engage_trigger_images/images/${getWebsitesRecordByIdData.data[0].web_id}_wrong_coupon.png` : `//debuficgraftb.cloudfront.net/analytics/img/custom/engage_trigger_images/images/notactivetrigger.png`,
                            personaImage: hesitant_shopper_alt,
                            ...d
                        }
                    } else if (d.short_code === "epr") {

                        let prePhaseEPRData = null;
                        let coupon_runner_sog = null;
                        let epr_revenue = null;
                        let epr_potential_revenue = null;
                        let industryBased = null;
                        let couponRunnerImpactData = null;
                        let personaPhase = getWebsitesRecordByIdData.data[0].prediction_trigger_split === 100 ? "post" : "during";
                        let personaRevProjected = 0;
                        let dayCount = null;
                        let indStdRevenue = null;
                        let totalAOV = null;
                        if (getShieldGADataData.data.total_aov != 0) {
                            totalAOV = parseFloat(getShieldGADataData.data.total_aov).toFixed(2)
                        } else if (!isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
                            totalAOV = listening_phase_aov_30_days
                        }
                        if (getWebsitesRecordByIdData.hasOwnProperty("data") && !getWebsitesRecordByIdData.data[0].prediction_trigger) {
                            /* couponRunnerImpactData = await processCouponRunnerPersonaImpactResult(getEngagePrePhasePersonaImpactData, getShieldGADataData.data, getWebsitesRecordByIdData); */

                            if (getEngagePrePhasePersonaImpactDayCountData !== undefined && getEngagePrePhasePersonaImpactDayCountData.hasOwnProperty('data')) {
                                dayCount = getEngagePrePhasePersonaImpactDayCountData.data[0].days_with_coupon_runner_count * 1;
                            }

                            couponRunnerImpactData = await getEngageCouponRunnerPrePhasePersonaImpact(siteInputs, getShieldGADataData.data, getWebsitesRecordByIdData, getEngagePrePhasePersonaImpactDayCountData, currency, headerConfigPassed);
                            prePhaseEPRData = await processCRPersonaMetricsResult(getEngagePersonaMetricsWC_EEI_CRData, { totalAOV: getShieldGADataData.data.total_aov }, dayCount, numberOfDays, listening_phase_aov_30_days, currency);

                            /* 
                                                        prePhaseEPRData = prePhaseEPRData.personaMetrics[1].brandlock_on != 0 ? prePhaseEPRData.personaMetrics[1].brandlock_on : getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift; */

                            if (prePhaseEPRData.personaMetrics[1].hasOwnProperty('brandlock_on_projected') && prePhaseEPRData.personaMetrics[1].brandlock_on_projected != 0) {
                                personaRevProjected = prePhaseEPRData.personaMetrics[1].brandlock_on_projected;
                            } else if (getShieldGADataData.data.total_transactions != 0 && getShieldGADataData.data.total_aov != 0) {
                                personaRevProjected = getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift;
                                indStdRevenue = true;
                            } else if (!isNaN(listening_phase_orders_30_days) && listening_phase_orders_30_days !== 0 && !isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
                                personaRevProjected = listening_phase_orders_30_days * d.industry_std_transaction_sog * listening_phase_aov_30_days * d.industry_std_lift;
                                indStdRevenue30Days = true;
                            }
                            prePhaseEPRData = personaRevProjected * d.apply_ratio;
                            potentialRevenueTotal = potentialRevenueTotal * 1 + prePhaseEPRData;

                            const coupon_runner_users = parseFloat(getEngagePersonaMetricsWC_EEI_CRData.data[0].coupon_runner_users);
                            const total_users = parseFloat(getEngagePersonaMetricsWC_EEI_CRData.data[0].total_users);
                            if (coupon_runner_users !== null && total_users !== null && !isNaN(coupon_runner_users) && !isNaN(total_users)) {
                                coupon_runner_sog = parseFloat((coupon_runner_users * 1.0 / total_users) * 100).toFixed(2);
                                industryBased = coupon_runner_sog != 0 ? false : true;
                                coupon_runner_sog = coupon_runner_sog != 0 ? coupon_runner_sog : d.industry_std_sog;
                            }
                            personaPhase = "";
                        } else if (getEngagePersonaDuringSizeOFGroupData.hasOwnProperty('data') && getEngagePersonaDuringSizeOFGroupData.data.length > 0) {
                            const cr_users = parseFloat(getEngagePersonaDuringSizeOFGroupData.data[0].cr_users);
                            const total_users = parseFloat(getEngagePersonaDuringSizeOFGroupData.data[0].users);
                            coupon_runner_sog = total_users !== 0 && total_users !== undefined && !isNaN(total_users) ? ((cr_users / total_users) * 100).toFixed(2) : 0;
                        }

                        if (getEngageGADataData.data.length && getWebsitesRecordByIdData.data[0].prediction_trigger) {
                            epr_revenue = getEngageGADataData.data[0].epr_revenue !== null ? parseInt(getEngageGADataData.data[0].epr_revenue) : 0;
                            epr_potential_revenue = getEngageGADataData.data[0].epr_potential_revenue !== null ? parseInt(getEngageGADataData.data[0].epr_potential_revenue) : 0;
                            potentialRevenueTotal = epr_potential_revenue !== null ? potentialRevenueTotal * 1 + epr_potential_revenue * 1 : potentialRevenueTotal;

                            //impactRevenueResult += epr_revenue
                        }

                        return {
                            personaStatus: getWebsitesRecordByIdData.data[0].prediction_trigger,
                            personaRev: (prePhaseEPRData !== null && !isNaN(prePhaseEPRData)) ? prePhaseEPRData : !isNaN(epr_revenue) ? epr_revenue : 0,
                            personaRevProjected: (epr_potential_revenue !== null && !isNaN(epr_potential_revenue)) ? epr_potential_revenue : 0,
                            totalAOV: totalAOV !== null ? totalAOV : 0,
                            personaPotentialCRLift: parseFloat(d.industry_std_lift - 1).toFixed(2),
                            personaShortCode: d.short_code,
                            personaOneLineDesc: couponRunnerOverviewCardData.description,
                            personaPhase: personaPhase,
                            personaSizeOfGroup: coupon_runner_sog != 0 && coupon_runner_sog !== null ? coupon_runner_sog : d.industry_std_sog,
                            industryBased,
                            // personaImage: getWebsitesRecordByIdData.data[0].prediction_trigger ? `//debuficgraftb.cloudfront.net/analytics/img/custom/engage_trigger_images/images/${getWebsitesRecordByIdData.data[0].web_id}_prediction_trigger.png` : `//debuficgraftb.cloudfront.net/analytics/img/custom/engage_trigger_images/images/notactivetrigger.png`,
                            personaImage: coupon_runner_alt,
                            impactData: couponRunnerImpactData !== null && couponRunnerImpactData.hasOwnProperty('data') && couponRunnerImpactData.data,
                            ...d
                        }
                    } else if (d.short_code === "cs") {
                        let prePhaseCSData = null;
                        let why_not_sog = null;
                        let cs_revenue = null;
                        let cs_potential_revenue = null;
                        let cs_reduce_cart = null;
                        let industryBased = null;
                        let whyNotShopperImpactData = null;
                        let personaPhase = getWebsitesRecordByIdData.data[0].why_not_trigger_split === 100 ? "post" : "during";
                        let dayCount = null;
                        let prePhaseCSDataProjected = null;
                        let indStdRevenue = null;
                        let totalAOV = null;
                        if (getShieldGADataData.data.total_aov != 0) {
                            totalAOV = parseFloat(getShieldGADataData.data.total_aov).toFixed(2)
                        } else if (!isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
                            totalAOV = listening_phase_aov_30_days
                        }
                        if (getWebsitesRecordByIdData.hasOwnProperty("data") && !getWebsitesRecordByIdData.data[0].whynot_trigger) {
                            whyNotShopperImpactData = await getEngageWhynotPrePhasePersonaImpact(siteInputs, getShieldGADataData.data, getWebsitesRecordByIdData, getEngagePersonaMetricsWhyNotShopperData, getEngagePrePhasePersonaImpactDayCountData, currency, headerConfigPassed);

                            const whyNotShopperImpactDayCount = await getEngagePrePhaseWhyNotPersonaImpactDayCount(siteInputs, headerConfigPassed);

                            if (whyNotShopperImpactDayCount !== undefined && whyNotShopperImpactDayCount.hasOwnProperty('data')) {
                                dayCount = whyNotShopperImpactDayCount.data[0].days_with_cart_reduction * 1;
                            }
                            /*                             whyNotImpactData = await processWhyNotPersonaImpactResult(getEngagePrePhasePersonaImpactData, getShieldGADataData.data, getWebsitesRecordByIdData, getEngagePersonaMetricsWhyNotShopperData); */
                            prePhaseCSData = await processWhyNotPersonaMetricsResult(getEngagePersonaMetricsWhyNotShopperData, { totalAOV: getShieldGADataData.data.total_aov }, dayCount, numberOfDays, currency);


                            /* prePhaseCSData = prePhaseCSData.personaMetrics[1].brandlock_on != 0 ? prePhaseCSData.personaMetrics[1].brandlock_on : getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift; */

                            if (prePhaseCSData.personaMetrics[1].hasOwnProperty('brandlock_on_projected') && prePhaseCSData.personaMetrics[1].brandlock_on_projected != 0) {
                                prePhaseCSDataProjected = prePhaseCSData.personaMetrics[1].brandlock_on_projected
                            } else if (getShieldGADataData.data.total_transactions != 0 && getShieldGADataData.data.total_aov != 0) {
                                prePhaseCSDataProjected = getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift;
                                indStdRevenue = true;
                            } else if (!isNaN(listening_phase_orders_30_days) && listening_phase_orders_30_days !== 0 && !isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
                                prePhaseCSDataProjected = listening_phase_orders_30_days * d.industry_std_transaction_sog * listening_phase_aov_30_days * d.industry_std_lift;
                                indStdRevenue30Days = true;
                            }
                            prePhaseCSData = prePhaseCSDataProjected * d.apply_ratio
                            potentialRevenueTotal = potentialRevenueTotal * 1 + prePhaseCSData;

                            why_not_sog = getEngagePersonaMetricsWhyNotShopperData.data.length > 0 ? parseFloat(getEngagePersonaMetricsWhyNotShopperData.data[0].size_of_users_that_add_to_cart).toFixed(2) : 0;
                            cs_reduce_cart = getEngagePersonaMetricsWhyNotShopperData.data.length > 0 ? parseFloat(getEngagePersonaMetricsWhyNotShopperData.data[0].size_of_users_that_reduce_cart).toFixed(2) : 0;
                            industryBased = why_not_sog != 0 ? false : true;
                            why_not_sog = why_not_sog != 0 ? why_not_sog : d.industry_std_sog;
                            cs_reduce_cart = cs_reduce_cart != 0 && cs_reduce_cart != null ? parseFloat(cs_reduce_cart).toFixed(2) : 0;


                            personaPhase = "";
                        } else if (getEngagePersonaDuringSizeOFGroupData.hasOwnProperty('data') && getEngagePersonaDuringSizeOFGroupData.data.length > 0) {
                            const cs_users = parseFloat(getEngagePersonaDuringSizeOFGroupData.data[0].cs_users);
                            const add_to_cart_users = parseFloat(getEngagePersonaDuringSizeOFGroupData.data[0].add_to_cart_users);
                            const add_to_cart_sessions = parseFloat(getEngagePersonaDuringSizeOFGroupData.data[0].add_to_cart_sessions);
                            const all_users = parseFloat(getEngagePersonaDuringSizeOFGroupData.data[0].users);
                            cs_reduce_cart = add_to_cart_users !== 0 && add_to_cart_users !== undefined && !isNaN(add_to_cart_users) ? ((cs_users / add_to_cart_users) * 100).toFixed(2) : 0;
                            //cs_reduce_cart = add_to_cart_sessions !== 0 && add_to_cart_sessions !== undefined && !isNaN(add_to_cart_sessions) ? parseFloat(cs_users / add_to_cart_sessions).toFixed(2) : 0;
                            why_not_sog = all_users !== 0 && all_users !== undefined && !isNaN(all_users) ? ((cs_users / all_users) * 100).toFixed(2) : 0;
                        }

                        if (getEngageGADataData.data.length && getWebsitesRecordByIdData.data[0].whynot_trigger) {
                            cs_revenue = getEngageGADataData.data[0].cs_revenue !== null ? parseInt(getEngageGADataData.data[0].cs_revenue) : 0;
                            cs_potential_revenue = getEngageGADataData.data[0].cs_potential_revenue !== null ? parseInt(getEngageGADataData.data[0].cs_potential_revenue) : 0;
                            potentialRevenueTotal = cs_potential_revenue !== null ? potentialRevenueTotal * 1 + cs_potential_revenue * 1 : potentialRevenueTotal;

                            //impactRevenueResult += cs_revenue
                        }
                        return {
                            personaStatus: getWebsitesRecordByIdData.data[0].whynot_trigger,
                            personaRev: (prePhaseCSData !== null && !isNaN(prePhaseCSData)) ? prePhaseCSData : !isNaN(cs_revenue) ? cs_revenue : 0,
                            personaRevProjected: (cs_potential_revenue !== null && !isNaN(cs_potential_revenue)) ? cs_potential_revenue : 0,
                            totalAOV: totalAOV !== null ? totalAOV : 0,
                            personaPotentialCRLift: parseFloat(d.industry_std_lift - 1).toFixed(2),
                            personaShortCode: d.short_code,
                            personaOneLineDesc: whyNotShopperOverviewCardData.description,
                            personaPhase: personaPhase,
                            personaSizeOfGroup: why_not_sog !== null ? parseFloat(why_not_sog).toFixed(2) : 0,
                            cs_reduce_cart: cs_reduce_cart !== null ? cs_reduce_cart : 0,
                            industryBased,
                            // personaImage: getWebsitesRecordByIdData.data[0].whynot_trigger ? why_not_shopper_alt : `//debuficgraftb.cloudfront.net/analytics/img/custom/engage_trigger_images/images/notactivetrigger.png`,
                            personaImage: why_not_shopper_alt,
                            impactData: whyNotShopperImpactData !== null && whyNotShopperImpactData.hasOwnProperty('data') && whyNotShopperImpactData.data,
                            ...d
                        }
                    }

                    /* else if (d.short_code === "pp" && this.props.sessionClient.web_id === 246) {
                        let pp_revenue = null;

                        if (getEngageGADataData.data.length) {
                            pp_revenue = parseInt(getEngageGADataData.data[0].premium_product_revenue)
                            premium_product_potential_revenue = parseInt(getEngageGADataData.data[0].premium_product_potential_revenue)
                            //impactRevenueResult += cs_revenue
                        }

                        return {
                            personaStatus: true,
                            personaRev: !isNaN(pp_revenue) ? pp_revenue : 0,
                            totalAOV: totalAOV !== null ? totalAOV : 0,
                            personaPotentialCRLift: "0",
                            personaShortCode: d.short_code,
                            personaOneLineDesc: "",
                            personaPhase: "during",
                            personaSizeOfGroup: 0,
                            personaImage: `//debuficgraftb.cloudfront.net/analytics/img/custom/engage_trigger_images/images/notactivetrigger.png`,
                            ...d
                        }
                    } */

                })
            );
        }
        if (getEngageGADataData !== null && getEngageGADataData.data.length && getEngageGADataData.data[0].hasOwnProperty('total_revenue') && getEngageGADataData.data[0].total_revenue !== undefined && getEngageGADataData.data[0].total_revenue !== null) {
            impactRevenueResult = getEngageGADataData.data[0].total_revenue
        } else {
            impactRevenueResult = 0
        }
        if (prePhasePersonaData !== undefined && prePhasePersonaData.length > 0) {
            if (engageEnable) {
                impactRevenueResult = parseInt(impactRevenueResult) + parseInt(adwareShopperRev)
            } else {
                impactRevenueResult = parseInt(adwareShopperRev)
            }
            this.setState(prevState => {
                return {
                    loading: {
                        status: false,
                        message: ""
                    },
                    impactRevenue: impactRevenueResult,
                    potentialRevenueTotal: potentialRevenueTotal,
                    potentialRevenueTotalIsLoading: false,
                    impactRevenueLoading: false,
                    loadPersonaDetails: false,
                    personaDetailLoader: false,
                    updatedEngagePersonaList: prePhasePersonaData,
                    updatedEngagePersonaListLoading: false,
                    sitePhase: sitePhaseStatus,
                    adwareShopperABPerc
                }
            })
        }

    }





    /* POST PHASE PERSONA DATA */
    async handlePostPhasePersonaUpdates(siteInputs, sitePhaseStatus, adwareShopperABPerc = null) {
        let currency = this.props.sessionClient.currency;
        const headerConfigPassed = {
            headers: {
                Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${getCurrentUser().data.data.refresh_token}`,
            }
        }
        let prePhasePersonaData = [];
        let impactRevenueResult = 0;
        let potentialRevenueTotal = 0;
        let adwareShopperRev = 0;
        let listening_phase_aov_30_days = null;
        let engageEnable = null;
        let listening_phase_orders_30_days = null;
        let numberOfDays = differenceInDays(this.state.endDate, this.state.startDate) + 1;
        let indStdRevenue30Days = null;
        let splitDates = await this.getSplitClientHistory(siteInputs, headerConfigPassed)


        let getEngageGADataData, getEngagePersonaMetricsWhyNotShopperData, getEngagePersonaMetricsHesitantShopperData, getEngagePersonaDuringSizeOFGroupData, getEngagePersonaMetricsWC_EEI_CRData, /* getEngagePersonaMetricsDuringData, */ getWebsitesRecordByIdData, getShieldGADataData, getEngagePrePhasePersonaImpactDayCountData = null;

        [getEngageGADataData, getEngagePersonaMetricsWhyNotShopperData, getEngagePersonaMetricsHesitantShopperData, getEngagePersonaDuringSizeOFGroupData, getEngagePersonaMetricsWC_EEI_CRData, getWebsitesRecordByIdData, getShieldGADataData, getEngagePrePhasePersonaImpactDayCountData] = await Promise.all([
            geteEngageConsolidateRevenue(siteInputs, numberOfDays, headerConfigPassed),
            // geteEngageCouponBreakdown(siteInputs, headerConfigPassed),
            getEngagePersonaMetricsWhyNotShopper(siteInputs, headerConfigPassed),
            getEngagePersonaMetricsHesitantShopper(siteInputs, headerConfigPassed),
            getEngagePersonaDuringSizeOFGroup(siteInputs, headerConfigPassed),
            getEngagePersonaMetricsWC_EEI_CR(siteInputs, headerConfigPassed),
            // getEngagePersonaMetricsDuring(siteInputs, headerConfigPassed),
            getWebsitesRecordById(this.props.sessionClient.web_id, headerConfigPassed),
            getShieldGAData(siteInputs, headerConfigPassed),
            getEngagePrePhasePersonaImpactDayCount(siteInputs, headerConfigPassed)
        ]);


        const getShieldYTDData = await getShieldYTD(siteInputs, splitDates, headerConfigPassed)
        if (getWebsitesRecordByIdData !== undefined && getWebsitesRecordByIdData.hasOwnProperty('data') && getWebsitesRecordByIdData.data.length) {
            listening_phase_aov_30_days = getWebsitesRecordByIdData.data[0].listening_phase_aov_30_days;
            listening_phase_orders_30_days = getWebsitesRecordByIdData.data[0].listening_phase_orders_30_days;
            engageEnable = getWebsitesRecordByIdData.data[0].engage;
        }
        if (!this.state.engagePersonaListLoading) {
            prePhasePersonaData = await Promise.all(
                this.state.engagePersonaList.map(async (d) => {

                    if (d.short_code === "shield") {

                        let ab_status = null;
                        let personaPhase = "protection";
                        let totalAOV = null;
                        let industryBased = null;
                        let personaSizeOfGroup = null;
                        if (!this.state.topInjectionTypesLoading && this.state.topInjectionTypes !== undefined && this.state.topInjectionTypes !== null && this.state.topInjectionTypes !== 0 && this.state.topInjectionTypes.hasOwnProperty('data') && this.state.topInjectionTypes.data.length && this.state.topInjectionTypes.data[0].adware_sog !== null && this.state.topInjectionTypes.data[0].adware_sog !== 0) {
                            personaSizeOfGroup = this.state.topInjectionTypes.data[0].adware_sog;
                            industryBased = false;
                        } else {
                            personaSizeOfGroup = d.industry_std_sog;
                            industryBased = true
                        }
                        if (getShieldGADataData.data.total_aov != 0) {
                            totalAOV = parseFloat(getShieldGADataData.data.total_aov).toFixed(2)
                        } else if (!isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
                            totalAOV = listening_phase_aov_30_days
                        }
                        if (getWebsitesRecordByIdData.hasOwnProperty("data") && getWebsitesRecordByIdData.data.length !== 0) {
                            ab_status = getWebsitesRecordByIdData.data[0].ab_status;
                        }
                        if (ab_status === false || ab_status === null || ab_status === '') {
                            const getListeningPhaseIndustryStdData = await getListeningPhaseIndustryStd(siteInputs, headerConfigPassed);
                            if (getListeningPhaseIndustryStdData.hasOwnProperty('data') && getListeningPhaseIndustryStdData.data.length) {
                                let industyStdData = getListeningPhaseIndustryStdData.data[0];
                                const conversionLift = 6;
                                const rpsLift = 5;
                                const recoveredRevenue = industyStdData.projected_recovered_revenue
                                potentialRevenueTotal = recoveredRevenue !== null ? potentialRevenueTotal * 1 + recoveredRevenue * 1 : potentialRevenueTotal;
                                return {
                                    personaOneLineDesc: adwareShopperOverviewCardData.description,
                                    personaOverview: adwareShopperOverviewCardData,
                                    personaStatus: ab_status,
                                    conversionLift: conversionLift > 0 ? `${parseFloat(conversionLift).toFixed(2)}%` : 0,
                                    revenuePerSessionLift: rpsLift > 0 ? `${parseFloat(rpsLift).toFixed(2)}%` : 0,
                                    personaRev: recoveredRevenue !== undefined && recoveredRevenue !== null && recoveredRevenue > 0 ? `${parseFloat(recoveredRevenue).toFixed(2)}` : 0,
                                    recoveredRevenue: recoveredRevenue > 0 ? `${parseFloat(recoveredRevenue).toFixed(2)}` : 0,
                                    personaRevProjected: recoveredRevenue !== undefined && recoveredRevenue !== null && recoveredRevenue > 0 ? recoveredRevenue : 0,
                                    personaSizeOfGroup: personaSizeOfGroup,
                                    industryBased,
                                    personaPhase: "",
                                    industryBased: false,
                                    industryStd: true,
                                    metricsData: processShieldMetricsIndustryStd(industyStdData, currency),
                                    metricsDataLoading: false,
                                    personaImage: adware_shopper_alt,
                                    personaShortCode: d.short_code,
                                    ...d
                                }
                            } else {
                                return {
                                    personaOneLineDesc: adwareShopperOverviewCardData.description,
                                    personaOverview: adwareShopperOverviewCardData,
                                    conversionLift: 0,
                                    revenuePerSessionLift: 0,
                                    recoveredRevenue: 0,
                                    personaRev: 0,
                                    protectedSessions: 0,
                                    personaSizeOfGroup: personaSizeOfGroup,
                                    industryBased,
                                    metricsData: null,
                                    metricsDataLoading: false,
                                    personaStatus: ab_status,
                                    personaPhase,
                                    personaImage: adware_shopper_alt,
                                    personaShortCode: d.short_code,
                                    ...d
                                }
                            }
                        } else if (getWebsitesRecordByIdData.data[0].ab_perc !== 100 || (adwareShopperABPerc !== null && adwareShopperABPerc !== 100)) {
                            let recoveredRevenueYTD = 0;
                            let adwareDayCount = 0;
                            let personaRevProjected = 0;
                            let abPerc = 0;
                            if (getShieldYTDData.statuscode !== undefined && getShieldYTDData.statuscode === 200) {
                                recoveredRevenueYTD = getShieldYTDData.data.recovered_revenue;
                                adwareDayCount = getShieldYTDData.data.adware_day_count;
                                adwareShopperRev = parseInt(recoveredRevenueYTD) >= 0 ? parseInt(recoveredRevenueYTD) : 0
                                abPerc = getWebsitesRecordByIdData.data[0].ab_perc
                                personaRevProjected = adwareShopperRev !== 0 && adwareDayCount !== 0 && abPerc !== 0 && abPerc !== null ? Math.round((((adwareShopperRev * (100 - abPerc)) / abPerc) * numberOfDays) / adwareDayCount) : 0;
                                potentialRevenueTotal = potentialRevenueTotal * 1 + personaRevProjected * 1;

                            }
                            if (getShieldGADataData.statuscode !== undefined && getShieldGADataData.statuscode === 200 && !getShieldGADataData.data.hasOwnProperty('noData')) {
                                const conversionLift = getShieldGADataData.data.conversion_lift
                                const rpsLift = getShieldGADataData.data.rps_lift
                                const recoveredRevenue = getShieldGADataData.data.recovered_revenue
                                return {
                                    personaOneLineDesc: adwareShopperOverviewCardData.description,
                                    personaOverview: adwareShopperOverviewCardData,
                                    personaStatus: ab_status,
                                    conversionLift: conversionLift > 0 ? `${parseFloat(conversionLift).toFixed(2)}%` : 0,
                                    revenuePerSessionLift: rpsLift > 0 ? `${parseFloat(rpsLift).toFixed(2)}%` : 0,
                                    recoveredRevenue: recoveredRevenueYTD > 0 ? `${parseInt(recoveredRevenueYTD)}` : 0,
                                    personaRev: recoveredRevenueYTD > 0 ? `${parseInt(recoveredRevenueYTD)}` : 0,
                                    personaRevProjected: personaRevProjected > 0 ? `${parseInt(personaRevProjected)}` : 0,
                                    personaPhase,
                                    personaSizeOfGroup: personaSizeOfGroup,
                                    industryBased,
                                    industryStd: false,
                                    metricsData: processShieldMetrics(getShieldGADataData, currency),
                                    metricsDataLoading: false,
                                    personaImage: adware_shopper_alt,
                                    personaShortCode: d.short_code,
                                    ...d
                                }
                            } else {
                                return {
                                    personaOneLineDesc: adwareShopperOverviewCardData.description,
                                    personaOverview: adwareShopperOverviewCardData,
                                    conversionLift: 0,
                                    revenuePerSessionLift: 0,
                                    recoveredRevenue: 0,
                                    personaRev: 0,
                                    personaSizeOfGroup: personaSizeOfGroup,
                                    industryBased,
                                    protectedSessions: 0,
                                    metricsData: null,
                                    personaStatus: ab_status,
                                    personaPhase,
                                    personaImage: adware_shopper_alt,
                                    personaShortCode: d.short_code,
                                    ...d
                                }
                            }
                        } else {
                            let protectedSessions = 0;
                            const postPhaseMetrics = await getPostPhaseAdwareShopperData(siteInputs, headerConfigPassed);
                            let industryStd = false;
                            let processedPostPhaseMetricsData = null;
                            let conversionLift = 0;
                            let rpsLift = 0;
                            let recoveredRevenueYTD = 0;
                            if (getShieldYTDData.statuscode !== undefined && getShieldYTDData.statuscode === 200) {
                                recoveredRevenueYTD = getShieldYTDData.data.recovered_revenue;
                                adwareShopperRev = getShieldYTDData.data.recovered_revenue;
                            }

                            if (postPhaseMetrics !== undefined && postPhaseMetrics.statuscode && postPhaseMetrics.hasOwnProperty('data') && postPhaseMetrics.data.length) {
                                conversionLift = postPhaseMetrics.data[0].improvement_in_cr
                                rpsLift = postPhaseMetrics.data[0].improvement_in_rps
                                /*                                 recoveredRevenue = postPhaseMetrics.data[0].c_revenue
                                                                adwareShopperRev = parseInt(recoveredRevenue) >= 0 ? parseInt(recoveredRevenue) : 0 */
                                //potentialRevenueTotal = potentialRevenueTotal * 1 + adwareShopperRev * 1;
                                processedPostPhaseMetricsData = processPostPhaseShieldMetrics(postPhaseMetrics)
                            }
                            if (getShieldGADataData.statuscode !== undefined && getShieldGADataData.statuscode === 200 && !getShieldGADataData.data.hasOwnProperty('noData')) {
                                protectedSessions = getShieldGADataData.data.protected_sessions;
                            }
                            const topMaliciousScripts = await getTopMaliciousScripts(siteInputs, headerConfigPassed);
                            return {
                                personaOneLineDesc: adwareShopperOverviewCardData.description,
                                personaOverview: adwareShopperOverviewCardData,
                                topMaliciousScripts: topMaliciousScripts.data[0],
                                personaStatus: ab_status,
                                personaPhase: "live",
                                industryStd: industryStd,
                                conversionLift: conversionLift > 0 ? `${parseFloat(conversionLift).toFixed(2)}%` : 0,
                                revenuePerSessionLift: rpsLift > 0 ? `${parseFloat(rpsLift).toFixed(2)}%` : 0,
                                recoveredRevenue: recoveredRevenueYTD > 0 ? `${parseFloat(recoveredRevenueYTD).toFixed(2)}` : 0,
                                personaRev: recoveredRevenueYTD > 0 ? `${parseFloat(recoveredRevenueYTD).toFixed(2)}` : 0,
                                metricsData: processedPostPhaseMetricsData !== null ? processedPostPhaseMetricsData : [],
                                personaSizeOfGroup: personaSizeOfGroup,
                                industryBased,
                                metricsDataLoading: false,
                                protectedSessions,
                                personaImage: adware_shopper_alt,
                                personaShortCode: d.short_code,
                                ...d
                            }
                        }
                    } else if (d.short_code === "wc") {

                        if (!getWebsitesRecordByIdData.data[0].wrong_coupon_eligible) {
                            return processIneligibleShopper(d)
                        }
                        // let duringPhaseWCData = await processWCPersonaMetricsResultDuring(getEngagePersonaMetricsDuringData);
                        let wc_sog = null;
                        let wc_revenue = null;
                        let wc_potential_revenue = null;
                        let checkout_of_all_users = null;
                        let industryBased = null;
                        let wrongCouponShopperImpactData = null;
                        let personaRevProjected = 0;
                        let dayCount = null;
                        let totalAOV = null;
                        if (getShieldGADataData.data.total_aov != 0) {
                            totalAOV = parseFloat(getShieldGADataData.data.total_aov).toFixed(2)
                        } else if (!isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
                            totalAOV = listening_phase_aov_30_days
                        }
                        let personaPhase = getWebsitesRecordByIdData.data[0].wrong_coupon_trigger_split === 100 ? "post" : "during";
                        if (getWebsitesRecordByIdData.hasOwnProperty("data") && !getWebsitesRecordByIdData.data[0].wrong_coupon) {
                            let indStdRevenue = null;
                            if (getEngagePrePhasePersonaImpactDayCountData !== undefined && getEngagePrePhasePersonaImpactDayCountData.hasOwnProperty('data')) {
                                dayCount = getEngagePrePhasePersonaImpactDayCountData.data[0].days_with_wc_count * 1;
                            }
                            const wcData = await processWCPersonaMetricsResult(getEngagePersonaMetricsWC_EEI_CRData, { totalAOV: getShieldGADataData.data.total_aov }, dayCount, numberOfDays, listening_phase_aov_30_days, currency);

                            let personaRev = wcData.personaMetrics[1].hasOwnProperty('brandlock_on') && wcData.personaMetrics[1].brandlock_on != 0 ? wcData.personaMetrics[1].brandlock_on : 0;
                            if (wcData.personaMetrics[1].hasOwnProperty('brandlock_on_projected') && wcData.personaMetrics[1].brandlock_on_projected != 0) {
                                personaRevProjected = wcData.personaMetrics[1].brandlock_on_projected;
                            } else if (getShieldGADataData.data.total_transactions != 0 && getShieldGADataData.data.total_aov != 0) {
                                personaRevProjected = getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift;
                                indStdRevenue = true;
                            } else if (!isNaN(listening_phase_orders_30_days) && listening_phase_orders_30_days !== 0 && !isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
                                personaRevProjected = listening_phase_orders_30_days * d.industry_std_transaction_sog * listening_phase_aov_30_days * d.industry_std_lift;
                                indStdRevenue30Days = true;
                            }

                            wc_revenue = personaRevProjected !== null ? personaRevProjected * d.apply_ratio * 1 : 0;
                            potentialRevenueTotal = potentialRevenueTotal * 1 + wc_revenue;

                            wrongCouponShopperImpactData = await getEngageWrongCouponPrePhasePersonaImpact(siteInputs, getShieldGADataData.data, getWebsitesRecordByIdData, getEngagePrePhasePersonaImpactDayCountData, currency, headerConfigPassed);

                            const rc_users = parseFloat(getEngagePersonaMetricsWC_EEI_CRData.data[0].rc_users);
                            const wc_users = parseFloat(getEngagePersonaMetricsWC_EEI_CRData.data[0].wc_users);
                            const checkout_users = parseFloat(getEngagePersonaMetricsWC_EEI_CRData.data[0].checkout_users);
                            const total_users = parseFloat(getEngagePersonaMetricsWC_EEI_CRData.data[0].total_users);
                            if (checkout_users !== null && wc_users !== null && !isNaN(wc_users) && !isNaN(checkout_users)) {
                                wc_sog = checkout_users !== 0 && checkout_users !== undefined && !isNaN(checkout_users) ? ((wc_users / checkout_users) * 100).toFixed(2) : 0;
                                checkout_of_all_users = (wc_users * 1.0 / (total_users) * 100).toFixed(2);
                            }
                            personaPhase = "";
                        } else if (getEngagePersonaDuringSizeOFGroupData.hasOwnProperty('data') && getEngagePersonaDuringSizeOFGroupData.data.length > 0) {
                            const wc_users = parseFloat(getEngagePersonaDuringSizeOFGroupData.data[0].wc_users);
                            const coupon_users = parseFloat(getEngagePersonaDuringSizeOFGroupData.data[0].coupon_users);
                            const checkout_users = parseFloat(getEngagePersonaDuringSizeOFGroupData.data[0].checkout_users);
                            const total_users = parseFloat(getEngagePersonaDuringSizeOFGroupData.data[0].users);
                            wc_sog = checkout_users !== 0 && checkout_users !== undefined && !isNaN(checkout_users) ? ((wc_users / checkout_users) * 100).toFixed(2) : 0;
                            checkout_of_all_users = (wc_users * 1.0 / (total_users) * 100).toFixed(2);
                        }

                        if (getWebsitesRecordByIdData.hasOwnProperty("data") && getWebsitesRecordByIdData.data[0].wrong_coupon && getEngageGADataData.data.length) {
                            wc_revenue = getEngageGADataData.data[0].wc_revenue !== null ? parseInt(getEngageGADataData.data[0].wc_revenue) : 0;
                            wc_potential_revenue = getEngageGADataData.data[0].wc_potential_revenue !== null ? parseInt(getEngageGADataData.data[0].wc_potential_revenue) : 0;
                            potentialRevenueTotal = potentialRevenueTotal * 1 + wc_potential_revenue * 1;

                            //impactRevenueResult += wc_revenue
                        }

                        return {
                            personaStatus: getWebsitesRecordByIdData.data[0].wrong_coupon,
                            personaRev: (wc_revenue !== null && !isNaN(wc_revenue)) ? wc_revenue : 0,
                            personaRevProjected: (wc_potential_revenue !== null && !isNaN(wc_potential_revenue)) ? wc_potential_revenue : 0,
                            totalAOV: totalAOV !== null ? totalAOV : 0,
                            personaPotentialCRLift: parseFloat(d.industry_std_lift - 1).toFixed(2),
                            personaShortCode: d.short_code,
                            personaOneLineDesc: wcOverviewCardData.description,
                            personaPhase: personaPhase,
                            personaSizeOfGroup: wc_sog != 0 && wc_sog != null ? wc_sog : d.industry_std_sog,
                            checkout_of_all_users: checkout_of_all_users,
                            industryBased: wc_sog != 0 && wc_sog != null ? false : true,
                            personaImage: wrong_coupon_alt,
                            /* impactData: wrongCouponImpactData, */
                            impactData: wrongCouponShopperImpactData !== null && wrongCouponShopperImpactData.hasOwnProperty('data') && wrongCouponShopperImpactData.data,
                            personaImageGif: getWebsitesRecordByIdData.data[0].wrong_coupon ? `//debuficgraftb.cloudfront.net/analytics/img/custom/engage_trigger_images/gif/${getWebsitesRecordByIdData.data[0].web_id}_wc_gif.gif` : false,
                            dayCount, numberOfDays, listening_phase_aov_30_days,
                            ...d
                        }
                    } else if (d.short_code === "e-ei") {
                        let prePhaseEEIData = null;
                        let eei_sog = null;
                        let eei_revenue = null;
                        let eei_potential_revenue = null;
                        let industryBased = null;
                        let extensionShopperImpactData = null;
                        let personaPhase = getWebsitesRecordByIdData.data[0].extension_trigger_split === 100 ? "post" : "during";
                        let personaRevProjected = 0;
                        let dayCount = null;
                        let indStdRevenue = null;
                        let totalAOV = null;
                        if (getShieldGADataData.data.total_aov != 0) {
                            totalAOV = parseFloat(getShieldGADataData.data.total_aov).toFixed(2)
                        } else if (!isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
                            totalAOV = listening_phase_aov_30_days
                        }
                        if (getWebsitesRecordByIdData.hasOwnProperty("data") && !getWebsitesRecordByIdData.data[0].extension_trigger) {
                            if (getEngagePrePhasePersonaImpactDayCountData !== undefined && getEngagePrePhasePersonaImpactDayCountData.hasOwnProperty('data')) {
                                dayCount = getEngagePrePhasePersonaImpactDayCountData.data[0].days_with_cashback_count * 1;
                            }
                            extensionShopperImpactData = await getEngageExtensionPrePhasePersonaImpact(siteInputs, getShieldGADataData.data, getWebsitesRecordByIdData, getEngagePrePhasePersonaImpactDayCountData, currency, headerConfigPassed);
                            /* extensionShopperImpactData = await processExtensionShopperPersonaImpactResult(getEngagePrePhasePersonaImpactData, getShieldGADataData.data, getWebsitesRecordByIdData); */
                            prePhaseEEIData = await processEEIPersonaMetricsResult(getEngagePersonaMetricsWC_EEI_CRData, { totalAOV: getShieldGADataData.data.total_aov }, dayCount, numberOfDays, listening_phase_aov_30_days, currency);
                            if (prePhaseEEIData.personaMetrics[1].hasOwnProperty('brandlock_on_projected') && prePhaseEEIData.personaMetrics[1].brandlock_on_projected != 0) {
                                personaRevProjected = prePhaseEEIData.personaMetrics[1].brandlock_on_projected;
                            } else if (getShieldGADataData.data.total_transactions != 0 && getShieldGADataData.data.total_aov != 0) {
                                personaRevProjected = getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift;
                                indStdRevenue = true;
                            } else if (!isNaN(listening_phase_orders_30_days) && listening_phase_orders_30_days !== 0 && !isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
                                personaRevProjected = listening_phase_orders_30_days * d.industry_std_transaction_sog * listening_phase_aov_30_days * d.industry_std_lift;
                                indStdRevenue30Days = true;
                            }


                            prePhaseEEIData = personaRevProjected * d.apply_ratio;
                            potentialRevenueTotal = potentialRevenueTotal * 1 + prePhaseEEIData;

                            const eei_users = parseFloat(getEngagePersonaMetricsWC_EEI_CRData.data[0].cashback_users);
                            const total_users = parseFloat(getEngagePersonaMetricsWC_EEI_CRData.data[0].total_users);
                            if (eei_users !== null && total_users !== null && !isNaN(eei_users) && !isNaN(total_users)) {
                                eei_sog = parseFloat((eei_users * 1.0 / total_users) * 100).toFixed(2);
                            }
                            personaPhase = "";
                        } else if (getEngagePersonaDuringSizeOFGroupData.hasOwnProperty('data') && getEngagePersonaDuringSizeOFGroupData.data.length > 0) {

                            const eei_users = parseFloat(getEngagePersonaDuringSizeOFGroupData.data[0].eei_users);
                            const total_users = parseFloat(getEngagePersonaDuringSizeOFGroupData.data[0].users);
                            eei_sog = total_users !== 0 && total_users !== undefined && !isNaN(total_users) ? ((eei_users / total_users) * 100).toFixed(2) : 0;
                        }

                        if (getEngageGADataData.data.length && getWebsitesRecordByIdData.data[0].extension_trigger) {
                            eei_revenue = getEngageGADataData.data[0].eei_revenue !== null ? parseInt(getEngageGADataData.data[0].eei_revenue) : 0;
                            eei_potential_revenue = getEngageGADataData.data[0].eei_potential_revenue !== null ? parseInt(getEngageGADataData.data[0].eei_potential_revenue) : 0;
                            potentialRevenueTotal = potentialRevenueTotal * 1 + eei_potential_revenue * 1;

                            //impactRevenueResult += eei_revenue
                        }

                        return {
                            personaStatus: getWebsitesRecordByIdData.data[0].extension_trigger,
                            personaRev: (prePhaseEEIData !== null && !isNaN(prePhaseEEIData)) ? prePhaseEEIData : !isNaN(eei_revenue) ? eei_revenue : 0,
                            personaRevProjected: (eei_potential_revenue !== null && !isNaN(eei_potential_revenue)) ? eei_potential_revenue : 0,
                            totalAOV: totalAOV !== null ? totalAOV : 0,
                            personaPotentialCRLift: parseFloat(d.industry_std_lift - 1).toFixed(2),
                            personaShortCode: d.short_code,
                            personaOneLineDesc: extensionTriggerOverviewCardData.description,
                            personaPhase: personaPhase,
                            personaSizeOfGroup: eei_sog != 0 && eei_sog !== null ? eei_sog : d.industry_std_sog,
                            industryBased: eei_sog != 0 && eei_sog != null ? false : true,
                            // personaImage: getWebsitesRecordByIdData.data[0].extension_trigger ? `//debuficgraftb.cloudfront.net/analytics/img/custom/engage_trigger_images/images/${getWebsitesRecordByIdData.data[0].web_id}_extension_trigger.png` : `//debuficgraftb.cloudfront.net/analytics/img/custom/engage_trigger_images/images/notactivetrigger.png`,
                            personaImage: extension_shopper_alt,
                            impactData: extensionShopperImpactData !== null && extensionShopperImpactData.hasOwnProperty('data') && extensionShopperImpactData.data,
                            ...d
                        }
                    } else if (d.short_code === "ti3") {
                        let prePhaseTI3Data = null;
                        let personaPhase = getWebsitesRecordByIdData.data[0].hesitant_trigger_split === 100 ? "post" : "during";
                        let personaRevProjected = 0;
                        let ti3_sog = null;
                        let ti3_revenue = null;
                        let ti3_potential_revenue = null;
                        let industryBased = null;
                        let dayCount = null;
                        let indStdRevenue = null;
                        let totalAOV = null;
                        if (getShieldGADataData.data.total_aov != 0) {
                            totalAOV = parseFloat(getShieldGADataData.data.total_aov).toFixed(2)
                        } else if (!isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
                            totalAOV = listening_phase_aov_30_days
                        }
                        if (getWebsitesRecordByIdData.hasOwnProperty("data") && !getWebsitesRecordByIdData.data[0].hesitant_trigger && getEngagePersonaMetricsHesitantShopperData.data.length > 0) {

                            const hesitantShopperImpactDayCount = await getEngagePrePhaseHesitantPersonaImpactDayCount(siteInputs, headerConfigPassed);

                            if (hesitantShopperImpactDayCount !== undefined && hesitantShopperImpactDayCount.hasOwnProperty('data')) {
                                dayCount = hesitantShopperImpactDayCount.data[0].days_with_hesitant_session_count * 1;
                            }
                            prePhaseTI3Data = await processHesitantPersonaMetricsResult(getEngagePersonaMetricsHesitantShopperData, { totalAOV: getShieldGADataData.data.total_aov }, dayCount, numberOfDays, listening_phase_aov_30_days, currency);

                            /*                          prePhaseTI3Data = prePhaseTI3Data.personaMetrics[1].brandlock_on != 0 ? prePhaseTI3Data.personaMetrics[1].brandlock_on : getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift; */

                            if (prePhaseTI3Data.personaMetrics[1].hasOwnProperty('brandlock_on_projected') && prePhaseTI3Data.personaMetrics[1].brandlock_on_projected != 0) {
                                personaRevProjected = prePhaseTI3Data.personaMetrics[1].brandlock_on_projected;
                            } else if (getShieldGADataData.data.total_transactions != 0 && getShieldGADataData.data.total_aov != 0) {
                                personaRevProjected = getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift;
                                indStdRevenue = true;
                            } else if (!isNaN(listening_phase_orders_30_days) && listening_phase_orders_30_days !== 0 && !isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
                                personaRevProjected = listening_phase_orders_30_days * d.industry_std_transaction_sog * listening_phase_aov_30_days * d.industry_std_lift;
                                indStdRevenue30Days = true;
                            }

                            prePhaseTI3Data = personaRevProjected * d.apply_ratio;
                            potentialRevenueTotal = potentialRevenueTotal * 1 + prePhaseTI3Data;

                            ti3_sog = getEngagePersonaMetricsHesitantShopperData.data[0].size_of_group != 0 ? getEngagePersonaMetricsHesitantShopperData.data[0].size_of_group : 0;
                            personaPhase = "";
                        } else if (getEngagePersonaDuringSizeOFGroupData.hasOwnProperty('data') && getEngagePersonaDuringSizeOFGroupData.data.length > 0) {
                            const hesitant_users = parseFloat(getEngagePersonaDuringSizeOFGroupData.data[0].hesitant_users);
                            const total_users = parseFloat(getEngagePersonaDuringSizeOFGroupData.data[0].users);
                            ti3_sog = total_users !== 0 && total_users !== undefined && !isNaN(total_users) ? ((hesitant_users / total_users) * 100).toFixed(2) : 0;
                        }

                        if (getEngageGADataData.data.length && getWebsitesRecordByIdData.data[0].hesitant_trigger) {
                            ti3_revenue = getEngageGADataData.data[0].ti3_revenue !== null ? parseInt(getEngageGADataData.data[0].ti3_revenue) : 0;
                            ti3_potential_revenue = getEngageGADataData.data[0].ti3_potential_revenue !== null ? parseInt(getEngageGADataData.data[0].ti3_potential_revenue) : 0;
                            potentialRevenueTotal = potentialRevenueTotal * 1 + ti3_potential_revenue * 1;

                            //impactRevenueResult += ti3_revenue
                        }
                        return {
                            personaStatus: getWebsitesRecordByIdData.data[0].hesitant_trigger,
                            personaRev: (prePhaseTI3Data !== null && !isNaN(prePhaseTI3Data)) ? prePhaseTI3Data : !isNaN(ti3_revenue) ? ti3_revenue : 0,
                            personaRevProjected: (ti3_potential_revenue !== null && !isNaN(ti3_potential_revenue)) ? ti3_potential_revenue : 0,
                            totalAOV: totalAOV !== null ? totalAOV : 0,
                            personaPotentialCRLift: parseFloat(d.industry_std_lift - 1).toFixed(2),
                            personaShortCode: d.short_code,
                            personaOneLineDesc: ti3OverviewCardData.description,
                            personaPhase: personaPhase,
                            // personaSizeOfGroup: !getWebsitesRecordByIdData.data[0].hesitant_trigger && getEngagePersonaMetricsHesitantShopperData.data.length > 0 && getEngagePersonaMetricsHesitantShopperData.data.length > 0 ? getEngagePersonaMetricsHesitantShopperData.data[0].size_of_group : 0,
                            personaSizeOfGroup: ti3_sog != 0 && ti3_sog !== null ? ti3_sog : d.industry_std_sog,
                            industryBased: ti3_sog != 0 && ti3_sog !== null ? false : true,
                            // personaImage: getWebsitesRecordByIdData.data[0].hesitant_trigger ? `//debuficgraftb.cloudfront.net/analytics/img/custom/engage_trigger_images/images/${getWebsitesRecordByIdData.data[0].web_id}_wrong_coupon.png` : `//debuficgraftb.cloudfront.net/analytics/img/custom/engage_trigger_images/images/notactivetrigger.png`,
                            personaImage: hesitant_shopper_alt,
                            ...d
                        }
                    } else if (d.short_code === "epr") {

                        let prePhaseEPRData = null;
                        let coupon_runner_sog = null;
                        let epr_revenue = null;
                        let epr_potential_revenue = null;
                        let industryBased = null;
                        let couponRunnerImpactData = null;
                        let personaPhase = getWebsitesRecordByIdData.data[0].prediction_trigger_split === 100 ? "post" : "during";
                        let personaRevProjected = 0;
                        let dayCount = null;
                        let indStdRevenue = null;
                        let totalAOV = null;
                        if (getShieldGADataData.data.total_aov != 0) {
                            totalAOV = parseFloat(getShieldGADataData.data.total_aov).toFixed(2)
                        } else if (!isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
                            totalAOV = listening_phase_aov_30_days
                        }
                        if (getWebsitesRecordByIdData.hasOwnProperty("data") && !getWebsitesRecordByIdData.data[0].prediction_trigger) {
                            if (getEngagePrePhasePersonaImpactDayCountData !== undefined && getEngagePrePhasePersonaImpactDayCountData.hasOwnProperty('data')) {
                                dayCount = getEngagePrePhasePersonaImpactDayCountData.data[0].days_with_coupon_runner_count * 1;
                            }
                            prePhaseEPRData = await processCRPersonaMetricsResult(getEngagePersonaMetricsWC_EEI_CRData, { totalAOV: getShieldGADataData.data.total_aov }, dayCount, numberOfDays, listening_phase_aov_30_days, currency);
                            /* couponRunnerImpactData = await processCouponRunnerPersonaImpactResult(getEngagePrePhasePersonaImpactData, getShieldGADataData.data, getWebsitesRecordByIdData); */
                            /* couponRunnerImpactData = await getEngageCouponRunnerPrePhasePersonaImpact(siteInputs, getShieldGADataData.data, getWebsitesRecordByIdData, getEngagePrePhasePersonaImpactDayCountData, currency,  headerConfigPassed); */
                            couponRunnerImpactData = await getEngageCouponRunnerPrePhasePersonaImpact(siteInputs, getShieldGADataData.data, getWebsitesRecordByIdData, getEngagePrePhasePersonaImpactDayCountData, currency, headerConfigPassed);

                            if (prePhaseEPRData.personaMetrics[1].hasOwnProperty('brandlock_on_projected') && prePhaseEPRData.personaMetrics[1].brandlock_on_projected != 0) {
                                personaRevProjected = prePhaseEPRData.personaMetrics[1].brandlock_on_projected;
                            } else if (getShieldGADataData.data.total_transactions != 0 && getShieldGADataData.data.total_aov != 0) {
                                personaRevProjected = getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift;
                                indStdRevenue = true;
                            } else if (!isNaN(listening_phase_orders_30_days) && listening_phase_orders_30_days !== 0 && !isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
                                personaRevProjected = listening_phase_orders_30_days * d.industry_std_transaction_sog * listening_phase_aov_30_days * d.industry_std_lift;
                                indStdRevenue30Days = true;
                            }
                            prePhaseEPRData = personaRevProjected * d.apply_ratio;
                            potentialRevenueTotal = potentialRevenueTotal * 1 + prePhaseEPRData;

                            const coupon_runner_users = parseFloat(getEngagePersonaMetricsWC_EEI_CRData.data[0].coupon_runner_users);
                            const total_users = parseFloat(getEngagePersonaMetricsWC_EEI_CRData.data[0].total_users);
                            if (coupon_runner_users !== null && total_users !== null && !isNaN(coupon_runner_users) && !isNaN(total_users)) {
                                coupon_runner_sog = parseFloat((coupon_runner_users * 1.0 / total_users) * 100).toFixed(2);
                                coupon_runner_sog = coupon_runner_sog != 0 ? coupon_runner_sog : d.industry_std_sog;
                                industryBased = coupon_runner_sog != 0 ? false : true;
                            }
                            personaPhase = "";
                        } else if (getEngagePersonaDuringSizeOFGroupData.hasOwnProperty('data') && getEngagePersonaDuringSizeOFGroupData.data.length > 0) {
                            const cr_users = parseFloat(getEngagePersonaDuringSizeOFGroupData.data[0].cr_users);
                            const total_users = parseFloat(getEngagePersonaDuringSizeOFGroupData.data[0].users);
                            coupon_runner_sog = total_users !== 0 && total_users !== undefined && !isNaN(total_users) ? parseFloat((cr_users / total_users) * 100).toFixed(2) : 0;
                        }


                        if (getEngageGADataData.data.length && getWebsitesRecordByIdData.data[0].prediction_trigger) {
                            epr_revenue = getEngageGADataData.data[0].epr_revenue !== null ? parseInt(getEngageGADataData.data[0].epr_revenue) : 0;
                            epr_potential_revenue = getEngageGADataData.data[0].epr_potential_revenue !== null ? parseInt(getEngageGADataData.data[0].epr_potential_revenue) : 0;
                            potentialRevenueTotal = potentialRevenueTotal * 1 + epr_potential_revenue * 1;

                        }

                        return {
                            personaStatus: getWebsitesRecordByIdData.data[0].prediction_trigger,
                            personaRev: (prePhaseEPRData !== null && !isNaN(prePhaseEPRData)) ? prePhaseEPRData : !isNaN(epr_revenue) ? epr_revenue : 0,
                            personaRevProjected: (epr_potential_revenue !== null && !isNaN(epr_potential_revenue)) ? epr_potential_revenue : 0,
                            totalAOV: totalAOV !== null ? totalAOV : 0,
                            personaPotentialCRLift: parseFloat(d.industry_std_lift - 1).toFixed(2),
                            personaShortCode: d.short_code,
                            personaOneLineDesc: couponRunnerOverviewCardData.description,
                            personaPhase: personaPhase,
                            personaSizeOfGroup: coupon_runner_sog != 0 && coupon_runner_sog !== null ? coupon_runner_sog : d.industry_std_sog,
                            industryBased,
                            // personaImage: getWebsitesRecordByIdData.data[0].prediction_trigger ? `//debuficgraftb.cloudfront.net/analytics/img/custom/engage_trigger_images/images/${getWebsitesRecordByIdData.data[0].web_id}_prediction_trigger.png` : `//debuficgraftb.cloudfront.net/analytics/img/custom/engage_trigger_images/images/notactivetrigger.png`,
                            personaImage: coupon_runner_alt,
                            impactData: couponRunnerImpactData !== null && couponRunnerImpactData.hasOwnProperty('data') && couponRunnerImpactData.data,
                            ...d
                        }
                    } else if (d.short_code === "cs") {

                        let prePhaseCSData = null;
                        let why_not_sog = null;
                        let cs_revenue = null;
                        let cs_potential_revenue = null;
                        let cs_reduce_cart = null;
                        let industryBased = null;
                        let personaPhase = getWebsitesRecordByIdData.data[0].why_not_trigger_split === 100 ? "post" : "during";
                        let whyNotShopperImpactData = null;
                        let dayCount = null;
                        let prePhaseCSDataProjected = null;
                        let indStdRevenue = null;
                        let totalAOV = null;
                        if (getShieldGADataData.data.total_aov != 0) {
                            totalAOV = parseFloat(getShieldGADataData.data.total_aov).toFixed(2)
                        } else if (!isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
                            totalAOV = listening_phase_aov_30_days
                        }
                        if (getWebsitesRecordByIdData.hasOwnProperty("data") && !getWebsitesRecordByIdData.data[0].whynot_trigger) {
                            whyNotShopperImpactData = await getEngageWhynotPrePhasePersonaImpact(siteInputs, getShieldGADataData.data, getWebsitesRecordByIdData, getEngagePersonaMetricsWhyNotShopperData, getEngagePrePhasePersonaImpactDayCountData, currency, headerConfigPassed);

                            const whyNotShopperImpactDayCount = await getEngagePrePhaseWhyNotPersonaImpactDayCount(siteInputs, headerConfigPassed);

                            if (whyNotShopperImpactDayCount !== undefined && whyNotShopperImpactDayCount.hasOwnProperty('data')) {
                                dayCount = whyNotShopperImpactDayCount.data[0].days_with_cart_reduction * 1;
                            }
                            /* whyNotImpactData = await processWhyNotPersonaImpactResult(getEngagePrePhasePersonaImpactData, getShieldGADataData.data, getWebsitesRecordByIdData, getEngagePersonaMetricsWhyNotShopperData); */
                            prePhaseCSData = await processWhyNotPersonaMetricsResult(getEngagePersonaMetricsWhyNotShopperData, { totalAOV: getShieldGADataData.data.total_aov }, dayCount, numberOfDays, currency);

                            if (prePhaseCSData.personaMetrics[1].hasOwnProperty('brandlock_on_projected') && prePhaseCSData.personaMetrics[1].brandlock_on_projected != 0) {
                                prePhaseCSDataProjected = prePhaseCSData.personaMetrics[1].brandlock_on_projected
                            } else if (getShieldGADataData.data.total_transactions != 0 && getShieldGADataData.data.total_aov != 0) {
                                prePhaseCSDataProjected = getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift;
                                indStdRevenue = true;
                            } else if (!isNaN(listening_phase_orders_30_days) && listening_phase_orders_30_days !== 0 && !isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
                                prePhaseCSDataProjected = listening_phase_orders_30_days * d.industry_std_transaction_sog * listening_phase_aov_30_days * d.industry_std_lift;
                                indStdRevenue30Days = true;
                            }

                            prePhaseCSData = prePhaseCSDataProjected * d.apply_ratio
                            potentialRevenueTotal = potentialRevenueTotal * 1 + prePhaseCSData;

                            why_not_sog = getEngagePersonaMetricsWhyNotShopperData.data.length > 0 ? parseFloat(getEngagePersonaMetricsWhyNotShopperData.data[0].size_of_users_that_add_to_cart).toFixed(2) : 0;
                            cs_reduce_cart = getEngagePersonaMetricsWhyNotShopperData.data.length > 0 ? parseFloat(getEngagePersonaMetricsWhyNotShopperData.data[0].size_of_users_that_reduce_cart).toFixed(2) : 0;
                            industryBased = why_not_sog != 0 ? false : true;
                            why_not_sog = why_not_sog != 0 ? why_not_sog : d.industry_std_sog;
                            cs_reduce_cart = cs_reduce_cart != 0 && cs_reduce_cart != null ? parseFloat(cs_reduce_cart).toFixed(2) : 0;
                            personaPhase = "";
                        } else if (getEngagePersonaDuringSizeOFGroupData.hasOwnProperty('data') && getEngagePersonaDuringSizeOFGroupData.data.length > 0) {
                            const cs_users = parseFloat(getEngagePersonaDuringSizeOFGroupData.data[0].cs_users);
                            const add_to_cart_users = parseFloat(getEngagePersonaDuringSizeOFGroupData.data[0].add_to_cart_users);
                            const add_to_cart_sessions = parseFloat(getEngagePersonaDuringSizeOFGroupData.data[0].add_to_cart_sessions);
                            const all_users = parseFloat(getEngagePersonaDuringSizeOFGroupData.data[0].users);
                            cs_reduce_cart = add_to_cart_users !== 0 && add_to_cart_users !== undefined && !isNaN(add_to_cart_users) ? ((cs_users / add_to_cart_users) * 100).toFixed(2) : 0;
                            //cs_reduce_cart = add_to_cart_sessions !== 0 && add_to_cart_sessions !== undefined && !isNaN(add_to_cart_sessions) ? parseFloat(cs_users / add_to_cart_sessions).toFixed(2) : 0;
                            why_not_sog = all_users !== 0 && all_users !== undefined && !isNaN(all_users) ? ((cs_users / all_users) * 100).toFixed(2) : 0;
                        }

                        if (getEngageGADataData.data.length && getWebsitesRecordByIdData.data[0].whynot_trigger) {
                            cs_revenue = getEngageGADataData.data[0].cs_revenue !== null ? parseInt(getEngageGADataData.data[0].cs_revenue) : 0;
                            cs_potential_revenue = getEngageGADataData.data[0].cs_potential_revenue !== null ? parseInt(getEngageGADataData.data[0].cs_potential_revenue) : 0;
                            potentialRevenueTotal = potentialRevenueTotal * 1 + cs_potential_revenue * 1;

                            //impactRevenueResult += cs_revenue

                        }
                        return {
                            personaStatus: getWebsitesRecordByIdData.data[0].whynot_trigger,
                            personaRev: (prePhaseCSData !== null && !isNaN(prePhaseCSData)) ? prePhaseCSData : !isNaN(cs_revenue) ? cs_revenue : 0,
                            personaRevProjected: (cs_potential_revenue !== null && !isNaN(cs_potential_revenue)) ? cs_potential_revenue : 0,
                            totalAOV: totalAOV !== null ? totalAOV : 0,
                            personaPotentialCRLift: parseFloat(d.industry_std_lift - 1).toFixed(2),
                            personaShortCode: d.short_code,
                            personaOneLineDesc: whyNotShopperOverviewCardData.description,
                            personaPhase: personaPhase,
                            personaSizeOfGroup: why_not_sog !== null ? why_not_sog : 0,
                            cs_reduce_cart: cs_reduce_cart !== null ? cs_reduce_cart : 0,
                            industryBased,
                            // personaImage: getWebsitesRecordByIdData.data[0].whynot_trigger ? why_not_shopper_alt : `//debuficgraftb.cloudfront.net/analytics/img/custom/engage_trigger_images/images/notactivetrigger.png`,
                            personaImage: why_not_shopper_alt,
                            impactData: whyNotShopperImpactData !== null && whyNotShopperImpactData.hasOwnProperty('data') && whyNotShopperImpactData.data,
                            ...d
                        }
                    }
                    /* else if (d.short_code === "pp" && this.props.sessionClient.web_id === 246) {
                        let pp_revenue = null;

                        if (getEngageGADataData.data.length) {
                            pp_revenue = parseInt(getEngageGADataData.data[0].premium_product_revenue)
                            premium_product_potential_revenue = parseInt(getEngageGADataData.data[0].premium_product_potential_revenue)
                            //impactRevenueResult += cs_revenue
                        }

                        return {
                            personaStatus: true,
                            personaRev: !isNaN(pp_revenue) ? pp_revenue : 0,
                            totalAOV: totalAOV !== null ? totalAOV : 0,
                            personaPotentialCRLift: "0",
                            personaShortCode: d.short_code,
                            personaOneLineDesc: "",
                            personaPhase: "post",
                            personaSizeOfGroup: 0,
                            personaImage: `//debuficgraftb.cloudfront.net/analytics/img/custom/engage_trigger_images/images/notactivetrigger.png`,
                            ...d
                        }
                    } */
                })
            );
        }

        if (getEngageGADataData !== null && getEngageGADataData.data.length && getEngageGADataData.data[0].total_revenue !== undefined && getEngageGADataData.data[0].total_revenue !== null) {
            impactRevenueResult = getEngageGADataData.data[0].total_revenue
        } else {
            impactRevenueResult = 0
        }

        if (engageEnable) {
            impactRevenueResult = parseInt(impactRevenueResult) + parseInt(adwareShopperRev)
        } else {
            impactRevenueResult = parseInt(adwareShopperRev)
        }
        this.setState(prevState => {
            return {
                loading: {
                    status: false,
                    message: ""
                },
                impactRevenue: impactRevenueResult,
                impactRevenueLoading: false,
                potentialRevenueTotal: potentialRevenueTotal,
                potentialRevenueTotalIsLoading: false,
                loadPersonaDetails: false,
                personaDetailLoader: false,
                updatedEngagePersonaList: prePhasePersonaData,
                updatedEngagePersonaListLoading: false,
                sitePhase: sitePhaseStatus,
                adwareShopperABPerc
            }
        })

    }

    async handleDateChange(item, splitLengthAddedIndex = null) {
        const siteIdInput = this.props.sessionClient.web_id;
        const searchParams = this.props.location.search;
        let adwareShopperABPerc = null;
        let isLiveSelected = false;
        this.personaId = new URLSearchParams(searchParams).get("personaId");

        const selectionWithKey = "selection" + splitLengthAddedIndex
        let itemStartDate = null;
        let itemEndDate = null;
        let startDate = null;
        let endDate = null;
        if (this.props.sessionClient.web_account_id != 508) {
            itemStartDate = item.hasOwnProperty(selectionWithKey) && splitLengthAddedIndex !== null ? item[selectionWithKey].startDate : item[0].startDate;
            itemEndDate = item.hasOwnProperty(selectionWithKey) ? item[selectionWithKey].endDate : item[0].endDate;
            startDate = convertDateTOLocale(itemStartDate);
            endDate = convertDateTOLocale(itemEndDate);
        } else {
            startDate = '2022-12-01';
            endDate = '2022-12-31';
            itemStartDate = new Date('2022-12-01');
            itemEndDate = new Date('2022-12-31');
        }
        const headerConfigPassed = {
            headers: {
                Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${getCurrentUser().data.data.refresh_token}`,
            }
        }
        const getWebsitesRecordByIdData = await getWebsitesRecordById(this.props.sessionClient.web_id, headerConfigPassed)

        if (item.hasOwnProperty(selectionWithKey) && item[selectionWithKey].hasOwnProperty("abPerc")) {
            await this.setLiveClientScreen(item[selectionWithKey].abPerc);
        }

        if (this.state.activeStartDate !== "" && this.state.activeEndDate) {
            if (itemStartDate.getTime() > this.state.activeStartDate.getTime() && itemEndDate.getTime() < this.state.activeEndDate.getTime()) {
                isLiveSelected = true
                adwareShopperABPerc = 100;
            } else if (itemStartDate.getTime() === this.state.activeStartDate.getTime() && itemEndDate.getTime() === this.state.activeEndDate.getTime()) {
                isLiveSelected = true
                adwareShopperABPerc = 100;
            } else if (itemStartDate.setHours(0, 0, 0, 0) === this.state.activeStartDate.setHours(0, 0, 0, 0) && itemEndDate.getTime() < this.state.activeEndDate.getTime()) {
                isLiveSelected = true
                adwareShopperABPerc = 100;
            } else if (itemStartDate.getTime() > this.state.activeStartDate.getTime() && itemEndDate.setHours(0, 0, 0, 0) === this.state.activeEndDate.setHours(0, 0, 0, 0)) {
                isLiveSelected = true
                adwareShopperABPerc = 100;
            } else {
                isLiveSelected = false
                adwareShopperABPerc = 0;

            }
        } else {
            if (this.personaId === null && getWebsitesRecordByIdData.data[0].ab_status === true && getWebsitesRecordByIdData.data[0].ab_perc === 100) {
                isLiveSelected = true
                adwareShopperABPerc = 100;
            } else {
                adwareShopperABPerc = 0;
            }
        }
        /* 
        console.log()
        const startDate = convertDateTOLocale(item[0].startDate);
        const endDate = convertDateTOLocale(item[0].endDate); */

        /*         const differenceCurrentDate = differenceInDays(endDate, startDate) + 1;
        
                const compareStartDate = convertDateTOLocale(subDays(startDate, differenceCurrentDate));
                const compareEndDate = convertDateTOLocale(subDays(endDate, differenceCurrentDate)); */

        this.setState({
            // loading: {
            //     status: true,
            //     message: "loading"
            // },
            startDate: itemStartDate,
            endDate: itemEndDate,
            engageTopCodesDataIsLoading: true,
            engageTopPublisherWcDataIsLoading: true,
            websiteRecordByIdLoading: true,
            isLiveSelected,
            isLiveSelectedLoading: false,

        })

        const siteInputs = { siteIdInput, startDate, endDate };
        //const compareSiteInputs = { siteIdInput: this.props.sessionClient.web_id, startDate: compareStartDate, endDate: compareEndDate };

        getEngageTopCodes(siteInputs, headerConfigPassed).then(res => {
            // if (res.data && res.data.length !== 0) {
            this.createEngageWrongCouponDataTable(res.data);
            // }
        })

        getEngageTopPublisherWc(siteInputs, headerConfigPassed).then(res => {
            // if (res.data && res.data.length !== 0) {
            this.createEngageWrongCouponByAffilateDatatable(res.data);
            // }
        })

        getCouponUsed(siteInputs, headerConfigPassed).then(res => {
            // if (res.data && res.data.length !== 0) {
            this.createCouponUsedDataTable(res.data);
            // }
        })

        getCheckoutPageConversionRate(siteInputs, headerConfigPassed).then(res => {
            // if (res.data && res.data.length !== 0) {
            this.createCheckoutPageConversionRateDataTable(res.data);
            // }
        })

        getExtensionShopperRecycledAffiliateSessions(siteInputs, headerConfigPassed).then(res => {
            // if (res.data && res.data.length !== 0) {
            this.createExtensionShopperRecycledUserDataTable(res.data);
            // }
        })

        getEngageTopCouponsCashback(siteInputs, headerConfigPassed).then(res => {
            // if (res.data && res.data.length !== 0) {
            this.createEngageCashbackCouponDatatable(res.data);
            // }
        })

        getEngageTop5CouponsCashback(siteInputs, headerConfigPassed).then(res => {
            this.setState({
                engageTopCouponsCashbackData: res.data,
                engageTopCouponsCashbackDataIsLoading: false,
            })
        });

        getTopInjectionTypes(siteInputs, headerConfigPassed).then(getTopInjectionTypesData => {
            this.setState({
                topInjectionTypes: getTopInjectionTypesData,
                topInjectionTypesLoading: false,
            })
        });
        getTopMaliciousPages(siteInputs, headerConfigPassed).then(getTopMaliciousPagesData => {
            this.setState({
                topMaliciousPages: getTopMaliciousPagesData,
                topMaliciousPagesLoading: false,
            })
        });

        getExtensionShopperTopCouponsCashback(siteInputs, headerConfigPassed).then(res => {
            // if (res.data && res.data.length !== 0) {
            this.createExtensionShopperCashbackCouponDatatable(res.data);
            // }
        })

        this.setState({
            websiteRecordById: getWebsitesRecordByIdData.data[0],
            websiteRecordByIdLoading: false
        });
        let sitePhaseStatus = {
            name: "",
            id: null
        };
        if (getWebsitesRecordByIdData.hasOwnProperty('data') && getWebsitesRecordByIdData.data.length > 0) {
            if ((getWebsitesRecordByIdData.data[0].engage && getWebsitesRecordByIdData.data[0].engage_ab === false) || getWebsitesRecordByIdData.data[0].ab_status === true && getWebsitesRecordByIdData.data[0].ab_perc === 100) {
                sitePhaseStatus = {
                    name: "Post Phase",
                    id: 1,
                    engageAnalytics: getWebsitesRecordByIdData.data[0].engage_analytics
                }
                await this.handlePostPhasePersonaUpdates(siteInputs, sitePhaseStatus, adwareShopperABPerc);
            } else if ((getWebsitesRecordByIdData.data[0].engage && getWebsitesRecordByIdData.data[0].engage_ab) || (getWebsitesRecordByIdData.data[0].ab_status === true && getWebsitesRecordByIdData.data[0].ab_perc !== 100)) {
                sitePhaseStatus = {
                    name: "POC Phase",
                    id: 0,
                    engageAnalytics: getWebsitesRecordByIdData.data[0].engage_analytics
                }
                await this.handlePersonaUpdates(siteInputs, sitePhaseStatus, adwareShopperABPerc);
            } else if ((getWebsitesRecordByIdData.data[0].engage === false && getWebsitesRecordByIdData.data[0].engage_ab === false) || (getWebsitesRecordByIdData.data[0].ab_status === false || getWebsitesRecordByIdData.data[0].ab_status === null || getWebsitesRecordByIdData.data[0].ab_status === '')) {
                sitePhaseStatus = {
                    name: "Pre Phase",
                    id: -1
                }
                await this.handlePrePhasePersonaUpdates(siteInputs, sitePhaseStatus, adwareShopperABPerc);
            }
            if (this.personaId) {
                await this.handlePersonaDetailRouting(true);
            }
        }


    }



    async handleSplitDateRange() {

        const searchParams = this.props.location.search;
        this.personaId = new URLSearchParams(searchParams).get("personaId");

        const siteIdInput = this.props.sessionClient.web_id;
        const siteInputsForSplitDate = { siteIdInput, startDate: convertDateTOLocale(subDays(new Date(), 420)), endDate: convertDateTOLocale(subDays(new Date(), 0)) };
        const headerConfigPassed = {
            headers: {
                Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${getCurrentUser().data.data.refresh_token}`,
            }
        }
        const splitClientHistory = await getSplitClientHistory(siteInputsForSplitDate, headerConfigPassed);
        var listeningPhasePresent = false;
        if (this.personaId == 7 && splitClientHistory.hasOwnProperty('data') && splitClientHistory.data !== undefined && splitClientHistory.data.length > 0) {
            let splitDateAndPerc = {
                splitDate: siteInputsForSplitDate.startDate,
                abPerc: 0,
                split_change: false
            }
            splitDateAndPerc = splitClientHistory.hasOwnProperty('data') && splitClientHistory.data.map(d => {
                if (d.split_change === true && d.ab_status) {
                    return { splitDate: new Date(d.prod_invalidated_on), abPerc: d.ab_perc }
                } else if (d.ab_status === false && d.phase_status_code === 0) {
                    listeningPhasePresent = true;
                    return { splitDate: new Date(d.prod_invalidated_on), abPerc: 0, split_change: false }
                } else if (d.phase_status_code === 1) {
                    listeningPhasePresent = true;
                    return { splitDate: new Date(d.prod_invalidated_on), abPerc: 0, split_change: false };
                }
                return null;
            })

            //await this.setLiveDateRange(splitDateAndPerc);
            if (listeningPhasePresent === false) {

                splitDateAndPerc.unshift({
                    splitDate: subDays(new Date(splitClientHistory.data[0].prod_invalidated_on), 7),
                    abPerc: 0,
                    split_change: splitClientHistory.data[0].split_change
                });
            }

            for (let i = 0; i < splitDateAndPerc.length; i++) {
                if (splitDateAndPerc[i].abPerc === 100) {
                    const index = i;
                    if ((index + 1) === splitDateAndPerc.length) {
                        this.setState({
                            isLiveSelected: true,
                            isLiveSelectedLoading: false,
                            activeStartDate: splitDateAndPerc[i].splitDate,
                            activeEndDate: subDays(new Date(), 0)
                        });
                    } else {
                        const nextIndex = (i + 1);
                        this.setState({
                            isLiveSelected: false,
                            activeStartDate: splitDateAndPerc[i].splitDate,
                            activeEndDate: subDays(splitDateAndPerc[nextIndex].splitDate, 1)
                        });
                    }
                }
            }
            //Setting Date Range last 1 month if split is greater than 30 days else show split wise
            const current_Date = new Date();
            let oned = 24 * 60 * 60 * 1000;
            const Difference_In_Days = Math.ceil((current_Date - splitDateAndPerc[splitDateAndPerc.length - 1].splitDate) / oned);
            if (Difference_In_Days > 29 && this.props.sessionClient.web_account_id !== 508) {
                const newStartDate = subDays(new Date(), 31);
                const newEndDate = subDays(new Date(), 2);
                this.setState({
                    splitDateRangeData: splitDateAndPerc,
                    splitDateRangeDataLoading: false,
                    startDate: newStartDate,
                    endDate: newEndDate
                });
            } else if (this.props.sessionClient.web_account_id !== 508) {
                const newEndDate = new Date();
                this.setState({
                    splitDateRangeData: splitDateAndPerc,
                    splitDateRangeDataLoading: false,
                    startDate: splitDateAndPerc[splitDateAndPerc.length - 1].splitDate,
                    endDate: newEndDate
                });
            } else if (this.props.sessionClient.web_account_id == 508) {
                this.setState({
                    splitDateRangeData: splitDateAndPerc,
                    splitDateRangeDataLoading: false,
                    startDate: new Date('2022-12-01'),
                    endDate: new Date('2022-12-31')
                });
            } // Ends here
            /* this.setState({
              splitDateRangeData: splitDateAndPerc,
              splitDateRangeDataLoading: false
            }); */
        } else {
            this.setState({
                splitDateRangeData: [],
                splitDateRangeDataLoading: false
            });
        }
        /* const splitClientHistory = await getEngageSplitClientHistory(siteInputsForSplitDate, headerConfigPassed);
        if (splitClientHistory.hasOwnProperty('data') && splitClientHistory.data !== undefined) {
            let splitDateAndPerc = {}
    
            splitDateAndPerc = splitClientHistory.data.map(d => {
                return { splitDate: new Date(d.prod_invalidated_on), abPerc: d.engage_bucket_split, phaseStatus: d.phase_status }
            })
    
            // splitDateAndPerc.unshift({
            //         splitDate: new Date(siteInputsForSplitDate.startDate),
            //         abPerc: "engage_off"
            //       });
    
        this.setState({
            splitDateRangeData: splitDateAndPerc,
            splitDateRangeDataLoading: false
        });
    
    } */

    }

    async handleSinglePersonaPromoCodeData(data) {
        const headerConfigPassed = {
            headers: {
                Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${getCurrentUser().data.data.refresh_token}`,
            }
        }
        const siteIdInput = this.props.sessionClient.web_id;
        const { startDate, endDate } = this.state;
        const personaIdInputs = { siteIdInput: siteIdInput, startDate: convertDateTOLocale(startDate), endDate: convertDateTOLocale(endDate), persona_id: parseInt(this.state.currentPersonaId) };

        const personaPromoCodeResult = await getEngagePersonaCoupon(personaIdInputs, headerConfigPassed);
        data.personaPromoCode = personaPromoCodeResult.data;
        data.singlePersonaPromoCodeEdited = true;

        this.setState({
            singlePersonaPromoCodeData: data,
            singlePersonaPromoCodeDataLoading: false
        })
    }

    async handleDymaniDetailRoute(flag, data, rowId) {
        const current_user = getCurrentUser();
        sendGAHit('event', 'ClientDashboard', {
            'event_category': `ShopperClicked`,
            'event_action': 'clicked',
            'event_label': `${data.name}`,
            'non_interaction': false,
            'shopper_name': data.name,
            'shopper_status': data.personaStatus ? "ON" : "OFF",
            'user_email': current_user && current_user.hasOwnProperty('data') ? current_user.data.data.user_email : 'no_login',
            'client_id': this.props.sessionClient.web_id,
            'client_name': this.props.sessionClient.web_url
        })

        await this.props.history.push({ pathname: `/engage/persona`, search: `?personaId=${data.id}` });
        await this.handlePersonaDetails(flag, data, rowId);
    }

    async getEngageMessage(personaIdInputs, headerConfigPassed) {
        const personaMessages = await getEngagePersonaSettings(personaIdInputs, headerConfigPassed);
        this.setState({
            engagePersonaMessages: personaMessages.data
        });
    }


    /* 
    @handlePersonaDetails
    @@params
        flag    -- boolean true | false (to load persona details)
        data    -- object {} (persona details)
        rowId   -- integer 1-7 (persona to be loaded)
    @@returns
        set persona details component data 
    */
    async handlePersonaDetails(flag, data, rowId, dateChanged = false) {
        this.setState({
            personaDetailLoader: true,
            personaRowId: rowId,
            impactRevenueLoading: true,
        });
        if (data.personaStatus === 'NA') {
            this.setState({
                personaDetailLoader: false,
                loadPersonaDetails: false,
                impactRevenueLoading: false
            });
            return;
        }


        const headerConfigPassed = {
            headers: {
                Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${getCurrentUser().data.data.refresh_token}`,
            }
        }
        const prevStartDate = this.state.startDate;
        const prevEndDate = this.state.endDate;
        let adwareShopperDateChanged = false;
        if (!dateChanged) {
            await this.handleSplitDateRange()
        }
        const { startDate, endDate } = this.state;
        const siteIdInput = this.props.sessionClient.web_id;
        const siteInputs = { siteIdInput, startDate: convertDateTOLocale(startDate), endDate: convertDateTOLocale(endDate) };
        const siteInputsWithShoppersShortCode = { siteIdInput, startDate: convertDateTOLocale(startDate), endDate: convertDateTOLocale(endDate), shopperShortCode: data.personaShortCode };

        const personaIdInputs = { siteIdInput: siteIdInput, startDate: convertDateTOLocale(startDate), endDate: convertDateTOLocale(endDate), persona_id: data.id };
        data.personaMetricsResultLoading = true;
        const personaPromoCodeResult = await getEngagePersonaCoupon(personaIdInputs, headerConfigPassed);
        let personaMetricsResult = [];
        let personaMetricsResultDuring = [];
        let personaMetricsResultPost = [];
        let whynotMetricsResultDuring = [];
        let couponQualityMetrics = null;
        let affiliateSavings = true;
        let displayAOV = true;
        let engagePersonaShopperSplit = null;
        let hesitantTopDropoffPages = null;
        let hesitantTriggerTimings = null;
        let impactRevenueResult = this.state.impactRevenue;

        couponQualityMetrics = await getCouponQualityMetrics(siteInputsWithShoppersShortCode, headerConfigPassed);
        if (couponQualityMetrics !== undefined && couponQualityMetrics !== null && couponQualityMetrics.hasOwnProperty('data') && couponQualityMetrics.data.length) {
            data.couponQualityMetrics = await this.createCouponQualityMetricsDataTable(couponQualityMetrics.data)
            data.couponQualityMetricsOverallScore = Math.floor(couponQualityMetrics.data[0].module_score);
        }

        data.personaPromoCode = personaPromoCodeResult.data;

        await this.getEngageMessage(personaIdInputs, headerConfigPassed);

        if (data.personaPhase === "during") {
            personaMetricsResultDuring = await getEngagePersonaMetricsDuring(siteInputs, headerConfigPassed, personaIdInputs.persona_id);
        }
        if (data.personaPhase === "post") {
            personaMetricsResultPost = await getPostPhaseShoppersMetricsData(siteInputs, headerConfigPassed, personaIdInputs.persona_id);
        }

        if (data.personaShortCode === "cs") {
            data.personaOverview = whyNotShopperOverviewCardData;
            engagePersonaShopperSplit = await getEngageWhyNotSplit(siteInputs, headerConfigPassed);

            if (data.personaPhase === "during") {

                whynotMetricsResultDuring = await getEngagePersonaWhynot_During(siteInputs, headerConfigPassed, personaIdInputs.persona_id);
                if (whynotMetricsResultDuring.data.length > 0) {
                    data = await processWCPersonaMetricsResultDuring(whynotMetricsResultDuring.data[0], data);
                    data.personaPotentialCRLift = data.personaMetrics[0].gain;
                }
            } else if (data.personaPhase === "post") {
                if (personaMetricsResultPost.hasOwnProperty('data') && personaMetricsResultPost.data.length > 0) {
                    data = await processPersonaMetricsResultPost(personaMetricsResultPost.data[0], data, false, displayAOV);
                    data.personaPotentialCRLift = data.personaMetrics[0].gain;
                }
            } else {
                personaMetricsResult = await getEngagePersonaMetricsWhyNotShopper(siteInputs, headerConfigPassed);
                data = await processWhyNotPersonaMetricsResult(personaMetricsResult, data);
            }

        } else if (data.personaShortCode === "ti3") {
            engagePersonaShopperSplit = await getEngageHesitantShopperSplit(siteInputs, headerConfigPassed);
            hesitantTopDropoffPages = await getHesitantShopperTopDropoffPages(siteInputs, headerConfigPassed);
            hesitantTriggerTimings = await getHesitantShopperTriggerTimings(siteInputs, headerConfigPassed);
            data.hesitantTopDropoffPages = await this.createHesitantShopperTopDropoffPagesDatatable(hesitantTopDropoffPages.data)
            data.hesitantTriggerTimings = await this.createHesitantShopperTriggerTimingsDatatable(hesitantTriggerTimings.data)
            ti3OverviewCardData.problem = `Shoppers with high intent to purchase, but not sure if now is the right time. 99% of this group abandons at ${hesitantTriggerTimings.data.metrics[1].value}.`;
            ti3OverviewCardData.solution = `Engage this shopper with the right offer BEFORE ${hesitantTriggerTimings.data.metrics[1].value}. Increase revenue.`;
            data.personaOverview = ti3OverviewCardData;
            if (data.personaPhase === "during") {
                if (personaMetricsResultDuring.data.length > 0) {
                    data = await processWCPersonaMetricsResultDuring(personaMetricsResultDuring.data[0], data);
                    data.personaPotentialCRLift = data.personaMetrics[0].gain;
                }
            } else if (data.personaPhase === "post") {
                if (personaMetricsResultPost.hasOwnProperty('data') && personaMetricsResultPost.data.length > 0) {
                    data = await processPersonaMetricsResultPost(personaMetricsResultPost.data[0], data, false, displayAOV);
                    data.personaPotentialCRLift = data.personaMetrics[0].gain;
                }
            } else {
                personaMetricsResult = await getEngagePersonaMetricsHesitantShopper(siteInputs, headerConfigPassed);
                data = await processHesitantPersonaMetricsResult(personaMetricsResult, data);
            }
        } else if (data.personaShortCode === "wc") {
            data.personaOverview = wcOverviewCardData;


            if (!this.state.engageTopCodesDataIsLoading) {
                data.wcTopCode = this.state.engageTopCodesData
            }
            if (!this.state.engageTopPublisherWcDataIsLoading) {
                data.wcTopPublisher = this.state.engageTopPublisherWcData
            }
            if (!this.state.couponUsedDataIsLoading) {
                data.wcCouponUsed = this.state.couponUsedData
            }

            engagePersonaShopperSplit = await getEngageWrongCouponSplit(siteInputs, headerConfigPassed);
            if (data.personaPhase === "during") {
                data.sessionHijackSourceFlow = await getDuringAndPostWCSessionHijackSourceFlow(siteInputs, headerConfigPassed)
                if (personaMetricsResultDuring.data.length > 0) {
                    data = await processWCPersonaMetricsResultDuring(personaMetricsResultDuring.data[0], data, affiliateSavings);
                    data.personaPotentialCRLift = data.personaMetrics[0].gain;
                }
            } else if (data.personaPhase === "post") {
                data.sessionHijackSourceFlow = await getDuringAndPostWCSessionHijackSourceFlow(siteInputs, headerConfigPassed)
                if (personaMetricsResultPost.hasOwnProperty('data') && personaMetricsResultPost.data.length > 0) {
                    data = await processPersonaMetricsResultPost(personaMetricsResultPost.data[0], data, affiliateSavings, false);
                    data.personaPotentialCRLift = data.personaMetrics[0].gain;
                }
                /*                 processPersonaMetricsResultPost */
            } else {
                data.sessionHijackSourceFlow = await getWCSessionHijackSourceFlow(siteInputs, headerConfigPassed)
                if (!this.state.checkoutPageConversionRateDataIsLoading) {
                    data.wcCheckoutPageConversionRate = this.state.checkoutPageConversionRateData
                }
                personaMetricsResult = await getEngagePersonaMetricsWC_EEI_CR(siteInputs, headerConfigPassed);
                data = await processWCPersonaMetricsResult(personaMetricsResult, data, data.dayCount, data.numberOfDays, data.listening_phase_aov_30_days);
            }
        } else if (data.personaShortCode === "e-ei") {
            const extensionPubliher = await getPublisherBreakdownByUserType(siteInputs, headerConfigPassed);

            if (extensionPubliher !== undefined && extensionPubliher.hasOwnProperty('data')) {
                data.extensionPublisherBreakdownData = await this.createExtensionShopperPubliserBreakdownDatatable(extensionPubliher.data, data.totalAOV);
            }
            data.personaOverview = extensionTriggerOverviewCardData;
            engagePersonaShopperSplit = await getEngageExtensionTriggerSplit(siteInputs, headerConfigPassed);
            if (data.personaPhase === "during") {
                data.sessionHijackSourceFlow = await getDuringAndPostEEISessionHijackSourceFlow(siteInputs, headerConfigPassed)
                if (personaMetricsResultDuring.data.length > 0) {
                    data = await processWCPersonaMetricsResultDuring(personaMetricsResultDuring.data[0], data, affiliateSavings);
                    data.personaPotentialCRLift = data.personaMetrics[0].gain;
                }
            } else if (data.personaPhase === "post") {
                data.sessionHijackSourceFlow = await getDuringAndPostEEISessionHijackSourceFlow(siteInputs, headerConfigPassed)
                if (personaMetricsResultPost.hasOwnProperty('data') && personaMetricsResultPost.data.length > 0) {
                    data = await processPersonaMetricsResultPost(personaMetricsResultPost.data[0], data, affiliateSavings, false);
                    data.personaPotentialCRLift = data.personaMetrics[0].gain;
                }
                /*                 processPersonaMetricsResultPost */
            } else {
                data.sessionHijackSourceFlow = await getEEISessionHijackSourceFlow(siteInputs, headerConfigPassed)

                const extensionPubliher = await getPublisherBreakdownByUserType(siteInputs, headerConfigPassed);
                if (extensionPubliher.hasOwnProperty('data')) {
                    data.extensionPublisherBreakdownData = await this.createExtensionShopperPubliserBreakdownDatatable(extensionPubliher.data, data.totalAOV);
                }

                personaMetricsResult = await getEngagePersonaMetricsWC_EEI_CR(siteInputs, headerConfigPassed);
                data = await processEEIPersonaMetricsResult(personaMetricsResult, data);
            }


        } else if (data.personaShortCode === "epr") {
            data.personaOverview = couponRunnerOverviewCardData;
            engagePersonaShopperSplit = await getEngageCouponRunnerSplit(siteInputs, headerConfigPassed);
            if (data.personaPhase === "during") {
                data.sessionHijackSourceFlow = await getDuringAndPostEPRSessionHijackSourceFlow(siteInputs, headerConfigPassed)
                if (personaMetricsResultDuring.data.length > 0) {
                    data = await processWCPersonaMetricsResultDuring(personaMetricsResultDuring.data[0], data, affiliateSavings);
                    data.personaPotentialCRLift = data.personaMetrics[0].gain;
                }
            } else if (data.personaPhase === "post") {
                data.sessionHijackSourceFlow = await getDuringAndPostEPRSessionHijackSourceFlow(siteInputs, headerConfigPassed)
                if (personaMetricsResultPost.hasOwnProperty('data') && personaMetricsResultPost.data.length > 0) {
                    data = await processPersonaMetricsResultPost(personaMetricsResultPost.data[0], data, affiliateSavings, false);
                    data.personaPotentialCRLift = data.personaMetrics[0].gain;
                }
            } else {
                data.sessionHijackSourceFlow = await getEPRSessionHijackSourceFlow(siteInputs, headerConfigPassed)
                personaMetricsResult = await getEngagePersonaMetricsWC_EEI_CR(siteInputs, headerConfigPassed);
                data = await processCRPersonaMetricsResult(personaMetricsResult, data);
            }
        } else if (data.personaShortCode === "pp") {
            data.personaOverview = permiumShopperOverviewCardData;
            engagePersonaShopperSplit = await getEngagePremiumProductSplit(siteInputs, headerConfigPassed);
            if (data.personaPhase === "during") {
                if (personaMetricsResultDuring.data.length > 0) {
                    data = await processWCPersonaMetricsResultDuring(personaMetricsResultDuring.data[0], data, personaIdInputs.persona_id);
                    data.personaPotentialCRLift = data.personaMetrics[0].gain;
                }
            }
        } else if (data.personaShortCode === "shield") {
            let sitePhaseStatus = this.state.sitePhase
            data.personaOverview = adwareShopperOverviewCardData;

            if (convertDateTOLocale(prevStartDate) !== convertDateTOLocale(startDate) || convertDateTOLocale(prevEndDate) !== convertDateTOLocale(endDate)) {
                this.setState({
                    loadToaster: true,
                    toasterMessage: `Date range updated complying ${this.props.shopperRecord.shield} split change`,
                });
            }

            if (sitePhaseStatus.id === 1) {
                await this.handlePostPhasePersonaUpdates(siteInputs, sitePhaseStatus, this.state.adwareShopperABPerc);
                /*                 const topMaliciousScripts = await getTopMaliciousScripts(siteInputs, headerConfigPassed);
                                data.topMaliciousScripts = topMaliciousScripts.data[0]; */
            } else if (sitePhaseStatus.id === 0) {
                await this.handlePersonaUpdates(siteInputs, sitePhaseStatus, this.state.adwareShopperABPerc);
            } else if (sitePhaseStatus.id === -1) {
                await this.handlePrePhasePersonaUpdates(siteInputs, sitePhaseStatus, this.state.adwareShopperABPerc);
            }

            /* impactRevenueResult = this.state.impactRevenue - data.personaRev;
            let splitDates = [];
            const handleSplitClientHistoryData = await getSplitClientHistory(siteInputs, headerConfigPassed)
            if (handleSplitClientHistoryData && handleSplitClientHistoryData.hasOwnProperty('data') && handleSplitClientHistoryData.data.length) {
                splitDates = handleSplitClientHistoryData.data.map((d) => {
                    return convertDateTOLocale(d.prod_invalidated_on)
                })
            }
            let getShieldYTDData, getWebsitesRecordByIdData, getShieldGADataData = null;
            [getShieldYTDData, getWebsitesRecordByIdData, getShieldGADataData] = await Promise.all([
                getShieldYTD(siteInputs, splitDates, headerConfigPassed),
                getWebsitesRecordById(this.props.sessionClient.web_id, headerConfigPassed),
                getShieldGAData(siteInputs, headerConfigPassed)
            ]);
            let ab_status = null;
            let adwareShopperRev = 0;
            let personaPhase = "protection";
            if (getWebsitesRecordByIdData.hasOwnProperty("data") && getWebsitesRecordByIdData.data.length !== 0) {
                ab_status = getWebsitesRecordByIdData.data[0].ab_status;
            }
            data.personaOverview = adwareShopperOverviewCardData;
    
            if (ab_status === false || ab_status === null || ab_status === '') {
                const getListeningPhaseIndustryStdData = await getListeningPhaseIndustryStd(siteInputs, headerConfigPassed);
                if (getListeningPhaseIndustryStdData.hasOwnProperty('data') && getListeningPhaseIndustryStdData.data.length) {
                    let industyStdData = getListeningPhaseIndustryStdData.data[0];
                    const conversionLift = 6;
                    const rpsLift = 5;
                    const recoveredRevenue = industyStdData.projected_recovered_revenue
                    impactRevenueResult += recoveredRevenue * 1;
                    data.personaStatus = ab_status;
                    data.conversionLift = conversionLift > 0 ? `${parseFloat(conversionLift).toFixed(2)}%` : 0;
                    data.revenuePerSessionLift = rpsLift > 0 ? `${parseFloat(rpsLift).toFixed(2)}%` : 0;
                    data.personaRev = recoveredRevenue !== undefined && recoveredRevenue !== null && recoveredRevenue > 0 ? `${parseFloat(recoveredRevenue).toFixed(2)}` : 0;
                    data.personaPhase = "";
                    data.industryStd = true;
                    data.metricsData = processShieldMetricsIndustryStd(industyStdData, currency);
                    data.metricsDataLoading = false;
                    data.personaShortCode = "shield";
    
                } else {
    
                    data.conversionLift = 0;
                    data.revenuePerSessionLift = 0;
                    data.recoveredRevenue = 0;
                    data.protectedSessions = 0;
                    data.metricsData = null;
                    data.metricsDataLoading = false;
                    data.personaStatus = ab_status;
                    data.personaPhase = personaPhase;
                    data.personaShortCode = "shield"
    
                }
            } else if (getWebsitesRecordByIdData.data[0].ab_perc !== 100) {
                let recoveredRevenueYTD = 0;
                if (getShieldYTDData.statuscode !== undefined && getShieldYTDData.statuscode === 200) {
                    recoveredRevenueYTD = getShieldYTDData.data.recovered_revenue;
                    adwareShopperRev = parseInt(recoveredRevenueYTD) >= 0 ? parseInt(recoveredRevenueYTD) : 0
                    impactRevenueResult += adwareShopperRev * 1;
                }
                if (getShieldGADataData.statuscode !== undefined && getShieldGADataData.statuscode === 200 && !getShieldGADataData.data.hasOwnProperty('noData')) {
                    const conversionLift = getShieldGADataData.data.conversion_lift
                    const rpsLift = getShieldGADataData.data.rps_lift
                    const recoveredRevenue = getShieldGADataData.data.recovered_revenue
    
                    data.personaStatus = ab_status;
                    data.conversionLift = conversionLift > 0 ? `${parseFloat(conversionLift).toFixed(2)}%` : 0;
                    data.revenuePerSessionLift = rpsLift > 0 ? `${parseFloat(rpsLift).toFixed(2)}%` : 0;
                    data.recoveredRevenue = recoveredRevenue !== undefined && recoveredRevenue !== null && recoveredRevenue > 0 ? `${parseFloat(recoveredRevenue).toFixed(2)}` : 0;
                    data.personaRev = recoveredRevenueYTD !== undefined && recoveredRevenueYTD !== null && recoveredRevenueYTD > 0 ? `${parseInt(recoveredRevenueYTD)}` : 0;
                    data.personaPhase = personaPhase;
                    data.industryStd = false;
                    data.metricsData = processShieldMetrics(getShieldGADataData, currency);
                    data.metricsDataLoading = false;
                    data.personaShortCode = "shield";
                } else {
                    data.conversionLift = 0;
                    data.revenuePerSessionLift = 0;
                    data.personaRev = 0;
                    data.protectedSessions = 0;
                    data.metricsData = null;
                    data.metricsDataLoading = false;
                    data.personaStatus = ab_status;
                    data.personaPhase = personaPhase;
                    data.personaShortCode = "shield"
                }
            } else {
                const topMaliciousScripts = await getTopMaliciousScripts(siteInputs, headerConfigPassed);
                data.topMaliciousScripts = topMaliciousScripts.data[0];
                data.protectedSessions = 0;
                if (getShieldGADataData.statuscode !== undefined && getShieldGADataData.statuscode === 200 && !getShieldGADataData.data.hasOwnProperty('noData')) {
                    data.protectedSessions = getShieldGADataData.data.protected_sessions;
                }
                data.personaPhase = "live"
                data.personaShortCode = "shield"
                data.personaStatus = ab_status
            } */

        }
        this.setState({
            loadPersonaDetails: false,
            /*             impactRevenue: parseInt(impactRevenueResult), */
            impactRevenueLoading: false,
            message: "",
            singlePersonaData: data.personaShortCode === "shield" && !this.state.updatedEngagePersonaListLoading ? this.state.updatedEngagePersonaList[0] : data,
            singlePersonaPromoCodeDataLoading: true,
            currentPersonaId: data.id,
            personaDetailLoader: true,
            personaRowId: rowId,
            personaDetailMessage: "",
            engagePersonaSplitList: engagePersonaShopperSplit !== null ? engagePersonaShopperSplit.data : []
        });
        setTimeout(() => {
            this.setState({
                loadPersonaDetails: flag,
                /*                 singlePersonaPromoCodeDataLoading: true,
                                singlePersonaData: data,
                                currentPersonaId: data.id, */
                personaDetailLoader: false,
                personaRowId: rowId,
                personaDetailMessage: ""
            })
        }, 1000);
    }

    handlePersonaDetailRouting(dateChanged = false) {
        const filterData = this.state.updatedEngagePersonaList;
        for (let i = 0; i < filterData?.length; i++) {
            if (filterData[i]?.id === parseInt(this?.personaId)) {
                this.handlePersonaDetails(true, filterData[i], i, dateChanged);
            }
        }
    }

    async handleMessageChange() {
        const headerConfigPassed = await {
            headers: {
                Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${getCurrentUser().data.data.refresh_token}`,
            }
        }
        const siteIdInput = this.props.sessionClient.web_id;
        const personaIdInputs = { siteIdInput: siteIdInput, persona_id: this.personaId };
        await this.getEngageMessage(personaIdInputs, headerConfigPassed);
    }

    async createEngageWrongCouponDataTable(wrongCodeData) {
        this.setState({
            engageTopCodesDataIsLoading: true,
        })
        let mainWrongCodeData = [];
        if (wrongCodeData !== undefined) {
            wrongCodeData.map((e, i) => {
                const data = {
                    no: i += 1,
                    code_lower: e.code_lower !== "" ? e.code_lower : "unmapped code",
                    sessions: e.sessions
                }
                mainWrongCodeData.push(data);
            });

        }
        const wrongcoupondata = await getDataTableConfig(mainWrongCodeData, Engage_Insights_Wrong_Coupon_Data_Column);
        this.setState({
            engageTopCodesData: wrongcoupondata,
            engageTopCodesDataIsLoading: false,
        })
    }

    async createEngageWrongCouponByAffilateDatatable(wrongCouponByAffilateData) {
        this.setState({
            engageTopPublisherWcDataIsLoading: true,
        })
        let mainWcAffilateData = [];
        if (wrongCouponByAffilateData !== undefined) {
            wrongCouponByAffilateData.map((e, i) => {
                const data = {
                    no: i += 1,
                    affiliate: e.publisher !== "" ? decodeURIComponent(e.publisher) : "Unmapped Publisher",
                    wrong_coupon_count: e.total_users,
                    modalDetails: JSON.stringify({
                        wc_code: e.wc_codes,
                        wc_count: e.wc_users
                    })
                };
                mainWcAffilateData.push(data);
            });
        }
        const wrongcouponaffilatedata = await getDataTableConfig(mainWcAffilateData, Engage_Insights_Wrong_Coupon_affilate_Column);
        this.setState({
            engageTopPublisherWcData: wrongcouponaffilatedata,
            engageTopPublisherWcDataIsLoading: false,
        });
    }

    async createCouponUsedDataTable(couponUsed) {

        let maincouponUsed = [];
        if (couponUsed !== undefined) {
            couponUsed.map((e, i) => {
                const data = {
                    no: i += 1,
                    lower_code: e.lower_code,
                    code_percentage: e.code_percentage + '%',
                    conversion_rate: (((e.orders / e.sessions) * 100)).toFixed(2) + '%'
                };
                maincouponUsed.push(data);
            });

        }
        const couponUsedDataTable = await getDataTableConfig(maincouponUsed, Coupon_Used_Column);

        this.setState({
            couponUsedData: couponUsedDataTable,
            couponUsedDataIsLoading: false,
        });
    }



    async createCheckoutPageConversionRateDataTable(convRateData) {

        let mainConvRate = [];

        if (convRateData !== undefined && convRateData.hasOwnProperty('wc_sessions')) {
            mainConvRate = [
                {
                    conversion_type: "Users with wrong coupons",
                    session: convRateData.wc_sessions,
                    order: convRateData.wc_orders,
                    conversion_rate: convRateData.wc_cr !== undefined && convRateData.wc_cr !== null ? parseFloat(convRateData.wc_cr).toFixed(2) + '%' : '0.00%'
                },
                {
                    conversion_type: "Users with right coupons",
                    session: convRateData.rc_sessions,
                    order: convRateData.rc_orders,
                    conversion_rate: convRateData.rc_cr !== undefined && convRateData.rc_cr !== null ? parseFloat(convRateData.rc_cr).toFixed(2) + '%' : '0.00%'
                },
                {
                    conversion_type: "Users who don't use coupons",
                    session: convRateData.unaided_checkout_sessions,
                    order: convRateData.unaided_checkout_orders,
                    conversion_rate: convRateData.unaided_cr !== undefined && convRateData.unaided_cr !== null ? parseFloat(convRateData.unaided_cr).toFixed(2) + '%' : '0.00%'
                }
            ];
        }

        const convRateDataTable = await getDataTableConfig(mainConvRate, Checkout_Page_Conversion_Rate_Column);
        this.setState({
            checkoutPageConversionRateData: convRateDataTable,
            checkoutPageConversionRateDataIsLoading: false,
        });
    }



    async createExtensionShopperRecycledUserDataTable(recycleUserData) {
        let mainRecycleUserData = [];
        if (recycleUserData !== undefined) {
            recycleUserData.map((e, i) => {
                const data = {
                    publisher: e.publisher !== "" ? e.publisher : "unmapped publisher",
                    sessions: e.sessions,
                    fpa_sessions: e.fpa_sessions,
                    fpa_conversion: e.fpa_conversion,
                    total_conversion: e.total_conversion,
                    percentageRU: (((~~e.sessions - ~~e.fpa_sessions) / (~~e.sessions)) * 100).toFixed(2) + '%',
                    percentageRO: (((~~e.total_conversion - ~~e.fpa_conversion) / (e.total_conversion)) * 100).toFixed(2) + '%'
                }
                mainRecycleUserData.push(data);
            });
        }
        const recycledata = await getDataTableConfig(mainRecycleUserData, Engage_EEI_Recycle_Affiliate_Sessions_Columns);

        this.setState({
            recycleAffilaiteSessionsEEI: recycledata,
            isRecycleAffilaiteSessionsEEILoading: false,
        });
    }


    async createCouponQualityMetricsDataTable(coupon) {
        let mainCouponData = [];
        if (coupon !== undefined) {
            coupon.map((e, i) => {
                const data = {
                    coupon: e.code + `${e.one_time_coupon ? "(One Time Coupon)" : ""}`,
                    coupon_score: `${Math.floor(e.coupon_score)}/10`,
                    sum_sessions_with_apply_or_copy: e.sum_sessions_with_apply_or_copy,
                    sum_sessions_with_conversions: e.sum_sessions_with_conversions,
                    status: e.status && e.status !== null ? "Active" : 'Inactive',
                }
                mainCouponData.push(data);
            });
        }
        const couponData = await getDataTableConfig(mainCouponData, Engage_Coupon_Quality_Metrics_Columns);

        return couponData;
    }


    async createEngageCashbackCouponDatatable(cashbackCouponData) {
        let maincashbackCouponData = [];
        if (cashbackCouponData !== undefined) {
            cashbackCouponData.map((e, i) => {
                const data = {
                    no: i += 1,
                    ext_name: e.ext_name,
                    percentage: e.percentage + '%'
                };
                maincashbackCouponData.push(data);
            });
        }
        const couponcashbackpercentage = await getDataTableConfig(maincashbackCouponData, Engage_Insights_Cashback_percentage);
        this.setState({
            newcouponcashbackpercentage: couponcashbackpercentage,
            isnewCouponCashbackPercentageLoading: false,
        });
    }


    async createHesitantShopperTopDropoffPagesDatatable(userDropOff) {
        let mainuserDropOffData = [];
        if (userDropOff !== undefined) {
            userDropOff.map((e, i) => {
                let pagePathName = new URL(e.page_url)
                const data = {
                    no: i += 1,
                    page_url: pagePathName !== undefined ? [<><span className="pagePathNameTextEllipse">{pagePathName.pathname}</span><a href={`${e.page_url}`} style={{ color: "#222", fontSize: "12px" }} target="_blank"><i className="fa fa-external-link extenalLinkIcon"></i></a></>] : e.page_url,
                    sessions: e.sessions
                };
                mainuserDropOffData.push(data);
            });
        }
        const hesitantUserDropOffTableData = await getDataTableConfig(mainuserDropOffData, Hesitant_Shopper_User_Drop_Off);
        return hesitantUserDropOffTableData;
    }


    async createHesitantShopperTriggerTimingsDatatable(m) {
        let maintriggerTiming = [];
        if (m.metrics !== undefined && m.metrics.length && m.metrics !== null) {
            m.metrics.map((e) => {
                const data = {
                    key: e.key,
                    value: e.value
                };
                maintriggerTiming.push(data);
            });
        }
        const hesitantTriggerTimingTableData = await getDataTableConfig(maintriggerTiming, Hesitant_Shopper_Trigger_Timing);
        return {
            tableData: hesitantTriggerTimingTableData,
            industryStd: m.hasOwnProperty('industryStd') ? m.industryStd : false
        };
    }

    async setLiveDateRange(splitDateAndPerc) {
        for (let i = 0; i < splitDateAndPerc.length; i++) {
            if (splitDateAndPerc[i].abPerc === 100) {
                const index = i;
                if ((index + 1) === splitDateAndPerc.length) {
                    this.setState({
                        isLiveSelected: true,
                        isLiveSelectedLoading: false
                    })
                } else {
                    this.setState({
                        isLiveSelected: false,
                    })
                }
            }
        }
    }

    setLiveClientScreen(split) {
        this.setState({
            isLiveSelected: split === 100 ? true : false,
            adwareShopperABPerc: split
        })
    }


    async createExtensionShopperCashbackCouponDatatable(cashbackCouponData) {
        let maincashbackCouponData = [];
        if (cashbackCouponData !== undefined) {
            cashbackCouponData.map((e, i) => {
                const data = {
                    no: i += 1,
                    extension_name: e.extension_name,
                    extension_download_url: e.extension_download_url !== undefined && e.extension_download_url !== null ? [<a href={`${e.extension_download_url}`} style={{ color: "#222", fontSize: "12px" }} target="_blank">Link <i className="fa fa-info moreInfoIcon"></i></a>] : "NA",
                    sessions: e.sessions,
                    percent_share: `${parseFloat(e.percent_share).toFixed(2)}%`
                };
                maincashbackCouponData.push(data);
            });
        }
        const couponcashback = await getDataTableConfig(maincashbackCouponData, Extension_Shopper_Cashback_Coupons);
        this.setState({
            extensionShopperCashbackCoupons: couponcashback,
            extensionShopperCashbackCouponsLoading: false,
        });
    }


    async createExtensionShopperPubliserBreakdownDatatable(extensionBreakdownData, aov) {
        let mainExtensionBreakdownData = [];
        if (extensionBreakdownData !== undefined) {
            extensionBreakdownData.map((e, i) => {
                if (e.total_conversions != undefined && e.total_conversions != 0 && e.total_conversions != null) {
                    const data = {
                        publisher: e.publisher !== null && e.publisher !== '' ? e.publisher : "Unmapped Publisher",
                        total_conversions: e.total_conversions,
                        cashback_conversions: e.recycled_cashback_conversions,
                        revenue_misattributed: aov !== undefined && aov !== null ? convertNumbertoCurrencyFormat(e.recycled_cashback_conversions * aov, this.props.sessionClient.currency, 2, 2) : `${getCurrencySymbol(this.props.sessionClient.currency)}0`
                    };
                    mainExtensionBreakdownData.push(data);
                }
            });
        }
        const couponcashbackpercentage = await getDataTableConfig(mainExtensionBreakdownData, Engage_EEI_Recycle_Publisher_Breakdown_Columns);
        return couponcashbackpercentage;
    }

    render() {
        const { loadingPage } = this.props;
        const { personaRecoveredRevState, impactRevenue, singlePersonaData, updatedEngagePersonaList, singlePersonaPromoCodeData, splitDateRangeData, recycleAffilaiteSessionsEEI, indStdRevenue30Days, newcouponcashbackpercentage, websiteRecordById, topInjectionTypes, topMaliciousPages, extensionShopperCashbackCoupons, potentialRevenueTotal, hesitantUserDropOff } = this.state;
        if (loadingPage) {
            return (
                <div className="page-loader-wrapper">
                    <div className="loader">
                        <div className="m-t-30">
                            <img src={LogoiCON} width="48" height="48" alt="Brandlock" />
                        </div>
                        <p>Please wait...</p>
                    </div>
                </div>
            );
        }
        return (
            <div
                onClick={() => {
                    document.body.classList.remove("offcanvas-active");
                }}
            >
                <div>
                    <Toast
                        id="toast-container"
                        show={this.state.loadToaster}
                        onClose={() => {
                            this.setState({
                                loadToaster: false
                            })
                        }}
                        className="toast-info toast-bottom-right"
                        autohide={true}
                        delay={10000}
                    >
                        <Toast.Header className="toast-info mb-0">
                            {this.state.toasterMessage}
                        </Toast.Header>
                    </Toast>
                    <div className="container-fluid">
                        <div className="row clearfix">
                            <div className="col-lg-6 col-md-4">
                                <PageHeader
                                    HeaderText="Shopper Group"
                                    Breadcrumb={[{ name: "Dashboard" }]}
                                />
                            </div>

                            <div className="col-lg-6 col-md-6">

                                <div className="row dashboardActionButtons" >
                                    <div className="text-right pr-0  mr-3">
                                        <PdfDownloader downloadFileName="EngagePersonaDashboard" rootElementId="downloadEngagePersonaDashboardRef" />
                                    </div>
                                    <div className="text-right pl-0  mr-3">
                                        <form onSubmit={(e) => this.handleGetGADataSubmit(e)} className=" d-flex justify-content-end">
                                            {<ShieldDateRange product="shield" dateRange={!this.state.splitDateRangeDataLoading && splitDateRangeData} startDate={this.state.startDate} endDate={this.state.endDate} onDateRangeChange={this.handleDateChange} />}
                                            {!this.state.splitDateRangeDataLoading && splitDateRangeData.length === 0 &&
                                                <DateRange startDate={this.state.startDate} endDate={this.state.endDate} onDateRangeChange={this.handleDateChange} />}

                                        </form>
                                    </div>
                                </div>

                            </div>
                        </div>


                        {/* 

                        <PageHeader
                            HeaderText="Dashboard"
                            Breadcrumb={[{ name: "Dashboard" }]}
                        />
                        <div className="row clearfix">

                            <div className="col-lg-4 col-md-4 mb-3">
                                <PdfDownloader downloadFileName="EngagePersonaDashboard" rootElementId="downloadEngagePersonaDashboardRef" />
                            </div>
                            <div className="col-lg-8 col-md-8 mb-3">
                                <form onSubmit={(e) => this.handleGetGADataSubmit(e)} className=" d-flex justify-content-end">
                                    <DateRange startDate={this.state.startDate} endDate={this.state.endDate} onDateRangeChange={this.handleDateChange} />
                                    
                                </form>
                            </div>
                            <div className="col-lg-12 col-md-12 mb-3 text-center">
                                <span className="text-danger">{this.state.message}</span>
                            </div>
                        </div> */}


                        <div id="downloadEngagePersonaDashboardRef" ref={this.downloadEngagePersonaDashboardRef} className="row clearfix">
                            <div className="col-lg-8 col-md-8">
                                {(this.state.loading.status) ?
                                    <Loader width="col-md-12 col-lg-12" height="150px" /> :
                                    <PersonaListTable personaDetailLoader={{ personaDetailLoaderStatus: this.state.personaDetailLoader, personaRowId: this.state.personaRowId }} indStdRevenue30Days={!this.state.indStdRevenue30DaysIsLoading && indStdRevenue30Days} numberOfDays={differenceInDays(this.state.endDate, this.state.startDate) + 1} handlePersonaDetails={this.handleDymaniDetailRoute} engagePhase={this.state.sitePhase} updatedEngagePersonaList={!this.state.updatedEngagePersonaListLoading && updatedEngagePersonaList}
                                        potentialRevenueTotal={!this.state.potentialRevenueTotalIsLoading && potentialRevenueTotal}
                                        impactRevenue={!this.state.impactRevenueLoading && impactRevenue}
                                        currency={this.props.sessionClient.currency !== undefined && this.props.sessionClient.currency !== null && this.props.sessionClient.currency !== 'select' ? this.props.sessionClient.currency : 'USD'}
                                    />
                                }
                            </div>
                            <div className="col-lg-4 col-md-4">
                                {personaRecoveredRevState.map((data, i) => (
                                    <div key={`engage_div_${i}`}>
                                        {(this.state.loading.status) ?
                                            <Loader key={`engage_loader_${i}`} width="col-md-12 col-lg-12" height="150px" /> :
                                            <PersonaRecoveredRevenue
                                                index={i}
                                                key={`engage__db___${i}`}
                                                Heading={[<h6 key={`engage__db_heading_${i}`} > {this.state.sitePhase.id >= 0 ? "Overall Revenue" : "Overall Potential Revenue"}</h6>]}
                                                Money={[<h3 key={`engage__db_money_${i}`} className={`pb-0 m-b-60 m-t-60 ${this.state.sitePhase.id < 0 ? "potentialColor" : ""}`}><strong>{(this.state.impactRevenueLoading) ? this.state.loading.message : !isNaN(parseFloat(impactRevenue)) ? parseFloat(impactRevenue).toLocaleString('en-US', {
                                                    style: 'currency', currency: this.props.sessionClient.currency !== undefined && this.props.sessionClient.currency !== null && this.props.sessionClient.currency !== 'select' ? this.props.sessionClient.currency : 'USD', minimumFractionDigits: 0,
                                                    maximumFractionDigits: 0
                                                }) : 0}</strong></h3>]}
                                                revenueImpact={(this.state.impactRevenueLoading) ? this.state.loading.message : !isNaN(parseFloat(impactRevenue)) && parseInt(impactRevenue) !== 0 ? parseFloat(impactRevenue).toLocaleString('en-US', {
                                                    style: 'currency', currency: this.props.sessionClient.currency !== undefined && this.props.sessionClient.currency !== null && this.props.sessionClient.currency !== 'select' ? this.props.sessionClient.currency : 'USD', minimumFractionDigits: 0,
                                                    maximumFractionDigits: 0
                                                }) : 0}
                                                PerText="How it was calculated?"
                                                isRevenuePotential={this.state.sitePhase.id < 0 ? true : false}
                                                //PerText={false}
                                                Days={[<span key={`engage__db_days_${i}`} className="smallText pb-0">({differenceInDays(this.state.endDate, this.state.startDate) + 1} days)</span>]}
                                                isRandomUpdate={false}
                                                indStdRevenue30Days={!this.state.indStdRevenue30DaysIsLoading && indStdRevenue30Days}
                                                // Data={data.sparklineData}
                                                mainData={data.sparklineData.data}
                                                chartColor={"#769ccd"}
                                                ContainerClass="col-lg-12 col-md-12 col-sm-12 p-0"
                                                alignText="text-center"
                                                BlockHeight={65}
                                            />
                                        }
                                    </div>
                                ))}

                                {/* <PersonaRecoveredRevenue className="dbCard" mainData={data.sparklineData.data} data={personaRecoveredRevState}/> */}
                            </div>

                            <div className="col-lg-12 col-md-12 pl-0 pr-0">
                                {this.state.personaDetailLoader ? <Loader width="col-md-12 col-lg-12" height="150px" /> : this.state.personaDetailMessage}
                                {this.state.loadPersonaDetails ? <PersonaDetailCard_v2
                                    numberOfDays={differenceInDays(this.state.endDate, this.state.startDate) + 1}
                                    recycleAffilaiteSessionsEEI={!this.state.isRecycleAffilaiteSessionsEEILoading && recycleAffilaiteSessionsEEI}
                                    newcouponcashbackpercentage={!this.state.isnewCouponCashbackPercentageLoading && newcouponcashbackpercentage}
                                    extensionShopperCashbackCoupons={!this.state.extensionShopperCashbackCouponsLoading && extensionShopperCashbackCoupons}
                                    wcTopCode={!this.state.engageTopCodesDataIsLoading && this.state.engageTopCodesData}
                                    wcTopPublisher={!this.state.engageTopPublisherWcDataIsLoading && this.state.engageTopPublisherWcData}
                                    handleMessageChange={this.handleMessageChange}
                                    siteId={this.props.sessionClient.web_id}
                                    engagePersonaMessages={this.state.engagePersonaMessages} engagePersonaSplitList={this.state.engagePersonaSplitList}
                                    handleSinglePersonaPromoCodeData={(d) => this.handleSinglePersonaPromoCodeData(d)}
                                    singlePersonaPromoCodeData={!this.state.singlePersonaPromoCodeDataLoading && singlePersonaPromoCodeData}
                                    singlePersonaData={singlePersonaData}
                                    couponCashData={!this.state.engageTopCouponsCashbackDataIsLoading && this.state.engageTopCouponsCashbackData}
                                    topInjectionTypes={!this.state.topInjectionTypesLoading && topInjectionTypes}
                                    topMaliciousPages={!this.state.topMaliciousPagesLoading && topMaliciousPages}
                                    abData={!this.state.websiteRecordByIdLoading && websiteRecordById}
                                    platform={this.props.sessionClient.analytics_platform}
                                    isLiveSelected={!this.state.isLiveSelectedLoading && this.state.isLiveSelected}
                                    currency={this.props.sessionClient.currency !== undefined && this.props.sessionClient.currency !== null && this.props.sessionClient.currency !== 'select' ? this.props.sessionClient.currency : 'USD'}
                                    locationObject={this.props.location}
                                /> : ""}
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

const mapStateToProps = ({
    analyticalReducer,
    websiteRecordReducer
}) => ({
    loadingPage: analyticalReducer.loadingPage,
    sessionClient: websiteRecordReducer.sessionClient,
    websiteRecord: websiteRecordReducer.websiteRecord,
    shopperRecord: websiteRecordReducer.shopperRecord
});

export default connect(mapStateToProps, {
    websiteRecordAction,
    onPressSideMenuTab
})(Persona_v2);