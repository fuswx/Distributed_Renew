$(()=>{
    // let trasitionFlag=false;
    // $("body").css("animation","gradient-move-to 5s ease")
    // let trasitionInterval=setInterval(()=>{
    //     if (trasitionFlag){
    //         $("body").css("animation","gradient-move-to 5s ease")
    //         trasitionFlag=false
    //     }else {
    //         $("body").css("animation","gradient-move-from 5s ease")
    //         trasitionFlag=true
    //     }
    // },5000)

    //设置登录组件位置
    $(".form-signin").css("left",($(".login-body").width()-$(".form-signin").width())/2)

    //切换登录与注册页面
    $("#btn-register").click(()=>{
        $("#form-login").transition('horizontal flip')

        $("#form-register").transition('horizontal flip')
    })
    $("#btn-return-login").click(()=>{
        $("#form-login").transition('horizontal flip')

        $("#form-register").transition('horizontal flip')
    })

    //检查用户名重复
    $("#register-userName").blur(()=>{
        if ($("#register-userName").val()!==''){
            $.ajax({
                url:'/monitorSystem/user/account/getUserByUserNameIsExist.do',
                data: {
                    'userName':$("#register-userName").val()
                },
                dataType: 'JSON',
                method: "get",
                contentType: "application/json",
                success: function (res) {
                    if (res===true) {
                        $("#remindNameLabel").transition('slide down')
                        setTimeout(()=>{
                            $("#remindNameLabel").transition('slide down')
                        },5000)
                        $("#register-userName").transition('shake')
                    }
                }
            })
        }
    })

    function checkRegisterForm(){
        //检查密码是否为空并加以限制
        if ($("#register-password").val().trim()===''){
            $("#remindPasswordLabel").transition('slide up')
            setTimeout(()=>{
                $("#remindPasswordLabel").transition('slide up')
            },5000)
            $("#register-password").transition('tada')
        }else {
            $("#form-register").submit()
        }
    }
    function checkLoginForm(){
        //检查密码是否为空并加以限制
        if ($("#login-password").val().trim()===''||$("#login-userName").val().trim()===''){
            $("#remindLoginPasswordLabel").transition('slide up')
            setTimeout(()=>{
                $("#remindLoginPasswordLabel").transition('slide up')
            },5000)
            $("#login-password").val().trim()===''?$("#login-password").transition('tada'):$("#login-userName").transition('tada')
        }else {
            $("#form-login").submit()
        }
    }

    //点击注册按钮时
    $("#form-register-submit").click(()=>{
        checkRegisterForm()
    })

    //点击登录按钮时
    $("#form-login-submit").click(()=>{
        checkLoginForm()
    })

    document.onkeydown=function (event){
        if (event.keyCode===13){
            $("#form-register").hasClass("hidden")?checkRegisterForm():checkLoginForm()
        }
    }

})