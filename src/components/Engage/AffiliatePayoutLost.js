import React from "react";
import * as echarts from "echarts";
class AffiliatePayoutLost extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      updateData: [...this.props.mainData],
      DataX: [5, 5, 5, 5, 5, 5],
    };

  }
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
      reData.push(Math.floor(Math.random() * 10) + 1);
    });

    /*     this.timeoutID = setTimeout(() => {
          this.ploatData(this.state.updateData);
          if (this.props.isRandomUpdate) {
            this.chartPlace();
          }
        }, 5000); */
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
    const { Heading, Money, PerText, Days, ContainerClass, index, BlockHeight } = this.props;
    return (
      <div className={ContainerClass}>
        <div className={`card overflowhidden number-chart ${this.props.alignText}`}>
          <div className="body">
            <div className="number m-b-15">
              {Heading}
              <small className="text-muted">{Days}</small>
            </div>

            {Money !== 0 ? <><div className="number">
              {Money}
            </div>
            </> : <span className="badge badge-info mt-3">NO DATA AVAILABLE</span>
            }
            <div className="edit-box mt-4">
            <small className="text-muted">{PerText}</small>
            </div>


            {/*             <div className="number">
              {Money}
            </div>
 */}



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

export default AffiliatePayoutLost;
