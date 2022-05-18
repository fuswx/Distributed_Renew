const projectName="/Distributed/";

let setMapStatusInterval=null
//定时器内数据
let humidityArr=[],levelArr=[],temperatureArr=[],batteryArr=[],updateTimeArr=[]
//只有初始化数据
let devIdArr=[],positionArr=[],locationArr=[]

$(function (){
    doChange();
})

$(window).resize(function (){
    doChange()
})
function doChange(){
    makeMap()
}
//定时获取设备数据
function getDevStatus(){
    $.ajax({
        url: projectName+"dev/getAllDevStatus",
        dataType: 'JSON',
        method: "post",
        contentType: "application/json",
        async: false,
        success:(res)=>{
            humidityArr=[]
            levelArr=[]
            temperatureArr=[]
            batteryArr=[]
            updateTimeArr=[]
            for (const devStatus of res) {
                devIdArr.push(devStatus.id)
                humidityArr.push(devStatus.humidity)
                levelArr.push(devStatus.level)
                temperatureArr.push(devStatus.temperature)
                batteryArr.push(devStatus.battery)
                updateTimeArr.push(devStatus.upload_time)
            }
        },
        fail:(res)=>{
            console.log(res.data)
        }
    })

}

//制作中国地图
function makeMap(){
    $.ajax({
        url: projectName+"dev/getAllDevInitStatus",
        dataType: 'JSON',
        method: "post",
        contentType: "application/json",
        async: false,
        success:(res)=>{
            devIdArr=[]
            positionArr=[]
            locationArr=[]
            for (const devStatus of res) {
                let location=[]
                devIdArr.push(devStatus.id)
                positionArr.push(devStatus.position)
                location.push(devStatus.longitude)
                location.push(devStatus.latitude)
                locationArr.push(location)
            }
        },
        fail:(res)=>{
            console.log(res.data)
        }
    })

    getDevStatus()

    if (setMapStatusInterval!==null){
        clearInterval(setMapStatusInterval)
        setMapStatusInterval=null
    }
    setMapStatusInterval=setInterval(()=>{
        getDevStatus()
    },5000)


    const map = new AMap.Map('container', {
        zoom: 9,//级别
        center: [113.62000, 34.62000],//中心点坐标
        viewMode: '3D'//使用3D视图
    });
    const startIcon = new AMap.Icon({
        size: new AMap.Size(30, 50),//图标尺寸
        imageSize: new AMap.Size(35, 50),
        image: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
    });
    const locations = locationArr;
    const markers = [];
    for (let i = 0; i < locations.length; i++) {
        const infoWindow = new AMap.InfoWindow({
            offset: new AMap.Pixel(5, -30),
        });
        infoWindow.open(map,locations[i])
        const marker = new AMap.Marker({
            position: locations[i],
            map: map,
            icon: startIcon,
            content: "" +
                '<div class="custom-content-marker">' +
                '   <img style="width: 30px;height: 40px" src="//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png">' +
                "</div>"
        });
        marker.on('click',function (e){
            console.log(e)
            const  content=
                "<div className='infos' class='markerLabelTitle'>地铁1号线紫金山路</div>\n" +
                "<div class='markerLabelContent'>" +
                    "<div class='markerLabelStatus'>" +
                        "<div class='markerLabelFirstLine'>" +
                            "<span class='markerLabelSpan'><i class='battery full icon' style='color: #0ea432'></i> "+batteryArr[0]+"</span>" +
                            "<span class='markerLabelSpan'><i class='thermometer full icon' style='color: red'></i> "+temperatureArr[0]+"</span>" +
                            "<span class='markerLabelSpan'><i class='snowflake outline icon' style='color: #54c8ff'></i> "+humidityArr[0]+"</span>" +
                        "</div>"+
                        "<div class='markerLabelSecondLine'>" +
                            "<span class=''><i class='umbrella icon' style='color: cornflowerblue'></i> "+levelArr[0]+"</span>" +
                        "</div>"+
                    "</div>" +
                "</div>";
            infoWindow.setContent(content)
            infoWindow.open(map,this._position)
        })
        markers.push(marker)
    }

    // 同时引入工具条插件，比例尺插件和鹰眼插件
    AMap.plugin([
        'AMap.ToolBar',
        'AMap.Scale',
        'AMap.OverView',
        'AMap.MapType',
        'AMap.Geolocation',
        'AMap.Scale',
    ], function(){
        // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
        map.addControl(new AMap.ToolBar());
        // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
        map.addControl(new AMap.Scale());
        // 在图面添加鹰眼控件，在地图右下角显示地图的缩略图
        map.addControl(new AMap.OverView({isOpen:true}));
        // 在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
        map.addControl(new AMap.MapType());
        // 在图面添加定位控件，用来获取和展示用户主机所在的经纬度位置
        map.addControl(new AMap.Geolocation());
    });
    map.add(markers)

    // var map=new AMap.Map('container')
    // var map = new AMap.Map('container', {
    //     zoom:11,//级别
    //     center: [116.397428, 39.90923],//中心点坐标
    //     viewMode:'3D'//使用3D视图
    // });
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

