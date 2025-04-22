function formatDate(time, type) {
    if (typeof time === 'string') {
        time = time.replace(/-/g, '/')
    }
    if (/^\d*$/igm.test(time)) {
      time = Number(time)
    }
    let date = new Date(time)
    let str = ''
    let dateArr = [
        date.getFullYear(),
        '-',
        date.getMonth() + 1,
        '-',
        date.getDate()
    ]
    let timeArr = [
        date.getHours(),
        ':',
        date.getMinutes(),
        ':',
        date.getSeconds()
    ]
    let timeArr2 = [date.getHours(), ':', date.getMinutes()]
    dateArr.forEach(item => {
        if (typeof item === 'number' && item < 10) item = '0' + item
        str += item
    })
    if (type === 'yymmddhhmmss') {
        str += ' '
        timeArr.forEach(item => {
            if (typeof item === 'number' && item < 10) item = '0' + item
            str += item
        })
    }
    if (type === 'hhmm') {
        str = ''
        timeArr2.forEach(item => {
            item = item == 0 ? '00' : item
            str += item
        })
    }
    return str
}

function formatDate2(date, fmt) {
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
                RegExp.$1.length === 1 ? str : padLeftZero(str)
            )
        }
    }
    return fmt
}

function padLeftZero(str) {
    return ('00' + str).substr(str.length)
}

export default {
    getFormatDate: formatDate,
    getFormatDate2: formatDate2
}
