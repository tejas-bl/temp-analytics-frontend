import React from "react";
import { connect } from "react-redux";
import LogoiCON from "../../assets/images/logo-icon.svg";
import moment from 'moment';

import PageHeader from "../../components/PageHeader";
import {
  sparkleCardData,
  logsData
} from "../../Data/DashbordData";
import {
  toggleMenuArrow,
  onPressTopProductDropDown,
  loadSparcleCard,
  onPressReferralsDropDown,
  onPressRecentChatDropDown,
  onPressDataManagedDropDown,
  facebookProgressBar,
  twitterProgressBar,
  affiliatesProgressBar,
  searchProgressBar,
  websiteRecordAction
} from "../../actions";
import PieChart from "../../components/Charts/PieChart";
import LogsCard from "../../components/Dashboard/LogsCard";
import UpcomingActionsNeeded from "../../components/Dashboard/UpcomingActionsNeeded";
import ShieldAndPersonaCard from "../../components/Dashboard/ShieldAndPersonaCard";
import { getListeningPhaseIndustryStd, getPostPhaseAdwareShopperData, getShieldGAData, getShieldYTD, getWebsitesRecordById } from "../../api/shieldDashboard";
import { convertDateTOLocale, getCurrentUser } from "../../helper/Utils";
import { geteEngageConsolidateRevenue, getEngagePersona, getEngagePersonaMetricsHesitantShopper, getEngagePersonaMetricsWC_EEI_CR, getEngagePersonaMetricsWhyNotShopper, getEngagePrePhaseHesitantPersonaImpactDayCount, getEngagePrePhasePersonaImpactDayCount, getEngagePrePhaseWhyNotPersonaImpactDayCount } from "../../api/Engage/OldDB";
import Loader from "../../helper/Loader";
import { getClientHistory, getSplitClientHistory } from "../../api/Dashboard/OldDB";
import { addDays, differenceInDays, subDays } from "date-fns";
import { getCouponsMappedtoPersona } from "../../api/Engage/PromoCode";
import { processCRPersonaMetricsResult, processEEIPersonaMetricsResult, processHesitantPersonaMetricsResult, processWCPersonaMetricsResult, processWhyNotPersonaMetricsResult } from "../../helper/Engage";
// import { getClientHistory } from "../../api/Dashboard/OldDB";
import { onPressSideMenuTab } from '../../actions';
import Joyride, { ACTIONS, CallBackProps, EVENTS, STATUS, Step } from "react-joyride";

class Dashbord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: this.props.sessionClient.web_account_id != 508 ? subDays(new Date(), 31) : new Date('2022-12-01'),
      endDate: this.props.sessionClient.web_account_id != 508 ? subDays(new Date(), 2) : new Date('2022-12-31'),
      startDateYTD: this.props.sessionClient.web_account_id != 508 ? new Date(new Date().getFullYear(), 0, 1) : new Date('2022-01-01'),
      endDateYTD: this.props.sessionClient.web_account_id != 508 ? subDays(new Date(), 0) : new Date('2022-12-31'),
      currentMonthStartDate: moment().startOf('month').format('YYYY-MM-DD hh:mm'),
      currentMonthEndDate: moment().endOf('month').format('YYYY-MM-DD hh:mm'),
      websiteRecordById: {},
      websiteRecordByIdLoading: true,
      cardData: [],
      shieldBlocks: {},
      personaBlock: {},
      engagePersonaList: {},
      engagePersonaListLoading: true,
      clientHistoryData: {},
      couponsMappedToPersona: [],
      couponsMappedToPersonaLoading: true,
      clientHistoryDataLoading: true,
      engageUpdatedPersonaList: {},
      engageUpdatedPersonaListLoading: true,
      engageUpdatedPrePersonaListLoading: true,
      logs: {},
      logsLoading: true,
      loading: {
        status: true,
        message: "loading"
      },
      personaRevenueStartDate: subDays(new Date(), 31),
      personaRevenueEndDate: subDays(new Date(), 2),
    };

    this.handlePersonaUpdates = this.handlePersonaUpdates.bind(this);
    this.handlePrePhasePersonaUpdates = this.handlePrePhasePersonaUpdates.bind(this);
    this.handleClientHistory = this.handleClientHistory.bind(this);
    this.handleSplitClientHistory = this.handleSplitClientHistory.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleShieldAndEngageBlock = this.handleShieldAndEngageBlock.bind(this);
  }


  async handleDateChange(item) {
    const siteIdInput = this.props.sessionClient.web_id;
    const startDate = convertDateTOLocale(item[0].startDate);
    const endDate = convertDateTOLocale(item[0].endDate);

    const headerConfigPassed = {
      headers: {
        Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${getCurrentUser().data.data.refresh_token}`,
      }
    }
    this.setState({
      loading: {
        status: true,
        message: "loading"
      },
      startDate: item[0].startDate,
      endDate: item[0].endDate
    })
    const getWebsitesRecordByIdData = await getWebsitesRecordById(this.props.sessionClient.web_id, headerConfigPassed)
    const siteInput = { siteIdInput, startDate, endDate };

    if (getWebsitesRecordByIdData && getWebsitesRecordByIdData.hasOwnProperty("data") && getWebsitesRecordByIdData.data.length > 0) {
      if ((getWebsitesRecordByIdData.data[0].engage && getWebsitesRecordByIdData.data[0].engage_ab === false) || getWebsitesRecordByIdData.data[0].ab_status === true && getWebsitesRecordByIdData.data[0].ab_perc === 100) {
        await this.handlePersonaUpdates(siteInput, headerConfigPassed, getWebsitesRecordByIdData);
      } else if ((getWebsitesRecordByIdData.data[0].engage && getWebsitesRecordByIdData.data[0].engage_ab) || (getWebsitesRecordByIdData.data[0].ab_status === true && getWebsitesRecordByIdData.data[0].ab_perc !== 100)) {
        await this.handlePersonaUpdates(siteInput, headerConfigPassed, getWebsitesRecordByIdData);
      } else {
        await this.handlePrePhasePersonaUpdates(siteInput, headerConfigPassed, getWebsitesRecordByIdData)
      }
    }
  }

  async handleClientHistory(siteInput, headerConfigPassed) {
    return await getClientHistory(siteInput, headerConfigPassed);
  }


  async handleSplitClientHistory(siteInputs, headerConfigPassed) {
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
  async handlePrePhasePersonaUpdates(siteInputs, headerConfigPassed, getWebsitesRecordByIdData, upcomingActionsNeededList) {

    let prePhasePersonaData = [];
    let listening_phase_aov_30_days = null;
    let listening_phase_orders_30_days = null;
    let numberOfDays = differenceInDays(this.state.endDate, this.state.startDate) + 1;
    const [getEngagePersonaMetricsWhyNotShopperData, getEngagePersonaMetricsHesitantShopperData, getEngagePersonaMetricsWC_EEI_CRData, getShieldGADataData, getEngagePrePhasePersonaImpactDayCountData] = await Promise.all([
      getEngagePersonaMetricsWhyNotShopper(siteInputs, headerConfigPassed),
      getEngagePersonaMetricsHesitantShopper(siteInputs, headerConfigPassed),
      getEngagePersonaMetricsWC_EEI_CR(siteInputs, headerConfigPassed),
      getShieldGAData(siteInputs, headerConfigPassed),
      getEngagePrePhasePersonaImpactDayCount(siteInputs, headerConfigPassed)
    ])
    let splitDates = [];

    if (this.state.clientHistoryData && this.state.clientHistoryData.data !== undefined) {
      splitDates = this.state.clientHistoryData.data.map((d) => {
        return convertDateTOLocale(d.prod_invalidated_on)
      })
    }
    const [
      getShieldYTDData] = await Promise.all([
        getShieldYTD({ siteIdInput: this.props.sessionClient.web_id, startDate: convertDateTOLocale(this.state.startDateYTD), endDate: convertDateTOLocale(this.state.endDateYTD) }, splitDates, headerConfigPassed)
      ])

    if (getWebsitesRecordByIdData !== undefined && getWebsitesRecordByIdData.hasOwnProperty('data') && getWebsitesRecordByIdData.data.length) {
      listening_phase_aov_30_days = getWebsitesRecordByIdData.data[0].listening_phase_aov_30_days;
      listening_phase_orders_30_days = getWebsitesRecordByIdData.data[0].listening_phase_orders_30_days;
    }

    if (!this.state.engagePersonaListLoading) {
      prePhasePersonaData = await Promise.all(this.state.engagePersonaList.map(async (d) => {

        if (d.short_code === "shield") {
          const getListeningPhaseIndustryStdData = await getListeningPhaseIndustryStd(siteInputs, headerConfigPassed);
          if (getListeningPhaseIndustryStdData.hasOwnProperty('data') && getListeningPhaseIndustryStdData.data.length) {
            let industyStdData = getListeningPhaseIndustryStdData.data[0];
            const recoveredRevenue = industyStdData.projected_recovered_revenue
            d.personaRevPotential = recoveredRevenue !== 0 && recoveredRevenue !== null ? recoveredRevenue : 0;
            if (d.personaRevPotential !== 0) upcomingActionsNeededList.push(d);
            return d;
          }

          return {
            personaRevPotential: 0,
            ...d
          }
          // const premiumProductData = await this.processWhyNotPersonaMetricsResult(getEngagePersonaMetricsWC_EEI_CRData);
        } else if (d.short_code === "wc") {
          let dayCount = null;
          let personaRevProjected = 0;
          if (getEngagePrePhasePersonaImpactDayCountData !== undefined && getEngagePrePhasePersonaImpactDayCountData.hasOwnProperty('data')) {
            dayCount = getEngagePrePhasePersonaImpactDayCountData.data[0].days_with_wc_count * 1;
          }
          const wcData = await processWCPersonaMetricsResult(getEngagePersonaMetricsWC_EEI_CRData, { totalAOV: getShieldGADataData.data.total_aov }, dayCount, numberOfDays, listening_phase_aov_30_days);
          if (wcData.personaMetrics[1].hasOwnProperty('brandlock_on_projected') && wcData.personaMetrics[1].brandlock_on_projected != 0) {
            personaRevProjected = wcData.personaMetrics[1].brandlock_on_projected;

          } else if (getShieldGADataData.data.total_transactions != 0 && getShieldGADataData.data.total_aov != 0) {
            personaRevProjected = getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift;
          } else if (!isNaN(listening_phase_orders_30_days) && listening_phase_orders_30_days !== 0 && !isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
            personaRevProjected = listening_phase_orders_30_days * d.industry_std_transaction_sog * listening_phase_aov_30_days * d.industry_std_lift;
          }

          d.personaRevPotential = personaRevProjected * d.apply_ratio;
          //d.personaRevPotential = wcData.personaMetrics[1].brandlock_on_projected != 0 ? wcData.personaMetrics[1].brandlock_on_projected * d.apply_ratio : getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift * d.apply_ratio;
          //d.personaRevPotential = getEngagePersonaMetricsWC_EEI_CRData.hasOwnProperty("data") && getEngagePersonaMetricsWC_EEI_CRData.data.length > 0 ? wcData.personaMetrics[1].brandlock_on_projected : getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * 0.01;

          if (d.personaRevPotential !== 0 && getWebsitesRecordByIdData.data[0].wrong_coupon_eligible) upcomingActionsNeededList.push(d);

          return d;

        } else if (d.short_code === "e-ei") {
          let dayCount = null;
          let personaRevProjected = 0;
          if (getEngagePrePhasePersonaImpactDayCountData !== undefined && getEngagePrePhasePersonaImpactDayCountData.hasOwnProperty('data')) {
            dayCount = getEngagePrePhasePersonaImpactDayCountData.data[0].days_with_eei_sessions_count * 1;
          }
          const prePhaseEEIData = await processEEIPersonaMetricsResult(getEngagePersonaMetricsWC_EEI_CRData, { totalAOV: getShieldGADataData.data.total_aov }, dayCount, numberOfDays, listening_phase_aov_30_days);

          if (prePhaseEEIData.personaMetrics[1].hasOwnProperty('brandlock_on_projected') && prePhaseEEIData.personaMetrics[1].brandlock_on_projected != 0) {
            personaRevProjected = prePhaseEEIData.personaMetrics[1].brandlock_on_projected;
          } else if (getShieldGADataData.data.total_transactions != 0 && getShieldGADataData.data.total_aov != 0) {
            personaRevProjected = getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift;
          } else if (!isNaN(listening_phase_orders_30_days) && listening_phase_orders_30_days !== 0 && !isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
            personaRevProjected = listening_phase_orders_30_days * d.industry_std_transaction_sog * listening_phase_aov_30_days * d.industry_std_lift;
          }
          d.personaRevPotential = personaRevProjected * d.apply_ratio;

          /*           
          d.personaRevPotential = eeiData.personaMetrics[1].brandlock_on_projected != 0 ? eeiData.personaMetrics[1].brandlock_on_projected * d.apply_ratio : getShieldGADataData.data.total_transactions * 0.05 * getShieldGADataData.data.total_aov * d.industry_std_lift * d.apply_ratio;
           */
          if (d.personaRevPotential !== 0) upcomingActionsNeededList.push(d);
          return d;

        } else if (d.short_code === "ti3") {
          let dayCount = null;
          let personaRevProjected = null;
          const hesitantShopperImpactDayCount = await getEngagePrePhaseHesitantPersonaImpactDayCount(siteInputs, headerConfigPassed);
          if (hesitantShopperImpactDayCount !== undefined && hesitantShopperImpactDayCount.hasOwnProperty('data')) {
            dayCount = hesitantShopperImpactDayCount.data[0].days_with_hesitant_session_count * 1;
          }
          const prePhaseTI3Data = await processHesitantPersonaMetricsResult(getEngagePersonaMetricsHesitantShopperData, { totalAOV: getShieldGADataData.data.total_aov }, dayCount, numberOfDays, listening_phase_aov_30_days);

          if (prePhaseTI3Data.personaMetrics[1].hasOwnProperty('brandlock_on_projected') && prePhaseTI3Data.personaMetrics[1].brandlock_on_projected != 0) {
            personaRevProjected = prePhaseTI3Data.personaMetrics[1].brandlock_on_projected;
          } else if (getShieldGADataData.data.total_transactions != 0 && getShieldGADataData.data.total_aov != 0) {
            personaRevProjected = getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift;
          } else if (!isNaN(listening_phase_orders_30_days) && listening_phase_orders_30_days !== 0 && !isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
            personaRevProjected = listening_phase_orders_30_days * d.industry_std_transaction_sog * listening_phase_aov_30_days * d.industry_std_lift;
          }

          d.personaRevPotential = personaRevProjected * d.apply_ratio;
          //d.personaRevPotential = hesitantData.personaMetrics[1].brandlock_on_projected != 0 ? hesitantData.personaMetrics[1].brandlock_on_projected * d.apply_ratio : getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift * d.apply_ratio;

          if (d.personaRevPotential !== 0) upcomingActionsNeededList.push(d);
          return d;

        } else if (d.short_code === "epr") {
          let dayCount = null;
          let personaRevProjected = 0;
          if (getEngagePrePhasePersonaImpactDayCountData !== undefined && getEngagePrePhasePersonaImpactDayCountData.hasOwnProperty('data')) {
            dayCount = getEngagePrePhasePersonaImpactDayCountData.data[0].days_with_coupon_runner_count * 1;
          }

          const prePhaseEPRData = await processCRPersonaMetricsResult(getEngagePersonaMetricsWC_EEI_CRData, { totalAOV: getShieldGADataData.data.total_aov }, dayCount, numberOfDays, listening_phase_aov_30_days);
          if (prePhaseEPRData.personaMetrics[1].hasOwnProperty('brandlock_on_projected') && prePhaseEPRData.personaMetrics[1].brandlock_on_projected != 0) {
            personaRevProjected = prePhaseEPRData.personaMetrics[1].brandlock_on_projected;
          } else if (getShieldGADataData.data.total_transactions != 0 && getShieldGADataData.data.total_aov != 0) {
            personaRevProjected = getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift;
          } else if (!isNaN(listening_phase_orders_30_days) && listening_phase_orders_30_days !== 0 && !isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
            personaRevProjected = listening_phase_orders_30_days * d.industry_std_transaction_sog * listening_phase_aov_30_days * d.industry_std_lift;
          }
          d.personaRevPotential = personaRevProjected * d.apply_ratio;

          //d.personaRevPotential = CRData.personaMetrics[1].brandlock_on_projected != 0 ? CRData.personaMetrics[1].brandlock_on_projected * d.apply_ratio : getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift * d.apply_ratio;

          if (d.personaRevPotential !== 0) upcomingActionsNeededList.push(d);
          return d;

        } else if (d.short_code === "cs") {
          let dayCount = null;
          let prePhaseCSDataProjected = 0;
          const whyNotShopperImpactDayCount = await getEngagePrePhaseWhyNotPersonaImpactDayCount(siteInputs, headerConfigPassed);
          if (whyNotShopperImpactDayCount !== undefined && whyNotShopperImpactDayCount.hasOwnProperty('data')) {
            dayCount = whyNotShopperImpactDayCount.data[0].days_with_cart_reduction * 1;
          }
          const prePhaseCSData = await processWhyNotPersonaMetricsResult(getEngagePersonaMetricsWhyNotShopperData, { totalAOV: getShieldGADataData.data.total_aov }, dayCount, numberOfDays, listening_phase_aov_30_days);

          if (prePhaseCSData.personaMetrics[1].hasOwnProperty('brandlock_on_projected') && prePhaseCSData.personaMetrics[1].brandlock_on_projected != 0) {
            prePhaseCSDataProjected = prePhaseCSData.personaMetrics[1].brandlock_on_projected
          } else if (getShieldGADataData.data.total_transactions != 0 && getShieldGADataData.data.total_aov != 0) {
            prePhaseCSDataProjected = getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift;
          } else if (!isNaN(listening_phase_orders_30_days) && listening_phase_orders_30_days !== 0 && !isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
            prePhaseCSDataProjected = listening_phase_orders_30_days * d.industry_std_transaction_sog * listening_phase_aov_30_days * d.industry_std_lift;
          }
          d.personaRevPotential = prePhaseCSDataProjected * d.apply_ratio
          //d.personaRevPotential = whyNotData.personaMetrics[1].brandlock_on_projected != 0 ? whyNotData.personaMetrics[1].brandlock_on_projected * d.apply_ratio : getShieldGADataData.data.total_transactions * 0.1 * getShieldGADataData.data.total_aov * d.industry_std_lift * d.apply_ratio;
          if (d.personaRevPotential !== 0) upcomingActionsNeededList.push(d);
          return d;

        } else if (d.short_code === "pp") {
          // const premiumProductData = await this.processWhyNotPersonaMetricsResult(getEngagePersonaMetricsWC_EEI_CRData);
          return {
            personaRevPotential: 0,
            ...d
          }
        }
      }));// promise end

    }

    this.setState({
      engageUpdatedPersonaList: prePhasePersonaData,
      engageUpdatedPrePersonaListLoading: false,
      engageUpdatedPersonaListLoading: false,
      couponsMappedToPersona: upcomingActionsNeededList,
      couponsMappedToPersonaLoading: false,

      loading: {
        status: false,
        message: ""
      },
    })

  }

  async handlePersonaUpdates(siteInputs, headerConfigPassed, getWebsitesRecordByIdData, upcomingActionsNeededList) {
    let personaBlock = [];
    let splitDates = [];
    let listening_phase_aov_30_days = null;
    let listening_phase_orders_30_days = null;
    let numberOfDays = differenceInDays(this.state.endDate, this.state.startDate) + 1;
    let numberOfDaysYTD = differenceInDays(this.state.endDateYTD, this.state.startDateYTD) + 1;
    let siteInputYTD = { siteIdInput: this.props.sessionClient.web_id, startDate: convertDateTOLocale(this.state.startDateYTD), endDate: convertDateTOLocale(this.state.endDateYTD) };
    if (this.state.clientHistoryData && this.state.clientHistoryData.data !== undefined) {
      splitDates = this.state.clientHistoryData.data.map((d) => {
        return convertDateTOLocale(d.prod_invalidated_on)
      })
    }

    let impactRevenueResult = 0;

    let getEngageGADataData,
      getShieldYTDData,
      getEngagePersonaMetricsWhyNotShopperData,
      getEngagePersonaMetricsHesitantShopperData,
      getEngagePersonaMetricsWC_EEI_CRData,
      getShieldGADataData, getEngagePrePhasePersonaImpactDayCountData = null;

    if (getWebsitesRecordByIdData !== undefined && getWebsitesRecordByIdData.hasOwnProperty('data') && getWebsitesRecordByIdData.data.length) {
      listening_phase_aov_30_days = getWebsitesRecordByIdData.data[0].listening_phase_aov_30_days;
      listening_phase_orders_30_days = getWebsitesRecordByIdData.data[0].listening_phase_orders_30_days;
    }

    [getEngageGADataData,
      getShieldYTDData,
      getEngagePersonaMetricsWhyNotShopperData,
      getEngagePersonaMetricsHesitantShopperData,
      getEngagePersonaMetricsWC_EEI_CRData,
      getShieldGADataData, getEngagePrePhasePersonaImpactDayCountData] = await Promise.all([
        geteEngageConsolidateRevenue(siteInputYTD, numberOfDaysYTD, headerConfigPassed),
        getShieldYTD(siteInputYTD, splitDates, headerConfigPassed),
        // geteEngageCouponBreakdown(siteInputs, headerConfigPassed),
        getEngagePersonaMetricsWhyNotShopper(siteInputs, headerConfigPassed),
        getEngagePersonaMetricsHesitantShopper(siteInputs, headerConfigPassed),
        getEngagePersonaMetricsWC_EEI_CR(siteInputs, headerConfigPassed),
        getShieldGAData(siteInputs, headerConfigPassed),
        getEngagePrePhasePersonaImpactDayCount(siteInputs, headerConfigPassed)

      ]);

    if (!this.state.engagePersonaListLoading) {
      personaBlock = await Promise.all(this.state.engagePersonaList.map(async (d) => {

        if (d.short_code === "shield") {
          let recoveredRevenue = 0;
          if (getWebsitesRecordByIdData.data[0].ab_perc !== 100) {
            if (getShieldYTDData.statuscode !== undefined || getShieldYTDData.statuscode === 200) {
              recoveredRevenue = getShieldYTDData.data.recovered_revenue
              return {
                personaStatus: getWebsitesRecordByIdData.data[0].ab_status,
                personaRev: recoveredRevenue,
                ...d
              }
            }
          } else {
            const postPhaseMetrics = await getPostPhaseAdwareShopperData(siteInputYTD, headerConfigPassed);
            if (postPhaseMetrics !== undefined && postPhaseMetrics.statuscode && postPhaseMetrics.hasOwnProperty('data') && postPhaseMetrics.data.length) {
              recoveredRevenue = postPhaseMetrics.data[0].c_revenue
            }
            return {
              personaStatus: getWebsitesRecordByIdData.data[0].ab_status,
              personaRev: recoveredRevenue,
              ...d
            }
          }

          return {
            personaRevPotential: 0,
            ...d
          }
        } else if (d.short_code === "wc") {
          let wc_revenue = null;
          if (getWebsitesRecordByIdData.hasOwnProperty("data") && !getWebsitesRecordByIdData.data[0].wrong_coupon && getWebsitesRecordByIdData.data[0].wrong_coupon_eligible) {
            let dayCount = null;
            let personaRevProjected = 0;
            if (getEngagePrePhasePersonaImpactDayCountData !== undefined && getEngagePrePhasePersonaImpactDayCountData.hasOwnProperty('data')) {
              dayCount = getEngagePrePhasePersonaImpactDayCountData.data[0].days_with_wc_count * 1;
            }
            const wcData = await processWCPersonaMetricsResult(getEngagePersonaMetricsWC_EEI_CRData, { totalAOV: getShieldGADataData.data.total_aov }, dayCount, numberOfDays, listening_phase_aov_30_days);
            if (wcData.personaMetrics[1].hasOwnProperty('brandlock_on_projected') && wcData.personaMetrics[1].brandlock_on_projected != 0) {
              personaRevProjected = wcData.personaMetrics[1].brandlock_on_projected;

            } else if (getShieldGADataData.data.total_transactions != 0 && getShieldGADataData.data.total_aov != 0) {
              personaRevProjected = getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift;
            } else if (!isNaN(listening_phase_orders_30_days) && listening_phase_orders_30_days !== 0 && !isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
              personaRevProjected = listening_phase_orders_30_days * d.industry_std_transaction_sog * listening_phase_aov_30_days * d.industry_std_lift;
            }

            d.personaRevPotential = personaRevProjected * d.apply_ratio;
            upcomingActionsNeededList.push(d);
          } else {
            if (getWebsitesRecordByIdData.hasOwnProperty("data") && getEngageGADataData.data.length && getWebsitesRecordByIdData.data[0].wrong_coupon) {
              wc_revenue = getEngageGADataData.data[0].wc_revenue !== null ? parseInt(getEngageGADataData.data[0].wc_revenue) : 0;
              impactRevenueResult += wc_revenue
            }
          }
          return {
            personaStatus: getWebsitesRecordByIdData.data[0].wrong_coupon,
            personaRev: wc_revenue !== null ? wc_revenue : 0,
            ...d
          }
        } else if (d.short_code === "e-ei") {
          let prePhaseEEIData = null;
          let eei_revenue = null;
          if (getWebsitesRecordByIdData.hasOwnProperty("data") && !getWebsitesRecordByIdData.data[0].extension_trigger) {
            let dayCount = null;
            let personaRevProjected = 0;
            if (getEngagePrePhasePersonaImpactDayCountData !== undefined && getEngagePrePhasePersonaImpactDayCountData.hasOwnProperty('data')) {
              dayCount = getEngagePrePhasePersonaImpactDayCountData.data[0].days_with_eei_sessions_count * 1;
            }
            const prePhaseEEIData = await processEEIPersonaMetricsResult(getEngagePersonaMetricsWC_EEI_CRData, { totalAOV: getShieldGADataData.data.total_aov }, dayCount, numberOfDays, listening_phase_aov_30_days);

            if (prePhaseEEIData.personaMetrics[1].hasOwnProperty('brandlock_on_projected') && prePhaseEEIData.personaMetrics[1].brandlock_on_projected != 0) {
              personaRevProjected = prePhaseEEIData.personaMetrics[1].brandlock_on_projected;
            } else if (getShieldGADataData.data.total_transactions != 0 && getShieldGADataData.data.total_aov != 0) {
              personaRevProjected = getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift;
            } else if (!isNaN(listening_phase_orders_30_days) && listening_phase_orders_30_days !== 0 && !isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
              personaRevProjected = listening_phase_orders_30_days * d.industry_std_transaction_sog * listening_phase_aov_30_days * d.industry_std_lift;
            }
            d.personaRevPotential = personaRevProjected * d.apply_ratio; upcomingActionsNeededList.push(d);
          } else {
            if (getWebsitesRecordByIdData.hasOwnProperty("data") && getEngageGADataData.data.length && getWebsitesRecordByIdData.data[0].extension_trigger) {
              eei_revenue = getEngageGADataData.data[0].eei_revenue !== null ? parseInt(getEngageGADataData.data[0].eei_revenue) : 0
              impactRevenueResult += eei_revenue
            }

          }

          return {
            personaStatus: getWebsitesRecordByIdData.data[0].extension_trigger,
            personaRev: eei_revenue !== null ? eei_revenue : 0,
            ...d
          }
        } else if (d.short_code === "ti3") {
          let ti3_revenue = null;
          if (getWebsitesRecordByIdData.hasOwnProperty("data") && !getWebsitesRecordByIdData.data[0].hesitant_trigger && getEngagePersonaMetricsHesitantShopperData.data.length > 0) {
            let dayCount = null;
            let personaRevProjected = null;
            const hesitantShopperImpactDayCount = await getEngagePrePhaseHesitantPersonaImpactDayCount(siteInputs, headerConfigPassed);
            if (hesitantShopperImpactDayCount !== undefined && hesitantShopperImpactDayCount.hasOwnProperty('data')) {
              dayCount = hesitantShopperImpactDayCount.data[0].days_with_hesitant_session_count * 1;
            }
            const prePhaseTI3Data = await processHesitantPersonaMetricsResult(getEngagePersonaMetricsHesitantShopperData, { totalAOV: getShieldGADataData.data.total_aov }, dayCount, numberOfDays, listening_phase_aov_30_days);

            if (prePhaseTI3Data.personaMetrics[1].hasOwnProperty('brandlock_on_projected') && prePhaseTI3Data.personaMetrics[1].brandlock_on_projected != 0) {
              personaRevProjected = prePhaseTI3Data.personaMetrics[1].brandlock_on_projected;
            } else if (getShieldGADataData.data.total_transactions != 0 && getShieldGADataData.data.total_aov != 0) {
              personaRevProjected = getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift;
            } else if (!isNaN(listening_phase_orders_30_days) && listening_phase_orders_30_days !== 0 && !isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
              personaRevProjected = listening_phase_orders_30_days * d.industry_std_transaction_sog * listening_phase_aov_30_days * d.industry_std_lift;
            }

            d.personaRevPotential = personaRevProjected * d.apply_ratio;
            upcomingActionsNeededList.push(d);
          } else {
            if (getWebsitesRecordByIdData.hasOwnProperty("data") && getEngageGADataData.data.length && getWebsitesRecordByIdData.data[0].hesitant_trigger) {
              ti3_revenue = getEngageGADataData.data[0].ti3_revenue !== null ? parseInt(getEngageGADataData.data[0].ti3_revenue) : 0;
              impactRevenueResult += ti3_revenue
            }
          }
          return {
            personaStatus: getWebsitesRecordByIdData.data[0].hesitant_trigger,
            personaRev: ti3_revenue !== null ? ti3_revenue : 0,
            ...d
          }
        } else if (d.short_code === "epr") {

          let epr_revenue = null;
          if (getWebsitesRecordByIdData.hasOwnProperty("data") && !getWebsitesRecordByIdData.data[0].prediction_trigger) {
            let dayCount = null;
            let personaRevProjected = 0;
            if (getEngagePrePhasePersonaImpactDayCountData !== undefined && getEngagePrePhasePersonaImpactDayCountData.hasOwnProperty('data')) {
              dayCount = getEngagePrePhasePersonaImpactDayCountData.data[0].days_with_coupon_runner_count * 1;
            }

            const prePhaseEPRData = await processCRPersonaMetricsResult(getEngagePersonaMetricsWC_EEI_CRData, { totalAOV: getShieldGADataData.data.total_aov }, dayCount, numberOfDays, listening_phase_aov_30_days);
            if (prePhaseEPRData.personaMetrics[1].hasOwnProperty('brandlock_on_projected') && prePhaseEPRData.personaMetrics[1].brandlock_on_projected != 0) {
              personaRevProjected = prePhaseEPRData.personaMetrics[1].brandlock_on_projected;
            } else if (getShieldGADataData.data.total_transactions != 0 && getShieldGADataData.data.total_aov != 0) {
              personaRevProjected = getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift;
            } else if (!isNaN(listening_phase_orders_30_days) && listening_phase_orders_30_days !== 0 && !isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
              personaRevProjected = listening_phase_orders_30_days * d.industry_std_transaction_sog * listening_phase_aov_30_days * d.industry_std_lift;
            }
            d.personaRevPotential = personaRevProjected * d.apply_ratio;
            upcomingActionsNeededList.push(d);
          } else {
            if (getWebsitesRecordByIdData.hasOwnProperty("data") && getEngageGADataData.data.length && getWebsitesRecordByIdData.data[0].prediction_trigger) {
              epr_revenue = getEngageGADataData.data[0].epr_revenue !== null ? parseInt(getEngageGADataData.data[0].epr_revenue) : 0;
              impactRevenueResult += epr_revenue
            }
          }
          return {
            personaStatus: getWebsitesRecordByIdData.data[0].prediction_trigger,
            personaRev: epr_revenue !== null ? epr_revenue : 0,
            ...d
          }
        } else if (d.short_code === "cs") {
          let cs_revenue = null;
          if (getWebsitesRecordByIdData.hasOwnProperty("data") && !getWebsitesRecordByIdData.data[0].whynot_trigger) {
            let dayCount = null;
            let prePhaseCSDataProjected = 0;
            const whyNotShopperImpactDayCount = await getEngagePrePhaseWhyNotPersonaImpactDayCount(siteInputs, headerConfigPassed);
            if (whyNotShopperImpactDayCount !== undefined && whyNotShopperImpactDayCount.hasOwnProperty('data')) {
              dayCount = whyNotShopperImpactDayCount.data[0].days_with_cart_reduction * 1;
            }
            const prePhaseCSData = await processWhyNotPersonaMetricsResult(getEngagePersonaMetricsWhyNotShopperData, { totalAOV: getShieldGADataData.data.total_aov }, dayCount, numberOfDays);

            if (prePhaseCSData.personaMetrics[1].hasOwnProperty('brandlock_on_projected') && prePhaseCSData.personaMetrics[1].brandlock_on_projected != 0) {
              prePhaseCSDataProjected = prePhaseCSData.personaMetrics[1].brandlock_on_projected
            } else if (getShieldGADataData.data.total_transactions != 0 && getShieldGADataData.data.total_aov != 0) {
              prePhaseCSDataProjected = getShieldGADataData.data.total_transactions * d.industry_std_transaction_sog * getShieldGADataData.data.total_aov * d.industry_std_lift;
            } else if (!isNaN(listening_phase_orders_30_days) && listening_phase_orders_30_days !== 0 && !isNaN(listening_phase_aov_30_days) && listening_phase_aov_30_days !== 0) {
              prePhaseCSDataProjected = listening_phase_orders_30_days * d.industry_std_transaction_sog * listening_phase_aov_30_days * d.industry_std_lift;
            }
            d.personaRevPotential = prePhaseCSDataProjected * d.apply_ratio
            upcomingActionsNeededList.push(d);
          } else {
            if (getWebsitesRecordByIdData.hasOwnProperty("data") && getEngageGADataData.data.length && getWebsitesRecordByIdData.data[0].whynot_trigger) {
              cs_revenue = getEngageGADataData.data[0].cs_revenue !== null ? parseInt(getEngageGADataData.data[0].cs_revenue) : 0;
              impactRevenueResult += cs_revenue
            }
          }
          return {
            personaStatus: getWebsitesRecordByIdData.data[0].whynot_trigger,
            personaRev: cs_revenue !== null ? cs_revenue : 0,
            ...d
          }
        } else if (d.short_code === "pp") {
          return {
            personaStatus: false,
            ...d
          }
        }
      }));// promise end

    }

    /* 
        if (getShieldGADataData.statuscode !== undefined || getShieldGADataData.statuscode === 200) {
          personaBlock.push({
            name: "Shield",
            personaRev: getShieldGADataData.data.recovered_revenue
          })
        } */

    this.setState({
      engageUpdatedPersonaList: personaBlock,
      engageUpdatedPersonaListLoading: false,
      engageUpdatedPrePersonaListLoading: true,
      couponsMappedToPersona: upcomingActionsNeededList,
      couponsMappedToPersonaLoading: false,
      loading: {
        status: false,
        message: ""
      },
    })
  }
  async componentDidMount() {
    window.scrollTo(0, 0);
    this.loadDataCard();
    this.setState({
      cardData: [...sparkleCardData],
    });
    this.props.onPressSideMenuTab(0);
    // this.chartPlace();
    const siteInput = { siteIdInput: this.props.sessionClient.web_id, startDate: convertDateTOLocale(this.state.personaRevenueStartDate), endDate: convertDateTOLocale(this.state.personaRevenueEndDate) };
    const logSiteInput = { siteIdInput: this.props.sessionClient.web_id, startDate: convertDateTOLocale(new Date('2021-04-01')), endDate: convertDateTOLocale(this.state.endDate) };
    const headerConfigPassed = {
      headers: {
        Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${getCurrentUser().data.data.refresh_token}`,
      }
    }

    const [getEngagePersonaData, getWebsitesRecordByIdData, logHistoryResult, handleSplitClientHistoryData, couponsMappedtoPersonaData] = await Promise.all([
      getEngagePersona(headerConfigPassed),
      getWebsitesRecordById(this.props.sessionClient.web_id, headerConfigPassed),
      this.handleClientHistory(logSiteInput, headerConfigPassed),
      this.handleSplitClientHistory({ siteIdInput: this.props.sessionClient.web_id, startDate: convertDateTOLocale(this.state.startDateYTD), endDate: convertDateTOLocale(this.state.endDateYTD) }, headerConfigPassed),
      getCouponsMappedtoPersona({ siteIdInput: this.props.sessionClient.web_id }, headerConfigPassed)
    ])


    let upcomingActionsNeededList = [];

    if (couponsMappedtoPersonaData.data !== undefined) {
      upcomingActionsNeededList = couponsMappedtoPersonaData.data.filter(d => {
        if (new Date(convertDateTOLocale(d.valid_to)) >= new Date(convertDateTOLocale(new Date())) && new Date(convertDateTOLocale(d.valid_to)) <= new Date(convertDateTOLocale(addDays(new Date(), 7)))) {
          return d;
        }
      })
    }

    let logData = {};

    if (logHistoryResult.data !== undefined) {

      logData = logHistoryResult.data.map(d => {
        return {
          //date: formatDate(d.prod_invalidated_on).split(",")[0],
          date: convertDateTOLocale(d.prod_invalidated_on, true),
          phase: d.ab_status ? "Protection Phase" : "Listening Phase",
          ab_status: d.ab_status,
          ab_perc: d.ab_perc,
          split: d.split_change || (d.phase_status_code === 0 || d.phase_status_code === 1) ? d.ab_perc : false,
          phase_status_code: d.phase_status_code,
          // engage: (d.engage && d.engage_ab) ? "During Phase" : d.engage ? "On" : "Off",
          engage: d.phase_status !== null && d.phase_status_code !== 0 && d.phase_status_code !== 1 ? d.phase_status : null,
          persona: {
            wrong_coupon: d.wrong_coupon ? { name: `Shoppers with ${this.props.shopperRecord.wc}`, split: d.wrong_coupon_trigger_split, status: d.wrong_coupon } : "",
            extension_trigger: d.extension_trigger ? { name: `Shoppers with Extensions`, split: d.extension_trigger_split, status: d.extension_trigger } : "",
            prediction_trigger: d.prediction_trigger ? { name: this.props.shopperRecord.epr, split: d.prediction_trigger_split, status: d.prediction_trigger } : "",
            why_not_trigger: d.why_not_trigger ? { name: this.props.shopperRecord.cs, split: d.why_not_trigger_split, status: d.why_not_trigger } : "",
            hesitant_trigger: d.hesitant_trigger ? { name: this.props.shopperRecord.ti3, split: d.hesitant_trigger_split, status: d.hesitant_trigger } : "",
          }
          , ...logData
        }
      });
    }

    this.setState({
      engagePersonaList: getEngagePersonaData.data,
      engagePersonaListLoading: false,
      logs: logData,
      logsLoading: false,
      clientHistoryData: handleSplitClientHistoryData,
      clientHistoryDataLoading: false,
    });


    this.handleShieldAndEngageBlock(getWebsitesRecordByIdData);

    if (getWebsitesRecordByIdData && getWebsitesRecordByIdData.hasOwnProperty("data") && getWebsitesRecordByIdData.data.length > 0) {
      const cashbackCouponStatus = getWebsitesRecordByIdData.data[0].shield_plus ? true : false
      this.setState({
        cashbackCouponStatus: cashbackCouponStatus
      })
      if ((getWebsitesRecordByIdData.data[0].engage && getWebsitesRecordByIdData.data[0].engage_ab === false) || getWebsitesRecordByIdData.data[0].ab_status === true && getWebsitesRecordByIdData.data[0].ab_perc === 100) {
        await this.handlePersonaUpdates(siteInput, headerConfigPassed, getWebsitesRecordByIdData, upcomingActionsNeededList);
      } else if ((getWebsitesRecordByIdData.data[0].engage && getWebsitesRecordByIdData.data[0].engage_ab) || (getWebsitesRecordByIdData.data[0].ab_status === true && getWebsitesRecordByIdData.data[0].ab_perc !== 100)) {
        await this.handlePersonaUpdates(siteInput, headerConfigPassed, getWebsitesRecordByIdData, upcomingActionsNeededList);
      } else {
        await this.handlePrePhasePersonaUpdates(siteInput, headerConfigPassed, getWebsitesRecordByIdData, upcomingActionsNeededList)
      }
    }

  }

  async handleShieldAndEngageBlock(getWebsitesRecordByIdData) {
    if (getWebsitesRecordByIdData.hasOwnProperty("data") && getWebsitesRecordByIdData.data.length !== 0) {
      const siteShieldBlocks = [
        {
          title: "Malware & Adware",
          status: getWebsitesRecordByIdData.data[0].ab_status ? true : false
        },
        {
          title: "Cashback and Coupon Extensions",
          status: getWebsitesRecordByIdData.data[0].shield_plus ? true : false
        },
      ];
      this.setState({
        shieldAndPersonaData: siteShieldBlocks,
        websiteRecordByIdLoading: false
      })

    }
  }
  async componentDidUpdate(prevProps) {
    if (this.props.sessionClient.web_id !== prevProps.sessionClient.web_id) {

      this.setState({
        loading: {
          status: true,
          message: "loading"
        },
        logsLoading: true,
        couponsMappedToPersonaLoading: true
      });

      const siteInput = { siteIdInput: this.props.sessionClient.web_id, startDate: convertDateTOLocale(this.state.personaRevenueStartDate), endDate: convertDateTOLocale(this.state.personaRevenueEndDate) };
      const logSiteInput = { siteIdInput: this.props.sessionClient.web_id, startDate: convertDateTOLocale(new Date('2021-04-01')), endDate: convertDateTOLocale(this.state.endDate) };

      const headerConfigPassed = {
        headers: {
          Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${getCurrentUser().data.data.refresh_token}`,
        }
      }

      let logHistoryResult = await this.handleClientHistory(logSiteInput, headerConfigPassed);
      let handleSplitClientHistoryData = await this.handleSplitClientHistory({ siteIdInput: this.props.sessionClient.web_id, startDate: convertDateTOLocale(this.state.startDateYTD), endDate: convertDateTOLocale(this.state.endDateYTD) }, headerConfigPassed);
      let couponsMappedtoPersonaData = await getCouponsMappedtoPersona({ siteIdInput: this.props.sessionClient.web_id }, headerConfigPassed);

      let upcomingActionsNeededList = [];

      if (couponsMappedtoPersonaData.data !== undefined) {
        couponsMappedtoPersonaData.data.map(d => {
          if (new Date(convertDateTOLocale(d.valid_to)) < new Date(convertDateTOLocale(new Date()))) {
            d.expired = true;
            upcomingActionsNeededList.push(d);
            return d;
          } else if (new Date(convertDateTOLocale(d.valid_to)) >= new Date(convertDateTOLocale(new Date())) && new Date(convertDateTOLocale(d.valid_to)) <= new Date(convertDateTOLocale(addDays(new Date(), 7)))) {
            d.expired = false;
            upcomingActionsNeededList.push(d);
            return d;
          }
        })
      }



      let logData = {};
      logData = logHistoryResult.data.map(d => {
        return {
          //date: formatDate(d.prod_invalidated_on).split(",")[0],
          date: convertDateTOLocale(d.prod_invalidated_on, true),
          phase: d.ab_status ? "Protection Phase" : "Listening Phase",
          ab_status: d.ab_status,
          ab_perc: d.ab_perc,
          split: d.split_change || (d.phase_status_code === 0 || d.phase_status_code === 1) ? d.ab_perc : false,
          phase_status_code: d.phase_status_code,
          // engage: (d.engage && d.engage_ab) ? "During Phase" : d.engage ? "On" : "Off",
          engage: d.phase_status !== null && d.phase_status_code !== 0 && d.phase_status_code !== 1 ? d.phase_status : null,
          persona: {
            wrong_coupon: d.wrong_coupon ? { name: `Shoppers with ${this.props.shopperRecord.wc}`, split: d.wrong_coupon_trigger_split, status: d.wrong_coupon } : "",
            extension_trigger: d.extension_trigger ? { name: `Shoppers with Extensions`, split: d.extension_trigger_split, status: d.extension_trigger } : "",
            prediction_trigger: d.prediction_trigger ? { name: this.props.shopperRecord.epr, split: d.prediction_trigger_split, status: d.prediction_trigger } : "",
            why_not_trigger: d.why_not_trigger ? { name: this.props.shopperRecord.cs, split: d.why_not_trigger_split, status: d.why_not_trigger } : "",
            hesitant_trigger: d.hesitant_trigger ? { name: this.props.shopperRecord.ti3, split: d.hesitant_trigger_split, status: d.hesitant_trigger } : "",
          }
          , ...logData
        }
      });

      this.setState({
        logs: logData,
        logsLoading: false,
        clientHistoryData: handleSplitClientHistoryData,
        clientHistoryDataLoading: false
      });

      const getWebsitesRecordByIdData = await getWebsitesRecordById(this.props.sessionClient.web_id, headerConfigPassed)
      const cashbackCouponStatus = await getWebsitesRecordByIdData.data[0].shield_plus ? true : false;
      this.setState({
        cashbackCouponStatus: cashbackCouponStatus
      })

      this.handleShieldAndEngageBlock(getWebsitesRecordByIdData);

      if (getWebsitesRecordByIdData && getWebsitesRecordByIdData.hasOwnProperty("data") && getWebsitesRecordByIdData.data.length > 0) {
        if ((getWebsitesRecordByIdData.data[0].engage && getWebsitesRecordByIdData.data[0].engage_ab === false) || getWebsitesRecordByIdData.data[0].ab_status === true && getWebsitesRecordByIdData.data[0].ab_perc === 100) {
          await this.handlePersonaUpdates(siteInput, headerConfigPassed, getWebsitesRecordByIdData, upcomingActionsNeededList);
        } else if ((getWebsitesRecordByIdData.data[0].engage && getWebsitesRecordByIdData.data[0].engage_ab) || (getWebsitesRecordByIdData.data[0].ab_status === true && getWebsitesRecordByIdData.data[0].ab_perc !== 100)) {
          await this.handlePersonaUpdates(siteInput, headerConfigPassed, getWebsitesRecordByIdData, upcomingActionsNeededList);
        } else {
          await this.handlePrePhasePersonaUpdates(siteInput, headerConfigPassed, getWebsitesRecordByIdData, upcomingActionsNeededList)
        }
      }

    }
  }

  async loadDataCard() {
    const { cardData } = this.state;
    var allCardData = cardData;
    cardData.map((data, i) => {
      var uData = [];
      data.sparklineData.data.map((d, j) => {
        uData[j] = Math.floor(Math.random() * 10) + 1;
        return uData[j];
      });
      allCardData[i].sparklineData.data = [...uData];
      return allCardData[i].sparklineData.data;
    });
    this.setState({ cardData: [...allCardData] });
  }

  onTabChange = (e) => {
    var tab1 = document.getElementById("phaseTab-pre");
    tab1.classList.remove("active");
    tab1.children[0].classList.remove("active");
    var tab2 = document.getElementById("phaseTab-during");
    tab2.classList.remove("active");
    tab2.children[0].classList.remove("active");
    var actab = document.getElementById("phaseTab-" + e);
    actab.classList.add("active");
    actab.children[0].classList.add("active");

    var tabpan1 = document.getElementById("phaseTabContent-pre");
    tabpan1.classList.remove("active");
    var tabpan2 = document.getElementById("phaseTabContent-during");
    tabpan2.classList.remove("active");
    var actabpab = document.getElementById("phaseTabContent-" + e);
    actabpab.classList.add("active");
  };

  render() {
    const { loadingPage } = this.props;
    const { shieldAndPersonaData, engageUpdatedPersonaList, logs, couponsMappedToPersona, cashbackCouponStatus } = this.state;
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
          <div className="container-fluid">
            <div className="row clearfix">
              <div className="col-lg-6 col-md-4">
                <PageHeader
                  HeaderText="Overview"
                  Breadcrumb={[{ name: "Dashboard" }]}
                />

              </div>
              {/* 
              <div className="col-lg-6 col-md-4 mb-3">

                <div className="row dashboardActionButtons" >
                  <div className="col-lg-4 col-md-4 text-right pr-0">
                    <PdfDownloader downloadFileName="Dashboard" rootElementId="downloaDashboardRef" />
                  </div>
                  <div className="col-lg-5 col-md-5 text-right pl-0">
                    <form onSubmit={(e) => this.handleGetGADataSubmit(e)} className=" d-flex justify-content-end">
                      <input className="flex-grow-1 mr-4" type="text" placeholder="Enter Site ID" value={this.state.siteIdInput} onChange={(e) => this.setState({
                        siteIdInput: e.target.value
                      })} required />
                      <DateRange startDate={this.state.startDate} endDate={this.state.endDate} onDateRangeChange={this.handleDateChange} />
                      <Button disabled={!this.state.siteIdInput || this.state.startDate === "" || this.state.endDate === ""} type="submit" className="btn btn-info btn-info text-white float-right mr-2"><span>Submit</span></Button>
                    </form>
                  </div>
                </div>
              </div> */}


            </div>

            {/*             <div className="row clearfix">
              <div className="col-lg-4 col-md-4 mb-3">
                <PdfDownloader downloadFileName="Dashboard" rootElementId="downloaDashboardRef" />
              </div>
              <div className="col-lg-8 col-md-8 mb-3">
                <form onSubmit={(e) => this.handleGetGADataSubmit(e)} className=" d-flex justify-content-end">
                  <input className="flex-grow-1 mr-4" type="text" placeholder="Enter Site ID" value={this.state.siteIdInput} onChange={(e) => this.setState({
                      siteIdInput: e.target.value
                    })} required />
                  <DateRange startDate={this.state.startDate} endDate={this.state.endDate} onDateRangeChange={this.handleDateChange} />
                </form>
              </div>
              <div className="col-lg-12 col-md-12 mb-3 text-center">
                <span className="text-danger">{this.state.message}</span>
              </div>
            </div> */}
            {/* 
            <ul className="nav nav-tabs-new2" role="tablist">
              <li
                className="nav-item mr-1 active"
                id="phaseTab-pre"
                role="presentation"
                onClick={() => {
                  this.onTabChange("pre");
                }}
              >
                <a className="nav-link active">Pre Phase</a>
              </li>
              <li
                className="nav-item mr-1"
                id="phaseTab-during"
                role="presentation"
                onClick={() => {
                  this.onTabChange("during");
                }}
              >
                <a className="nav-link" data-toggle="tab">
                  During Phase
                </a>
              </li>
            </ul> */}

            {/*  <div className="tab-content"> */}
            {/* <div id="phaseTabContent-pre" className="tab-pane show active">
                <div className="row clearfix">
                  <div className="col-lg-6 col-md-6">
                    {(this.state.loading.status) ?
                      <Loader width="col-md-12 col-lg-12" height="150px" /> :
                      <PieChart id="preDashboardOverall" updatedPersonaList={!this.state.engageUpdatedPrePersonaListLoading && engageUpdatedPersonaList} className="dbCard" />
                    }
                  </div>
                </div>
              </div> */}
            {/*   <div id="phaseTabContent-during" className="tab-pane "> */}
            <div className="row clearfix" id="downloaDashboardRef" ref={this.downloaDashboardRef}>

              <div className="col-lg-6 col-md-6">
                {(this.state.loading.status) ?
                  <Loader width="col-md-12 col-lg-12" height="150px" /> :
                  <PieChart id="duringDashboardOverall" currency={this.props.sessionClient.currency !== undefined && this.props.sessionClient.currency !== null && this.props.sessionClient.currency !== 'select' ? this.props.sessionClient.currency : 'USD'} updatedPersonaList={!this.state.engageUpdatedPersonaListLoading && engageUpdatedPersonaList} className="dbCard" />
                }
              </div>
              <div className="col-lg-6 col-md-6">
                {(this.state.loading.status) ?
                  <Loader width="col-md-12 col-lg-12" height="150px" /> :
                  <ShieldAndPersonaCard className="dbCard" abData={!this.state.websiteRecordByIdLoading && shieldAndPersonaData} updatedPersonaList={!this.state.engageUpdatedPersonaListLoading && engageUpdatedPersonaList} data={shieldAndPersonaData} />
                }
              </div>
              <div className="col-lg-6 col-md-6">
                {(this.state.logsLoading) ?
                  <Loader width="col-md-12 col-lg-12" height="150px" /> :
                  <LogsCard logs={!this.state.logsLoading && logs} data={logsData} className="dbCard" />
                }
              </div>
              <div className="col-lg-6 col-md-6">
                {(this.state.couponsMappedToPersonaLoading) ?
                  <Loader width="col-md-12 col-lg-12" height="150px" /> :
                  <UpcomingActionsNeeded currency={this.props.sessionClient.currency !== undefined && this.props.sessionClient.currency !== null && this.props.sessionClient.currency !== 'select' ? this.props.sessionClient.currency : 'USD'} cashbackCouponStatus={cashbackCouponStatus} history={this.props.history} className="dbCard" data={!this.state.couponsMappedToPersonaLoading && couponsMappedToPersona} updatedPersonaList={!this.state.engageUpdatedPersonaListLoading && engageUpdatedPersonaList} />
                }
              </div>
            </div>
            {/*  </div> */}
            {/* </div> */}

          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  loginReducer,
  navigationReducer,
  analyticalReducer,
  websiteRecordReducer
}) => ({
  email: loginReducer.email,
  menuArrowToggle: navigationReducer.menuArrowToggle,
  sparkleCardData: analyticalReducer.sparkleCardData,
  topProductDropDown: analyticalReducer.topProductDropDown,
  referralsDropDown: analyticalReducer.referralsDropDown,
  recentChatDropDown: analyticalReducer.recentChatDropDown,
  facebookShowProgressBar: analyticalReducer.facebookShowProgressBar,
  twitterShowProgressBar: analyticalReducer.twitterShowProgressBar,
  affiliatesShowProgressBar: analyticalReducer.affiliatesShowProgressBar,
  searchShowProgressBar: analyticalReducer.searchShowProgressBar,
  loadingPage: analyticalReducer.loadingPage,
  sessionClient: websiteRecordReducer.sessionClient,
  websiteRecord: websiteRecordReducer.websiteRecord,
  shopperRecord: websiteRecordReducer.shopperRecord
});

export default connect(mapStateToProps, {
  toggleMenuArrow,
  loadSparcleCard,
  onPressTopProductDropDown,
  onPressReferralsDropDown,
  onPressRecentChatDropDown,
  onPressDataManagedDropDown,
  facebookProgressBar,
  twitterProgressBar,
  affiliatesProgressBar,
  searchProgressBar,
  websiteRecordAction,
  onPressSideMenuTab
})(Dashbord);