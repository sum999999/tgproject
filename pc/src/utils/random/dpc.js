function random1010102(optballs) {
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
    return randomArr[index].join('')
}
function random1010103(optballs) {
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
    return { len: result.length, ball: balls[index] }
}
function random1010201(optballs) {
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
            //三个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join(',')
}
function random1010202(optballs) {
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
function random1010203(optballs) {
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
    return randomArr[index].join('')
}
function random1010204 (optballs) {
    var randomArr = [];
    var balls = optballs.split("|");
    for (var i = 0,len1 = Math.pow(2, balls.length);i < len1;i++){
        var cur = [];
        for (var j = 0,len2 = balls.length;j < len2;j++){
            if (i >> j&1){
                cur.push(balls[j]);
            }
        }
        if (cur.length == 2){//三个号码
            randomArr.push(cur);
        }
    }
    var index = Math.ceil(Math.random()*(randomArr.length-1));
    var ret = randomArr[index].concat();
    ret.push(randomArr[index][0]);
    return ret.sort().join("");
}
function random1010205 (optballs) {
    var randomArr = [];
    var balls = optballs.split("|");
    for (var i = 0,len1 = Math.pow(2, balls.length);i < len1;i++){
        var cur = [];
        for (var j = 0,len2 = balls.length;j < len2;j++){
            if (i >> j&1){
                cur.push(balls[j]);
            }
        }
        if (cur.length == 3){//三个号码
            randomArr.push(cur);
        }
    }
    var index = Math.ceil(Math.random()*(randomArr.length-1));
    var ret = randomArr[index];
    return ret.sort().join("");
}
function random1020101(optballs) {
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
            //三个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('|')
}
function random1020102(optballs) {
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
function random1020103(optballs) {
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
    return { len: result.length, ball: balls[index] }
}
function random1020201(optballs) {
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
            //三个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join(',')
}
function random1020202(optballs) {
    var randomArr = [];
    var balls = optballs.split('|');
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = [];
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j]);
            }
        }
        if (cur.length === 2) {
            randomArr.push(cur);
        }
    }
    var index = Math.ceil(Math.random() * 9999) % randomArr.length;
    return randomArr[index].join('');
}
function random1020301(optballs) {
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
            //三个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join('|')
}
function random1020302(optballs) {
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
function random1020303(optballs) {
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
    return { len: result.length, ball: balls[index] }
}
function random1020401(optballs) {
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
            //三个号码
            randomArr.push(cur)
        }
    }
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
    var index = Math.ceil(Math.random() * 9999) % randomArr.length
    return randomArr[index].join(',')
}
function random1020402(optballs) {
    var randomArr = [];
    var balls = optballs.split('|');
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = [];
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j]);
            }
        }
        if (cur.length === 2) {
            randomArr.push(cur);
        }
    }
    var index = Math.ceil(Math.random() * 9999) % randomArr.length;
    return randomArr[index].join('');
}
function random1030101(optballs) {
    var rnd = ['', '', '']
    var balls = optballs.split('|')
    // var index = Math.ceil(Math.random() * (balls.length - 1))
    var index = Math.ceil(Math.random() * 9999) % balls.length
    rnd[index % 3] = balls[index] + '' //定位胆，应该是3位中任意选择一个给值
    return rnd.join('|') //返回随机的格式|04|||，表示在5个分组里04是落在第二位，随机一个04号码
}
function random1040101(optballs) {
    var balls = optballs.split('|')
    // var index = Math.ceil(Math.random() * (balls.length - 1))
    var index = Math.ceil(Math.random() * 9999) % balls.length
    return balls[index] + ''
}
module.exports = {
    '1010102': random1010102,
    '1010103': random1010103,
    '1010201': random1010201,
    '1010202': random1010202,
    '1010203': random1010203,
    '1010204': random1010204,
    '1010205': random1010205,
    '1020101': random1020101,
    '1020102': random1020102,
    '1020103': random1020103,
    '1020201': random1020201,
    '1020202': random1020202,
    '1020301': random1020301,
    '1020302': random1020302,
    '1020303': random1020303,
    '1020401': random1020401,
    '1020402': random1020402,
    '1030101': random1030101,
    '1040101': random1040101
}
