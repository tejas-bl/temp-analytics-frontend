import React from "react";
import * as echarts from "echarts";
class AffiliatePayoutLostExtensionShopper extends React.Component {

    componentDidMount() {
        this.chartPlace();
    }

    chartPlace = () => {
        const { id } = this.props;
        var chartDom = document.getElementById("main" + id);
        var myChart = echarts.init(chartDom);
        var option;
        option = {
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
                    data: [5, 6, 9, 2, 3, 6, 8, 5],
                    areaStyle: {
                        color: "#769ccd",
                    },
                    itemStyle: {
                        color: "#769ccd",
                    },
                    symbolSize: 1,
                },
            ],
        };
        option && myChart.setOption(option);
    };

    render() {
        const { revenue_lost } = this.props.impactData.data;
        const industryStd  = this.props.impactData.industryStd;
        const dayCount = this.props.impactData.dayCount.length && this.props.impactData.dayCount[0].hasOwnProperty('days_with_cashback_count')  ? this.props.impactData.dayCount[0].days_with_cashback_count * 1 : "";
        return (
            <div>
                <div className={`card overflowhidden number-chart text-center`}>
                    <div className="body">
                        <div className="header pt-0 text-center">
                            <h2 className="pb-2 ">
                                Revenue falsely attributed to affiliate extensions 
                                {industryStd !== null && industryStd ? <span className="text-muted industryAvg"> (Based on Industry Avg.)</span> : ""}
                            </h2>
                        </div>

                        {dayCount < 30 && revenue_lost !== undefined && revenue_lost.hasOwnProperty('actual') && revenue_lost.actual !== 0 && revenue_lost.actual !== undefined ? 
                        <><div className="number revenueLost pt-2">
                            {revenue_lost.actual}
                            <span className="daysMessage">({dayCount} days falsely attributed revenue)</span>
                            <hr />
                        </div>
                        <div className="number revenueLost pb-2">
                            {revenue_lost.projected}
                            <span className="daysMessage">(projected for 30 days)</span>
                        </div>
                        </> : dayCount >= 30 && revenue_lost !== undefined && revenue_lost.hasOwnProperty('actual') && revenue_lost.actual !== 0 && revenue_lost.actual !== null ? <div className="number revenueLost pt-5 pb-5">
                            {revenue_lost.actual}
                            <span className="daysMessage">({dayCount} days falsely attributed revenue)</span>
                        </div> : industryStd && revenue_lost !== undefined && revenue_lost.hasOwnProperty('projected') && revenue_lost.projected !== 0 && revenue_lost.projected !== null ? <div className="number revenueLost pt-5 pb-5">
                            {revenue_lost.projected}
                            <span className="daysMessage">(projected for 30 days)</span>
                        </div> : <span className="badge badge-info mt-3">NO DATA AVAILABLE</span>
                        }


                    </div>
                    <div
                        id={"main" + this.props.id}
                        className="sparkline"
                        style={{ width: "100%", height: 70 }}
                    ></div>
                </div>
            </div>
        );
    }
}

export default AffiliatePayoutLostExtensionShopper;
