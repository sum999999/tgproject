import Vue from 'vue'
import util from '@/utils/utils'
import isEmpty from "lodash/isEmpty";
import * as RongYun from "@/utils/rongyun";
import numeral from 'numeral'
import Config from '@/config';
import dayjs from 'dayjs'

export function chatTextConvert(value) {
    return value + 5555
}

/**
 * 四舍五入为2位
 */
export function keepDecimalOf2(val) {
    return val ? numeral(Number(val)).format("0.00", Math.floor) : "0.00";
}

/**
 * 截取(保留)两位小数
 */
export function splitDecimalOf2(val) {
    return util.splitDecimalOf2(val)
}

/**
 * @description 截取n位小数
 * @param {number} digital 要截取的数
 * @param {number} n 小数位数
 */
export function splitDecimalOfN(val, n) {
    return util.splitDecimalOfN(val, n)
}

export function defaultStr(value, str) {
    str = str || '-';
    return isEmpty(value) ? str : value;
}

export function cutStrByLength(value, length = 7) {
    value = value || "";
    if (value.length < length) {
        return value;
    }
    return value.substr(value.length - length, length);
}

export function fixedZero(val) {
    return val * 1 < 10 ? `0${val}` : val;
}

export function chatFormateDate(value) {
    return RongYun.chatFormateDate(value);
}

export function escapeHtml(value) {
    try {
        return util.escapeHtml(value);
    } catch (e) {
        return "";
    }
}
// 后台返回的时间无论时间戳还是格式时间都需要经过处理
export function convert2LocalDateTime(value, format) {
    if (!value) {
        return
    }
    const iValue = Number(value);
    if (Number.isInteger(iValue)) {
        return dayjs(iValue).format(format || Config.dateTimeFormat);
    }
    return dayjs(value).tz(Config.timezone, true).tz().format(format || Config.dateTimeFormat)
}
// 转换本地时间到服务器默认东8区
export function convert2ServerDateTime(value, enabled = false, format) {
    if (!value) {
        return
    }
    if (!enabled) {
        return dayjs(value).format(format || Config.dateTimeFormat);
    }
    const iValue = Number(value);
    if (Number.isInteger(iValue)) {
        value = iValue;
    }
    return dayjs(value).tz(Config.timezone).format(format || Config.dateTimeFormat)
}

