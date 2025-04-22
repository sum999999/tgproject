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

function num3010101(betballs) {
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
    // 去掉三个重复的数据
    allResults.forEach(item => {
        let sp = item.split(',')
        if (sp[0] !== sp[1] && sp[0] !== sp[2] && sp[1] !== sp[2])
            results.push(item)
    })
    return results
}
function num3010102(betballs) {
    var results = []
    var num = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11']
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
        if(!results.includes(item)){
            if (sp.length === 3 && some && sp[0] !== sp[2] && sp[1] !== sp[2]) {
                results.push(item)
            }
        }
    })
    return results
}
function num3010201(betballs) {
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
function num3010202(betballs) {
    var results = []
    var num = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11']
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
        if(!results.includes(item)){
            if (sp.length === 3 && some && sp[0] !== sp[2] && sp[1] !== sp[2]) {
                results.push(item)
            }
        }
    })
    return results
}
function num3020101(betballs) {
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
function num3020102(betballs) {
    var results = []
    var num = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11']
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
function num3020201(betballs) {
    results = []
    //构建所有可能性号码组合
    var balls = betballs.split(',')
    if (balls.length < 2) return []
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
    return results
}
function num3020202(betballs) {
    var results = []
    var num = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11']
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
function num3030101(betballs) {
    var ret = [] //init
    var balls = betballs.split(',')
    for (var i = 0, len = balls.length; i < len; i++) {
        if (balls[i] != '') ret.push(balls[i])
    }
    return ret
}
function num3040101(betballs) {
    var ret = [] //init
    var ballgroups = betballs.split('|')
    for (var i = 0, len1 = ballgroups.length; i < len1; i++) {
        var balls = ballgroups[i].split(',')
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if (balls[j] != '') ret.push(balls[j])
        }
    }
    return ret
}
function num3050101(betballs) {
    var ret = [] //init
    var balls = betballs.split(',')
    for (var j = 0, len2 = balls.length; j < len2; j++) {
        if (balls[j] != '') ret.push(balls[j])
    }
    return ret
}
function num3050102(betballs) {
    var results = []
    //构建所有可能性号码组合
    var balls = betballs.split(',')
    if (balls.length < 2) return []
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
    return results
}
function num3050103(betballs) {
    var results = []
    //构建所有可能性号码组合
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
            //3个号码
            results.push(cur)
        }
    }
    return results
}
function num3050104(betballs) {
    var results = []
    //构建所有可能性号码组合
    var balls = betballs.split(',')
    if (balls.length < 4) return []
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 4) {
            //3个号码
            results.push(cur)
        }
    }
    return results
}
function num3050105(betballs) {
    var results = []
    //构建所有可能性号码组合
    var balls = betballs.split(',')
    if (balls.length < 5) return []
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 5) {
            //3个号码
            results.push(cur)
        }
    }
    return results
}
function num3050106(betballs) {
    var results = []
    //构建所有可能性号码组合
    var balls = betballs.split(',')
    if (balls.length < 6) return []
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 6) {
            //3个号码
            results.push(cur)
        }
    }
    return results
}
function num3050107(betballs) {
    var results = []
    //构建所有可能性号码组合
    var balls = betballs.split(',')
    if (balls.length < 7) return []
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 7) {
            //3个号码
            results.push(cur)
        }
    }
    return results
}
function num3050108(betballs) {
    var results = []
    //构建所有可能性号码组合
    var balls = betballs.split(',')
    if (balls.length < 8) return []
    for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
        var cur = []
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if ((i >> j) & 1) {
                cur.push(balls[j])
            }
        }
        if (cur.length == 8) {
            //3个号码
            results.push(cur)
        }
    }
    return results
}
function num3050201(betballs) {
    var results = []
    var num = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11']
    betballs = betballs.split(sdtxSpit)
    betballs.forEach(item => {
        if (
            num.some(vvv => vvv === item) &&
            !results.some(vvv => vvv === item)
        ) {
            if(!results.includes(item)){
                results.push(item)
            }
        }
    })
    return results
}
function num3050202(betballs) {
    var results = []
    var num = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11']
    betballs = betballs.split(sdtxSpit)
    betballs.forEach(item => {
        let sp = item.split(' ')
        let spRepeat = true
        // 去掉num没有匹配到的数据或是重复的数据
        for (var i = 0; i < sp.length; i++) {
            if (!num.some(vvv => vvv === sp[i]) || sp[i] === sp[i + 1]) {
                spRepeat = false
                break
            }
        }
        // 去掉results里已存在的数据
        let resultRepeat = results.some(vvv => vvv === item)
        if (sp.length === 2 && spRepeat && !resultRepeat) {
            results.push(item)
        }
    })
    return results
}

function num3050203(betballs) {
    var results = []
    var num = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11']
    var repeate = []
    betballs = betballs.split(sdtxSpit)
    betballs.forEach(item => {
        let sp = item.split(' ')
        let spRepeat = true
        // 去掉num没有匹配到的数据或是重复的数据
        for (var i = 0; i < sp.length; i++) {
            if (
                !num.some(vvv => vvv === sp[i]) ||
                sp.some((vvv,idx) => idx!==i && vvv===sp[i])
            ) {
                spRepeat = false
                break
            }
            repeate.push(sp[i])
        }
        // 去掉results里已存在的数据
        let resultRepeat = results.some(vvv => vvv === item)
        if (sp.length === 3 && spRepeat && !resultRepeat) {
            results.push(item)
        }
    })
    return results
}
// function num3050203(betballs) { // 2019.6.2 by xiaojiji
//     var results = [];
//     var num = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11"];
//     betballs = betballs.split(sdtxSpit);
//     betballs.forEach(item => {
//       let sp = item.split(" ");
//       let spRepeat = true;
//       // 去掉num没有匹配到的数据或是重复的数据
//       for (var i = 0; i < sp.length; i++) {
//         if (!num.some(vvv => vvv === sp[i]) || sp[i] === sp[i + 1]) {
//           spRepeat = false;
//           break;
//         }
//       }
//       // 去掉results里已存在的数据
//       let resultRepeat = results.some(vvv => vvv === item);
//       if (sp.length === 3 && spRepeat && !resultRepeat) {
//         results.push(item);
//       }
//     });
//     return results;
//   }

function num3050204(betballs) {
    var results = []
    var num = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11']
    var repeate = []
    betballs = betballs.split(sdtxSpit)
    betballs.forEach(item => {
        let sp = item.split(' ')
        let spRepeat = true
        // 去掉num没有匹配到的数据或是重复的数据
        for (var i = 0; i < sp.length; i++) {
            if (
                !num.some(vvv => vvv === sp[i]) ||
                sp.some((vvv,idx) => idx!==i && vvv===sp[i])
            ) {
                spRepeat = false
                break
            }
            repeate.push(sp[i])
        }
        // 去掉results里已存在的数据
        let resultRepeat = results.some(vvv => vvv === item)
        if (sp.length === 4 && spRepeat && !resultRepeat) {
            results.push(item)
        }
    })
    return results
}

// function num3050204(betballs) {
//     var results = [];
//     var num = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11"];
//     betballs = betballs.split(sdtxSpit);
//     betballs.forEach(item => {
//       let sp = item.split(" ");
//       let spRepeat = true;
//       // 去掉num没有匹配到的数据或是重复的数据
//       for (var i = 0; i < sp.length; i++) {
//         if (!num.some(vvv => vvv === sp[i]) || sp[i] === sp[i + 1]) {
//           spRepeat = false;
//           break;
//         }
//       }
//       // 去掉results里已存在的数据
//       let resultRepeat = results.some(vvv => vvv === item);
//       if (sp.length === 4 && spRepeat && !resultRepeat) {
//         results.push(item);
//       }
//     });
//     return results;
// }

function num3050205(betballs) {
    var results = []
    var num = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11']
    var repeate = []
    betballs = betballs.split(sdtxSpit)
    betballs.forEach(item => {
        let sp = item.split(' ')
        let spRepeat = true
        // 去掉num没有匹配到的数据或是重复的数据
        for (var i = 0; i < sp.length; i++) {
            if (
                !num.some(vvv => vvv === sp[i]) ||
                sp.some((vvv,idx) => idx!==i && vvv===sp[i])
            ) {
                spRepeat = false
                break
            }
            repeate.push(sp[i])
        }
        // 去掉results里已存在的数据
        let resultRepeat = results.some(vvv => vvv === item)
        if (sp.length === 5 && spRepeat && !resultRepeat) {
            results.push(item)
        }
    })
    return results
}

// function num3050205(betballs) {
//     var results = [];
//     var num = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11"];
//     betballs = betballs.split(sdtxSpit);
//     betballs.forEach(item => {
//       let sp = item.split(" ");
//       let spRepeat = true;
//       // 去掉num没有匹配到的数据或是重复的数据
//       for (var i = 0; i < sp.length; i++) {
//         if (!num.some(vvv => vvv === sp[i]) || sp[i] === sp[i + 1]) {
//           spRepeat = false;
//           break;
//         }
//       }
//       // 去掉results里已存在的数据
//       let resultRepeat = results.some(vvv => vvv === item);
//       if (sp.length === 5 && spRepeat && !resultRepeat) {
//         results.push(item);
//       }
//     });
//     return results;
//   }

function num3050206(betballs) {
    var results = []
    var num = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11']
    var repeate = []
    betballs = betballs.split(sdtxSpit)
    betballs.forEach(item => {
        let sp = item.split(' ')
        let spRepeat = true
        // 去掉num没有匹配到的数据或是重复的数据
        for (var i = 0; i < sp.length; i++) {
            if (
                !num.some(vvv => vvv === sp[i]) ||
                sp.some((vvv,idx) => idx!==i && vvv===sp[i])
            ) {
                spRepeat = false
                break
            }
            repeate.push(sp[i])
        }
        // 去掉results里已存在的数据
        let resultRepeat = results.some(vvv => vvv === item)
        if (sp.length === 6 && spRepeat && !resultRepeat) {
            results.push(item)
        }
    })
    return results
}
// function num3050206(betballs) {
//     var results = [];
//     var num = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11"];
//     betballs = betballs.split(sdtxSpit);
//     betballs.forEach(item => {
//       let sp = item.split(" ");
//       let spRepeat = true;
//       // 去掉num没有匹配到的数据或是重复的数据
//       for (var i = 0; i < sp.length; i++) {
//         if (!num.some(vvv => vvv === sp[i]) || sp[i] === sp[i + 1]) {
//           spRepeat = false;
//           break;
//         }
//       }
//       // 去掉results里已存在的数据
//       let resultRepeat = results.some(vvv => vvv === item);
//       if (sp.length === 6 && spRepeat && !resultRepeat) {
//         results.push(item);
//       }
//     });
//     return results;
//   }

function num3050207(betballs) {
    var results = []
    var num = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11']
    var repeate = []
    betballs = betballs.split(sdtxSpit)
    betballs.forEach(item => {
        let sp = item.split(' ')
        let spRepeat = true
        // 去掉num没有匹配到的数据或是重复的数据
        for (var i = 0; i < sp.length; i++) {
            if (
                !num.some(vvv => vvv === sp[i]) ||
                sp.some((vvv,idx) => idx!==i && vvv===sp[i])
            ) {
                spRepeat = false
                break
            }
            repeate.push(sp[i])
        }
        // 去掉results里已存在的数据
        let resultRepeat = results.some(vvv => vvv === item)
        if (sp.length === 7 && spRepeat && !resultRepeat) {
            results.push(item)
        }
    })
    return results
}
// function num3050207(betballs) {
//     var results = [];
//     var num = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11"];
//     betballs = betballs.split(sdtxSpit);
//     betballs.forEach(item => {
//       let sp = item.split(" ");
//       let spRepeat = true;
//       // 去掉num没有匹配到的数据或是重复的数据
//       for (var i = 0; i < sp.length; i++) {
//         if (!num.some(vvv => vvv === sp[i]) || sp[i] === sp[i + 1]) {
//           spRepeat = false;
//           break;
//         }
//       }
//       // 去掉results里已存在的数据
//       let resultRepeat = results.some(vvv => vvv === item);
//       if (sp.length === 7 && spRepeat && !resultRepeat) {
//         results.push(item);
//       }
//     });
//     return results;
//   }

function num3050208(betballs) {
    var results = []
    var num = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11']
    var repeate = []
    betballs = betballs.split(',')
    betballs.forEach(item => {
        let sp = item.split(' ')
        let spRepeat = true
        // 去掉num没有匹配到的数据或是重复的数据
        for (var i = 0; i < sp.length; i++) {
            if (
                !num.some(vvv => vvv === sp[i]) ||
                sp.some((vvv,idx) => idx!==i && vvv===sp[i])
            ) {
                spRepeat = false
                break
            }
            repeate.push(sp[i])
        }
        // 去掉results里已存在的数据
        let resultRepeat = results.some(vvv => vvv === item)
        if (sp.length === 8 && spRepeat && !resultRepeat) {
            results.push(item)
        }
    })
    return results
}

// function num3050208(betballs) {
//     var results = [];
//     var num = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11"];
//     betballs = betballs.split(sdtxSpit);
//     betballs.forEach(item => {
//       let sp = item.split(" ");
//       let spRepeat = true;
//       // 去掉num没有匹配到的数据或是重复的数据
//       for (var i = 0; i < sp.length; i++) {
//         if (!num.some(vvv => vvv === sp[i]) || sp[i] === sp[i + 1]) {
//           spRepeat = false;
//           break;
//         }
//       }
//       // 去掉results里已存在的数据
//       let resultRepeat = results.some(vvv => vvv === item);
//       if (sp.length === 8 && spRepeat && !resultRepeat) {
//         results.push(item);
//       }
//     });
//     return results;
//   }

module.exports = {
    '3010101': num3010101,
    '3010102': num3010102,
    '3010201': num3010201,
    '3010202': num3010202,
    '3020101': num3020101,
    '3020102': num3020102,
    '3020201': num3020201,
    '3020202': num3020202,
    '3030101': num3030101,
    '3040101': num3040101,
    '3050101': num3050101,
    '3050102': num3050102,
    '3050103': num3050103,
    '3050104': num3050104,
    '3050105': num3050105,
    '3050106': num3050106,
    '3050107': num3050107,
    '3050108': num3050108,
    '3050201': num3050201,
    '3050202': num3050202,
    '3050203': num3050203,
    '3050204': num3050204,
    '3050205': num3050205,
    '3050206': num3050206,
    '3050207': num3050207,
    '3050208': num3050208
}
