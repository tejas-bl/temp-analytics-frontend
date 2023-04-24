import React from "react";
import * as echarts from "echarts";
import no_data_available from '../../../assets/images/no_data/sourceFlow__no_data_blur.png'
import { getColor } from '../../../helper/Utils'
import HighlightSection from "../../HighlightSection";

class SessionAttributionHijackingSourceFlow extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sessionHijackSourceFlowData: props.sessionHijackSourceFlow,
            sessionHijackSourceFlowDataLoading: true,
        }
    }

    createLinksLabels(labels) {
        let data = [];
        labels.map((l) => {
            if (l.distinct_value !== null && l.distinct_value !== '') {
                const color = getColor();
                data.push({
                    name: l.distinct_value,
                    itemStyle: {
                        color: color,
                        borderColor: color
                    }
                })
            }
        })
        return data;
    }
    createLinksData(links) {
        let data = [];
        links.map((l) => {
            if (l.source !== null && l.source !== '' && l.mid_page_publisher !== null && l.mid_page_publisher !== '' && l.mid_page_publisher !== l.source) {
                data.push({
                    source: l.source,
                    target: l.mid_page_publisher,
                    value: parseInt(l.sessions)
                })
            }
        })
        return data;
    }
    async componentDidMount() {
        const sourceFLowData = this.props.sessionHijackSourceFlow
        if (sourceFLowData !== undefined && sourceFLowData !== false &&
            sourceFLowData.hasOwnProperty("data") && sourceFLowData.data.sessionHijackSourceFlowData.length) {
            const linksData = await this.createLinksData(sourceFLowData.data.sessionHijackSourceFlowData)
            const labelsData = await this.createLinksLabels(sourceFLowData.data.distinctSourcFlowData)
            this.chartPlace(linksData, labelsData);
        }
    }


    chartPlace = (linksData = [], labelsData = []) => {
        var chartDom = document.getElementById("SessionAttributionHijackingSourceFlow");
        var myChart = echarts.init(chartDom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var option;
        option = {
            title: {
                text: "Attribution Hijacking",
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
            <div className={`card AttributionHijacking`}>
                <HighlightSection location={this.props.location} placement="left" highlightSectionId="AttributionHijacking" target={this.props.locationObject.hash} />
                <div className="body" style={{ height: 'auto' }}>

                    {
                        this.props.sessionHijackSourceFlow !== undefined && this.props.sessionHijackSourceFlow !== false &&
                            this.props.sessionHijackSourceFlow.hasOwnProperty("data") &&
                            this.props.sessionHijackSourceFlow.data.sessionHijackSourceFlowData.length
                            ?
                            <div id={"SessionAttributionHijackingSourceFlow"} style={{ height: '500px' }}></div>
                            :
                            <div className="header pt-0 text-center">
                                <h2 className="pb-2 ">Attribution Hijacking</h2>
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

export default SessionAttributionHijackingSourceFlow;
