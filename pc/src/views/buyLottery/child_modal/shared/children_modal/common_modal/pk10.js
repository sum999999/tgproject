var sdtxSpit = /[\,\，]/

function handleSimplex(betBalls, oneBetNum) {
    let fixBetBalls = betBalls.replace(/\s*[，|,]+\s*/g, ' ')
    fixBetBalls = fixBetBalls.split(' ')
    const betNum = Math.floor(fixBetBalls.length / oneBetNum)
    const arr = [];
    for (let i = 0;i < betNum;i++) {
        arr.push(fixBetBalls.slice(i * oneBetNum, i * oneBetNum + oneBetNum).join(' '));
    }
    return arr.join(',');
}

function num5010101(betballs) {
    var results = []
    if (!betballs.length) return results
    var balls = betballs.split(',')
    for (var i = 0; i < balls.length; i++) {
        results.push([balls[i]])
    }
    return results
}
function num5020101(betballs) {
    let results = []
    var groups = []
    var ballGroups = betballs.split('|')
    if (!ballGroups[0] || !ballGroups[1]) return results

    for (var i = 0, len = ballGroups.length; i < len; i++) {
        groups.push(ballGroups[i].split(','))
    }
    groups[0].forEach(item => {
        groups[1].forEach(value => {
            if (item !== value) results.push(item + ',' + value)
        })
    })
    return results
}
function num5020102(betballs) {
    var results = []
    var num = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10']
    betballs = handleSimplex(betballs, 2)
    betballs = betballs.split(sdtxSpit)
    betballs.forEach(item => {
        let sp = item.split(' ')
        let some = true
        for (var i = 0; i < sp.length; i++) {
            if (!num.some(vvv => vvv === sp[i])) {
                some = false
                break
            }
        }
        if(!results.includes(item)){
            if (sp.length === 2 && some && sp[0] !== sp[1]) {
                results.push(item)
            }
        }
    })
    return results
}

function num5030101(betballs) {
    let allResults = []
    var groups = []
    var result = []
    var results = []
    var ballGroups = betballs.split('|')
    // ballGroups有false的值就返回空
    if (ballGroups.some(item => !item)) return results

    for (var i = 0, len = ballGroups.length; i < len; i++) {
        groups.push(ballGroups[i].split(','))
    }

    doExchange(groups, 0)
    function doExchange(arr, depth) {
        for (var i = 0; i < arr[depth].length; i++) {
            result[depth] = arr[depth][i]
            if (depth != arr.length - 1) {
                doExchange(arr, depth + 1)
            } else {
                allResults.push(result.join(','))
            }
        }
    }
    // 去掉三个重复的数据 动态写法
    // allResults.forEach(item => {
    //     let sp = item.split(',');
    //     let add = true;
    //     for (var j = 0; j < sp.legnth; j++) {
    //         if (sp[j] === sp[j+1]) {
    //             add = false;
    //             break;
    //         }
    //     }
    //     if(add) results.push(item);
    // })

    // 去掉三个重复的数据 静态写法
    allResults.forEach(item => {
        let sp = item.split(',')
        if (sp[0] !== sp[1] && sp[0] !== sp[2] && sp[1] !== sp[2])
            results.push(item)
    })
    return results
}
function num5030102(betballs) {
    var results = []
    var num = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10']
    betballs = handleSimplex(betballs, 3)
    betballs = betballs.split(sdtxSpit)
    betballs.forEach(item => {
        let sp = item.split(' ')
        let some = true
        for (var i = 0; i < sp.length; i++) {
            if (!num.some(vvv => vvv === sp[i])) {
                some = false
                break
            }
        }
        if (
            sp.length === 3 &&
            some &&
            sp[0] !== sp[2] &&
            sp[1] !== sp[2] &&
            sp[0] !== sp[1]
        ) {
            if(!results.includes(item)){
                results.push(item)
            }
        }
    })
    return results
}
function num5040101(betballs) {
    var results = []
    var balls = betballs.split('|')
    balls.forEach(item => {
        item.split(',').forEach(value => {
            if (value) results.push(value)
        })
    })
    return results
}
function num5040102(betballs) {
    var results = []
    var balls = betballs.split('|')
    balls.forEach(item => {
        item.split(',').forEach(value => {
            if (value) results.push(value)
        })
    })
    return results
}
// function num5050101 (betballs) {
//     return betballs.split(",").filter(item => item);
// }
// function num5050102 (betballs) {
//     return betballs.split(",").filter(item => item);
// }
// function num5050103 (betballs) {
//     return betballs.split(",").filter(item => item);
// }
// function num5060101 (betballs) {
//     return betballs.split(",").filter(item => item);
// }
// function num5060102 (betballs) {
//     return betballs.split(",").filter(item => item);
// }
// function num5060103 (betballs) {
//     return betballs.split(",").filter(item => item);
// }
function num5070101(betballs) {
    return betballs.split(',').filter(item => item)
}
function num5080101(betballs) {
    results = [] //清空对象
    result = []
    norepeat = []
    //玩法规则
    var groups = []
    var ballGroups = betballs.split('|')
    for (var i = 0, len = ballGroups.length; i < len; i++) {
        groups.push(ballGroups[i].split(','))
    }
    if (groups.length != 2) return 0 //选号组别不够
    doExchange(groups, 0)
    function doExchange(arr, depth) {
        for (var i = 0; i < arr[depth].length; i++) {
            result[depth] = arr[depth][i]
            if (depth != arr.length - 1) {
                doExchange(arr, depth + 1)
            } else {
                results.push(result.join(','))
            }
        }
    }
    // console.log(results.length, results.join(','));
    //记录重复号码
    var repeat = []
    for (var i = 0, len = results.length; i < len; i++) {
        var str = results[i] + ''
        var balls = str.split(',')
        for (var j = 0, length = balls.length; j < length; j++) {
            var regret = str.match(new RegExp(balls[j], 'g'))
            if (regret && regret.length > 1) {
                repeat.push(i)
            }
        }
    }
    //号码不能重复,在此复制新数组
    for (var i = 0, len = results.length; i < len; i++) {
        if (repeat.indexOf(i) < 0) {
            norepeat.push(results[i])
        }
    }
    return norepeat
}
function num5090101(betballs) {
    results = [] //清空对象
    result = []
    norepeat = []
    //玩法规则
    var groups = []
    var ballGroups = betballs.split('|')
    for (var i = 0, len = ballGroups.length; i < len; i++) {
        groups.push(ballGroups[i].split(','))
    }
    if (groups.length != 3) return 0 //选号组别不够
    doExchange(groups, 0)
    function doExchange(arr, depth) {
        for (var i = 0; i < arr[depth].length; i++) {
            result[depth] = arr[depth][i]
            if (depth != arr.length - 1) {
                doExchange(arr, depth + 1)
            } else {
                results.push(result.join(','))
            }
        }
    }
    // console.log(results.length, results.join(','));
    //记录重复号码
    var repeat = []
    for (var i = 0, len = results.length; i < len; i++) {
        var str = results[i] + ''
        var balls = str.split(',')
        for (var j = 0, length = balls.length; j < length; j++) {
            var regret = str.match(new RegExp(balls[j], 'g'))
            if (regret && regret.length > 1) {
                repeat.push(i)
            }
        }
    }
    //号码不能重复,在此复制新数组
    for (var i = 0, len = results.length; i < len; i++) {
        if (repeat.indexOf(i) < 0) {
            norepeat.push(results[i])
        }
    }
    return norepeat
}
// function num5110101(betballs){
// 	return betballs.split(",").filter(item => item);
// }

function num5040103(betballs) {
    ret = [] //init
    var ballgroups = betballs.split('|')
    for (var i = 0, len1 = ballgroups.length; i < len1; i++) {
        var balls = ballgroups[i].split(',')
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if (balls[j] != '') ret.push(balls[j])
        }
    }
    return ret
}

function num5100111(betballs) {
    ret = [] //init
    var ballgroups = betballs.split('|')
    for (var i = 0, len1 = ballgroups.length; i < len1; i++) {
        var balls = ballgroups[i].split(',')
        if (!balls.length) return ret
        for (var k = 0; k < balls.length; k++) {
            if (balls[k]) {
                // ret.push([balls[k]])
                ret.push([betballs])
            }
        }
    }
    return ret
}
function numMoreOdds(betballs) {
    var results = []
    var balls = betballs.split(',')
    if (!balls.length) return results
    for (var i = 0; i < balls.length; i++) {
        if (balls[i]) {
            results.push([balls[i]])
        }
    }
    return results
}
// function num5120101(betballs){
// 	return betballs.split(",").filter(item => item);
// }

module.exports = {
    '5010101': num5010101,
    '5020101': num5020101,
    '5020102': num5020102,
    '5030101': num5030101,
    '5030102': num5030102,
    '5040101': num5040101,
    '5040102': num5040102,
    '5040103': num5040103,
    '5100111': num5100111,
    '5050101': numMoreOdds,
    '5050102': numMoreOdds,
    '5050103': numMoreOdds,
    '5060101': numMoreOdds,
    '5060102': numMoreOdds,
    '5060103': numMoreOdds,
    '5070101': num5070101,
    '5080101': num5080101,
    '5090101': num5090101,
    '5100101': numMoreOdds,
    '5100102': numMoreOdds,
    '5100103': numMoreOdds,
    '5100104': numMoreOdds,
    '5100105': numMoreOdds,
    '5100106': numMoreOdds,
    '5100107': numMoreOdds,
    '5100108': numMoreOdds,
    '5100109': numMoreOdds,
    '5100110': numMoreOdds,
    '5110101': numMoreOdds,
    '5120101': numMoreOdds
}
