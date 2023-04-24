import React from "react";
import * as echarts from "echarts";
import no_data_available from "../../../../assets/images/no_data/session_attr_hijacking_no_data_blur.png";

class SessionAttributionHijackingExtensionShopper extends React.Component {

    componentDidMount() {
        if (parseInt(this.props.impactData.data.sah.fpa_sessions) > 0 && parseInt(this.props.impactData.data.sah.mpa_sessions) > 0) {
            this.chartPlace();
        }
    }

    chartPlace = () => {
        var chartDom = document.getElementById(this.props.id);
        const data = this.props.impactData.data;
        var myChart = echarts.init(chartDom);
        var option;
        option = {
            title: {
                text: "Session Attribution Hijacking",
                subtext: "Recycled Affiliate vs Organic Affiliate Sessions",
                left: "center",
            },
            color: ["#769ccd", "#374649"],
            tooltip: {
                trigger: "item",
                formatter: (params) => {
                    return `${parseFloat(params.value)} - ${params.percent}% of Total Affiliate Session`;
                },
            },
            legend: {
                orient: "horizontal",
                bottom: "bottom",
                data: [
                    "Organic Affiliate Sessions",
                    "Recycled Affiliate Sessions",
                ],
            },
            series: [
                {
                    name: "Session Attribution Hijacking",
                    type: "pie",
                    radius: "50%",
                    center: ["50%", "50%"],
                    data: [
                        { value: (data.sah.fpa_sessions !== null) ? data.sah.fpa_sessions : 0, name: "Organic Affiliate Sessions" },
                        { value: (data.sah.mpa_sessions !== null) ? data.sah.mpa_sessions : 0, name: "Recycled Affiliate Sessions" },
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
        const data = this.props.impactData.data !== undefined && this.props.impactData.data !== null ? this.props.impactData.data : null;
        return (

            <div className={`sessionAtrribution card`}>
                <div className="body">
                    {
                        data !== null && parseInt(data.sah.fpa_sessions) > 0 &&
                            parseInt(data.sah.mpa_sessions) > 0
                            ?
                            <div id={this.props.id} style={{ height: 300 }}></div>
                            : <div className="header pt-0 text-center">
                                <h2 className="pb-2 ">Session Attribution Hijacking </h2>
                                <small>Recycled Affiliate vs Organic Affiliate Sessions</small>
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

export default SessionAttributionHijackingExtensionShopper;
