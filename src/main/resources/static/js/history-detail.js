const projectName="/Distributed/"

let devLevel=[],devBattery=[],devHumidity=[],devTemperature=[],updateTime=[],warnLine=[],pointLine=[]
let transitionTime=300

const macStatusValueChinese=['电量','温度','湿度']
let macStatusValue=[]
let labelMeasure=['%','°C','%']

let devId=$("#devId").text()

let setChartInterval=null

//日期格式化
function timeStampString(time){
    var datetime = new Date(time);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    var date = datetime.getDate() < 10? "0" + datetime.getDate() : datetime.getDate();
    var hour = datetime.getHours()< 10 ? "0" + datetime.getHours() : datetime.getHours();
    var minute = datetime.getMinutes()< 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    var second = datetime.getSeconds()< 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
    return hour + ":" + minute+":"+second;
}

$(()=>{

    $.ajax({
        url: projectName+"dev/getDevStatusMapByIndex",
        dataType: 'JSON',
        method: "post",
        contentType: "application/x-www-form-urlencoded",
        async: false,
        data: {
            devId: devId,
            index: 40
        },
        success:(res)=>{
            for (const devStatus of res) {
                devLevel.push(devStatus.level)
                devTemperature.push(devStatus.temperature)
                devHumidity.push(devStatus.humidity)
                devBattery.push(devStatus.battery)
                updateTime.push(timeStampString(devStatus.upload_time))
            }
            macStatusValue.unshift(devBattery[devBattery.length-1])
            macStatusValue.unshift(devTemperature[devTemperature.length-1])
            macStatusValue.unshift(devHumidity[devHumidity.length-1])
            setChart()
        },
        fail:(err)=>{
            console.log(err.data)
        }
    })

})

function setChart(){
    const myFirstLineChart = echarts.init(document.getElementById("myFirstEcharts"));
    const mySecondLineChart = echarts.init(document.getElementById("mySecondEcharts"));
    const myThirdEcharts = echarts.init(document.getElementById("myThirdEcharts"));
    const myBarEcharts = echarts.init(document.getElementById("macStatus"));

    window.addEventListener('resize',()=>{
        myFirstLineChart.resize()
        mySecondLineChart.resize()
        myThirdEcharts.resize()
        myBarEcharts.resize()
    })

    let option1={
        visualMap:[
            {
                dimension: 0,
                show:false,
                splitNumber: 2,
                pieces:[],
                inRange: {
                    color: '#29bf83'
                },
                outOfRange:{
                    color :'red'
                },
                seriesIndex: 0
            },
            {
                dimension: 0,
                show:false,
                splitNumber: 2,
                pieces:[],
                inRange: {
                    color: 'rgb(176,151,243)'
                },
                outOfRange:{
                    color: 'rgb(176,151,243)'
                },
                seriesIndex: 1
            },
        ],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                },
            },
            formatter: (params)=>{
                for (let i = 0; i < params.length; i++) {
                    let str=''
                    for (let j = 0; j < option1.series[0].data.length; j++) {
                        str="<div>"+updateTime[params[i].dataIndex] +"</div>"
                            +"<div style='width: 10px;height: 10px;display: inline-block;background-color:#29bf83 '></div> 水位:"+devLevel[params[i].dataIndex]+"mm"+"<br/>"
                    }
                    return str
                }
            }
        },
        legend: {
            data: ['水位'],
            left:"5%",
            textStyle:{
                fontSize:'12'
            }
        },
        toolbox: {
            right:'5%',
            feature: {
                saveAsImage: {
                    title:'保存',
                }
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true, //grid大小是否包含左侧的label
            position: 'center'
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: updateTime,
                axisLabel:{
                    interval: 1,
                    // formatter: (value)=>{
                    //     return timeStampString(new Date(value))
                    // }
                },
                axisPointer:{
                    label:{
                        show: false
                    }
                },
                //x轴线颜色
                axisLine:{
                    lineStyle:{
                        color:'#29bf83',
                        fontSize: 12,
                        fontWeight: 700
                    }
                },
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '水位',
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color:'#3f3f3f',
                        fontSize: 12
                    },

                }
            }
        ],
        series: [
            {
                name: '水位',
                type: 'line',
                // stack: 'Total',
                smooth:true,
                emphasis: {
                    focus: 'series'
                },
                yAxisIndex: 0,
                data: devLevel,
                //填充颜色设置
                areaStyle:{
                    color: new echarts.graphic.LinearGradient(
                        0,0,0,1,
                        [
                            {
                                offset:0,
                                color:'#29bf83',//渐变色的起始颜色
                            },
                            {
                                offset: 0.95,
                                color: '#0c89da'
                            }
                        ],
                        false
                    ),
                    shadowColor:"rgba(0,0,0,0.1)"
                },
                itemStyle: {
                    color: '#29bf83'
                },
                animation:true,
                animationDuration: transitionTime,
                animationEasing: 'liner',
            },

        ]
    }
    let option2={
        visualMap:[
            {
                dimension: 0,
                show:false,
                splitNumber: 2,
                pieces:[],
                inRange: {
                    color: '#29bf83'
                },
                outOfRange:{
                    color :'red'
                },
                seriesIndex: 0
            },
            {
                dimension: 0,
                show:false,
                splitNumber: 2,
                pieces:[],
                inRange: {
                    color: 'rgb(176,151,243)'
                },
                outOfRange:{
                    color: 'rgb(176,151,243)'
                },
                seriesIndex: 1
            },
        ],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                },
            },
            formatter: (params)=>{
                for (let i = 0; i < params.length; i++) {
                    let str=''
                    for (let j = 0; j < option1.series[0].data.length; j++) {
                        str="<div>"+updateTime[params[i].dataIndex] +"</div>"
                            +"<div style='width: 10px;height: 10px;display: inline-block;background-color:#29bf83 '></div> 温度:"+devTemperature[params[i].dataIndex]+"°C"+"<br/>"
                    }
                    return str
                }
            }
        },
        legend: {
            data: ['温度'],
            left:"5%",
            textStyle:{
                fontSize:'12'
            }
        },
        toolbox: {
            right:'5%',
            feature: {
                saveAsImage: {
                    title:'保存',
                }
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true, //grid大小是否包含左侧的label
            position: 'center'
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: updateTime,
                axisLabel:{
                    interval: 1,
                    // formatter: (value)=>{
                    //     return timeStampString(new Date(value))
                    // }
                },
                axisPointer:{
                    label:{
                        show: false
                    }
                },
                //x轴线颜色
                axisLine:{
                    lineStyle:{
                        color:'#29bf83',
                        fontSize: 12,
                        fontWeight: 700
                    }
                },
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '温度',
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color:'#3f3f3f',
                        fontSize: 12
                    },

                }
            }
        ],
        series: [
            {
                name: '温度',
                type: 'line',
                // stack: 'Total',
                smooth:true,
                emphasis: {
                    focus: 'series'
                },
                yAxisIndex: 0,
                data: devTemperature,
                //填充颜色设置
                areaStyle:{
                    color: new echarts.graphic.LinearGradient(
                        0,0,0,1,
                        [
                            {
                                offset:0,
                                color:'#29bf83',//渐变色的起始颜色
                            },
                            {
                                offset: 0.95,
                                color: '#0c89da'
                            }
                        ],
                        false
                    ),
                    shadowColor:"rgba(0,0,0,0.1)"
                },
                itemStyle: {
                    color: '#29bf83'
                },
                animation:true,
                animationDuration: transitionTime,
                animationEasing: 'liner',
            },

        ]
    }
    let option3={
        visualMap:[
            {
                dimension: 0,
                show:false,
                splitNumber: 2,
                pieces:[],
                inRange: {
                    color: '#29bf83'
                },
                outOfRange:{
                    color :'red'
                },
                seriesIndex: 0
            },
            {
                dimension: 0,
                show:false,
                splitNumber: 2,
                pieces:[],
                inRange: {
                    color: 'rgb(176,151,243)'
                },
                outOfRange:{
                    color: 'rgb(176,151,243)'
                },
                seriesIndex: 1
            },
        ],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                },
            },
            formatter: (params)=>{
                for (let i = 0; i < params.length; i++) {
                    let str=''
                    for (let j = 0; j < option1.series[0].data.length; j++) {
                        str="<div>"+updateTime[params[i].dataIndex] +"</div>"
                            +"<div style='width: 10px;height: 10px;display: inline-block;background-color:#29bf83 '></div> 湿度:"+devHumidity[params[i].dataIndex]+"%"+"<br/>"
                    }
                    return str
                }
            }
        },
        legend: {
            data: ['湿度'],
            left:"5%",
            textStyle:{
                fontSize:'12'
            }
        },
        toolbox: {
            right:'5%',
            feature: {
                saveAsImage: {
                    title:'保存',
                }
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true, //grid大小是否包含左侧的label
            position: 'center'
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: updateTime,
                axisLabel:{
                    interval: 1,
                    // formatter: (value)=>{
                    //     return timeStampString(new Date(value))
                    // }
                },
                axisPointer:{
                    label:{
                        show: false
                    }
                },
                //x轴线颜色
                axisLine:{
                    lineStyle:{
                        color:'#29bf83',
                        fontSize: 12,
                        fontWeight: 700
                    }
                },
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '湿度',
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color:'#3f3f3f',
                        fontSize: 12
                    },

                }
            }
        ],
        series: [
            {
                name: '湿度',
                type: 'line',
                // stack: 'Total',
                smooth:true,
                emphasis: {
                    focus: 'series'
                },
                yAxisIndex: 0,
                data: devHumidity,
                //填充颜色设置
                areaStyle:{
                    color: new echarts.graphic.LinearGradient(
                        0,0,0,1,
                        [
                            {
                                offset:0,
                                color:'#29bf83',//渐变色的起始颜色
                            },
                            {
                                offset: 0.95,
                                color: '#0c89da'
                            }
                        ],
                        false
                    ),
                    shadowColor:"rgba(0,0,0,0.1)"
                },
                itemStyle: {
                    color: '#29bf83'
                },
                animation:true,
                animationDuration: transitionTime,
                animationEasing: 'liner',
            },

        ]
    }

    let myColor = ["rgb(1,120,255)", "#F57474", "#F8B448", "#7898f6"];

    let barChartOption= {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            show: false
        },
        grid: {
            left: '22%',
            bottom: '10%',
            top: "10%",
            containLabel: false //grid大小是否包含左侧的label
        },
        //不显示x轴的相关信息
        xAxis: {
            show: false
        },
        yAxis: [
            {
                inverse:true,
                type: 'category',
                data: macStatusValueChinese,
                //不显示y轴的线
                axisLine: {
                    show: false
                },
                //不显示y轴的刻度
                axisTick: {
                    show: false
                },
                //把刻度标签里面的文字设置颜色
                axisLabel:{
                    color:'#000'
                }
            },
            {
                inverse:true,
                type: 'category',
                data: macStatusValue,
                //不显示y轴的线
                axisLine: {
                    show: false
                },
                //不显示y轴的刻度
                axisTick: {
                    show: false
                },
                //把刻度标签里面的文字设置颜色
                axisLabel:{
                    color:'#fff'
                }
            }
        ],
        series: [
            {
                name: '数值',
                type: 'bar',
                data: macStatusValue,
                //柱子之间的距离
                barCategoryGap:50,
                //柱子的高度
                barWidth:14,
                yAxisIndex:0,
                //修改第一组柱子的圆角
                itemStyle:{
                    barBorderRadius: 20,
                    //此时的color可以修改柱子的颜色
                    color:(params)=>{
                        //params传进来的是柱子对象
                        //dataIndex是当前柱子的索引号
                        return myColor[params.dataIndex]
                    }
                },//显示柱子内的文字
                label:{
                    normal:{
                        show:true,
                        //图形内显示
                        position: 'inside',
                        //{c}会自动解析为数据，是data里面的数字
                        formatter:(value)=>{
                            return macStatusValue[value.dataIndex]+" "+labelMeasure[value.dataIndex];

                        },
                        color:'#fff'
                    }
                }
            }
        ],
    };

    myFirstLineChart.setOption(option1)
    mySecondLineChart.setOption(option2)
    myThirdEcharts.setOption(option3)
    myBarEcharts.setOption(barChartOption)

    if (setChartInterval!==null){
        clearInterval(setChartInterval)
        setChartInterval=null
    }
    setChartInterval=setInterval(()=>{
        $.ajax({
            url: projectName+"dev/getDevStatusMapByIndex",
            dataType: 'JSON',
            method: "post",
            contentType: "application/x-www-form-urlencoded",
            async: false,
            data: {
                devId: devId,
                index: 1
            },
            success:(res)=>{
                for (const devStatus of res) {
                    if (timeStampString(devStatus.upload_time)!==updateTime[updateTime.length-1]){
                        macStatusValue=[]
                        devLevel.shift()
                        devTemperature.shift()
                        devHumidity.shift()
                        devBattery.shift()
                        updateTime.shift()
                        devLevel.push(devStatus.level)
                        devTemperature.push(devStatus.temperature)
                        devHumidity.push(devStatus.humidity)
                        devBattery.push(devStatus.battery)
                        updateTime.push(timeStampString(devStatus.upload_time))
                        macStatusValue.push(devStatus.battery)
                        macStatusValue.push(devStatus.temperature)
                        macStatusValue.push(devStatus.humidity)
                    }

                }
                setChart()
            },
            fail:(err)=>{
                console.log(err.data)
            }
        })
    },1000)
}