function random4010101(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 5) {
            //5个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('|')
}

function random4010102(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 5) {
            //三个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('') //单式以空格分割
}

function random4010201(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 5) {
            //5个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join(',')
}

function random4010202(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 3) {
            //3个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    var temp = randomArr[index] //选到随机三个号码
    //从可选号码中剔除随机选到的3个号码
    var leftballs = []
    for (var i = 0, len1 = balls.length; i < len1; i++) {
        if (randomArr[index].indexOf(balls[i]) < 0) {
            leftballs.push(balls[i])
        }
    }
    // var twoindex = Math.ceil(Math.random() * (leftballs.length - 1))
    var twoindex = Math.ceil(Math.random() * 9999) % leftballs.length
    return leftballs[twoindex] + '|' + randomArr[index].join(',')
}

function random4010203(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //3个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    var temp = randomArr[index] //选到随机三个号码
    //从可选号码中剔除随机选到的3个号码
    var leftballs = []
    for (var i = 0, len1 = balls.length; i < len1; i++) {
        if (randomArr[index].indexOf(balls[i]) < 0) {
            leftballs.push(balls[i])
        }
    }
    // var twoindex = Math.ceil(Math.random() * (leftballs.length - 1))
    var twoindex = Math.ceil(Math.random() * 9999) % leftballs.length
    return randomArr[index].join(',') + '|' + leftballs[twoindex]
}

function random4010204(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //2个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    var temp = randomArr[index] //选到随机三个号码
    //从可选号码中剔除随机选到的3个号码
    var leftballs = []
    for (var i = 0, len1 = balls.length; i < len1; i++) {
        if (randomArr[index].indexOf(balls[i]) < 0) {
            leftballs.push(balls[i])
        }
    }
    // var twoindex = Math.ceil(Math.random() * (leftballs.length - 1))
    var twoindex = Math.ceil(Math.random() * 9999) % leftballs.length
    return leftballs[twoindex] + '|' + randomArr[index].join(',')
}

function random4010205(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //2个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('|')
}

function random4010206(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //2个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('|')
}

function random4020101(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 4) {
            //4个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('|')
}

function random4020102(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 4) {
            //4个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('')
}

function random4020201(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 4) {
            //4个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join(',')
}

function random4020202(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //2个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    var temp = randomArr[index] //选到随机三个号码
    //从可选号码中剔除随机选到的3个号码
    var leftballs = []
    for (var i = 0, len1 = balls.length; i < len1; i++) {
        if (randomArr[index].indexOf(balls[i]) < 0) {
            leftballs.push(balls[i])
        }
    }
    // var twoindex = Math.ceil(Math.random() * (leftballs.length - 1))
    var twoindex = Math.ceil(Math.random() * 9999) % leftballs.length
    return leftballs[twoindex] + '|' + randomArr[index].join(',')
}

function random4020203(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //2个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join(',')
}

function random4020204(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //2个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('|')
}

function random4030101(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 4) {
            //4个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('|')
}

function random4030102(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 4) {
            //4个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('')
}

function random4030201(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 4) {
            //4个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join(',')
}

function random4030202(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //2个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    var temp = randomArr[index] //选到随机三个号码
    //从可选号码中剔除随机选到的3个号码
    var leftballs = []
    for (var i = 0, len1 = balls.length; i < len1; i++) {
        if (randomArr[index].indexOf(balls[i]) < 0) {
            leftballs.push(balls[i])
        }
    }
    // var twoindex = Math.ceil(Math.random() * (leftballs.length - 1))
    var twoindex = Math.ceil(Math.random() * 9999) % leftballs.length
    return leftballs[twoindex] + '|' + randomArr[index].join(',')
}

function random4030203(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //2个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join(',')
}

function random4030204(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //2个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('|')
}

function random4040101(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 3) {
            //3个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('|')
}

function random4040102(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 3) {
            //3个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('')
}

function random4040103(optballs) {
    var balls = optballs.split('|')
    // var index = Math.ceil(Math.random() * (balls.length - 1))
    var index = Math.ceil(Math.random() * 9999) % balls.length
    // 计算注数
    let result = bettingAmount(balls[index])

    function bettingAmount(betballs) {
        var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        var results = []
        for (var i = 0, len1 = seed.length; i < len1; i++) {
            for (var j = 0, len2 = seed.length; j < len2; j++) {
                var dvalue = Number(betballs) - seed[i] - seed[j]
                if (seed.indexOf(dvalue) > -1) {
                    results.push([seed[i] + '', seed[j] + '', dvalue + ''])
                }
            }
        }
        return results
    }
    return {
        len: result.length,
        ball: balls[index]
    }
}

function random4040201(optballs) {
    //后三组三 - 组三
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //2个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return {
        ball: randomArr[index].join(','),
        len: 2,
        isBettingMoney: false
    }
}

function random4040202(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 3) {
            //3个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join(',')
}

function random4040203(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 3) {
            //3个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('')
}

function random4050101(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 3) {
            //3个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('|')
}

function random4050102(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 3) {
            //3个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('')
}

function random4050103(optballs) {
    var balls = optballs.split('|')
    // var index = Math.ceil(Math.random() * (balls.length - 1))
    var index = Math.ceil(Math.random() * 9999) % balls.length
    // 计算注数
    let result = bettingAmount(balls[index])

    function bettingAmount(betballs) {
        var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        var results = []
        for (var i = 0, len1 = seed.length; i < len1; i++) {
            for (var j = 0, len2 = seed.length; j < len2; j++) {
                var dvalue = Number(betballs) - seed[i] - seed[j]
                if (seed.indexOf(dvalue) > -1) {
                    results.push([seed[i] + '', seed[j] + '', dvalue + ''])
                }
            }
        }
        return results
    }
    return {
        len: result.length,
        ball: balls[index]
    }
}

function random4050201(optballs) {
    //中三-组三
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //2个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    // return randomArr[index].join(",");
    return {
        ball: randomArr[index].join(','),
        len: 2,
        isBettingMoney: false
    }
}

function random4050202(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 3) {
            //3个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join(',')
}

function random4050203(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 3) {
            //3个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('')
}

function random4060101(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 3) {
            //3个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('|')
}

function random4060102(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 3) {
            //3个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('')
}

function random4060103(optballs) {
    var balls = optballs.split('|')
    // var index = Math.ceil(Math.random() * (balls.length - 1))
    var index = Math.ceil(Math.random() * 9999) % balls.length
    // 计算注数
    let result = bettingAmount(balls[index])

    function bettingAmount(betballs) {
        var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        var results = []
        for (var i = 0, len1 = seed.length; i < len1; i++) {
            for (var j = 0, len2 = seed.length; j < len2; j++) {
                var dvalue = Number(betballs) - seed[i] - seed[j]
                if (seed.indexOf(dvalue) > -1) {
                    results.push([seed[i] + '', seed[j] + '', dvalue + ''])
                }
            }
        }
        return results
    }
    return {
        len: result.length,
        ball: balls[index]
    }
}

function random4060201(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //2个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    // return randomArr[index].join(",");
    return {
        ball: randomArr[index].join(','),
        len: 2,
        isBettingMoney: false
    }
}

function random4060202(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 3) {
            //3个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join(',')
}

function random4060203(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 3) {
            //3个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('')
}

function random4070101(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //2个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('|')
}

function random4070102(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //2个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('')
}

function random4070103(optballs) {
    var balls = optballs.split('|')
    // var index = Math.ceil(Math.random() * (balls.length - 1))
    var index = Math.ceil(Math.random() * 9999) % balls.length
    // 计算注数
    let result = bettingAmount(balls[index])

    function bettingAmount(betballs) {
        var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        var results = []
        for (var i = 0, len1 = seed.length; i < len1; i++) {
            var dvalue = Number(betballs) - seed[i]
            if (seed.indexOf(dvalue) > -1) {
                results.push([seed[i] + '', dvalue + ''])
            }
        }
        return results
    }
    return {
        len: result.length,
        ball: balls[index]
    }
}

function random4070104(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //2个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('|')
}

function random4070201(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //2个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join(',')
}

function random4070202(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //2个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('')
}

function random4070301(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //2个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('|')
}

function random4070302(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //2个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('')
}

function random4070303(optballs) {
    var balls = optballs.split('|')
    // var index = Math.ceil(Math.random() * (balls.length - 1))
    var index = Math.ceil(Math.random() * 9999) % balls.length

    // 计算注数
    let result = bettingAmount(balls[index])

    function bettingAmount(betballs) {
        var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        var results = []
        for (var i = 0, len1 = seed.length; i < len1; i++) {
            var dvalue = Number(betballs) - seed[i]
            if (seed.indexOf(dvalue) > -1) {
                results.push([seed[i] + '', dvalue + ''])
            }
        }
        return results
    }
    return {
        len: result.length,
        ball: balls[index]
    }
}

function random4070304(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //2个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('|')
}

function random4070401(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //2个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join(',')
}

function random4070402(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //2个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('')
}

function random4080101(optballs) {
    var rnd = ['', '', '', '', '']
    var balls = optballs.split('|')
    // var index = Math.ceil(Math.random() * (balls.length - 1))
    var index = Math.ceil(Math.random() * 9999) % balls.length
    rnd[index % 5] = balls[index] + '' //定位胆，应该是3位中任意选择一个给值
    return rnd.join('|') //返回随机的格式|04|||，表示在5个分组里04是落在第二位，随机一个04号码
}

function random4090101(optballs) {
    var balls = optballs.split('|')
    // var index = Math.ceil(Math.random() * (balls.length - 1))
    var index = Math.ceil(Math.random() * 9999) % balls.length
    return balls[index] + ''
}

function random4090102(optballs) {
    var balls = optballs.split('|')
    // var index = Math.ceil(Math.random() * (balls.length - 1))
    var index = Math.ceil(Math.random() * 9999) % balls.length
    return balls[index] + ''
}

function random4090103(optballs) {
    var balls = optballs.split('|')
    // var index = Math.ceil(Math.random() * (balls.length - 1))
    var index = Math.ceil(Math.random() * 9999) % balls.length
    return balls[index] + ''
}

function random4090201(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //2个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join(',')
}

function random4090202(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //2个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join(',')
}

function random4090203(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //2个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join(',')
}

function random4100101(optballs) {
    var balls = optballs.split('|')
    var rnd = ['', '', '', '', '']
    var rnindex1 = Math.ceil(Math.random() * (balls.length - 1))
    rnd[rnindex1 % 5] = balls[rnindex1] + ''
    var rnindex2 = Math.ceil(Math.random() * (balls.length - 1))
    if (rnd[rnindex2 % 5] != '') {
        //说明冲突了
        rnd[(rnindex2 + 1) % 5] = balls[rnindex2] + ''
    } else {
        rnd[rnindex2 % 5] = balls[rnindex2] + ''
    }
    return rnd.join('|') //返回随机的格式|04|||，表示在5个分组里04是落在第二位，随机一个04号码
}

function random4100201(optballs) {
    var balls = optballs.split('|')
    var rnd = ['', '', '', '', '']
    // var rnindex1 = Math.ceil(Math.random() * (balls.length - 1))
    var rnindex1 = Math.ceil(Math.random() * 9999) % balls.length
    // var rnindex2 = Math.ceil(Math.random() * (balls.length - 1))
    var rnindex2 = Math.ceil(Math.random() * 9999) % balls.length
    // var rnindex3 = Math.ceil(Math.random() * (balls.length - 1))
    var rnindex3 = Math.ceil(Math.random() * 9999) % balls.length
    var results = []
    var rndnum = [0, 1, 2, 3, 4] //5个数中任意选择3个数作为位置摆放选号
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 3) {
            results.push(cur)
        }
    }
    var rnindex = Math.ceil(Math.random() * 9)
    rnd[results[rnindex][0]] = balls[rnindex1]
    rnd[results[rnindex][1]] = balls[rnindex2]
    rnd[results[rnindex][2]] = balls[rnindex3]
    return rnd.join('|') //返回随机的格式|04|||，表示在5个分组里04是落在第二位，随机一个04号码
}

function random4100301(optballs) {
    var balls = optballs.split('|')
    var rnd = ['', '', '', '', '']
    // var rnindex1 = Math.ceil(Math.random() * (balls.length - 1))
    // var rnindex2 = Math.ceil(Math.random() * (balls.length - 1))
    // var rnindex3 = Math.ceil(Math.random() * (balls.length - 1))
    // var rnindex4 = Math.ceil(Math.random() * (balls.length - 1))
    var rnindex1 = Math.ceil(Math.random() * 9999) % balls.length
    var rnindex2 = Math.ceil(Math.random() * 9999) % balls.length
    var rnindex3 = Math.ceil(Math.random() * 9999) % balls.length
    var rnindex4 = Math.ceil(Math.random() * 9999) % balls.length
    var results = []
    var rndnum = [0, 1, 2, 3, 4] //5个数中任意选择3个数作为位置摆放选号
    for (var i = 0, len1 = Math.pow(2, rndnum.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = rndnum.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 4) {
            results.push(cur)
        }
    }
    var rnindex = Math.round(Math.random() * 4)
    rnd[results[rnindex][0]] = balls[rnindex1]
    rnd[results[rnindex][1]] = balls[rnindex2]
    rnd[results[rnindex][2]] = balls[rnindex3]
    rnd[results[rnindex][3]] = balls[rnindex4]
    return rnd.join('|') //返回随机的格式|04|||，表示在5个分组里04是落在第二位，随机一个04号码
}

function random4100102(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //二个号码
            randomArr.push(cur)
        }
    }
    var positions = ['万位', '千位', '百位', '十位', '个位']
    var results = []
    for (var i = 0, len1 = Math.pow(2, positions.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = positions.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(positions[j])
            }
        }
        if (cur.length == 2) {
            //二个号码
            results.push(cur)
        }
    }
    // var rnindex1 = Math.ceil(Math.random() * (results.length - 1))
    // var rnindex2 = Math.ceil(Math.random() * (randomArr.length - 1))
    var rnindex1 = Math.ceil(Math.random() * 9999) % results.length
    var rnindex2 = Math.ceil(Math.random() * 9999) % randomArr.length
    return results[rnindex1].join(',') + '|' + randomArr[rnindex2].join('')
}

function random4100103(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //二个号码
            randomArr.push(cur)
        }
    }
    var positions = ['万位', '千位', '百位', '十位', '个位']
    var results = []
    for (var i = 0, len1 = Math.pow(2, positions.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = positions.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(positions[j])
            }
        }
        if (cur.length == 2) {
            //二个号码
            results.push(cur)
        }
    }
    // var rnindex1 = Math.ceil(Math.random() * (results.length - 1))
    // var rnindex2 = Math.ceil(Math.random() * (randomArr.length - 1))
    var rnindex1 = Math.ceil(Math.random() * 9999) % results.length
    var rnindex2 = Math.ceil(Math.random() * 9999) % randomArr.length
    return results[rnindex1].join(',') + '|' + randomArr[rnindex2].join(',')
}

function random4100202(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 3) {
            //二个号码
            randomArr.push(cur)
        }
    }
    var positions = ['万位', '千位', '百位', '十位', '个位']
    var results = []
    for (var i = 0, len1 = Math.pow(2, positions.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = positions.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(positions[j])
            }
        }
        if (cur.length == 3) {
            //二个号码
            results.push(cur)
        }
    }
    // var rnindex1 = Math.ceil(Math.random() * (results.length - 1))
    // var rnindex2 = Math.ceil(Math.random() * (randomArr.length - 1))
    var rnindex1 = Math.ceil(Math.random() * 9999) % results.length
    var rnindex2 = Math.ceil(Math.random() * 9999) % randomArr.length
    return results[rnindex1].join(',') + '|' + randomArr[rnindex2].join('')
}

function random4100203(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //二个号码
            randomArr.push(cur)
        }
    }
    var positions = ['万位', '千位', '百位', '十位', '个位']
    var results = []
    for (var i = 0, len1 = Math.pow(2, positions.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = positions.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(positions[j])
            }
        }
        if (cur.length == 3) {
            //3个位置
            results.push(cur)
        }
    }
    // var rnindex1 = Math.ceil(Math.random() * (results.length - 1))
    // var rnindex2 = Math.ceil(Math.random() * (randomArr.length - 1))
    var rnindex1 = Math.ceil(Math.random() * 9999) % results.length
    var rnindex2 = Math.ceil(Math.random() * 9999) % randomArr.length
    // return results[rnindex1].join(",")+"|"+randomArr[rnindex2].join(",");
    return {
        ball: results[rnindex1].join(',') + '|' + randomArr[rnindex2].join(','),
        len: 2,
        isBettingMoney: false
    }
}

function random4100204(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 3) {
            //二个号码
            randomArr.push(cur)
        }
    }
    var positions = ['万位', '千位', '百位', '十位', '个位']
    var results = []
    for (var i = 0, len1 = Math.pow(2, positions.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = positions.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(positions[j])
            }
        }
        if (cur.length == 3) {
            //3个位置
            results.push(cur)
        }
    }
    // var rnindex1 = Math.ceil(Math.random() * (results.length - 1))
    // var rnindex2 = Math.ceil(Math.random() * (randomArr.length - 1))
    var rnindex1 = Math.ceil(Math.random() * 9999) % results.length
    var rnindex2 = Math.ceil(Math.random() * 9999) % randomArr.length
    return results[rnindex1].join(',') + '|' + randomArr[rnindex2].join(',')
}

function random4100302(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 4) {
            //4个号码
            randomArr.push(cur)
        }
    }
    var positions = ['万位', '千位', '百位', '十位', '个位']
    var results = []
    for (var i = 0, len1 = Math.pow(2, positions.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = positions.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(positions[j])
            }
        }
        if (cur.length == 4) {
            //4个号码
            results.push(cur)
        }
    }
    // var rnindex1 = Math.ceil(Math.random() * (results.length - 1))
    // var rnindex2 = Math.ceil(Math.random() * (randomArr.length - 1))
    var rnindex1 = Math.ceil(Math.random() * 9999) % results.length
    var rnindex2 = Math.ceil(Math.random() * 9999) % randomArr.length
    return results[rnindex1].join(',') + '|' + randomArr[rnindex2].join('')
}
// 两面
function random4140101(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //2个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('|')
}

function random4140102(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 3) {
            //3个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('|')
}

function random4140103(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 2) {
            //2个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('|')
}

function random4140104(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 3) {
            //3个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('|')
}

function random4140105(optballs) {
    var balls = optballs.split('|')
    // var index = Math.ceil(Math.random() * (balls.length - 1))
    var index = Math.ceil(Math.random() * 9999) % balls.length
    return balls[index] + ''
}

function random4140106(optballs) {
    var balls = optballs.split('|')
    // var index = Math.ceil(Math.random() * (balls.length - 1))
    var index = Math.ceil(Math.random() * 9999) % balls.length
    return balls[index] + ''
}

function random4140107(optballs) {
    var balls = optballs.split('|')
    // var index = Math.ceil(Math.random() * (balls.length - 1))
    var index = Math.ceil(Math.random() * 9999) % balls.length
    return balls[index] + ''
}

function random4140108(optballs) {
    var balls = optballs.split('|')
    // var index = Math.ceil(Math.random() * (balls.length - 1))
    var index = Math.ceil(Math.random() * 9999) % balls.length
    return balls[index] + ''
}

function random4140109(optballs) {
    var balls = optballs.split('|')
    // var index = Math.ceil(Math.random() * (balls.length - 1))
    var index = Math.ceil(Math.random() * 9999) % balls.length
    return balls[index] + ''
}

function random4140110(optballs) {
    var balls = optballs.split('|')
    // var index = Math.ceil(Math.random() * (balls.length - 1))
    var index = Math.ceil(Math.random() * 9999) % balls.length
    return balls[index] + ''
}

function random4150(optballs) {
    var balls = optballs.split('|')
    var index = Math.ceil(Math.random() * 1000) % 3
    return balls[index] + ''
}

function random4160101(optballs) {
    var balls = optballs.split('|')
    var index = Math.ceil(Math.random() * 1000) % 5
    return balls[index] + ''
}

function random4160201(optballs) {
    var balls = optballs.split('|')
    var index = Math.ceil(Math.random() * 1000) % 5
    return balls[index] + ''
}

function random4160301(optballs) {
    var balls = optballs.split('|')
    var index = Math.ceil(Math.random() * 1000) % 5
    return balls[index] + ''
}

function random4170101(optballs) {
    var balls = optballs.split('|')
    var index = Math.ceil(Math.random() * 1000) % 11
    return balls[index] + ''
}

function random4180101(optballs){
	var balls = optballs.split("|");
    var index = Math.ceil(Math.random()*1000)%8;
    return balls[index]+"";
}
function random4140111(optballs){
	var rnd = ["","","","",""];
	var balls = optballs.split("|");
    var idx1 = Math.ceil(Math.random()*99999)%balls.length;
	var idx2 = Math.ceil(Math.random()*99999)%rnd.length;
    rnd[idx2] = balls[idx1]+"";//定位胆，应该是3位中任意选择一个给值
    return rnd.join("|");//返回随机的格式|04|||，表示在5个分组里04是落在第二位，随机一个04号码
}

module.exports = {
    '4010101': random4010101,
    '4010102': random4010102,
    '4010201': random4010201,
    '4010202': random4010202,
    '4010203': random4010203,
    '4010204': random4010204,
    '4010205': random4010205,
    '4010206': random4010206,
    '4020101': random4020101,
    '4020102': random4020102,
    '4020201': random4020201,
    '4020202': random4020202,
    '4020203': random4020203,
    '4020204': random4020204,
    '4030101': random4030101,
    '4030102': random4030102,
    '4030201': random4030201,
    '4030202': random4030202,
    '4030203': random4030203,
    '4030204': random4030204,
    '4040101': random4040101,
    '4040102': random4040102,
    '4040103': random4040103,
    '4040201': random4040201,
    '4040202': random4040202,
    '4040203': random4040203,
    '4050101': random4050101,
    '4050102': random4050102,
    '4050103': random4050103,
    '4050201': random4050201,
    '4050202': random4050202,
    '4050203': random4050203,
    '4060101': random4060101,
    '4060102': random4060102,
    '4060103': random4060103,
    '4060201': random4060201,
    '4060202': random4060202,
    '4060203': random4060203,
    '4070101': random4070101,
    '4070102': random4070102,
    '4070103': random4070103,
    '4070104': random4070104,
    '4070201': random4070201,
    '4070202': random4070202,
    '4070301': random4070301,
    '4070302': random4070302,
    '4070303': random4070303,
    '4070304': random4070304,
    '4070401': random4070401,
    '4070402': random4070402,
    '4080101': random4080101,
    '4090101': random4090101,
    '4090102': random4090102,
    '4090103': random4090103,
    '4090201': random4090201,
    '4090202': random4090202,
    '4090203': random4090203,
    '4100101': random4100101,
    '4100201': random4100201,
    '4100301': random4100301,
    '4100102': random4100102,
    '4100103': random4100103,
    '4100202': random4100202,
    '4100203': random4100203,
    '4100204': random4100204,
    '4100302': random4100302,
    '4140101': random4140101,
    '4140102': random4140102,
    '4140103': random4140103,
    '4140104': random4140104,
    '4140105': random4140105,
    '4140106': random4140106,
    '4140107': random4140107,
    '4140108': random4140108,
    '4140109': random4140109,
    '4140110': random4140110,
    '4150101': random4150,
    '4150102': random4150,
    '4150103': random4150,
    '4150104': random4150,
    '4150105': random4150,
    '4150106': random4150,
    '4150107': random4150,
    '4150108': random4150,
    '4150109': random4150,
    '4150110': random4150,
    '4160101': random4160101,
    '4160201': random4160201,
    '4160301': random4160301,
    '4170101': random4170101,
    '4180101': random4180101,
    '4140111': random4140111
}
