import React from "react";
import * as echarts from "echarts";
import no_data_available from "../../assets/images/no_data/engage_overall_rev_imp_no_data.png";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";
class PersonaRecoveredRevenue extends React.Component {
  state = {
    updateData: [...this.props.mainData],
    DataX: [5, 5, 5, 5, 5, 5],
  };

  componentDidMount() {
    this.timeoutID = undefined;
    this.ploatData(this.props.mainData);

    this.setState({
      updateData: [...this.props.mainData],
    });

    if (this.props.revenueImpact !== 0) {
      this.chartPlace();
    }
  }
  ploatData = (data) => {
    var reData = [];
    data.map(() => {
      reData.push(Math.floor(Math.random() * 10) + 1);
    });

    this.timeoutID = setTimeout(() => {
      this.ploatData(this.state.updateData);
      if (this.props.isRandomUpdate) {
        this.chartPlace();
      }
    }, 5000);
    this.setState({ updateData: [...reData] });
  };
  chartPlace = () => {
    const { chartColor, mainData, index } = this.props;
    var chartDom = document.getElementById("main" + index);
    var myChart = echarts.init(chartDom);
    var option;
    option = {
      /*       tooltip: {
              trigger: "axis",
              formatter: function (value) {
                // return value[0].data;
                return null;
              },
            }, */
      grid: {
        left: 0,
        bottom: 0,
        top: 5,
        right: 0,
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          axisLine: {
            show: false,
          },
          animation: {
            duration: 300,
            easing: "cubicOut",
          },
          data: [0, 1, 2, 3, 4, 5],
        },
      ],
      yAxis: [
        {
          type: "value",
          splitLine: { show: false },
          axisLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          data: [0, 2, 4, 6, 8, 10],
        },
      ],
      series: [
        {
          type: "line",
          data: mainData ? this.state.updateData : [5, 6, 9, 2, 3, 6, 8, 5],
          areaStyle: {
            color: chartColor ? chartColor : "#769ccd",
          },
          itemStyle: {
            color: chartColor ? chartColor : "#769ccd",
          },
          symbolSize: 1,
        },
      ],
    };
    option && myChart.setOption(option);
  };
  componentWillUnmount() {
    clearTimeout(this.timeoutID);
  }
  render() {
    const { Heading, Money, Days, ContainerClass, index, BlockHeight, revenueImpact, PerText, isRevenuePotential, indStdRevenue30Days } = this.props;
    if (revenueImpact !== 0) {
      return (
        <div className={ContainerClass}>
          <div className={`card overflowhidden number-chart ${this.props.alignText}`}>
            <div className="body">
              <div className="number m-b-15">
                {Heading}
                <small className="text-muted">{!indStdRevenue30Days ? Days : <span key={`engage__db_days_1`} className="smallText pb-0">(30 days)</span>}</small>
              </div>
              <div className="number">
                {Money}
              </div>

              {PerText !== false && Money !== 0 && isRevenuePotential !== true ?
                <OverlayTrigger
                  trigger={["hover", "focus"]}
                  key="left"
                  placement="left"
                  overlay={
                    <Popover className="col-md-7 col-lg-7" style={{ paddingTop: "10px", width: "max-content", maxWidth: "500px" }} id={`popover-positioned-left`}>
                      <Popover.Title className="pt-1" as="h3">{`Q. How Revenue Impact was calculated?`}</Popover.Title>
                      <Popover.Content>
                        <strong>A.</strong> Your website analytics platform is used to mark sessions in which user segments are identified and get the Brandlock experience. Revenue from those users who have received the Brandlock experience are recorded under impacted revenue.
                      </Popover.Content>
                    </Popover>
                  }
                >
                  <Button className="mr-1 mt-0 calculation_info_btn personaRevenueImpactCalculations" variant="default">
                    <small className="text-muted">{PerText}  <span className="info_icon"><i className="fa fa-info text-white"></i></span></small>
                  </Button>
                </OverlayTrigger>
                : PerText !== false && Money !== 0 && isRevenuePotential !== false ?
                  <OverlayTrigger
                    trigger={["hover", "focus"]}
                    key="left"
                    placement="left"
                    overlay={
                      <Popover className="col-md-7 col-lg-7" style={{ paddingTop: "10px", width: "max-content", maxWidth: "500px" }} id={`popover-positioned-left`}>
                        <Popover.Title className="pt-1" as="h3">{`Q. How Potential Revenue Impact was calculated?`}</Popover.Title>
                        <Popover.Content>
                          <strong>A.</strong> Your website analytics platform is used to mark sessions in which user segments are identified and get the Brandlock experience. Revenue from those users who have received the Brandlock experience are recorded under impacted revenue.
                        </Popover.Content>
                      </Popover>
                    }
                  >
                    <Button className="mr-1 mt-0 calculation_info_btn personaRevenueImpactCalculations" variant="default">
                      <small className="text-muted">{PerText}  <span className="info_icon"><i className="fa fa-info text-white"></i></span></small>
                    </Button>
                  </OverlayTrigger> : <small className="text-muted"></small>

              }

            </div>
            <div
              id={"main" + index}
              className="sparkline"
              style={{ width: "100%", height: BlockHeight }}
            ></div>
          </div>
        </div>
      );
    } else {
      return (<div className="row no_data_row">
        <h3 className="badge no_data_available">No Data Available</h3>
        <img src={no_data_available} width="auto" height="300px" alt="No data available" />
      </div>)
    }
  }
}

export default PersonaRecoveredRevenue;
