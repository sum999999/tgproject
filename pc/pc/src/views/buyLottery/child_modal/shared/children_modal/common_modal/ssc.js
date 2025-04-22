var sdtxSpit = /[\,\，]/
function num4010101(betballs) {
    var results = [] //清空对象
    var result = []
    var groups = []
    var ballGroups = betballs.split('|')
    if (ballGroups.some(item => !item)) return results //选号组别不够
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
                results.push(result.join(','))
            }
        }
    }
    return results
}

function num4010102(betballs) {
    let results = []
    betballs = betballs.trim();
    betballs = betballs.replace(/^[^\d]*(.*?)[^\d]*$/gm, '$1').replace(/\s*[，|,]+\s*/g, ',').replace(/[\s，|,]+/g, ',')
    betballs = betballs.split(sdtxSpit)
    betballs.forEach(item => {
        if (item.length === 5 && /^[0-9]*$/.test(item)) {
            // 去重
            if (!results.some(value => value === item)) {
                results.push(item)
            }
        }
    })
    // console.log(results);
    return results
}

function num4010201(betballs) {
    var results = []
    var balls = betballs.split(',')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 5) {
            //5个号码
            results.push(cur)
        }
    }
    return results
}

function num4010202(betballs) {
    var results = []
    var result = []
    var groups = []
    var ballGroups = betballs.split('|')
    if (ballGroups.some(item => !item)) return []
    //构建单号可能性号码组合
    var sresult = []
    var group = ballGroups[1].split(',')
    for (var i = 0, len1 = Math.pow(2, group.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = group.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(group[j])
            }
        }
        if (cur.length == 3) {
            //二个号码
            sresult.push(cur)
        }
    }
    //第一个分组号码要求重号
    var temp = []
    var balls = ballGroups[0].split(',')
    for (var j = 0, len2 = balls.length; j < len2; j++) {
        temp.push(balls[j] + ',' + balls[j])
    }
    groups.push(temp)
    groups.push(sresult)
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
    //记录重复号码
    var repeat = []
    for (var i = 0, len = results.length; i < len; i++) {
        var str = results[i] + ''
        var balls = str.split(',')
        for (var j = 0, length = balls.length; j < length; j++) {
            var regret = str.match(new RegExp(balls[j], 'g'))
            if (regret && regret.length > 2) {
                repeat.push(i)
            }
        }
    }
    //号码不能重复,在此复制新数组
    var norepeat = []
    for (var i = 0, len = results.length; i < len; i++) {
        if (repeat.indexOf(i) < 0) {
            norepeat.push(results[i])
        }
    }
    return norepeat
}

function num4010203(betballs) {
    var results = []
    var ballgroups = betballs.split('|')
    if (ballgroups.some(item => !item)) return []
    var results = []
    var balls = ballgroups[0].split(',')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j], balls[j])
            }
        }
        if (cur.length == 4) {
            //2个号码重号
            results.push(cur)
        }
    }
    var fresult = [] //组合结果集
    balls = ballgroups[1].split(',')
    for (var i = 0, len1 = results.length; i < len1; i++) {
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            var temp = results[i].concat() //copy
            temp.push(balls[j])
            fresult.push(temp)
        }
    }
    //记录重复号码
    var repeat = []
    for (var i = 0, len = fresult.length; i < len; i++) {
        var str = fresult[i] + ''
        var balls = str.split(',')
        for (var j = 0, length = balls.length; j < length; j++) {
            var regret = str.match(new RegExp(balls[j], 'g'))
            if (regret && regret.length > 2) {
                repeat.push(i)
            }
        }
    }
    //号码不能重复,在此复制新数组
    var norepeat = []
    for (var i = 0, len = fresult.length; i < len; i++) {
        if (repeat.indexOf(i) < 0) {
            norepeat.push(fresult[i])
        }
    }
    return norepeat
}

function num4010204(betballs) {
    var ballgroups = betballs.split('|')
    if (ballgroups.some(item => !item)) return [] //没有选够2组，返回0注
    var results = []
    var balls = ballgroups[0].split(',')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j], balls[j], balls[j])
            }
        }
        if (cur.length == 3) {
            //3个号码重号
            results.push(cur)
        }
    }
    var sresults = []
    var balls = ballgroups[1].split(',')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //2个号码
            sresults.push(cur)
        }
    }
    //组合所有号码可能性
    var fresult = [] //组合结果集
    balls = ballgroups[1].split(',')
    for (var i = 0, len1 = results.length; i < len1; i++) {
        for (var j = 0, len2 = sresults.length; j < len2; j++) {
            var temp = results[i].concat() //copy
            temp = temp.concat(sresults[j])
            fresult.push(temp)
        }
    }
    //记录重复号码
    var repeat = []
    for (var i = 0, len = fresult.length; i < len; i++) {
        var str = fresult[i] + ''
        var balls = str.split(',')
        for (var j = 0, length = balls.length; j < length; j++) {
            var regret = str.match(new RegExp(balls[j], 'g'))
            if (regret && regret.length > 3) {
                repeat.push(i)
            }
        }
    }
    //号码不能重复,在此复制新数组
    var norepeat = []
    for (var i = 0, len = fresult.length; i < len; i++) {
        if (repeat.indexOf(i) < 0) {
            norepeat.push(fresult[i])
        }
    }
    return norepeat
}

function num4010205(betballs) {
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

function num4010206(betballs) {
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

function num4020101(betballs) {
    var results = [] //清空对象
    var result = []
    var groups = []
    var ballGroups = betballs.split('|')
    if (ballGroups.some(item => !item)) return results //选号组别不够
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
                results.push(result.join(','))
            }
        }
    }
    return results
}

function num4020102(betballs) {
    let results = []
    betballs = betballs.trim();
    betballs = betballs.replace(/^[^\d]*(.*?)[^\d]*$/gm, '$1').replace(/\s*[，|,]+\s*/g, ',').replace(/[\s，|,]+/g, ',')
    betballs = betballs.split(sdtxSpit)
    betballs.forEach(item => {
        if (item.length === 4 && /^[0-9]*$/.test(item)) {
            // 去重
            if (!results.some(value => value === item)) {
                results.push(item)
            }
        }
    })
    return results
}

function num4020201(betballs) {
    var results = []
    var balls = betballs.split(',')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 4) {
            //5个号码
            results.push(cur)
        }
    }
    return results
}

function num4020202(betballs) {
    var ballgroups = betballs.split('|')
    if (ballgroups.some(item => !item)) return [] //没有选够2组，返回0注
    var results = []
    var balls = ballgroups[0].split(',')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j], balls[j], balls[j])
            }
        }
        if (cur.length == 3) {
            //3个号码重号
            results.push(cur)
        }
    }
    var sresults = []
    var balls = ballgroups[1].split(',')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //2个号码
            sresults.push(cur)
        }
    }
    //组合所有号码可能性
    var fresult = [] //组合结果集
    balls = ballgroups[1].split(',')
    for (var i = 0, len1 = results.length; i < len1; i++) {
        for (var j = 0, len2 = sresults.length; j < len2; j++) {
            var temp = results[i].concat() //copy
            temp = temp.concat(sresults[j])
            fresult.push(temp)
        }
    }
    //记录重复号码
    var repeat = []
    for (var i = 0, len = fresult.length; i < len; i++) {
        var str = fresult[i] + ''
        var balls = str.split(',')
        for (var j = 0, length = balls.length; j < length; j++) {
            var regret = str.match(new RegExp(balls[j], 'g'))
            if (regret && regret.length > 3) {
                repeat.push(i)
            }
        }
    }
    //号码不能重复,在此复制新数组
    var norepeat = []
    for (var i = 0, len = fresult.length; i < len; i++) {
        if (repeat.indexOf(i) < 0) {
            norepeat.push(fresult[i])
        }
    }
    return norepeat
}

function num4020203(betballs) {
    var balls = betballs.split(',')
    if (balls.length < 2) return [] //必须要两个号码以上
    var origin = []
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //二个号码
            origin.push(cur)
        }
    }
    var results = []
    for (var i = 0, len = origin.length; i < len; i++) {
        var balls = origin[i]
        results.push([balls[0], balls[0], balls[1], balls[1]])
    }
    return results
}

function num4020204(betballs) {
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

function num4030101(betballs) {
    var results = [] //清空对象
    var result = []
    var groups = []
    var ballGroups = betballs.split('|')
    // console.log(results);
    if (ballGroups.some(item => !item)) return results //选号组别不够
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
                results.push(result.join(','))
            }
        }
    }
    return results
}

function num4030102(betballs) {
    let results = []
    betballs = betballs.trim();
    betballs = betballs.replace(/^[^\d]*(.*?)[^\d]*$/gm, '$1').replace(/\s*[，|,]+\s*/g, ',').replace(/[\s，|,]+/g, ',')
    betballs = betballs.split(sdtxSpit)
    betballs.forEach(item => {
        if (item.length === 4 && /^[0-9]*$/.test(item)) {
            // 去重
            if (!results.some(value => value === item)) {
                results.push(item)
            }
        }
    })
    return results
}

function num4030201(betballs) {
    var results = []
    var balls = betballs.split(',')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 4) {
            //5个号码
            results.push(cur)
        }
    }
    return results
}

function num4030202(betballs) {
    var ballgroups = betballs.split('|')
    if (ballgroups.some(item => !item)) return [] //没有选够2组，返回0注
    var results = []
    var balls = ballgroups[0].split(',')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j], balls[j], balls[j])
            }
        }
        if (cur.length == 3) {
            //3个号码重号
            results.push(cur)
        }
    }
    var sresults = []
    var balls = ballgroups[1].split(',')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //2个号码
            sresults.push(cur)
        }
    }
    //组合所有号码可能性
    var fresult = [] //组合结果集
    balls = ballgroups[1].split(',')
    for (var i = 0, len1 = results.length; i < len1; i++) {
        for (var j = 0, len2 = sresults.length; j < len2; j++) {
            var temp = results[i].concat() //copy
            temp = temp.concat(sresults[j])
            fresult.push(temp)
        }
    }
    //记录重复号码
    var repeat = []
    for (var i = 0, len = fresult.length; i < len; i++) {
        var str = fresult[i] + ''
        var balls = str.split(',')
        for (var j = 0, length = balls.length; j < length; j++) {
            var regret = str.match(new RegExp(balls[j], 'g'))
            if (regret && regret.length > 3) {
                repeat.push(i)
            }
        }
    }
    //号码不能重复,在此复制新数组
    var norepeat = []
    for (var i = 0, len = fresult.length; i < len; i++) {
        if (repeat.indexOf(i) < 0) {
            norepeat.push(fresult[i])
        }
    }
    return norepeat
}

function num4030203(betballs) {
    var balls = betballs.split(',')
    if (balls.length < 2) return [] //必须要两个号码以上
    var origin = []
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //二个号码
            origin.push(cur)
        }
    }
    var results = []
    for (var i = 0, len = origin.length; i < len; i++) {
        var balls = origin[i]
        results.push([balls[0], balls[0], balls[1], balls[1]])
    }
    return results
}

function num4030204(betballs) {
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

function num4040101(betballs) {
    var results = [] //清空对象
    var result = []
    var groups = []
    var ballGroups = betballs.split('|')
    if (ballGroups.some(item => !item)) return results //选号组别不够
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
                results.push(result.join(','))
            }
        }
    }
    return results
}

function num4040102(betballs) {
    let results = []
    betballs = betballs.trim();
    betballs = betballs.replace(/^[^\d]*(.*?)[^\d]*$/gm, '$1').replace(/\s*[，|,]+\s*/g, ',').replace(/[\s，|,]+/g, ',')
    betballs = betballs.split(sdtxSpit)
    betballs.forEach(item => {
        if (item.length === 3 && /^[0-9]*$/.test(item)) {
            // 去重
            if (!results.some(value => value === item)) {
                results.push(item)
            }
        }
    })
    return results
}

function num4040103(betballs) {
    var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    var results = []
    var bettinggroups = betballs.split(',')
    if (!bettinggroups[0]) return []
    for (var k = 0, len3 = bettinggroups.length; k < len3; k++) {
        var bettingValue = Number(bettinggroups[k])
        for (var i = 0, len1 = seed.length; i < len1; i++) {
            for (var j = 0, len2 = seed.length; j < len2; j++) {
                var dvalue = bettingValue - seed[i] - seed[j]
                if (seed.indexOf(dvalue) > -1) {
                    results.push([seed[i] + '', seed[j] + '', dvalue + ''])
                }
            }
        }
    }
    return results
}

function num4040201(betballs) {
    //后三组三 - 组三
    // console.log(betballs);
    var results = []
    var balls = betballs.split(',')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //二个号码
            results.push(cur)
        }
    }
    var fresult = []
    for (var i = 0, len1 = results.length; i < len1; i++) {
        fresult.push([results[i][0], results[i][0], results[i][1]])
        fresult.push([results[i][0], results[i][1], results[i][1]])
    }
    return fresult
}

function num4040202(betballs) {
    var results = []
    var balls = betballs.split(',')
    if (balls.length < 3) return []
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 3) {
            //三个号码
            results.push(cur)
        }
    }
    return results
}

function num4040203(betballs) {
    var results = []
    betballs = betballs.split(' ')
    betballs.forEach(item => {
        if (item.length === 3 && !item.match(/^([0-9])\1\1$/)) {
            if (!results.some(value => value === item)) {
                results.push(item)
            }
        }
    })
    return results
}

function num4050101(betballs) {
    var results = [] //清空对象
    var result = []
    var groups = []
    var ballGroups = betballs.split('|')
    if (ballGroups.some(item => !item)) return results //选号组别不够
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
                results.push(result.join(','))
            }
        }
    }
    return results
}

function num4050102(betballs) {
    let results = []
    betballs = betballs.trim();
    betballs = betballs.replace(/^[^\d]*(.*?)[^\d]*$/gm, '$1').replace(/\s*[，|,]+\s*/g, ',').replace(/[\s，|,]+/g, ',')
    betballs = betballs.split(sdtxSpit)
    betballs.forEach(item => {
        if (item.length === 3 && /^[0-9]*$/.test(item)) {
            // 去重
            if (!results.some(value => value === item)) {
                results.push(item)
            }
        }
    })
    return results
}

function num4050103(betballs) {
    var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    var results = []
    var bettinggroups = betballs.split(',')
    if (!bettinggroups[0]) return []
    for (var k = 0, len3 = bettinggroups.length; k < len3; k++) {
        var bettingValue = Number(bettinggroups[k])
        for (var i = 0, len1 = seed.length; i < len1; i++) {
            for (var j = 0, len2 = seed.length; j < len2; j++) {
                var dvalue = bettingValue - seed[i] - seed[j]
                if (seed.indexOf(dvalue) > -1) {
                    results.push([seed[i] + '', seed[j] + '', dvalue + ''])
                }
            }
        }
    }
    return results
}

function num4050201(betballs) {
    var results = []
    var balls = betballs.split(',')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //二个号码
            results.push(cur)
        }
    }
    var fresult = []
    for (var i = 0, len1 = results.length; i < len1; i++) {
        fresult.push([results[i][0], results[i][0], results[i][1]])
        fresult.push([results[i][0], results[i][1], results[i][1]])
    }
    return fresult
}

function num4050202(betballs) {
    var results = []
    var balls = betballs.split(',')
    if (balls.length < 3) return []
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 3) {
            //三个号码
            results.push(cur)
        }
    }
    return results
}

function num4050203(betballs) {
    var results = []
    betballs = betballs.trim();
    betballs = betballs.replace(/^[^\d]*(.*?)[^\d]*$/gm, '$1').replace(/\s*[，|,]+\s*/g, ',').replace(/[\s，|,]+/g, ',')
    betballs = betballs.split(',')
    betballs.forEach(item => {
        if (item.length === 3 && !item.match(/^([0-9])\1\1$/)) {
            // 去重
            if (!results.some(value => value === item)) {
                results.push(item)
            }
        }
    })
    return results
}

function num4060101(betballs) {
    var results = [] //清空对象
    var result = []
    var groups = []
    var ballGroups = betballs.split('|')
    if (ballGroups.some(item => !item)) return results //选号组别不够
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
                results.push(result.join(','))
            }
        }
    }
    return results
}

function num4060102(betballs) {
    let results = []
    betballs = betballs.trim();
    betballs = betballs.replace(/^[^\d]*(.*?)[^\d]*$/gm, '$1').replace(/\s*[，|,]+\s*/g, ',').replace(/[\s，|,]+/g, ',')
    betballs = betballs.split(sdtxSpit)
    betballs.forEach(item => {
        if (item.length === 3 && /^[0-9]*$/.test(item)) {
            // 去重
            if (!results.some(value => value === item)) {
                results.push(item)
            }
        }
    })
    return results
}

function num4060103(betballs) {
    var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    var results = []
    var bettinggroups = betballs.split(',')
    if (!bettinggroups[0]) return []
    for (var k = 0, len3 = bettinggroups.length; k < len3; k++) {
        var bettingValue = Number(bettinggroups[k])
        for (var i = 0, len1 = seed.length; i < len1; i++) {
            for (var j = 0, len2 = seed.length; j < len2; j++) {
                var dvalue = bettingValue - seed[i] - seed[j]
                if (seed.indexOf(dvalue) > -1) {
                    results.push([seed[i] + '', seed[j] + '', dvalue + ''])
                }
            }
        }
    }
    return results
}

function num4060201(betballs) {
    var results = []
    var balls = betballs.split(',')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //二个号码
            results.push(cur)
        }
    }
    var fresult = []
    for (var i = 0, len1 = results.length; i < len1; i++) {
        fresult.push([results[i][0], results[i][0], results[i][1]])
        fresult.push([results[i][0], results[i][1], results[i][1]])
    }
    return fresult
}

function num4060202(betballs) {
    var results = []
    var balls = betballs.split(',')
    if (balls.length < 3) return []
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 3) {
            //三个号码
            results.push(cur)
        }
    }
    return results
}

function num4060203(betballs) {
    var results = []
    betballs = betballs.trim();
    betballs = betballs.replace(/^[^\d]*(.*?)[^\d]*$/gm, '$1').replace(/\s*[，|,]+\s*/g, ',').replace(/[\s，|,]+/g, ',')
    betballs = betballs.split(',')
    betballs.forEach(item => {
        if (item.length === 3 && !item.match(/^([0-9])\1\1$/)) {
            // 去重
            if (!results.some(value => value === item)) {
                results.push(item)
            }
        }
    })
    return results
}

function num4070101(betballs) {
    var results = []
    var result = []
    var groups = []
    var ballGroups = betballs.split('|')
    if (ballGroups.some(item => !item)) return [] //没有选够4组，返回0注
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
                results.push(result.join(','))
            }
        }
    }
    return results
}

function num4070102(betballs) {
    let results = []
    betballs = betballs.trim();
    betballs = betballs.replace(/^[^\d]*(.*?)[^\d]*$/gm, '$1').replace(/\s*[，|,]+\s*/g, ',').replace(/[\s，|,]+/g, ',')
    betballs = betballs.split(sdtxSpit)
    betballs.forEach(item => {
        if (item.length === 2 && !results.some(value => value === item)) {
            if(!results.includes(item)){
                results.push(item)
            }
        }
    })
    return results
}

function num4070103(betballs) {
    var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    var results = []
    var bettinggroups = betballs.split(',')
    if (!bettinggroups[0]) return []
    for (var k = 0, len3 = bettinggroups.length; k < len3; k++) {
        var bettingValue = Number(bettinggroups[k])
        for (var i = 0, len1 = seed.length; i < len1; i++) {
            var dvalue = bettingValue - seed[i]
            if (seed.indexOf(dvalue) > -1) {
                results.push([seed[i] + '', dvalue + ''])
            }
        }
    }
    return results
}

function num4070104(betballs) {
    var results = []
    var result = []
    var groups = []
    var ballGroups = betballs.split('|')
    if (ballGroups.some(item => !item)) return results //没有选够2组，返回0注
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
                results.push(result.join(','))
            }
        }
    }
    return results
}

function num4070201(betballs) {
    var results = []
    var balls = betballs.split(',')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //三个号码
            results.push(cur)
        }
    }
    return results
}

function num4070202(betballs) {
    var results = []
    betballs = betballs.trim();
    betballs = betballs.replace(/^[^\d]*(.*?)[^\d]*$/gm, '$1').replace(/\s*[，|,]+\s*/g, ',').replace(/[\s，|,]+/g, ',')
    betballs = betballs.split(sdtxSpit)
    betballs.forEach(item => {
        if (
            item.length === 2 &&
            !item.match(/^([0-9])\1$/) &&
            !results.some(value => value === item)
        ) {
            if(!results.includes(item)){
                results.push(item)
            }
        }
    })
    return results
}

function num4070301(betballs) {
    var results = []
    var result = []
    var groups = []
    var ballGroups = betballs.split('|')
    if (ballGroups.some(item => !item)) return [] //没有选够4组，返回0注
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
                results.push(result.join(','))
            }
        }
    }
    return results
}

function num4070302(betballs) {
    let results = []
    betballs = betballs.trim();
    betballs = betballs.replace(/^[^\d]*(.*?)[^\d]*$/gm, '$1').replace(/\s*[，|,]+\s*/g, ',').replace(/[\s，|,]+/g, ',')
    betballs = betballs.split(sdtxSpit)
    betballs.forEach(item => {
        if (item.length === 2 && !results.some(value => value === item)) {
            if(!results.includes(item)){
                results.push(item)
            }
        }
    })
    return results
}

function num4070303(betballs) {
    var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    var results = []
    var bettinggroups = betballs.split(',')
    if (!bettinggroups[0]) return []
    for (var k = 0, len3 = bettinggroups.length; k < len3; k++) {
        var bettingValue = Number(bettinggroups[k])
        for (var i = 0, len1 = seed.length; i < len1; i++) {
            var dvalue = bettingValue - seed[i]
            if (seed.indexOf(dvalue) > -1) {
                results.push([seed[i] + '', dvalue + ''])
            }
        }
    }
    return results
}

function num4070304(betballs) {
    var results = []
    var result = []
    var groups = []
    var ballGroups = betballs.split('|')
    if (ballGroups.some(item => !item)) return results //没有选够2组，返回0注
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
                results.push(result.join(','))
            }
        }
    }
    return results
}

function num4070401(betballs) {
    var results = []
    var balls = betballs.split(',')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //三个号码
            results.push(cur)
        }
    }
    return results
}

function num4070402(betballs) {
    var results = []
    betballs = betballs.trim();
    betballs = betballs.replace(/^[^\d]*(.*?)[^\d]*$/gm, '$1').replace(/\s*[，|,]+\s*/g, ',').replace(/[\s，|,]+/g, ',')
    betballs = betballs.split(sdtxSpit)
    betballs.forEach(item => {
        if (
            item.length === 2 &&
            !item.match(/^([0-9])\1$/) &&
            !results.some(value => value === item)
        ) {
            if(!results.includes(item)){
                results.push(item)
            }
        }
    })
    return results
}

function num4080101(betballs) {
    var ret = []
    var ballgroups = betballs.split('|')
    for (var i = 0, len1 = ballgroups.length; i < len1; i++) {
        var balls = ballgroups[i].split(',')
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if (balls[j] != '') ret.push(balls[j])
        }
    }
    return ret
}

function num4090101(betballs) {
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

function num4090102(betballs) {
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

function num4090103(betballs) {
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

function num4090201(betballs) {
    var results = []
    var balls = betballs.split(',')
    if (balls.some(item => !item)) return results
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //二个号码
            results.push(cur)
        }
    }
    return results
}

function num4090202(betballs) {
    var results = []
    var balls = betballs.split(',')
    if (balls.some(item => !item)) return results
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //二个号码
            results.push(cur)
        }
    }
    return results
}

function num4090203(betballs) {
    var results = []
    var balls = betballs.split(',')
    if (balls.some(item => !item)) return results
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //二个号码
            results.push(cur)
        }
    }
    return results
}

function num4100101(betballs) {
    var results = []
    var ballgroups = betballs.split('|')
    //先做位置上的组合，即从5个位置里选2个位置，把两个位置里的号码再排列，并保持顺序
    for (var i = 0, len1 = ballgroups.length; i < len1; i++) {
        for (var j = i + 1, len2 = ballgroups.length; j < len2; j++) {
            if (ballgroups[i].length == 0 || ballgroups[j].length == 0) continue
            var group1 = ballgroups[i].split(',')
            var group2 = ballgroups[j].split(',')
            for (var x = 0, len3 = group1.length; x < len3; x++) {
                for (var y = 0, len4 = group2.length; y < len4; y++) {
                    var temp = ['', '', '', '', '']
                    temp[i] = group1[x]
                    temp[j] = group2[y]
                    results.push(temp)
                }
            }
        }
    }
    return results
}

function num4100201(betballs) {
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
    var ballgroups = betballs.split('|')
    var betobj = {
        万位: ballgroups[0],
        千位: ballgroups[1],
        百位: ballgroups[2],
        十位: ballgroups[3],
        个位: ballgroups[4]
    }
    var positions = ['万位', '千位', '百位', '十位', '个位']
    var posrets = []
    for (var i = 0, len1 = Math.pow(2, positions.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = positions.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(positions[j])
            }
        }
        if (cur.length == 3) {
            //二个号码
            posrets.push(cur)
        }
    }

    function pos(key) {
        switch (key) {
            case '万位':
                return 0
            case '千位':
                return 1
            case '百位':
                return 2
            case '十位':
                return 3
            case '个位':
                return 4
            default:
                break
        }
    }
    var farr = []
    var results = []
    var result = []
    var groups = []
    for (var i = 0, len1 = posrets.length; i < len1; i++) {
        var betgroup1 = betobj[posrets[i][0]]
        var betgroup2 = betobj[posrets[i][1]]
        var betgroup3 = betobj[posrets[i][2]]
        if (
            betgroup1.length == 0 ||
            betgroup2.length == 0 ||
            betgroup3.length == 0
        )
            continue
        results = []
        result = []
        groups = [
            betgroup1.split(','),
            betgroup2.split(','),
            betgroup3.split(',')
        ]
        doExchange(groups, 0)
        //拆解号码所在位置
        for (var j = 0, len2 = results.length; j < len2; j++) {
            var balls = results[j].split(',')
            var temp = ['', '', '', '', '']
            temp[pos(posrets[i][0])] = balls[0]
            temp[pos(posrets[i][1])] = balls[1]
            temp[pos(posrets[i][2])] = balls[2]
            farr.push(temp)
        }
    }
    return farr
}

function num4100301(betballs) {
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
    var ballgroups = betballs.split('|')
    var betobj = {
        万位: ballgroups[0],
        千位: ballgroups[1],
        百位: ballgroups[2],
        十位: ballgroups[3],
        个位: ballgroups[4]
    }
    var positions = ['万位', '千位', '百位', '十位', '个位']
    var posrets = []
    for (var i = 0, len1 = Math.pow(2, positions.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = positions.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(positions[j])
            }
        }
        if (cur.length == 4) {
            //4个号码
            posrets.push(cur)
        }
    }

    function pos(key) {
        switch (key) {
            case '万位':
                return 0
            case '千位':
                return 1
            case '百位':
                return 2
            case '十位':
                return 3
            case '个位':
                return 4
            default:
                break
        }
    }
    var farr = []
    var results = []
    var result = []
    var groups = []
    for (var i = 0, len1 = posrets.length; i < len1; i++) {
        var betgroup1 = betobj[posrets[i][0]]
        var betgroup2 = betobj[posrets[i][1]]
        var betgroup3 = betobj[posrets[i][2]]
        var betgroup4 = betobj[posrets[i][3]]
        if (
            betgroup1.length == 0 ||
            betgroup2.length == 0 ||
            betgroup3.length == 0 ||
            betgroup4.length == 0
        )
            continue
        results = []
        result = []
        groups = [
            betgroup1.split(','),
            betgroup2.split(','),
            betgroup3.split(','),
            betgroup4.split(',')
        ]
        doExchange(groups, 0)
        //拆解号码所在位置
        for (var j = 0, len2 = results.length; j < len2; j++) {
            var balls = results[j].split(',')
            var temp = ['', '', '', '', '']
            temp[pos(posrets[i][0])] = balls[0]
            temp[pos(posrets[i][1])] = balls[1]
            temp[pos(posrets[i][2])] = balls[2]
            temp[pos(posrets[i][3])] = balls[3]
            farr.push(temp)
        }
    }
    return farr
}

function num4100102(betballs) {
    var results = []
    var ballgroups = betballs.split('|')
    var balls = ballgroups[0].split(sdtxSpit)
    if (
        ballgroups.length < 2 ||
        balls.length < 2 ||
        ballgroups.some(item => !item)
    ) {
        return []
    }
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //3个号码
            results.push(cur)
        }
    }
    //投注号码用空格分隔
    // var nums = ballgroups[1].split(" ");

    var nums = ballgroups[1]
    nums = nums.trim()
    nums = nums.replace(/^[^\d]*(.*?)[^\d]*$/gm, '$1').replace(/\s*[，|,]+\s*/g, ',').replace(/[\s，|,]+/g, ',').split(',')
    var count = 0
    var numResult = []
    for (var i = 0, len2 = nums.length; i < len2; i++) {
        if (
            nums[i].length == 2 &&
            !numResult.some(item => item === nums[i]) &&
            /^[0-9]*$/.test(nums[i])
        ) {
            count++
            numResult.push(nums[i])
        }
    }
    return {
        len: results.length * count,
        balls: ballgroups[0] + '|' + numResult.join(' ')
    }
}

function num4100103(betballs) {
    var results = []
    var ballgroups = betballs.split('|')
    var balls = ballgroups[0].split(',')
    if (ballgroups.length < 2 || balls.length < 2) {
        return []
    }
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //二个号码
            results.push(cur)
        }
    }
    var numbers = []
    var numballs = ballgroups[1].split(',')
    if (numballs.length < 2) {
        return []
    }
    for (var i = 0, len1 = Math.pow(2, numballs.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = numballs.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(numballs[j])
            }
        }
        if (cur.length == 2) {
            //二个号码
            numbers.push(cur)
        }
    }
    return {
        len: results.length * numbers.length
    }
}

function num4100202(betballs) {
    var results = []
    var ballgroups = betballs.split('|')
    var balls = ballgroups[0].split(sdtxSpit)
    if (ballgroups.length < 2 || balls.length < 3) {
        return []
    }
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 3) {
            //3个号码
            results.push(cur)
        }
    }
    //投注号码用空格分隔
    // var nums = ballgroups[1].split(" ");
    var nums = ballgroups[1]
    nums = nums.trim();
    nums = nums.replace(/^[^\d]*(.*?)[^\d]*$/gm, '$1').replace(/\s*[，|,]+\s*/g, ',').replace(/[\s，|,]+/g, ',').split(',')
    var count = 0
    var numResult = []
    for (var i = 0, len2 = nums.length; i < len2; i++) {
        if (
            nums[i].length == 3 &&
            !numResult.some(item => item === nums[i]) &&
            /^[0-9]*$/.test(nums[i])
        ) {
            count++
            numResult.push(nums[i])
        }
    }
    return {
        len: results.length * count,
        balls: ballgroups[0] + '|' + numResult.join(' ')
    }
}

function num4100203(betballs) {
    var ballgroups = betballs.split('|')
    var balls = ballgroups[0].split(',')
    if (ballgroups.length < 2 || balls.length < 3) {
        return []
    }
    var posrets = []
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 3) {
            //3个号码
            posrets.push(cur)
        }
    }
    var results = []
    balls = ballgroups[1].split(',')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //2个号码
            results.push(cur)
        }
    }
    return {
        len: results.length * posrets.length * 2
    }
}

function num4100204(betballs) {
    var ballgroups = betballs.split('|')
    var balls = ballgroups[0].split(',')
    if (ballgroups.length < 2 || balls.length < 3) {
        return []
    }
    var posrets = []
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 3) {
            //3个号码
            posrets.push(cur)
        }
    }
    var results = []
    balls = ballgroups[1].split(',')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 3) {
            //3个号码
            results.push(cur)
        }
    }
    return {
        len: results.length * posrets.length
    }
}

// function num4100302(betballs) {
//     var results = []
//     var ballgroups = betballs.split('|')
//     var balls = ballgroups[0].split(sdtxSpit)
//     if (ballgroups.length < 2 || balls.length < 4) {
//         return []
//     }
//     for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
//         var cur = []
//         for (var j = 0, len2 = balls.length; j < len2; j++) {
//             if ((i >> j) & 1) {
//                 cur.push(balls[j])
//             }
//         }
//         if (cur.length == 4) {
//             //4个号码
//             results.push(cur)
//         }
//     }
//     //投注号码用空格分隔
//     var nums = ballgroups[1].split(' ')
//     var count = 0
//     var numResult = []
//     for (var i = 0, len2 = nums.length; i < len2; i++) {
//         if (
//             nums[i].length == 4 &&
//             !numResult.some(item => item === nums[i]) &&
//             /^[0-9]*$/.test(nums[i])
//         ) {
//             count++
//             numResult.push(nums[i])
//         }
//     }
//     return {
//         len: results.length * count,
//         balls: ballgroups[0] + '|' + numResult.join(' ')
//     }
// }
function num4100302(betballs) { //2019.6.12
	var results = []; 
	var ballgroups = betballs.split("|");
	var balls = ballgroups[0].split(sdtxSpit);
	if (ballgroups.length < 2 || balls.length < 4) {
		return [];
	}
	for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
		var cur = [];
		for (var j = 0, len2 = balls.length; j < len2; j++) {
			if (i >> j & 1) {
				cur.push(balls[j]);
			}
		}
		if (cur.length == 4) { //4个号码
			results.push(cur)
		}
	}
	//投注号码用空格分隔
	// var nums = ballgroups[1].split(" ");
	var nums = ballgroups[1]
    nums = nums.trim();
    nums = nums.replace(/^[^\d]*(.*?)[^\d]*$/gm, '$1').replace(/\s*[，|,]+\s*/g, ',').replace(/[\s，|,]+/g, ',').split(",");
	var count = 0;
	var numResult = [];
	for (var i = 0, len2 = nums.length; i < len2; i++) {
		if (nums[i].length == 4 && !numResult.some(item => item === nums[i]) && /^[0-9]*$/.test(nums[i])) {
			count++;
			numResult.push(nums[i])
		};
	}
	return {
		len: results.length * count,
		balls: ballgroups[0] + '|' + numResult.join(' ')
	};
}

// 两面
function num4140101(betballs) {
    //构建所有可能性号码组合
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
    var results = []
    var result = []
    var groups = []
    var ballGroups = betballs.split('|')
    for (var i = 0, len = ballGroups.length; i < len; i++) {
        if (ballGroups[i] == '' || ballGroups[i].length == 0) continue
        groups.push(ballGroups[i].split(','))
    }
    if (groups.length < 2) return [] //没有选够2组，返回0注
    doExchange(groups, 0)
    return results
}

function num4140102(betballs) {
    //构建所有可能性号码组合
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
    var results = []
    var result = []
    var groups = []
    var ballGroups = betballs.split('|')
    for (var i = 0, len = ballGroups.length; i < len; i++) {
        if (ballGroups[i] == '' || ballGroups[i].length == 0) continue
        groups.push(ballGroups[i].split(','))
    }
    if (groups.length < 3) return [] //没有选够3组，返回0注
    doExchange(groups, 0)
    return results
}

function num4140103(betballs) {
    //构建所有可能性号码组合
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
    var results = []
    var result = []
    var groups = []
    var ballGroups = betballs.split('|')
    for (var i = 0, len = ballGroups.length; i < len; i++) {
        if (ballGroups[i] == '' || ballGroups[i].length == 0) continue
        groups.push(ballGroups[i].split(','))
    }
    if (groups.length < 2) return [] //没有选够2组，返回0注
    doExchange(groups, 0)
    return results
}

function num4140104(betballs) {
    //构建所有可能性号码组合
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
    var results = []
    var result = []
    var groups = []
    var ballGroups = betballs.split('|')
    for (var i = 0, len = ballGroups.length; i < len; i++) {
        if (ballGroups[i] == '' || ballGroups[i].length == 0) continue
        groups.push(ballGroups[i].split(','))
    }
    if (groups.length < 3) return [] //没有选够3组，返回0注
    doExchange(groups, 0)
    return results
}

function num4140105(betballs) {
    // return betballs.split(",").filter(item => item);
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

function num4140106(betballs) {
    // return betballs.split(",").filter(item => item);
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

function num4140107(betballs) {
    // return betballs.split(",").filter(item => item);
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

function num4140108(betballs) {
    // return betballs.split(",").filter(item => item);
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

function num4140109(betballs) {
    // return betballs.split(",").filter(item => item);
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

function num4140110(betballs) {
    // return [betballs.split(",").filter(item => item)];
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
// 2018/6/7 新增玩法
function num4150(betballs) {
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

function num4160101(betballs) {
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

function num4160201(betballs) {
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

function num4160301(betballs) {
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

function num4170101(betballs) {
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

function num4180101(betballs){
	// var balls = betballs.split(",");
    // return [balls];
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
function num4140111(betballs){
    var results = []
	var ballgroups = betballs.split("|");
	for(var i = 0,len1 = ballgroups.length; i < len1; i++){
		var balls = ballgroups[i].split(",");
		for(var j = 0,len2 = balls.length; j < len2; j++){
			if(balls[j] != "")results.push(balls[j]);
		}
	}
	return results;
}

module.exports = {
    '4010101': num4010101,
    '4010102': num4010102,
    '4010201': num4010201,
    '4010202': num4010202,
    '4010203': num4010203,
    '4010204': num4010204,
    '4010205': num4010205,
    '4010206': num4010206,
    '4020101': num4020101,
    '4020102': num4020102,
    '4020201': num4020201,
    '4020202': num4020202,
    '4020203': num4020203,
    '4020204': num4020204,
    '4030101': num4030101,
    '4030102': num4030102,
    '4030201': num4030201,
    '4030202': num4030202,
    '4030203': num4030203,
    '4030204': num4030204,
    '4040101': num4040101,
    '4040102': num4040102,
    '4040103': num4040103,
    '4040201': num4040201,
    '4040202': num4040202,
    '4040203': num4040203,
    '4050101': num4050101,
    '4050102': num4050102,
    '4050103': num4050103,
    '4050201': num4050201,
    '4050202': num4050202,
    '4050203': num4050203,
    '4060101': num4060101,
    '4060102': num4060102,
    '4060103': num4060103,
    '4060201': num4060201,
    '4060202': num4060202,
    '4060203': num4060203,
    '4070101': num4070101,
    '4070102': num4070102,
    '4070103': num4070103,
    '4070104': num4070104,
    '4070201': num4070201,
    '4070202': num4070202,
    '4070301': num4070301,
    '4070302': num4070302,
    '4070303': num4070303,
    '4070304': num4070304,
    '4070401': num4070401,
    '4070402': num4070402,
    '4080101': num4080101,
    '4090101': num4090101,
    '4090102': num4090102,
    '4090103': num4090103,
    '4090201': num4090201,
    '4090202': num4090202,
    '4090203': num4090203,
    '4100101': num4100101,
    '4100201': num4100201,
    '4100301': num4100301,
    '4100102': num4100102,
    '4100103': num4100103,
    '4100202': num4100202,
    '4100203': num4100203,
    '4100204': num4100204,
    '4100302': num4100302,
    '4140101': num4140101,
    '4140102': num4140102,
    '4140103': num4140103,
    '4140104': num4140104,
    '4140105': num4140105,
    '4140106': num4140106,
    '4140107': num4140107,
    '4140108': num4140108,
    '4140109': num4140109,
    '4140110': num4140110,
    '4150101': num4150,
    '4150102': num4150,
    '4150103': num4150,
    '4150104': num4150,
    '4150105': num4150,
    '4150106': num4150,
    '4150107': num4150,
    '4150108': num4150,
    '4150109': num4150,
    '4150110': num4150,
    '4160101': num4160101,
    '4160201': num4160201,
    '4160301': num4160301,
    '4170101': num4170101,
    '4180101': num4180101,
    '4140111': num4140111
}
