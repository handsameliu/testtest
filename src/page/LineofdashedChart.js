/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/prefer-stateless-function */
/* jshint -W054 */
import React from "react";
import { Chart, Geom, Axis, Tooltip, Legend, View, Coord, } from "bizcharts";
// import DataSet from "@antv/data-set";
// import Slider from "bizcharts-plugin-slider";

// 血糖
class Lineofdashed extends React.Component {

    constructor(props) { 
        super(props);
        this.state = {};
        this.chart = null;
    }

    render() {
        const { height = 400, data = {}, scale={}, fieldKVs={}, ys=[], startTime, endTime} = this.props;
        // console.log(data, scale, fieldKVs, ys, startTime, endTime);
		return (
			<div style={{backgroundColor: '#fff', }}>
                <Chart
                    height={height}
                    scale={scale}
                    forceFit
                    padding={[50, 30, 50, 30]}
                    onGetG2Instance={
                        g2Chart => {
                            g2Chart.animate(false);
                            this.chart = g2Chart;
                        }
                    }
                >
                    <Legend
                        position='top'
                        custom
                        items={
                            [{
                                value: "餐前",
                                marker: {
                                    symbol: "circle",
                                    fill: "l(100) 0:#fefcf2 1:#f3d028",
                                    radius: 5
                                }
                            },
                            {
                                value: "餐后",
                                marker: {
                                    symbol: "circle",
                                    fill: "l(100) 0:#d5f2f5 1:#5fced8",
                                    radius: 5
                                }
                            }]
                        }
                        onClick={
                            (ev) => {
                                const item = ev.item;
                                const value = item.value;
                                const checked = ev.checked;
                                const geoms = this.chart.getAllGeoms();
                                for (let i = 0; i < geoms.length; i++) {
                                    const geom = geoms[i];
                                    if (geom.getYScale().alias === value) {
                                        if (checked) {
                                            geom.show();
                                        } else {
                                            geom.hide();
                                        }
                                    }
                                }
                            }
                        }
                    />
                    <Tooltip />
                    <Coord />
                    <View data={data.charDataBefore} scale={scale} forceFit>
                        <Axis name="x" grid={null} />
                        <Geom
                            type="line"
                            position="x*y1"
                            size={2}
                            color='#f3d028'
                            shape='circle'
                            tooltip={
                                ['y1*unit*title', (y1, unit, title) => {
                                    return {
                                        name: title,
                                        value: (y1 + unit) || ''
                                    }
                                }]
                            }
                        />
                        <Geom
                            type="point"
                            position="x*y1"
                            size={4}
                            color='#f3d028'
                            shape='circle'
                            style={{
                                stroke: "#fff",
                                lineWidth: 1
                            }}
                            tooltip={
                                ['y1*unit*title', (y1, unit, title) => {
                                    return {
                                        name: title,
                                        value: (y1 + unit) || ''
                                    }
                                }]
                            }
                        />
                    </View>
                    <View data={data.charDataAfter} scale={scale} forceFit>
                        <Geom
                            type="line"
                            position="x*y2"
                            size={2}
                            color='#5fced8'
                            shape='circle'
                            tooltip={
                                ['y2*unit*title', (y2, unit, title) => {
                                    return {
                                        name: title,
                                        value: (y2 + unit) || ''
                                    }
                                }]
                            }
                        />
                        <Geom
                            type="point"
                            position="x*y2"
                            size={4}
                            color='#5fced8'
                            shape='circle'
                            style={{
                                stroke: "#fff",
                                lineWidth: 1
                            }}
                            tooltip={
                                ['y2*unit*title', (y2, unit, title) => {
                                    return {
                                        name: title,
                                        value: (y2 + unit) || ''
                                    }
                                }]
                            }
                        />
                    </View>
                </Chart>
			</div>
		);
    }
}

export default Lineofdashed;
