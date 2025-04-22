function random3010101(optballs) {
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
            //三个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1));
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('|')
}
function random3010102(optballs) {
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
            //三个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join(' ') //单式以空格分割
}
function random3010201(optballs) {
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
            //三个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join(',')
}
function random3010202(optballs) {
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
            //三个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join(' ') //单式以空格分割
}
function random3020101(optballs) {
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
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('|')
}
function random3020102(optballs) {
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
    return randomArr[index].join(' ') //单式以空格分割
}
function random3020201(optballs) {
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
function random3020202(optballs) {
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
    return randomArr[index].join(' ') //单式以空格分割
}
function random3030101(optballs) {
    var balls = optballs.split('|')
    // var index = Math.ceil(Math.random() * (balls.length - 1))
    var index = Math.ceil(Math.random() * 9999) % balls.length
    return balls[index] + ''
}
function random3040101(optballs) {
    var rnd = ['', '', '', '', '']
    var balls = optballs.split('|')
    // var index = Math.ceil(Math.random() * (balls.length - 1))
    var index = Math.ceil(Math.random() * 9999) % balls.length
    rnd[index % 5] = balls[index] + ''
    return rnd.join('|') //返回随机的格式|04|||，表示在5个分组里04是落在第二位，随机一个04号码
}
function random3050101(optballs) {
    var balls = optballs.split('|')
    // var index = Math.ceil(Math.random() * (balls.length - 1))
    var index = Math.ceil(Math.random() * 9999) % balls.length
    return balls[index] + ''
}
function random3050102(optballs) {
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
function random3050103(optballs) {
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
function random3050104(optballs) {
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
            //3个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join(',')
}
function random3050105(optballs) {
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
function random3050106(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 6) {
            //5个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join(',')
}
function random3050107(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 7) {
            //7个号码,从中选5个
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join(',')
}
function random3050108(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 8) {
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join(',')
}
function random3050201(optballs) {
    var balls = optballs.split('|')
    // var index = Math.ceil(Math.random() * (balls.length - 1))
    var index = Math.ceil(Math.random() * 9999) % balls.length
    return balls[index] + ''
}
function random3050202(optballs) {
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
    return randomArr[index].join(' ')
}
function random3050203(optballs) {
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
    return randomArr[index].join(' ')
}
function random3050204(optballs) {
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
    return randomArr[index].join(' ')
}
function random3050205(optballs) {
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
    return randomArr[index].join(' ')
}
function random3050206(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 6) {
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join(' ')
}
function random3050207(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 7) {
            //7个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join(' ')
}
function random3050208(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 8) {
            //5个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join(' ')
}
module.exports = {
    '3010101': random3010101,
    '3010102': random3010102,
    '3010201': random3010201,
    '3010202': random3010202,
    '3020101': random3020101,
    '3020102': random3020102,
    '3020201': random3020201,
    '3020202': random3020202,
    '3030101': random3030101,
    '3040101': random3040101,
    '3050101': random3050101,
    '3050102': random3050102,
    '3050103': random3050103,
    '3050104': random3050104,
    '3050105': random3050105,
    '3050106': random3050106,
    '3050107': random3050107,
    '3050108': random3050108,
    '3050201': random3050201,
    '3050202': random3050202,
    '3050203': random3050203,
    '3050204': random3050204,
    '3050205': random3050205,
    '3050206': random3050206,
    '3050207': random3050207,
    '3050208': random3050208
}
