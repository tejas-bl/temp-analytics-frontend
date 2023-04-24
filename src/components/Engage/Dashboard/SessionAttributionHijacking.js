import React from "react";
import * as echarts from "echarts";
import no_data_available from "../../../assets/images/no_data/session_attr_hijacking_no_data_blur.png";

class SessionAttributionHijacking extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            recycleUserData: props.recycleUserData,
            recycleUserDataLoading: true,
        }
    }
    componentDidMount() {
        if (this.props.recycleUserData !== 0 && this.props.recycleUserData !== false && this.props.recycleUserData.hasOwnProperty("fpa_sessions") && parseInt(this.props.recycleUserData.fpa_sessions) > 0 &&
        this.props.recycleUserData.hasOwnProperty("ms_sessions") && parseInt(this.props.recycleUserData.ms_sessions) > 0) {
            this.chartPlace();
        }
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.recycleUserData !== prevProps.recycleUserData) {
            this.setState({
                recycleUserData: this.props.recycleUserData,
                recycleUserDataLoading: false
            })
            if (this.props.recycleUserData !== 0 && this.props.recycleUserData !== false && this.props.recycleUserData.hasOwnProperty("fpa_sessions") && parseInt(this.props.recycleUserData.fpa_sessions) > 0 &&
            this.props.recycleUserData.hasOwnProperty("ms_sessions") && parseInt(this.props.recycleUserData.ms_sessions) > 0) {
                this.chartPlace(this.props.recycleUserData);
            }
        }
    }


    chartPlace = () => {
        var chartDom = document.getElementById(this.props.id);
        var myChart = echarts.init(chartDom);
        var option;
        option = {
            title: {
                text: "Session Attribution Hijacking",
                subtext: "Recycled Session vs First Page Session",
                left: "center",
            },
            color: (this.props.recycleUserData) ? ["#769ccd", "#374649"] : ["#111"],
            tooltip: {
                trigger: "item",
                formatter: (params) => {
                    //return `${parseFloat(params.value)} - ${params.percent}% of Total Affiliate Session ${parseInt((parseInt(params.value) * 100) / parseFloat(params.percent).toFixed(2))}`;
                    return `${parseFloat(params.value)} - ${params.percent}% of Total Affiliate Session`;
                },
                // formatter: "{a} <br/>{b} : {c} ({d}%)",
            },
            legend: {
                orient: "horizontal",
                bottom: "bottom",
                data: [
                    "First Page Session",
                    "Recycled Session",
                ],
            },
            series: [
                {
                    name: "Session Attribution Hijacking",
                    type: "pie",
                    radius: "50%",
                    center: ["50%", "50%"],
                    data: [
                        { value: (this.props.recycleUserData) ? this.props.recycleUserData.fpa_sessions : 0, name: "First Page User Session" },
                        { value: (this.props.recycleUserData) ? this.props.recycleUserData.ms_sessions : 0, name: "Recycled User Session" },
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

        option && myChart.setOption(option);
    };
    render() {
        return (

            <div className={`sessionAtrribution card ${this.props.className}`}>
                <div className="body">
                    {
                        this.props.recycleUserData !== 0 && this.props.recycleUserData !== false && 
                        this.props.recycleUserData.hasOwnProperty("fpa_sessions") && parseInt(this.props.recycleUserData.fpa_sessions) > 0 &&
                        this.props.recycleUserData.hasOwnProperty("ms_sessions") && parseInt(this.props.recycleUserData.ms_sessions) > 0
                        ?
                            <div id={this.props.id} style={{ height: 300 }}></div>

                            : <div className="header pt-0 text-center">
                                <h2 className="pb-2 ">Session Attribution Hijacking </h2>
                                <small>Recycled Session vs First Page Session</small>
                                <div className="row no_data_row">
                                    <h3 className="badge no_data_available">No Data Available</h3>
                                    <img src={no_data_available} width="auto" height="240px" alt="No data available" />
                                </div>

                            </div>
                    }
                </div>
            </div>

        );
    }
}

export default SessionAttributionHijacking;
