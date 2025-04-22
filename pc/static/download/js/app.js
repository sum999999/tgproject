$(function() {
    const Application = window.Application;

    new QRCode('qrcode', {
        text: location.href,
        width: 140,
        height: 140,
        colorDark : '#000000',
        colorLight : '#ffffff',
        correctLevel : QRCode.CorrectLevel.H
    });

    // 显示当前网址
    $('.site-href').text(location.href);

    $('.colApp span').text(configText.main);

    document.title = configText.main;
    // 服务条款内容
    $('#modal-bodys').append($("#modal-bodys-tmpl").render({siteName: configText.main}));

    // 服务条款弹窗
    $('.modal_term').bind('click', function() {
        $('#termModal').modal('show');
        $('#termModal .modal-title').html('服务条款');
        $('#termModal .modal-body').html($('#modal-bodys').html());
    });

    // 隐式声明内容
    $('#modal-bodys2').append($("#modal-bodys2-tmpl").render({siteName: configText.main}));

    // 隐式声明弹窗
    $('.modal_privacy').bind('click', function() {
        $('#privacyModal').modal('show');
        $('#privacyModal .modal-title').html('隐私声明');
        $('#privacyModal .modal-body').html($('#modal-bodys2').html());
    });

    $('#footer').append($("#footer-tmpl").render({siteUrl: location.host}));

    // icon旁的站点名
    $('.icon-warp').html('<i id="icon" class=""></i>' + configText.main)

    function formatDate(date, fmt) {
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                (date.getFullYear() + '').substr(4 - RegExp.$1.length)
            )
        }
        let o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        }
        for (let k in o) {
            if (new RegExp(`(${k})`).test(fmt)) {
                let str = o[k] + ''
                fmt = fmt.replace(
                    RegExp.$1,
                    RegExp.$1.length === 1 ? str : ('00' + str).substr(str.length)
                )
            }
        }
        return fmt
    }

    Application.Api.getDownloadVersion().then(function (response) {
        const data = response.data.data;
        const appVersion = data.appVersion;
        const cmsImgApp = data.cmsImgApp;
        let androidVersion = {
            type: "2", //（安卓）
            ver: "V2.2.4", //（版本号）
            releaseTime: 1575193997000, //（更新时间）
            build: "224", //（编译号）
            softUrl: "https://cdn.6336236.com/xwcp_test_Android_production.apk", //（下载地址）
            fileSize: "30.22" //（大小）
        };
        let iosVersion = {
            type: "1", //（IOS）
            ver: "v2.0.2",
            releaseTime: 1572661182000,
            build: "165",
            softUrl: "itms-services://?action=download-manifest&amp;url=https://app.wwwxwsy.com/xwcp.plist",
            fileSize: 0
        };
        for (let i in appVersion) {
            const type = appVersion[i].type;
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

        $('#androidLoad').attr('href', androidVersion.softUrl)

        $('.ios-block button').attr('onclick', ["install_app('", iosVersion.softUrl, "')"].join(''));

        $('.release-info').html($('#release-info-tmpl').render(iosVersion));
        $('.version').html($('#version-tmpl').render(androidVersion));
        $('.btn-trust a').attr('href', cmsImgApp.mobileprovisionUrl);

        $('.img-app-icon').attr('src', cmsImgApp.iconUrl)

        if (cmsImgApp.downloadUrl) {
            $('.ios-tj').show();
            $('.ios-download-page__link').show();
            $(".ios-download-page__link").attr("href", cmsImgApp.downloadUrl)
        }

    });
});
