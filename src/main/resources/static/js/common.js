let slider_margin_left=0.14;

// function sliderHide(){
//     $("#toc").transition('swing left',500)
//     $("#toc").removeClass("overlay visible")
//     $("#main-content").stop().animate({right: "0"},200,function (){
//         $(".placeholder-div a").text("预警")
//     })
//     $("#main-content").css("width","100%")
//     $(".placeholder-div").width($("#header-outline").width()*slider_margin_left/2)
//     $("#leftResizeFlag").text("true")
// }
// function sliderDisplay(){
//     $("#main-content").css("width",(1-slider_margin_left)*100+"%")
//     $("#main-content").stop().animate({right: "0"},200,function (){
//         $(".placeholder-div a").text("水位感知预警系统")
//     })
//     $(".placeholder-div").css("width",$("#header-outline").width()*slider_margin_left)
//     $("#toc").transition('swing left',500)
//     $("#toc").addClass("overlay visible")
//     $("#leftResizeFlag").text("true")
// }

$(document).ready(function(){
    //背景动画
    let trasitionFlag=false;
    $("body").css("animation","gradient-move-to 5s ease")
    let trasitionInterval=setInterval(()=>{
        if (trasitionFlag){
            $("body").css("animation","gradient-move-to 5s ease")
            trasitionFlag=false
        }else {
            $("body").css("animation","gradient-move-from 5s ease")
            trasitionFlag=true
        }
    },5000)

    //用户点击slider-hide标志
    let isHide=true;

    $('.ui.accordion').accordion({duration:'click'});
    $(".ui.dropdown").dropdown();

    // $(".slide-hide").click(function (){
    //     if($("#toc").hasClass("overlay")){
    //         sliderHide()
    //         isHide=true;
    //     }else {
    //         sliderDisplay()
    //         isHide=false;
    //     }
    // })
    //滚动行为
    // $(window).scroll(function (){
    //     if ($(window).scrollTop()===0){
    //         isHide=true
    //         !$("#toc").hasClass("overlay")?sliderDisplay():null
    //     }else {
    //         isHide?$("#toc").hasClass("overlay")?sliderHide():null:null
    //     }
    // })

    $(".slider-mux-content").each(function (i,e){
        $(e).children().each(function (index,child){
            $(child).removeClass('active')
        })
    })

    $(".apage").each(function (i,e){
        $(e).removeClass('active')
        if ($(e).prop("href")===(window.location.href.split("?")[0])) {
            $(e).addClass('active')
            $(e).parent().parent().parent().children().each((index,child)=>{
                $(child).addClass('active')
            })
        }
    })

});


