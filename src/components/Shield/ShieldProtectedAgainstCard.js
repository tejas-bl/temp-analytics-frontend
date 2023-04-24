import * as echarts from "echarts";
import React from "react";
import { connect } from "react-redux";
import CouponCashbackModal from './CouponCashbackModal';
import { websiteRecordAction } from "../../actions";
class ShieldProtectedAgainstCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showMalwareModal: false,
      showCallbackModal: false,
      abData: props.abData,
      abDataLoading: true,
      showCouponCashModal:false
    }
  }

  componentDidMount() {
    this.chartPlace(this.state.abData);
  }



  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.abData !== prevProps.abData) {
      this.setState({
        abData: this.props.abData,
        abDataLoading: false
      })
      this.chartPlace(this.props.abData);
    }
  }


  chartPlace = (abData) => {
    var chartDom = document.getElementById("topsaleDonut");
    var myChart = echarts.init(chartDom);
    var option;
    option = {
      title: {
        text: "",
        subtext: "",
        left: "center",
      },
      color: ["#769ccd", "#374649"],
      tooltip: {
        trigger: "item",
        formatter: function (value) {
          return `${value.data.value}%`;
        },
        // formatter: "{a} <br/>{b} : {c} ({d}%)",
      },
      legend: {
        orient: "horizontal",
        bottom: "bottom",
        data: [
          "Brandlock Script On",
          "Brandlock Script Off",
        ],
      },
      series: [
        {
          name: "Shield Data",
          type: "pie",
          radius: "45%",
          center: ["50%", "35%"],
          data: [
            { value: (abData.ab_status) ? Math.abs(abData.ab_perc) : 0, name: "Brandlock Script On" },
            { value: (abData.ab_status) ? (100 - Math.abs(abData.ab_perc)) : 100, name: "Brandlock Script Off" },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
/*     const saleGaugeOption = {
      title: {
        x: "center",
        y: "center",
        textStyle: {
          color: "#a27ce6",
          fontFamily: "Arial",
          fontSize: 20,
          fontWeight: "bolder",
        },
      },
      grid: {
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
      },
      tooltip: {
        trigger: 'item'
      },
      // tooltip: {
      //   show: true,
      //   formatter: function (params, ticket, callback) {
      //     return '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#212121;"></span>';
      //   },
      // },
      legend: {
        bottom: 0,
      },
      series: [
        {
          name: "Shield Data",
          type: "pie",
          top: 0,
          height: "100",
          startAngle: 215,
          avoidLabelOverlap: false,
          clockWise: 1,
          radius: [38, 50],
          emphasis: {
            label: {
              show: true,
              fontSize: '8',
              fontWeight: 'bold'
            }
          },
          label: {
            show: false,
            position: "center",
          },
          labelLine: {
            show: false
          },
          labelLayout: {
            x: "50%",
          },

          data: [
            {
              value: (abData.ab_status) ? Math.abs(abData.ab_perc) : 0,
              name: "Brandlock Script On",
              itemStyle: {
                normal: {
                  color: "#a27ce6",
                  label: { show: true },
                  labelLine: { show: true },
                  tooltip: { show: true },
                },
                emphasis: {
                  color: "#a27ce6",
                },
              },
            },
            {
              value: (abData.ab_status) ? (100 - Math.abs(abData.ab_perc)) : 100,
              name: "Brandlock Script Off",
              itemStyle: {
                normal: {
                  color: "#212121",
                  label: { show: true },
                  labelLine: { show: true },
                  tooltip: { show: true },
                },
                emphasis: {
                  color: "#212121",
                },
              },
            },
          ],
        },
      ],
    }; */

    // option = saleGaugeOption;

    option && myChart.setOption(option);
  };

  onClickMalwareModal() {
    this.setState({ showMalwareModal: !this.state.showMalwareModal })
  }
  onClickCallbackModal() {
    this.setState({ showCallbackModal: !this.state.showCallbackModal })
  }

  onclickCouponCashModal() {
    this.setState({ showCouponCashModal: !this.state.showCouponCashModal })
  }
  render() {
    // const { Heading, Money, PerText, ContainerClass, index } = this.props;
    // const { Heading, Money, PerText, ContainerClass, index } = this.props;
    const { abData } = this.state;
    return (
      <div className={`card ${this.props.className}`}>
        <div className="header pb-0">
          <h2 className="pb-0">{this.props.shopperRecord.shield} Split</h2>
        </div>
        <div className="body pb-0">
          <div
            id="topsaleDonut"
            style={{ height: 200, width: "100%" }}
          ></div>
          <div className="groupSplit text-center badge badge-info">Variant Split - [{(abData.ab_status) ? (Math.abs(abData.ab_perc)) : 0}-{(abData.ab_status) ? (100 - Math.abs(abData.ab_perc)) : 100}]</div>
          <hr />
          <div className="header pl-0 pr-0">
            <h2 className="pb-0">Protected Against</h2>
          </div>

          <ul className="list-unstyled list-referrals cardScrollBar m-r-5 clearfix" style={{ height: "auto" }}>
            <li>
              <p><span className="">Malware & Adware {/* <i className="fa fa-external-link" onClick={() => { this.onClickMalwareModal(); }}></i> */}</span>
              
              {(abData.ab_status) ? <span className={`badge float-right badge-info`}>ON</span> : <span className={`badge float-right badge-danger`}>OFF</span>}
              </p>
            </li>
            <li>
              <p><span className="">Cashback and Coupon <br />Extensions <i className="fa fa-external-link" onClick={() => { this.onclickCouponCashModal(); }}> </i>

              </span>
                {(abData.shield_plus) ? <span className={`badge float-right badge-info`}>ON</span> : <span className={`badge float-right badge-danger`}>OFF</span>}
              </p>
            </li>
          </ul>
        </div>
        {/* <MalwareModalCard
          key={"modal1"}
          size={"lg"}
          title={"Malware and Adware Overview​"}
          show={this.state.showMalwareModal}
          onClose={() => this.onClickMalwareModal()}
          topInjectionTypes={this.props.topInjectionTypes}
          topMaliciousPages={this.props.topMaliciousPages}
        />
         */}
        {/* <CashbackAndCouponModalCard
          key={"modal2"}
          size={"lg"}
          title={"Cashback and coupon extensions"}
          show={this.state.showCallbackModal}
          shield_status={!this.state.abDataLoading && this.props.abData.shield_status}
          onClose={() => this.onClickCallbackModal()}
        /> */}
        <CouponCashbackModal
          key={"modalccm"}
          size={"lg"}
          title={"Top Coupon or cashback by percentage"}
          show={this.state.showCouponCashModal}
          couponCashData={this.props.couponCashData}
          extensionShopperCashbackCoupons={this.props.extensionShopperCashbackCoupons}
          onClose={() => this.onclickCouponCashModal()} />
      </div>
    );
  }
}

const mapStateToProps = ({
  websiteRecordReducer
}) => ({
  shopperRecord: websiteRecordReducer.shopperRecord
});

export default connect(mapStateToProps, {
  websiteRecordAction
})(ShieldProtectedAgainstCard);
