$(function () {
    // 1.初始化分类
    var form = layui.form;
    var layer = layui.layer;
    function initForm() {
        var id = location.search.split('=')[1];
        $.ajax({
            url: '/my/article/' + id,
            success: function (res) {
                // 失败判断
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                form.val('form-edit', res.data);
                tinyMCE.activeEditor.setContent(res.data.content);
                if (!res.data.cover_img) {
                    return layer.msg('用户未曾上传头像！');
                }
                var newImgURL = baseURL + res.data.cover_img
                $image
                    .cropper('destroy')      // 销毁旧的裁剪区域
                    .attr('src', newImgURL)  // 重新设置图片路径
                    .cropper(options)        // 重新初始化裁剪区域
            }
        })
    }
    initCate()
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 一定要记得调用form.render（）方法
                form.render()
                // 文章分类渲染完毕再调用
                initForm()
            }
        })
    }
    // 2.初始化富文本编辑器
    initEditor()


    // 3.文章封面
    // 3.1 初始化图片裁剪器
    var $image = $('#image')

    // 3.2 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3.3 初始化裁剪区域
    $image.cropper(options)

    // 4.点击按钮，选择图片
    $("#btnChooseImage").on('click', function () {
        $("#coverFile").click()
    })
    // 5.渲染文章封面
    $("#coverFile").on('change', function (e) {
        // 获取到文件的列表数据
        var file = e.target.files[0]
        // 判断用户是否选择了文件
        if (file.length === 0) {
            return
        }
        // 根据问卷，创建对应的url地址
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    // 6.修改状态
    var state = '已发布'
    // $("#btnSave1").on('click',function(){
    //     state = '已发布'
    // })
    $("#btnSave2").on('click', function () {
        state = '草稿';
    })
    // 7.文章发布
    $("#form-pub").on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 创建 FormData 对象
        var fd = new FormData(this);
        // 添加状态
        fd.append('state', state)
        // 生成二级制文件图片
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            }).toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                // 发送ajax请求，要在toBlob（）函数里面
                publishArticle(fd)
            })

    })
    // 8.封装发布文章ajax
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 提示消息，页面跳转
                layer.msg("修改文章成功！")
                setTimeout(function () {
                    window.parent.document.getElementById("art_list").click()
                }, 1000)
            }
        })
    }
})