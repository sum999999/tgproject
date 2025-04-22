$(function() {
    function guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    //width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
    function getBase64Image(img, width, height) {
        var canvas = document.createElement("canvas");
        canvas.width = width ? width : img.width;
        canvas.height = height ? height : img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        var dataURL = canvas.toDataURL();
        return dataURL;
    }
    function getCanvasBase64(img) {
        var image = new Image();
        //至关重要
        image.crossOrigin = '';
        image.src = img;
        //至关重要
        var deferred = $.Deferred();
        if (img) {
            image.onload = function () {
                deferred.resolve(getBase64Image(image));//将base64传给done上传处理
                //document.getElementById("container2").appendChild(image);
            }
            return deferred.promise();//问题要让onload完成后再return sessionStorage['imgTest']
        }
    }

    function startPromise(tasks){
        var result = [];
        return tasks.reduce((accumulator,item,index)=>{
            return item.then(res=>{
                result[index] = res
                return index == tasks.length - 1 ? result : item
            })
        },Promise.resolve())
    }

    $('.name').text(configText.main);

    document.title = configText.main;

    function formatDate(date, fmt) {
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                (date.getFullYear() + '').substr(4 - RegExp.$1.length)
            )
        }
        var o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        };
        for (var k in o) {
            if (new RegExp(`(${k})`).test(fmt)) {
                var str = o[k] + '';
                fmt = fmt.replace(
                    RegExp.$1,
                    RegExp.$1.length === 1 ? str : ('00' + str).substr(str.length)
                )
            }
        }
        return fmt
    }

    var PLATFORM_FLAG = '';
    var formData = null;
    startPromise([
        Application.Api.querySystemConfig().then(function(response) {
            for (var i in response.data.data) {
                var item = response.data.data[i];
                if (item.key === 'PLATFORM_FLAG') {
                    PLATFORM_FLAG = item.value;
                }
            }
        }),
        Application.Api.getDownloadVersion().then(function (response) {
            var data = response.data.data;
            var appVersion = data.appVersion;
            var cmsImgApp = data.cmsImgApp;
            var androidVersion = {
                type: "2", //（安卓）
                ver: "V2.2.4", //（版本号）
                releaseTime: 1575193997000, //（更新时间）
                build: "224", //（编译号）
                softUrl: "https://cdn.6336236.com/xwcp_test_Android_production.apk", //（下载地址）
                fileSize: "30.22" //（大小）
            };
            var iosVersion = {
                type: "1", //（IOS）
                ver: "v2.0.2",
                releaseTime: 1572661182000,
                build: "165",
                softUrl: "itms-services://?action=download-manifest&amp;url=https://app.wwwxwsy.com/xwcp.plist",
                fileSize: 0
            };
            for (var i in appVersion) {
                var type = appVersion[i].type;
                switch (type) {
                    case "1":
                        iosVersion = appVersion[i];
                        break;
                    case "2":
                        androidVersion = appVersion[i];
                        break;
                }
            }

            iosVersion.releaseTime = formatDate(new Date(iosVersion.releaseTime), 'yyyy-MM-dd hh:mm:ss');
            iosVersion.fileSize = iosVersion.fileSize || 0;

            androidVersion.releaseTime = formatDate(new Date(androidVersion.releaseTime), 'yyyy-MM-dd hh:mm:ss');
            androidVersion.fileSize = androidVersion.fileSize || 0;

            $('.logo').attr('src', cmsImgApp.iconUrl);


            var status_down = 1;
            $(document).on('click', '#iosDown', function() {
                if (!cmsImgApp.mobileconfigUrl) {
                    return alert('未配置mobileconfig下载文件，请联系在线客服！');
                }
                if (status_down === 0) {
                    return false
                }
                status_down = 0;
                $('#iosDown').html('下载中...')
                setTimeout(function() {
                    $('#iosDown').html('安装')
                    status_down = 1
                }, 2000);

                location.href = cmsImgApp.mobileconfigUrl;

                setTimeout(function() {
                    $('#iosDown').html('启动')
                    location.href = cmsImgApp.mobileprovisionUrl;
                }, 5000)
            });
            // getCanvasBase64(cmsImgApp.iconUrl)
            //     .then(function (base64) {
            //         formData = new FormData();
            //         formData.append('flag', PLATFORM_FLAG);
            //         formData.append('imagefiles', new Blob([$('#mobileconfig-tmpl').render({
            //             siteName: configText.main,
            //             siteUrl: location.host + '/#/?f=awv',
            //             payloadIdentifier: guid(),
            //             payloadUUID: guid(),
            //             data: base64 && base64.replace(/^data:image\/\w+;base64,/, "")
            //         }).trim()], {type: 'text/xml'}), 'desktopWeb.mobileconfig');
            //
            //         Application.Api.qiniuUpload(formData).then(function(response) {
            //             var status_down = 1;
            //
            //         })
            //     }, function (err) {
            //         console.log(err);
            //     });
        })
    ])
});
