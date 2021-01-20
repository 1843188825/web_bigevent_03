// 入口函数
$(function () {
    // 1.定义昵称校验规则
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称字符在1~6位之间"
            }
        }
    })

    // 2.获取和渲染用户信息
    initUserInfo();
    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 利用layui中的form.val()赋值
                form.val('formUserInfo', res.data)
            }
        })
    }
    // 3.表单重置
    // 不要给btn绑定reset事件    reset事件可以给form表单绑定
    $("#btnReset").on('click', function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        // 重新用户渲染
        initUserInfo();
    })

    // 4.提交用户修改
    $(".layui-form").on('submit', function (e) {
        e.preventDefault();
        // 发送ajax
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                // 判断返回值状态
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                return layer.msg("更新用户信息成功")
                // 更新成功，渲染父页面信息
                // window.parent 获取的是iframe的父页面对应的window对象
                window.parent.getUserInfo()
            }
        })
    })
})