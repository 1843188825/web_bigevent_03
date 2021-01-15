$(function () {
    // 1.给登录和注册的链接添加点击事件
    $("#link_reg").on('click', function () {
        $('.login_box').hide()
        $('.reg-box').show()
    })
    $("#link_login").on('click', function () {
        $('.login_box').show()
        $('.reg-box').hide()
    })
    // 2.自定义验证规则
    var form = layui.form
    form.verify({
        // 密码规则
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            var pwd = $(".reg-box input[name=password]").val()
            if (value !== pwd) {
                return "两次密码输入不一致！";
            }
        }
    });
    // 3.注册功能
    var layer = layui.layer;
    $("#form_reg").on("submit", function (e) {
        e.preventDefault();
        // 发送ajax请求
        $.ajax({
            method: "POST",
            url: "/api/reguser",
            data: {
                username: $(".reg-box [name=username]").val(),
                password: $(".reg-box [name=password]").val()
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg("注册成功，请登录！")
                // 手动切换到登录表单
                $("#link_login").click()
                // 重置form表单
                $("#form_reg")[0].reset()
            }
        })
    })
    // 4.登录功能
    $("#form_login").on("submit", function (e) {
        e.preventDefault();
        // 发送ajax请求
        $.ajax({
            method: "POST",
            url: "/api/login",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg("恭喜您，登录成功！")
                //  保持token
                localStorage.setItem("token", res.token)
                // 跳转
                location.href = "/index.html"
            }
        })
    })
})