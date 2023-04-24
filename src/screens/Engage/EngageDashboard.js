import React from "react";
import { connect } from "react-redux";
import LogoiCON from "../../assets/images/logo-icon.svg";
import PageHeader from "../../components/PageHeader";
import {
  websiteRecordAction
} from "../../actions";
import { personaRecoveredRevData } from "../../Data/EngagePersonaData";
import EngageRecycledUserCard from "../../components/Engage/EngageRecycledUserCard";
import PdfDownloader from "../../helper/PdfDownloader";
import DateRange from "../../helper/DateRange";
import ShieldDateRange from "../../helper/DateRangeWithSplit";
import { convertDateTOLocale, getCurrentUser } from "../../helper/Utils";
import { getCheckoutPageConversionRate, getCouponUsed, getEngageSplitClientHistory, getEngageTopCodes, getEngageTopCouponsCashback, getEngageTopPublisherWc, getRecycledUsersData, getRecycledUsersDataUngroupedByPublisher } from "../../api/Engage/OldDB";
import { subDays } from "date-fns";
import { getShieldGAData, getWebsitesRecordById } from "../../api/shieldDashboard";
import SessionAttributionHijacking from "../../components/Engage/Dashboard/SessionAttributionHijacking";
import OrderAttributionHijacking from "../../components/Engage/Dashboard/OrderAttributionHijacking";
import Loader from "../../helper/Loader";
import AffiliatePayoutLost from "../../components/Engage/AffiliatePayoutLost";
import EngageTopCodesCard from "../../components/Engage/EngageTopCodesCard";
import EngageTopPublisherWcCard from "../../components/Engage/EngageTopPublisherWcCard";
import EngageTopCouponsCashbackCard from "../../components/Engage/EngageTopCouponsCashbackCard";
import { getDataTableConfig } from "../../helper/GetDatatableConfig";
import { Checkout_Page_Conversion_Rate_Column, Coupon_Used_Column, Engage_EEI_Recycle_Affiliate_Sessions_Columns, Engage_Insights_Cashback_percentage, Engage_insights_Recycle_User_Data_Columns, Engage_Insights_Wrong_Coupon_affilate_Column, Engage_Insights_Wrong_Coupon_Data_Column } from "../../helper/GetColumnsConfig";
import CouponUsedCard from "../../components/Engage/CouponUsedCard";
import CheckoutPageConversionRateCard from "../../components/Engage/CheckoutPageConversionRateCard";

class EngageDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: this.props.sessionClient.web_account_id != 508 ? subDays(new Date(), 31) : new Date('2022-12-01'),
      endDate: this.props.sessionClient.web_account_id != 508 ? subDays(new Date(), 2) : new Date('2022-12-31'),
      personaRecoveredRevState: [],
      recycleUserDataById: {},
      websiteRecordById: {},
      splitDateRangeData: {},
      affiliatePerc: 2,
      splitDateRangeDataLoading: true,
      gaData: {},
      recycleUserDataByIdLoading: true,
      recycledUsersData: [],
      recycledUsersDataIsLoading: true,
      newrecycledata: {},
      isNewRecycledataLoading: true,
      newwrongcoupondata: {},
      isNewWrongCouponDataLoading: true,
      newcouponcashbackpercentage: {},
      isnewCouponCashbackPercentageLoading: true,
      newwrongcouponaffilatedata: {},
      isNewWrongCouponAffilatedataLoading: true,
      engageTopCodesData: [],
      engageTopCodesDataIsLoading: true,

      engageTopCouponsCashbackData: [],
      engageTopCouponsCashbackDataIsLoading: true,
      couponUsedData: [],
      couponUsedDataIsLoading: true,
      checkoutPageConversionRateData: [],
      checkoutPageConversionRateDataIsLoading: true,
      engageTopPublisherWcData: [],
      engageTopPublisherWcDataIsLoading: true,


      loading: {
        status: false,
        message: ""
      }
    };
    this.downloadEngageDashboardRef = React.createRef();
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleEngageAffiliateCalculations = this.handleEngageAffiliateCalculations.bind(this);
  }


  async componentDidUpdate(prevProps) {

    if (this.props.sessionClient.web_id !== prevProps.sessionClient.web_id) {
      const headerConfigPassed = {
        headers: {
          Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${getCurrentUser().data.data.refresh_token}`,
        }
      }
      this.setState({
        splitDateRangeDataLoading: true,
        loading: {
          status: true,
          message: "loading"
        },
        engageTopCodesDataIsLoading: true,
        engageTopPublisherWcDataIsLoading: true,
        engageTopCouponsCashbackDataIsLoading: true,
        isnewCouponCashbackPercentageLoading: true,
        couponUsedDataIsLoading: true,
        checkoutPageConversionRateDataIsLoading: true,
        isNewWrongCouponDataLoading: true,
        isNewRecycledataLoading: true,
        isNewWrongCouponAffilatedataLoading: true
      })
      let siteInputs = {};      
      if (this.props.sessionClient.web_account_id === 508) {
        this.setState({
          startDate: new Date('2022-12-01'),
          endDate: new Date('2022-12-31')
        })
        siteInputs = { siteIdInput: this.props.sessionClient.web_id, startDate: '2022-12-01', endDate: '2022-12-31' };
      } else if (prevProps.sessionClient.web_account_id === 508) {
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
      //const siteInputs = { siteIdInput: this.props.sessionClient.web_id, startDate: convertDateTOLocale(this.state.startDate), endDate: convertDateTOLocale(this.state.endDate) };
      const [recycleUserDataAPI, gaDataAPI, websiteRecordByIdAPI] = await Promise.all([
        getRecycledUsersDataUngroupedByPublisher(siteInputs, headerConfigPassed),
        getShieldGAData(siteInputs, headerConfigPassed),
        getWebsitesRecordById(this.props.sessionClient.web_id, headerConfigPassed)
      ])

      this.handleSplitDateRange()

      if (gaDataAPI.statuscode === undefined || gaDataAPI.statuscode !== 200 || recycleUserDataAPI.data === undefined) {
        this.setState({
          message: "", // && shieldData.data[0].message,
          loading: {
            status: false,
            message: ""
          },
          recycleUserDataById: 0
        })

        setTimeout(() => {
          this.setState({
            message: "",
          })
        }, 5000)
      }
      else if (recycleUserDataAPI.data.ms_conversion !== null) {

        this.setState({
          recycleUserDataById: recycleUserDataAPI.data,
          gaData: gaDataAPI.data,
          recycleUserDataByIdLoading: false,
          websiteRecordById: websiteRecordByIdAPI.data[0],
          loading: {
            status: false,
            message: ""
          }
        })
      } else {
        this.setState({
          message: "", // && shieldData.data[0].message,
          loading: {
            status: false,
            message: ""
          },
          recycleUserDataById: 0
        })
      }

      getRecycledUsersData(siteInputs, headerConfigPassed).then(res => {
        if (res.data && res.data.length !== 0) {
          this.createEngageRecycledUserDataTable(res.data);
        }
      })


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

      getEngageTopCouponsCashback(siteInputs, headerConfigPassed).then(res => {
        // if (res.data && res.data.length !== 0) {
        this.createEngageCashbackCouponDatatable(res.data);
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

    }
  }
  async handleDateChange(item, splitLengthAddedIndex = null) {

    const siteIdInput = this.props.sessionClient.web_id;
    /* const itemStartDate = item["selection1"].startDate;
    const itemEndDate = item["selection1"].endDate; */


    const selectionWithKey = "selection" + splitLengthAddedIndex
    const itemStartDate = item.hasOwnProperty(selectionWithKey) && splitLengthAddedIndex !== null ? item[selectionWithKey].startDate : item[0].startDate;
    const itemEndDate = item.hasOwnProperty(selectionWithKey) ? item[selectionWithKey].endDate : item[0].endDate;


    /*     const itemStartDate = item[0].startDate;
        const itemEndDate = item[0].endDate; */

    let startDate = null;
    let endDate = null;
    if (this.props.sessionClient.web_account_id != 508) {
      startDate = convertDateTOLocale(itemStartDate);
      endDate = convertDateTOLocale(itemEndDate);
    } else {
      startDate = '2022-12-01';
      endDate = '2022-12-31';
    }
/* 
    const startDate = convertDateTOLocale(itemStartDate);
    const endDate = convertDateTOLocale(itemEndDate); */

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
      engageTopCodesDataIsLoading: true,
      engageTopPublisherWcDataIsLoading: true,
      engageTopCouponsCashbackDataIsLoading: true,
      isnewCouponCashbackPercentageLoading: true,
      couponUsedDataIsLoading: true,
      isNewWrongCouponDataLoading: true,
      isNewRecycledataLoading: true,
      isNewWrongCouponAffilatedataLoading: true,
      startDate: itemStartDate,
      endDate: itemEndDate
    })

    const siteInputs = { siteIdInput, startDate, endDate };

    const [recycleUserDataAPI, gaDataAPI, websiteRecordByIdAPI] = await Promise.all([
      getRecycledUsersDataUngroupedByPublisher(siteInputs, headerConfigPassed),
      getShieldGAData(siteInputs, headerConfigPassed),
      getWebsitesRecordById(siteIdInput, headerConfigPassed)
    ])

    if (gaDataAPI.statuscode === undefined || gaDataAPI.statuscode !== 200 || recycleUserDataAPI.data === undefined) {
      this.setState({
        message: "", // && shieldData.data[0].message,
        loading: {
          status: false,
          message: ""
        },
        recycleUserDataById: 0
      })

      setTimeout(() => {
        this.setState({
          message: "",
        })
      }, 5000)
    }
    else if (recycleUserDataAPI.data.ms_conversion !== null) {

      this.setState({
        recycleUserDataById: recycleUserDataAPI.data,
        gaData: gaDataAPI.data,
        websiteRecordById: websiteRecordByIdAPI.data[0],
        recycleUserDataByIdLoading: false,
        loading: {
          status: false,
          message: ""
        }
      })
    } else {
      this.setState({
        message: "", // && shieldData.data[0].message,
        loading: {
          status: false,
          message: ""
        },
        recycleUserDataById: 0
      })
    }

    getRecycledUsersData(siteInputs, headerConfigPassed).then(res => {
      if (res.data && res.data.length !== 0) {
        this.createEngageRecycledUserDataTable(res.data);
      }
    })


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

    getEngageTopCouponsCashback(siteInputs, headerConfigPassed).then(res => {
      //if (res.data && res.data.length !== 0) {
      this.createEngageCashbackCouponDatatable(res.data);
      //}
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
  }

  handleEngageAffiliateCalculations(e) {

    this.setState({
      affiliatePerc: e.target.value.split('%')[0]
    })
  }

  async componentDidMount() {
    window.scrollTo(0, 0);
    this.loadDataCard();
    this.setState({
      personaRecoveredRevState: [...personaRecoveredRevData],
    });

    const siteInputs = { siteIdInput: this.props.sessionClient.web_id, startDate: convertDateTOLocale(this.state.startDate), endDate: convertDateTOLocale(this.state.endDate) };
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
      engageTopCodesDataIsLoading: true,
      engageTopPublisherWcDataIsLoading: true,
      engageTopCouponsCashbackDataIsLoading: true,
    })


    this.handleSplitDateRange();
    const [recycleUserDataAPI, gaDataAPI, websiteRecordByIdAPI] = await Promise.all([
      getRecycledUsersDataUngroupedByPublisher(siteInputs, headerConfigPassed),
      getShieldGAData(siteInputs, headerConfigPassed),
      getWebsitesRecordById(this.props.sessionClient.web_id, headerConfigPassed)
    ])


    getRecycledUsersData(siteInputs, headerConfigPassed).then(res => {
      if (res.data && res.data.length !== 0) {
        this.createEngageRecycledUserDataTable(res.data);
        this.setState({
          recycledUsersData: res.data,
          recycledUsersDataIsLoading: false,
        })
      }
    })


    if (gaDataAPI.statuscode === undefined || gaDataAPI.statuscode !== 200 || recycleUserDataAPI.data === undefined) {

      this.setState({
        message: "", // && shieldData.data[0].message,
        loading: {
          status: false,
          message: ""
        },
        recycleUserDataById: 0
      })

      setTimeout(() => {
        this.setState({
          message: "",
        })
      }, 5000)
    }
    else if (recycleUserDataAPI.data.ms_conversion !== null) {
      this.setState({
        recycleUserDataById: recycleUserDataAPI.data,
        gaData: gaDataAPI.data,
        websiteRecordById: websiteRecordByIdAPI.data[0],
        recycleUserDataByIdLoading: false,
        loading: {
          status: false,
          message: ""
        },
      })
    } else {

      this.setState({
        message: "", // && shieldData.data[0].message,
        loading: {
          status: false,
          message: ""
        },
        recycleUserDataById: 0
      })
    }


    getEngageTopCodes(siteInputs, headerConfigPassed).then(res => {
      // if (res.data && res.data.length !== 0) {
      this.createEngageWrongCouponDataTable(res.data);
      // }
    })

    getEngageTopCouponsCashback(siteInputs, headerConfigPassed).then(res => {
      // if (res.data && res.data.length !== 0) {
      this.createEngageCashbackCouponDatatable(res.data);
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

    getEngageTopPublisherWc(siteInputs, headerConfigPassed).then(res => {
      // if (res.data && res.data.length !== 0) {
      this.createEngageWrongCouponByAffilateDatatable(res.data);
      // }
    })
    // this.chartPlace();
  }


  async handleSplitDateRange() {

    const siteIdInput = this.props.sessionClient.web_id;
    const siteInputsForSplitDate = { siteIdInput, startDate: convertDateTOLocale(subDays(new Date(), 420)), endDate: convertDateTOLocale(subDays(new Date(), 0)) };
    const headerConfigPassed = {
      headers: {
        Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${getCurrentUser().data.data.refresh_token}`,
      }
    }

    const splitClientHistory = await getEngageSplitClientHistory(siteInputsForSplitDate, headerConfigPassed);
    if (splitClientHistory.hasOwnProperty('data') && splitClientHistory.data !== undefined) {
      let splitDateAndPerc = {
        splitDate: siteInputsForSplitDate.startDate,
        abPerc: "engage_off"
      }
      splitDateAndPerc = splitClientHistory.data.map(d => {
        return { splitDate: new Date(d.prod_invalidated_on), abPerc: d.phase_status }
      })

      splitDateAndPerc.unshift({
        splitDate: new Date(siteInputsForSplitDate.startDate),
        abPerc: "engage_off"
      });

      this.setState({
        splitDateRangeData: splitDateAndPerc,
        splitDateRangeDataLoading: false
      });

    }

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



  async createEngageRecycledUserDataTable(recycleUserData) {
    let mainRecycleUserData = [];
    recycleUserData.map((e, i) => {
      const data = {
        publisher: e.publisher !== "" ? e.publisher : "unmapped publisher",
        sessions: e.sessions,
        ms_sessions: e.ms_sessions,
        ms_conversion: e.ms_conversion,
        total_conversion: e.total_conversion,
        percentageRU: (((~~e.sessions - ~~e.fpa_sessions) / (~~e.sessions)) * 100).toFixed(2) + '%',
        percentageRO: (((~~e.total_conversion - ~~e.fpa_conversion) / (e.total_conversion)) * 100).toFixed(2) + '%',
        modalDetails: JSON.stringify({
          pub_sources: e.sources,
          pub_sessions: e.sources_sessions
        })
      }
      mainRecycleUserData.push(data);
    });
    const recycledata = await getDataTableConfig(mainRecycleUserData, Engage_EEI_Recycle_Affiliate_Sessions_Columns);

    this.setState({
      newrecycledata: recycledata,
      isNewRecycledataLoading: false,
    });
  }



  async createEngageWrongCouponDataTable(wrongCodeData) {
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
      newwrongcoupondata: wrongcoupondata,
      isNewWrongCouponDataLoading: false,
    });
  }

  async createEngageWrongCouponByAffilateDatatable(wrongCouponByAffilateData) {
    let mainWcAffilateData = [];
    //console.log("wrongCouponByAffilateData --- ", wrongCouponByAffilateData)
    if (wrongCouponByAffilateData !== undefined) {
      wrongCouponByAffilateData.map((e, i) => {
        const data = {
          no: i += 1,
          affiliate: e.publisher !== "" ? decodeURIComponent(e.publisher) : "Unmapped Publisher",
          wrong_coupon_count: e.wrong_coupon_count
        };
        mainWcAffilateData.push(data);
      });
    }
    const wrongcouponaffilatedata = await getDataTableConfig(mainWcAffilateData, Engage_Insights_Wrong_Coupon_affilate_Column);
    this.setState({
      newwrongcouponaffilatedata: wrongcouponaffilatedata,
      isNewWrongCouponAffilatedataLoading: false,
    });
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


  render() {
    const { loadingPage } = this.props;
    const { personaRecoveredRevState, gaData, recycleUserDataById, recycledUsersData, websiteRecordById, engageTopCodesData, engageTopPublisherWcData, engageTopCouponsCashbackData, splitDateRangeData } = this.state;
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
        <div className="container-fluid">

          <div className="row clearfix">
            <div className="col-lg-6 col-md-4">
              <PageHeader
                HeaderText="Engage Insights"
                Breadcrumb={[{ name: "Dashboard" }]}
              />
            </div>

            <div className="col-lg-6 col-md-6">

              <div className="row dashboardActionButtons" >
                <div className="text-right pr-0 mr-3">
                  <PdfDownloader downloadFileName="EngageDashboard" rootElementId="downloadEngageDashboardRef" />
                </div>
                <div className="text-right pl-0 mr-3">
                  <form onSubmit={(e) => this.handleGetGADataSubmit(e)}>
                    <DateRange startDate={this.state.startDate} endDate={this.state.endDate} onDateRangeChange={this.handleDateChange} />
                    {/* <ShieldDateRange dateRange={!this.state.splitDateRangeDataLoading && splitDateRangeData} startDate={this.state.startDate} endDate={this.state.endDate} onDateRangeChange={this.handleDateChange} /> */}
                  </form>
                </div>
              </div>

            </div>
          </div>



          <div className="container-fluid">
            {/*             <PageHeader
              HeaderText="Dashboard"
              Breadcrumb={[{ name: "Dashboard" }]}
            />

            <div className="row clearfix">

              <div className="col-lg-4 col-md-4 mb-3">
                <PdfDownloader downloadFileName="EngageDashboard" rootElementId="downloadEngageDashboardRef" />
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

            <div id="downloadEngageDashboardRef" ref={this.downloadEngageDashboardRef}>
              {(!this.state.recycleUserDataByIdLoading && (!websiteRecordById.prediction_trigger || !websiteRecordById.extension_trigger || !websiteRecordById.wrong_coupon || recycleUserDataById.ms_conversion > 0)) ?
                <div className="row clearfix">
                  <div className="col-lg-4 col-md-4">
                    <>
                      {(this.state.loading.status) ?
                        <Loader width="col-md-12 col-lg-12" height="350px" /> :
                        <SessionAttributionHijacking className="dbCard" id="sessionAttributionHijacking" recycleUserData={recycleUserDataById} />
                      }</>
                  </div>
                  <div className="col-lg-4 col-md-4">
                    {personaRecoveredRevState.map((data, i) => (
                      <div key={`recovered_rev_${i}`}>
                        {(this.state.loading.status) ?
                          <Loader width="col-md-12 col-lg-12" height="350px" /> :
                          <AffiliatePayoutLost
                            index="1"
                            key={"recovered_rev_" + i}
                            Heading={[<h6 key={"recovered_rev_h6" + i} className=" mb-4 ">Affiliate Payout Lost Due To Recycled Users</h6>]}
                            Money={(!isNaN(recycleUserDataById.ms_conversion)) && (recycleUserDataById.ms_conversion * gaData.total_aov * (this.state.affiliatePerc / 100)) > 0 ? [<h2 key={"recovered_rev_h2" + i} className="affiliate_rev_lost">{(this.state.loading.status) ? this.state.loading.message : (recycleUserDataById.ms_conversion * gaData.total_aov * (this.state.affiliatePerc / 100)).toLocaleString('en-US', { style: 'currency', currency: this.props.sessionClient.currency })}</h2>] : 0}
                            /* PerText={["Based on ", <span key={"recovered_rev_span" + i} className="badge badge-warning"> <input type="text" className="affiliate_input" value={this.state.affiliatePerc} onChange={(e) => this.handleEngageAffiliateCalculations(e)} />  </span>, "Affiliate Commission"]} */
                            PerText={["Based on ", <span className="affiliate_input_span" key={"recovered_rev_span" + i}> <input type="text" className="affiliate_input" value={this.state.affiliatePerc + "%"} onChange={(e) => this.handleEngageAffiliateCalculations(e)} /> </span>, "Affiliate Commission"]}
                            // handleAffiliateCalculations={this.handleEngageAffiliateCalculations}
                            affiliatePerc={this.state.affiliatePerc}
                            noCalc={true}
                            Days=""
                            isRandomUpdate={false}
                            // Data={data.sparklineData}
                            mainData={data.sparklineData.data}
                            chartColor={data.sparklineData.areaStyle.color}
                            ContainerClass="col-lg-12 col-md-12 col-sm-12 p-0"
                            alignText="text-center"
                            BlockHeight={100}
                          />
                        }
                      </div>
                    ))}
                  </div>
                  <div className="col-lg-4 col-md-4">
                    <>
                      {(this.state.loading.status) ?
                        <Loader width="col-md-12 col-lg-12" height="350px" /> :
                        <OrderAttributionHijacking className="dbCard" id="orderAttributionHijacking" recycleUserData={recycleUserDataById} />
                      }
                    </>
                  </div>
                </div>
                :
                <div className="row clearfix">
                  <div className="col-lg-4 col-md-4">
                    <>
                      {(this.state.loading.status) ?
                        <Loader width="col-md-12 col-lg-12" height="350px" /> :
                        <SessionAttributionHijacking className="dbCard" id="sessionAttributionHijacking" recycleUserData={false} />
                      }</>
                  </div>
                  <div className="col-lg-4 col-md-4">
                    {personaRecoveredRevState.map((data, i) => (
                      <div key={`recovered_rev_div${i}`}>
                        {(this.state.loading.status) ?
                          <Loader width="col-md-12 col-lg-12" height="350px" /> :
                          <AffiliatePayoutLost
                            index="1"
                            key={"recovered_rev_" + i}
                            Heading={[<h6 key={"recovered_rev_h6" + i} className=" mb-4 ">Affiliate Payout Lost Due To Recycled Users</h6>]}
                            // Money={[<h2 key={"recovered_rev_h2" + i} className="m-b-80 m-t-80">$0</h2>]}
                            Money={0}
                            PerText={["Based on ", <span key={"recovered_rev_span" + i} className="badge badge-warning"> 2% </span>, "Affiliate Commission"]}
                            Days=""
                            isRandomUpdate={false}
                            // Data={data.sparklineData}
                            mainData={data.sparklineData.data}
                            chartColor={data.sparklineData.areaStyle.color}
                            ContainerClass="col-lg-12 col-md-12 col-sm-12 p-0"
                            alignText="text-center"
                            BlockHeight={0}
                          />
                        }
                      </div>
                    ))}
                  </div>
                  <div className="col-lg-4 col-md-4">
                    <>
                      {(this.state.loading.status) ?
                        <Loader width="col-md-12 col-lg-12" height="350px" /> :
                        <OrderAttributionHijacking className="dbCard" id="orderAttributionHijacking" recycleUserData={false} />
                      }</>
                  </div>
                </div>
              }

              {(!this.state.recycleUserDataByIdLoading && recycleUserDataById.ms_conversion > 0) ?
                <div className="row clearfix">
                  <div className="col-lg-12 col-md-12 p-0">
                    <>
                      {(this.state.loading.status) ?
                        <Loader width="col-md-12 col-lg-12" height="150px" /> :
                        <EngageRecycledUserCard recycledata={!this.state.isNewRecycledataLoading && this.state.newrecycledata} data={!this.state.recycledUsersDataIsLoading && recycledUsersData} />
                      }</>
                  </div>
                </div> :
                <div className="row clearfix">
                  <div className="col-lg-12 col-md-12 p-0">
                    <>
                      {(this.state.loading.status) ?
                        <Loader width="col-md-12 col-lg-12" height="150px" /> :
                        <EngageRecycledUserCard data={false} />
                      }</>
                  </div>
                </div>
              }
              {/* 
              <div className="row clearfix">

                <div className="col-lg-6 col-md-6">
                  <>
                    {(this.state.isNewWrongCouponDataLoading) ?
                      <Loader width="col-md-12 col-lg-12" height="150px" /> :
                      <EngageTopCodesCard className="dbCard" wrongcoupondata={!this.state.isNewWrongCouponDataLoading && this.state.newwrongcoupondata} data={!this.state.engageTopCodesDataIsLoading && engageTopCodesData} />
                    }</>
                </div>

                <div className="col-lg-6 col-md-6">
                  <>
                    {(this.state.isNewWrongCouponAffilatedataLoading) ?
                      <Loader width="col-md-12 col-lg-12" height="150px" /> :
                      <EngageTopPublisherWcCard className="dbCard" wrongcouponaffilatedata={!this.state.isNewWrongCouponAffilatedataLoading && this.state.newwrongcouponaffilatedata} data={!this.state.engageTopPublisherWcDataIsLoading && engageTopPublisherWcData} />
                    }</>
                </div>


              </div> */}


              <div className="row clearfix">
                <div className="col-lg-6 col-md-6">
                  <>
                    {(this.state.couponUsedDataIsLoading) ?
                      <Loader width="col-md-12 col-lg-12" height="150px" /> :
                      <CouponUsedCard className="dbCard" couponUsedData={!this.state.couponUsedDataIsLoading && this.state.couponUsedData} />
                    }</>
                </div>

                <div className="col-lg-6 col-md-6">
                  <>
                    {(this.state.isnewCouponCashbackPercentageLoading) ?
                      <Loader width="col-md-12 col-lg-12" height="150px" /> :
                      <EngageTopCouponsCashbackCard className="dbCard" couponcashbackpercentage={!this.state.isnewCouponCashbackPercentageLoading && this.state.newcouponcashbackpercentage} data={!this.state.engageTopCouponsCashbackDataIsLoading && engageTopCouponsCashbackData} />
                    }</>
                </div>
                {/*                 <div className="col-lg-6 col-md-6">
                  <>
                    {(this.state.checkoutPageConversionRateDataIsLoading) ?
                      <Loader width="col-md-12 col-lg-12" height="150px" /> :
                      <CheckoutPageConversionRateCard className="dbCard" checkoutPageConversionRateData={!this.state.checkoutPageConversionRateDataIsLoading && this.state.checkoutPageConversionRateData} />
                    }</>
                </div> */}
              </div>


              {/*               <div className="row clearfix">

                <div className="col-lg-12 col-md-12">
                  <>
                    {(this.state.isnewCouponCashbackPercentageLoading) ?
                      <Loader width="col-md-12 col-lg-12" height="150px" /> :
                      <EngageTopCouponsCashbackCard className="dbCard" couponcashbackpercentage={!this.state.isnewCouponCashbackPercentageLoading && this.state.newcouponcashbackpercentage} data={!this.state.engageTopCouponsCashbackDataIsLoading && engageTopCouponsCashbackData} />
                    }</>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    );
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
  websiteRecordAction
})(EngageDashboard);