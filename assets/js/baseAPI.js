// 在发送ajax（） get（） post（） 之前会触发
var baseURL = 'http://api-breakingnews-web.itheima.net'
$.ajaxPrefilter(function (options) {
    // alert(options.url)
    options.url = baseURL + options.url;
    // alert(options.url);


    // 统一为有权限的接口，设置headers 请求头
    if (options.url.indexOf('/my') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ""
        }
    }
    // 3.拦截所有的响应，判断身份认证信息
    options.complete = function (res) {
        // console.log(res.responseJSON);
        var obj = res.responseJSON;
        if (obj.status == 1 && obj.message === "身份认证失败！") {
            // 销毁token
            localStorage.removeItem("token");
            // 跳转页面
            location.href = "/login.html";

        }
    }
}) 