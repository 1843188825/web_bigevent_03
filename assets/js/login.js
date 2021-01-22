$(function () {
    // 1.点击去注册账号的链接
    $("#link_reg").on('click', function () {
        $(".login-box").hide()
        $(".reg-box").show()
    })

    // 点击去登录的链接
    $("#link_login").on('click', function () {
        $(".login-box").show()
        $(".reg-box").hide()
    })

    // 2.自定义校验规则
    // 只要引入了latui.all.js  就会多出一个layui.form
    var form = layui.form
    var layer = layui.layer
    form.verify({
        // 属性就是定义的规则名称
        pwd: [
            // 数组中的第一个元素，正则
            /^[\S]{6,12}$/, 
            // 数组中的第二个元素，报错信息
            '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致的规则
        repwd:function(value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败，则return一个提示消息即可
            var pwd = $(".reg-box [name=password]").val().trim()
            if(pwd !== value) {
                // 只判断有问题的情况，没问题直接通过
                return "两次密码输入不一致"
            }
        }

    })

    // 3.监听注册表单的提交事件
    $("#form_reg").on('submit',function(e){
        // 阻止表单默认提交
        e.preventDefault()
        // 发送Ajax
        $.ajax({
            method:"POST",
            url: "/api/reguser",
            data:{
                username:$(".reg-box [name=username]").val(),
                password:$(".reg-box [name=password]").val(),
            },
            success:function(res){
                if(res.status !== 0) {
                    return layer.msg(res.message);
                    
                }
                // 成功
                layer.msg("注册成功,请登录！");
                // 模拟人的点击行为
                $("#link_login").click();
                // 重置form
                $("#form_reg")[0].reset();
            }
        })
    }) 
    
    // 4.监听登录表单的提交事件
    $("#form_login").on('submit',function(e){
        // 阻止表单默认提交
        e.preventDefault()
        // 发送Ajax
        $.ajax({
            method:"POST",
            url: "/api/login",
            // 快速获取表单中的数据
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0) {
                    return layer.msg(res.massage);
                }
                // 成功
                layer.msg("恭喜您，登录成功！");
                // 跳转到后台主页
                location.href = '/index.html'
                // 存储
                localStorage.setItem("token",res.token)
            }
        })
    }) 
})