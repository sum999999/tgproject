var sdtxSpit = /[\,\，]/

function num1010102 (betballs) {
    var results = [];
    betballs = betballs.trim();
    betballs = betballs.replace(/^[^\d]*(.*?)[^\d]*$/gm, '$1').replace(/\s*[，|,]+\s*/g, ',').replace(/[\s，|,]+/g, ',')
    betballs = betballs.split(sdtxSpit)
    betballs.forEach(item => {
        let sp = item.split('');
        if (sp.length === 3 && /^[0-9]*$/.test(item) && !results.some(vvv => vvv === item)) {
            results.push(item);
        }
    });
    return results;
}
function num1010103 (betballs) {
    var results = [];
    var bettinggroups = betballs.split(",");
    if (!bettinggroups[0]) return [];
    var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (var k = 0, len3 = bettinggroups.length; k < len3; k++) {
        var bettingValue = Number(bettinggroups[k]);
        for (var i = 0, len1 = seed.length; i < len1; i++) {
            for (var j = 0, len2 = seed.length; j < len2; j++) {
                var dvalue = bettingValue - seed[i] - seed[j];
                if (seed.indexOf(dvalue) > -1) {
                    results.push([seed[i] + "", seed[j] + "", dvalue + ""])
                }
            }
        }
    }
    return results;
}
function num1010201 (betballs) {
    //构建所有可能性号码组合
    var results = [];
    var balls = betballs.split(",");
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = [];
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if (i >> j & 1) {
                cur.push(balls[j]);
            }
        }
        if (cur.length == 2) {//二个号码
            results.push(cur)
        }
    }
    var farr = [];
    //从0-9中任意选择2个或2个以上号码组成两注,且有1个号码重复
    for (var i = 0, len1 = results.length; i < len1; i++) {
        for (var j = 0, len2 = results[i].length; j < len2; j++) {
            var temp = results[i].concat();
            temp.push(results[i][j]);
            farr.push(temp)
        }
    }
    return farr;
}
function num1010202 (betballs) {
    //构建所有可能性号码组合
    var results = [];
    var balls = betballs.split(",");
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = [];
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if (i >> j & 1) {
                cur.push(balls[j]);
            }
        }
        if (cur.length == 3) {//三个号码
            results.push(cur)
        }
    }
    return results;
}
function num1010203 (betballs) {
    var results = [];
    betballs = betballs.split(' ');
    betballs.forEach(item => {
        let sp = item.split('');
        if (sp.length === 3 && /^[0-9]*$/.test(item) && !item.match(/^([0-9])\1\1$/) && !results.some(vvv => vvv === item)) {
            results.push(item);
        }
    });
    return results;
}
function num1010204 (betballs) {
    var results = [];
    var ballgroups = betballs.split(/[\,\，]/);
    //判断是否存在同号情况
    for(var i = 0,length = ballgroups.length; i < length; i++){
        //是二同号，且不是三同号
        if((ballgroups[i].match(/^(\d)\1\d$/) || ballgroups[i].match(/^\d(\d)\1$/)|| ballgroups[i].match(/^(\d)\d\1$/)) && !ballgroups[i].match(/^(\d)\1\1$/)){
            results.push(ballgroups[i].split("").sort().join(""));
        }
    }
    //去重
    var rets = results.filter(function(element, index, results) {
        return results.indexOf(element) == index;
    });
    return rets;
}
function num1010205 (betballs) {
    var results = [];
    var ballgroups = betballs.split(/[\,\，]/);
    //判断是否存在同号情况
    for(var i = 0,length = ballgroups.length; i < length; i++){
        //三个数字，并且不能有同号
        if(/^\d{3}$/.test(ballgroups[i]) && !(ballgroups[i].match(/^(\d)\1\d$/) || ballgroups[i].match(/^\d(\d)\1$/)|| ballgroups[i].match(/^(\d)\d\1$/))){
            results.push(ballgroups[i].split("").sort().join(""));
        }
    }
    //去重
    var rets = results.filter(function(element, index, results) {
        return results.indexOf(element) == index;
    });
    return rets;
}
function num1020101 (betballs) {
    var results = [];
    var result = [];
    var groups = [];
    var ballGroups = betballs.split("|");
    if (ballGroups.some(item => !item)) return results;
    for (var i = 0, len = ballGroups.length; i < len; i++) {
        groups.push(ballGroups[i].split(","));
    }
    doExchange(groups, 0);
    function doExchange (arr, depth) {
        for (var i = 0; i < arr[depth].length; i++) {
            result[depth] = arr[depth][i]
            if (depth != arr.length - 1) {
                doExchange(arr, depth + 1)
            } else {
                results.push(result.join(','))
            }
        }
    }
    return results;
}
function num1020102 (betballs) {
    var results = [];
    betballs = betballs.split(' ');
    betballs.forEach(item => {
        let sp = item.split('');
        if (sp.length === 2 && /^[0-9]*$/.test(item) && !results.some(vvv => vvv === item)) {
            results.push(item);
        }
    });
    return results;
}
function num1020103 (betballs) {
    var results = [];
    var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var bettinggroups = betballs.split(",");
    if (!bettinggroups[0]) return [];
    for (var k = 0, len3 = bettinggroups.length; k < len3; k++) {
        var bettingValue = Number(bettinggroups[k]);
        for (var i = 0, len1 = seed.length; i < len1; i++) {
            var dvalue = bettingValue - seed[i];
            if (seed.indexOf(dvalue) > -1) {
                results.push([seed[i] + "", dvalue + ""])
            }
        }
    }
    return results;
}
function num1020201 (betballs) {
    //构建所有可能性号码组合
    var results = [];
    var balls = betballs.split(",");
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = [];
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if (i >> j & 1) {
                cur.push(balls[j]);
            }
        }
        if (cur.length == 2) {//二个号码
            results.push(cur)
        }
    }
    return results;
}
function num1020202 (betballs) {
    var results = []
    betballs = betballs.split(/[\,\，]/)
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
///
function num1020301 (betballs) {
    var results = [];
    var result = [];
    var groups = [];
    var ballGroups = betballs.split("|");
    if (ballGroups.some(item => !item)) return results;
    for (var i = 0, len = ballGroups.length; i < len; i++) {
        groups.push(ballGroups[i].split(","));
    }
    doExchange(groups, 0);
    function doExchange (arr, depth) {
        for (var i = 0; i < arr[depth].length; i++) {
            result[depth] = arr[depth][i]
            if (depth != arr.length - 1) {
                doExchange(arr, depth + 1)
            } else {
                results.push(result.join(','))
            }
        }
    }
    return results;
}
function num1020302 (betballs) {
    var results = [];
    betballs = betballs.split(' ');
    betballs.forEach(item => {
        let sp = item.split('');
        if (sp.length === 2 && /^[0-9]*$/.test(item) && !results.some(vvv => vvv === item)) {
            results.push(item);
        }
    });
    return results;
}
function num1020303 (betballs) {
    var results = [];
    var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var bettinggroups = betballs.split(",");
    if (!bettinggroups[0]) return [];
    for (var k = 0, len3 = bettinggroups.length; k < len3; k++) {
        var bettingValue = Number(bettinggroups[k]);
        for (var i = 0, len1 = seed.length; i < len1; i++) {
            var dvalue = bettingValue - seed[i];
            if (seed.indexOf(dvalue) > -1) {
                results.push([seed[i] + "", dvalue + ""])
            }
        }
    }
    return results;
}
function num1020401 (betballs) {
    //构建所有可能性号码组合
    var results = [];
    var balls = betballs.split(",");
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = [];
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if (i >> j & 1) {
                cur.push(balls[j]);
            }
        }
        if (cur.length == 2) {//二个号码
            results.push(cur)
        }
    }
    return results;
}
function num1020402 (betballs) {
    var results = [];
    betballs = betballs.split(/[\,\，]/);
    betballs.forEach(item => {
        if (
            item.length === 2 &&
            !item.match(/^([0-9])\1$/) &&
            !results.some(value => value === item)
        ) {
            if(!results.includes(item)){
                results.push(item);
            }
        }
    });
    return results;
}
function num1030101 (betballs) {
    var results = [];
    var ballgroups = betballs.split("|");
    for (var i = 0, len1 = ballgroups.length; i < len1; i++) {
        var balls = ballgroups[i].split(",");
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if (balls[j] == '') continue;
            results.push(balls[j]);
        }
    }
    return results;
}
function num1040101 (betballs) {
    var balls = betballs.split(",");
    if (!balls[0]) return [];
    return balls;
}
module.exports = {
    '1010102': num1010102,
    '1010103': num1010103,
    '1010201': num1010201,
    '1010202': num1010202,
    '1010203': num1010203,
    '1010204': num1010204,
    '1010205': num1010205,
    '1020101': num1020101,
    '1020102': num1020102,
    '1020103': num1020103,
    '1020201': num1020201,
    '1020202': num1020202,
    '1020301': num1020301,
    '1020302': num1020302,
    '1020303': num1020303,
    '1020401': num1020401,
    '1020402': num1020402,
    '1030101': num1030101,
    '1040101': num1040101
}
