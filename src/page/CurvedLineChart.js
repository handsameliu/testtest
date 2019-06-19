/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/prefer-stateless-function */
/* jshint -W054 */
import React from "react";
import { Chart, Geom, Axis, Tooltip, Legend, } from "bizcharts";
import DataSet from "@antv/data-set";
// import Slider from "bizcharts-plugin-slider";

// 血压
class CurvedLineChart extends React.Component {

    constructor(props) { 
        super(props);
        this.state = {};
    }

	sliderChange = (times, ds) => {
		ds.setState("start", times.startValue);
		ds.setState("end", times.endValue);
	}
		
    render() {
		const { height=400, data=[], scale={}, fieldKVs={}, ys=[], startTime, endTime} = this.props;

		// const data = [
		// 	{
		// 		x: "2019-4-28 06:59:04",
		// 		y1: 7.0,
		// 		y2: 3.9
		// 	},
		// ];
		const ds = new DataSet({
			state: {
				start: new Date(startTime).getTime(),
				end: new Date(endTime).getTime()
			}
		});
		const dv = ds.createView().source(data);
		dv.transform({
			type: "fold",
			fields: ys,
			// 展开字段集
			key: "yData",
			// key字段
            value: "temperature",
            // value字段

			// type: "filter",
			// callback(obj) {
			// 	const time = new Date(obj.x).getTime(); // !注意：时间格式，建议转换为时间戳进行比较
			// 	console.log(time);
			// 	return time >= ds.state.start && time <= ds.state.end;
			// }
		});
		// const scale = {
		// 	x: {
		// 	alias: '日期',
		// 	},
		// };
		// console.log(data, scale, fieldKVs, ys, startTime, endTime);
		return (
			<div style={{backgroundColor: '#fff', }}>
				<Chart height={height} data={dv} scale={scale} forceFit padding={{ top: 20, right: 30, bottom: 50, left: 30 }}>
					<Legend 
						position='top' 
						offsetY={10}
						itemFormatter={(val)=>{
							return fieldKVs[val];
						}}
					/>
					<Axis 
						name="x" 
						label={{
							textStyle: {
								// fill: 'red',  // 颜色
								textBaseline: 'top'  // 对齐基线
							},
							formatter: (val) => {
								return `${ val }`
							}
						}}
					/>
					<Axis name="temperature" />
					<Tooltip
						crosshairs={{
							type: "y"
						}}
					/>
					<Geom
						type="line"
						position="x*temperature"
						size={2}
						color={["yData", ['#1890FF', '#2fc25b']]}
						shape="smooth"
						tooltip={
							['yData*temperature*title*unit', (yData, temperature, title, unit) => {
								return {
									name: title || fieldKVs[yData],
									value: (temperature || '') + unit
								}
							}]
						}
					/>
					{/* <Geom 
						type="area" 
						position="x*temperature" 
						color="yData" 
						shape="smooth" 
						tooltip={['yData*temperature', (yData, temperature)=>{
							return {
								name: fieldKVs[yData],
								value: temperature
							}
						}]}
					/> */}
					<Geom
						type="point"
						position="x*temperature"
						size={4}
						color={["yData", ['#1890FF', '#2fc25b']]}
						shape="circle"
						style={{
							stroke: "#fff",
							lineWidth: 1
						}}
						tooltip={
							['yData*temperature*title*unit', (yData, temperature, title, unit) => {
								return {
									name: title || fieldKVs[yData],
									value: (temperature || '') + unit
								}
							}]
						}
					/>
				</Chart>
			</div>
		);
    }
}

export default CurvedLineChart;
