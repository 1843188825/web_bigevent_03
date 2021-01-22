$(function () {
    var layer = layui.layer

    //3.定义美化事件的过滤器
    template.defaults.imports.dateFormat = function (date) {
        const dt = new Date(date)

        var y = padZero(dt.getFullYear())
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数对象，将来请求数据的时候
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1,  // 页码值，默认请求第一页的数据
        pagesize: 2,  // 每页显示多少条数据
        cate_id: '',  // 文章分类的id
        state: ''  // 文章的发布状态
    }


    // 1.获取文章列表数据的方法
    initTable()
    // 封装渲染列表
    function initTable() {
        $.ajax({
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 使用模板引擎渲染页面
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                // 调用分页
                renderPage(res.total)
            }
        })
    }


    // 2.初始化文章分类的方法
    var form = layui.form
    initCate()
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 渲染
                var htmlStr = template('tpl-cate', res);
                $("[name=cate_id]").html(htmlStr);
                form.render();
            }
        })
    }

    // 4.为筛选表单绑定submit事件
    $("#form-search").on('submit', function (e) {
        e.preventDefault()
        // 获取
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 赋值
        q.cate_id = cate_id
        q.state = state
        // 初始化文章列表
        initTable()
    })

    // 5.定义渲染分页的方法
    var laypage = layui.laypage;
    function renderPage(total) {
        // 执行一个laypage实例
        laypage.render({
            elem: 'pageBox',  // 分页容器的ID
            count: total,   // 总数据调试
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum,  // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换时，触发jump 回调
            // 触发 jump 回调的方式有两种
            // 1. 点击页码的时候 会触发 jump 回调
            // 2. 只要调用了laypage.render（）方法  就会触发jump回调
            jump: function (obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的jump
                // 如果 first 的值为 true 证明是方式2触发的
                // 否则则为方式1触发的
                // 把最新的页码值，赋值到q这个查询参数对象中
                q.pagenum = obj.curr
                // 根据最新的条目数，赋值到 q 这个查询参数对象的 pagesize 中
                q.pagesize = obj.limit
                // 根据最新的 q 获取对应的数据列表，并渲染表格
                // initTable()
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 6.通过代理的形式，为删除按钮绑定点击事件处理函数
    $("tbody").on('click', '.btn-delete', function () {
        // 获取到文章的id
        var Id = $(this).attr('data-id')
        // 询问用户是否要删除数据
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 发送ajax请求
            $.ajax({
                url: '/my/article/delete/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg("删除文章成功！")
                    // 当前页 -1 要满足两个条件，页面中只有一个元素，且当前页大于1
                    if ($(".btn-delete").length === 1 && q.pagenum > 1) q.pagenum--
                    initTable()
                }

            })
            layer.close(index);
        });

    })
})