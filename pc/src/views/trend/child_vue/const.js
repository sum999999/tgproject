import getZodiac from '@/utils/format-ball/zodica.js'
import context from "@/main";

/**
 *
 * @param {期数数组} arr
 * @param {循环的次数} cycleCount
 * @param {号码球可能的个数} number
 * @param {号码从几开始} startNum
 * @param {是否计算当前遗漏} flag
 */
const handlerTrendData = function(arr, cycleCount, number, startNum, flag) {
    var timesInfo = [] //出现次数数组
    var averMiss = [] //平均遗漏
    var maxMiss = [] //最大遗漏
    var connects = [] //连出
    if (flag) {
        var currMiss = []
    }
    for (let i = 0; i < cycleCount; i++) {
        let miss = [] //遗漏次数
        let tempConnect = []
        let times = 0 //号码出现的次数
        let count = 0 //计数器
        let connect = 0 //连出数
        for (let j = arr.length - 1; j >= 0; j--) {
            if (i === 0) {
                arr[j].trendResultNumber = []
            }
            let index = Math.floor(i / number)
            let balls = arr[j].lotteryNumber.split(',')
            arr[j].trendNumbers = balls
            if (balls[index] * 1 !== i % number + startNum) {
                count++
                arr[j].trendResultNumber.push(count)
            } else {
                times++
                miss.push(count)
                count = 0
                let info = {
                    content: balls[index] * 1,
                    clr:
                        Math.floor(i / number) % 2 === 0
                            ? '#3f99f2'
                            : '#FF0000',
                    num: index + 1
                }
                arr[j].trendResultNumber.push(info)
                connect++
                if (j > 0) {
                    for (let k = j - 1; k >= 0; k--) {
                        let nextBalls = arr[k].lotteryNumber.split(',')
                        if (balls[index] * 1 === nextBalls[index] * 1) {
                            connect++
                        } else {
                            tempConnect.push(connect)
                            connect = 0
                            break
                        }
                    }
                }
            }
            if (j === 0) {
                miss.push(count)
                // !tempConnect.length && tempConnect.push(0)
                if (!tempConnect.length) {
                    balls[index] * 1 === i % number + startNum
                        ? tempConnect.push(1)
                        : tempConnect.push(0)
                }
            }
        }
        maxMiss.push(Math.max(...miss))
        // averMiss.push(times ? ((arr.length - times) / times).toFixed(1) : 0)
        let tim = `${(arr.length - times) / times}`
        averMiss.push(
            times ? (tim.includes('.') ? (+tim).toFixed(1) : tim) : arr.length
        )
        if (flag) {
            currMiss.push(count)
        }
        timesInfo.push(times)
        connects.push(Math.max(...tempConnect))
    }
    arr.trendTimesInfo = timesInfo
    arr.trendAverMiss = averMiss
    arr.trendMaxMiss = maxMiss
    arr.trendConnects = connects
    if (flag) {
        arr.currMiss = currMiss
    }
    return arr
}
const CONFIG_KSAN = {
    // 快三
    recordTitle: [
        {
            title: context.$tex('期数')
        },
        {
            title: context.$tex('显示号码')
        },
        {
            title: context.$tex('总和'),
            colspan: 3
        },
        {
            title: context.$tex('鱼虾蟹'),
            colspan: 3
        }
    ],
    handlerRecordList: function(recordList) {
        recordList.forEach(item => {
            let sum = 0
            let ballsInfo = []
            let fishInfo = []
            let balls = item.lotteryNumber.split(',')
            balls.forEach(ball => {
                sum += ball * 1
                ballsInfo.push(ball)
                if (ball * 1 === 1) {
                    fishInfo.push(context.$tex('鱼'))
                } else if (ball * 1 === 2) {
                    fishInfo.push(context.$tex('虾'))
                } else if (ball * 1 === 3) {
                    fishInfo.push(context.$tex('葫芦'))
                } else if (ball * 1 === 4) {
                    fishInfo.push(context.$tex('金钱'))
                } else if (ball * 1 === 5) {
                    fishInfo.push(context.$tex('蟹'))
                } else if (ball * 1 === 6) {
                    fishInfo.push(context.$tex('鸡'))
                }
            })
            let sumInfo = {
                content: '',
                smallLarge: '',
                singleDouble: ''
            }
            sumInfo.content = sum
            sumInfo.smallLarge = sum > 10 ? context.$tex('大') : context.$tex('小')
            sumInfo.singleDouble = sum % 2 === 0 ? context.$tex('双') : context.$tex('单')
            item.trendNumbers = ballsInfo
            item.sumInfo = sumInfo
            item.fishInfo = fishInfo
        })
        return recordList
    }
}

const CONFIG_PCDD = {
    // pc蛋蛋
    recordTitle: [
        //表格标题
        {
            title: context.$tex('期号')
        },
        {
            title: context.$tex('开奖号码')
        },

        {
            title: context.$tex('单双')
        },
        {
            title: context.$tex('大小')
        },
        {
            title: context.$tex('色波')
        }
    ],
    PCDD: {
        green: ['1', '4', '7', '10', '16', '19', '22', '25'],
        blue: ['2', '5', '8', '11', '17', '20', '23', '26'],
        red: ['3', '6', '9', '12', '15', '18', '21', '24'],
        gray: ['0', '13', '14', '27']
    },
    setColor: function(ball) {
        // 获取号码球的颜色
        let clr
        for (var key in CONFIG_PCDD.PCDD) {
            if (CONFIG_PCDD.PCDD[key].some(item => item === ball + '')) {
                clr = key
                break
            }
        }
        return clr
    },
    size: function(sum) {
        let txt = ''
        if (sum <= 5) {
            txt = context.$tex('极小')
        } else if (sum <= 13) {
            txt = context.$tex('小')
        } else if (sum <= 21) {
            txt = context.$tex('大')
        } else {
            txt = context.$tex('极大')
        }
        return {
            content: txt,
            isLarge: sum > 13 && sum <= 21 ? true : false
        }
    },
    handlerRecordList: function(ballsInfo) {
        //开奖历史数据
        ballsInfo.forEach(item => {
            let balls = item.lotteryNumber.split(',')
            let sum = 0
            let ballsInfo = []
            let ballsResultNumber = []
            balls.forEach((ball, index) => {
                sum += ball * 1
                index === 2
                    ? ballsInfo.push(ball, '=')
                    : ballsInfo.push(ball, '+')
            })
            ballsInfo.push(sum)
            let sumInfo = CONFIG_PCDD.size(sum)
            let singleDouble =
                sum % 2 === 0
                    ? { isDouble: true, content: context.$tex('双') }
                    : { isDouble: false, content: context.$tex('单') }
            item.trendNumbers = ballsInfo
            ballsResultNumber.push(
                singleDouble,
                sumInfo,
                CONFIG_PCDD.setColor(sum)
            )
            item.trendResultNumber = ballsResultNumber
        })
        return ballsInfo
    }
}

const CONFIG_6HC = {
    // 六合彩
    recordTitle: [
        {
            title: context.$tex('期号'),
            rowspan: 2
        },
        {
            title: context.$tex('开奖号码'),
            rowspan: 2
        },
        {
            title: context.$tex('总和'),
            colspan: 4
        },
        {
            title: context.$tex('特码'),
            colspan: 5
        }
    ],
    openBalls: [
        context.$tex('总和'),
        context.$tex('单双'),
        context.$tex('大小'),
        context.$tex('波色'),
        context.$tex('特别号'),
        context.$tex('单双'),
        context.$tex('大小'),
        context.$tex('生肖'),
        context.$tex('波色')
    ],
    setColor: function(ball) {
        //波色
        let clr
        for (var key in CONFIG_6HC.LIU_HE) {
            if (CONFIG_6HC.LIU_HE[key].some(item => item === ball)) {
                clr = key
                break
            }
        }
        return clr
    },
    LIU_HE: {
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
            '46'
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
            '48'
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
            '49'
        ]
    },
    setZodiac(data, ball) {
        //获取生肖
        let zodiac = getZodiac(data.endTime)
        // debugger;
        let zTxt
        zodiac.forEach(value => {
            if (value.data.some(vvv => vvv === ball)) {
                zTxt = value.label
            }
            if (zTxt) return
        })
        return zTxt
    },
    handlerRecordList: function(ballsInfo) {
        ballsInfo.forEach(item => {
            let balls = item.lotteryNumber.replace('+', ',').split(',')
            let sum = 0
            let ballsInfo = []
            let trendResultNumber = []
            let sumInfo = {
                content: 0,
                singleDouble: '',
                smallLarge: '',
                clr: ''
            }
            let sumClrInfo = {
                red: 0,
                blue: 0,
                green: 0
            }
            let specialBallInfo = {
                content: '',
                singleDouble: '',
                smallLarge: '',
                zodiac: '',
                ballClr: ''
            }
            balls.forEach((ball, index) => {
                sum += ball * 1
                let ballInfo = {}
                let clr = CONFIG_6HC.setColor(ball)
                ballsInfo.push({
                    content: ball,
                    zodiac: CONFIG_6HC.setZodiac(item.endTime, ball),
                    clr:
                        clr === 'red'
                            ? context.$tex('红波')
                            : clr === 'blue' ? context.$tex('蓝波') : context.$tex('绿波'),
                    clrFlag: clr
                })
                if (index === balls.length - 2) {
                    ballsInfo.push('+')
                }
                if (index === balls.length - 1) {
                    //特码
                    specialBallInfo.content = ball
                    specialBallInfo.singleDouble = ball % 2 === 0 ? context.$tex('双') : context.$tex('单')
                    specialBallInfo.smallLarge = ball <= 24 ? context.$tex('小') : context.$tex('大')
                    specialBallInfo.zodiac = CONFIG_6HC.setZodiac(
                        item.endTime,
                        ball
                    )
                    specialBallInfo.ballClr =
                        clr === 'red'
                            ? context.$tex('红波')
                            : clr === 'blue' ? context.$tex('蓝波') : context.$tex('绿波')
                    sumClrInfo[CONFIG_6HC.setColor(ball)] += 1.5
                } else {
                    sumClrInfo[CONFIG_6HC.setColor(ball)]++
                }
            })
            sumInfo.content = sum
            sumInfo.singleDouble = sum % 2 === 0 ? context.$tex('双') : context.$tex('单')
            sumInfo.smallLarge = sum >= 175 ? context.$tex('大') : context.$tex('小')
            if (
                Object.values(sumClrInfo).filter(item => item === 3).length ===
                2
            ) {
                sumInfo.clr = context.$tex('和局')
            } else {
                let maxClr = Math.max(...Object.values(sumClrInfo))
                for (let i of Object.keys(sumClrInfo)) {
                    //总和的波色
                    if (sumClrInfo[i] === maxClr) {
                        sumInfo.clr =
                            i === 'red'
                                ? context.$tex('红波')
                                : i === 'blue' ? context.$tex('蓝波') : context.$tex('绿波')
                        break
                    }
                }
            }
            item.trendNumbers = ballsInfo
            item.sumInfo = sumInfo
            item.specialBallInfo = specialBallInfo
        })
        // console.log(ballsInfo);
        return ballsInfo
    }
}

const CONFIG_QTCP = {
    // 上海时时乐
    openBalls: [, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        .join(',')
        .repeat(3)
        .split(',')
        .slice(1),
    trendTitle: [
        {
            title: context.$tex('期号'),
            rowspan: 2
        },
        {
            title: context.$tex('开奖号码'),
            rowspan: 2,
            colspan: 5
        },
        {
            title: context.$tex('百位走势'),
            colspan: 10
        },
        {
            title: context.$tex('十位走势'),
            colspan: 10
        },
        {
            title: context.$tex('个位走势'),
            colspan: 10
        }
    ],
    statCategory: [
        {
            title: context.$tex('统计类型'),
            rowspan: 2,
            colspan: 4
        },
        {
            title: context.$tex('百位走势'),
            colspan: 10
        },
        {
            title: context.$tex('十位走势'),
            colspan: 10
        },
        {
            title: context.$tex('个位走势'),
            colspan: 10
        }
    ],
    getBaseTrendData: function(arr) {
        //基本走势
        return handlerTrendData(arr, 30, 10, 0, false)
        // var result = {};
        // var timesInfo = []; //出现次数数组
        // var averMiss = []; //平均遗漏
        // var maxMiss = []; //最大遗漏
        // var connects = []; //连出
        // for (let i = 0; i < 30; i++) {
        // 	let miss = []; //遗漏次数
        // 	let tempConnect = [];
        // 	let times = 0; //号码出现的次数
        // 	let count = 0; //计数器
        // 	let connect = 0; //连出数
        // 	for (let j = arr.length - 1; j >= 0; j--) {
        // 		if (i === 0) {
        // 			arr[j].trendResultNumber = [];
        // 		}
        // 		let index = Math.floor(i / 10);
        // 		let balls = arr[j].lotteryNumber.split(',');
        // 		arr[j].trendNumbers = balls;
        // 		if (balls[index] * 1 !== (i % 10)) {
        // 			count++;
        // 			arr[j].trendResultNumber.push(count);
        // 		} else {
        // 			times++;
        // 			miss.push(count);
        // 			count = 0;
        // 			let info = {
        // 				content: balls[index] * 1,
        // 				clr: Math.floor(i / 10) % 2 === 0 ? "#3f99f2" : "#FF0000",
        // 				num: index + 1
        // 			}
        // 			arr[j].trendResultNumber.push(info);
        // 			connect++;
        // 			if (j > 0) {
        // 				for (let k = j - 1; k >= 0; k--) {
        // 					let nextBalls = arr[k].lotteryNumber.split(',');
        // 					if (balls[index] * 1 === nextBalls[index] * 1) {
        // 						connect++;
        // 					} else {
        // 						tempConnect.push(connect);
        // 						connect = 0;
        // 						break;
        // 					}
        // 				}
        // 			}
        // 		}
        // 		if (j === 0) {
        // 			miss.push(count);
        // 			!tempConnect.length && tempConnect.push(0);
        // 		}
        // 	}
        // 	maxMiss.push(Math.max(...miss));
        // 	averMiss.push(
        // 		times ? ((arr.length - times) / times).toFixed(1) : 0
        // 	);
        // 	timesInfo.push(times);
        // 	connects.push(Math.max(...tempConnect));
        // }
        // arr.trendTimesInfo = timesInfo;
        // arr.trendAverMiss = averMiss;
        // arr.trendMaxMiss = maxMiss;
        // arr.trendConnects = connects;
        // return arr;
    }
}

const CONFIG_JWC = {
    //境外彩
    //开奖历史
    subTitle: [context.$tex('今日双面/号码统计'), context.$tex('长龙统计'), context.$tex('号码分析')],
    ballsNum: [
        context.$tex('号码0'),
        context.$tex('号码1'),
        context.$tex('号码2'),
        context.$tex('号码3'),
        context.$tex('号码4'),
        context.$tex('号码5'),
        context.$tex('号码6'),
        context.$tex('号码7'),
        context.$tex('号码8'),
        context.$tex('号码9')
    ],
    isActiveNumber: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1], //切换球号
    singleDouble: [context.$tex('单'), context.$tex('双'), context.$tex('大'), context.$tex('小'), context.$tex('对子号'), context.$tex('还原')],
    ranksFlag: [true, true, true, true, true, true], //筛选名次按钮--综合模式
    twoSideFlag: [true, true, true, true, true, true, true], //筛选名次--两面模式
    roadBeadsFlag: [true, true, true], //筛选路珠按钮--综合模式
    singleBeadsFlag: [true, true], //单选模式下筛选路珠--单选模式
    roadBeads: [
        [context.$tex('大小'), context.$tex('单双'), context.$tex('龙虎')], //筛选路珠--综合模式
        [context.$tex('大小'), context.$tex('单双')], //筛选路珠--单选模式
        [context.$tex('大小'), context.$tex('单双'), context.$tex('龙虎')] //-筛选路珠-两面模式
    ],
    choiceResult: [
        {
            //第一球
            count: 1,
            flag: 'true'
        },
        {
            count: 1,
            flag: 'false'
        },
        {
            count: 1,
            flag: 'true'
        },
        {
            //第二球
            count: 1,
            flag: 'true'
        },
        {
            count: 1,
            flag: 'false'
        },
        {
            //第三球
            count: 1,
            flag: 'true'
        },
        {
            count: 1,
            flag: 'false'
        },
        {
            //第四球
            count: 1,
            flag: 'true'
        },
        {
            count: 1,
            flag: 'false'
        },
        {
            //第五球
            count: 1,
            flag: 'true'
        },
        {
            count: 1,
            flag: 'false'
        },
        {
            //总和
            count: 1,
            flag: 'true'
        },
        {
            count: 1,
            flag: 'false'
        }
    ],
    counts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //item出现的次数
    //开奖记录的标题
    titleInfo: {
        // code: 'ssc',
        time: context.$tex('时间'),
        periodNo: context.$tex('期数'),
        otherOne: [context.$tex('显示号码'), context.$tex('显示大小'), context.$tex('显示单双')],
        otherTwo: [
            {
                colspan: 3,
                title: context.$tex('总和')
            },
            {
                title: context.$tex('1-5龙虎')
            }
        ]
    },
    //路珠
    ranks: [
        [context.$tex('第一球'), context.$tex('第二球'), context.$tex('第三球'), context.$tex('第四球'), context.$tex('第五球'), context.$tex('总和')], //筛选名次--综合模式
        [context.$tex('第一球'), context.$tex('第二球'), context.$tex('第三球'), context.$tex('第四球'), context.$tex('第五球')], //筛选名次--单选模式
        [context.$tex('第一球'), context.$tex('第二球'), context.$tex('第三球'), context.$tex('第四球'), context.$tex('第五球'), context.$tex('总和'), context.$tex('龙虎')] //筛选名次-两面模式
    ],
    //走势
    openBalls: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      .join('')
      .repeat(5)
      .split(''),
    color: ['#3f99f2', '#FF0000'],
    trendTitle: [
        //走势标题
        {
            title: context.$tex('期号'),
            rowspan: 2
        },
        {
            title: context.$tex('开奖号码'),
            rowspan: 2,
            colspan: 5
        },
        {
            colspan: 10,
            title: context.$tex('万位走势')
        },
        {
            colspan: 10,
            title: context.$tex('千位走势')
        },
        {
            colspan: 10,
            title: context.$tex('百位走势')
        },
        {
            colspan: 10,
            title: context.$tex('十位走势')
        },
        {
            colspan: 10,
            title: context.$tex('个位走势')
        }
    ],
    statCategory: [
        {
            title: context.$tex('统计类型'),
            rowspan: 2,
            colspan: 6
        },
        {
            title: context.$tex('万位走势'),
            colspan: 10
        },
        {
            title: context.$tex('千位走势'),
            colspan: 10
        },
        {
            title: context.$tex('百位走势'),
            colspan: 10
        },
        {
            title: context.$tex('十位走势'),
            colspan: 10
        },
        {
            title: context.$tex('个位走势'),
            colspan: 10
        }
    ],
    getDescribe: function(openCodeArr) {
        let resultArray = []
        openCodeArr.sort((a, b) => {
            return a - b
        })
        //计算豹子、对子
        resultArray[0] = openCodeArr[2] - openCodeArr[1] == 0 ? 1 : 0
        resultArray[0] =
          openCodeArr[1] - openCodeArr[0] == 0
            ? ++resultArray[0]
            : resultArray[0]
        //计算顺子、半顺、杂六
        resultArray[1] = openCodeArr[2] - openCodeArr[1] == 1 ? 1 : 0
        resultArray[1] =
          openCodeArr[1] - openCodeArr[0] == 1
            ? ++resultArray[1]
            : resultArray[1]

        // if (openCodeArr[0] === 0) {
        //     if (openCodeArr[2] === 9) {
        //         //排序后最后一个是9，即号码中存在90，构成半顺
        //         if (fopenCodeArr[1] === 8) {
        //             //第二个号码是8，号码串是089，构成顺子
        //             resultArray[1] = 2
        //         } else if (openCodeArr[1] === 1) {
        //             //第二个号码是81，号码串是019，构成顺子
        //             resultArray[1] = 2
        //         } else {
        //             //半顺
        //             if (resultArray[0] === 0 && resultArray[1] === 0) {
        //                 //如果算出来是杂六
        //                 resultArray[1] = 1
        //             }
        //         }
        //     }
        // }
        // 2019.7.10 by xiaojiji
        if (Number(openCodeArr[0]) === 0) {
            if (Number(openCodeArr[2]) === 9) {
                //排序后最后一个是9，即号码中存在90，构成半顺
                if (Number(openCodeArr[1]) === 8) {
                    //第二个号码是8，号码串是089，构成顺子
                    resultArray[1] = 2
                } else if (Number(openCodeArr[1]) === 1) {
                    //第二个号码是81，号码串是019，构成顺子
                    resultArray[1] = 2
                } else {
                    //半顺
                    if (resultArray[0] === 0 && resultArray[1] === 0) {
                        //如果算出来是杂六
                        resultArray[1] = 1
                    }
                }
            }
        }
        if (resultArray[0] == 1) {
            //对子
            return {
                clr: 'blue',
                content: context.$tex('对子')
            }
        } else if (resultArray[0] == 2) {
            //豹子
            return {
                clr: 'blue',
                content: context.$tex('豹子')
            }
        } else if (resultArray[1] == 1) {
            //半顺
            return context.$tex('半顺')
        } else if (resultArray[1] == 2) {
            //顺子
            return {
                clr: 'blue',
                content: context.$tex('顺子')
            }
        } else {
            //杂六
            return context.$tex('杂六')
        }
    },
    getMixinInfo: function(results) {
        //总和-第一球-第五球-单双统计 返回的开奖结果列表
        let all = ['sum', 'one', 'two', 'three', 'four', 'five']
        let name = [context.$tex('总和'), context.$tex('第一球'), context.$tex('第二球'), context.$tex('第三球'), context.$tex('第四球'), context.$tex('第五球')]
        let desc = [context.$tex('单'), context.$tex('双'), context.$tex('大'), context.$tex('小')]
        let info = []
        for (let i = 0; i < 24; i++) {
            info.push(0)
        }
        for (let j = 0; j < 5; j++) {
            desc = desc.concat([context.$tex('单'), context.$tex('双'), context.$tex('大'), context.$tex('小')])
        }
        results.forEach(item => {
            let balls = item.lotteryNumber.split(',')
            let sum = 0
            balls.forEach((ball, index) => {
                sum += ball * 1
                if ((ball * 1) % 2 === 0) {
                    info[4 * (index + 1) + 1]++
                } else {
                    info[4 * (index + 1) + 0]++
                }
                if (ball * 1 > 5) {
                    info[4 * (index + 1) + 2]++
                } else {
                    info[4 * (index + 1) + 3]++
                }
            })
            if (sum % 2 === 0) {
                info[1]++
            } else {
                info[0]++
            }
            if (sum > 22) {
                info[2]++
            } else {
                info[3]++
            }
        })
        let mixinInfo = {
            count: info,
            name: name,
            desc: desc
        }
        return mixinInfo
    },
    getTwo: function(arr) {
        //对子分布
        for (let k = 0; k < 5; k++) {
            for (let i = 0, len = arr.length; i < len; i++) {
                for (let j = i + 1; j < arr.length; j++) {
                    //号码
                    if (
                      arr[i].ballsInfo.lotteryNumbers[k].content ===
                      arr[j].ballsInfo.lotteryNumbers[k].content
                    ) {
                        arr[i].ballsInfo.lotteryNumbers[k].double = true
                        arr[j].ballsInfo.lotteryNumbers[k].double = true
                    } else {
                        break
                    }
                }
                for (let j = i + 1; j < arr.length; j++) {
                    //大小
                    if (
                      arr[i].ballsInfo.sizes[k].number ===
                      arr[j].ballsInfo.sizes[k].number
                    ) {
                        arr[i].ballsInfo.sizes[k].double = true
                        arr[j].ballsInfo.sizes[k].double = true
                    } else {
                        break
                    }
                }
                for (let j = i + 1; j < arr.length; j++) {
                    //单双
                    if (
                      arr[i].ballsInfo.singles[k].number ===
                      arr[j].ballsInfo.singles[k].number
                    ) {
                        arr[i].ballsInfo.singles[k].double = true
                        arr[j].ballsInfo.singles[k].double = true
                    } else {
                        break
                    }
                }
            }
        }
    },
    getBallCount: function(balls) {
        //单个号码出现的次数
        let ballsCount = []
        for (let i = 0, len = 10; i < len; i++) {
            ballsCount.push({
                num: i,
                count: balls.filter(item => item == i).length
            })
        }
        return ballsCount
    },
    getLongData: function(arr) {
        //长龙统计
        let info = []
        for (let i = 0; i < 5; i++) {
            for (let j = 1; j < arr.length; j++) {
                //大小
                if (
                  arr[j].ballsInfo.sizes[i].content !==
                  arr[0].ballsInfo.sizes[i].content &&
                  j === 1
                ) {
                    break
                } else if (
                  arr[j].ballsInfo.sizes[i].content !==
                  arr[0].ballsInfo.sizes[i].content &&
                  j > 1
                ) {
                    info.push({
                        title: context.$tex("第{num}球", { num: i + 1 }),
                        content: arr[0].ballsInfo.sizes[i].content + j + context.$tex('期'),
                        count: j
                    })
                    break
                }
            }
            for (let j = 1; j < arr.length; j++) {
                //单双
                if (
                  arr[j].ballsInfo.singles[i].content !==
                  arr[0].ballsInfo.singles[i].content &&
                  j === 1
                ) {
                    break
                } else if (
                  arr[j].ballsInfo.singles[i].content !==
                  arr[0].ballsInfo.singles[i].content &&
                  j > 1
                ) {
                    info.push({
                        title: context.$tex("第{num}球", { num: i + 1 }),
                        content: arr[0].ballsInfo.singles[i].content + j + context.$tex('期'),
                        count: j
                    })
                    break
                }
            }
        }

        //龙虎和
        let status = arr[0].sumInfo.long
        for (let j = 1; j < arr.length; j++) {
            if (arr[j].sumInfo.long !== status && j === 1) {
                break
            } else if (arr[j].sumInfo.long !== status && j > 1) {
                info.push({
                    title: context.$tex('第1球'),
                    content: status + j + context.$tex('期'),
                    count: j
                })
                break
            }
        }

        //总和
        let firstSingle = arr[0].sumInfo.single
        let size = arr[0].sumInfo.small
        for (let j = 1; j < arr.length; j++) {
            //单双
            if (arr[j].sumInfo.single !== firstSingle && j === 1) {
                break
            } else if (arr[j].sumInfo.single !== firstSingle && j > 1) {
                info.push({
                    title: context.$tex('总和'),
                    content: firstSingle + j + context.$tex('期'),
                    count: j
                })
                break
            }
        }
        for (let j = 1; j < arr.length; j++) {
            //大小
            if (arr[j].sumInfo.small !== size && j === 1) {
                break
            } else if (arr[j].sumInfo.small !== size && j > 1) {
                info.push({
                    title: context.$tex('总和'),
                    content: size + j + context.$tex('期'),
                    count: j
                })
                break
            }
        }
        //排序
        info.sort((a, b) => {
            return b.count - a.count
        })
        return info
    },
    handlerRecordList: function(arr) {
        //开奖记录
        let ballContainer = []
        arr.forEach(item => {
            let balls = item.lotteryNumber.split(',')
            // let balls = item.lotteryNumber.split(',');
            let threeInfo = []
            let preThree = [balls[0], balls[1], balls[2]]
            let midThree = [balls[1], balls[2], balls[3]]
            let nextThree = [balls[2], balls[3], balls[4]]
            threeInfo[0] = CONFIG_JWC.getDescribe(preThree)
            threeInfo[1] = CONFIG_JWC.getDescribe(midThree)
            threeInfo[2] = CONFIG_JWC.getDescribe(nextThree)
            item.threeInfo = threeInfo
            ballContainer = ballContainer.concat(balls) //号码出现次数
            let sum = 0
            let [lotteryNumbers, sizes, singles] = [[], [], []]
            let ballsInfo = {}
            balls.forEach(ball => {
                sum += ball * 1
                let lotteryNumber = {
                    content: ball * 1,
                    single: ball % 2 === 0 ? false : true, //单双
                    small: ball * 1 > 4 ? false : true, //大小
                    double: false //对子
                }
                let size = {
                    number: ball * 1,
                    content: lotteryNumber.small ? context.$tex('小') : context.$tex('大'),
                    single: lotteryNumber.single, //单双
                    small: lotteryNumber.small, //大小
                    clr: lotteryNumber.small ? '#7f8ab0' : '#f9982e',
                    double: false //对子
                }
                let single = {
                    number: ball * 1,
                    content: lotteryNumber.single ? context.$tex('单') : context.$tex('双'),
                    single: lotteryNumber.single, //单双
                    small: lotteryNumber.small, //大小
                    clr: lotteryNumber.single ? '#7f8ab0' : '#f9982e',
                    double: false //对子
                }
                lotteryNumbers.push(lotteryNumber)
                sizes.push(size)
                singles.push(single)
            })
            ballsInfo.lotteryNumbers = lotteryNumbers
            ballsInfo.sizes = sizes
            ballsInfo.singles = singles
            let sumInfo = {
                sum: sum,
                small: sum > 22 ? context.$tex('大') : context.$tex('小'),
                single: sum % 2 === 0 ? context.$tex('双') : context.$tex('单'),
                sumClr: sum > 22 ? 'blue' : 'red',
                smallClr: sum > 22 ? 'blue' : 'red',
                singleClr: sum % 2 === 0 ? 'blue' : 'red',
                long:
                  balls[0] - balls[balls.length - 1] > 0
                    ? context.$tex('龙')
                    : balls[0] - balls[balls.length - 1] < 0 ? context.$tex('虎') : context.$tex('和')
            }
            item.sumInfo = sumInfo
            item.ballsInfo = ballsInfo
        })
        arr.totalNumCount = CONFIG_JWC.getBallCount(ballContainer) //号码出现的次数
        arr.mixinInfo = CONFIG_JWC.getMixinInfo(arr) //总和第一-第五球的单双大小统计
        arr.longData = CONFIG_JWC.getLongData(arr) //长龙统计
        CONFIG_JWC.getTwo(arr)
        return arr
    },
    analyRoadBeads: function(arr) {
        let roadBeadsList = []
        //第i球单双
        for (let i = 0; i < 5; i++) {
            let ballsInfo = {}
            let infoArray = [] //单双
            let oneCount = 0 //第i球单的个数
            let twoCount = 0 //第i球双的个数
            one: for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let singleInfo = {
                    clr: '#999',
                    content: context.$tex('单'),
                    flag: true, //真表示单
                    count: 1, //出现次数
                    choiceCount: -1,
                    choiceFlag: null
                }
                let doubleInfo = {
                    clr: '#be1204',
                    content: context.$tex('双'),
                    flag: false, //假表示双
                    count: 1, //出现次数
                    choiceCount: -1,
                    choiceFlag: null
                }
                for (let k = j + 1; k < arr.length; k++) {
                    let nextBalls = arr[k].lotteryNumber
                      .split(',')
                      .map(item => {
                          return item * 1
                      })
                    if (balls[i] % 2 === 0 && nextBalls[i] % 2 === 0) {
                        doubleInfo.content += context.$tex('双')
                        doubleInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(doubleInfo)
                            break one
                        }
                    } else if (balls[i] % 2 !== 0 && nextBalls[i] % 2 !== 0) {
                        singleInfo.content += context.$tex('单')
                        singleInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(singleInfo)
                            break one
                        }
                    } else {
                        if (balls[i] % 2 === 0) {
                            infoArray.push(doubleInfo)
                        } else {
                            infoArray.push(singleInfo)
                        }
                        j = k - 1
                        break
                    }
                }
                if (j === arr.length - 1) {
                    //最后一个加上
                    if (balls[i] % 2 === 0) {
                        infoArray.push(doubleInfo)
                    } else {
                        infoArray.push(singleInfo)
                    }
                }
            }
            //单双出现次数
            for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                if (balls[i] % 2 !== 0) {
                    oneCount++
                } else {
                    twoCount++
                }
            }
            ballsInfo.index = `第${i + 1}球`
            ballsInfo.ballIndex = i //第几球
            ballsInfo.isSingleDouble = true
            ballsInfo.roadBeadsIndex = 1 //大小、单双、龙虎顺序
            ballsInfo.choice = [
                //下拉框
                {
                    title: context.$tex('单'),
                    flag: 'true'
                },
                {
                    title: context.$tex('双'),
                    flag: 'false'
                }
            ]
            ballsInfo.name = context.$tex('单双')
            ballsInfo.oneName = context.$tex('单')
            ballsInfo.twoName = context.$tex('双')
            ballsInfo.oneCount = oneCount
            ballsInfo.twoCount = twoCount
            ballsInfo.rank = i === 0 ? i : 2 * i + 1
            ballsInfo.infoArray = infoArray
            roadBeadsList.push(ballsInfo)
        }

        //第i球大小
        for (let i = 0; i < 5; i++) {
            let ballsInfo = {}
            let infoArray = [] //大小
            let oneCount = 0 //第i球小的个数
            let twoCount = 0 //第i球大的个数
            one: for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let smallInfo = {
                    clr: '#999',
                    content: context.$tex('小'),
                    flag: true,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                let largeInfo = {
                    clr: '#be1204',
                    content: context.$tex('大'),
                    flag: false,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                for (let k = j + 1; k < arr.length; k++) {
                    let nextBalls = arr[k].lotteryNumber
                      .split(',')
                      .map(item => {
                          return item * 1
                      })
                    if (balls[i] > 4 && nextBalls[i] > 4) {
                        largeInfo.content += context.$tex('大')
                        largeInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(largeInfo)
                            break one
                        }
                    } else if (balls[i] <= 4 && nextBalls[i] <= 4) {
                        smallInfo.content += context.$tex('小')
                        smallInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(smallInfo)
                            break one
                        }
                    } else {
                        if (balls[i] > 4) {
                            infoArray.push(largeInfo)
                        } else {
                            infoArray.push(smallInfo)
                        }
                        j = k - 1
                        break
                    }
                }
                if (j === arr.length - 1) {
                    //最后一个加上
                    if (balls[i] > 4) {
                        infoArray.push(largeInfo)
                    } else {
                        infoArray.push(smallInfo)
                    }
                }
            }
            for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                if (balls[i] < 5) {
                    oneCount++
                } else {
                    twoCount++
                }
            }
            ballsInfo.index = `第${i + 1}球`
            ballsInfo.isSmallLarge = true
            ballsInfo.ballIndex = i //第几球
            ballsInfo.roadBeadsIndex = 0
            ballsInfo.name = context.$tex('大小')
            ballsInfo.choice = [
                //下拉框
                {
                    title: context.$tex('大'),
                    flag: 'false'
                },
                {
                    title: context.$tex('小'),
                    flag: 'true'
                }
            ]
            ballsInfo.oneCount = oneCount
            ballsInfo.twoCount = twoCount
            ballsInfo.oneName = context.$tex('小')
            ballsInfo.twoName = context.$tex('大')
            ballsInfo.rank = i === 0 ? i + 1 : (i + 1) * 2
            ballsInfo.infoArray = infoArray
            roadBeadsList.push(ballsInfo)
        }
        //第1球龙虎
        for (let i = 0; i < 1; i++) {
            let ballsInfo = {}
            let infoArray = [] //龙虎
            let oneCount = 0 //第一球龙的个数
            let twoCount = 0 //第一球虎的个数
            one: for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let dragonInfo = {
                    clr: '#f12a31',
                    content: context.$tex('龙'),
                    flag: true,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                let tigerInfo = {
                    clr: '#233fd4',
                    content: context.$tex('虎'),
                    flag: false,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                for (let k = j + 1; k < arr.length; k++) {
                    //龙虎
                    let lastIndex = balls.length - 1
                    let nextBalls = arr[k].lotteryNumber
                      .split(',')
                      .map(item => {
                          return item * 1
                      })
                    if (
                      balls[i] > balls[lastIndex] &&
                      nextBalls[i] > nextBalls[lastIndex]
                    ) {
                        dragonInfo.content += context.$tex('龙')
                        dragonInfo.count++
                        if (k === arr.lenght - 1) {
                            infoArray.push(dragonInfo)
                            break one
                        }
                    } else if (
                      balls[i] < balls[lastIndex] &&
                      nextBalls[i] < nextBalls[lastIndex]
                    ) {
                        tigerInfo.content += context.$tex('虎')
                        tigerInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(tigerInfo)
                            break one
                        }
                    } else if (
                      balls[i] !== balls[lastIndex] &&
                      nextBalls[i] !== nextBalls[lastIndex]
                    ) {
                        if (balls[i] > balls[lastIndex]) {
                            infoArray.push(dragonInfo)
                        } else if (balls[i] < balls[lastIndex]) {
                            infoArray.push(tigerInfo)
                        }
                        j = k - 1
                        break
                    }
                }
                if (j === arr.length - 1) {
                    if (balls[i] > balls[balls.length - 1]) {
                        infoArray.push(dragonInfo)
                    } else {
                        infoArray.push(tigerInfo)
                    }
                }
            }
            for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                if (balls[i] > balls[balls.length - 1]) {
                    oneCount++
                } else {
                    twoCount++
                }
            }
            ballsInfo.index = context.$tex('龙虎')
            ballsInfo.name = ''
            ballsInfo.ballIndex = 0
            ballsInfo.isDragonTiger = true
            ballsInfo.roadBeadsIndex = 2 //对应大小、单双、龙虎的顺序
            ballsInfo.choice = [
                //下拉框
                {
                    title: context.$tex('龙'),
                    flag: 'true'
                },
                {
                    title: context.$tex('虎'),
                    flag: 'false'
                }
            ]
            ballsInfo.oneCount = oneCount
            ballsInfo.twoCount = twoCount
            ballsInfo.oneName = context.$tex('龙')
            ballsInfo.twoName = context.$tex('虎')
            ballsInfo.rank = 2
            ballsInfo.infoArray = infoArray
            roadBeadsList.push(ballsInfo)
        }
        //总和单双
        for (let i = 0; i < 1; i++) {
            let ballsInfo = {}
            let infoArray = [] //和的单双
            let oneCount = 0 //和单的个数
            let twoCount = 0 //和双的个数
            one: for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let sumOne = balls.reduce((preVal, currVal) => {
                    return preVal + currVal
                }, 0)
                let sumSingleInfo = {
                    clr: '#233fd4',
                    content: context.$tex('单'),
                    flag: true,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                let sumDoubleInfo = {
                    clr: '#f12a31',
                    content: context.$tex('双'),
                    flag: false,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                for (let k = j + 1; k < arr.length; k++) {
                    let nextBalls = arr[k].lotteryNumber
                      .split(',')
                      .map(item => {
                          return item * 1
                      })
                    let sumTwo = nextBalls.reduce((preVal, currVal) => {
                        return preVal + currVal
                    }, 0)
                    if (sumOne % 2 === 0 && sumTwo % 2 === 0) {
                        sumDoubleInfo.content += context.$tex('双')
                        sumDoubleInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(sumDoubleInfo)
                            break one
                        }
                    } else if (sumOne % 2 !== 0 && sumTwo % 2 !== 0) {
                        sumSingleInfo.content += context.$tex('单')
                        sumSingleInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(sumSingleInfo)
                            break one
                        }
                    } else {
                        if (sumOne % 2 === 0) {
                            infoArray.push(sumDoubleInfo)
                        } else {
                            infoArray.push(sumSingleInfo)
                        }
                        j = k - 1
                        break
                    }
                }
                if (j === arr.length - 1) {
                    if (sumOne % 2 === 0) {
                        infoArray.push(sumDoubleInfo)
                    } else {
                        infoArray.push(sumSingleInfo)
                    }
                }
            }
            for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let sumOne = balls.reduce((preVal, currVal) => {
                    return preVal + currVal
                }, 0)
                if (sumOne % 2 === 0) {
                    twoCount++
                } else {
                    oneCount++
                }
            }
            ballsInfo.index = context.$tex('总和')
            ballsInfo.isSumSingleDouble = true
            ballsInfo.name = context.$tex('单双')
            ballsInfo.choice = [
                //下拉框
                {
                    title: context.$tex('单'),
                    flag: 'true'
                },
                {
                    title: context.$tex('双'),
                    flag: 'false'
                }
            ]
            ballsInfo.ballIndex = 5 //路珠筛选第几球
            ballsInfo.roadBeadsIndex = 1 //大小、单双、龙虎顺序
            ballsInfo.oneCount = oneCount
            ballsInfo.twoCount = twoCount
            ballsInfo.oneName = context.$tex('单')
            ballsInfo.twoName = context.$tex('双')
            ballsInfo.rank = 11
            ballsInfo.infoArray = infoArray
            roadBeadsList.push(ballsInfo)
        }
        //总和大小
        for (let i = 0; i < 1; i++) {
            let ballsInfo = {}
            let infoArray = []
            let oneCount = 0 //和大的个数
            let twoCount = 0 //和小的个数
            one: for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let sumOne = balls.reduce((preVal, currVal) => {
                    return preVal + currVal
                }, 0)
                let sumLargeInfo = {
                    clr: '#f12a31',
                    content: context.$tex('大'),
                    flag: false,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                let sumSmallInfo = {
                    clr: '#233fd4',
                    content: context.$tex('小'),
                    flag: true,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                for (let k = j + 1; k < arr.length; k++) {
                    let nextBalls = arr[k].lotteryNumber
                      .split(',')
                      .map(item => {
                          return item * 1
                      })
                    let sumTwo = nextBalls.reduce((newVal, currVal) => {
                        return newVal + currVal
                    }, 0)
                    if (sumOne > 22 && sumTwo > 22) {
                        sumLargeInfo.content += context.$tex('大')
                        sumLargeInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(sumLargeInfo)
                            break one
                        }
                    } else if (sumOne <= 22 && sumTwo <= 22) {
                        sumSmallInfo.content += context.$tex('小')
                        sumSmallInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(sumSmallInfo)
                            break one
                        }
                    } else {
                        if (sumOne > 22) {
                            infoArray.push(sumLargeInfo)
                        } else {
                            infoArray.push(sumSmallInfo)
                        }
                        j = k - 1
                        break
                    }
                }
                if (j === arr.length - 1) {
                    //最后一个加上
                    if (sumOne > 22) {
                        infoArray.push(sumLargeInfo)
                    } else {
                        infoArray.push(sumSmallInfo)
                    }
                }
            }
            for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let sumOne = balls.reduce((preVal, currVal) => {
                    return preVal + currVal
                }, 0)
                if (sumOne > 22) {
                    twoCount++
                } else {
                    oneCount++
                }
            }
            ballsInfo.index = context.$tex('总和')
            ballsInfo.name = context.$tex('大小')
            ballsInfo.isSumSmallLarge = true
            ballsInfo.ballIndex = 5
            ballsInfo.choice = [
                //下拉框
                {
                    title: context.$tex('大'),
                    flag: 'false'
                },
                {
                    title: context.$tex('小'),
                    flag: 'true'
                }
            ]
            ballsInfo.roadBeadsIndex = 0 //大小、单双、龙虎顺序
            ballsInfo.oneCount = oneCount
            ballsInfo.twoCount = twoCount
            ballsInfo.oneName = context.$tex('小')
            ballsInfo.twoName = context.$tex('大')
            ballsInfo.rank = 12
            ballsInfo.infoArray = infoArray
            roadBeadsList.push(ballsInfo)
        }
        roadBeadsList.sort((item1, item2) => {
            return item1.rank - item2.rank
        })
        return roadBeadsList
    },
    getBaseTrendData: function(arr) {
        //基本走势
        return handlerTrendData(arr, 50, 10, 0, false)
    }
}

const CONFIG_FC3D = {
    // 福彩3D
    openBalls: [, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        .join(',')
        .repeat(3)
        .split(',')
        .slice(1),
    trendTitle: [
        {
            title: context.$tex('期号'),
            rowspan: 2
        },
        {
            title: context.$tex('开奖号码'),
            rowspan: 2,
            colspan: 3
        },
        {
            title: context.$tex('百位走势'),
            colspan: 10
        },
        {
            title: context.$tex('十位走势'),
            colspan: 10
        },
        {
            title: context.$tex('个位走势'),
            colspan: 10
        }
    ],
    recordTitle: [
        {
            title: context.$tex('期数')
        },
        {
            title: context.$tex('显示号码')
        },
        {
            title: context.$tex('总和'),
            colspan: 2
        }
    ],
    statCategory: [
        {
            title: context.$tex('统计类型'),
            rowspan: 2,
            colspan: 4
        },
        {
            title: context.$tex('百位走势'),
            colspan: 10
        },
        {
            title: context.$tex('十位走势'),
            colspan: 10
        },
        {
            title: context.$tex('个位走势'),
            colspan: 10
        }
    ],
    handlerRecordList(recordList) {
        recordList.forEach(item => {
            let sum = 0
            let ballsInfo = []
            let sumInfo = {
                content: '',
                singleDouble: ''
            }
            let balls = item.lotteryNumber.split(',')
            balls.forEach(ball => {
                sum += ball * 1
                ballsInfo.push(ball)
            })
            sumInfo.singleDouble = sum % 2 === 0 ? context.$tex('双') : context.$tex('单')
            sumInfo.content = sum
            item.sumInfo = sumInfo
            item.trendNumbers = ballsInfo
        })
        return recordList
    },
    getBaseTrendData: function(arr) {
        //基本走势
        return handlerTrendData(arr, 30, 10, 0, false)
        // var timesInfo = []; //出现次数数组
        // var averMiss = []; //平均遗漏
        // var maxMiss = []; //最大遗漏
        // var connects = []; //连出
        // for (let i = 0; i < 30; i++) {
        // 	let miss = []; //遗漏次数
        // 	let tempConnect = [];
        // 	let times = 0; //号码出现的次数
        // 	let count = 0; //计数器
        // 	let connect = 0; //连出数
        // 	for (let j = arr.length - 1; j >= 0; j--) {
        // 		if (i === 0) {
        // 			arr[j].trendResultNumber = [];
        // 		}
        // 		let index = Math.floor(i / 10);
        // 		let balls = arr[j].lotteryNumber.split(',');
        // 		arr[j].trendNumbers = balls;
        // 		if (balls[index] * 1 !== (i % 10)) {
        // 			count++;
        // 			arr[j].trendResultNumber.push(count);
        // 		} else {
        // 			times++;
        // 			miss.push(count);
        // 			count = 0;
        // 			let info = {
        // 				content: balls[index] * 1,
        // 				clr: Math.floor(i / 10) % 2 === 0 ? "#3f99f2" : "#FF0000",
        // 				num: index + 1
        // 			}
        // 			arr[j].trendResultNumber.push(info);
        // 			connect++;
        // 			if (j > 0) {
        // 				for (let k = j - 1; k >= 0; k--) {
        // 					let nextBalls = arr[k].lotteryNumber.split(',');
        // 					if (balls[index] * 1 === nextBalls[index] * 1) {
        // 						connect++;
        // 					} else {
        // 						tempConnect.push(connect);
        // 						connect = 0;
        // 						break;
        // 					}
        // 				}
        // 			}

        // 		}
        // 		if (j === 0) {
        // 			miss.push(count);
        // 			!tempConnect.length && tempConnect.push(0);
        // 		}
        // 	}
        // 	maxMiss.push(Math.max(...miss));
        // 	averMiss.push(
        // 		times ? ((arr.length - times) / times).toFixed(1) : 0
        // 	);
        // 	timesInfo.push(times);
        // 	connects.push(Math.max(...tempConnect));
        // }
        // arr.trendTimesInfo = timesInfo;
        // arr.trendAverMiss = averMiss;
        // arr.trendMaxMiss = maxMiss;
        // arr.trendConnects = connects;
        // return arr;
    }
}

const CONFIG_PK10 = {
    //pk10
    //走势
    openBalls: [, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        .join(',')
        .repeat(10)
        .split(',')
        .slice(1),
    color: ['#3f99f2', '#FF0000'],
    trendTitle: [
        //走势标题
        {
            title: context.$tex('期号'),
            rowspan: 2
        },
        {
            title: context.$tex('开奖号码'),
            rowspan: 2,
            colspan: 10
        },
        {
            colspan: 10,
            title: context.$tex('冠军走势')
        },
        {
            colspan: 10,
            title: context.$tex('亚军走势')
        },
        {
            colspan: 10,
            title: context.$tex('季军走势')
        },
        {
            colspan: 10,
            title: context.$tex('第四名')
        },
        {
            colspan: 10,
            title: context.$tex('第五名')
        },
        {
            colspan: 10,
            title: context.$tex('第六名')
        },
        {
            colspan: 10,
            title: context.$tex('第七名')
        },
        {
            colspan: 10,
            title: context.$tex('第八名')
        },
        {
            colspan: 10,
            title: context.$tex('第九名')
        },
        {
            colspan: 10,
            title: context.$tex('第十名')
        }
    ],
    statCategory: [
        {
            title: context.$tex('统计类型'),
            rowspan: 2,
            colspan: 11
        },
        {
            title: context.$tex('冠军'),
            colspan: 10
        },
        {
            title: context.$tex('亚军'),
            colspan: 10
        },
        {
            title: context.$tex('季军'),
            colspan: 10
        },
        {
            title: context.$tex('第四名'),
            colspan: 10
        },
        {
            title: context.$tex('第五名'),
            colspan: 10
        },
        {
            title: context.$tex('第六名'),
            colspan: 10
        },
        {
            title: context.$tex('第七名'),
            colspan: 10
        },
        {
            title: context.$tex('第八名'),
            colspan: 10
        },
        {
            title: context.$tex('第九名'),
            colspan: 10
        },
        {
            title: context.$tex('第十名'),
            colspan: 10
        }
    ],
    positionTrendTab: [
        context.$tex('冠军'),
        context.$tex('亚军'),
        context.$tex('季军'),
        context.$tex('第四名'),
        context.$tex('第五名'),
        context.$tex('第六名'),
        context.$tex('第七名'),
        context.$tex('第八名'),
        context.$tex('第九名'),
        context.$tex('第十名')
    ], //位置走势tab
    directTableTitle: [
        {
            title: context.$tex('期号')
        },
        {
            title: context.$tex('开奖号码')
        },
        [
            {
                title: context.$tex('冠军分布'),
                colspan: 10
            },
            {
                title: context.$tex('亚军分布'),
                colspan: 10
            },
            {
                title: context.$tex('季军分布'),
                colspan: 10
            },
            {
                title: context.$tex('第四名'),
                colspan: 10
            },
            {
                title: context.$tex('第五名'),
                colspan: 10
            },
            {
                title: context.$tex('第六名'),
                colspan: 10
            },
            {
                title: context.$tex('第七名'),
                colspan: 10
            },
            {
                title: context.$tex('第八名'),
                colspan: 10
            },
            {
                title: context.$tex('第九名'),
                colspan: 10
            },
            {
                title: context.$tex('第十名'),
                colspan: 10
            }
        ],
        {
            title: context.$tex('形态特征'),
            colspan: 6
        },
        {
            title: context.$tex('012路'),
            colspan: 3
        },
        {
            title: context.$tex('升平降'),
            colspan: 3
        }
    ],
    directTrendStaticTitle: [
        //位置走势数据统计
        {
            title: context.$tex('数据统计'),
            colspan: 2,
            rowspan: 2
        },
        {
            title: context.$tex('冠军分布'),
            colspan: 10
        },
        {
            title: context.$tex('形态特征'),
            colspan: 6
        },
        {
            title: context.$tex('012路'),
            colspan: 3
        },
        {
            title: context.$tex('升平降'),
            colspan: 3
        }
    ],
    directTrendStaticSubTitle: [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        context.$tex('奇'),
        context.$tex('偶'),
        context.$tex('大'),
        context.$tex('小'),
        context.$tex('质'),
        context.$tex('合'),
        '0',
        '1',
        '2',
        context.$tex('升'),
        context.$tex('平'),
        context.$tex('降')
    ],
    //开奖记录
    subTitle: [context.$tex('今日双面/号码统计'), context.$tex('长龙统计'), context.$tex('号码分析')],
    ranking: [
        //双面统计--名次
        {
            title: context.$tex('冠军'),
            colspan: 4
        },
        {
            title: context.$tex('亚军'),
            colspan: 4
        },
        {
            title: context.$tex('季军'),
            colspan: 4
        },
        {
            title: context.$tex('第四名'),
            colspan: 4
        },
        {
            title: context.$tex('第五名'),
            colspan: 4
        },
        {
            title: context.$tex('第六名'),
            colspan: 4
        },
        {
            title: context.$tex('第七名'),
            colspan: 4
        },
        {
            title: context.$tex('第八名'),
            colspan: 4
        },
        {
            title: context.$tex('第九名'),
            colspan: 4
        },
        {
            title: context.$tex('第十名'),
            colspan: 4
        }
    ],
    twoSideFlag: new Array(7).fill(true), //筛选名次--两面模式
    ranksFlag: [
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true
    ], //筛选名次按钮--综合模式
    roadBeadsFlag: [true, true, true],
    singleBeadsFlag: [true, true, true],
    singleDoubleTitle: [context.$tex('单'), context.$tex('双'), context.$tex('大'), context.$tex('小')]
        .join('')
        .repeat(10)
        .split(''),
    counts: [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ], //item出现的次数
    dragonTigerTitle: [
        //双面统计--冠亚龙虎
        {
            title: context.$tex('冠亚龙虎')
        },
        {
            title: context.$tex('冠亚和'),
            colspan: 4
        },
        {
            title: context.$tex('冠军龙虎'),
            colspan: 2
        },
        {
            title: context.$tex('亚军龙虎'),
            colspan: 2
        },
        {
            title: context.$tex('季军龙虎'),
            colspan: 2
        },
        {
            title: context.$tex('第四名龙虎'),
            colspan: 2
        },
        {
            title: context.$tex('第五名龙虎'),
            colspan: 2
        }
    ],
    dragonTigerSubTitle: [
        context.$tex('单双大小龙虎'),
        context.$tex('单'),
        context.$tex('双'),
        context.$tex('大'),
        context.$tex('小'),
        context.$tex('龙'),
        context.$tex('虎'),
        context.$tex('龙'),
        context.$tex('虎'),
        context.$tex('龙'),
        context.$tex('虎'),
        context.$tex('龙'),
        context.$tex('虎'),
        context.$tex('龙'),
        context.$tex('虎')
    ],
    ballsNum: [
        context.$tex('号码1'),
        context.$tex('号码2'),
        context.$tex('号码3'),
        context.$tex('号码4'),
        context.$tex('号码5'),
        context.$tex('号码6'),
        context.$tex('号码7'),
        context.$tex('号码8'),
        context.$tex('号码9'),
        context.$tex('号码10')
    ],
    isActiveNumber: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1], //切换球号
    singleDouble: [context.$tex('单'), context.$tex('双'), context.$tex('大'), context.$tex('小'), context.$tex('对子号'), context.$tex('还原')],
    titleInfo: {
        //开奖记录的标题
        time: context.$tex('时间'),
        periodNo: context.$tex('期数'),
        otherOne: [context.$tex('显示号码'), context.$tex('显示大小'), context.$tex('显示单双')],
        otherTwo: [
            {
                colspan: 3,
                title: context.$tex('冠亚和')
            },
            {
                title: context.$tex('1-5龙虎'),
                colspan: 5
            }
        ]
    },
    //路珠
    ranks: [
        [
            context.$tex('冠军'),
            context.$tex('亚军'),
            context.$tex('第三名'),
            context.$tex('第四名'),
            context.$tex('第五名'),
            context.$tex('第六名'),
            context.$tex('第七名'),
            context.$tex('第八名'),
            context.$tex('第九名'),
            context.$tex('第十名'),
            context.$tex('冠亚和')
        ], //筛选名次--综合模式
        [
            context.$tex('冠军'),
            context.$tex('亚军'),
            context.$tex('第三名'),
            context.$tex('第四名'),
            context.$tex('第五名'),
            context.$tex('第六名'),
            context.$tex('第七名'),
            context.$tex('第八名'),
            context.$tex('第九名'),
            context.$tex('第十名'),
            context.$tex('冠亚和')
        ], //筛选名次--单选模式
        [
            context.$tex('冠军'),
            context.$tex('亚军'),
            context.$tex('第三名'),
            context.$tex('第四名'),
            context.$tex('第五名'),
            context.$tex('第六名'),
            context.$tex('第七名'),
            context.$tex('第八名'),
            context.$tex('第九名'),
            context.$tex('第十名'),
            context.$tex('冠亚和')
        ] //筛选名次-两面模式
    ],
    roadBeads: [
        [context.$tex('大小'), context.$tex('单双'), context.$tex('龙虎')], //筛选路珠--综合模式
        [context.$tex('大小'), context.$tex('单双'), context.$tex('龙虎')], //筛选路珠--单选模式
        [context.$tex('大小'), context.$tex('单双'), context.$tex('龙虎'), context.$tex('冠亚和单双'), context.$tex('冠亚和大小')] //-筛选路珠-两面模式
    ],
    choiceResult: [
        {
            //第一球
            count: 1,
            flag: 'true'
        },
        {
            count: 1,
            flag: 'false'
        },
        {
            count: 1,
            flag: 'true'
        },
        {
            //第二球
            count: 1,
            flag: 'true'
        },
        {
            count: 1,
            flag: 'false'
        },
        {
            count: 1,
            flag: 'true'
        },
        {
            //第三球
            count: 1,
            flag: 'true'
        },
        {
            count: 1,
            flag: 'false'
        },
        {
            count: 1,
            flag: 'true'
        },
        {
            //第四球
            count: 1,
            flag: 'true'
        },
        {
            count: 1,
            flag: 'false'
        },
        {
            count: 1,
            flag: 'true'
        },
        {
            //第五球
            count: 1,
            flag: 'true'
        },
        {
            count: 1,
            flag: 'false'
        },
        {
            count: 1,
            flag: 'true'
        },
        {
            //第六球
            count: 1,
            flag: 'true'
        },
        {
            count: 1,
            flag: 'false'
        },
        {
            count: 1,
            flag: 'true'
        },
        {
            //第七球
            count: 1,
            flag: 'true'
        },
        {
            count: 1,
            flag: 'false'
        },
        {
            count: 1,
            flag: 'true'
        },
        {
            //第八球
            count: 1,
            flag: 'true'
        },
        {
            count: 1,
            flag: 'false'
        },
        {
            count: 1,
            flag: 'true'
        },
        {
            //第九球
            count: 1,
            flag: 'true'
        },
        {
            count: 1,
            flag: 'false'
        },
        {
            count: 1,
            flag: 'true'
        },
        {
            //第十球
            count: 1,
            flag: 'true'
        },
        {
            count: 1,
            flag: 'false'
        },
        {
            count: 1,
            flag: 'true'
        },
        {
            //冠亚和
            count: 1,
            flag: 'true'
        },
        {
            count: 1,
            flag: 'false'
        }
    ],
    //开奖记录
    getTwo: function(arr) {
        //两面
        for (let k = 0; k < 10; k++) {
            for (let i = 0, len = arr.length; i < len; i++) {
                for (let j = i + 1; j < arr.length; j++) {
                    //号码
                    if (
                        arr[i].ballsInfo.lotteryNumbers[k].content ===
                        arr[j].ballsInfo.lotteryNumbers[k].content
                    ) {
                        arr[i].ballsInfo.lotteryNumbers[k].double = true
                        arr[j].ballsInfo.lotteryNumbers[k].double = true
                    } else {
                        break
                    }
                }
                for (let j = i + 1; j < arr.length; j++) {
                    //大小
                    if (
                        arr[i].ballsInfo.sizes[k].number ===
                        arr[j].ballsInfo.sizes[k].number
                    ) {
                        arr[i].ballsInfo.sizes[k].double = true
                        arr[j].ballsInfo.sizes[k].double = true
                    } else {
                        break
                    }
                }
                for (let j = i + 1; j < arr.length; j++) {
                    //单双
                    if (
                        arr[i].ballsInfo.singles[k].number ===
                        arr[j].ballsInfo.singles[k].number
                    ) {
                        arr[i].ballsInfo.singles[k].double = true
                        arr[j].ballsInfo.singles[k].double = true
                    } else {
                        break
                    }
                }
            }
        }
    },
    getLongData: function(arr) {
        //长龙
        let info = []
        for (let i = 0; i < 10; i++) {
            for (let j = 1; j < arr.length; j++) {
                //大小
                if (
                    arr[j].ballsInfo.sizes[i].content !==
                        arr[0].ballsInfo.sizes[i].content &&
                    j === 1
                ) {
                    break
                } else if (
                    arr[j].ballsInfo.sizes[i].content !==
                        arr[0].ballsInfo.sizes[i].content &&
                    j > 1
                ) {
                    info.push({
                        title:
                            i === 0
                                ? context.$tex('冠军')
                                : i === 1 ? context.$tex('亚军') : context.$tex('第{num}名', { num: i + 1 }),
                        content: arr[0].ballsInfo.sizes[i].content + j + context.$tex('期'),
                        count: j
                    })
                    break
                }
            }
            for (let j = 1; j < arr.length; j++) {
                //单双
                if (
                    arr[j].ballsInfo.singles[i].content !==
                        arr[0].ballsInfo.singles[i].content &&
                    j === 1
                ) {
                    break
                } else if (
                    arr[j].ballsInfo.singles[i].content !==
                        arr[0].ballsInfo.singles[i].content &&
                    j > 1
                ) {
                    info.push({
                        title:
                            i === 0
                                ? context.$tex('冠军')
                                : i === 1 ? context.$tex('亚军') : context.$tex('第{num}名', { num: i + 1 }),
                        content: arr[0].ballsInfo.singles[i].content + j + context.$tex('期'),
                        count: j
                    })
                    break
                }
            }
        }

        //第一名到第五名--龙虎和
        for (let i = 0; i < 5; i++) {
            let dragons = [
                'oneLong',
                'twoLong',
                'threeLong',
                'fourLong',
                'fiveLong'
            ]
            // console.log(arr[0].sumInfo);
            let status = arr[0].sumInfo[dragons[i]]
            for (let j = 1; j < arr.length; j++) {
                if (arr[j].sumInfo.oneLong !== status && j === 1) {
                    break
                } else if (arr[j].sumInfo.oneLong !== status && j > 1) {
                    info.push({
                        title:
                            i === 0
                                ? context.$tex('冠军')
                                : i === 1 ? context.$tex('亚军') : context.$tex('第{num}名', { num: i + 1 }),
                        content: status + j + context.$tex('期'),
                        count: j
                    })
                    break
                }
            }
        }
        //冠亚和
        let firstSingle = arr[0].sumInfo.single
        let size = arr[0].sumInfo.small
        for (let j = 1; j < arr.length; j++) {
            //单双
            if (arr[j].sumInfo.single !== firstSingle && j === 1) {
                break
            } else if (arr[j].sumInfo.single !== firstSingle && j > 1) {
                info.push({
                    title: context.$tex('冠亚和'),
                    content: firstSingle + j + context.$tex('期'),
                    count: j
                })
                break
            }
        }
        for (let j = 1; j < arr.length; j++) {
            //大小
            if (arr[j].sumInfo.small !== size && j === 1) {
                break
            } else if (arr[j].sumInfo.small !== size && j > 1) {
                info.push({
                    title: context.$tex('冠亚和'),
                    content: size + j + context.$tex('期'),
                    count: j
                })
                break
            }
        }
        //排序
        info.sort((a, b) => {
            return b.count - a.count
        })
        return info
    },
    getBallCount: function(balls) {
        //名次单双大小出现次数, 06-10大
        let dragonTiger = []
        let [
            //统计冠亚龙虎
            sumSingle,
            sumDouble,
            sumLarge,
            sumSmall,
            oneDragon,
            oneTiger,
            twoDragon,
            twoTiger,
            threeDragon,
            threeTiger,
            fourDragon,
            fourTiger,
            fiveDragon,
            fiveTiger
        ] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        let ballsCount = []
        let [
            //统计单双大小次数
            oneSingle,
            oneDouble,
            oneLarge,
            oneSmall,
            twoSingle,
            twoDouble,
            twoLarge,
            twoSmall,
            threeSingle,
            threeDouble,
            threeLarge,
            threeSmall,
            fourSingle,
            fourDouble,
            fourLarge,
            fourSmall,
            fiveSingle,
            fiveDouble,
            fiveLarge,
            fiveSmall,
            sixSingle,
            sixDouble,
            sixLarge,
            sixSmall,
            sevenSingle,
            sevenDouble,
            sevenLarge,
            sevenSmall,
            eightSingle,
            eightDouble,
            eightLarge,
            eightSmall,
            nineSingle,
            nineDouble,
            nineLarge,
            nineSmall,
            tenSingle,
            tenDouble,
            tenLarge,
            tenSmall
        ] = [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        ]
        balls.forEach((ball, index) => {
            switch (index % 10) {
                case 0: //冠军
                    ball % 2 === 0 ? oneDouble++ : oneSingle++
                    ball > 5 ? oneLarge++ : oneSmall++
                    let sum = ball * 1 + balls[index + 1] * 1 //冠亚和
                    sum % 2 === 0 ? sumDouble++ : sumSingle++
                    sum > 11 ? sumLarge++ : sumSmall++
                    ball > balls[index + 9] ? oneDragon++ : oneTiger++ //第一名龙虎
                    break
                case 1:
                    ball % 2 === 0 ? twoDouble++ : twoSingle++
                    ball > 5 ? twoLarge++ : twoSmall++
                    ball > balls[index + 7] ? twoDragon++ : twoTiger++ //第二名龙虎
                    break
                case 2:
                    ball % 2 === 0 ? threeDouble++ : threeSingle++
                    ball > 5 ? threeLarge++ : threeSmall++
                    ball > balls[index + 5] ? threeDragon++ : threeTiger++ //第三名龙虎
                    break
                case 3:
                    ball % 2 === 0 ? fourDouble++ : fourSingle++
                    ball > 5 ? fourLarge++ : fourSmall++
                    ball > balls[index + 3] ? fourDragon++ : fourTiger++ //第四名龙虎
                    break
                case 4:
                    ball % 2 === 0 ? fiveDouble++ : fiveSingle++
                    ball > 5 ? fiveLarge++ : fiveSmall++
                    ball > balls[index + 1] ? fiveDragon++ : fiveTiger++ //第五名龙虎
                    break
                case 5:
                    ball % 2 === 0 ? sixDouble++ : sixSingle++
                    ball > 5 ? sixLarge++ : sixSmall++
                    break
                case 6:
                    ball % 2 === 0 ? sevenDouble++ : sevenSingle++
                    ball > 5 ? sevenLarge++ : sevenSmall++
                    break
                case 7:
                    ball % 2 === 0 ? eightDouble++ : eightSingle++
                    ball > 5 ? eightLarge++ : eightSmall++
                    break
                case 8:
                    ball % 2 === 0 ? nineDouble++ : nineSingle++
                    ball > 5 ? nineLarge++ : nineSmall++
                    break
                default:
                    //第十名
                    ball % 2 === 0 ? tenDouble++ : tenSingle++
                    ball > 5 ? tenLarge++ : tenSmall++
                    break
            }
        })
        ballsCount.push(
            oneSingle,
            oneDouble,
            oneLarge,
            oneSmall,
            twoSingle,
            twoDouble,
            twoLarge,
            twoSmall,
            threeSingle,
            threeDouble,
            threeLarge,
            threeSmall,
            fourSingle,
            fourDouble,
            fourLarge,
            fourSmall,
            fiveSingle,
            fiveDouble,
            fiveLarge,
            fiveSmall,
            sixSingle,
            sixDouble,
            sixLarge,
            sixSmall,
            sevenSingle,
            sevenDouble,
            sevenLarge,
            sevenSmall,
            eightSingle,
            eightDouble,
            eightLarge,
            eightSmall,
            nineSingle,
            nineDouble,
            nineLarge,
            nineSmall,
            tenSingle,
            tenDouble,
            tenLarge,
            tenSmall
        )
        dragonTiger.push(
            sumSingle,
            sumDouble,
            sumLarge,
            sumSmall,
            oneDragon,
            oneTiger,
            twoDragon,
            twoTiger,
            threeDragon,
            threeTiger,
            fourDragon,
            fourTiger,
            fiveDragon,
            fiveTiger
        )
        return [ballsCount, dragonTiger]
    },
    handlerRecordList: function(arr) {
        //开奖
        let ballContainer = []
        arr.forEach(item => {
            let balls = item.lotteryNumber.split(',')
            ballContainer = ballContainer.concat(balls) //名次--单双大小出现次数
            let sum = balls[0] * 1 + balls[1] * 1 //冠亚和
            let [lotteryNumbers, sizes, singles] = [[], [], []]
            let ballsInfo = {}
            balls.forEach((ball, index) => {
                let lotteryNumber = {
                    content: ball * 1,
                    ball: ball,
                    single: ball % 2 === 0 ? false : true, //单双
                    small: ball * 1 > 5 ? false : true, //大小
                    double: false //对子
                }
                let size = {
                    number: ball * 1,
                    content: lotteryNumber.small ? context.$tex('小') : context.$tex('大'),
                    single: lotteryNumber.single, //单双
                    small: lotteryNumber.small, //大小
                    clr: lotteryNumber.small ? '#7f8ab0' : '#f9982e',
                    double: false //对子
                }
                let single = {
                    number: ball * 1,
                    content: lotteryNumber.single ? context.$tex('单') : context.$tex('双'),
                    single: lotteryNumber.single, //单双
                    small: lotteryNumber.small, //大小
                    clr: lotteryNumber.single ? '#7f8ab0' : '#f9982e',
                    double: false //对子
                }
                lotteryNumbers.push(lotteryNumber)
                sizes.push(size)
                singles.push(single)
            })
            ballsInfo.lotteryNumbers = lotteryNumbers
            ballsInfo.sizes = sizes
            ballsInfo.singles = singles
            let sumInfo = {
                //冠亚和
                sum: sum,
                small: sum > 11 ? context.$tex('大') : context.$tex('小'),
                single: sum % 2 === 0 ? context.$tex('双') : context.$tex('单'),
                oneLong:
                    balls[0] - balls[balls.length - 1] > 0
                        ? context.$tex('龙')
                        : balls[0] - balls[balls.length - 1] < 0 ? context.$tex('虎') : context.$tex('和'),
                twoLong:
                    balls[1] - balls[balls.length - 2] > 0
                        ? context.$tex('龙')
                        : balls[1] - balls[balls.length - 2] < 0 ? context.$tex('虎') : context.$tex('和'),
                threeLong:
                    balls[2] - balls[balls.length - 3] > 0
                        ? context.$tex('龙')
                        : balls[2] - balls[balls.length - 3] < 0 ? context.$tex('虎') : context.$tex('和'),
                fourLong:
                    balls[3] - balls[balls.length - 4] > 0
                        ? context.$tex('龙')
                        : balls[3] - balls[balls.length - 4] < 0 ? context.$tex('虎') : context.$tex('和'),
                fiveLong:
                    balls[4] - balls[balls.length - 5] > 0
                        ? context.$tex('龙')
                        : balls[4] - balls[balls.length - 5] < 0 ? context.$tex('虎') : context.$tex('和')
            }
            item.sumInfo = sumInfo
            item.ballsInfo = ballsInfo
        })
        let result = CONFIG_PK10.getBallCount(ballContainer)
        arr.totalNumCount = result[0] //名次单双大小冠亚龙虎出现次数
        arr.mixinInfo = result[1] //冠亚龙虎
        arr.longData = CONFIG_PK10.getLongData(arr) //长龙统计
        CONFIG_PK10.getTwo(arr) //对子
        return arr
    },
    getDirectTrend: function(arr, index) {
        let timesInfo = [] //次数数字
        let averMiss = [] //平均遗漏
        let maxMiss = [] //最大遗漏
        let currMiss = [] //当前遗漏
        var maxConnects = [] //最大连出
        for (let i = 0; i < 22; i++) {
            let count = 0 //遗漏计数器
            let times = 0 //号码出现的次数
            let miss = [] //遗漏次数
            let connect = 0 //连出数
            let tempConnect = []
            for (let j = arr.length - 1; j >= 0; j--) {
                if (i === 0) {
                    arr[j].directResultNumber = []
                }
                let originBall = arr[j].lotteryNumber.split(',')
                arr[j].directTrendNumber = originBall
                let ball = originBall.map(item => item * 1)[index]
                let flag = null
                if (i < 10) {
                    //号码分布
                    flag = ball !== i + 1
                } else if (i === 10) {
                    //奇数分布
                    flag = ball % 2 === 0
                } else if (i === 11) {
                    //偶数分布
                    flag = ball % 2 !== 0
                } else if (i === 12) {
                    //大
                    flag = ball < 6
                } else if (i === 13) {
                    //小
                    flag = ball > 5
                } else if (i === 14) {
                    //质数
                    if (ball !== 1 && ball !== 2) {
                        for (let i = 2; i < ball; i++) {
                            if (ball % i === 0) {
                                flag = true
                                break
                            }
                            if (i === ball - 1) {
                                flag = false
                            }
                        }
                    } else {
                        flag = false
                    }
                } else if (i === 15) {
                    //合数
                    if (ball !== 1 && ball !== 2) {
                        for (let i = 2; i < ball; i++) {
                            if (ball % i === 0) {
                                flag = false
                                break
                            }
                            if (i === ball - 1) {
                                flag = true
                            }
                        }
                    } else {
                        flag = true
                    }
                } else if (i === 16) {
                    //0路
                    flag = ball % 3 == 0 ? false : true
                } else if (i === 17) {
                    //1路
                    flag = ball % 3 === 1 ? false : true
                } else if (i === 18) {
                    //2路
                    flag = ball % 3 === 2 ? false : true
                } else if (i === 19) {
                    //升
                    if (j < arr.length - 2) {
                        flag =
                            ball >
                            arr[j + 1].lotteryNumber
                                .split(',')
                                .map(item => item * 1)[index]
                                ? false
                                : true
                    } else {
                        flag = true
                    }
                } else if (i === 20) {
                    //平
                    if (j < arr.length - 2) {
                        flag =
                            ball ===
                            arr[j + 1].lotteryNumber
                                .split(',')
                                .map(item => item * 1)[index]
                                ? false
                                : true
                    } else {
                        flag = true
                    }
                } else if (i === 21) {
                    //降
                    if (j < arr.length - 2) {
                        flag =
                            ball <
                            arr[j + 1].lotteryNumber
                                .split(',')
                                .map(item => item * 1)[index]
                                ? false
                                : true
                    } else {
                        flag = true
                    }
                }
                if (flag) {
                    //不等
                    count++
                    arr[j].directResultNumber.push(count)
                } else {
                    times++
                    miss.push(count)
                    count = 0
                    connect++
                    let obj = {
                        content: originBall[index],
                        clr: '#1fa6eb'
                    }
                    if (i < 10) {
                        //号码
                        obj.type = 'ball'
                    }
                    if (i === 10) {
                        //奇数
                        obj.content = context.$tex('奇')
                        obj.clr = '#fa9932'
                    } else if (i === 11) {
                        //偶数
                        obj.content = context.$tex('偶')
                        obj.clr = '#3cb0ec'
                    } else if (i === 12) {
                        //大
                        obj.content = context.$tex('大')
                        obj.clr = '#fa9932'
                    } else if (i === 13) {
                        //小
                        obj.content = context.$tex('小')
                        obj.clr = '#3cb0ec'
                    } else if (i === 14) {
                        //质
                        obj.content = context.$tex('质')
                        obj.clr = '#fa9932'
                    } else if (i === 15) {
                        //合数
                        obj.content = context.$tex('合')
                        obj.clr = '#3cb0ec'
                    } else if (i === 16) {
                        //0路
                        obj.content = '0'
                        obj.clr = '#fa9932'
                    } else if (i === 17) {
                        //1路
                        obj.content = '1'
                        obj.clr = '#3cb0ec'
                    } else if (i === 18) {
                        //2路
                        obj.content = '2'
                        obj.clr = '#fa9932'
                    } else if (i === 19) {
                        //升
                        obj.content = context.$tex('升')
                        obj.clr = '#3cb0ec'
                    } else if (i === 20) {
                        //平
                        obj.content = context.$tex('平')
                        obj.clr = '#fa9932'
                    } else if (i === 21) {
                        //降
                        obj.content = context.$tex('降')
                        obj.clr = '#3cb0ec'
                    }
                    // originArr[j][i] = obj;
                    arr[j].directResultNumber.push(obj)
                    if (j > 0) {
                        for (let k = j - 1; k >= 0; k--) {
                            let subFlag = null
                            let nextBall = arr[k].lotteryNumber
                                .split(',')
                                .map(item => item * 1)[index]
                            if (i < 10) {
                                //号码分布
                                subFlag = nextBall === ball
                            } else if (i === 10) {
                                //奇数
                                subFlag = nextBall % 2 !== 0 && !flag
                            } else if (i === 11) {
                                //偶数
                                subFlag = nextBall % 2 === 0 && !flag
                            } else if (i === 12) {
                                //大
                                subFlag = nextBall > 5 && !flag
                            } else if (i === 13) {
                                //小
                                subFlag = nextBall < 6 && !flag
                            } else if (i === 14) {
                                //质数
                                let flag1 = null
                                if (nextBall !== 1 && nextBall !== 2) {
                                    for (let i = 2; i < nextBall; i++) {
                                        if (nextBall % i === 0) {
                                            flag1 = false
                                            break
                                        }
                                        if (i === nextBall - 1) {
                                            flag1 = true
                                        }
                                    }
                                } else {
                                    flag1 = true
                                }
                                subFlag = flag1 && !flag
                            } else if (i === 15) {
                                //合数
                                let doubleFlag = null
                                if (nextBall !== 1 && nextBall !== 2) {
                                    for (let i = 2; i < nextBall; i++) {
                                        if (nextBall % i === 0) {
                                            doubleFlag = true
                                            break
                                        }
                                        if (i === nextBall - 1) {
                                            flag = false
                                        }
                                    }
                                } else {
                                    flag = false
                                }
                                subFlag = doubleFlag && !flag
                            } else if (i === 16) {
                                //0路
                                subFlag = nextBall % 3 === 0 && !flag
                            } else if (i === 17) {
                                //1路
                                subFlag = nextBall % 3 === 1 && !flag
                            } else if (i === 18) {
                                //2路
                                subFlag = nextBall % 3 === 2 && !flag
                            } else if (i === 19) {
                                //升
                                let upFlag = null
                                if (k < arr.length - 2) {
                                    upFlag =
                                        nextBall >
                                        arr[k + 1].lotteryNumber
                                            .split(',')
                                            .map(item => item * 1)[index]
                                            ? true
                                            : false
                                } else {
                                    upFlag = false
                                }
                                subFlag = upFlag && !flag
                            } else if (i === 20) {
                                //平
                                let upFlag2 = null
                                if (k < arr.length - 2) {
                                    upFlag2 =
                                        nextBall ===
                                        arr[k + 1].lotteryNumber
                                            .split(',')
                                            .map(item => item * 1)[index]
                                            ? true
                                            : false
                                } else {
                                    upFlag2 = false
                                }
                                subFlag = upFlag2 && !flag
                            } else if (i === 21) {
                                //降
                                let upFlag3 = null
                                if (k < arr.length - 2) {
                                    upFlag3 =
                                        nextBall <
                                        arr[k + 1].lotteryNumber
                                            .split(',')
                                            .map(item => item * 1)[index]
                                            ? true
                                            : false
                                } else {
                                    upFlag3 = false
                                }
                                subFlag = upFlag3 && !flag
                            }
                            if (subFlag) {
                                connect++
                            } else {
                                tempConnect.push(connect)
                                connect = 0
                                break
                            }
                        }
                    }
                }
                if (j === 0) {
                    miss.push(count)
                    !tempConnect.length && tempConnect.push(0)
                }
            }
            //总次数
            timesInfo.push(times)
            //平均遗漏
            averMiss.push(times ? ((arr.length - times) / times).toFixed(1) : 0)
            //当前遗漏
            currMiss.push(count)
            //最大连出
            maxConnects.push(Math.max(...tempConnect))
            //最大遗漏
            maxMiss.push(Math.max(...miss))
        }
        arr.directTrendTimesInfo = timesInfo
        arr.directTrendAverMiss = averMiss
        arr.directTrendMaxMiss = maxMiss
        arr.directTrendCurrMiss = currMiss
        arr.directTrendMaxConnects = maxConnects
        return arr
    },
    getBaseTrendData: function(arr) {
        //基本走势
        return handlerTrendData(arr, 100, 10, 1, false)
        // var result = {};
        // var timesInfo = []; //出现次数数组
        // var averMiss = []; //平均遗漏
        // var maxMiss = []; //最大遗漏
        // var connects = []; //连出
        // for (let i = 0; i < 100; i++) {
        // 	let miss = []; //遗漏次数
        // 	let tempConnect = [];
        // 	let times = 0; //号码出现的次数
        // 	let count = 0; //计数器
        // 	let connect = 0; //连出数
        // 	for (let j = arr.length - 1; j >= 0; j--) {
        // 		if (i === 0) {
        // 			arr[j].trendResultNumber = [];
        // 		}
        // 		let index = Math.floor(i / 10);
        // 		let balls = arr[j].lotteryNumber.split(',');
        // 		arr[j].trendNumbers = balls;
        // 		if (balls[index] * 1 !== (i % 10 + 1)) {
        // 			count++;
        // 			arr[j].trendResultNumber.push(count);
        // 		} else {
        // 			times++;
        // 			miss.push(count);
        // 			count = 0;
        // 			let info = {
        // 				content: balls[index] * 1,
        // 				clr: Math.floor(i / 10) % 2 === 0 ? "#3f99f2" : "#FF0000",
        // 				num: index + 1
        // 			}
        // 			arr[j].trendResultNumber.push(info);
        // 			connect++;
        // 			if (j > 0) {
        // 				for (let k = j - 1; k >= 0; k--) {
        // 					let nextBalls = arr[k].lotteryNumber.split(',');
        // 					if (balls[index] * 1 === nextBalls[index] * 1) {
        // 						connect++;
        // 					} else {
        // 						tempConnect.push(connect);
        // 						connect = 0;
        // 						break;
        // 					}
        // 				}
        // 			}

        // 		}
        // 		if (j === 0) {
        // 			miss.push(count);
        // 			!tempConnect.length && tempConnect.push(0);
        // 		}
        // 	}
        // 	maxMiss.push(Math.max(...miss));
        // 	averMiss.push(
        // 		times ? ((arr.length - times) / times).toFixed(1) : 0
        // 	);
        // 	timesInfo.push(times);
        // 	connects.push(Math.max(...tempConnect));
        // }
        // arr.trendTimesInfo = timesInfo;
        // arr.trendAverMiss = averMiss;
        // arr.trendMaxMiss = maxMiss;
        // arr.trendConnects = connects;
        // return arr;
    },
    /**
     * 路珠分析
     *
     * 10:10个球
     * :6以上为大
     *
     * oneCount:第i球单,第i球小,和单，和小,龙的个数
     * twoCount:第i球双,第i球大,和双,和大，虎的个数
     */
    analyRoadBeads: function(arr) {
        let roadBeadsList = []
        //第i球单双
        for (let i = 0; i < 10; i++) {
            let ballsInfo = {}
            let infoArray = [] //单双
            let oneCount = 0 //第i球单的个数
            let twoCount = 0 //第i球双的个数
            one: for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let singleInfo = {
                    clr: '#999',
                    content: context.$tex('单'),
                    flag: true, //真表示单
                    count: 1, //出现次数
                    choiceCount: -1,
                    choiceFlag: null
                }
                let doubleInfo = {
                    clr: '#be1204',
                    content: context.$tex('双'),
                    flag: false, //假表示双
                    count: 1, //出现次数
                    choiceCount: -1,
                    choiceFlag: null
                }
                for (let k = j + 1; k < arr.length; k++) {
                    let nextBalls = arr[k].lotteryNumber
                        .split(',')
                        .map(item => {
                            return item * 1
                        })
                    if (balls[i] % 2 === 0 && nextBalls[i] % 2 === 0) {
                        doubleInfo.content += context.$tex('双')
                        doubleInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(doubleInfo)
                            break one
                        }
                    } else if (balls[i] % 2 !== 0 && nextBalls[i] % 2 !== 0) {
                        singleInfo.content += context.$tex('单')
                        singleInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(singleInfo)
                            break one
                        }
                    } else {
                        if (balls[i] % 2 === 0) {
                            infoArray.push(doubleInfo)
                        } else {
                            infoArray.push(singleInfo)
                        }
                        j = k - 1
                        break
                    }
                }
                if (j === arr.length - 1) {
                    //最后一个加上
                    if (balls[i] % 2 === 0) {
                        infoArray.push(doubleInfo)
                    } else {
                        infoArray.push(singleInfo)
                    }
                }
            }
            //单双出现次数
            for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                if (balls[i] % 2 !== 0) {
                    oneCount++
                } else {
                    twoCount++
                }
            }
            ballsInfo.index =
                i === 0 ? context.$tex('冠军') : i === 1 ? context.$tex('亚军') : context.$tex('第{num}名', { num: i + 1 })
            ballsInfo.ballIndex = i //第几球
            ballsInfo.isSingleDouble = true
            ballsInfo.roadBeadsIndex = 1 //大小、单双、龙虎顺序
            ballsInfo.choice = [
                //下拉框
                {
                    title: context.$tex('单'),
                    flag: 'true'
                },
                {
                    title: context.$tex('双'),
                    flag: 'false'
                }
            ]
            ballsInfo.name = context.$tex('单双')
            ballsInfo.oneName = context.$tex('单')
            ballsInfo.twoName = context.$tex('双')
            ballsInfo.oneCount = oneCount
            ballsInfo.twoCount = twoCount
            if (i < 5) {
                ballsInfo.rank = i * 3
            } else {
                ballsInfo.rank = i * 2 + 5
            }
            ballsInfo.infoArray = infoArray
            roadBeadsList.push(ballsInfo)
        }

        //第i球大小
        for (let i = 0; i < 10; i++) {
            let ballsInfo = {}
            let infoArray = [] //大小
            let oneCount = 0 //第i球小的个数
            let twoCount = 0 //第i球大的个数
            one: for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let smallInfo = {
                    clr: '#999',
                    content: context.$tex('小'),
                    flag: true,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                let largeInfo = {
                    clr: '#be1204',
                    content: context.$tex('大'),
                    flag: false,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                for (let k = j + 1; k < arr.length; k++) {
                    let nextBalls = arr[k].lotteryNumber
                        .split(',')
                        .map(item => {
                            return item * 1
                        })
                    if (balls[i] > 5 && nextBalls[i] > 5) {
                        largeInfo.content += context.$tex('大')
                        largeInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(largeInfo)
                            break one
                        }
                    } else if (balls[i] <= 5 && nextBalls[i] <= 5) {
                        smallInfo.content += context.$tex('小')
                        smallInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(smallInfo)
                            break one
                        }
                    } else {
                        if (balls[i] > 5) {
                            infoArray.push(largeInfo)
                        } else {
                            infoArray.push(smallInfo)
                        }
                        j = k - 1
                        break
                    }
                }
                if (j === arr.length - 1) {
                    //最后一个加上
                    if (balls[i] > 5) {
                        infoArray.push(largeInfo)
                    } else {
                        infoArray.push(smallInfo)
                    }
                }
            }
            for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                if (balls[i] < 6) {
                    oneCount++
                } else {
                    twoCount++
                }
            }
            ballsInfo.index =
                i === 0 ? context.$tex('冠军') : i === 1 ? context.$tex('亚军') : context.$tex('第{num}名', { num: i + 1 })
            ballsInfo.isSmallLarge = true
            ballsInfo.ballIndex = i //第几球
            ballsInfo.roadBeadsIndex = 0
            ballsInfo.name = context.$tex('大小')
            ballsInfo.choice = [
                //下拉框
                {
                    title: context.$tex('大'),
                    flag: 'false'
                },
                {
                    title: context.$tex('小'),
                    flag: 'true'
                }
            ]
            ballsInfo.oneCount = oneCount
            ballsInfo.twoCount = twoCount
            ballsInfo.oneName = context.$tex('小')
            ballsInfo.twoName = context.$tex('大')
            if (i < 5) {
                ballsInfo.rank = 3 * i + 1
            } else {
                ballsInfo.rank = i * 2 + 6
            }
            ballsInfo.infoArray = infoArray
            roadBeadsList.push(ballsInfo)
        }
        //第1-5球龙虎
        for (let i = 0; i < 5; i++) {
            let ballsInfo = {}
            let infoArray = [] //龙虎
            let oneCount = 0 //第i球龙的个数
            let twoCount = 0 //第i球虎的个数
            one: for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let dragonInfo = {
                    clr: '#f12a31',
                    content: context.$tex('龙'),
                    flag: true,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                let tigerInfo = {
                    clr: '#233fd4',
                    content: context.$tex('虎'),
                    flag: false,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                for (let k = j + 1; k < arr.length; k++) {
                    //龙虎
                    let lastIndex = balls.length - 1 - i
                    let nextBalls = arr[k].lotteryNumber
                        .split(',')
                        .map(item => {
                            return item * 1
                        })
                    if (
                        balls[i] > balls[lastIndex] &&
                        nextBalls[i] > nextBalls[lastIndex]
                    ) {
                        dragonInfo.content += context.$tex('龙')
                        dragonInfo.count++
                        if (k === arr.lenght - 1) {
                            infoArray.push(dragonInfo)
                            break one
                        }
                    } else if (
                        balls[i] < balls[lastIndex] &&
                        nextBalls[i] < nextBalls[lastIndex]
                    ) {
                        tigerInfo.content += context.$tex('虎')
                        tigerInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(tigerInfo)
                            break one
                        }
                    } else if (
                        balls[i] !== balls[lastIndex] &&
                        nextBalls[i] !== nextBalls[lastIndex]
                    ) {
                        if (balls[i] > balls[lastIndex]) {
                            infoArray.push(dragonInfo)
                        } else if (balls[i] < balls[lastIndex]) {
                            infoArray.push(tigerInfo)
                        }
                        j = k - 1
                        break
                    }
                }
                if (j === arr.length - 1) {
                    if (balls[i] > balls[balls.length - 1 - i]) {
                        infoArray.push(dragonInfo)
                    } else {
                        infoArray.push(tigerInfo)
                    }
                }
            }
            for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                if (balls[i] > balls[balls.length - 1 - i]) {
                    oneCount++
                } else {
                    twoCount++
                }
            }
            ballsInfo.index =
                i === 0 ? context.$tex('冠军') : i === 1 ? context.$tex('亚军') : context.$tex('第{num}名', { num: i + 1 })
            ballsInfo.ballIndex = i
            ballsInfo.name = context.$tex('龙虎')
            ballsInfo.isDragonTiger = true
            ballsInfo.roadBeadsIndex = 2 //对应大小、单双、龙虎的顺序
            ballsInfo.choice = [
                //下拉框
                {
                    title: context.$tex('龙'),
                    flag: 'true'
                },
                {
                    title: context.$tex('虎'),
                    flag: 'false'
                }
            ]
            ballsInfo.oneCount = oneCount
            ballsInfo.twoCount = twoCount
            ballsInfo.oneName = context.$tex('龙')
            ballsInfo.twoName = context.$tex('虎')
            if (i < 5) {
                ballsInfo.rank = 3 * i + 2
            }
            ballsInfo.infoArray = infoArray
            roadBeadsList.push(ballsInfo)
        }
        //冠亚和单双
        for (let i = 0; i < 1; i++) {
            let ballsInfo = {}
            let infoArray = [] //和的单双
            let oneCount = 0 //和单的个数
            let twoCount = 0 //和双的个数
            one: for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let sumOne = balls[0] + balls[1]
                let sumSingleInfo = {
                    clr: '#233fd4',
                    content: context.$tex('单'),
                    flag: true,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                let sumDoubleInfo = {
                    clr: '#f12a31',
                    content: context.$tex('双'),
                    flag: false,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                for (let k = j + 1; k < arr.length; k++) {
                    let nextBalls = arr[k].lotteryNumber
                        .split(',')
                        .map(item => {
                            return item * 1
                        })
                    let sumTwo = nextBalls[0] + nextBalls[1]
                    if (sumOne % 2 === 0 && sumTwo % 2 === 0) {
                        sumDoubleInfo.content += context.$tex('双')
                        sumDoubleInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(sumDoubleInfo)
                            break one
                        }
                    } else if (sumOne % 2 !== 0 && sumTwo % 2 !== 0) {
                        sumSingleInfo.content += context.$tex('单')
                        sumSingleInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(sumSingleInfo)
                            break one
                        }
                    } else {
                        if (sumOne % 2 === 0) {
                            infoArray.push(sumDoubleInfo)
                        } else {
                            infoArray.push(sumSingleInfo)
                        }
                        j = k - 1
                        break
                    }
                }
                if (j === arr.length - 1) {
                    if (sumOne % 2 === 0) {
                        infoArray.push(sumDoubleInfo)
                    } else {
                        infoArray.push(sumSingleInfo)
                    }
                }
            }
            for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let sumOne = balls[0] + balls[1]
                if (sumOne % 2 === 0) {
                    twoCount++
                } else {
                    oneCount++
                }
            }
            ballsInfo.index = context.$tex('冠亚和')
            ballsInfo.isSumSingleDouble = true
            ballsInfo.name = context.$tex('单双')
            ballsInfo.choice = [
                //下拉框
                {
                    title: context.$tex('单'),
                    flag: 'true'
                },
                {
                    title: context.$tex('双'),
                    flag: 'false'
                }
            ]
            ballsInfo.ballIndex = 10 //路珠综合筛选按钮的索引
            ballsInfo.roadBeadsIndex = 1 //大小、单双、龙虎顺序
            ballsInfo.oneCount = oneCount
            ballsInfo.twoCount = twoCount
            ballsInfo.oneName = context.$tex('单')
            ballsInfo.twoName = context.$tex('双')
            ballsInfo.rank = 26
            ballsInfo.infoArray = infoArray
            roadBeadsList.push(ballsInfo)
        }
        //冠亚和大小
        for (let i = 0; i < 1; i++) {
            let ballsInfo = {}
            let infoArray = []
            let oneCount = 0 //和大的个数
            let twoCount = 0 //和小的个数
            one: for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let sumOne = balls[0] + balls[1]
                let sumLargeInfo = {
                    clr: '#f12a31',
                    content: context.$tex('大'),
                    flag: false,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                let sumSmallInfo = {
                    clr: '#233fd4',
                    content: context.$tex('小'),
                    flag: true,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                for (let k = j + 1; k < arr.length; k++) {
                    let nextBalls = arr[k].lotteryNumber
                        .split(',')
                        .map(item => {
                            return item * 1
                        })
                    let sumTwo = nextBalls[0] + nextBalls[1]
                    if (sumOne > 11 && sumTwo > 11) {
                        sumLargeInfo.content += context.$tex('大')
                        sumLargeInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(sumLargeInfo)
                            break one
                        }
                    } else if (sumOne <= 11 && sumTwo <= 11) {
                        sumSmallInfo.content += context.$tex('小')
                        sumSmallInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(sumSmallInfo)
                            break one
                        }
                    } else {
                        if (sumOne > 11) {
                            infoArray.push(sumLargeInfo)
                        } else {
                            infoArray.push(sumSmallInfo)
                        }
                        j = k - 1
                        break
                    }
                }
                if (j === arr.length - 1) {
                    //最后一个加上
                    if (sumOne > 11) {
                        infoArray.push(sumLargeInfo)
                    } else {
                        infoArray.push(sumSmallInfo)
                    }
                }
            }
            for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let sumOne = balls[0] + balls[1]
                if (sumOne > 11) {
                    twoCount++
                } else {
                    oneCount++
                }
            }
            ballsInfo.index = context.$tex('冠亚和')
            ballsInfo.name = context.$tex('大小')
            ballsInfo.isSumSmallLarge = true
            ballsInfo.ballIndex = 10
            ballsInfo.choice = [
                //下拉框
                {
                    title: context.$tex('大'),
                    flag: 'false'
                },
                {
                    title: context.$tex('小'),
                    flag: 'true'
                }
            ]
            ballsInfo.roadBeadsIndex = 0 //大小、单双、龙虎顺序
            ballsInfo.oneCount = oneCount
            ballsInfo.twoCount = twoCount
            ballsInfo.oneName = context.$tex('小')
            ballsInfo.twoName = context.$tex('大')
            ballsInfo.rank = 27
            ballsInfo.infoArray = infoArray
            roadBeadsList.push(ballsInfo)
        }
        roadBeadsList.sort((item1, item2) => {
            return item1.rank - item2.rank
        })

        return roadBeadsList
    }
}
const CONFIG_SSC = {
    //时时彩
    //开奖历史
    subTitle: [context.$tex('今日双面/号码统计'), context.$tex('长龙统计'), context.$tex('号码分析')],
    ballsNum: [
        context.$tex('号码0'),
        context.$tex('号码1'),
        context.$tex('号码2'),
        context.$tex('号码3'),
        context.$tex('号码4'),
        context.$tex('号码5'),
        context.$tex('号码6'),
        context.$tex('号码7'),
        context.$tex('号码8'),
        context.$tex('号码9')
    ],
    isActiveNumber: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1], //切换球号
    singleDouble: [context.$tex('单'), context.$tex('双'), context.$tex('大'), context.$tex('小'), context.$tex('对子号'), context.$tex('还原')],
    ranksFlag: [true, true, true, true, true, true], //筛选名次按钮--综合模式
    twoSideFlag: [true, true, true, true, true, true, true], //筛选名次--两面模式
    roadBeadsFlag: [true, true, true], //筛选路珠按钮--综合模式
    singleBeadsFlag: [true, true], //单选模式下筛选路珠--单选模式
    roadBeads: [
        [context.$tex('大小'), context.$tex('单双'), context.$tex('龙虎')], //筛选路珠--综合模式
        [context.$tex('大小'), context.$tex('单双')], //筛选路珠--单选模式
        [context.$tex('大小'), context.$tex('单双'), context.$tex('龙虎')] //-筛选路珠-两面模式
    ],
    choiceResult: [
        {
            //第一球
            count: 1,
            flag: 'true'
        },
        {
            count: 1,
            flag: 'false'
        },
        {
            count: 1,
            flag: 'true'
        },
        {
            //第二球
            count: 1,
            flag: 'true'
        },
        {
            count: 1,
            flag: 'false'
        },
        {
            //第三球
            count: 1,
            flag: 'true'
        },
        {
            count: 1,
            flag: 'false'
        },
        {
            //第四球
            count: 1,
            flag: 'true'
        },
        {
            count: 1,
            flag: 'false'
        },
        {
            //第五球
            count: 1,
            flag: 'true'
        },
        {
            count: 1,
            flag: 'false'
        },
        {
            //总和
            count: 1,
            flag: 'true'
        },
        {
            count: 1,
            flag: 'false'
        }
    ],
    counts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //item出现的次数
    //开奖记录的标题
    titleInfo: {
        // code: 'ssc',
        time: context.$tex('时间'),
        periodNo: context.$tex('期数'),
        otherOne: [context.$tex('显示号码'), context.$tex('显示大小'), context.$tex('显示单双')],
        otherTwo: [
            {
                colspan: 3,
                title: context.$tex('总和')
            },
            {
                title: context.$tex('1-5龙虎')
            }
        ]
    },
    //路珠
    ranks: [
        [context.$tex('第一球'), context.$tex('第二球'), context.$tex('第三球'), context.$tex('第四球'), context.$tex('第五球'), context.$tex('总和')], //筛选名次--综合模式
        [context.$tex('第一球'), context.$tex('第二球'), context.$tex('第三球'), context.$tex('第四球'), context.$tex('第五球')], //筛选名次--单选模式
        [context.$tex('第一球'), context.$tex('第二球'), context.$tex('第三球'), context.$tex('第四球'), context.$tex('第五球'), context.$tex('总和'), context.$tex('龙虎')] //筛选名次-两面模式
    ],
    //走势
    openBalls: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        .join('')
        .repeat(5)
        .split(''),
    color: ['#3f99f2', '#FF0000'],
    trendTitle: [
        //走势标题
        {
            title: context.$tex('期号'),
            rowspan: 2
        },
        {
            title: context.$tex('开奖号码'),
            rowspan: 2,
            colspan: 5
        },
        {
            colspan: 10,
            title: context.$tex('万位走势')
        },
        {
            colspan: 10,
            title: context.$tex('千位走势')
        },
        {
            colspan: 10,
            title: context.$tex('百位走势')
        },
        {
            colspan: 10,
            title: context.$tex('十位走势')
        },
        {
            colspan: 10,
            title: context.$tex('个位走势')
        }
    ],
    statCategory: [
        {
            title: context.$tex('统计类型'),
            rowspan: 2,
            colspan: 6
        },
        {
            title: context.$tex('万位走势'),
            colspan: 10
        },
        {
            title: context.$tex('千位走势'),
            colspan: 10
        },
        {
            title: context.$tex('百位走势'),
            colspan: 10
        },
        {
            title: context.$tex('十位走势'),
            colspan: 10
        },
        {
            title: context.$tex('个位走势'),
            colspan: 10
        }
    ],
    getDescribe: function(openCodeArr) {
        let resultArray = []
        openCodeArr.sort((a, b) => {
            return a - b
        })
        //计算豹子、对子
        resultArray[0] = openCodeArr[2] - openCodeArr[1] == 0 ? 1 : 0
        resultArray[0] =
            openCodeArr[1] - openCodeArr[0] == 0
                ? ++resultArray[0]
                : resultArray[0]
        //计算顺子、半顺、杂六
        resultArray[1] = openCodeArr[2] - openCodeArr[1] == 1 ? 1 : 0
        resultArray[1] =
            openCodeArr[1] - openCodeArr[0] == 1
                ? ++resultArray[1]
                : resultArray[1]

        // if (openCodeArr[0] === 0) {
        //     if (openCodeArr[2] === 9) {
        //         //排序后最后一个是9，即号码中存在90，构成半顺
        //         if (fopenCodeArr[1] === 8) {
        //             //第二个号码是8，号码串是089，构成顺子
        //             resultArray[1] = 2
        //         } else if (openCodeArr[1] === 1) {
        //             //第二个号码是81，号码串是019，构成顺子
        //             resultArray[1] = 2
        //         } else {
        //             //半顺
        //             if (resultArray[0] === 0 && resultArray[1] === 0) {
        //                 //如果算出来是杂六
        //                 resultArray[1] = 1
        //             }
        //         }
        //     }
        // }
        // 2019.7.10 by xiaojiji
        if (Number(openCodeArr[0]) === 0) {
            if (Number(openCodeArr[2]) === 9) {
                //排序后最后一个是9，即号码中存在90，构成半顺
                if (Number(openCodeArr[1]) === 8) {
                    //第二个号码是8，号码串是089，构成顺子
                    resultArray[1] = 2
                } else if (Number(openCodeArr[1]) === 1) {
                    //第二个号码是81，号码串是019，构成顺子
                    resultArray[1] = 2
                } else {
                    //半顺
                    if (resultArray[0] === 0 && resultArray[1] === 0) {
                        //如果算出来是杂六
                        resultArray[1] = 1
                    }
                }
            }
        }
        if (resultArray[0] == 1) {
            //对子
            return {
                clr: 'blue',
                content: context.$tex('对子')
            }
        } else if (resultArray[0] == 2) {
            //豹子
            return {
                clr: 'blue',
                content: context.$tex('豹子')
            }
        } else if (resultArray[1] == 1) {
            //半顺
            return context.$tex('半顺')
        } else if (resultArray[1] == 2) {
            //顺子
            return {
                clr: 'blue',
                content: context.$tex('顺子')
            }
        } else {
            //杂六
            return context.$tex('杂六')
        }
    },
    getMixinInfo: function(results) {
        //总和-第一球-第五球-单双统计 返回的开奖结果列表
        let all = ['sum', 'one', 'two', 'three', 'four', 'five']
        let name = [context.$tex('总和'), context.$tex('第一球'), context.$tex('第二球'), context.$tex('第三球'), context.$tex('第四球'), context.$tex('第五球')]
        let desc = [context.$tex('单'), context.$tex('双'), context.$tex('大'), context.$tex('小')]
        let info = []
        for (let i = 0; i < 24; i++) {
            info.push(0)
        }
        for (let j = 0; j < 5; j++) {
            desc = desc.concat([context.$tex('单'), context.$tex('双'), context.$tex('大'), context.$tex('小')])
        }
        results.forEach(item => {
            let balls = item.lotteryNumber.split(',')
            let sum = 0
            balls.forEach((ball, index) => {
                sum += ball * 1
                if ((ball * 1) % 2 === 0) {
                    info[4 * (index + 1) + 1]++
                } else {
                    info[4 * (index + 1) + 0]++
                }
                if (ball * 1 > 5) {
                    info[4 * (index + 1) + 2]++
                } else {
                    info[4 * (index + 1) + 3]++
                }
            })
            if (sum % 2 === 0) {
                info[1]++
            } else {
                info[0]++
            }
            if (sum > 22) {
                info[2]++
            } else {
                info[3]++
            }
        })
        let mixinInfo = {
            count: info,
            name: name,
            desc: desc
        }
        return mixinInfo
    },
    getTwo: function(arr) {
        //对子分布
        for (let k = 0; k < 5; k++) {
            for (let i = 0, len = arr.length; i < len; i++) {
                for (let j = i + 1; j < arr.length; j++) {
                    //号码
                    if (
                        arr[i].ballsInfo.lotteryNumbers[k].content ===
                        arr[j].ballsInfo.lotteryNumbers[k].content
                    ) {
                        arr[i].ballsInfo.lotteryNumbers[k].double = true
                        arr[j].ballsInfo.lotteryNumbers[k].double = true
                    } else {
                        break
                    }
                }
                for (let j = i + 1; j < arr.length; j++) {
                    //大小
                    if (
                        arr[i].ballsInfo.sizes[k].number ===
                        arr[j].ballsInfo.sizes[k].number
                    ) {
                        arr[i].ballsInfo.sizes[k].double = true
                        arr[j].ballsInfo.sizes[k].double = true
                    } else {
                        break
                    }
                }
                for (let j = i + 1; j < arr.length; j++) {
                    //单双
                    if (
                        arr[i].ballsInfo.singles[k].number ===
                        arr[j].ballsInfo.singles[k].number
                    ) {
                        arr[i].ballsInfo.singles[k].double = true
                        arr[j].ballsInfo.singles[k].double = true
                    } else {
                        break
                    }
                }
            }
        }
    },
    getBallCount: function(balls) {
        //单个号码出现的次数
        let ballsCount = []
        for (let i = 0, len = 10; i < len; i++) {
            ballsCount.push({
                num: i,
                count: balls.filter(item => item == i).length
            })
        }
        return ballsCount
    },
    getLongData: function(arr) {
        //长龙统计
        let info = []
        for (let i = 0; i < 5; i++) {
            for (let j = 1; j < arr.length; j++) {
                //大小
                if (
                    arr[j].ballsInfo.sizes[i].content !==
                        arr[0].ballsInfo.sizes[i].content &&
                    j === 1
                ) {
                    break
                } else if (
                    arr[j].ballsInfo.sizes[i].content !==
                        arr[0].ballsInfo.sizes[i].content &&
                    j > 1
                ) {
                    info.push({
                        title: context.$tex("第{num}球", { num: i + 1 }),
                        content: arr[0].ballsInfo.sizes[i].content + j + context.$tex('期'),
                        count: j
                    })
                    break
                }
            }
            for (let j = 1; j < arr.length; j++) {
                //单双
                if (
                    arr[j].ballsInfo.singles[i].content !==
                        arr[0].ballsInfo.singles[i].content &&
                    j === 1
                ) {
                    break
                } else if (
                    arr[j].ballsInfo.singles[i].content !==
                        arr[0].ballsInfo.singles[i].content &&
                    j > 1
                ) {
                    info.push({
                        title: context.$tex("第{num}球", { num: i + 1 }),
                        content: arr[0].ballsInfo.singles[i].content + j + context.$tex('期'),
                        count: j
                    })
                    break
                }
            }
        }

        //龙虎和
        let status = arr[0].sumInfo.long
        for (let j = 1; j < arr.length; j++) {
            if (arr[j].sumInfo.long !== status && j === 1) {
                break
            } else if (arr[j].sumInfo.long !== status && j > 1) {
                info.push({
                    title: context.$tex('第1球'),
                    content: status + j + context.$tex('期'),
                    count: j
                })
                break
            }
        }

        //总和
        let firstSingle = arr[0].sumInfo.single
        let size = arr[0].sumInfo.small
        for (let j = 1; j < arr.length; j++) {
            //单双
            if (arr[j].sumInfo.single !== firstSingle && j === 1) {
                break
            } else if (arr[j].sumInfo.single !== firstSingle && j > 1) {
                info.push({
                    title: context.$tex('总和'),
                    content: firstSingle + j + context.$tex('期'),
                    count: j
                })
                break
            }
        }
        for (let j = 1; j < arr.length; j++) {
            //大小
            if (arr[j].sumInfo.small !== size && j === 1) {
                break
            } else if (arr[j].sumInfo.small !== size && j > 1) {
                info.push({
                    title: context.$tex('总和'),
                    content: size + j + context.$tex('期'),
                    count: j
                })
                break
            }
        }
        //排序
        info.sort((a, b) => {
            return b.count - a.count
        })
        return info
    },
    handlerRecordList: function(arr) {
        //开奖记录
        let ballContainer = []
        arr.forEach(item => {
            let balls = item.lotteryNumber.split(',')
            // let balls = item.lotteryNumber.split(',');
            let threeInfo = []
            let preThree = [balls[0], balls[1], balls[2]]
            let midThree = [balls[1], balls[2], balls[3]]
            let nextThree = [balls[2], balls[3], balls[4]]
            threeInfo[0] = CONFIG_SSC.getDescribe(preThree)
            threeInfo[1] = CONFIG_SSC.getDescribe(midThree)
            threeInfo[2] = CONFIG_SSC.getDescribe(nextThree)
            item.threeInfo = threeInfo
            ballContainer = ballContainer.concat(balls) //号码出现次数
            let sum = 0
            let [lotteryNumbers, sizes, singles] = [[], [], []]
            let ballsInfo = {}
            balls.forEach(ball => {
                sum += ball * 1
                let lotteryNumber = {
                    content: ball * 1,
                    single: ball % 2 === 0 ? false : true, //单双
                    small: ball * 1 > 4 ? false : true, //大小
                    double: false //对子
                }
                let size = {
                    number: ball * 1,
                    content: lotteryNumber.small ? context.$tex('小') : context.$tex('大'),
                    single: lotteryNumber.single, //单双
                    small: lotteryNumber.small, //大小
                    clr: lotteryNumber.small ? '#7f8ab0' : '#f9982e',
                    double: false //对子
                }
                let single = {
                    number: ball * 1,
                    content: lotteryNumber.single ? context.$tex('单') : context.$tex('双'),
                    single: lotteryNumber.single, //单双
                    small: lotteryNumber.small, //大小
                    clr: lotteryNumber.single ? '#7f8ab0' : '#f9982e',
                    double: false //对子
                }
                lotteryNumbers.push(lotteryNumber)
                sizes.push(size)
                singles.push(single)
            })
            ballsInfo.lotteryNumbers = lotteryNumbers
            ballsInfo.sizes = sizes
            ballsInfo.singles = singles
            let sumInfo = {
                sum: sum,
                small: sum > 22 ? context.$tex('大') : context.$tex('小'),
                single: sum % 2 === 0 ? context.$tex('双') : context.$tex('单'),
                sumClr: sum > 22 ? 'blue' : 'red',
                smallClr: sum > 22 ? 'blue' : 'red',
                singleClr: sum % 2 === 0 ? 'blue' : 'red',
                long:
                    balls[0] - balls[balls.length - 1] > 0
                        ? context.$tex('龙')
                        : balls[0] - balls[balls.length - 1] < 0 ? context.$tex('虎') : context.$tex('和')
            }
            item.sumInfo = sumInfo
            item.ballsInfo = ballsInfo
        })
        arr.totalNumCount = CONFIG_SSC.getBallCount(ballContainer) //号码出现的次数
        arr.mixinInfo = CONFIG_SSC.getMixinInfo(arr) //总和第一-第五球的单双大小统计
        arr.longData = CONFIG_SSC.getLongData(arr) //长龙统计
        CONFIG_SSC.getTwo(arr)
        return arr
    },
    analyRoadBeads: function(arr) {
        let roadBeadsList = []
        //第i球单双
        for (let i = 0; i < 5; i++) {
            let ballsInfo = {}
            let infoArray = [] //单双
            let oneCount = 0 //第i球单的个数
            let twoCount = 0 //第i球双的个数
            one: for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let singleInfo = {
                    clr: '#999',
                    content: context.$tex('单'),
                    flag: true, //真表示单
                    count: 1, //出现次数
                    choiceCount: -1,
                    choiceFlag: null
                }
                let doubleInfo = {
                    clr: '#be1204',
                    content: context.$tex('双'),
                    flag: false, //假表示双
                    count: 1, //出现次数
                    choiceCount: -1,
                    choiceFlag: null
                }
                for (let k = j + 1; k < arr.length; k++) {
                    let nextBalls = arr[k].lotteryNumber
                        .split(',')
                        .map(item => {
                            return item * 1
                        })
                    if (balls[i] % 2 === 0 && nextBalls[i] % 2 === 0) {
                        doubleInfo.content += context.$tex('双')
                        doubleInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(doubleInfo)
                            break one
                        }
                    } else if (balls[i] % 2 !== 0 && nextBalls[i] % 2 !== 0) {
                        singleInfo.content += context.$tex('单')
                        singleInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(singleInfo)
                            break one
                        }
                    } else {
                        if (balls[i] % 2 === 0) {
                            infoArray.push(doubleInfo)
                        } else {
                            infoArray.push(singleInfo)
                        }
                        j = k - 1
                        break
                    }
                }
                if (j === arr.length - 1) {
                    //最后一个加上
                    if (balls[i] % 2 === 0) {
                        infoArray.push(doubleInfo)
                    } else {
                        infoArray.push(singleInfo)
                    }
                }
            }
            //单双出现次数
            for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                if (balls[i] % 2 !== 0) {
                    oneCount++
                } else {
                    twoCount++
                }
            }
            ballsInfo.index = `第${i + 1}球`
            ballsInfo.ballIndex = i //第几球
            ballsInfo.isSingleDouble = true
            ballsInfo.roadBeadsIndex = 1 //大小、单双、龙虎顺序
            ballsInfo.choice = [
                //下拉框
                {
                    title: context.$tex('单'),
                    flag: 'true'
                },
                {
                    title: context.$tex('双'),
                    flag: 'false'
                }
            ]
            ballsInfo.name = context.$tex('单双')
            ballsInfo.oneName = context.$tex('单')
            ballsInfo.twoName = context.$tex('双')
            ballsInfo.oneCount = oneCount
            ballsInfo.twoCount = twoCount
            ballsInfo.rank = i === 0 ? i : 2 * i + 1
            ballsInfo.infoArray = infoArray
            roadBeadsList.push(ballsInfo)
        }

        //第i球大小
        for (let i = 0; i < 5; i++) {
            let ballsInfo = {}
            let infoArray = [] //大小
            let oneCount = 0 //第i球小的个数
            let twoCount = 0 //第i球大的个数
            one: for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let smallInfo = {
                    clr: '#999',
                    content: context.$tex('小'),
                    flag: true,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                let largeInfo = {
                    clr: '#be1204',
                    content: context.$tex('大'),
                    flag: false,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                for (let k = j + 1; k < arr.length; k++) {
                    let nextBalls = arr[k].lotteryNumber
                        .split(',')
                        .map(item => {
                            return item * 1
                        })
                    if (balls[i] > 4 && nextBalls[i] > 4) {
                        largeInfo.content += context.$tex('大')
                        largeInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(largeInfo)
                            break one
                        }
                    } else if (balls[i] <= 4 && nextBalls[i] <= 4) {
                        smallInfo.content += context.$tex('小')
                        smallInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(smallInfo)
                            break one
                        }
                    } else {
                        if (balls[i] > 4) {
                            infoArray.push(largeInfo)
                        } else {
                            infoArray.push(smallInfo)
                        }
                        j = k - 1
                        break
                    }
                }
                if (j === arr.length - 1) {
                    //最后一个加上
                    if (balls[i] > 4) {
                        infoArray.push(largeInfo)
                    } else {
                        infoArray.push(smallInfo)
                    }
                }
            }
            for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                if (balls[i] < 5) {
                    oneCount++
                } else {
                    twoCount++
                }
            }
            ballsInfo.index = `第${i + 1}球`
            ballsInfo.isSmallLarge = true
            ballsInfo.ballIndex = i //第几球
            ballsInfo.roadBeadsIndex = 0
            ballsInfo.name = context.$tex('大小')
            ballsInfo.choice = [
                //下拉框
                {
                    title: context.$tex('大'),
                    flag: 'false'
                },
                {
                    title: context.$tex('小'),
                    flag: 'true'
                }
            ]
            ballsInfo.oneCount = oneCount
            ballsInfo.twoCount = twoCount
            ballsInfo.oneName = context.$tex('小')
            ballsInfo.twoName = context.$tex('大')
            ballsInfo.rank = i === 0 ? i + 1 : (i + 1) * 2
            ballsInfo.infoArray = infoArray
            roadBeadsList.push(ballsInfo)
        }
        //第1球龙虎
        for (let i = 0; i < 1; i++) {
            let ballsInfo = {}
            let infoArray = [] //龙虎
            let oneCount = 0 //第一球龙的个数
            let twoCount = 0 //第一球虎的个数
            one: for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let dragonInfo = {
                    clr: '#f12a31',
                    content: context.$tex('龙'),
                    flag: true,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                let tigerInfo = {
                    clr: '#233fd4',
                    content: context.$tex('虎'),
                    flag: false,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                for (let k = j + 1; k < arr.length; k++) {
                    //龙虎
                    let lastIndex = balls.length - 1
                    let nextBalls = arr[k].lotteryNumber
                        .split(',')
                        .map(item => {
                            return item * 1
                        })
                    if (
                        balls[i] > balls[lastIndex] &&
                        nextBalls[i] > nextBalls[lastIndex]
                    ) {
                        dragonInfo.content += context.$tex('龙')
                        dragonInfo.count++
                        if (k === arr.lenght - 1) {
                            infoArray.push(dragonInfo)
                            break one
                        }
                    } else if (
                        balls[i] < balls[lastIndex] &&
                        nextBalls[i] < nextBalls[lastIndex]
                    ) {
                        tigerInfo.content += context.$tex('虎')
                        tigerInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(tigerInfo)
                            break one
                        }
                    } else if (
                        balls[i] !== balls[lastIndex] &&
                        nextBalls[i] !== nextBalls[lastIndex]
                    ) {
                        if (balls[i] > balls[lastIndex]) {
                            infoArray.push(dragonInfo)
                        } else if (balls[i] < balls[lastIndex]) {
                            infoArray.push(tigerInfo)
                        }
                        j = k - 1
                        break
                    }
                }
                if (j === arr.length - 1) {
                    if (balls[i] > balls[balls.length - 1]) {
                        infoArray.push(dragonInfo)
                    } else {
                        infoArray.push(tigerInfo)
                    }
                }
            }
            for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                if (balls[i] > balls[balls.length - 1]) {
                    oneCount++
                } else {
                    twoCount++
                }
            }
            ballsInfo.index = context.$tex('龙虎')
            ballsInfo.name = ''
            ballsInfo.ballIndex = 0
            ballsInfo.isDragonTiger = true
            ballsInfo.roadBeadsIndex = 2 //对应大小、单双、龙虎的顺序
            ballsInfo.choice = [
                //下拉框
                {
                    title: context.$tex('龙'),
                    flag: 'true'
                },
                {
                    title: context.$tex('虎'),
                    flag: 'false'
                }
            ]
            ballsInfo.oneCount = oneCount
            ballsInfo.twoCount = twoCount
            ballsInfo.oneName = context.$tex('龙')
            ballsInfo.twoName = context.$tex('虎')
            ballsInfo.rank = 2
            ballsInfo.infoArray = infoArray
            roadBeadsList.push(ballsInfo)
        }
        //总和单双
        for (let i = 0; i < 1; i++) {
            let ballsInfo = {}
            let infoArray = [] //和的单双
            let oneCount = 0 //和单的个数
            let twoCount = 0 //和双的个数
            one: for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let sumOne = balls.reduce((preVal, currVal) => {
                    return preVal + currVal
                }, 0)
                let sumSingleInfo = {
                    clr: '#233fd4',
                    content: context.$tex('单'),
                    flag: true,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                let sumDoubleInfo = {
                    clr: '#f12a31',
                    content: context.$tex('双'),
                    flag: false,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                for (let k = j + 1; k < arr.length; k++) {
                    let nextBalls = arr[k].lotteryNumber
                        .split(',')
                        .map(item => {
                            return item * 1
                        })
                    let sumTwo = nextBalls.reduce((preVal, currVal) => {
                        return preVal + currVal
                    }, 0)
                    if (sumOne % 2 === 0 && sumTwo % 2 === 0) {
                        sumDoubleInfo.content += context.$tex('双')
                        sumDoubleInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(sumDoubleInfo)
                            break one
                        }
                    } else if (sumOne % 2 !== 0 && sumTwo % 2 !== 0) {
                        sumSingleInfo.content += context.$tex('单')
                        sumSingleInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(sumSingleInfo)
                            break one
                        }
                    } else {
                        if (sumOne % 2 === 0) {
                            infoArray.push(sumDoubleInfo)
                        } else {
                            infoArray.push(sumSingleInfo)
                        }
                        j = k - 1
                        break
                    }
                }
                if (j === arr.length - 1) {
                    if (sumOne % 2 === 0) {
                        infoArray.push(sumDoubleInfo)
                    } else {
                        infoArray.push(sumSingleInfo)
                    }
                }
            }
            for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let sumOne = balls.reduce((preVal, currVal) => {
                    return preVal + currVal
                }, 0)
                if (sumOne % 2 === 0) {
                    twoCount++
                } else {
                    oneCount++
                }
            }
            ballsInfo.index = context.$tex('总和')
            ballsInfo.isSumSingleDouble = true
            ballsInfo.name = context.$tex('单双')
            ballsInfo.choice = [
                //下拉框
                {
                    title: context.$tex('单'),
                    flag: 'true'
                },
                {
                    title: context.$tex('双'),
                    flag: 'false'
                }
            ]
            ballsInfo.ballIndex = 5 //路珠筛选第几球
            ballsInfo.roadBeadsIndex = 1 //大小、单双、龙虎顺序
            ballsInfo.oneCount = oneCount
            ballsInfo.twoCount = twoCount
            ballsInfo.oneName = context.$tex('单')
            ballsInfo.twoName = context.$tex('双')
            ballsInfo.rank = 11
            ballsInfo.infoArray = infoArray
            roadBeadsList.push(ballsInfo)
        }
        //总和大小
        for (let i = 0; i < 1; i++) {
            let ballsInfo = {}
            let infoArray = []
            let oneCount = 0 //和大的个数
            let twoCount = 0 //和小的个数
            one: for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let sumOne = balls.reduce((preVal, currVal) => {
                    return preVal + currVal
                }, 0)
                let sumLargeInfo = {
                    clr: '#f12a31',
                    content: context.$tex('大'),
                    flag: false,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                let sumSmallInfo = {
                    clr: '#233fd4',
                    content: context.$tex('小'),
                    flag: true,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                for (let k = j + 1; k < arr.length; k++) {
                    let nextBalls = arr[k].lotteryNumber
                        .split(',')
                        .map(item => {
                            return item * 1
                        })
                    let sumTwo = nextBalls.reduce((newVal, currVal) => {
                        return newVal + currVal
                    }, 0)
                    if (sumOne > 22 && sumTwo > 22) {
                        sumLargeInfo.content += context.$tex('大')
                        sumLargeInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(sumLargeInfo)
                            break one
                        }
                    } else if (sumOne <= 22 && sumTwo <= 22) {
                        sumSmallInfo.content += context.$tex('小')
                        sumSmallInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(sumSmallInfo)
                            break one
                        }
                    } else {
                        if (sumOne > 22) {
                            infoArray.push(sumLargeInfo)
                        } else {
                            infoArray.push(sumSmallInfo)
                        }
                        j = k - 1
                        break
                    }
                }
                if (j === arr.length - 1) {
                    //最后一个加上
                    if (sumOne > 22) {
                        infoArray.push(sumLargeInfo)
                    } else {
                        infoArray.push(sumSmallInfo)
                    }
                }
            }
            for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let sumOne = balls.reduce((preVal, currVal) => {
                    return preVal + currVal
                }, 0)
                if (sumOne > 22) {
                    twoCount++
                } else {
                    oneCount++
                }
            }
            ballsInfo.index = context.$tex('总和')
            ballsInfo.name = context.$tex('大小')
            ballsInfo.isSumSmallLarge = true
            ballsInfo.ballIndex = 5
            ballsInfo.choice = [
                //下拉框
                {
                    title: context.$tex('大'),
                    flag: 'false'
                },
                {
                    title: context.$tex('小'),
                    flag: 'true'
                }
            ]
            ballsInfo.roadBeadsIndex = 0 //大小、单双、龙虎顺序
            ballsInfo.oneCount = oneCount
            ballsInfo.twoCount = twoCount
            ballsInfo.oneName = context.$tex('小')
            ballsInfo.twoName = context.$tex('大')
            ballsInfo.rank = 12
            ballsInfo.infoArray = infoArray
            roadBeadsList.push(ballsInfo)
        }
        roadBeadsList.sort((item1, item2) => {
            return item1.rank - item2.rank
        })
        return roadBeadsList
    },
    getBaseTrendData: function(arr) {
        //基本走势
        return handlerTrendData(arr, 50, 10, 0, false)
        // var result = {};
        // var timesInfo = []; //出现次数数组
        // var averMiss = []; //平均遗漏
        // var maxMiss = []; //最大遗漏
        // var connects = []; //连出
        // for (let i = 0; i < 50; i++) {
        // 	let miss = []; //遗漏次数
        // 	let tempConnect = [];
        // 	let times = 0; //号码出现的次数
        // 	let count = 0; //计数器
        // 	let connect = 0; //连出数
        // 	for (let j = arr.length - 1; j >= 0; j--) {
        // 		if (i === 0) {
        // 			arr[j].trendResultNumber = [];
        // 		}
        // 		let index = Math.floor(i / 10);
        // 		let balls = arr[j].lotteryNumber.split(',');
        // 		arr[j].trendNumbers = balls;
        // 		if (balls[index] * 1 !== i % 10) {
        // 			count++;
        // 			arr[j].trendResultNumber.push(count);
        // 		} else {
        // 			times++;
        // 			miss.push(count);
        // 			count = 0;
        // 			let info = {
        // 				content: balls[index] * 1,
        // 				clr: Math.floor(i / 10) % 2 === 0 ? "#3f99f2" : "#FF0000",
        // 				num: index + 1
        // 			}
        // 			arr[j].trendResultNumber.push(info);
        // 			connect++;
        // 			if (j > 0) {
        // 				for (let k = j - 1; k >= 0; k--) {
        // 					let nextBalls = arr[k].lotteryNumber.split(',');
        // 					if (balls[index] * 1 === nextBalls[index] * 1) {
        // 						connect++;
        // 					} else {
        // 						tempConnect.push(connect);
        // 						connect = 0;
        // 						break;
        // 					}
        // 				}
        // 			}

        // 		}
        // 		if (j === 0) {
        // 			miss.push(count);
        // 			!tempConnect.length && tempConnect.push(0);
        // 		}
        // 	}
        // 	maxMiss.push(Math.max(...miss));
        // 	averMiss.push(
        // 		times ? ((arr.length - times) / times).toFixed(1) : 0
        // 	);
        // 	timesInfo.push(times);
        // 	connects.push(Math.max(...tempConnect));
        // }
        // arr.trendTimesInfo = timesInfo;
        // arr.trendAverMiss = averMiss;
        // arr.trendMaxMiss = maxMiss;
        // arr.trendConnects = connects;
        // return arr;
    }
}
const CONFIG_11x5 = {
    //11x5
    subTitle: [context.$tex('今日双面/号码统计'), context.$tex('长龙统计'), context.$tex('号码分析')],
    ballsNum: [
        context.$tex('号码1'),
        context.$tex('号码2'),
        context.$tex('号码3'),
        context.$tex('号码4'),
        context.$tex('号码5'),
        context.$tex('号码6'),
        context.$tex('号码7'),
        context.$tex('号码8'),
        context.$tex('号码9'),
        context.$tex('号码10'),
        context.$tex('号码11')
    ],
    isActiveNumber: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], //切换球号
    singleDouble: [context.$tex('单'), context.$tex('双'), context.$tex('大'), context.$tex('小'), context.$tex('对子号'), context.$tex('还原')],
    //开奖记录的标题
    titleInfo: {
        time: context.$tex('时间'),
        periodNo: context.$tex('期数'),
        otherOne: [context.$tex('显示号码'), context.$tex('显示大小'), context.$tex('显示单双')],
        sum: {
            colspan: 3,
            title: context.$tex('总和')
        },
        dragonTiger: context.$tex('龙虎'),
        threeInfo: [context.$tex('前三'), context.$tex('中三'), context.$tex('后三')]
    },
    openBalls: [
        ,
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11'
    ]
        .join(',')
        .repeat(5)
        .split(',')
        .slice(1),
    //路珠分析
    ranks: [
        [context.$tex('第一球'), context.$tex('第二球'), context.$tex('第三球'), context.$tex('第四球'), context.$tex('第五球'), context.$tex('总和'), context.$tex('和尾')], //筛选名次--综合模式
        [context.$tex('第一球'), context.$tex('第二球'), context.$tex('第三球'), context.$tex('第四球'), context.$tex('第五球')], //筛选名次--单选模式
        [context.$tex('第一球'), context.$tex('第二球'), context.$tex('第三球'), context.$tex('第四球'), context.$tex('第五球'), context.$tex('总和'), context.$tex('和尾')] //筛选名次-两面模式
    ],
    roadBeads: [
        [context.$tex('大小'), context.$tex('单双'), context.$tex('龙虎')], //筛选路珠--综合模式
        [context.$tex('大小'), context.$tex('单双')], //筛选路珠--单选模式
        [context.$tex('大小'), context.$tex('单双'), context.$tex('龙虎')] //-筛选路珠-两面模式
    ],
    choiceResult: [
        {
            //第一球
            count: 1,
            flag: 'true'
        },
        {
            count: 1,
            flag: 'false'
        },
        {
            count: 1,
            flag: 'true'
        },
        {
            //第二球
            count: 1,
            flag: 'true'
        },
        {
            count: 1,
            flag: 'false'
        },
        {
            //第三球
            count: 1,
            flag: 'true'
        },
        {
            count: 1,
            flag: 'false'
        },
        {
            //第四球
            count: 1,
            flag: 'true'
        },
        {
            count: 1,
            flag: 'false'
        },
        {
            //第五球
            count: 1,
            flag: 'true'
        },
        {
            count: 1,
            flag: 'false'
        },
        {
            //总和
            count: 1,
            flag: 'true'
        },
        {
            count: 1,
            flag: 'false'
        },
        {
            //和尾
            count: 1,
            flag: 'false'
        }
    ],
    ranksFlag: [true, true, true, true, true, true, true], //筛选名次按钮--综合模式
    twoSideFlag: [true, true, true, true, true, true, true], //筛选名次--两面模式
    singleBeadsFlag: [true, true], //单选模式下筛选路珠--单选模式
    roadBeadsFlag: [true, true, true], //筛选路珠按钮--综合模式
    counts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //item出现的次数
    statCategory: [
        {
            title: context.$tex('统计类型'),
            rowspan: 2,
            colspan: 6
        },
        {
            title: context.$tex('第一球'),
            colspan: 11
        },
        {
            title: context.$tex('第二球'),
            colspan: 11
        },
        {
            title: context.$tex('第三球'),
            colspan: 11
        },
        {
            title: context.$tex('第四球'),
            colspan: 11
        },
        {
            title: context.$tex('第五球'),
            colspan: 11
        }
    ],
    color: ['#3f99f2', '#FF0000'],
    trendTitle: [
        //走势标题
        {
            title: context.$tex('期号'),
            rowspan: 2
        },
        {
            title: context.$tex('开奖号码'),
            rowspan: 2,
            colspan: 5
        },
        {
            colspan: 11,
            title: context.$tex('第一球')
        },
        {
            colspan: 11,
            title: context.$tex('第二球')
        },
        {
            colspan: 11,
            title: context.$tex('第三球')
        },
        {
            colspan: 11,
            title: context.$tex('第四球')
        },
        {
            colspan: 11,
            title: context.$tex('第五球')
        }
    ],
    /**
     * 计算前三后三中山位描述
     */
    getDescribe: function(openCodeArr) {
        let resultArray = []
        openCodeArr.sort((a, b) => {
            return a - b
        })
        //计算豹子、对子
        resultArray[0] = openCodeArr[2] - openCodeArr[1] == 0 ? 1 : 0
        resultArray[0] =
            openCodeArr[1] - openCodeArr[0] == 0
                ? ++resultArray[0]
                : resultArray[0]
        //计算顺子、半顺、杂六
        resultArray[1] = openCodeArr[2] - openCodeArr[1] == 1 ? 1 : 0
        resultArray[1] =
            openCodeArr[1] - openCodeArr[0] == 1
                ? ++resultArray[1]
                : resultArray[1]

        if (openCodeArr[0] === 0) {
            if (openCodeArr[2] === 9) {
                //排序后最后一个是9，即号码中存在90，构成半顺
                if (fopenCodeArr[1] === 8) {
                    //第二个号码是8，号码串是089，构成顺子
                    resultArray[1] = 2
                } else if (openCodeArr[1] === 1) {
                    //第二个号码是81，号码串是019，构成顺子
                    resultArray[1] = 2
                } else {
                    //半顺
                    if (resultArray[0] === 0 && resultArray[1] === 0) {
                        //如果算出来是杂六
                        resultArray[1] = 1
                    }
                }
            }
        }
        if (resultArray[0] == 1) {
            //对子
            return {
                clr: 'blue',
                content: context.$tex('对子')
            }
        } else if (resultArray[0] == 2) {
            //豹子
            return {
                clr: 'blue',
                content: context.$tex('豹子')
            }
        } else if (resultArray[1] == 1) {
            //半顺
            return context.$tex('半顺')
        } else if (resultArray[1] == 2) {
            //顺子
            return {
                clr: 'blue',
                content: context.$tex('顺子')
            }
        } else {
            //杂六
            return context.$tex('杂六')
        }
    },

    /**
     * 单个号码出现的次数
     */
    getBallCount: function(balls) {
        let ballsCount = []
        for (let i = 1; i <= 11; i++) {
            ballsCount.push({
                num: i,
                count: balls.filter(item => item * 1 == i).length
            })
        }
        return ballsCount
    },

    /**
     * 总和-第一球-第五球-单双统计
     */
    getMixinInfo: function(results) {
        //返回的开奖结果列表
        let all = ['sum', 'one', 'two', 'three', 'four', 'five']
        let name = [context.$tex('总和'), context.$tex('第一球'), context.$tex('第二球'), context.$tex('第三球'), context.$tex('第四球'), context.$tex('第五球')]
        let desc = [context.$tex('单'), context.$tex('双'), context.$tex('大'), context.$tex('小')]
        let info = []
        for (let i = 0; i < 24; i++) {
            info.push(0)
        }
        for (let j = 0; j < 5; j++) {
            desc = desc.concat([context.$tex('单'), context.$tex('双'), context.$tex('大'), context.$tex('小')])
        }
        results.forEach(item => {
            let balls = item.lotteryNumber.split(',')
            let sum = 0
            balls.forEach((ball, index) => {
                sum += ball * 1
                if ((ball * 1) % 2 === 0) {
                    info[4 * (index + 1) + 1]++
                } else {
                    info[4 * (index + 1) + 0]++
                }
                if (ball * 1 > 5) {
                    info[4 * (index + 1) + 2]++
                } else {
                    info[4 * (index + 1) + 3]++
                }
            })
            if (sum % 2 === 0) {
                info[1]++
            } else {
                info[0]++
            }
            if (sum > 22) {
                info[2]++
            } else {
                info[3]++
            }
        })
        let mixinInfo = {
            count: info,
            name: name,
            desc: desc
        }
        return mixinInfo
    },

    /**
     * 长龙统计
     */
    getLongData: function(arr) {
        let info = []
        if (!arr.length) return
        for (let i = 0; i < 5; i++) {
            for (let j = 1; j < arr.length; j++) {
                //大小
                if (
                    arr[j].ballsInfo.sizes[i].content !==
                        arr[0].ballsInfo.sizes[i].content &&
                    j === 1
                ) {
                    break
                } else if (
                    arr[j].ballsInfo.sizes[i].content !==
                        arr[0].ballsInfo.sizes[i].content &&
                    j > 1
                ) {
                    info.push({
                        title: context.$tex('第{num}球', { num: i + 1 }),
                        content: arr[0].ballsInfo.sizes[i].content + j + context.$tex('期'),
                        count: j
                    })
                    break
                }
            }
            for (let j = 1; j < arr.length; j++) {
                //单双
                if (
                    arr[j].ballsInfo.singles[i].content !==
                        arr[0].ballsInfo.singles[i].content &&
                    j === 1
                ) {
                    break
                } else if (
                    arr[j].ballsInfo.singles[i].content !==
                        arr[0].ballsInfo.singles[i].content &&
                    j > 1
                ) {
                    info.push({
                        title: context.$tex('第{num}球', { num: i + 1 }),
                        content: arr[0].ballsInfo.singles[i].content + j + context.$tex('期'),
                        count: j
                    })
                    break
                }
            }
        }

        //龙虎和
        let status = arr[0].dragonTiger.dragon
        for (let j = 1; j < arr.length; j++) {
            if (arr[j].dragonTiger.dragon !== status && j === 1) {
                break
            } else if (arr[j].dragonTiger.dragon !== status && j > 1) {
                info.push({
                    title: context.$tex('第{num}球', { num: 1 }),
                    content: status + j + context.$tex('期'),
                    count: j
                })
                break
            }
        }

        //总和
        let firstSingle = arr[0].sumInfo.single
        let size = arr[0].sumInfo.small
        let sumLastNum = arr[0].sumInfo.sumLastNum //总和尾数
        for (let j = 1; j < arr.length; j++) {
            //单双
            if (arr[j].sumInfo.single !== firstSingle && j === 1) {
                break
            } else if (arr[j].sumInfo.single !== firstSingle && j > 1) {
                info.push({
                    title: context.$tex('总和'),
                    content: firstSingle + j + context.$tex('期'),
                    count: j
                })
                break
            }
        }
        for (let j = 1; j < arr.length; j++) {
            //大小
            if (arr[j].sumInfo.small !== size && j === 1) {
                break
            } else if (arr[j].sumInfo.small !== size && j > 1) {
                info.push({
                    title: context.$tex('总和'),
                    content: size + j + context.$tex('期'),
                    count: j
                })
                break
            }
        }
        for (let j = 1; j < arr.length; j++) {
            //总尾数
            if (arr[j].sumInfo.sumLastNum !== sumLastNum && j === 1) {
                break
            } else if (arr[j].sumInfo.sumLastNum !== sumLastNum && j > 1) {
                info.push({
                    title: context.$tex('尾数'),
                    content: sumLastNum + j + context.$tex('期'),
                    count: j
                })
                break
            }
        }
        //排序
        info.sort((a, b) => {
            return b.count - a.count
        })
        return info
    },
    /**
     * 对子分布
     */
    getTwo: function(arr) {
        for (let k = 0; k < 5; k++) {
            for (let i = 0, len = arr.length; i < len; i++) {
                for (let j = i + 1; j < arr.length; j++) {
                    //号码
                    if (
                        arr[i].ballsInfo.lotteryNumbers[k].content ===
                        arr[j].ballsInfo.lotteryNumbers[k].content
                    ) {
                        arr[i].ballsInfo.lotteryNumbers[k].double = true
                        arr[j].ballsInfo.lotteryNumbers[k].double = true
                    } else {
                        break
                    }
                }
                for (let j = i + 1; j < arr.length; j++) {
                    //大小
                    if (
                        arr[i].ballsInfo.sizes[k].number ===
                        arr[j].ballsInfo.sizes[k].number
                    ) {
                        arr[i].ballsInfo.sizes[k].double = true
                        arr[j].ballsInfo.sizes[k].double = true
                    } else {
                        break
                    }
                }
                for (let j = i + 1; j < arr.length; j++) {
                    //单双
                    if (
                        arr[i].ballsInfo.singles[k].number ===
                        arr[j].ballsInfo.singles[k].number
                    ) {
                        arr[i].ballsInfo.singles[k].double = true
                        arr[j].ballsInfo.singles[k].double = true
                    } else {
                        break
                    }
                }
            }
        }
    },

    /**
     * 处理开奖记录表中数据
     */
    handlerRecordList: function(arr) {
        let ballContainer = []
        arr.forEach(item => {
            let balls = item.lotteryNumber.split(',')
            ballContainer = ballContainer.concat(balls) //号码出现次数
            let sum = 0
            let [lotteryNumbers, sizes, singles] = [[], [], []]
            let ballsInfo = {}
            balls.forEach(ball => {
                sum += ball * 1
                let lotteryNumber = {
                    content: ball * 1,
                    ball: ball,
                    single:
                        ball * 1 === 11 ? true : ball % 2 === 0 ? false : true, //单双
                    small: ball * 1 === 11 ? null : ball * 1 > 5 ? false : true, //大小
                    double: false //对子,
                }
                let size = {
                    number: ball * 1,
                    content:
                        lotteryNumber.small == null
                            ? context.$tex('和')
                            : lotteryNumber.small ? context.$tex('小') : context.$tex('大'),
                    single: lotteryNumber.single, //单双
                    small: lotteryNumber.small, //大小
                    clr:
                        lotteryNumber.small === null
                            ? '#00ab07'
                            : lotteryNumber.small ? '#7f8ab0' : '#f9982e',
                    double: false //对子
                }
                let single = {
                    number: ball * 1,
                    content:
                        lotteryNumber.content == 11
                            ? context.$tex('和')
                            : lotteryNumber.single ? context.$tex('单') : context.$tex('双'),
                    single: lotteryNumber.single, //单双
                    small: lotteryNumber.small, //大小
                    clr:
                        lotteryNumber.small === null
                            ? '#00ab07'
                            : lotteryNumber.single ? '#7f8ab0' : '#f9982e',
                    double: false //对子
                }
                lotteryNumbers.push(lotteryNumber)
                sizes.push(size)
                singles.push(single)
            })
            ballsInfo.lotteryNumbers = lotteryNumbers
            ballsInfo.sizes = sizes
            ballsInfo.singles = singles
            let sumInfo = {
                sum: sum,
                small: sum > 30 ? context.$tex('大') : context.$tex('小'),
                single: sum % 2 === 0 ? context.$tex('双') : context.$tex('单'),
                sumLastNum: sum % 10 > 5 ? context.$tex('大') : context.$tex('小')
                // long: balls[0] - balls[balls.length - 1] > 0 ? context.$tex('龙') : balls[0] - balls[balls.length - 1] < 0 ? context.$tex('虎') : context.$tex('和')
            }
            let dragonTiger = {
                //龙虎和
                dragon:
                    balls[0] - balls[balls.length - 1] > 0
                        ? context.$tex('龙')
                        : balls[0] - balls[balls.length - 1] < 0 ? context.$tex('虎') : context.$tex('和')
            }
            //顺子等
            let threeInfo = {}
            let preThree = [balls[0], balls[1], balls[2]]
            let midThree = [balls[1], balls[2], balls[3]]
            let nextThree = [balls[2], balls[3], balls[4]]
            threeInfo[0] = CONFIG_11x5.getDescribe(preThree)
            threeInfo[1] = CONFIG_11x5.getDescribe(midThree)
            threeInfo[2] = CONFIG_11x5.getDescribe(nextThree)
            item.threeInfo = threeInfo
            item.sumInfo = sumInfo
            item.ballsInfo = ballsInfo
            item.dragonTiger = dragonTiger
        })
        arr.totalNumCount = CONFIG_11x5.getBallCount(ballContainer) //号码出现的次数
        arr.mixinInfo = CONFIG_11x5.getMixinInfo(arr) //总和第一-第五球的单双大小统计
        arr.longData = CONFIG_11x5.getLongData(arr) //长龙统计
        CONFIG_11x5.getTwo(arr)
        return arr
    },
    analyRoadBeads: function(arr) {
        let roadBeadsList = []
        //第i球单双
        for (let i = 0; i < 5; i++) {
            let ballsInfo = {}
            let infoArray = [] //单双
            let oneCount = 0 //第i球单的个数
            let twoCount = 0 //第i球双的个数
            let threeCount = 0 //第i球和的个数
            one: for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let singleInfo = {
                    clr: '#999',
                    content: context.$tex('单'),
                    flag: true, //真表示单
                    count: 1, //出现次数
                    choiceCount: -1,
                    choiceFlag: null
                }
                let doubleInfo = {
                    clr: '#be1204',
                    content: context.$tex('双'),
                    flag: false, //假表示双
                    count: 1, //出现次数
                    choiceCount: -1,
                    choiceFlag: null
                }
                let equalInfo = {
                    //和
                    clr: '#00ab07',
                    content: context.$tex('和'),
                    flag: null, //null表示和
                    count: 1, //出现次数
                    choiceCount: -1,
                    choiceFlag: null
                }
                for (let k = j + 1; k < arr.length; k++) {
                    let nextBalls = arr[k].lotteryNumber
                        .split(',')
                        .map(item => {
                            return item * 1
                        })
                    if (balls[i] % 2 === 0 && nextBalls[i] % 2 === 0) {
                        doubleInfo.content += context.$tex('双')
                        doubleInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(doubleInfo)
                            break one
                        }
                    } else if (
                        balls[i] % 2 !== 0 &&
                        nextBalls[i] % 2 !== 0 &&
                        balls[i] !== 11 &&
                        nextBalls[i] !== 11
                    ) {
                        singleInfo.content += context.$tex('单')
                        singleInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(singleInfo)
                            break one
                        }
                    } else if (balls[i] === 11 && nextBalls[i] === 11) {
                        //和
                        equalInfo.content += context.$tex('和')
                        equalInfo.count++
                        if (k === arr.lenght - 1) {
                            infoArray.push(equalInfo)
                            break one
                        }
                    } else {
                        if (balls[i] % 2 === 0) {
                            infoArray.push(doubleInfo)
                        } else if (balls[i] % 2 !== 0 && balls[i] !== 11) {
                            infoArray.push(singleInfo)
                        } else {
                            infoArray.push(equalInfo)
                        }
                        j = k - 1
                        break
                    }
                }
                if (j === arr.length - 1) {
                    //最后一个加上
                    if (balls[i] % 2 === 0) {
                        infoArray.push(doubleInfo)
                    } else if (balls[i] % 2 !== 0 && balls[i] !== 11) {
                        infoArray.push(singleInfo)
                    } else {
                        infoArray.push(equalInfo)
                    }
                }
            }
            //单双和出现次数
            for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                if (balls[i] % 2 !== 0 && balls[i] !== 11) {
                    oneCount++
                } else if (balls[i] % 2 === 0) {
                    twoCount++
                } else {
                    //和
                    threeCount++
                }
            }
            ballsInfo.index = `第${i + 1}球`
            ballsInfo.ballIndex = i //第几球
            ballsInfo.isSingleDouble = true
            ballsInfo.roadBeadsIndex = 1 //大小、单双、龙虎顺序
            ballsInfo.choice = [
                //下拉框
                {
                    title: context.$tex('单'),
                    flag: 'true'
                },
                {
                    title: context.$tex('双'),
                    flag: 'false'
                },
                {
                    title: context.$tex('和'),
                    flag: 'null'
                }
            ]
            ballsInfo.name = context.$tex('单双')
            ballsInfo.oneName = context.$tex('单')
            ballsInfo.twoName = context.$tex('双')
            ballsInfo.threeName = context.$tex('和')
            ballsInfo.oneCount = oneCount
            ballsInfo.twoCount = twoCount
            ballsInfo.threeCount = threeCount
            ballsInfo.rank = i === 0 ? i : 2 * i + 1
            ballsInfo.infoArray = infoArray
            roadBeadsList.push(ballsInfo)
        }

        //第i球大小
        for (let i = 0; i < 5; i++) {
            let ballsInfo = {}
            let infoArray = [] //大小
            let oneCount = 0 //第i球小的个数
            let twoCount = 0 //第i球大的个数
            let threeCount = 0 //第i球和的个数
            one: for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let smallInfo = {
                    clr: '#999',
                    content: context.$tex('小'),
                    flag: true,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                let largeInfo = {
                    clr: '#be1204',
                    content: context.$tex('大'),
                    flag: false,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                let equalInfo = {
                    //和
                    clr: '#00ab07',
                    content: context.$tex('和'),
                    flag: null, //null表示和
                    count: 1, //出现次数
                    choiceCount: -1,
                    choiceFlag: null
                }
                for (let k = j + 1; k < arr.length; k++) {
                    let nextBalls = arr[k].lotteryNumber
                        .split(',')
                        .map(item => {
                            return item * 1
                        })
                    if (
                        balls[i] > 5 &&
                        nextBalls[i] > 5 &&
                        balls[i] !== 11 &&
                        nextBalls[i] !== 11
                    ) {
                        largeInfo.content += context.$tex('大')
                        largeInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(largeInfo)
                            break one
                        }
                    } else if (balls[i] <= 5 && nextBalls[i] <= 5) {
                        smallInfo.content += context.$tex('小')
                        smallInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(smallInfo)
                            break one
                        }
                    } else if (balls[i] === 11 && nextBalls[i] === 11) {
                        //和
                        equalInfo.content += context.$tex('和')
                        equalInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(equalInfo)
                            break one
                        }
                    } else {
                        if (balls[i] > 5 && balls[i] !== 11) {
                            infoArray.push(largeInfo)
                        } else if (balls[i] <= 5) {
                            infoArray.push(smallInfo)
                        } else {
                            infoArray.push(equalInfo)
                        }
                        j = k - 1
                        break
                    }
                }
                if (j === arr.length - 1) {
                    //最后一个加上
                    if (balls[i] > 5 && balls[i] !== 11) {
                        infoArray.push(largeInfo)
                    } else if (balls[i] <= 5) {
                        infoArray.push(smallInfo)
                    } else {
                        infoArray.push(equalInfo)
                    }
                }
            }
            for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                if (balls[i] <= 5) {
                    oneCount++
                } else if (balls[i] > 5 && balls[i] !== 11) {
                    twoCount++
                } else {
                    threeCount++
                }
            }
            ballsInfo.index = `第${i + 1}球`
            ballsInfo.isSmallLarge = true
            ballsInfo.ballIndex = i //第几球
            ballsInfo.roadBeadsIndex = 0
            ballsInfo.name = context.$tex('大小')
            ballsInfo.choice = [
                //下拉框
                {
                    title: context.$tex('大'),
                    flag: 'false'
                },
                {
                    title: context.$tex('小'),
                    flag: 'true'
                },
                {
                    title: context.$tex('和'),
                    flag: 'null'
                }
            ]
            ballsInfo.oneCount = oneCount
            ballsInfo.twoCount = twoCount
            ballsInfo.threeCount = threeCount
            ballsInfo.oneName = context.$tex('小')
            ballsInfo.twoName = context.$tex('大')
            ballsInfo.threeName = context.$tex('和')
            ballsInfo.rank = i === 0 ? i + 1 : (i + 1) * 2
            ballsInfo.infoArray = infoArray
            roadBeadsList.push(ballsInfo)
        }
        //第1球龙虎
        for (let i = 0; i < 1; i++) {
            let ballsInfo = {}
            let infoArray = [] //龙虎
            let oneCount = 0 //第一球龙的个数
            let twoCount = 0 //第一球虎的个数
            one: for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let dragonInfo = {
                    clr: '#f12a31',
                    content: context.$tex('龙'),
                    flag: true,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                let tigerInfo = {
                    clr: '#233fd4',
                    content: context.$tex('虎'),
                    flag: false,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                for (let k = j + 1; k < arr.length; k++) {
                    //龙虎
                    let lastIndex = balls.length - 1
                    let nextBalls = arr[k].lotteryNumber
                        .split(',')
                        .map(item => {
                            return item * 1
                        })
                    if (
                        balls[i] > balls[lastIndex] &&
                        nextBalls[i] > nextBalls[lastIndex]
                    ) {
                        dragonInfo.content += context.$tex('龙')
                        dragonInfo.count++
                        if (k === arr.lenght - 1) {
                            infoArray.push(dragonInfo)
                            break one
                        }
                    } else if (
                        balls[i] < balls[lastIndex] &&
                        nextBalls[i] < nextBalls[lastIndex]
                    ) {
                        tigerInfo.content += context.$tex('虎')
                        tigerInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(tigerInfo)
                            break one
                        }
                    } else if (
                        balls[i] !== balls[lastIndex] &&
                        nextBalls[i] !== nextBalls[lastIndex]
                    ) {
                        if (balls[i] > balls[lastIndex]) {
                            infoArray.push(dragonInfo)
                        } else if (balls[i] < balls[lastIndex]) {
                            infoArray.push(tigerInfo)
                        }
                        j = k - 1
                        break
                    }
                }
                if (j === arr.length - 1) {
                    if (balls[i] > balls[balls.length - 1]) {
                        infoArray.push(dragonInfo)
                    } else {
                        infoArray.push(tigerInfo)
                    }
                }
            }
            for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                if (balls[i] > balls[balls.length - 1]) {
                    oneCount++
                } else {
                    twoCount++
                }
            }
            ballsInfo.index = context.$tex('龙虎')
            ballsInfo.name = ''
            ballsInfo.ballIndex = 0
            ballsInfo.isDragonTiger = true
            ballsInfo.roadBeadsIndex = 2 //对应大小、单双、龙虎的顺序
            ballsInfo.choice = [
                //下拉框
                {
                    title: context.$tex('龙'),
                    flag: 'true'
                },
                {
                    title: context.$tex('虎'),
                    flag: 'false'
                }
            ]
            ballsInfo.oneCount = oneCount
            ballsInfo.twoCount = twoCount
            ballsInfo.oneName = context.$tex('龙')
            ballsInfo.twoName = context.$tex('虎')
            ballsInfo.rank = 2
            ballsInfo.infoArray = infoArray
            roadBeadsList.push(ballsInfo)
        }
        //总和单双
        for (let i = 0; i < 1; i++) {
            let ballsInfo = {}
            let infoArray = [] //和的单双
            let oneCount = 0 //和单的个数
            let twoCount = 0 //和双的个数
            let threeCount = 0 //和的和个数
            one: for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let sumOne = balls.reduce((preVal, currVal) => {
                    return preVal + currVal
                }, 0)
                let sumSingleInfo = {
                    clr: '#233fd4',
                    content: context.$tex('单'),
                    flag: true,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                let sumDoubleInfo = {
                    clr: '#f12a31',
                    content: context.$tex('双'),
                    flag: false,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                let equalInfo = {
                    clr: '#00ab07',
                    content: context.$tex('和'),
                    flag: null,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                for (let k = j + 1; k < arr.length; k++) {
                    let nextBalls = arr[k].lotteryNumber
                        .split(',')
                        .map(item => {
                            return item * 1
                        })
                    let sumTwo = nextBalls.reduce((preVal, currVal) => {
                        return preVal + currVal
                    }, 0)
                    if (
                        sumOne % 2 === 0 &&
                        sumTwo % 2 === 0 &&
                        sumOne !== 30 &&
                        sumTwo !== 30
                    ) {
                        sumDoubleInfo.content += context.$tex('双')
                        sumDoubleInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(sumDoubleInfo)
                            break one
                        }
                    } else if (sumOne % 2 !== 0 && sumTwo % 2 !== 0) {
                        sumSingleInfo.content += context.$tex('单')
                        sumSingleInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(sumSingleInfo)
                            break one
                        }
                    } else if (sumOne === 30 && sumTwo === 30) {
                        equalInfo.content += context.$tex('和')
                        equalInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(equalInfo)
                            break one
                        }
                    } else {
                        if (sumOne % 2 === 0 && sumOne !== 30) {
                            infoArray.push(sumDoubleInfo)
                        } else if (sumOne % 2 !== 0) {
                            infoArray.push(sumSingleInfo)
                        } else {
                            infoArray.push(equalInfo)
                        }
                        j = k - 1
                        break
                    }
                }
                if (j === arr.length - 1) {
                    if (sumOne % 2 === 0 && sumOne % 2 !== 30) {
                        infoArray.push(sumDoubleInfo)
                    } else if (sumOne % 2 !== 0) {
                        infoArray.push(sumSingleInfo)
                    } else {
                        infoArray.push(equalInfo)
                    }
                }
            }
            for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let sumOne = balls.reduce((preVal, currVal) => {
                    return preVal + currVal
                }, 0)
                if (sumOne % 2 === 0 && sumOne !== 30) {
                    twoCount++
                } else if (sumOne % 2 !== 0) {
                    oneCount++
                } else {
                    threeCount++
                }
            }
            ballsInfo.index = context.$tex('总和')
            ballsInfo.isSumSingleDouble = true
            ballsInfo.name = context.$tex('单双')
            ballsInfo.choice = [
                //下拉框
                {
                    title: context.$tex('单'),
                    flag: 'true'
                },
                {
                    title: context.$tex('双'),
                    flag: 'false'
                },
                {
                    title: context.$tex('和'),
                    flag: 'null'
                }
            ]
            ballsInfo.ballIndex = 5 //路珠筛选第几球
            ballsInfo.roadBeadsIndex = 1 //大小、单双、龙虎顺序
            ballsInfo.oneCount = oneCount
            ballsInfo.twoCount = twoCount
            ballsInfo.threeCount = threeCount
            ballsInfo.oneName = context.$tex('单')
            ballsInfo.twoName = context.$tex('双')
            ballsInfo.threeName = context.$tex('和')
            ballsInfo.rank = 11
            ballsInfo.infoArray = infoArray
            roadBeadsList.push(ballsInfo)
        }
        //总和大小
        for (let i = 0; i < 1; i++) {
            let ballsInfo = {}
            let infoArray = []
            let oneCount = 0 //和大的个数
            let twoCount = 0 //和小的个数
            let threeCount = 0 //和的和个数
            one: for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let sumOne = balls.reduce((preVal, currVal) => {
                    return preVal + currVal
                }, 0)
                let sumLargeInfo = {
                    clr: '#f12a31',
                    content: context.$tex('大'),
                    flag: false,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                let sumSmallInfo = {
                    clr: '#233fd4',
                    content: context.$tex('小'),
                    flag: true,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                let equalInfo = {
                    clr: '#00ab07',
                    content: context.$tex('和'),
                    flag: null,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                for (let k = j + 1; k < arr.length; k++) {
                    let nextBalls = arr[k].lotteryNumber
                        .split(',')
                        .map(item => {
                            return item * 1
                        })
                    let sumTwo = nextBalls.reduce((newVal, currVal) => {
                        return newVal + currVal
                    }, 0)
                    if (sumOne > 30 && sumTwo > 30) {
                        sumLargeInfo.content += context.$tex('大')
                        sumLargeInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(sumLargeInfo)
                            break one
                        }
                    } else if (sumOne < 30 && sumTwo < 30) {
                        sumSmallInfo.content += context.$tex('小')
                        sumSmallInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(sumSmallInfo)
                            break one
                        }
                    } else if (sumOne === 30 && sumTwo === 30) {
                        equalInfo.content += context.$tex('和')
                        equalInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(equalInfo)
                            break one
                        }
                    } else {
                        if (sumOne > 30) {
                            infoArray.push(sumLargeInfo)
                        } else if (sumOne < 30) {
                            infoArray.push(sumSmallInfo)
                        } else {
                            infoArray.push(equalInfo)
                        }
                        j = k - 1
                        break
                    }
                }
                if (j === arr.length - 1) {
                    //最后一个加上
                    if (sumOne > 30) {
                        infoArray.push(sumLargeInfo)
                    } else if (sumOne < 30) {
                        infoArray.push(sumSmallInfo)
                    } else {
                        infoArray.push(equalInfo)
                    }
                }
            }
            for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let sumOne = balls.reduce((preVal, currVal) => {
                    return preVal + currVal
                }, 0)
                if (sumOne > 30) {
                    twoCount++
                } else if (sumOne < 30) {
                    oneCount++
                } else {
                    threeCount++
                }
            }
            ballsInfo.index = context.$tex('总和')
            ballsInfo.name = context.$tex('大小')
            ballsInfo.isSumSmallLarge = true
            ballsInfo.ballIndex = 5
            ballsInfo.choice = [
                //下拉框
                {
                    title: context.$tex('大'),
                    flag: 'false'
                },
                {
                    title: context.$tex('小'),
                    flag: 'true'
                },
                {
                    title: context.$tex('和'),
                    flag: 'null'
                }
            ]
            ballsInfo.roadBeadsIndex = 0 //大小、单双、龙虎顺序
            ballsInfo.oneCount = oneCount
            ballsInfo.twoCount = twoCount
            ballsInfo.threeCount = threeCount
            ballsInfo.oneName = context.$tex('小')
            ballsInfo.twoName = context.$tex('大')
            ballsInfo.threeName = context.$tex('和')
            ballsInfo.rank = 12
            ballsInfo.infoArray = infoArray
            roadBeadsList.push(ballsInfo)
        }
        //总和和尾
        for (let i = 0; i < 1; i++) {
            let ballsInfo = {}
            let infoArray = []
            let oneCount = 0 //和大的个数
            let twoCount = 0 //和小的个数
            one: for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let sumOne = balls.reduce((preVal, currVal) => {
                    return preVal + currVal
                }, 0)
                let sumLargeInfo = {
                    clr: '#f12a31',
                    content: context.$tex('大'),
                    flag: false,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                let sumSmallInfo = {
                    clr: '#233fd4',
                    content: context.$tex('小'),
                    flag: true,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                for (let k = j + 1; k < arr.length; k++) {
                    let nextBalls = arr[k].lotteryNumber
                        .split(',')
                        .map(item => {
                            return item * 1
                        })
                    let sumTwo = nextBalls.reduce((newVal, currVal) => {
                        return newVal + currVal
                    }, 0)
                    if (sumOne % 10 > 4 && sumTwo % 10 > 4) {
                        sumLargeInfo.content += context.$tex('大')
                        sumLargeInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(sumLargeInfo)
                            break one
                        }
                    } else if (sumOne % 10 <= 4 && sumTwo <= 4) {
                        sumSmallInfo.content += context.$tex('小')
                        sumSmallInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(sumSmallInfo)
                            break one
                        }
                    } else {
                        if (sumOne % 10 > 4) {
                            infoArray.push(sumLargeInfo)
                        } else if (sumOne % 10 <= 4) {
                            infoArray.push(sumSmallInfo)
                        }
                        j = k - 1
                        break
                    }
                }
                if (j === arr.length - 1) {
                    //最后一个加上
                    if (sumOne % 10 > 4) {
                        infoArray.push(sumLargeInfo)
                    } else if (sumOne % 10 <= 4) {
                        infoArray.push(sumSmallInfo)
                    }
                }
            }
            for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let sumOne = balls.reduce((preVal, currVal) => {
                    return preVal + currVal
                }, 0)
                if (sumOne % 10 > 4) {
                    twoCount++
                } else {
                    oneCount++
                }
            }
            ballsInfo.index = context.$tex('和尾')
            ballsInfo.name = context.$tex('大小')
            ballsInfo.isSumSmallLarge = true
            ballsInfo.ballIndex = 6
            ballsInfo.choice = [
                //下拉框
                {
                    title: context.$tex('大'),
                    flag: 'false'
                },
                {
                    title: context.$tex('小'),
                    flag: 'true'
                }
            ]
            ballsInfo.roadBeadsIndex = 0 //大小、单双、龙虎顺序
            ballsInfo.oneCount = oneCount
            ballsInfo.twoCount = twoCount
            ballsInfo.oneName = context.$tex('小')
            ballsInfo.twoName = context.$tex('大')
            ballsInfo.rank = 13
            ballsInfo.infoArray = infoArray
            roadBeadsList.push(ballsInfo)
        }
        roadBeadsList.sort((item1, item2) => {
            return item1.rank - item2.rank
        })
        return roadBeadsList
    },

    getBaseTrendData: function(arr) {
        //基本走势
        return handlerTrendData(arr, 55, 11, 1, true)
        // var timesInfo = []; //出现次数数组
        // var averMiss = []; //平均遗漏
        // var maxMiss = []; //最大遗漏
        // var connects = []; //连出
        // let currMiss = []; //当前遗漏
        // for (let i = 0; i < 55; i++) {
        // 	let miss = []; //遗漏次数
        // 	let tempConnect = [];
        // 	let times = 0; //号码出现的次数
        // 	let count = 0; //计数器
        // 	let connect = 0; //连出数
        // 	for (let j = arr.length - 1; j >= 0; j--) {
        // 		if (i === 0) {
        // 			arr[j].trendResultNumber = [];
        // 		}
        // 		let balls = arr[j].lotteryNumber.split(',');
        // 		arr[j].trendNumbers = balls;
        // 		let index = Math.floor(i / 11);
        // 		if (balls[index] * 1 !== (i % 11 + 1)) {
        // 			count++;
        // 			arr[j].trendResultNumber.push(count);
        // 		} else {
        // 			times++;
        // 			miss.push(count);
        // 			count = 0;
        // 			let info = {
        // 				content: balls[index],
        // 				clr: Math.floor(i / 11) % 2 === 0 ? "#3f99f2" : "#FF0000",
        // 				num: index + 1
        // 			}
        // 			arr[j].trendResultNumber.push(info);
        // 			connect++;
        // 			if (j > 0) {
        // 				for (let k = j - 1; k >= 0; k--) {
        // 					let nextBalls = arr[k].lotteryNumber.split(',');
        // 					if (balls[index] * 1 === nextBalls[index] * 1) {
        // 						connect++;
        // 					} else {
        // 						tempConnect.push(connect);
        // 						connect = 0;
        // 						break;
        // 					}
        // 				}
        // 			}

        // 		}
        // 		if (j === 0) {
        // 			miss.push(count);
        // 			!tempConnect.length && tempConnect.push(0);
        // 		}
        // 	}
        // 	maxMiss.push(Math.max(...miss));
        // 	averMiss.push(
        // 		times ? ((arr.length - times) / times).toFixed(1) : 0
        // 	);
        // 	//当前遗漏
        // 	currMiss.push(count);
        // 	timesInfo.push(times);
        // 	connects.push(Math.max(...tempConnect));
        // }
        // arr.trendTimesInfo = timesInfo;
        // arr.trendAverMiss = averMiss;
        // arr.trendMaxMiss = maxMiss;
        // arr.trendConnects = connects;
        // arr.currMiss = currMiss;
        // return arr;
    }
}
const CONFIG_KLSF = {
    //快乐十分
    //开奖记录的标题
    titleInfo: {
        time: context.$tex('时间'),
        periodNo: context.$tex('期数'),
        otherOne: [context.$tex('显示号码'), context.$tex('显示大小'), context.$tex('显示单双')],
        otherTwo: {
            colspan: 3,
            title: context.$tex('总和')
        },
        last: context.$tex('尾大小'),

        dragonTiger: {
            title: context.$tex('龙虎'),
            colspan: 4
        }
    },
    singleDouble: [context.$tex('单'), context.$tex('双'), context.$tex('大'), context.$tex('小'), context.$tex('对子号'), context.$tex('还原')],
    subTitle: [context.$tex('今日双面/号码统计'), context.$tex('长龙统计'), context.$tex('号码分析')],
    ranking: [
        //双面统计--名次
        {
            title: context.$tex('第一球'),
            colspan: 4
        },
        {
            title: context.$tex('第二球'),
            colspan: 4
        },
        {
            title: context.$tex('第三球'),
            colspan: 4
        },
        {
            title: context.$tex('第四球'),
            colspan: 4
        },
        {
            title: context.$tex('第五球'),
            colspan: 4
        },
        {
            title: context.$tex('第六球'),
            colspan: 4
        },
        {
            title: context.$tex('第七球'),
            colspan: 4
        },
        {
            title: context.$tex('第八球'),
            colspan: 4
        }
    ],
    singleDoubleTitle: [context.$tex('单'), context.$tex('双'), context.$tex('大'), context.$tex('小')]
        .join('')
        .repeat(8)
        .split(''),
    dragonTigerTitle: [
        //双面统计--冠亚龙虎
        {
            title: context.$tex('总和'),
            colspan: 4
        },
        {
            title: context.$tex('第一名龙虎'),
            colspan: 2
        },
        {
            title: context.$tex('第二名龙虎'),
            colspan: 2
        },
        {
            title: context.$tex('第三名龙虎'),
            colspan: 2
        },
        {
            title: context.$tex('第四名龙虎'),
            colspan: 2
        }
    ],
    dragonTigerSubTitle: [
        context.$tex('单'),
        context.$tex('双'),
        context.$tex('大'),
        context.$tex('小'),
        context.$tex('龙'),
        context.$tex('虎'),
        context.$tex('龙'),
        context.$tex('虎'),
        context.$tex('龙'),
        context.$tex('虎'),
        context.$tex('龙'),
        context.$tex('虎')
    ],
    //路珠
    ranks: [
        [
            context.$tex('第一球'),
            context.$tex('第二球'),
            context.$tex('第三球'),
            context.$tex('第四球'),
            context.$tex('第五球'),
            context.$tex('第六球'),
            context.$tex('第七球'),
            context.$tex('第八球'),
            context.$tex('总和')
        ], //筛选名次--综合模式
        [
            context.$tex('第一球'),
            context.$tex('第二球'),
            context.$tex('第三球'),
            context.$tex('第四球'),
            context.$tex('第五球'),
            context.$tex('第六球'),
            context.$tex('第七球'),
            context.$tex('第八球')
        ], //筛选名次--单选模式
        [
            context.$tex('第一球'),
            context.$tex('第二球'),
            context.$tex('第三球'),
            context.$tex('第四球'),
            context.$tex('第五球'),
            context.$tex('第六球'),
            context.$tex('第七球'),
            context.$tex('第八球'),
            context.$tex('总和')
        ] //筛选名次-两面模式
    ],
    roadBeads: [
        [context.$tex('大小'), context.$tex('单双'), context.$tex('龙虎'), context.$tex('尾数大小'), context.$tex('合数单双')], //筛选路珠--综合模式
        [context.$tex('大小'), context.$tex('单双'), context.$tex('龙虎'), context.$tex('尾数大小'), context.$tex('合数单双')], //筛选路珠--单选模式
        [context.$tex('大小'), context.$tex('单双'), context.$tex('龙虎'), context.$tex('尾数大小'), context.$tex('合数单双')] //-筛选路珠-两面模式
    ],
    choiceResult: [
        {
            //第一球
            count: 1, //单双
            flag: 'true'
        },
        {
            count: 1, //大小
            flag: 'false'
        },
        {
            count: 1, //龙虎
            flag: 'true'
        },
        {
            count: 1, //尾大尾小
            flag: 'true'
        },
        {
            count: 1, //合单合双
            flag: 'true'
        },
        {
            //第一球
            count: 1, //单双
            flag: 'true'
        },
        {
            count: 1, //大小
            flag: 'false'
        },
        {
            count: 1, //龙虎
            flag: 'true'
        },
        {
            count: 1, //尾大尾小
            flag: 'true'
        },
        {
            count: 1, //合单合双
            flag: 'true'
        },
        {
            //第一球
            count: 1, //单双
            flag: 'true'
        },
        {
            count: 1, //大小
            flag: 'false'
        },
        {
            count: 1, //龙虎
            flag: 'true'
        },
        {
            count: 1, //尾大尾小
            flag: 'true'
        },
        {
            count: 1, //合单合双
            flag: 'true'
        },
        {
            //第一球
            count: 1, //单双
            flag: 'true'
        },
        {
            count: 1, //大小
            flag: 'false'
        },
        {
            count: 1, //龙虎
            flag: 'true'
        },
        {
            count: 1, //尾大尾小
            flag: 'true'
        },
        {
            count: 1, //合单合双
            flag: 'true'
        },
        {
            //第一球
            count: 1, //单双
            flag: 'true'
        },
        {
            count: 1, //大小
            flag: 'false'
        },
        {
            count: 1, //龙虎
            flag: 'true'
        },
        {
            count: 1, //尾大尾小
            flag: 'true'
        },
        {
            count: 1, //合单合双
            flag: 'true'
        },
        {
            //第一球
            count: 1, //单双
            flag: 'true'
        },
        {
            count: 1, //大小
            flag: 'false'
        },
        {
            count: 1, //龙虎
            flag: 'true'
        },
        {
            count: 1, //尾大尾小
            flag: 'true'
        },
        {
            count: 1, //合单合双
            flag: 'true'
        },
        {
            //第一球
            count: 1, //单双
            flag: 'true'
        },
        {
            count: 1, //大小
            flag: 'false'
        },
        {
            count: 1, //龙虎
            flag: 'true'
        },
        {
            count: 1, //尾大尾小
            flag: 'true'
        },
        {
            count: 1, //合单合双
            flag: 'true'
        },
        {
            //第一球
            count: 1, //单双
            flag: 'true'
        },
        {
            count: 1, //大小
            flag: 'false'
        },
        {
            count: 1, //龙虎
            flag: 'true'
        },
        {
            count: 1, //尾大尾小
            flag: 'true'
        },
        {
            count: 1, //合单合双
            flag: 'true'
        },

        {
            count: 1, //总和单双
            flag: 'true'
        },
        {
            count: 1, //总和大小
            flag: 'false'
        },
        {
            count: 1, //总和尾大
            flag: 'false'
        }
    ],
    ranksFlag: [true, true, true, true, true, true, true, true, true],
    twoSideFlag: [true, true, true, true, true, true, true, true, true],
    singleBeadsFlag: [true, true, true, true, true],
    roadBeadsFlag: [true, true, true, true, true],
    counts: [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ],
    trendTitle: [
        //走势标题
        {
            title: context.$tex('期号'),
            rowspan: 2
        },
        {
            title: context.$tex('开奖号码'),
            rowspan: 2,
            colspan: 1
        },
        {
            colspan: 20,
            title: context.$tex('号码分布')
        },
        {
            colspan: 8,
            title: context.$tex('总分')
        }
    ],
    color: ['#3f99f2', '#FF0000'],
    openBalls: [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        context.$tex('和值'),
        context.$tex('大'),
        context.$tex('小'),
        context.$tex('和'),
        context.$tex('单'),
        context.$tex('双'),
        context.$tex('尾大'),
        context.$tex('尾小')
    ],
    statCategory: [
        {
            title: context.$tex('统计类型'),
            rowspan: 2,
            colspan: 2
        },
        {
            title: context.$tex('号码分布'),
            colspan: 20
        },
        {
            title: context.$tex('总分'),
            colspan: 8
        }
    ],
    isActiveNumber: [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
    ], //切换球号
    ballsNum: [
        context.$tex('号码1'),
        context.$tex('号码2'),
        context.$tex('号码3'),
        context.$tex('号码4'),
        context.$tex('号码5'),
        context.$tex('号码6'),
        context.$tex('号码7'),
        context.$tex('号码8'),
        context.$tex('号码9'),
        context.$tex('号码10'),
        context.$tex('号码11'),
        context.$tex('号码12'),
        context.$tex('号码13'),
        context.$tex('号码14'),
        context.$tex('号码15'),
        context.$tex('号码16'),
        context.$tex('号码17'),
        context.$tex('号码18'),
        context.$tex('号码19'),
        context.$tex('号码20')
    ],

    /**
     * 对子分布
     * 10--表示10个号码
     */
    getTwo: function(arr) {
        for (let k = 0; k < 8; k++) {
            for (let i = 0, len = arr.length; i < len; i++) {
                for (let j = i + 1; j < arr.length; j++) {
                    //号码
                    if (
                        arr[i].ballsInfo.lotteryNumbers[k].content ===
                        arr[j].ballsInfo.lotteryNumbers[k].content
                    ) {
                        arr[i].ballsInfo.lotteryNumbers[k].double = true
                        arr[j].ballsInfo.lotteryNumbers[k].double = true
                    } else {
                        break
                    }
                }
                for (let j = i + 1; j < arr.length; j++) {
                    //大小
                    if (
                        arr[i].ballsInfo.sizes[k].number ===
                        arr[j].ballsInfo.sizes[k].number
                    ) {
                        arr[i].ballsInfo.sizes[k].double = true
                        arr[j].ballsInfo.sizes[k].double = true
                    } else {
                        break
                    }
                }
                for (let j = i + 1; j < arr.length; j++) {
                    //单双
                    if (
                        arr[i].ballsInfo.singles[k].number ===
                        arr[j].ballsInfo.singles[k].number
                    ) {
                        arr[i].ballsInfo.singles[k].double = true
                        arr[j].ballsInfo.singles[k].double = true
                    } else {
                        break
                    }
                }
            }
        }
    },

    /**
     *
     * 统计长龙
     *
     * 10---表示10个球
     */
    getLongData: function(arr) {
        let info = []
        for (let i = 0; i < 8; i++) {
            for (let j = 1; j < arr.length; j++) {
                //大小
                if (
                    arr[j].ballsInfo.sizes[i].content !==
                        arr[0].ballsInfo.sizes[i].content &&
                    j === 1
                ) {
                    break
                } else if (
                    arr[j].ballsInfo.sizes[i].content !==
                        arr[0].ballsInfo.sizes[i].content &&
                    j > 1
                ) {
                    info.push({
                        title: context.$tex('第{num}球', { num: i + 1 }),
                        content: arr[0].ballsInfo.sizes[i].content + j + context.$tex('期'),
                        count: j
                    })
                    break
                }
            }
            for (let j = 1; j < arr.length; j++) {
                //单双
                if (
                    arr[j].ballsInfo.singles[i].content !==
                        arr[0].ballsInfo.singles[i].content &&
                    j === 1
                ) {
                    break
                } else if (
                    arr[j].ballsInfo.singles[i].content !==
                        arr[0].ballsInfo.singles[i].content &&
                    j > 1
                ) {
                    info.push({
                        title: context.$tex('第{num}球', { num: i + 1 }),
                        content: arr[0].ballsInfo.singles[i].content + j + context.$tex('期'),
                        count: j
                    })
                    break
                }
            }
            for (let j = 1; j < arr.length; j++) {
                //合数单双
                if (
                    arr[j].ballsInfo.lotteryNumbers[i].ballStatus !==
                        arr[0].ballsInfo.lotteryNumbers[i].ballStatus &&
                    j === 1
                ) {
                    break
                } else if (
                    arr[j].ballsInfo.lotteryNumbers[i].ballStatus !==
                        arr[0].ballsInfo.lotteryNumbers[i].ballStatus &&
                    j > 1
                ) {
                    info.push({
                        title: context.$tex('第{num}球', { num: i + 1 }),
                        content:
                            arr[0].ballsInfo.lotteryNumbers[i].ballStatus +
                            j +
                            context.$tex('期'),
                        count: j
                    })
                    break
                }
            }
            for (let j = 1; j < arr.length; j++) {
                //尾大尾小
                if (
                    arr[j].ballsInfo.lotteryNumbers[i].numberLastNum !==
                        arr[0].ballsInfo.lotteryNumbers[i].numberLastNum &&
                    j === 1
                ) {
                    break
                } else if (
                    arr[j].ballsInfo.lotteryNumbers[i].numberLastNum !==
                        arr[0].ballsInfo.lotteryNumbers[i].numberLastNum &&
                    j > 1
                ) {
                    info.push({
                        title: context.$tex('第{num}球', { num: i + 1 }),
                        content:
                            arr[0].ballsInfo.lotteryNumbers[i].numberLastNum +
                            j +
                            context.$tex('期'),
                        count: j
                    })
                    break
                }
            }
        }
        //第一球到第四球--龙虎和
        for (let i = 0; i < 4; i++) {
            // let dragons = ['dragonOne', 'dragonTwo', 'dragonThree', 'dragonFour'];
            if (!arr.length) return
            let status = arr[0].dragonTiger[i]
            for (let j = 1; j < arr.length; j++) {
                if (arr[j].dragonTiger[i] !== status && j === 1) {
                    break
                } else if (arr[j].dragonTiger[i] !== status && j > 1) {
                    info.push({
                        title: context.$tex('第{num}球', { num: i + 1 }),
                        content: status + j + context.$tex('期'),
                        count: j
                    })
                    break
                }
            }
        }
        //总和
        let firstSingle = arr[0].sumInfo.single
        let size = arr[0].sumInfo.small
        for (let j = 1; j < arr.length; j++) {
            //单双
            if (arr[j].sumInfo.single !== firstSingle && j === 1) {
                break
            } else if (arr[j].sumInfo.single !== firstSingle && j > 1) {
                info.push({
                    title: context.$tex('总和'),
                    content: firstSingle + j + context.$tex('期'),
                    count: j
                })
                break
            }
        }
        for (let j = 1; j < arr.length; j++) {
            //大小
            if (arr[j].sumInfo.small !== size && j === 1) {
                break
            } else if (arr[j].sumInfo.small !== size && j > 1) {
                info.push({
                    title: context.$tex('总和'),
                    content: size + j + context.$tex('期'),
                    count: j
                })
                break
            }
        }
        for (let j = 1; j < arr.length; j++) {
            //总和尾大尾小
            //尾大尾小
            if (
                arr[j].sumInfo.sumLastNum !== arr[0].sumInfo.sumLastNum &&
                j === 1
            ) {
                break
            } else if (
                arr[j].sumInfo.sumLastNum !== arr[0].sumInfo.sumLastNum &&
                j > 1
            ) {
                info.push({
                    title: context.$tex('总和'),
                    content: arr[0].sumInfo.sumLastNum + j + context.$tex('期'),
                    count: j
                })
                break
            }
        }
        //排序
        info.sort((a, b) => {
            return b.count - a.count
        })
        return info
    },
    getBallCount: function(balls) {
        let dragonTiger = []
        let [
            //统计总和第一到第四龙虎
            sumSingle,
            sumDouble,
            sumLarge,
            sumSmall,
            oneDragon,
            oneTiger,
            twoDragon,
            twoTiger,
            threeDragon,
            threeTiger,
            fourDragon,
            fourTiger
        ] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        let ballsCount = []
        let [
            //统计单双大小次数
            oneSingle,
            oneDouble,
            oneLarge,
            oneSmall,
            twoSingle,
            twoDouble,
            twoLarge,
            twoSmall,
            threeSingle,
            threeDouble,
            threeLarge,
            threeSmall,
            fourSingle,
            fourDouble,
            fourLarge,
            fourSmall,
            fiveSingle,
            fiveDouble,
            fiveLarge,
            fiveSmall,
            sixSingle,
            sixDouble,
            sixLarge,
            sixSmall,
            sevenSingle,
            sevenDouble,
            sevenLarge,
            sevenSmall,
            eightSingle,
            eightDouble,
            eightLarge,
            eightSmall
        ] = [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        ]
        balls.forEach((ball, index) => {
            switch (index % 10) {
                case 0: //第一名
                    if (ball % 2 === 0) {
                        oneDouble++
                    } else if (ball % 2 !== 0 && ball * 1 !== 21) {
                        oneSingle++
                    }
                    if (ball * 1 > 10) {
                        oneLarge++
                    } else if (ball * 1 < 11) {
                        oneSmall++
                    }
                    if (ball * 1 !== 21 && balls[index + 7] * 1 !== 21) {
                        ball > balls[index + 7] ? oneDragon++ : oneTiger++
                    }
                    let sum = 0
                    for (let i = index; i < index + 8; i++) {
                        sum += balls[index] * 1
                    }
                    if (sum > 55) {
                        sumLarge++
                    } else if (sum < 55) {
                        sumSmall++
                    }
                    if (sum % 2 === 0) {
                        sumDouble++
                    } else if (sum % 2 !== 0) {
                        //sum % 2 !== 0 && sum < 55
                        sumSingle++
                    }
                    break
                case 1:
                    if (ball % 2 === 0) {
                        twoDouble++
                    } else if (ball % 2 !== 0 && ball * 1 !== 21) {
                        twoSingle++
                    }
                    if (ball > 10) {
                        twoLarge++
                    } else if (ball < 11) {
                        twoSmall++
                    }
                    if (ball * 1 !== 21 && balls[index + 5] * 1 !== 21) {
                        ball > balls[index + 5] ? twoDragon++ : twoTiger++
                    }
                    break
                case 2:
                    if (ball % 2 === 0) {
                        threeDouble++
                    } else if (ball % 2 !== 0 && ball * 1 !== 21) {
                        threeSingle++
                    }
                    if (ball > 10) {
                        threeLarge++
                    } else if (ball < 11) {
                        threeSmall++
                    }
                    if (ball * 1 !== 21 && balls[index + 3] * 1 !== 21) {
                        ball > balls[index + 3] ? threeDragon++ : threeTiger++
                    }
                    break
                case 3:
                    if (ball % 2 === 0) {
                        fourDouble++
                    } else if (ball % 2 !== 0 && ball * 1 !== 21) {
                        fourSingle++
                    }
                    if (ball > 10) {
                        fourLarge++
                    } else if (ball < 11) {
                        fourSmall++
                    }
                    if (ball * 1 !== 21 && balls[index + 1] * 1 !== 21) {
                        ball > balls[index + 1] ? fourDragon++ : fourTiger++
                    }
                    break
                case 4:
                    if (ball % 2 === 0) {
                        fiveDouble++
                    } else if (ball % 2 !== 0 && ball * 1 !== 21) {
                        fiveSingle++
                    }
                    if (ball > 10) {
                        fiveLarge++
                    } else if (ball < 11) {
                        fiveSmall++
                    }
                    break
                case 5:
                    if (ball % 2 === 0) {
                        sixDouble++
                    } else if (ball % 2 !== 0 && ball * 1 !== 21) {
                        sixSingle++
                    }
                    if (ball > 10) {
                        sixLarge++
                    } else if (ball < 11) {
                        sixSmall++
                    }
                    break
                case 6:
                    if (ball % 2 === 0) {
                        sevenDouble++
                    } else if (ball % 2 !== 0 && ball * 1 !== 21) {
                        sevenSingle++
                    }
                    if (ball > 10) {
                        sevenLarge++
                    } else if (ball < 11) {
                        sevenSmall++
                    }
                    break
                case 7:
                    if (ball % 2 === 0) {
                        eightDouble++
                    } else if (ball % 2 !== 0 && ball * 1 !== 21) {
                        eightSingle++
                    }
                    if (ball > 10) {
                        eightLarge++
                    } else if (ball < 11) {
                        eightSmall++
                    }
                    break
            }
        })
        ballsCount.push(
            oneSingle,
            oneDouble,
            oneLarge,
            oneSmall,
            twoSingle,
            twoDouble,
            twoLarge,
            twoSmall,
            threeSingle,
            threeDouble,
            threeLarge,
            threeSmall,
            fourSingle,
            fourDouble,
            fourLarge,
            fourSmall,
            fiveSingle,
            fiveDouble,
            fiveLarge,
            fiveSmall,
            sixSingle,
            sixDouble,
            sixLarge,
            sixSmall,
            sevenSingle,
            sevenDouble,
            sevenLarge,
            sevenSmall,
            eightSingle,
            eightDouble,
            eightLarge,
            eightSmall
        )
        dragonTiger.push(
            sumSingle,
            sumDouble,
            sumLarge,
            sumSmall,
            oneDragon,
            oneTiger,
            twoDragon,
            twoTiger,
            threeDragon,
            threeTiger,
            fourDragon,
            fourTiger
        )
        return [ballsCount, dragonTiger]
    },

    /**
     * 处理开奖记录表中数据
     */
    handlerRecordList: function(arr) {
        let ballContainer = []
        arr.forEach(item => {
            let balls = item.lotteryNumber.split(',')
            ballContainer = ballContainer.concat(balls) //号码出现次数
            let sum = 0
            let [lotteryNumbers, sizes, singles] = [[], [], []]
            let ballsInfo = {}
            balls.forEach(ball => {
                sum += ball * 1
                let lotteryNumber = {
                    content: ball * 1,
                    ball: ball,
                    single:
                        ball * 1 === 11 ? true : ball % 2 === 0 ? false : true, //单双
                    small:
                        ball * 1 === 11 ? null : ball * 1 > 10 ? false : true, //大小
                    double: false, //对子
                    ballStatus:
                        (ball[0] * 1 + ball[1] * 1) % 2 === 0
                            ? context.$tex('合数双')
                            : context.$tex('合数单'), //合数单双
                    numberLastNum: (ball * 1) % 10 > 4 ? context.$tex('尾大') : context.$tex('尾小')
                }
                let size = {
                    number: ball * 1,
                    content:
                        lotteryNumber.small == null
                            ? context.$tex('和')
                            : lotteryNumber.small ? context.$tex('小') : context.$tex('大'),
                    single: lotteryNumber.single, //单双
                    small: lotteryNumber.small, //大小
                    clr:
                        lotteryNumber.small === null
                            ? '#00ab07'
                            : lotteryNumber.small ? '#7f8ab0' : '#f9982e',
                    double: false //对子
                }
                let single = {
                    number: ball * 1,
                    content:
                        lotteryNumber.content === 11
                            ? context.$tex('和')
                            : lotteryNumber.single ? context.$tex('单') : context.$tex('双'),
                    single: lotteryNumber.single, //单双
                    small: lotteryNumber.small, //大小
                    clr:
                        lotteryNumber.small === null
                            ? '#00ab07'
                            : lotteryNumber.single ? '#7f8ab0' : '#f9982e',
                    double: false //对子
                }
                lotteryNumbers.push(lotteryNumber)
                sizes.push(size)
                singles.push(single)
            })
            ballsInfo.lotteryNumbers = lotteryNumbers
            ballsInfo.sizes = sizes
            ballsInfo.singles = singles
            //55改为84
            let sumInfo = {
                sum: sum,
                small: sum > 84 ? context.$tex('大') : sum === 84 ? context.$tex('和') : context.$tex('小'),
                single: sum % 2 === 0 ? context.$tex('双') : context.$tex('单'),
                sumLastNum: sum % 10 > 4 ? context.$tex('尾大') : context.$tex('尾小')
            }
            let [dragonOne, dragonTwo, dragonThree, dragonFour] = [
                context.$tex('龙'),
                context.$tex('龙'),
                context.$tex('龙'),
                context.$tex('龙')
            ]
            if (balls[0] * 1 === 21 || balls[balls.length - 1] * 1 === 21) {
                dragonOne = context.$tex('和')
            } else if (balls[0] - balls[balls.length - 1] < 0) {
                dragonOne = context.$tex('虎')
            }
            if (balls[1] * 1 === 21 || balls[balls.length - 2] * 1 === 21) {
                dragonTwo = context.$tex('和')
            } else if (balls[1] - balls[balls.length - 2] < 0) {
                dragonTwo = context.$tex('虎')
            }
            if (balls[2] * 1 === 21 || balls[balls.length - 3] * 1 === 21) {
                dragonThree = context.$tex('和')
            } else if (balls[2] - balls[balls.length - 3] < 0) {
                dragonThree = context.$tex('虎')
            }
            if (balls[3] * 1 === 21 || balls[balls.length - 4] * 1 === 21) {
                dragonFour = context.$tex('和')
            } else if (balls[3] - balls[balls.length - 4] < 0) {
                dragonFour = context.$tex('虎')
            }
            let dragonTiger = []
            dragonTiger.push(dragonOne, dragonTwo, dragonThree, dragonFour)
            item.sumInfo = sumInfo
            item.ballsInfo = ballsInfo
            item.dragonTiger = dragonTiger
        })
        let result = CONFIG_KLSF.getBallCount(ballContainer) //名次单双大小冠亚龙虎出现次数
        arr.totalNumCount = result[0]
        arr.mixinInfo = result[1] //冠亚龙虎
        arr.longData = CONFIG_KLSF.getLongData(arr) //长龙统计
        CONFIG_KLSF.getTwo(arr)
        return arr
    },
    analyRoadBeads: function(arr) {
        let roadBeadsList = []
        //第i球单双
        for (let i = 0; i < 8; i++) {
            let ballsInfo = {}
            let infoArray = [] //单双
            let oneCount = 0 //第i球单的个数
            let twoCount = 0 //第i球双的个数
            one: for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let singleInfo = {
                    clr: '#999',
                    content: context.$tex('单'),
                    flag: true, //真表示单
                    count: 1, //出现次数
                    choiceCount: -1,
                    choiceFlag: null
                }
                let doubleInfo = {
                    clr: '#be1204',
                    content: context.$tex('双'),
                    flag: false, //假表示双
                    count: 1, //出现次数
                    choiceCount: -1,
                    choiceFlag: null
                }
                for (let k = j + 1; k < arr.length; k++) {
                    let nextBalls = arr[k].lotteryNumber
                        .split(',')
                        .map(item => {
                            return item * 1
                        })
                    if (balls[i] % 2 === 0 && nextBalls[i] % 2 === 0) {
                        doubleInfo.content += context.$tex('双')
                        doubleInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(doubleInfo)
                            break one
                        }
                    } else if (
                        balls[i] % 2 !== 0 &&
                        nextBalls[i] % 2 !== 0 &&
                        balls[i] !== 21 &&
                        nextBalls[i] !== 21
                    ) {
                        singleInfo.content += context.$tex('单')
                        singleInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(singleInfo)
                            break one
                        }
                    } else {
                        if (balls[i] % 2 === 0) {
                            infoArray.push(doubleInfo)
                        } else if (balls[i] % 2 !== 0 && balls[i] !== 21) {
                            infoArray.push(singleInfo)
                        }
                        j = k - 1
                        break
                    }
                }
                if (j === arr.length - 1) {
                    //最后一个加上
                    if (balls[i] % 2 === 0) {
                        infoArray.push(doubleInfo)
                    } else if (balls[i] % 2 !== 0 && balls[i] !== 21) {
                        infoArray.push(singleInfo)
                    }
                }
            }
            //单双出现次数
            for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                if (balls[i] % 2 !== 0 && balls[i] !== 21) {
                    oneCount++
                } else if (balls[i] % 2 === 0) {
                    twoCount++
                }
            }
            ballsInfo.index = context.$tex('第{num}球', { num: i + 1 })
            ballsInfo.ballIndex = i //第几球
            ballsInfo.isSingleDouble = true
            ballsInfo.roadBeadsIndex = 1 //大小、单双、龙虎顺序
            ballsInfo.choice = [
                //下拉框
                {
                    title: context.$tex('单'),
                    flag: 'true'
                },
                {
                    title: context.$tex('双'),
                    flag: 'false'
                }
            ]
            ballsInfo.name = context.$tex('单双')
            ballsInfo.oneName = context.$tex('单')
            ballsInfo.twoName = context.$tex('双')
            ballsInfo.oneCount = oneCount
            ballsInfo.twoCount = twoCount
            ballsInfo.rank = i * 5
            ballsInfo.infoArray = infoArray
            roadBeadsList.push(ballsInfo)
        }

        //第i球大小
        for (let i = 0; i < 8; i++) {
            let ballsInfo = {}
            let infoArray = [] //大小
            let oneCount = 0 //第i球小的个数
            let twoCount = 0 //第i球大的个数
            one: for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let smallInfo = {
                    clr: '#999',
                    content: context.$tex('小'),
                    flag: true,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                let largeInfo = {
                    clr: '#be1204',
                    content: context.$tex('大'),
                    flag: false,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                for (let k = j + 1; k < arr.length; k++) {
                    let nextBalls = arr[k].lotteryNumber
                        .split(',')
                        .map(item => {
                            return item * 1
                        })
                    if (
                        balls[i] > 10 &&
                        nextBalls[i] > 10 &&
                        balls[i] !== 21 &&
                        nextBalls[i] !== 21
                    ) {
                        largeInfo.content += context.$tex('大')
                        largeInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(largeInfo)
                            break one
                        }
                    } else if (balls[i] <= 10 && nextBalls[i] <= 10) {
                        smallInfo.content += context.$tex('小')
                        smallInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(smallInfo)
                            break one
                        }
                    } else {
                        if (balls[i] > 10 && balls[i] !== 21) {
                            infoArray.push(largeInfo)
                        } else if (balls[i] <= 10) {
                            infoArray.push(smallInfo)
                        }
                        j = k - 1
                        break
                    }
                }
                if (j === arr.length - 1) {
                    //最后一个加上
                    if (balls[i] > 10 && balls[i] != 21) {
                        infoArray.push(largeInfo)
                    } else if (balls[i] <= 10) {
                        infoArray.push(smallInfo)
                    }
                }
            }
            for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                if (balls[i] <= 10) {
                    oneCount++
                } else if (balls[i] > 10 && balls[i] !== 21) {
                    twoCount++
                }
            }
            ballsInfo.index = context.$tex('第{num}球', { num: i + 1 })
            ballsInfo.isSmallLarge = true
            ballsInfo.ballIndex = i //第几球
            ballsInfo.roadBeadsIndex = 0
            ballsInfo.name = context.$tex('大小')
            ballsInfo.choice = [
                //下拉框
                {
                    title: context.$tex('大'),
                    flag: 'false'
                },
                {
                    title: context.$tex('小'),
                    flag: 'true'
                }
            ]
            ballsInfo.oneCount = oneCount
            ballsInfo.twoCount = twoCount
            ballsInfo.oneName = context.$tex('小')
            ballsInfo.twoName = context.$tex('大')
            ballsInfo.rank = 5 * i + 1
            ballsInfo.infoArray = infoArray
            roadBeadsList.push(ballsInfo)
        }
        //第i球龙虎
        for (let i = 0; i < 4; i++) {
            let ballsInfo = {}
            let infoArray = [] //龙虎
            let oneCount = 0 //第一球龙的个数
            let twoCount = 0 //第一球虎的个数
            one: for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let dragonInfo = {
                    clr: '#f12a31',
                    content: context.$tex('龙'),
                    flag: true,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                let tigerInfo = {
                    clr: '#233fd4',
                    content: context.$tex('虎'),
                    flag: false,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                for (let k = j + 1; k < arr.length; k++) {
                    //龙虎
                    let lastIndex = balls.length - 1
                    let nextBalls = arr[k].lotteryNumber
                        .split(',')
                        .map(item => {
                            return item * 1
                        })
                    if (
                        balls[i] > balls[lastIndex - i] &&
                        nextBalls[i] > nextBalls[lastIndex - i]
                    ) {
                        dragonInfo.content += context.$tex('龙')
                        dragonInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(dragonInfo)
                            break one
                        }
                    } else if (
                        balls[i] < balls[lastIndex - i] &&
                        nextBalls[i] < nextBalls[lastIndex - i]
                    ) {
                        tigerInfo.content += context.$tex('虎')
                        tigerInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(tigerInfo)
                            break one
                        }
                    } else {
                        if (balls[i] > balls[lastIndex - i]) {
                            infoArray.push(dragonInfo)
                        } else if (balls[i] < balls[lastIndex - i]) {
                            infoArray.push(tigerInfo)
                        }
                        j = k - 1
                        break
                    }
                }
                if (j === arr.length - 1) {
                    if (balls[i] > balls[balls.length - 1 - i]) {
                        infoArray.push(dragonInfo)
                    } else if (balls[i] < balls[balls.length - 1 - i]) {
                        infoArray.push(tigerInfo)
                    }
                }
            }
            for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                if (balls[i] > balls[balls.length - 1 - i]) {
                    oneCount++
                } else if (balls[i] < balls[balls.length - 1 - i]) {
                    twoCount++
                }
            }
            ballsInfo.index = context.$tex('第{num}球', { num: i + 1 })
            ballsInfo.ballIndex = i
            ballsInfo.name = context.$tex('龙虎')
            ballsInfo.isDragonTiger = true
            ballsInfo.roadBeadsIndex = 2 //对应大小、单双、龙虎的顺序
            ballsInfo.choice = [
                //下拉框
                {
                    title: context.$tex('龙'),
                    flag: 'true'
                },
                {
                    title: context.$tex('虎'),
                    flag: 'false'
                }
            ]
            ballsInfo.oneCount = oneCount
            ballsInfo.twoCount = twoCount
            ballsInfo.oneName = context.$tex('龙')
            ballsInfo.twoName = context.$tex('虎')
            ballsInfo.rank = 5 * i + 2
            ballsInfo.infoArray = infoArray
            roadBeadsList.push(ballsInfo)
        }

        //第i球尾大尾小
        for (let i = 0; i < 8; i++) {
            let ballsInfo = {}
            let infoArray = []
            let oneCount = 0 //第一球尾大的个数
            let twoCount = 0 //第一球尾小的个数
            one: for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let dragonInfo = {
                    clr: '#f12a31',
                    content: context.$tex('大'),
                    flag: true,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                let tigerInfo = {
                    clr: '#233fd4',
                    content: context.$tex('小'),
                    flag: false,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                for (let k = j + 1; k < arr.length; k++) {
                    //尾大尾小
                    let lastIndex = balls.length - 1
                    let nextBalls = arr[k].lotteryNumber
                        .split(',')
                        .map(item => {
                            return item * 1
                        })
                    if (balls[i] % 10 >= 5 && nextBalls[i] % 10 >= 5) {
                        dragonInfo.content += context.$tex('大')
                        dragonInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(dragonInfo)
                            break one
                        }
                    } else if (balls[i] % 10 < 5 && nextBalls[i] % 10 < 5) {
                        tigerInfo.content += context.$tex('小')
                        tigerInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(tigerInfo)
                            break one
                        }
                    } else {
                        if (balls[i] % 10 >= 5) {
                            infoArray.push(dragonInfo)
                        } else {
                            infoArray.push(tigerInfo)
                        }
                        j = k - 1
                        break
                    }
                }
                if (j === arr.length - 1) {
                    if (balls[i] % 10 >= 5) {
                        infoArray.push(dragonInfo)
                    } else {
                        infoArray.push(tigerInfo)
                    }
                }
            }
            for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                if (balls[i] % 10 >= 5) {
                    oneCount++
                } else {
                    twoCount++
                }
            }
            ballsInfo.index = context.$tex('第{num}球', { num: i + 1 })
            ballsInfo.ballIndex = i //第几球
            ballsInfo.name = context.$tex('尾大尾小')
            ballsInfo.oneName = context.$tex('单')
            ballsInfo.twoName = context.$tex('双')
            ballsInfo.isTail = true
            ballsInfo.roadBeadsIndex = 3 //对应大小、单双、龙虎、尾大尾小的顺序
            ballsInfo.choice = [
                //下拉框
                {
                    title: context.$tex('大'),
                    flag: 'true'
                },
                {
                    title: context.$tex('小'),
                    flag: 'false'
                }
            ]
            ballsInfo.oneCount = oneCount
            ballsInfo.twoCount = twoCount
            ballsInfo.oneName = context.$tex('尾大')
            ballsInfo.twoName = context.$tex('尾小')
            ballsInfo.rank = 5 * i + 3
            ballsInfo.infoArray = infoArray
            roadBeadsList.push(ballsInfo)
        }

        //第i球合单合双
        for (let i = 0; i < 8; i++) {
            let ballsInfo = {}
            let infoArray = []
            let oneCount = 0 //第i球合单个数
            let twoCount = 0 //第i球合双个数
            one: for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',')
                let dragonInfo = {
                    clr: '#f12a31',
                    content: context.$tex('单'),
                    flag: true,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                let tigerInfo = {
                    clr: '#233fd4',
                    content: context.$tex('双'),
                    flag: false,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                for (let k = j + 1; k < arr.length; k++) {
                    //合单合双
                    // let lastIndex = balls.length - 1;
                    let nextBalls = arr[k].lotteryNumber.split(',')
                    if (
                        (balls[i][0] * 1 + balls[i][1] * 1) % 2 !== 0 &&
                        (nextBalls[i][0] * 1 + nextBalls[i][1] * 1) % 2 !== 0
                    ) {
                        dragonInfo.content += context.$tex('单')
                        dragonInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(dragonInfo)
                            break one
                        }
                    } else if (
                        (balls[i][0] * 1 + balls[i][1] * 1) % 2 === 0 &&
                        (nextBalls[i][0] * 1 + nextBalls[i][1] * 1) % 2 === 0
                    ) {
                        tigerInfo.content += context.$tex('双')
                        tigerInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(tigerInfo)
                            break one
                        }
                    } else {
                        if ((balls[i][0] * 1 + balls[i][1] * 1) % 2 !== 0) {
                            infoArray.push(dragonInfo)
                        } else {
                            infoArray.push(tigerInfo)
                        }
                        j = k - 1
                        break
                    }
                }
                if (j === arr.length - 1) {
                    if ((balls[i][0] * 1 + balls[i][1] * 1) % 2 !== 0) {
                        infoArray.push(dragonInfo)
                    } else {
                        infoArray.push(tigerInfo)
                    }
                }
            }
            for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',')
                if ((balls[i][0] * 1 + balls[i][1] * 1) % 2 !== 0) {
                    oneCount++
                } else {
                    twoCount++
                }
            }
            ballsInfo.index = context.$tex('第{num}球', { num: i + 1 })
            ballsInfo.ballIndex = i //第几球
            ballsInfo.name = context.$tex('合单合双')
            ballsInfo.oneName = context.$tex('单')
            ballsInfo.twoName = context.$tex('双')
            ballsInfo.isSingleAndDouble = true
            ballsInfo.roadBeadsIndex = 4 //对应大小、单双、龙虎、尾大尾小、合单合双的顺序
            ballsInfo.choice = [
                //下拉框
                {
                    title: context.$tex('单'),
                    flag: 'true'
                },
                {
                    title: context.$tex('双'),
                    flag: 'false'
                }
            ]
            ballsInfo.oneCount = oneCount
            ballsInfo.twoCount = twoCount
            ballsInfo.oneName = context.$tex('单')
            ballsInfo.twoName = context.$tex('双')
            ballsInfo.rank = 5 * i + 4
            ballsInfo.infoArray = infoArray
            roadBeadsList.push(ballsInfo)
        }

        //总和单双
        for (let i = 0; i < 1; i++) {
            let ballsInfo = {}
            let infoArray = [] //和的单双
            let oneCount = 0 //和单的个数
            let twoCount = 0 //和双的个数
            one: for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let sumOne = balls.reduce((preVal, currVal) => {
                    return preVal + currVal
                }, 0)
                let sumSingleInfo = {
                    clr: '#233fd4',
                    content: context.$tex('单'),
                    flag: true,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                let sumDoubleInfo = {
                    clr: '#f12a31',
                    content: context.$tex('双'),
                    flag: false,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                for (let k = j + 1; k < arr.length; k++) {
                    let nextBalls = arr[k].lotteryNumber
                        .split(',')
                        .map(item => {
                            return item * 1
                        })
                    let sumTwo = nextBalls.reduce((preVal, currVal) => {
                        return preVal + currVal
                    }, 0)
                    if (sumOne % 2 === 0 && sumTwo % 2 === 0) {
                        sumDoubleInfo.content += context.$tex('双')
                        sumDoubleInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(sumDoubleInfo)
                            break one
                        }
                    } else if (sumOne % 2 !== 0 && sumTwo % 2 !== 0) {
                        sumSingleInfo.content += context.$tex('单')
                        sumSingleInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(sumSingleInfo)
                            break one
                        }
                    } else {
                        if (sumOne % 2 === 0) {
                            infoArray.push(sumDoubleInfo)
                        } else {
                            infoArray.push(sumSingleInfo)
                        }
                        j = k - 1
                        break
                    }
                }
                if (j === arr.length - 1) {
                    if (sumOne % 2 === 0) {
                        infoArray.push(sumDoubleInfo)
                    } else {
                        infoArray.push(sumSingleInfo)
                    }
                }
            }
            for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let sumOne = balls.reduce((preVal, currVal) => {
                    return preVal + currVal
                }, 0)
                if (sumOne % 2 === 0) {
                    twoCount++
                } else {
                    oneCount++
                }
            }
            ballsInfo.index = context.$tex('总和')
            ballsInfo.isSumSingleDouble = true
            ballsInfo.name = context.$tex('单双')
            ballsInfo.choice = [
                //下拉框
                {
                    title: context.$tex('单'),
                    flag: 'true'
                },
                {
                    title: context.$tex('双'),
                    flag: 'false'
                }
            ]
            ballsInfo.ballIndex = 8 //路珠筛选第几球
            ballsInfo.roadBeadsIndex = 1 //大小、单双、龙虎顺序
            ballsInfo.oneCount = oneCount
            ballsInfo.twoCount = twoCount
            ballsInfo.oneName = context.$tex('单')
            ballsInfo.twoName = context.$tex('双')
            ballsInfo.rank = 40
            ballsInfo.infoArray = infoArray
            roadBeadsList.push(ballsInfo)
        }
        //总和大小
        for (let i = 0; i < 1; i++) {
            let ballsInfo = {}
            let infoArray = []
            let oneCount = 0 //和大的个数
            let twoCount = 0 //和小的个数
            let threeCount = 0 //和和的个数
            one: for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let sumOne = balls.reduce((preVal, currVal) => {
                    return preVal + currVal
                }, 0)
                let sumLargeInfo = {
                    clr: '#f12a31',
                    content: context.$tex('大'),
                    flag: false,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                let sumSmallInfo = {
                    clr: '#233fd4',
                    content: context.$tex('小'),
                    flag: true,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                let sumEqualInfo = {
                    clr: '#00ab07',
                    content: context.$tex('和'),
                    flag: null,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                for (let k = j + 1; k < arr.length; k++) {
                    let nextBalls = arr[k].lotteryNumber
                        .split(',')
                        .map(item => {
                            return item * 1
                        })
                    let sumTwo = nextBalls.reduce((newVal, currVal) => {
                        return newVal + currVal
                    }, 0)
                    if (sumOne > 84 && sumTwo >84) { //55改为84
                        sumLargeInfo.content += context.$tex('大')
                        sumLargeInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(sumLargeInfo)
                            break one
                        }
                    } else if(sumOne === 84 && sumTwo ===84){ //2019.5.17
                        sumEqualInfo.content+=context.$tex('和');
                        sumEqualInfo.content++;
                        if(k === arr.length-1){
                            infoArray.push(sumEqualInfo);
                            break one
                        }
                    }
                    else if (sumOne <84 && sumTwo <84) {
                        sumSmallInfo.content += context.$tex('小')
                        sumSmallInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(sumSmallInfo)
                            break one
                        }
                    } else {
                        if (sumOne > 84) {
                            infoArray.push(sumLargeInfo)
                        } else if(sumOne===84){
                            infoArray.push(sumEqualInfo);
                        } else  {
                            infoArray.push(sumSmallInfo)
                        }
                        j = k - 1
                        break
                    }
                }
                if (j === arr.length - 1) {
                    //最后一个加上
                    if (sumOne > 84) {
                        infoArray.push(sumLargeInfo)
                    } else if (sumOne === 84) {
                        infoArray.push(sumEqualInfo)
                    } else {
                        infoArray.push(sumSmallInfo);
                    }
                }
            }
            for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let sumOne = balls.reduce((preVal, currVal) => {
                    return preVal + currVal
                }, 0)
                if (sumOne > 84) {
                    twoCount++
                } else if (sumOne <84) {
                    oneCount++
                } else {
                    threeCount++;
                }
            }
            ballsInfo.index = context.$tex('总和')
            ballsInfo.name = context.$tex('大小和')
            ballsInfo.isSumSmallLarge = true
            ballsInfo.ballIndex = 8
            ballsInfo.choice = [
                //下拉框
                {
                    title: context.$tex('大'),
                    flag: 'false'
                },
                {
                    title: context.$tex('小'),
                    flag: 'true'
                },
                {
                    title:context.$tex('和'),
                    flag:'null'
                }
            ]
            ballsInfo.roadBeadsIndex = 0 //大小、单双、龙虎顺序
            ballsInfo.oneCount = oneCount
            ballsInfo.twoCount = twoCount
            ballsInfo.threeCount = threeCount;
            ballsInfo.oneName = context.$tex('小')
            ballsInfo.twoName = context.$tex('大')
            ballsInfo.threeName = context.$tex('和')
            ballsInfo.rank = 41
            ballsInfo.infoArray = infoArray
            roadBeadsList.push(ballsInfo)
        }
        //总和尾大尾小
        for (let i = 0; i < 1; i++) {
            let ballsInfo = {}
            let infoArray = []
            let oneCount = 0 //和大的个数
            let twoCount = 0 //和小的个数
            one: for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let sumOne = balls.reduce((preVal, currVal) => {
                    return preVal + currVal
                }, 0)
                let sumLargeInfo = {
                    clr: '#f12a31',
                    content: context.$tex('大'),
                    flag: false,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                let sumSmallInfo = {
                    clr: '#233fd4',
                    content: context.$tex('小'),
                    flag: true,
                    count: 1,
                    choiceCount: -1,
                    choiceFlag: null
                }
                for (let k = j + 1; k < arr.length; k++) {
                    let nextBalls = arr[k].lotteryNumber
                        .split(',')
                        .map(item => {
                            return item * 1
                        })
                    let sumTwo = nextBalls.reduce((newVal, currVal) => {
                        return newVal + currVal
                    }, 0)
                    if (sumOne % 10 > 4 && sumTwo % 10 > 4) {
                        sumLargeInfo.content += context.$tex('大')
                        sumLargeInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(sumLargeInfo)
                            break one
                        }
                    } else if (sumOne % 10 <= 4 && sumTwo % 10 <= 4) {
                        sumSmallInfo.content += context.$tex('小')
                        sumSmallInfo.count++
                        if (k === arr.length - 1) {
                            infoArray.push(sumSmallInfo)
                            break one
                        }
                    } else {
                        if (sumOne % 10 > 4) {
                            infoArray.push(sumLargeInfo)
                        } else {
                            infoArray.push(sumSmallInfo)
                        }
                        j = k - 1
                        break
                    }
                }
                if (j === arr.length - 1) {
                    //最后一个加上
                    if (sumOne % 10 > 4) {
                        infoArray.push(sumLargeInfo)
                    } else {
                        infoArray.push(sumSmallInfo)
                    }
                }
            }
            for (let j = 0; j < arr.length; j++) {
                let balls = arr[j].lotteryNumber.split(',').map(item => {
                    return item * 1
                })
                let sumOne = balls.reduce((preVal, currVal) => {
                    return preVal + currVal
                }, 0)
                if (sumOne % 10 > 4) {
                    oneCount++
                } else {
                    twoCount++
                }
            }
            ballsInfo.index = context.$tex('总和')
            ballsInfo.name = context.$tex('尾大尾小')
            ballsInfo.isSumTail = true
            ballsInfo.ballIndex = 8
            ballsInfo.choice = [
                //下拉框
                {
                    title: context.$tex('大'),
                    flag: 'false'
                },
                {
                    title: context.$tex('小'),
                    flag: 'true'
                }
            ]
            ballsInfo.roadBeadsIndex = 3 //大小、单双、龙虎顺序
            ballsInfo.oneCount = oneCount
            ballsInfo.twoCount = twoCount
            ballsInfo.oneName = context.$tex('小')
            ballsInfo.twoName = context.$tex('大')
            ballsInfo.rank = 42
            ballsInfo.infoArray = infoArray
            roadBeadsList.push(ballsInfo)
        }
        roadBeadsList.sort((item1, item2) => {
            return item1.rank - item2.rank
        })
        return roadBeadsList
    },
    //基本走势
    getBaseTrendData: function(arr) {
        var timesInfo = [] //出现次数数组
        var averMiss = [] //平均遗漏
        var maxMiss = [] //最大遗漏
        var connects = [] //连出
        var currMiss = [] //当前遗漏
        for (let i = 0; i < 28; i++) {
            let miss = [] //遗漏次数
            let tempConnect = []
            let times = 0 //号码出现的次数
            let count = 0 //计数器
            let connect = 0 //连出数
            for (let j = arr.length - 1; j >= 0; j--) {
                if (i === 0) {
                    arr[j].trendResultNumber = []
                }
                let sum = 0
                let originBalls = arr[j].lotteryNumber.split(',')
                let balls = originBalls.map(item => {
                    return item * 1
                })
                arr[j].trendNumbers = originBalls
                sum = balls.reduce((preVal, currVal) => {
                    return preVal + currVal
                }, 0)
                let params = null
                if (i < 20) {
                    params = !arr[j].lotteryNumber.includes(
                        i < 9 ? '0' + (i + 1) : '' + (1 + i)
                    )
                } else if (i === 20) {
                    //和值
                    // originArr[j][i] = sum;
                    arr[j].trendResultNumber.push(sum)
                } else if (i === 21) {
                    //总分大
                    params = sum <= 84
                } else if (i === 22) {
                    //总分小
                    params = sum >= 84
                } else if (i === 23) {
                    //总分和
                    params = sum !== 84
                } else if (i === 24) {
                    //总和单
                    params = sum % 2 === 0
                } else if (i === 25) {
                    //总和双
                    params = sum % 2 !== 0
                } else if (i === 26) {
                    //尾大
                    params = sum % 10 < 5
                } else {
                    //尾小
                    params = sum % 10 >= 5
                }

                if (params) {
                    count++
                    // originArr[j][i] = count;
                    arr[j].trendResultNumber.push(count)
                } else {
                    times++
                    let info = {}
                    if (i !== 20) {
                        // originArr[j][i] = {
                        // 	content: i + 1,
                        // 	clr: "#3f99f2"
                        // }
                        info = {
                            content: i + 1,
                            clr:
                                i + 1 === 19 || i + 1 === 20
                                    ? '#be1204'
                                    : '#3f99f2'
                        }
                        miss.push(count)
                    } else {
                        miss.push('')
                    }
                    count = 0
                    if (i < 20) {
                        //号码
                        info.type = 'ball'
                    } else if (i === 21) {
                        //和大
                        info.content = context.$tex('大')
                        info.clr = '#46bd92'
                    } else if (i === 22) {
                        //和小
                        info.content = context.$tex('小')
                        info.clr = '#46bd92'
                    } else if (i === 23) {
                        //和和
                        info.content = context.$tex('和')
                        info.clr = '#46bd92'
                    } else if (i === 24) {
                        //和单
                        info.content = context.$tex('单')
                        info.clr = '#8585fb'
                    } else if (i === 25) {
                        //和双
                        info.content = context.$tex('双')
                        info.clr = '#8585fb'
                    } else if (i === 26) {
                        //尾大
                        info.content = context.$tex('大')
                        info.clr = '#e26bab'
                    } else if (i === 27) {
                        //尾小
                        info.content = context.$tex('小')
                        info.clr = '#e26bab'
                    }
                    if (i !== 20) {
                        arr[j].trendResultNumber.push(info)
                    }
                    connect++
                    if (j > 0) {
                        for (let k = j - 1; k >= 0; k--) {
                            let flag = null
                            let nextSum = null
                            let nextBalls = arr[k].lotteryNumber
                                .split(',')
                                .map(item => {
                                    return item * 1
                                })
                            if (i < 20) {
                                //号码
                                flag =
                                    arr[j].lotteryNumber.includes(
                                        i < 9 ? '0' + (i + 1) : '' + (1 + i)
                                    ) &&
                                    arr[k].lotteryNumber.includes(
                                        i < 9 ? '0' + (i + 1) : '' + (1 + i)
                                    )
                            } else if (i === 21) {
                                //总分大
                                nextSum = nextBalls.reduce(
                                    (preVal, currVal) => {
                                        return preVal + currVal
                                    },
                                    0
                                )
                                flag = !params && nextSum > 85
                            } else if (i === 22) {
                                //总分小
                                flag = !params && nextSum < 84
                            } else if (i === 23) {
                                //总分和
                                flag = !params && nextSum === 84
                            } else if (i === 24) {
                                //总分单
                                flag = !params && nextSum % 2 !== 0
                            } else if (i === 25) {
                                //总分双
                                flag = !params && nextSum % 2 === 0
                            } else if (i === 26) {
                                //总分尾大
                                flag = !params && nextSum % 10 >= 5
                            } else if (i === 27) {
                                //总分尾小
                                flag = !params && nextSum % 10 < 5
                            }
                            if (flag) {
                                connect++
                            } else {
                                i === 20
                                    ? tempConnect.push('')
                                    : tempConnect.push(connect)
                                connect = 0
                                break
                            }
                        }
                    }
                }
                if (j === 0) {
                    miss.push(count)
                    !tempConnect.length && tempConnect.push(0)
                }
            }
            maxMiss.push(i === 20 ? '' : Math.max(...miss))
            let tempMiss =
                (arr.length - times) / times == 0
                    ? 0
                    : ((arr.length - times) / times).toFixed(1)
            averMiss.push(i === 20 ? '' : times ? tempMiss : 0)
            currMiss.push(i === 20 ? '' : count)
            timesInfo.push(i === 20 ? '' : times)
            connects.push(i === 20 ? '' : Math.max(...tempConnect))
        }
        // arr.forEach((item, index) => {
        // 	item.mixMumber = originArr[index];
        // })
        arr.trendTimesInfo = timesInfo
        arr.trendAverMiss = averMiss
        arr.trendMaxMiss = maxMiss
        arr.trendConnects = connects
        arr.currMiss = currMiss
        return arr
    }
}

const CONFIG_QWC = {
    // 快三
    recordTitle: [
        {
            title: context.$tex('期数')
        },
        {
            title: context.$tex('显示号码')
        }
    ],
    handlerRecordList: function(recordList) {
        recordList.forEach(item => {
            item.trendNumbers = item.lotteryNumber;
        });
        return recordList
    }
};

export default Object.assign(
    {},
    {
        ksan: CONFIG_KSAN,
        pcdd: CONFIG_PCDD,
        '6hc': CONFIG_6HC,
        qtcp: CONFIG_QTCP,
        fc3d: CONFIG_FC3D,
        pk10: CONFIG_PK10,
        ssc: CONFIG_SSC,
        '11x5': CONFIG_11x5,
        klsf: CONFIG_KLSF,
        jwc: CONFIG_JWC,
        qwc: CONFIG_QWC
    }
)
