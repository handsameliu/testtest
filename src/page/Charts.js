import React, { Component, Fragment, } from 'react';
import { Icon, Card, Row, Col, List, Form, Button, DatePicker, PageHeader, Typography, Table, message, } from 'antd';
import LineofdashedChart from './LineofdashedChart';
import CurvedLineChart from './CurvedLineChart';
import { addMonth } from '../utils/utils';
import moment from 'moment';
import axios from '../utils/axios';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Text } = Typography;
const dateFormat = 'YYYY/MM/DD';
const REG = /^2\d{2}$/
const requestTitles = {
    bloodSugarBeforeSleep: '睡前血糖',
    bloodSugarRandom: '随机血糖',
    bloodSugarAfterDinner2H: '晚餐餐后两小时血糖',
    bloodSugarBeforeDinner: '晚餐餐前血糖',
    bloodSugarAfterLunch2H: '午餐餐后两小时血糖',
    bloodSugarBeforeLunch: '午餐餐前血糖',
    bloodSugarAfterBreakfast2H: '早餐餐后两小时血糖',
    bloodSugarBeforeBreakfast: '早餐餐前血糖',
    diastolicBloodPressure: '舒张压',
    systolicBloodPressure: '收缩压',
};

export default class Charts extends Component { 
    constructor (props) { 
        super(props);
        const nowTime = new Date();
        const lastTime = addMonth(nowTime, -1); // new Date(nowTime.getTime() - 86400000); // 
        this.state = {
            token: props.token,
            start_at: lastTime,
            end_at: nowTime,
            dateTimes: [], // 数据分布的展示时间
            userDeviceDatas: {},
            isDiagnosed: false,
        };
    }

    componentDidMount () { }

    componentWillUnmount () { }

    filterChartData = (data) => {
        if (!(data && Object.keys(data).length)) {
            return [];
        }
        const { params } = this.props;
        let charData = [];
        // console.log(data);
        Object.keys(data).forEach((key, index) => {
            const item = data[key];
            // console.log(index, item);
            if (params.key.indexOf('bloodSugar') === 0) {
                item.times.forEach((time, iindex) => {
                    const tempObj = {};
                    tempObj.time = time;
                    tempObj.x = new Date(time).getTime();
                    // tempObj.title = item.title;
                    tempObj.unit = item.unit;
                    // tempObj[`y${index+1}`] = item.datas[iindex]*1;
                    // console.log(key, item.title);
                    if (key.indexOf('bloodSugarBefore') === 0) {
                        tempObj.y1 = item.datas[iindex] * 1;
                        tempObj.y1Title = item.title;
                        tempObj.y2 = 0;
                        tempObj.y2Title = '';
                    } else if (key.indexOf('bloodSugarAfter') === 0) {
                        tempObj.y2 = item.datas[iindex] * 1;
                        tempObj.y2Title = item.title;
                        tempObj.y1 = 0;
                        tempObj.y1Title = '';
                    }
                    charData.push(tempObj);
                })
            } else {
                // if (index === 0) {
                    item.times.forEach((time, iindex) => {
                        let tempObj = {};
                        tempObj.time = time;
                        tempObj.x = new Date(time).getTime();
                        // tempObj.title = item.title;
                        tempObj.unit = item.unit;
                        if (index !== 0) {
                            let temp = charData.find((dd) => { return dd.time === time });
                            if (temp) {
                                tempObj = temp;
                            }
                        }
                        if (key === 'diastolicBloodPressure') {
                            tempObj.y2 = item.datas[iindex] * 1;
                        } else if (key === 'systolicBloodPressure') {
                            tempObj.y1 = item.datas[iindex] * 1;
                        } else {
                            tempObj[`y${index + 1}`] = item.datas[iindex] * 1;
                        }
                        // console.log(tempObj);
                        charData.push(tempObj);
                    });
                // } else {
                //     charData = charData.map((obj, iindex) => {
                //         obj[`y${index+1}`] = item.datas[iindex]*1;
                //         return obj;
                //     });
                // }
            }
        });
        // const dataLength = Object.keys(data).length;
        // if (params.key.indexOf('bloodSugar') === 0) {
        //     charData = charData.map((item) => {
        //         let temp = item;
        //         for (let i = 0; i < dataLength; i++) {
        //             if (!item[`y${i+1}`]) {
        //                 temp[`y${i+1}`] = 0;
        //             }
        //         }
        //         return temp;
        //     })
        // }
        // console.log(charData);
        return charData.sort((a, b) => {
            return  a.x - b.x;
        });
    }

    filterTitleMap = (data) => {
        let titles = {};
        const { params } = this.props;
        if (params.key.indexOf('bloodSugar') === 0) { // 血糖
            titles.y1 = '餐前';
            titles.y2 = '餐后';
        } else if (params.key.indexOf('BloodPressure') >= 0) { // 血压
            titles.y1 = '收缩压';
            titles.y2 = '舒张压';
        } else { 
            Object.keys(data).forEach((key, index) => {
                const item = data[key];
                titles[`y${index+1}`] = item.title;
            });
        }
        // console.log(titles);
        return titles;
    }

    filterChartScale = (data) => {
        const scale = {
            x: {
                alias: '时间',
                type: "timeCat",
                mask: "MM/DD HH:mm"
            }
        };
        Object.keys(data).forEach((key) => {
            scale[key] = {alias: data[key]};
        })
        return scale;
    }

    filterChartYs = (data) => {
        return Object.keys(data).map((key) => { return key });
    }

    filterBloodSugerChartData = (data) => {
        if (!(data && Object.keys(data).length)) {
            return [];
        }
        let charDataBefore = [];
        let charDataAfter = [];
        // console.log(data);
        Object.keys(data).forEach((key) => {
            const item = data[key];
            // console.log(index, item);
            item.times.forEach((time, iindex) => {
                const tempObj = {};
                tempObj.time = time;
                tempObj.x = new Date(time).getTime();
                tempObj.unit = item.unit;
                tempObj.title = item.title;
                if (key.indexOf('bloodSugarBefore') === 0) {
                  tempObj.y1 = item.datas[iindex] * 1;
                    charDataBefore.push(tempObj);
                } else if (key.indexOf('bloodSugarAfter') === 0) {
                  tempObj.y2 = item.datas[iindex] * 1;
                    charDataAfter.push(tempObj);
                }
            })
        });
        charDataBefore = charDataBefore.sort((a, b) => {
            return a.x - b.x;
        });
        charDataAfter = charDataAfter.sort((a, b) => {
            return a.x - b.x;
        })
        // console.log(charDataBefore, charDataAfter);
        return { charDataBefore, charDataAfter };
    }

    searchInfo = (e) => {
        e.preventDefault && e.preventDefault();
        const { params } = this.props;
        this.setState({ userDeviceDatas: {}, });
        const data = {};
        const time = {};
        const { dateTimes } = this.state;
        console.log(dateTimes);
        const temp = dateTimes;
        data.started_at = temp[0].format('YYYY.MM.DD');
        data.ended_at = temp[1].format('YYYY.MM.DD');
        time.started_at = (new Date(data.started_at).getTime())/1000;
        time.ended_at = (new Date(`${data.ended_at} 23:59:59`).getTime()) / 1000;
        this.setState({
            dateTimes: {
                started_at: data.started_at,
                ended_at: data.ended_at
            }
        });
        if (params.key === 'systolicBloodPressure' || params.key === 'diastolicBloodPressure') {
            this.getLineChart('systolicBloodPressure', time);
            this.getLineChart('diastolicBloodPressure', time);
        } else if (params.key.indexOf('bloodSugar') === 0) {
            // 只统计餐前和餐后的做为对比项
            // this.getLineChart('bloodSugarRandom', time); 
            // this.getLineChart('bloodSugarBeforeSleep', time);
            this.getLineChart('bloodSugarBeforeBreakfast', time);
            this.getLineChart('bloodSugarAfterBreakfast2H', time);
            this.getLineChart('bloodSugarBeforeLunch', time);
            this.getLineChart('bloodSugarAfterLunch2H', time);
            this.getLineChart('bloodSugarBeforeDinner', time);
            this.getLineChart('bloodSugarAfterDinner2H', time);
        } else {
            this.getLineChart(params.key, time);
        }
    }

    getLineChart = (key, data) => {
        const { params } = this.props;
        axios.get('/v1/user-device-datas', {
            params: {
                title: requestTitles[key] || '',
                uid: params.uid,
                item_key: key,
                started_at: data.started_at,
                ended_at: data.ended_at,
                page: 1,
                'per-page': 100,
            },
            timeout: 10000,
            withCredentials:true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${params.token}`,
            }, 
        }).then((result) => {
            console.log(result);
            // Toast.hide();
            if (!REG.test(result.status)) {
                // cuowu
                // Toast.error('没有对应的数据');
            } else {
                // 成功
                result = result.data;
                const datas = [];
                const times = [];
                result.reverse().forEach((item) => {
                    datas.push(item.item_value);
                    times.push(item.created_at);
                    // times.push(moment(item.created_at).format('YYYY/MM/DD'));
                });
                let resUserDeviceDatas =  {
                    [key]: {
                        title: result[0] ? result[0].item_key_cn : '',
                        unit: result[0] ? result[0].item_unit : '',
                        datas,
                        times,
                    }
                }
                const { userDeviceDatas } = this.state;
                this.setState({
                    userDeviceDatas: {...userDeviceDatas, ...resUserDeviceDatas}
                })
            }
        }).catch((err) => {
            // Toast.hide();
            console.warn('上传设备数据', err);
        })
    }

    handleRangeDisabledDate = (time) => {
        if (time) { 
            return time > moment();
        }
        return false;
    }

    render () { 
        const { chartType, height, params, } = this.props;
        const { userDeviceDatas, } = this.state;
        const formItemLayout = {
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24 },
                md: { span: 20 },
            },
        };
        let chartData = [];
        chartData = this.filterChartData(userDeviceDatas);
        let titleMap = [];
        titleMap = this.filterTitleMap(userDeviceDatas);
        let chartScale = {};
        chartScale = this.filterChartScale(titleMap);
        let chartYs = {};
        chartYs = this.filterChartYs(titleMap);
        let bloodSugerChartData = {};
        bloodSugerChartData = this.filterBloodSugerChartData(userDeviceDatas);
        // console.log(bloodSugerChartData);
        return (
            <Fragment>
                <Card bordered={false}>
                    <Form layout="inline" onSubmit={this.searchInfo}>
                        <div>
                            <Row type="flex" justify="space-around" align="middle">
                                <Col span={24}>
                                    <FormItem label="时间范围" {...formItemLayout}>
                                        {
                                            <RangePicker 
                                                format="YYYY-MM-DD"
                                                size="large"
                                                disabledDate={this.handleRangeDisabledDate}
                                                defaultValue={[moment(this.state.start_at, dateFormat), moment(this.state.end_at, dateFormat),]}
                                                onChange={(dates, dateString) => { 
                                                    this.setState({
                                                        dateTimes: dates
                                                    })
                                                }}
                                            />
                                        }
                                        <Button style={{marginLeft: 15}} ref={(ref)=>{this.submigRef = ref}} type="primary" htmlType="submit">查询</Button>
                                    </FormItem>
                                </Col>
                            </Row>
                        </div>
                    </Form>
                </Card>
                {
                    Object.keys(chartData).length > 0 && Object.keys(titleMap).length > 0 && params.key.indexOf('bloodSugar') === 0 ? (
                        <LineofdashedChart
                            startTime={this.state.start_at}
                            endTime={this.state.end_at}
                            data={bloodSugerChartData}
                            scale={chartScale}
                            fieldKVs={titleMap}
                            ys={chartYs}
                        />
                    ) : (
                        <CurvedLineChart
                            startTime={this.state.start_at}
                            endTime={this.state.end_at}
                            data={chartData}
                            scale={chartScale}
                            fieldKVs={titleMap}
                            ys={chartYs}
                        />
                    )
                }
            </Fragment>
        )
    }
}