import React from "react";
import * as echarts from "echarts";

class SourceFlow extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sourcFlowDataData: props.sourcFlowData,
            sourcFlowDataDataLoading: true,
        }
    }
    async componentDidMount() {
        const sourceFLowData = this.props.sourceFlowData

        if (sourceFLowData !== undefined && sourceFLowData !== false &&
            sourceFLowData.hasOwnProperty("linksData") && sourceFLowData.linksData.length) {
            const linksData = sourceFLowData.linksData
            const labelsData = sourceFLowData.labelsData
            this.chartPlace(linksData, labelsData);
        }
    }

    chartPlace = (linksData = [], labelsData = []) => {
        var chartDom = document.getElementById(this.props.id);
        var myChart = echarts.init(chartDom);
        var option;
        option = {
            title: {
                //text: this.props.title,
                subtext: "",
                left: "center",
            },
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
            },
            series: {
                type: 'sankey',
                top: 50.0,
                nodeGap: 20,
                data: labelsData,
                links: linksData,
                label: {
                    color: 'rgba(0,0,0,0.7)',
                    fontFamily: 'Arial',
                    fontSize: 12,
                    padding: 3
                },

                emphasis: {
                    disabled: false,
                    focus: 'adjacency'
                },
                lineStyle: {
                    color: 'source',
                    curveness: 0.5
                },
            }
        };
        option && myChart.setOption(option);
    };
    render() {
        return (
            <div className={`card`}>
                <div className="body" style={{ height: 'auto' }}>
                    <div id={this.props.id} style={{ height: this.props.graphHeight < 500 ? '500px' : `${this.props.graphHeight}px` }}></div>
                </div>
            </div>
        );
    }
}

export default SourceFlow;
