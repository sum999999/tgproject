/**
 * countdown
 *
 * @description Fix the problem of pausing after ios lock screen
 *
 * @see https://blog.csdn.net/aiwo035/article/details/81708198
 *
 * @param {Number} seconds - countdown seconds
 * @param {Object} callback - countdown callback
 * @return {Number} setInterval return
 *
 * @since 1.0.0
 */
export default function countdown(seconds, callback) {
    if (typeof callback !== 'function') {
        throw new Error('countDown::argument::callback::should been function')
    }
    let count = seconds;
    let num = 0;

    const beginTime = new Date().getTime();

    let timer = setInterval(() => {
        var newTime = new Date().getTime();
        num++;
        var dTime = parseInt((newTime - beginTime) / 1000 - num);
        if (count > 0 && count <= seconds) {
            count--;
            if (count - parseInt(dTime) <= 0) {
                count = 0;
                callback(count, count * 1000)
            } else {
                const adjustCount = count - parseInt(dTime);
                callback(adjustCount, adjustCount * 1000)
            }
        } else {
            clearInterval(timer);
            num = 0;
            timer = null;
        }
    }, 1000);
    return timer
}

export function zeroPad(value) {
    return value > 9 ? `${value}` : `0${value}`;
}