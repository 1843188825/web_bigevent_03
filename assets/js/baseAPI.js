var baseURL = "http://api-breakingnews-web.itheima.net";
$.ajaxPrefilter(function(params){
    params.url = baseURL + params.url;
})