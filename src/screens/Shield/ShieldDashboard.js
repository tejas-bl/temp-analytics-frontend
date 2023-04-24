import React from "react";
import { connect } from "react-redux";
import LogoiCON from "../../assets/images/logo-icon.svg";
import PageHeader from "../../components/PageHeader";
import { personaRecoveredRevData } from "../../Data/EngagePersonaData";
import ShieldMetricTableCard from "../../components/Shield/ShieldMetricTableCard";
import ShieldProtectedAgainstCard from "../../components/Shield/ShieldProtectedAgainstCard";
import PdfDownloader from "../../helper/PdfDownloader";
import { getListeningPhaseIndustryStd, getShieldGAData, getTopMaliciousScripts, getWebsitesRecordById } from "../../api/shieldDashboard";
import { subDays, differenceInDays } from "date-fns";
import { convertDateTOLocale, getCurrentUser } from "../../helper/Utils";
import {
  websiteRecordAction
} from "../../actions";
import Loader from "../../helper/Loader";
import { getSplitClientHistory } from "../../api/Dashboard/OldDB";
import ShieldDateRange from "../../helper/DateRangeWithSplit";
import DateRange from "../../helper/DateRange";
import ShieldRecoveredRevenue from "../../components/Shield/ShieldRecoveredRevenue";
import { processShieldMetrics, processShieldMetricsIndustryStd } from "../../helper/Shield";
import { onPressSideMenuTab } from '../../actions';
import SessionProtectedCard from "../../components/Shield/SessionProtectedCard";
import MaliciousScriptCountsCard from "../../components/Shield/MaliciousScriptCountsCard";
import ShieldDashboardMainCard from "../../components/Shield/shield-dashboard-main-card";
import { getEngageTop5CouponsCashback } from "../../api/Engage/OldDB";
class ShieldDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      personaRecoveredRevState: [],
      siteIdInput: this.props.sessionClient.web_id,
      startDate: subDays(new Date(), 29),
      endDate: new Date(),
      compareStartDate: subDays(new Date(), 60),
      compareEndDate: subDays(new Date(), 30),
      websiteRecordById: {},
      splitDateRangeData: {},
      splitDateRangeDataLoading: true,
      websiteRecordByIdLoading: true,
      topMaliciousScripts: [],
      topMaliciousScriptsLoading: true,
      websitesRecord: {},
      websitesRecordLoading: true,
      conversionLift: 0,
      revenuePerSessionLift: 0,
      recoveredRevenue: 0,
      compareConversionLift: 0,
      compareRevenuePerSessionLift: 0,
      compareRecoveredRevenue: 0,
      protectedSessions: 0,
      protectedSessionsLoading: true,
      metricsData: {},
      metricsDataLoading: true,
      message: "",
      industryStd: false,
      industryStdLoading: true,
      loading: {
        status: false,
        message: ""
      },
      maliciousScriptData: [],
      engageTopCouponsCashbackData: [],
      engageTopCouponsCashbackDataIsLoading: true,
      activeStartDate: "",
      activeEndDate: "",
      isLiveSelected: null,
      isLiveSelectedLoading: true,
    };
    this.downloadShieldDashboardRef = React.createRef();
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleWebsitesRecordChange = this.handleWebsitesRecordChange.bind(this);
  }

  async componentDidUpdate(prevProps) {
    if (this.props.sessionClient.web_id !== prevProps.sessionClient.web_id) {

      this.setState({
        splitDateRangeDataLoading: true,
        loading: {
          status: true,
          message: "loading"
        },
        activeStartDate: "",
        activeEndDate: "",
        maliciousScriptData: [...personaRecoveredRevData],
        sessionProtectedData: [...personaRecoveredRevData],
        isLiveSelected: false
      })


      const siteInputs = { siteIdInput: this.props.sessionClient.web_id, startDate: convertDateTOLocale(this.state.startDate), endDate: convertDateTOLocale(this.state.endDate) };
      const compareSiteInputs = { siteIdInput: this.props.sessionClient.web_id, startDate: convertDateTOLocale(this.state.compareStartDate), endDate: convertDateTOLocale(this.state.compareEndDate) };
      const headerConfigPassed = {
        headers: {
          Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${getCurrentUser().data.data.refresh_token}`,
        }
      }

      this.handleSplitDateRange()


      getTopMaliciousScripts(siteInputs, headerConfigPassed).then(res => {
        if (res.hasOwnProperty("data") && res.data.length !== 0) {
          this.setState({
            topMaliciousScripts: res.data[0],
            topMaliciousScriptsLoading: false
          })
        }
      }, err => {
        return err;
      })


      const [shieldDataAPI] = await Promise.all([
        getShieldGAData(siteInputs, headerConfigPassed)
      ]);

      const getWebsitesRecordByIdData = await getWebsitesRecordById(this.props.sessionClient.web_id, headerConfigPassed);
      const getListeningPhaseIndustryStdData = await getListeningPhaseIndustryStd(siteInputs, headerConfigPassed);


      let ab_status = null;
      if (getWebsitesRecordByIdData.hasOwnProperty("data") && getWebsitesRecordByIdData.data.length !== 0) {
        ab_status = getWebsitesRecordByIdData.data[0].ab_status;
        this.setState({
          websiteRecordById: getWebsitesRecordByIdData.data[0],
          websiteRecordByIdLoading: false
        })
      }
      // Get the data for Tulaa
      if (ab_status === false || ab_status === null || ab_status === '') {
        if (getListeningPhaseIndustryStdData.hasOwnProperty('data') && getListeningPhaseIndustryStdData.data.length) {
          let industyStdData = getListeningPhaseIndustryStdData.data[0];
          const conversionLift = 6;
          const rpsLift = 5;
          const recoveredRevenue = industyStdData.projected_recovered_revenue
          this.setState({
            conversionLift: conversionLift > 0 ? `${parseFloat(conversionLift).toFixed(2)}%` : 0,
            revenuePerSessionLift: rpsLift > 0 ? `${parseFloat(rpsLift).toFixed(2)}%` : 0,
            recoveredRevenue: recoveredRevenue !== undefined && recoveredRevenue !== null && recoveredRevenue > 0 ? `${parseFloat(recoveredRevenue).toFixed(2)}` : 0,
            metricsData: processShieldMetricsIndustryStd(industyStdData),
            metricsDataLoading: false,
            industryStd: true,
            industryStdLoading: false,
            loading: {
              status: false,
              message: ""
            },
          })
        }
      } else {
        if (shieldDataAPI.statuscode === undefined || shieldDataAPI.statuscode !== 200 || shieldDataAPI.data.hasOwnProperty('noData')) {
          this.setState({
            loading: {
              status: false,
              message: ""
            },
            conversionLift: 0,
            revenuePerSessionLift: 0,
            recoveredRevenue: 0,
            protectedSessions: 0,
            industryStd: false,
            industryStdLoading: false,
            protectedSessionsLoading: false,
            metricsData: null,
            metricsDataLoading: false,
          })
        } else {
          const conversionLift = parseFloat(shieldDataAPI.data.conversion_lift).toFixed(2)
          const rpsLift = parseFloat(shieldDataAPI.data.rps_lift).toFixed(2)
          const recoveredRevenue = shieldDataAPI.data.recovered_revenue
          this.setState({
            conversionLift: conversionLift > 0 ? `${parseFloat(conversionLift).toFixed(2)}%` : 0,
            revenuePerSessionLift: rpsLift > 0 ? `${parseFloat(rpsLift).toFixed(2)}%` : 0,
            recoveredRevenue: recoveredRevenue > 0 ? `${parseFloat(recoveredRevenue).toFixed(2)}` : 0,
            protectedSessions: shieldDataAPI.data.protected_sessions,
            protectedSessionsLoading: false,
            metricsData: processShieldMetrics(shieldDataAPI),
            metricsDataLoading: false,
            industryStd: false,
            industryStdLoading: false,
            loading: {
              status: false,
              message: ""
            },
          })

        }
      }


      getEngageTop5CouponsCashback(siteInputs, headerConfigPassed).then(res => {
        this.setState({
          engageTopCouponsCashbackData: res.data,
          engageTopCouponsCashbackDataIsLoading: false,
        })
      });

    }
  }
  async handleWebsitesRecordChange(e) {
    this.setState({
      siteIdInput: e.target.value
    })
  }
  async handleDateChange(item, splitLengthAddedIndex = null) {
    const siteIdInput = this.props.sessionClient.web_id;
    const selectionWithKey = "selection" + splitLengthAddedIndex
    const itemStartDate = item.hasOwnProperty(selectionWithKey) && splitLengthAddedIndex !== null ? item[selectionWithKey].startDate : item[0].startDate;
    const itemEndDate = item.hasOwnProperty(selectionWithKey) ? item[selectionWithKey].endDate : item[0].endDate;
    const startDate = convertDateTOLocale(itemStartDate);
    const endDate = convertDateTOLocale(itemEndDate);
    const differenceCurrentDate = differenceInDays(itemEndDate, itemStartDate) + 1;
    const compareStartDate = convertDateTOLocale(subDays(itemStartDate, differenceCurrentDate));
    const compareEndDate = convertDateTOLocale(subDays(itemEndDate, differenceCurrentDate));
    const headerConfigPassed = {
      headers: {
        Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${getCurrentUser().data.data.refresh_token}`,
      }
    }
    if (item.hasOwnProperty(selectionWithKey) && item[selectionWithKey].hasOwnProperty("abPerc")) {
      this.setLiveClientScreen(item[selectionWithKey].abPerc);
    }

    if (this.state.activeStartDate !== "" && this.state.activeEndDate) {
      if (itemStartDate.getTime() > this.state.activeStartDate.getTime() && itemEndDate.getTime() < this.state.activeEndDate.getTime()) {
        this.setState({
          isLiveSelected: true
        });
      } else if (itemStartDate.getTime() === this.state.activeStartDate.getTime() && itemEndDate.getTime() === this.state.activeEndDate.getTime()) {
        this.setState({
          isLiveSelected: true
        });
      } else if (itemStartDate.setHours(0, 0, 0, 0) === this.state.activeStartDate.setHours(0, 0, 0, 0) && itemEndDate.getTime() < this.state.activeEndDate.getTime()) {
        this.setState({
          isLiveSelected: true
        });
      } else if (itemStartDate.getTime() > this.state.activeStartDate.getTime() && itemEndDate.setHours(0, 0, 0, 0) === this.state.activeEndDate.setHours(0, 0, 0, 0)) {
        this.setState({
          isLiveSelected: true
        });
      } else {
        this.setState({
          isLiveSelected: false
        });
      }
    }

    this.setState({
      loading: {
        status: true,
        message: "loading"
      },
      startDate: itemStartDate,
      endDate: itemEndDate
    })

    const siteInputs = { siteIdInput, startDate, endDate };
    const compareSiteInputs = { siteIdInput: this.props.sessionClient.web_id, startDate: compareStartDate, endDate: compareEndDate };

    const getWebsitesRecordByIdData = await getWebsitesRecordById(this.props.sessionClient.web_id, headerConfigPassed);
    const getListeningPhaseIndustryStdData = await getListeningPhaseIndustryStd(siteInputs, headerConfigPassed);

    let ab_status = null;
    if (getWebsitesRecordByIdData.hasOwnProperty("data") && getWebsitesRecordByIdData.data.length !== 0) {
      ab_status = getWebsitesRecordByIdData.data[0].ab_status;
      this.setState({
        websiteRecordById: getWebsitesRecordByIdData.data[0],
        websiteRecordByIdLoading: false
      })
    }

    getTopMaliciousScripts(siteInputs, headerConfigPassed).then(res => {
      if (res.hasOwnProperty("data") && res.data.length !== 0) {
        this.setState({
          topMaliciousScripts: res.data[0],
          topMaliciousScriptsLoading: false
        })
      }
    }, err => {
      return err;
    })



    const [shieldDataAPI, compareShieldDataAPI] = await Promise.all([
      getShieldGAData(siteInputs, headerConfigPassed),
      getShieldGAData(compareSiteInputs, headerConfigPassed)
    ]);

    if (ab_status === false || ab_status === null || ab_status === '') {
      if (getListeningPhaseIndustryStdData.hasOwnProperty('data') && getListeningPhaseIndustryStdData.data.length) {
        let industyStdData = getListeningPhaseIndustryStdData.data[0];
        const conversionLift = 6;
        const rpsLift = 5;
        const recoveredRevenue = industyStdData.projected_recovered_revenue
        this.setState({
          conversionLift: conversionLift > 0 ? `${parseFloat(conversionLift).toFixed(2)}%` : 0,
          revenuePerSessionLift: rpsLift > 0 ? `${parseFloat(rpsLift).toFixed(2)}%` : 0,
          recoveredRevenue: recoveredRevenue !== undefined && recoveredRevenue !== null && recoveredRevenue > 0 ? `${parseFloat(recoveredRevenue).toFixed(2)}` : 0,
          metricsData: processShieldMetricsIndustryStd(industyStdData),
          metricsDataLoading: false,
          industryStd: true,
          industryStdLoading: false,
          loading: {
            status: false,
            message: ""
          },
        })
      }
    } else {
      if (shieldDataAPI.statuscode === undefined || shieldDataAPI.statuscode !== 200 || shieldDataAPI.data.hasOwnProperty('noData') || compareShieldDataAPI.statuscode === undefined || compareShieldDataAPI.statuscode !== 200) {

        this.setState({
          loading: {
            status: false,
            message: ""
          },
          conversionLift: 0,
          revenuePerSessionLift: 0,
          recoveredRevenue: 0,
          protectedSessions: 0,
          protectedSessionsLoading: false,
          industryStd: false,
          industryStdLoading: false,
          metricsData: null,
          metricsDataLoading: false,
        })

      } else {

        const conversionLift = shieldDataAPI.data.conversion_lift
        const compareConversionLift = parseFloat(compareShieldDataAPI.data.conversion_lift).toFixed(2)
        const rpsLift = shieldDataAPI.data.rps_lift
        const compareRevenuePerSessionLift = parseFloat(compareShieldDataAPI.data.rps_lift).toFixed(2)
        const recoveredRevenue = shieldDataAPI.data.recovered_revenue

        this.setState({
          conversionLift: conversionLift > 0 ? `${parseFloat(conversionLift).toFixed(2)}%` : 0,
          revenuePerSessionLift: rpsLift > 0 ? `${parseFloat(rpsLift).toFixed(2)}%` : 0,
          recoveredRevenue: recoveredRevenue > 0 ? `${parseFloat(recoveredRevenue).toFixed(2)}` : 0,
          protectedSessions: shieldDataAPI.data.protected_sessions,
          protectedSessionsLoading: false,
          metricsData: processShieldMetrics(shieldDataAPI),
          metricsDataLoading: false,
          industryStd: false,
          industryStdLoading: false,
          loading: {
            status: false,
            message: ""
          },
          compareConversionLift: compareShieldDataAPI.data.conversion_lift > 0 ? parseFloat(((conversionLift - compareConversionLift) / compareConversionLift) * 100).toFixed(2) : 0,
          compareRevenuePerSessionLift: compareShieldDataAPI.data.rps_lift > 0 ? parseFloat(((rpsLift - compareRevenuePerSessionLift) / compareRevenuePerSessionLift) * 100).toFixed(2) : 0
        })
      }
    }
  }

  async handleSplitDateRange() {
    const siteIdInput = this.props.sessionClient.web_id;
    const siteInputsForSplitDate = { siteIdInput, startDate: convertDateTOLocale(subDays(new Date(), 480)), endDate: convertDateTOLocale(subDays(new Date(), 0)) };
    const headerConfigPassed = {
      headers: {
        Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${getCurrentUser().data.data.refresh_token}`,
      }
    }
    const splitClientHistory = await getSplitClientHistory(siteInputsForSplitDate, headerConfigPassed);
    var listeningPhasePresent = false;
    if (splitClientHistory.hasOwnProperty('data') && splitClientHistory.data !== undefined && splitClientHistory.data.length > 0) {
      let splitDateAndPerc = {
        splitDate: siteInputsForSplitDate.startDate,
        abPerc: 0,
        split_change: false
      }
      splitDateAndPerc = splitClientHistory.hasOwnProperty('data') && splitClientHistory.data.map(d => {
        if (d.split_change === true) {
          return { splitDate: new Date(d.prod_invalidated_on), abPerc: d.ab_perc }
        } else if (d.split_change === false && d.phase_status_code === 0) {
          listeningPhasePresent = true;
          return { splitDate: new Date(d.prod_invalidated_on), abPerc: 0, split_change: d.split_change }
        } else if (d.phase_status_code === 1) {
          listeningPhasePresent = true;
          return { splitDate: new Date(d.prod_invalidated_on), abPerc: 0, split_change: d.split_change };
        }
        return null;
      })
      //this.setLiveDateRange(splitDateAndPerc);
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
              activeStartDate: splitDateAndPerc[i].splitDate,
              activeEndDate: subDays(new Date(), 0)
            });
          } else {
            const nextIndex = (i + 1);
            this.setState({
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
      if (Difference_In_Days > 29) {
        const newStartDate = subDays(new Date(), 29);
        const newEndDate = new Date();
        this.setState({
          splitDateRangeData: splitDateAndPerc,
          splitDateRangeDataLoading: false,
          startDate: newStartDate,
          endDate: newEndDate
        });
      } else {
        const newEndDate = new Date();
        this.setState({
          splitDateRangeData: splitDateAndPerc,
          splitDateRangeDataLoading: false,
          startDate: splitDateAndPerc[splitDateAndPerc.length - 1].splitDate,
          endDate: newEndDate
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
  }

  async componentWillUnmount() {
    this.setState({
      activeStartDate: "",
      activeEndDate: "",
      isLiveSelected: false
    });
  }
  async componentDidMount() {
    const { startDate, endDate } = this.state;
    const siteIdInput = this.props.sessionClient.web_id;
    const siteInputs = { siteIdInput, startDate: convertDateTOLocale(startDate), endDate: convertDateTOLocale(endDate) };

    window.scrollTo(0, 0);
    this.loadDataCard();
    this.loadMaliciousScriptDataCard();

    this.props.onPressSideMenuTab(1);

    const headerConfigPassed = {
      headers: {
        Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${getCurrentUser().data.data.refresh_token}`,
      }
    }
    this.setState({
      loading: {
        status: true,
        message: "loading",
      },
      personaRecoveredRevState: [...personaRecoveredRevData],
      maliciousScriptData: [...personaRecoveredRevData],
      sessionProtectedData: [...personaRecoveredRevData]
    })

    this.handleSplitDateRange();

    getTopMaliciousScripts(siteInputs, headerConfigPassed).then(res => {
      if (res.hasOwnProperty("data") && res.data.length !== 0) {
        this.setState({
          topMaliciousScripts: res.data[0],
          topMaliciousScriptsLoading: false
        })
      }
    }, err => {
      return err;
    })

    const getWebsitesRecordByIdData = await getWebsitesRecordById(siteIdInput, headerConfigPassed);
    const getListeningPhaseIndustryStdData = await getListeningPhaseIndustryStd(siteInputs, headerConfigPassed);

    let ab_status = null;
    if (getWebsitesRecordByIdData.hasOwnProperty("data") && getWebsitesRecordByIdData.data.length !== 0) {
      ab_status = getWebsitesRecordByIdData.data[0].ab_status;
      this.setState({
        websiteRecordById: getWebsitesRecordByIdData.data[0],
        websiteRecordByIdLoading: false
      })
    }
    /*     getWebsitesRecordById(siteIdInput, headerConfigPassed).then(res => {
          if (res.hasOwnProperty("data") && res.data.length !== 0) {
            this.setState({
              websiteRecordById: res.data[0],
              websiteRecordByIdLoading: false
            })
          }
        }, err => {
          return err;
        }) */

    // Get the data for Tulaa
    if (ab_status === false || ab_status === null || ab_status === '') {
      if (getListeningPhaseIndustryStdData.hasOwnProperty('data') && getListeningPhaseIndustryStdData.data.length) {
        let industyStdData = getListeningPhaseIndustryStdData.data[0];
        const conversionLift = 6;
        const rpsLift = 5;
        const recoveredRevenue = industyStdData.projected_recovered_revenue
        this.setState({
          conversionLift: conversionLift > 0 ? `${parseFloat(conversionLift).toFixed(2)}%` : 0,
          revenuePerSessionLift: rpsLift > 0 ? `${parseFloat(rpsLift).toFixed(2)}%` : 0,
          recoveredRevenue: recoveredRevenue !== undefined && recoveredRevenue !== null && recoveredRevenue > 0 ? `${parseFloat(recoveredRevenue).toFixed(2)}` : 0,
          metricsData: processShieldMetricsIndustryStd(industyStdData),
          metricsDataLoading: false,
          industryStd: true,
          industryStdLoading: false,
          loading: {
            status: false,
            message: ""
          },
        })
      }
    } else {
      getShieldGAData(siteInputs, headerConfigPassed).then(shieldData => {
        if (shieldData.statuscode === undefined || shieldData.statuscode !== 200 || shieldData.data.hasOwnProperty('noData')) {
          this.setState({
            loading: {
              status: false,
              message: ""
            },
            conversionLift: 0,
            revenuePerSessionLift: 0,
            recoveredRevenue: 0,
            protectedSessions: 0,
            protectedSessionsLoading: false,
            metricsData: null,
            metricsDataLoading: false,
            industryStd: false,
            industryStdLoading: false,
          })
        } else {

          const conversionLift = shieldData.data.conversion_lift
          const rpsLift = shieldData.data.rps_lift
          const recoveredRevenue = shieldData.data.recovered_revenue

          this.setState({
            conversionLift: conversionLift > 0 ? `${parseFloat(conversionLift).toFixed(2)}%` : 0,
            revenuePerSessionLift: rpsLift > 0 ? `${parseFloat(rpsLift).toFixed(2)}%` : 0,
            recoveredRevenue: recoveredRevenue > 0 ? `${parseFloat(recoveredRevenue).toFixed(2)}` : 0,
            protectedSessions: shieldData.data.protected_sessions,
            protectedSessionsLoading: false,
            metricsData: processShieldMetrics(shieldData),
            metricsDataLoading: false,
            industryStd: false,
            industryStdLoading: false,
            loading: {
              status: false,
              message: ""
            }
          })
        }
      }, err => {
        return err
      });
    }


    getEngageTop5CouponsCashback(siteInputs, headerConfigPassed).then(res => {
      this.setState({
        engageTopCouponsCashbackData: res.data,
        engageTopCouponsCashbackDataIsLoading: false,
      })
    });
  }

  async loadDataCard() {
    const { personaRecoveredRevState } = this.state;
    var allCardData = personaRecoveredRevState;
    personaRecoveredRevState.map((data, i) => {
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

  async loadMaliciousScriptDataCard() {
    const { maliciousScriptData } = this.state;
    var allCardData = maliciousScriptData;
    maliciousScriptData.map((data, i) => {
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

  async loadSessionProtectedCard() {
    const { sessionProtectedData } = this.state;
    var allCardData = sessionProtectedData;
    sessionProtectedData.map((data, i) => {
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
      isLiveSelectedLoading: false
    })
  }
  render() {
    const { loadingPage } = this.props;
    const { personaRecoveredRevState, metricsData, websiteRecordById, splitDateRangeData, topMaliciousScripts, protectedSessions, industryStd } = this.state;

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

    return <div>
      <div className="container-fluid">

        <div className="row clearfix">
          <div className="col-lg-6 col-md-4">
            <PageHeader
              HeaderText="Shield Overview"
              Breadcrumb={[{ name: "overview" }]}
            />
          </div>

          <div className="col-lg-6 col-md-6">

            <div className="row dashboardActionButtons" >
              <div className="text-right pr-0 mr-3">
                <PdfDownloader downloadFileName="ShieldDashboard" rootElementId="downloadShieldDashboardRef" />
              </div>
              <div className="text-right pl-0 mr-3">
                <form onSubmit={(e) => this.handleGetGADataSubmit(e)}>
                  {<ShieldDateRange product="shield" dateRange={!this.state.splitDateRangeDataLoading && splitDateRangeData} startDate={this.state.startDate} endDate={this.state.endDate} onDateRangeChange={this.handleDateChange} />}
                  {!this.state.splitDateRangeDataLoading && splitDateRangeData.length === 0 && <DateRange startDate={this.state.startDate} endDate={this.state.endDate} onDateRangeChange={this.handleDateChange} />}
                </form>
              </div>
            </div>
          </div>
        </div>
        {(!this.state.isLiveSelectedLoading && this.state.isLiveSelected) ?
          <>
            <div className="row shield-dashboard-card-div clearfix">
              <div className="col-lg-4 col-md-4 col-md-4 shield_100_card_div">
                <ShieldDashboardMainCard />
              </div>
              <div className="col-lg-8 col-md-8 col-md-8 shield_100_card_div">
                {this.state.maliciousScriptData.map((data, i) => (
                  <>
                    <MaliciousScriptCountsCard
                      topMaliciousScriptsLoading={this.state.topMaliciousScriptsLoading}
                      topMaliciousScripts={topMaliciousScripts}
                      index={i}
                      key={"maliciousScriptDataKey" + i}
                      noCalc={true}
                      Days=""
                      mainData={data.sparklineData.data}
                      chartColor={data.sparklineData.areaStyle.color}
                      isRandomUpdate={false}
                      ContainerClass="col-lg-12 col-md-12 col-sm-12 p-0"
                      alignText="text-center"
                      BlockHeight={88}
                    />
                  </>
                ))}

                {this.state.sessionProtectedData.map((data, i) => (
                  <SessionProtectedCard
                    protectedSessionsLoading={this.state.protectedSessionsLoading}
                    protectedSessions={protectedSessions}
                    index={i}
                    key={"sessionProtectedDataKey" + i}
                    noCalc={true}
                    Days=""
                    mainData={data.sparklineData.data}
                    chartColor={data.sparklineData.areaStyle.color}
                    isRandomUpdate={false}
                    ContainerClass="col-lg-12 col-md-12 col-sm-12 p-0"
                    alignText="text-center"
                    BlockHeight={88}
                  />
                ))}
              </div>
            </div>

            <div className="row clearfix">
              <div className="col-lg-4 col-md-4 d-none">
                {personaRecoveredRevState.map((data, i) => (
                  <div key={`shield_div_${i}`}>
                    {(this.state.loading.status) ?
                      <Loader key={`shield_loader_${i}`} width="col-md-12 col-lg-12" height="150px" /> :
                      <ShieldRecoveredRevenue
                        index={3}
                        key={`shield_recover_rev_${i}`}
                        Heading={[<h6 key={"shield_recover_rev_h6" + i}>Recovered Revenue</h6>]}
                        Money={this.state.recoveredRevenue !== 0 ? [<h3 className="pb-0" key={"shield_recover_rev_h3" + i}><strong>{(this.state.loading.status) ? this.state.loading.message : parseFloat(this.state.recoveredRevenue).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong></h3>] : 0}
                        PerText="How was it calculated?"
                        Days={[<span className="smallText pb-0" key={"shield_recover_rev_span" + i}>({differenceInDays(this.state.endDate, this.state.startDate) + 1} days)</span>]}
                        isRandomUpdate={false}
                        // Data={data.sparklineData}
                        mainData={data.sparklineData.data}
                        chartColor={"#769ccd"}
                        ContainerclassName="col-lg-12 col-md-12 col-sm-12 p-0"
                        alignText="text-center"
                        BlockHeight={this.state.recoveredRevenue !== 0 ? 15 : 15}
                      />
                    }
                  </div>
                ))}
              </div>
            </div>
          </>
          : <>
            <div
              onClick={() => {
                document.body.classList.remove("offcanvas-active");
              }}
            >
              <div id="downloadShieldDashboardRef" ref={this.downloadShieldDashboardRef}>
                <div className="row clearfix">
                </div>
                <div className="row clearfix">
                  <div className="col-lg-3 col-md-3">
                    {personaRecoveredRevState.map((data, i) => (
                      <div key={`CR_Lift__div_${i}`}>
                        {(this.state.loading.status) ?
                          <Loader key={`CR_Lift__loader_${i}`} width="col-md-12 col-lg-12" height="350px" /> :
                          <ShieldRecoveredRevenue
                            index={i}
                            key={"CR_Lift_shield" + i}
                            Heading={[<h6 key={"CR_Lift__h6_" + i}>CR LIFT</h6>]}
                            Money={this.state.conversionLift !== 0 ? [<h3 key={"CR_Lift__h3_" + i}><strong>{(this.state.loading.status) ? this.state.loading.message : this.state.conversionLift}</strong></h3>] : 0}
                            industryStd={!this.state.industryStdLoading && industryStd}
                            // PerText={(compareConversionLift > 0) ? [<div key={`CR_Lift__perText_${i}`}><span className="badge badge-warning"> <strong>{`${compareConversionLift}% Lift `} </strong> </span> <span> compared to {[<span className="smallText pb-0" key={`CR_Lift__smallText_${i}`}>{differenceInDays(this.state.endDate, this.state.startDate) + 1} days</span>]}</span></div>] : [<span key={`CR_Lift__no_data_${i}`} className="badge badge-info">No Lift data Available</span>]}
                            PerText={false}
                            Days=""
                            isRandomUpdate={false}
                            // Data={data.sparklineData}
                            mainData={data.sparklineData.data}
                            chartColor={data.sparklineData.areaStyle.color}
                            ContainerclassName="col-lg-12 col-md-12 col-sm-12 p-0"
                            alignText="text-left"
                            BlockHeight={70}
                          />
                        }
                      </div>
                    ))}
                  </div>

                  <div className="col-lg-3 col-md-3">
                    {personaRecoveredRevState.map((data, i) => (
                      <div key={`RPS_Lift__div_${i}`}>
                        {(this.state.loading.status) ?
                          <Loader key={`RPS_Lift__loader_${i}`} width="col-md-12 col-lg-12" height="150px" /> :
                          <ShieldRecoveredRevenue
                            index="2"
                            key={"RPS_LIFT_" + i}
                            Heading={[<h6 key={"RPS_LIFTh6_" + i}>RPS LIFT</h6>]}
                            Money={this.state.revenuePerSessionLift !== 0 ? [<h3 key={"RPS_LIFTh3_" + i}><strong>{(this.state.loading.status) ? this.state.loading.message : this.state.revenuePerSessionLift}</strong></h3>] : 0}
                            industryStd={!this.state.industryStdLoading && industryStd}
                            PerText={false}
                            Days=""
                            isRandomUpdate={false}
                            mainData={data.sparklineData.data}
                            chartColor={data.sparklineData.areaStyle.color}
                            ContainerclassName="col-lg-12 col-md-12 col-sm-12 p-0"
                            alignText="text-left"
                            BlockHeight={70}
                          />
                        }
                      </div>
                    ))}
                  </div>

                  <div className="col-lg-6 col-md-6">
                    {personaRecoveredRevState.map((data, i) => (
                      <div key={`shield_div_${i}`}>
                        {(this.state.loading.status) ?
                          <Loader key={`shield_loader_${i}`} width="col-md-12 col-lg-12" height="150px" /> :
                          <ShieldRecoveredRevenue
                            index={3}
                            key={`shield_recover_rev_${i}`}
                            Heading={[<h6 key={"shield_recover_rev_h6" + i}>Recovered Revenue</h6>]}
                            Money={this.state.recoveredRevenue !== 0 ? [<h3 className="pb-0" key={"shield_recover_rev_h3" + i}><strong>{(this.state.loading.status) ? this.state.loading.message : parseFloat(this.state.recoveredRevenue).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong></h3>] : 0}
                            PerText="How was it calculated?"
                            industryStd={!this.state.industryStdLoading && industryStd}
                            Days={[<span className="smallText pb-0" key={"shield_recover_rev_span" + i}>({differenceInDays(this.state.endDate, this.state.startDate) + 1} days)</span>]}
                            isRandomUpdate={false}
                            mainData={data.sparklineData.data}
                            chartColor={"#769ccd"}
                            ContainerclassName="col-lg-12 col-md-12 col-sm-12 p-0"
                            alignText="text-center"
                            BlockHeight={this.state.recoveredRevenue !== 0 ? 25 : 40}
                          />
                        }
                      </div>
                    ))}
                  </div>
                </div>

                <div className="row clearfix">

                  <div className="col-lg-3 col-md-3">
                    <>
                      {(this.state.loading.status) ?
                        <Loader width="col-md-12 col-lg-12" height="150px" /> :
                        <ShieldProtectedAgainstCard couponCashData={!this.state.engageTopCouponsCashbackDataIsLoading && this.state.engageTopCouponsCashbackData} abData={!this.state.websiteRecordByIdLoading && websiteRecordById} className="dbCard" />
                      }
                    </>
                  </div>
                  <div className="col-lg-9 col-md-9 p-0">
                    <>
                      {(this.state.loading.status) ?
                        <Loader width="col-md-12 col-lg-12" height="150px" /> :
                        <ShieldMetricTableCard platform={this.props.sessionClient.analytics_platform} industryStd={!this.state.industryStdLoading && industryStd} data={!this.state.metricsDataLoading && metricsData} />
                      }
                    </>
                  </div>
                </div>
              </div>
            </div>
          </>
        }
      </div>
    </div>
  }
}

const mapStateToProps = ({
  analyticalReducer,
  websiteRecordReducer
}) => ({
  loadingPage: analyticalReducer.loadingPage,
  sessionClient: websiteRecordReducer.sessionClient,
  websiteRecord: websiteRecordReducer.websiteRecord
});

export default connect(mapStateToProps, {
  websiteRecordAction,
  onPressSideMenuTab
})(ShieldDashboard);
