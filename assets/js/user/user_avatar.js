// 入口函数
$(function () {
    var layer = layui.layer
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    var options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    // 2.选择图片
    $("#btnChooseImage").on("click", function () {
        $("#file").click()
    })

    // 3.修改裁剪图片
    $("#file").on("change", function (e) {
        // 3.1拿到用户选择的文件
        var file = e.target.files[0]
        if (file.length === 0) {
            return layer.msg("请选择照片！")
        }

        // 3.2将文件，转化为路径
        var newImgURL = URL.createObjectURL(file)
        // 3.3 重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    })

    // 4.修改头像
    $("#btnUpload").on("click", function () {
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            
            // 2.调用接口  把头像上传到服务器
            $.ajax({
                method:"POST",
                url:"/my/update/avatar",
                data:{
                    avatar:dataURL
                },
                success:function(res){
                    if(res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    // 成功提示
                    layer.msg("更换头像成功！")
                    // 重新渲染父页面
                    window.parent.getUserInfo()
                }
            })
    })
})