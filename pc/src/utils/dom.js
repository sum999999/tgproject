/**
 *获取滚动条在y轴上的滚动距离
 */
function getScrollTop() {
    return (
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        window.pageYOffset
    )
}
/**
 *设置滚动条在y轴上的滚动距离
 */
function setScrollTop(scroll_top) {
    document.body.scrollTop = scroll_top
    document.documentElement.scrollTop = scroll_top
    window.pageYOffset = scroll_top
}
/**
 *文档总高度
 */
function getScrollHeight() {
    return document.body.scrollHeight || document.documentElement.scrollHeight
}
/**
 * 浏览器视口的高度
 */
function getWindowHeight() {
    return (
        document.body.clientHeight ||
        document.documentElement.clientHeight ||
        window.innerHeight
    )
}
/**
 * 获取元素相对于网页坐标
 */
function getElementPosition(ele) {
    let x = 0
    let y = 0
    while (ele !== null) {
        x += ele.offsetLeft
        y += ele.offsetTop
        ele = ele.offsetParent
    }
    return {
        x: x,
        y: y
    }
}

/**
 * 获取元素大小
 */
function getEleSize(ele) {
    let oStyle = ele.currentStyle ?
        ele.currentStyle :
        window.getComputedStyle(ele, null)
    return {
        width: oStyle.width,
        height: oStyle.height
    }
}

/**
 * 打开新窗口
 */
function openWin(url, w, h) {
    w = w || window.innerWidth * 0.6
    h = h || window.innerHeight * 0.9

    let top = (window.innerHeight - 10 - h) / 2 //获得窗口的垂直位置;
    let left = (window.innerWidth - 10 - w) / 2 //获得窗口的水平位置;
    let win = window.open(
        url,
        '_blank',
        'width=' + w + ',height=' + h + ', top=' + top + ', left=' + left
    )
}


function scrollTop(el, from = 0, to, duration = 500) {
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                return window.setTimeout(callback, 1000/60);
            }
        );
    }
    const difference = Math.abs(from - to);
    const step = Math.ceil(difference / duration * 50);

    function scroll(start, end, step) {
        if (start === end) return;

        let d = (start + step > end) ? end : start + step;
        if (start > end) {
            d = (start - step < end) ? end : start - step;
        }

        if (el === window) {
            window.scrollTo(d, d);
        } else {
            el.scrollTop = d;
        }
        window.requestAnimationFrame(() => scroll(d, end, step));
    }
    scroll(from, to, step);
}
export default {
    getScrollTop,
    setScrollTop,
    getScrollHeight,
    getWindowHeight,
    getElementPosition,
    getEleSize,
    openWin,
    scrollTop
}