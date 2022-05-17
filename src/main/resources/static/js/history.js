let chartResizeInterval=null;

let setChartInterval=null;
const projectName="/Distributed/";

let allDevStatus=[]
let transitionTime=300

let valueArr=[]
let valueDateArr=[]
let valueDateStringArr=[]

let myEcharts=[]
let type=window.location.href.split('/')[window.location.href.split('/').length-1]
let option={
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
                color :'#29bf83'
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

    },
    legend: {
        data: ['当前数值'],
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
            data: valueDateStringArr,
            axisLabel:{
                interval: 0,
                // formatter: (value)=>{
                //     return timeStampString(valueDate[value])
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
            name: '当前数值',
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
            name: '当前数值',
            type: 'line',
            // stack: 'Total',
            smooth:true,
            emphasis: {
                focus: 'series'
            },
            yAxisIndex: 0,
            data: valueArr,
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

function changeCharts(allDevStatus){
    $("#chartsOut").empty()
    let number=allDevStatus.length%2===0?allDevStatus.length/2:Math.floor(allDevStatus.length/2)+1
    for (let index = 0; index < number; index++) {
        if (index<number-1||allDevStatus.length%2===0){
            $("#chartsOut").append("<div>" +
                "                <div class=\"oneLine\">" +
                "                    <div class=\"leftChart\" style=\"overflow-x: hidden\">" +
                "                        <div class=\"title-panel\"><a href=\"detail?devId="+allDevStatus[2*index].id+"\">"+allDevStatus[2*index].id+"</a> </div>" +
                "                        <div class=\"panel line charts\" id=\"lineTest"+(2*index)+"\"></div>" +
                "                    </div>" +
                "                    <div class=\"rightChart\" style=\"overflow-x: hidden\">" +
                "                        <div class=\"title-panel\"><a href=\"detail?devId="+allDevStatus[2*index+1].id+"\">"+allDevStatus[2*index+1].id+"</a> </div>" +
                "                        <div class=\"panel line charts\" id=\"lineTest"+(2*index+1)+"\"></div>" +
                "                    </div>" +
                "                </div>" +
                "            </div>")
        }else if (allDevStatus.length%2!==0&&index===number-1){
            $("#chartsOut").append("<div>" +
                "                <div class=\"oneLine\">" +
                "                    <div class=\"leftChart\" style=\"overflow-x: hidden\">" +
                "                        <div class=\"title-panel\"><a href=\"detail?devId="+allDevStatus[2*index].id+"\">"+allDevStatus[2*index].id+"</a> </div>" +
                "                        <div class=\"panel line charts\" id=\"lineTest"+(2*index)+"\"></div>" +
                "                    </div>" +
                "                    <div class=\"rightChart\" style=\"overflow-x: hidden;background-color: rgba(0,0,0,0);box-shadow: none\"" +
                "                        <div class=\"title-panel\"><a href=\"#\"></a></div>" +
                "                        <div class=\"panel line\"></div>" +
                "                    </div>" +
                "                </div>" +
                "            </div>")
        }
    }
    setCharts()
}

$(()=>{
    $("#leftInput > .selection > .menu > .item").click(function (){
        let content=''
        if ($(this).text().trim()!==$("#leftInput > .selection > select").children("option:last-child").text().trim()){
            content=$(this).text()+"·"
        }else {
            content="·"
        }
        if ($("#rightInput > .selection > .text").text().trim()!==$("#rightInput > .selection > select").children("option:first-child").text().trim()){
            content+=$("#rightInput > .selection > .text").text()
        }
        $("#findReason").val(content)
        $.ajax({
            url: projectName+"dev/getAllDevStatusByReason",
            dataType: 'JSON',
            method: "post",
            contentType: "application/x-www-form-urlencoded",
            async: false,
            data: {
                findReason: $("#findReason").val()
            },
            success:(res)=>{
                allDevStatus=res
                changeCharts(allDevStatus)
            },
            fail:(res)=>{
                console.log(res.data)
            }
        })
    })

    $("#rightInput > .selection > .menu > .item").click(function (){
        let content='·'
        if ($(this).text().trim()!==$("#rightInput > .selection > select").children("option:last-child").text().trim()){
            content+=$(this).text()
        }
        if ($("#leftInput > .selection > .text").text().trim()!==$("#leftInput > .selection > select").children("option:first-child").text().trim()){
            content=$("#leftInput > .selection > .text").text()+content
        }
        $("#findReason").val(content)
        $.ajax({
            url: projectName+"dev/getAllDevStatusByReason",
            dataType: 'JSON',
            method: "post",
            contentType: "application/x-www-form-urlencoded",
            async: false,
            data: {
                findReason: $("#findReason").val()
            },
            success:(res)=>{
                allDevStatus=res
                changeCharts(allDevStatus)
            },
            fail:(res)=>{
                console.log(res.data)
            }
        })
    })



    $.ajax({
        url: projectName+"dev/getAllDevStatus",
        dataType: 'JSON',
        method: "post",
        contentType: "application/json",
        async: false,
        success:(res)=>{
            allDevStatus=res
        },
        fail:(res)=>{
            console.log(res.data)
        }
    })

    setCharts()
    if (chartResizeInterval){
        clearInterval(chartResizeInterval)
    }
    chartResizeInterval=setInterval(()=>{
        if ($("#leftResizeFlag").text()==='true'){
            for (let i = 0; i < allDevStatus.length; i++) {
                myEcharts[i].showLoading()
                const middleInterval=setTimeout(()=>{
                    myEcharts[i].resize()
                    myEcharts[i].clear()
                    option.xAxis[0].data=valueDateStringArr[i]
                    option.series[0].data=valueArr[i]
                    option.tooltip.formatter=(params)=>{
                        for (let k = 0; k < params.length; k++) {
                            let str=''
                            for (let j = 0; j < option.series[0].data.length; j++) {
                                if (type==='dev_temperature'){
                                    str="<div>"+timeStampString(valueDateArr[i][params[k].dataIndex]) +"</div>"
                                        +"<div style='width: 10px;height: 10px;display: inline-block;background-color:#29bf83 '></div> 当前温度:"+valueArr[i][params[k].dataIndex]+"°C";
                                }else if (type==='dev_humidity'){
                                    str="<div>"+timeStampString(valueDateArr[i][params[k].dataIndex]) +"</div>"
                                        +"<div style='width: 10px;height: 10px;display: inline-block;background-color:#29bf83 '></div> 当前湿度:"+valueArr[i][params[k].dataIndex]+"%";
                                }else if (type==='dev_level'){
                                    str="<div>"+timeStampString(valueDateArr[i][params[k].dataIndex]) +"</div>"
                                        +"<div style='width: 10px;height: 10px;display: inline-block;background-color:#29bf83 '></div> 当前水位:"+valueArr[i][params[k].dataIndex]+"mm";
                                }else {
                                    str="<div>"+timeStampString(valueDateArr[i][params[k].dataIndex]) +"</div>"
                                        +"<div style='width: 10px;height: 10px;display: inline-block;background-color:#29bf83 '></div> 当前数值:"+valueArr[i][params[k].dataIndex];
                                }
                            }
                            return str
                        }
                    }
                    myEcharts[i].setOption(option)
                    myEcharts[i].hideLoading()
                },500)
                $("#leftResizeFlag").text("false")
            }
        }
    },100)

    $(".leftChart").css("display","none")
    $(".rightChart").css("display","none")
    $(".leftChart").transition('drop',400)
    $(".rightChart").transition('drop',400)


    window.addEventListener('resize',()=>{
        for (let i = 0; i < allDevStatus.length; i++) {
            myEcharts[i].resize
        }
    })
})


function setCharts(){
    valueDateStringArr=[]
    valueArr=[]
    valueDateArr=[]
    for (let i = 0; i < allDevStatus.length; i++) {
        let myChart=echarts.init(document.querySelector("#lineTest"+i))
        let devId=allDevStatus[i].id
        let value=[]
        let valueDateString=[]
        let valueDate=[]
        $.ajax({
            url: projectName+"dev/getDevXXXMapByIndex",
            dataType: 'JSON',
            method: "post",
            contentType: "application/x-www-form-urlencoded",
            async: false,
            data: {
                devId: devId,
                index: 10,
                type: type
            },
            success:(res)=>{
                for (const resKey in res) {
                    valueDate.unshift(resKey)
                    valueDateString.unshift(timeStampString(resKey))
                    value.unshift(res[resKey])
                }
                valueArr.push(value)
                valueDateArr.push(valueDate)
                valueDateStringArr.push(valueDateString)
                option.xAxis[0].data=valueDateString
                option.series[0].data=value
                option.tooltip.formatter=(params)=>{
                    for (let k = 0; k < params.length; k++) {
                        let str=''
                        for (let j = 0; j < option.series[0].data.length; j++) {
                            if (type==='dev_temperature'){
                                str="<div>"+timeStampString(valueDateArr[i][params[k].dataIndex]) +"</div>"
                                    +"<div style='width: 10px;height: 10px;display: inline-block;background-color:#29bf83 '></div> 当前温度:"+valueArr[i][params[k].dataIndex]+"°C";
                            }else if (type==='dev_humidity'){
                                str="<div>"+timeStampString(valueDateArr[i][params[k].dataIndex]) +"</div>"
                                    +"<div style='width: 10px;height: 10px;display: inline-block;background-color:#29bf83 '></div> 当前湿度:"+valueArr[i][params[k].dataIndex]+"%";
                            }else if (type==='dev_level'){
                                str="<div>"+timeStampString(valueDateArr[i][params[k].dataIndex]) +"</div>"
                                    +"<div style='width: 10px;height: 10px;display: inline-block;background-color:#29bf83 '></div> 当前水位:"+valueArr[i][params[k].dataIndex]+"mm";
                            }else {
                                str="<div>"+timeStampString(valueDateArr[i][params[k].dataIndex]) +"</div>"
                                    +"<div style='width: 10px;height: 10px;display: inline-block;background-color:#29bf83 '></div> 当前数值:"+valueArr[i][params[k].dataIndex];
                            }
                        }
                        return str
                    }
                }
                option.xAxis[0].data=valueDateStringArr[i]
                myChart.setOption(option)
                myEcharts.push(myChart)
            },
            fail:(err)=>{
                console.log(err.data)
            }
        })
    }

    if (setChartInterval!=null){
        clearInterval(setChartInterval)
        setChartInterval=null
    }
    setChartInterval=setInterval(()=>{
        for (let i = 0; i < allDevStatus.length; i++) {
            let myChart=echarts.init(document.querySelector("#lineTest"+i))
            let devId=allDevStatus[i].id
            $.ajax({
                url: projectName+"dev/getDevXXXMapByIndex",
                dataType: 'JSON',
                method: "post",
                contentType: "application/x-www-form-urlencoded",
                async: false,
                data: {
                    devId: devId,
                    index: 1,
                    type: type
                },
                success:(res)=>{
                    for (const resKey in res) {
                        if (resKey!==valueDateArr[i][valueDateArr[i].length-1]){
                            valueDateArr[i].shift()
                            valueArr[i].shift()
                            valueDateStringArr[i].shift()

                            valueDateArr[i].push(resKey)
                            valueArr[i].push(res[resKey])
                            valueDateStringArr[i].push(timeStampString(resKey))
                        }
                    }

                    option.xAxis[0].data=valueDateStringArr[i]
                    option.series[0].data=valueArr[i]
                    option.tooltip.formatter=(params)=>{
                        for (let k = 0; k < params.length; k++) {
                            let str=''
                            for (let j = 0; j < option.series[0].data.length; j++) {
                                if (type==='dev_temperature'){
                                    str="<div>"+timeStampString(valueDateArr[i][params[k].dataIndex]) +"</div>"
                                        +"<div style='width: 10px;height: 10px;display: inline-block;background-color:#29bf83 '></div> 当前温度:"+valueArr[i][params[k].dataIndex]+"°C";
                                }else if (type==='dev_humidity'){
                                    str="<div>"+timeStampString(valueDateArr[i][params[k].dataIndex]) +"</div>"
                                        +"<div style='width: 10px;height: 10px;display: inline-block;background-color:#29bf83 '></div> 当前湿度:"+valueArr[i][params[k].dataIndex]+"%";
                                }else if (type==='dev_level'){
                                    str="<div>"+timeStampString(valueDateArr[i][params[k].dataIndex]) +"</div>"
                                        +"<div style='width: 10px;height: 10px;display: inline-block;background-color:#29bf83 '></div> 当前水位:"+valueArr[i][params[k].dataIndex]+"mm";
                                }else {
                                    str="<div>"+timeStampString(valueDateArr[i][params[k].dataIndex]) +"</div>"
                                        +"<div style='width: 10px;height: 10px;display: inline-block;background-color:#29bf83 '></div> 当前数值:"+valueArr[i][params[k].dataIndex];
                                }
                            }
                            return str
                        }
                    }
                    myChart.setOption(option)
                    myEcharts.push(myChart)
                },
                fail:(err)=>{
                    console.log(err.data)
                }
            })
        }

    },5000)
}