const dateUtil = require('@/utils/format_date.js')

/**
 * 今天
 */
function getToday() {
    let date = new Date()
    return {
        startTime: date,
        endTime: date
    }
}

/**
 * 昨天
 */
function getYesterday() {
    let date = new Date()
    date.setDate(date.getDate() - 1)
    return {
        startTime: date,
        endTime: date
    }
}

/**
 * 本周
 */

function getThisWeek() {
    let date = new Date()
    let today = new Date(date)
    date.setDate(date.getDate() - date.getDay() + 1)
    return {
        startTime: date,
        endTime: today
    }
}

/**
 * 上周
 */

function getLastWeek() {
    let date = new Date()
    let today = new Date(date)
    date.setDate(date.getDate() - date.getDay() - 7 + 1)
    today.setDate(today.getDate() - today.getDay())
    return {
        startTime: date,
        endTime: today
    }
}

/**
 * 本月
 */
function getThisMonth() {
    let date = new Date()
    let today = new Date(date)
    date.setDate(1)
    return {
        startTime: date,
        endTime: today
    }
}

/**
 *上月
 */
function getLastMonth() {
    let date = new Date()
    let today = new Date(date)
    date.setDate(0)
    date.setDate(1)
    today.setDate(0)
    return {
        startTime: date,
        endTime: today
    }
}

module.exports = {
    0: getToday,
    1: getYesterday,
    2: getThisWeek,
    3: getLastWeek,
    4: getThisMonth,
    5: getLastMonth,
    length: 6
}
