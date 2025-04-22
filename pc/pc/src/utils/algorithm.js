import getZodiac from '@/utils/format-ball/zodica.js'

export const PCDD_COLOR = {
    green: ['1', '4', '7', '10', '16', '19', '22', '25'],
    blue: ['2', '5', '8', '11', '17', '20', '23', '26'],
    red: ['3', '6', '9', '12', '15', '18', '21', '24'],
    gray: ['0', '13', '14', '27'],
};

/**
 * 传入pcdd三位数字组成的数组，获取每个号码的颜色
 * @param number [1,2,3]
 * @return {Array}
 */
export function getPcddColor(number) {
    let arr = [],
        data = [...number],
        color = '';

    let sum = 0;
    data.forEach((item) => {
        if (item) {
            sum += Number(item);
        }
    });
    data.splice(3, 0, sum);
    for (let i = 0; i < data.length; i++) {
        let num = data[i];
        color = '';
        if (i === data.length - 1) {
            for (let key in PCDD_COLOR) {
                if (PCDD_COLOR[key].indexOf(String(num)) > -1) {
                    color = key;
                        //key === 'red' ? '#d11606' : key;
                }
            }
        }
        arr.push({
            color: color,
            value: num,
        });
    }
    arr.splice(1, 0, {symbol: true, value: '+'});
    arr.splice(3, 0, {symbol: true, value: '+'});
    arr.splice(5, 0, {symbol: true, value: '='});
    return arr;
}

export const LIU_HE_COLOR = {
    red: [
        '01',
        '02',
        '07',
        '08',
        '12',
        '13',
        '18',
        '19',
        '23',
        '24',
        '29',
        '30',
        '34',
        '35',
        '40',
        '45',
        '46',
    ],
    blue: [
        '03',
        '04',
        '09',
        '10',
        '14',
        '15',
        '20',
        '25',
        '26',
        '31',
        '36',
        '37',
        '41',
        '42',
        '47',
        '48',
    ],
    green: [
        '05',
        '06',
        '11',
        '16',
        '17',
        '21',
        '22',
        '27',
        '28',
        '32',
        '33',
        '38',
        '39',
        '43',
        '44',
        '49',
    ],
};

export function getZodiacByNum(num, time) {
    let zTxt = '',
        clr = '';
    let zodiac = getZodiac(time);
    zodiac.forEach(value => {
        if (value.data.some(vvv => vvv === num)) {
            zTxt = value.label;
        }
    });
    // 计算红波绿波蓝波
    for (var key in LIU_HE_COLOR) {
        let ob = LIU_HE_COLOR[key];
        if (ob.some(value => num === value)) {
            clr = key;
        }
    }
    return {
        zodiac: zTxt,
        color: clr,
        value: num,
    };
}

export function getLiuheColor(number, time) {
    let arr = [];
    let data = [...number];
    let len = data.length;
    let lastNumber = data[len - 1];
    let lastNumbers = [];
    let split = '+';
    if (lastNumber) {
        lastNumbers = lastNumber.split(split);
        if (lastNumbers.length > 1) {
            data[len - 1] = lastNumbers[0];
            data[len] = split;
            data[len + 1] = lastNumbers[1];
        }
    }
    data.forEach(item => {
        if (item === split) {
            arr.push({
                symbol: true,
                value: item,
            });
            return;
        }
        const {zodiac, color, value} = getZodiacByNum(item, time);
        arr.push({
            zodiac,
            color,
            value,
        });
    });

    return arr;
}

export function getNumsTotalColor(balls) {
    const len = balls.length;
    const allColor = {
        red: 0,
        blue: 0,
        green: 0,
    };
    let corwnClr;
    balls.forEach((item, index) => {
        if (Object.keys(allColor).indexOf(item.color) > -1) {
            if (index >= len - 1) {
                allColor[item.color] += 1.5;
            } else {
                allColor[item.color] += 1;
            }
        }
    });
    const allColorVal = Object.values(allColor);
    if (allColorVal.filter(item => item === 3).length === 2) {
        corwnClr = 'equal';
    } else {
        let i = 0;
        for (let key in allColor) {
            if (allColor[key] > i) {
                i = allColor[key];
                corwnClr = key;
            }
        }
    }
    return {
        color: corwnClr,
        value: getBallColorToTxt(corwnClr),
    };
}

export function getBallColorToTxt(color) {
    return color === 'equal' ? '和局' : color === 'red' ? '红波' : color === 'blue' ? '蓝波' : '绿波';
}

export const fc3d = {
    NUM_COUNT: 3,
    BIG_SMALL_COMPARE_NUM: 13,
    START_NUM: 0,
    END_NUM: 9,
};

export const pk10 = {
    NUM_COUNT: 10,
    BIG_SMALL_COMPARE_NUM: 11,
    SINGLE_BIG_SMALL_COMPARE_NUM: 5,
    START_NUM: 1,
    END_NUM: 10,
    RANK_TAB: [
        {
            id: 1,
            name: '冠军',
            ballIndex: 0,
        },
        {
            id: 2,
            name: '亚军',
            ballIndex: 1,
        },
        {
            id: 3,
            name: '第三名',
            ballIndex: 2,
        },
        {
            id: 4,
            name: '第四名',
            ballIndex: 3,
        },
        {
            id: 5,
            name: '第五名',
            ballIndex: 4,
        },
        {
            id: 6,
            name: '第六名',
            ballIndex: 5,
        },
        {
            id: 7,
            name: '第七名',
            ballIndex: 6,
        },
        {
            id: 8,
            name: '第八名',
            ballIndex: 7,
        },
        {
            id: 9,
            name: '第九名',
            ballIndex: 8,
        },
        {
            id: 10,
            name: '第十名',
            ballIndex: 9,
        },
    ],
    NUM_RANK_TAB: [
        {
            id: 1,
            name: '号码1',
            ballIndex: 0,
        },
        {
            id: 2,
            name: '号码2',
            ballIndex: 1,
        },
        {
            id: 3,
            name: '号码3',
            ballIndex: 2,
        },
        {
            id: 4,
            name: '号码4',
            ballIndex: 3,
        },
        {
            id: 5,
            name: '号码5',
            ballIndex: 4,
        },
        {
            id: 6,
            name: '号码6',
            ballIndex: 5,
        },
        {
            id: 7,
            name: '号码7',
            ballIndex: 6,
        },
        {
            id: 8,
            name: '号码8',
            ballIndex: 7,
        },
        {
            id: 9,
            name: '号码9',
            ballIndex: 8,
        },
        {
            id: 10,
            name: '号码10',
            ballIndex: 9,
        },
    ],
    LONGHU_RANK_TAB: [
        {
            id: 1,
            name: '冠军',
            ballIndex: 0,
        },
        {
            id: 2,
            name: '亚军',
            ballIndex: 1,
        },
        {
            id: 3,
            name: '第三名',
            ballIndex: 2,
        },
        {
            id: 4,
            name: '第四名',
            ballIndex: 3,
        },
        {
            id: 5,
            name: '第五名',
            ballIndex: 4,
        },
    ],
};

export const ssc = {
    NUM_COUNT: 5,
    BIG_SMALL_COMPARE_NUM: 22,
    SINGLE_BIG_SMALL_COMPARE_NUM: 4,
    START_NUM: 0,
    END_NUM: 9,
    RANK_TAB: [
        {
            id: 1,
            name: '第一球',
            ballIndex: 0,
        },
        {
            id: 2,
            name: '第二球',
            ballIndex: 1,
        },
        {
            id: 3,
            name: '第三球',
            ballIndex: 2,
        },
        {
            id: 4,
            name: '第四球',
            ballIndex: 3,
        },
        {
            id: 5,
            name: '第五球',
            ballIndex: 4,
        },
    ],
    NUM_RANK_TAB: [
        {
            id: 1,
            name: '号码0',
            ballIndex: 0,
        },
        {
            id: 2,
            name: '号码1',
            ballIndex: 1,
        },
        {
            id: 3,
            name: '号码2',
            ballIndex: 2,
        },
        {
            id: 4,
            name: '号码3',
            ballIndex: 3,
        },
        {
            id: 5,
            name: '号码4',
            ballIndex: 4,
        },
        {
            id: 6,
            name: '号码5',
            ballIndex: 5,
        },
        {
            id: 7,
            name: '号码6',
            ballIndex: 6,
        },
        {
            id: 8,
            name: '号码7',
            ballIndex: 7,
        },
        {
            id: 9,
            name: '号码8',
            ballIndex: 8,
        },
        {
            id: 10,
            name: '号码9',
            ballIndex: 9,
        },
    ],
    LONGHU_RANK_TAB: [
        {
            id: 1,
            name: '第一球',
            ballIndex: 0,
        }
    ],
};

export const _11x5 = {
    NUM_COUNT: 5,
    BIG_SMALL_COMPARE_NUM: 30,
    SINGLE_BIG_SMALL_COMPARE_NUM: 5,
    SINGLE_SUM_NUM: 11,
    SUM_NUM: 30,
    START_NUM: 1,
    END_NUM: 11,
    RANK_TAB: [
        {
            id: 1,
            name: '第一球',
            ballIndex: 0,
        },
        {
            id: 2,
            name: '第二球',
            ballIndex: 1,
        },
        {
            id: 3,
            name: '第三球',
            ballIndex: 2,
        },
        {
            id: 4,
            name: '第四球',
            ballIndex: 3,
        },
        {
            id: 5,
            name: '第五球',
            ballIndex: 4,
        },
    ],
    LONGHU_RANK_TAB: [
        {
            id: 1,
            name: '第一球',
            ballIndex: 0,
        }
    ],
};
export const ksan = {
    NUM_COUNT: 3,
    BIG_SMALL_COMPARE_NUM: 10,
    SINGLE_BIG_SMALL_COMPARE_NUM: 3,
    SUM_NUM: 9,
    START_NUM: 1,
    END_NUM: 6,
    NUM_RANK_TAB: [
        {
            id: 1,
            name: '号码1',
            ballIndex: 0,
        },
        {
            id: 2,
            name: '号码2',
            ballIndex: 1,
        },
        {
            id: 3,
            name: '号码3',
            ballIndex: 2,
        },
        {
            id: 4,
            name: '号码4',
            ballIndex: 3,
        },
        {
            id: 5,
            name: '号码5',
            ballIndex: 4,
        },
        {
            id: 6,
            name: '号码6',
            ballIndex: 5,
        },
    ],
};
export const _6hc = {
    NUM_COUNT: 7,
    BIG_SMALL_COMPARE_NUM: 175,
    SPECIAL_COMPARE_NUM: 24,
};

export const pcdd = {
    NUM_COUNT: 3,
    BIG_SMALL_COMPARE_NUM: 13,
    START_NUM: 0,
    END_NUM: 9,
    RANK_TAB: [
        {
            id: 1,
            name: '第一球',
            ballIndex: 0,
        },
        {
            id: 2,
            name: '第二球',
            ballIndex: 1,
        },
        {
            id: 3,
            name: '第三球',
            ballIndex: 2,
        }
    ],
};
export const klsf = {
    NUM_COUNT: 8,
    BIG_SMALL_COMPARE_NUM: 85,
    SINGLE_BIG_SMALL_COMPARE_NUM: 10,
    SUM_NUM: 84,
    SINGLE_SUM_NUM: 11,
    START_NUM: 1,
    END_NUM: 20,
    RANK_TAB: [
        {
            id: 1,
            name: '第一球',
            ballIndex: 0,
        },
        {
            id: 2,
            name: '第二球',
            ballIndex: 1,
        },
        {
            id: 3,
            name: '第三球',
            ballIndex: 2,
        },
        {
            id: 4,
            name: '第四球',
            ballIndex: 3,
        },
        {
            id: 5,
            name: '第五球',
            ballIndex: 4,
        },
        {
            id: 6,
            name: '第六球',
            ballIndex: 5,
        },
        {
            id: 7,
            name: '第七球',
            ballIndex: 6,
        },
        {
            id: 8,
            name: '第八球',
            ballIndex: 7,
        },
    ],
    NUM_RANK_TAB: [
        {
            id: 1,
            name: '号码1',
            ballIndex: 0,
        },
        {
            id: 2,
            name: '号码2',
            ballIndex: 1,
        },
        {
            id: 3,
            name: '号码3',
            ballIndex: 2,
        },
        {
            id: 4,
            name: '号码4',
            ballIndex: 3,
        },
        {
            id: 5,
            name: '号码5',
            ballIndex: 4,
        },
        {
            id: 6,
            name: '号码6',
            ballIndex: 5,
        },
        {
            id: 7,
            name: '号码7',
            ballIndex: 6,
        },
        {
            id: 8,
            name: '号码8',
            ballIndex: 7,
        },
        {
            id: 9,
            name: '号码9',
            ballIndex: 8,
        },
        {
            id: 10,
            name: '号码10',
            ballIndex: 9,
        },
        {
            id: 11,
            name: '号码11',
            ballIndex: 10,
        },
        {
            id: 12,
            name: '号码12',
            ballIndex: 11,
        },
        {
            id: 13,
            name: '号码13',
            ballIndex: 12,
        },
        {
            id: 14,
            name: '号码14',
            ballIndex: 13,
        },
        {
            id: 15,
            name: '号码15',
            ballIndex: 14,
        },
        {
            id: 16,
            name: '号码16',
            ballIndex: 15,
        },
        {
            id: 17,
            name: '号码17',
            ballIndex: 16,
        },
        {
            id: 18,
            name: '号码18',
            ballIndex: 17,
        },
        {
            id: 19,
            name: '号码19',
            ballIndex: 18,
        },
        {
            id: 20,
            name: '号码20',
            ballIndex: 19,
        },
    ],
    LONGHU_RANK_TAB: [
        {
            id: 1,
            name: '第一球',
            ballIndex: 0,
        },
        {
            id: 2,
            name: '第二球',
            ballIndex: 1,
        },
        {
            id: 3,
            name: '第三球',
            ballIndex: 2,
        },
        {
            id: 4,
            name: '第四球',
            ballIndex: 3,
        },
    ],
};

export function getConstantByName(code) {
    switch (code) {
        case 'pk10':
            return pk10;
        case 'ssc':
            return ssc;
        case '11x5':
            return _11x5;
        case 'ksan':
            return ksan;
        case '6hc':
            return _6hc;
        case 'pcdd':
            return pcdd;
        case 'klsf':
            return klsf;
        case 'fc3d':
            return fc3d;
        default:
            return {};
    }
}
/**
 * 开奖号码字符串转为数组
 *
 * @param {string} numStr 开奖号码的字符串形式
 * @param {string} splitSignal 分割符号
 */
export function lotNumStr2Arr(arrStr, splitStr = ',') {
    const sp_nums = arrStr.split(splitStr);
    let ret_arr = [];
    for (let idx in sp_nums) {
        const sp_num = sp_nums[idx];
        if (sp_num.includes('+')) {
            ret_arr = ret_arr.concat(sp_num.split('+').map(num => num * 1));
        } else {
            ret_arr.push(sp_num * 1);
        }
    }
    return ret_arr;
}
/**
 * 开奖号码数组内号码加零
 *
 * @param {string} numStr 开奖号码的字符串形式
 */
export function nums2Zero(arr) {
    const ret = [];
    arr.forEach(num => {
        num = num * 1;
        if (num < 10 && num >= 0) {
            ret.push(['0', num].join(''));
        } else {
            ret.push(num.toString());
        }
    });
    return ret;
}
/**
 * 判断单个数字是否为大数
 *
 * @description 判断单个数字是否为大数
 *
 * @param {Number} source
 * @param {Number} des  - 用于判断的数字，默认为5
 * @return {Boolean} true|false
 *
 * @since 1.0.0
 */
export function singleNumBig(source, des) {
    return source * 1 > des * 1;
}
/**
 * 判断单个数字是否为双
 *
 * @description 判断单个数字是否为双，
 *
 * @param {Number} source
 * @return {Boolean} true|false
 *
 * @since 1.0.0
 */
export function singleNumDouble(source) {
    return source % 2 === 0;
}
/**
 * 判断单个数字大、小、和
 *
 * @description 判断单个数字是否为大数
 *
 * @param {Number} num
 * @param {Number} compareNum  - 用于判断的数字，默认为5
 * @return {String} 大|小
 *
 * @since 1.0.0
 */
export function singleBigSmall(num, compareNum, heNum) {
    if (num === heNum) {
        return '和';
    }
    return singleNumBig(num, compareNum) ? '大' : '小';
}
/**
 * 判断单个数字是否为双
 *
 * @description 判断单个数字是否为双，
 *
 * @param {Number} num
 * @return {String} 双|单
 *
 * @since 1.0.0
 */
export function singleDouble(num, heNum) {
    if (num === heNum) {
        return '和';
    }
    return singleNumDouble(num) ? '双' : '单';
}
/**
 * 判断单个数字是否为偶
 *
 * @description 判断单个数字是否为偶，
 *
 * @param {Number} num
 * @return {String} 奇|偶
 *
 * @since 1.0.0
 */
export function singleJiOu(num, heNum) {
    if (num === heNum) {
        return '和';
    }
    return singleNumDouble(num) ? '偶' : '奇';
}
/**
 * 冠亚和信息
 *
 * @description 冠亚和信息
 *
 * @param {Array<Number>} nums
 * @param {String} cpnum  - 大小比较数
 * @return {Object}
 *
 * @since 1.0.0
 */
export function guanyaSumInfo(nums, cpnum) {
    const total = nums[0] + nums[1];
    return {
        total,
        singleDouble: singleDouble(total),
        bigSmall: singleBigSmall(total, cpnum),
    };
}
/**
 * 获取最大龙虎长度
 * @param balls
 * @return {number}
 */
export function getMaxLongHuLen(nums) {
    return Math.floor(nums.length / 2);
}
/**
 * 计算1-5龙虎
 *
 * @description 比较开奖号码中第一个与最后一个数得出龙、虎、和
 *
 * @param {Number} start
 * @param {Number} end
 * @return {String} - 龙|和|虎
 *
 * @since 1.0.0
 */
export function get1to5LongHu(start, end) {
    return start > end ? '龙' : start === end ? '和' : '虎';
}
export function getNums1to5LongHu(nums) {
    const ret = [];
    const count = Math.floor(nums.length / 2);
    for (let i = 0; i < count; i++) {
        ret.push(get1to5LongHu(nums[i], nums[nums.length - 1 - i]));
    }
    return ret;
}
/**
 * 计算号码（数组）总和
 *
 * @description 计算号码（数组）总和
 *
 * @param {Array<Number>>} nums
 * @return {Number}
 *
 * @since 1.0.0
 */
export function totalNums(nums) {
    return nums.reduce(function(a, b) {
        return Number(a) + Number(b);
    });
}
/**
 * 获取数组号码的总和数、总和单双、总和大小
 *
 * @description 获取数组号码的总和数、总和单双、总和大小
 *
 * @param {Array<Number>>} balls
 * @return {Object}
 *
 * @since 1.0.0
 */
export function getNumsTotal(nums, cpnum, heNum) {
    let total = totalNums(nums);
    return {
        total: total,
        singleDouble: singleDouble(total),
        bigSmall: singleBigSmall(total, cpnum, heNum),
    };
}
/**
 * 获取鱼虾蟹
 *
 * @description 获取鱼虾蟹
 *
 * @param {Array<Number>>} openCodeArr
 * @return {Object}
 *
 * @since 1.0.0
 */
export function getFish(nums) {
    const fishInfo = [];
    nums.forEach(ball => {
        if (ball * 1 === 1) {
            fishInfo.push({
                color: "#f12d35",
                value: '鱼'
            });
        } else if (ball * 1 === 2) {
            fishInfo.push({
                color: "#008000",
                value: '虾'
            });
        } else if (ball * 1 === 3) {
            fishInfo.push({
                color: "#0000FF",
                value: '葫芦'
            });
        } else if (ball * 1 === 4) {
            fishInfo.push({
                color: "#0000FF",
                value: '金钱'
            });
        } else if (ball * 1 === 5) {
            fishInfo.push({
                color: "#008000",
                value: '蟹'
            });
        } else if (ball * 1 === 6) {
            fishInfo.push({
                color: "#f12d35",
                value: '鸡'
            });
        }
    });
    return fishInfo;
}
/**
 * 获取前三中三后三的工具类
 * @param {Array} openCodeArr 传入的三个号码
 */
export function getThreeUtil(openCodeArr) {
    let resultArray = [];
    openCodeArr.sort((a, b) => {
        return a - b;
    });
    //计算豹子、对子
    resultArray[0] = openCodeArr[2] - openCodeArr[1] === 0 ? 1 : 0;
    resultArray[0] = openCodeArr[1] - openCodeArr[0] === 0 ? ++resultArray[0] : resultArray[0];
    //计算顺子、半顺、杂六
    resultArray[1] = openCodeArr[2] - openCodeArr[1] === 1 ? 1 : 0;
    resultArray[1] = openCodeArr[1] - openCodeArr[0] === 1 ? ++resultArray[1] : resultArray[1];

    if (openCodeArr[0] === 0) {
        if (openCodeArr[2] === 9) {
            //排序后最后一个是9，即号码中存在90，构成半顺
            if (openCodeArr[1] === 8) {
                //第二个号码是8，号码串是089，构成顺子
                resultArray[1] = 2;
            } else if (openCodeArr[1] === 1) {
                //第二个号码是81，号码串是019，构成顺子
                resultArray[1] = 2;
            } else {
                //半顺
                if (resultArray[0] === 0 && resultArray[1] === 0) {
                    //如果算出来是杂六
                    resultArray[1] = 1;
                }
            }
        }
    }
    if (+resultArray[0] === 1) {
        //对子
        return '对子';
    } else if (+resultArray[0] === 2) {
        //豹子
        return '豹子';
    } else if (+resultArray[1] === 1) {
        //半顺
        return '半顺';
    } else if (+resultArray[1] === 2) {
        //顺子
        return '顺子';
    } else {
        //杂六
        return '杂六';
    }
}

// 是否多赔率
export function isMulOdds(rates = []) {
    return rates.length > 1;
}

// layout 数组内的 balls 从字符串转换为数组
export function layoutBalls2Array(layout = {}, fieldObj = {}) {
    const layouts = layout.layout || [];
    const ballStyle = layout.ballStyle || [];
    let layoutBallKeys = [];
    if (layout.layoutBallKeys) {
        layoutBallKeys = layout.layoutBallKeys.split('|') || [];
    }
    const rates = layout.rates;
    if (isMulOdds(rates)) {
        layouts.forEach((layout, oIndex) => {
            const balls = [];
            const ballStyleObj = ballStyle[oIndex] || {};
            layout.balls.split("|").forEach((ball, iIndex) => {
                const layoutBallKey = layoutBallKeys[iIndex];
                const qwcObj = ballStyleObj[layoutBallKey] || {};
                const currentBall = rates.find(
                  rate => rate.ball === ball
                ) || {};
                if (qwcObj.joinOdd === "1") {
                    qwcObj.disDoubleOdds = `${currentBall.maxOdds}/${currentBall.minOdds}`;
                    qwcObj.retDoubleOdds = `${currentBall.maxOdds},${currentBall.minOdds}`;
                } else {
                    qwcObj.disDoubleOdds = currentBall.maxOdds;
                    qwcObj.retDoubleOdds = currentBall.maxOdds;
                }
                balls.push({
                    ball,
                    selected: false,
                    ...currentBall,
                    ...fieldObj,
                    ...qwcObj
                });
            });
            layout.balls = balls;
        });
    } else {
        layouts.forEach((layout, oIndex) => {
            const balls = [];
            layout.balls.split("|").forEach(ball => {
                balls.push({ ball, selected: false, ...fieldObj });
            });
            layout.balls = balls;
        });
    }
}
