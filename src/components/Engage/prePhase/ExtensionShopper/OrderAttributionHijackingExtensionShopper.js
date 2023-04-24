import React from "react";
import * as echarts from "echarts";
import no_data_available from "../../../../assets/images/no_data/session_attr_hijacking_no_data_blur.png";

class OrderAttributionHijackingExtensionShopper extends React.Component {

    componentDidMount() {
        if (parseInt(this.props.impactData.data.oah.fpa_orders) > 0 && parseInt(this.props.impactData.data.oah.mpa_orders) > 0) {
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
                text: "Order Attribution Hijacking",
                subtext: "Recycled Affiliate vs Organic Affiliate Orders",
                left: "center",
            },
            color: ["#769ccd", "#374649"],
            tooltip: {
                trigger: "item",
                formatter: (params) => {
                    return `${parseFloat(params.value)} - ${params.percent}% of Total Affiliate Order`;
                },
            },
            legend: {
                orient: "horizontal",
                bottom: "bottom",
                data: [
                    "Organic Affiliate Orders",
                    "Recycled Affiliate Orders",
                ],
            },
            series: [
                {
                    name: "Order Attribution Hijacking",
                    type: "pie",
                    radius: "50%",
                    center: ["50%", "50%"],
                    data: [
                        { value: (data.oah.fpa_orders !== null) ? data.oah.fpa_orders : 0, name: "Organic Affiliate Orders" },
                        { value: (data.oah.mpa_orders !== null) ? data.oah.mpa_orders : 0, name: "Recycled Affiliate Orders" },
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

                        parseInt(data.oah.fpa_orders) > 0 &&
                            parseInt(data.oah.mpa_orders) > 0
                            ?
                            <div id={this.props.id} style={{ height: 300 }}></div>
                            : <div className="header pt-0 text-center">
                                <h2 className="pb-2 ">Order Attribution Hijacking </h2>
                                <small>Recycled Affiliate vs Organic Affiliate Orders</small>
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

export default OrderAttributionHijackingExtensionShopper;
