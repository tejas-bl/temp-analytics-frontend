import React from "react";
import * as echarts from "echarts";
import {
  OverlayTrigger,
  Popover,
  Button,
} from "react-bootstrap";
class ShieldRecoveredRevenue extends React.Component {
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
    this.chartPlace();
  }
  ploatData = (data) => {
    var reData = [];
    data.map(() => {
      return reData.push(Math.floor(Math.random() * 10) + 1);
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
    const { Heading, Money, PerText, Days, ContainerClass, index, BlockHeight, noCalc, industryStd } = this.props;
    return (
      <div className={ContainerClass}>
        <div className={`card overflowhidden number-chart ${this.props.alignText}`}>
          <div className="body">
          {PerText === false && <small className="text-muted shieldInfoSmall"><span className="info_icon d-none"><i className="fa fa-info text-white"></i></span></small> }
            <div className="number m-b-15">
              {Heading}
              <small className="text-muted">{Days}</small>
            </div>
            {Money !== 0 ? <div className="number">
              {Money} {industryStd && <span className="text-muted industryAvg">( Based on Industry Avg.)</span>}
            </div>
              : <span className="badge badge-info mt-3">NO DATA AVAILABLE</span> 
            }
            {/* <span className="badge badge-info mt-3">NO DATA AVAILABLE</span> */}


            {PerText !== false && !noCalc && Money !== 0 ?
              <OverlayTrigger
                trigger={["hover", "focus"]}
                key="left"
                placement="left"
                overlay={
                  <Popover className="col-md-7 col-lg-7" style={{ paddingTop:"10px", width: "max-content", maxWidth: "500px" }} id={`popover-positioned-left`}>
                    <Popover.Title className="pt-1" as="h3">{`Q. How do you identify a winner of an A/B test when the sample sizes are Uneven?`}</Popover.Title>
                    <Popover.Content>
                      <strong>A.</strong> When calculating additional revenue (recovered revenue) generated in an A/B test and the experiment and control group are not the same size then we have to take the total revenue generated by that segment (Control or Protection) and divide them by the number of sessions in that segment. This will help us know what the revenue per Session generated is for that segment of users. Number of sessions coming to your site are always finite.
                    </Popover.Content>
                  </Popover>
                }
              >
                  <Button className="mr-1 mt-0 calculation_info_btn" variant="default">
                    <small className="text-muted">{PerText}  <span className="info_icon"><i className="fa fa-info text-white"></i></span></small>
                  </Button>
              </OverlayTrigger>
              : <small className="text-muted"></small>

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
  }
}

export default ShieldRecoveredRevenue;
