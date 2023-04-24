import React from "react";
import { connect } from "react-redux";
import * as echarts from "echarts";
import {
  websiteRecordAction
} from "../../actions";
import no_data_available from "../../assets/images/no_data/recovered_revenue_no_data_blur_with_label.png";
class PieChart extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ytdDataLoading: null
    }
  }

  componentDidMount() {

    const legendData = [];
    const seriesData = [];
    if (this.props.updatedPersonaList !== undefined && this.props.updatedPersonaList.length > 0) {
      this.props.updatedPersonaList.map((d) => {
        /* 
        seriesData.push({ value: 400, name: d.name });
        */
        /*   legendData.push(d.name);
            seriesData.push({ value: 400, name: d.name }); */
        if (d.personaRev !== 0 && d.personaRev !== undefined && !isNaN(d.personaRev) && d.personaRev !== null) {
          legendData.push(d.name);
          seriesData.push({ value: parseInt(d.personaRev), name: d.name });
        }
      })
    }

    if (legendData.length !== 0) {
      this.chartPlace(legendData, seriesData);
      this.setState({
        ytdDataLoading: true
      })
    } else {
      this.setState({
        ytdDataLoading: false
      })
    }
  }
  chartPlace = (legendData, seriesData) => {
    var chartDom = document.getElementById(this.props.id);
    var myChart = echarts.init(chartDom);
    chartDom.style.width = 100 + '%';
    myChart.resize();

    var resizeMainContainer = function () {
      chartDom.style.width = 100 + '%';
      // chartDom.style.height = 80 * 0.8 + '%';
      myChart.resize();
    };
    //Set the height and width of the div container
    resizeMainContainer();
    window.addEventListener('resize', function () {
      //Adaptive screen size, reset container height and width
      resizeMainContainer();
      myChart.resize();
    });
    var option;

    /*
       {
  legend: {
    top: 'bottom'
  },
  toolbox: {
    show: true,
    feature: {
      mark: { show: true },
      dataView: { show: true, readOnly: false },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  series: [
    {
      name: 'Nightingale Chart',
      type: 'pie',
      radius: [50, 250],
      center: ['50%', '50%'],
      roseType: 'area',
      itemStyle: {
        borderRadius: 8
      },
      data: [
        { value: 40, name: 'rose 1' },
        { value: 38, name: 'rose 2' },
        { value: 32, name: 'rose 3' },
        { value: 30, name: 'rose 4' },
        { value: 28, name: 'rose 5' },
        { value: 26, name: 'rose 6' },
        { value: 22, name: 'rose 7' },
        { value: 18, name: 'rose 8' }
      ]
    }
  ]
}

    */
    option = {
      title: {
        text: "Brandlock YTD Revenue Recovered",
        subtext: "",
        left: "center",
      },
      color: ["#769ccd", "#374649", "#10b441", "#eec355", "#6f42c1", "#40c107"],
      // color: ["#c23531", "#faad32", "#6f42c1", "#61a0a8", "#d48265", "#eec355", "#374649"],
      tooltip: {
        /*         showContent: true,
                alwaysShowContent: true, */
        trigger: "item",
        // formatter: `{a} <br/>{b} : \${c} ({d}%)`,
        formatter: (params) => {
          // return "No Data Available"
          return parseInt(params.value).toLocaleString('en-US', {
            style: 'currency', currency: this.props.sessionClient.currency, minimumFractionDigits: 0,
            maximumFractionDigits: 0
          });
        },
      },
      legend: {
        orient: "horizontal",
        bottom: "0%",
        data: legendData,

      },
      series: [
        {
          name: "",
          type: "pie",
          radius: "55%",
          center: ["50%", "45%"],
          selectedMode: true,
          selectedOffset: 10,
          //roseType: 'area',
          // roseType: 'radius',
          data: seriesData,
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

    option && myChart.setOption(option);
  };
  render() {
    return (
      <div className={`card ${this.props.className}`}>
        {/* <div className="header">
            <h2>Pie Chart</h2>
          </div> */}
        <div className="body">
          {this.state.ytdDataLoading !== false ?
            <div id={this.props.id} style={{ height: 300 }}></div>
            : <div className="header pt-0 text-center">
              <h2 className="pb-2 ">Brandlock YTD Revenue Recovered</h2>

              <div className="row no_data_row">
                <h3 className="badge no_data_available">No Data Available</h3>
                <img src={no_data_available} width="auto" height="300px" alt="No data available" />
              </div>

            </div>}
          {/* <ReactEcharts
                        option={optionPieEchart}
                        opts={{renderer: 'svg'}} // use svg to render the chart.
                    /> */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  websiteRecordReducer
}) => ({
  sessionClient: websiteRecordReducer.sessionClient,
  websiteRecord: websiteRecordReducer.websiteRecord
});


export default connect(mapStateToProps, {
  websiteRecordAction
})(PieChart);
