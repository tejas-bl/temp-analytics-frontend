import React from 'react';
import * as echarts from 'echarts';

class MaliciousScriptCountsCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			updateData: [ ...this.props.mainData ],
			DataX: [ 5, 5, 5, 5, 5, 5 ]
		};
	}

	componentDidMount() {
		this.timeoutID = undefined;
		this.ploatData(this.props.mainData);
		this.setState({
			updateData: [ ...this.props.mainData ]
		});
		this.chartPlace();
	}

	ploatData = (data) => {
		var reData = [];
		data.map(() => {
			reData.push(Math.floor(Math.random() * 10) + 1);
		});
		this.setState({ updateData: [ ...reData ] });
	};

	chartPlace = () => {
		const { chartColor, mainData, index } = this.props;
		var chartDom = document.getElementById('MaliciousScriptCountsCard' + index);
		var myChart = echarts.init(chartDom);
		var option;
		option = {
			grid: {
				left: 0,
				bottom: 0,
				top: 5,
				right: 0
			},
			xAxis: [
				{
					type: 'category',
					boundaryGap: false,
					axisLine: {
						show: false
					},
					animation: {
						duration: 300,
						easing: 'cubicOut'
					},
					data: [ 0, 1, 2, 3, 4, 5 ]
				}
			],
			yAxis: [
				{
					type: 'value',
					splitLine: { show: false },
					axisLine: {
						show: false
					},
					axisLabel: {
						show: false
					},
					data: [ 0, 2, 4, 6, 8, 10 ]
				}
			],
			series: [
				{
					type: 'line',
					data: mainData ? this.state.updateData : [ 5, 6, 9, 2, 3, 6, 8, 5 ],
					areaStyle: {
						color: chartColor ? chartColor : '#769ccd'
					},
					itemStyle: {
						color: chartColor ? chartColor : '#769ccd'
					},
					symbolSize: 1
				}
			]
		};
		option && myChart.setOption(option);
	};

	componentWillUnmount() {
		clearTimeout(this.timeoutID);
	}

	render() {
		return (
			// <div className="col-lg-4 col-md-4">
				<div className="card text-center shield_100_card malScriptCountDiv">
					<div className="header pb-0">
						<h2>Malicious Scripts Count</h2>
						<hr />
					</div>
					<div className="body pt-0">
						<div className="number badge badge-info text-secondary">
							<h3>
								<strong>
										{!this.props.topMaliciousScriptsLoading &&
										this.props.topMaliciousScripts !== undefined && this.props.topMaliciousScripts.hasOwnProperty('is_blocked') && this.props.topMaliciousScripts.is_blocked !== null ?
										parseInt(this.props.topMaliciousScripts.is_blocked).toLocaleString(undefined, {minimumFractionDigits: 0,
											maximumFractionDigits: 0
										}) : 0 }
								</strong>
							</h3>
						</div>
					</div>
					<div
						id={'MaliciousScriptCountsCard' + this.props.index}
						className="sparkline"
						style={{ width: '100%', height: this.props.BlockHeight }}
					/>
				</div>
			// </div>
		);
	}
}

export default MaliciousScriptCountsCard;
