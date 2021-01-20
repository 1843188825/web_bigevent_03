$(function () {
    // 1.调用getUserInfo 获取用户基本信息
    getUserInfo()
    // 2.退出登录功能
    var layer = layui.layer
    $("#btnLogout").on("click", function () {
        // 弹窗
        layer.confirm('是否确认退出登录?', { icon: 3, title: '提示' }, function (index) {
            // 1.清空token
            localStorage.removeItem("token");
            // 2.跳转页面
            location.href = "/login.html";
            // 3.关闭询问框
            layer.close(index);
        });
    })
})



// 封装一个  获取用户的基本信息 方法
// 注意：必须是全局函数，后面其他页面要用！！！
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: '/my/userinfo',
        // header 就是请求头配置
        // headers: {
        //     Authorization: localStorage.getItem('token') || ""
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg("获取用户信息失败！")
            }
            // 调用renderAvatar 渲染用户的头像
            renderAvatar(res.data)
        },
        // // 无论成功还是失败，都会调用complete函数
        // complete:function (res) {
        //     console.log(res.responseJSON);
        //     var obj = res.responseJSON;
        //     if (obj.status !== 0 && obj.message === "身份认证失败！") {
        //         // 销毁token
        //         localStorage.removeItem("token");
        //         // 跳转页面
        //         location.href = "/login.html";

        //     }
        // }
    })
}
function renderAvatar(user) {
    // 1.渲染昵称或用户名
    var name = user.nickname || user.username
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name)
    // 2.渲染用户的头像
    if (user.user_pic !== null) {
        // 图片头像
        $(".layui-nav-img").attr("src", user.user_pic).show()
        $(".text-avatar").hide()
    } else {
        // 文字头像
        $(".text-avatar").hide()
        // toUpperCase 字母变大写
        var text = name[0].toUpperCase();
        $(".text-avatar").show().html(text)
    }

}