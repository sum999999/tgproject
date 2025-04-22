// 将会包装事件的 debounce 函数
function debounce(func, delay, immediate) {
    var timer = null
    return function() {
        var context = this
        var args = arguments
        if (timer) clearTimeout(timer)
        if (immediate) {
            //根据距离上次触发操作的时间是否到达delay来决定是否要现在执行函数
            var doNow = !timer
            //每一次都重新设置timer，就是要保证每一次执行的至少delay秒后才可以执行
            timer = setTimeout(function() {
                timer = null
            }, delay)
            //立即执行
            if (doNow) {
                func.apply(context, args)
            }
        } else {
            timer = setTimeout(function() {
                func.apply(context, args)
            }, delay)
        }
    }
}

function escapeHtml(str) {
    if (!str) return '';
    var arrEntities = {
        lt: '<',
        gt: '>',
        nbsp: ' ',
        amp: '&',
        quot: '"',
    };
    return str.replace(/&(lt|gt|nbsp|amp|quot);/gi, function(all, t) {
        return arrEntities[t];
    });
}

/**
 * 倒计时
 */
function countDownTime(downTime) {
    let obj = {}
    let days = Math.floor(downTime / (24 * 3600 * 1000))
    //计算出小时数
    let leave1 = downTime % (24 * 3600 * 1000)
    //计算天数后剩余的毫秒数
    obj.hours = Math.floor(leave1 / (3600 * 1000)) + days * 24
    //计算相差分钟数
    let leave2 = leave1 % (3600 * 1000)
    //计算小时数后剩余的毫秒数
    obj.minutes = Math.floor(leave2 / (60 * 1000))
    //计算相差秒数
    let leave3 = leave2 % (60 * 1000)
    //计算分钟数后剩余的毫秒数
    obj.seconds = Math.round(leave3 / 1000)
    ;['hours', 'minutes', 'seconds'].forEach(item => {
        if (obj[item] < 10) obj[item] = '0' + obj[item]
    })
    return obj
}

/**
 * @description 截取两位小数(必须有两位小数)
 * @param {数值} val
 */
function splitDecimalOf2(digital) {
    if (!digital || isNaN(digital)) return `0.00`
    return `${digital}`.replace(/^\d+(\.\d{0,2})?/, function(
        match,
        p1,
        offset,
        string
    ) {
        if (!p1) return `${match}.00`
        if (p1.length <= 2) return `${match}0`
        return match
    })
}

/**
 * @description 截取n位小数(最多保留n位) 2018.12.27 by xiaojiji
 * @param {number} digital 要截取的数
 * @param {number} n 小数位数
 */
function splitDecimalOfN(digital, n) {
    if (!digital || isNaN(digital)) return 0
    return +`${digital}`.match(new RegExp(`\\d+(?:\\.\\d{0,${n}})?`))[0]
}

function copyText(text) {
    var container = document.body

    var isRTL = document.documentElement.getAttribute('dir') == 'rtl'

    var copyDom = document.getElementsByClassName('copyDom')
    if (copyDom && copyDom.length > 0) {
        container.removeChild(copyDom[0])
    }
    var fakeElem = document.createElement('textarea')
    // Prevent zooming on iOS
    fakeElem.style.fontSize = '12pt'
    // Reset box model
    fakeElem.style.border = '0'
    fakeElem.style.padding = '0'
    fakeElem.style.margin = '0'
    // Move element out of screen horizontally
    fakeElem.style.position = 'absolute'
    fakeElem.style[isRTL ? 'right' : 'left'] = '-9999px'
    // Move element to the same position vertically
    var yPosition = window.pageYOffset || document.documentElement.scrollTop
    fakeElem.style.top = yPosition + 'px'

    fakeElem.setAttribute('readonly', '')
    fakeElem.className = 'copyDom'
    fakeElem.value = text
    container.appendChild(fakeElem)
    fakeElem.select()
    fakeElem.setSelectionRange(0, fakeElem.value.length)

    window.selectedText = fakeElem.value
    var succeeded = void 0

    try {
        succeeded = document.execCommand('copy')
    } catch (err) {
        succeeded = false
    }
    return succeeded
}
/***
 * 计算汉字个数
 * @param {string} fData 需要计算的数据
 */
function CapitalLength(fData) {
    var intLength = 0
    for (var i = 0; i < fData.length; i++) {
        if (fData.charCodeAt(i) < 0 || fData.charCodeAt(i) > 255)
            intLength = intLength + 2
        else intLength = intLength + 1
    }
    return intLength
}

function loadEwmUrl() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open(
            'GET',
            '/api/v2/user/captcha.jpg?d=' + new Date().getTime(),
            true
        )
        xhr.responseType = 'arraybuffer'
        xhr.onloadend = function() {
            const headers = xhr.getAllResponseHeaders()
            if (xhr.status.toString() && !xhr.status.toString().match(/^2/)) {
                onerror && onerror(xhr)
                reject(xhr)
            } else {
                let kaptchaFlag = ''
                const options = {}
                const headers = xhr.getAllResponseHeaders()
                const m = headers.match(/^Content-Type\:\s*(.*?)$/im)
                if (m && m[1]) {
                    options.type = m[1]
                }
                const m2 = headers.match(/^kaptchaflag\:\s*(.*?)$/im)
                if (m2 && m2[1]) {
                    kaptchaFlag = m2[1]
                }
                const blob = new Blob([this.response], options)
                const blobUrl = window.URL.createObjectURL(blob)
                resolve({ url: blobUrl, kaptchaFlag })
            }
        }
        xhr.send()
    })
}

function getVersionView(viewName, version) {
    return version ? viewName + version : viewName
}

/**
 * 粘切获取图片
 */
function getPasterImg(e,callback) {
    let isChrome = false;
    let cbd = e.clipboardData;
    let ua = window.navigator.userAgent;
    //safari 直接 return
    if(!(cbd && cbd.items)) {
        return;
    }
    // Mac平台下Chrome49版本以下 复制Finder中的文件的Bug Hack掉
    if (cbd.items && cbd.items.length === 2 && cbd.items[0].kind === "string" && cbd.items[1].kind ===
        "file" &&
        cbd.types && cbd.types.length === 2 && cbd.types[0] === "text/plain" && cbd.types[1] ===
        "Files" &&
        ua.match(/Macintosh/i) && Number(ua.match(/Chrome\/(\d{2})/i)[1]) < 49) {
        return;
    }
    for(let i = 0;i<cbd.items.length;i++) {
        let item = cbd.items[i];
        if(item.kind === 'file') {
            let blob = item.getAsFile();
            if(blob.size === 0) {
                return;
            }
            //blob就是从剪切板获得的文件，可进行上传或其它操作
            // console.log('当期图片二进制',blob);
            preView(blob,callback);
        }
    }
}

function preView(blob,callback) {
    let reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = function(e) {
        callback(e.target.result,blob);
    }
}

export function uuid () {
    function S4 () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

export function createObjectURL(blob) {
    return window[window.webkitURL ? 'webkitURL' : 'URL']['createObjectURL'](blob);
}

/**
 * 格式化数字
 * @param  {[string | number]} number  [要格式化的数字]
 * @param  {[number]} decimals         [保留几位小数]
 * @param  {[string]} decPoint        [小数点符号]
 * @param  {[string]} thousands_sep    [千分位符号]
 * @param  {[string]} roundtag         [舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入]
 * @return {[string]} 格式化后的结果
 */
function numberFormat(number = 0, decimals = 2, roundtag = 'floor', decPoint = '.', thousandSep = '') {
    number = (number + '').replace(/[^0-9+-Ee.]/g, '');
    roundtag = roundtag || "floor"; //"ceil","floor","round"
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousandSep === 'undefined') ? ',' : thousandSep,
        dec = (typeof decPoint === 'undefined') ? '.' : decPoint,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + parseFloat(Math[roundtag](parseFloat((n * k).toFixed(prec*2))).toFixed(prec*2)) / k;
        };
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (!!sep) {
        var re = /(-?\d+)(\d{3})/;
        while (re.test(s[0])) {
            s[0] = s[0].replace(re, "$1" + sep + "$2");
        }
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

const supportCss3 = (style) => {
    let prefix = ['webkit', 'Moz', 'ms', 'o'],
      i,
      humpString = [],
      htmlStyle = document.documentElement.style,
      _toHumb = function (string) {
          return string.replace(/-(\w)/g, ($0, $1) => $1.toUpperCase());
      };

    for (i in prefix) { humpString.push(_toHumb(`${prefix[i]}-${style}`)); }

    humpString.push(_toHumb(style));

    for (i in humpString) { if (humpString[i] in htmlStyle) return (prefix[i] || true); }

    return false;
};

const isImgType = (fileName) => {
    if(/\.(gif|jpg|jpeg|png)$/igm.test(fileName))
    {
        return true
    }
    return false
}

const isGifType = (fileName) => {
    if(/\.(gif)$/igm.test(fileName))
    {
        return true
    }
    return false
}

const getMimeTypeByUrl = (url = '') => {
    if (url) {
        const typeArr = url.match(/\.{1}([a-z]*)\?/)
        const type = (typeArr && typeArr[0]) || 'png';
        return `image/${type}`
    }
    return `image/png`
};

const joinBase64Head = (mimeType, content) => {
    return `data:${mimeType};base64,${content}`
};

const validDataUrl = (s) => {
    const regex = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i;
    const regex2 = /^\s*blob:([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i;
    return regex.test(s) || regex2.test(s);
};

export default {
    escapeHtml,
    splitDecimalOf2,
    splitDecimalOfN,
    debounce,
    CapitalLength,
    countDownTime,
    copyText,
    loadEwmUrl,
    getVersionView,
    getPasterImg,
    uuid,
    createObjectURL,
    numberFormat,
    supportCss3,
    isImgType,
    isGifType,
    getMimeTypeByUrl,
    joinBase64Head,
    validDataUrl
}
