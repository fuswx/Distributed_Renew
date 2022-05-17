
$(function (){
    doChange();
    $("#main-content").css("height",$("body").css("height")-$("#header-outline").css("height"))
})

$(window).resize(function (){
    doChange()
})
function doChange(){
    makeMap()
}

//制作中国地图
function makeMap(){
    //使用Loader加载
    // AMapLoader.load({
    //     "version": "1.4.15",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    //     "key": "86bad24a3731ba1547b6be5c2a0fa967",
    //     "AMapUI": {             // 是否加载 AMapUI，缺省不加载
    //         "version": '1.1',   // AMapUI 缺省 1.1
    //         "plugins":['overlay/SimpleMarker'],       // 需要加载的 AMapUI ui插件
    //     },
    //     "Loca":{                // 是否加载 Loca， 缺省不加载
    //         "version": '1.3.2'  // Loca 版本，缺省 1.3.2
    //     },
    // }).then((AMap)=>{
    //     const map = new AMap.Map('container');
    //     map.addControl(new AMap.Scale());
    //     new AMapUI.SimpleMarker({
    //         map: map,
    //         position: map.getCenter(),
    //     });
    // }).catch((e)=>{
    //      //加载错误提示
    //     console.log(e)
    // });


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
    const locations = [
        [113.780373, 34.757843],
        [113.880373, 34.847843],
        [113.53524, 34.669792]
    ];
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
            console.log("点")
            var  content=
                "<div className='infos'><div>地铁1号线紫金山路</div>\n" +
                "<div style='margin-top: 5px'> <span style='display: none'></span><span style='display: inline-block;float: left;font-size: 12px;font-weight: 600'><span style='display: inline-block;width: 10px;height: 5px;background-color: #1b2128'></span> 200mm</span><span style='display: inline-block;float: right;font-size: 12px;font-weight: 600;color: #60b193'>水位正常</span></div></div>";
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

