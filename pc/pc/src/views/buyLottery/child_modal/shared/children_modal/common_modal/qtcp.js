var sdtxSpit = /[\,\，]/

// function num1010101 (betballs) {
//     var results = [];//清空对象
//     var result = [];
//     //玩法规则
//     var groups = [];
//     var ballGroups = betballs.split("|");
//     if (ballGroups.some(item => !item)) return results;
//     for (var i = 0, len = ballGroups.length; i < len; i++) {
//         groups.push(ballGroups[i].split(","));
//     }
//     doExchange(groups, 0);
//     function doExchange (arr, depth) {
//         for (var i = 0; i < arr[depth].length; i++) {
//             result[depth] = arr[depth][i]
//             if (depth != arr.length - 1) {
//                 doExchange(arr, depth + 1)
//             } else {
//                 results.push(result.join(','))
//             }
//         }
//     }
//     return results;
// }
// function num1010102 (betballs) {
//     var results = [];
//     betballs = betballs.split(' ');
//     betballs.forEach(item => {
//         let sp = item.split('');
//         if (sp.length === 3 && /^[0-9]*$/.test(item) && !results.some(vvv => vvv === item)) {
//             results.push(item);
//         }
//     });
//     return results;
// }
// function num1010103 (betballs) {
//     var results = [];
//     var bettinggroups = betballs.split(",");
//     if (!bettinggroups[0]) return [];
//     var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
//     for (var k = 0, len3 = bettinggroups.length; k < len3; k++) {
//         var bettingValue = Number(bettinggroups[k]);
//         for (var i = 0, len1 = seed.length; i < len1; i++) {
//             for (var j = 0, len2 = seed.length; j < len2; j++) {
//                 var dvalue = bettingValue - seed[i] - seed[j];
//                 if (seed.indexOf(dvalue) > -1) {
//                     results.push([seed[i] + "", seed[j] + "", dvalue + ""])
//                 }
//             }
//         }
//     }
//     return results;
// }
// function num1010201 (betballs) {
//     //构建所有可能性号码组合
//     var results = [];
//     var balls = betballs.split(",");
//     for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
//         var cur = [];
//         for (var j = 0, len2 = balls.length; j < len2; j++) {
//             if (i >> j & 1) {
//                 cur.push(balls[j]);
//             }
//         }
//         if (cur.length == 2) {//二个号码
//             results.push(cur)
//         }
//     }
//     var farr = [];
//     //从0-9中任意选择2个或2个以上号码组成两注,且有1个号码重复
//     for (var i = 0, len1 = results.length; i < len1; i++) {
//         for (var j = 0, len2 = results[i].length; j < len2; j++) {
//             var temp = results[i].concat();
//             temp.push(results[i][j]);
//             farr.push(temp)
//         }
//     }
//     return farr;
// }
// function num1010202 (betballs) {
//     //构建所有可能性号码组合
//     var results = [];
//     var balls = betballs.split(",");
//     for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
//         var cur = [];
//         for (var j = 0, len2 = balls.length; j < len2; j++) {
//             if (i >> j & 1) {
//                 cur.push(balls[j]);
//             }
//         }
//         if (cur.length == 3) {//三个号码
//             results.push(cur)
//         }
//     }
//     return results;
// }
// function num1010203 (betballs) {
//     var results = [];
//     betballs = betballs.split(' ');
//     betballs.forEach(item => {
//         let sp = item.split('');
//         if (sp.length === 3 && /^[0-9]*$/.test(item) && !item.match(/^([0-9])\1\1$/) && !results.some(vvv => vvv === item)) {
//             results.push(item);
//         }
//     });
//     return results;
// }
// function num1020101 (betballs) {
//     var results = [];
//     var result = [];
//     var groups = [];
//     var ballGroups = betballs.split("|");
//     if (ballGroups.some(item => !item)) return results;
//     for (var i = 0, len = ballGroups.length; i < len; i++) {
//         groups.push(ballGroups[i].split(","));
//     }
//     doExchange(groups, 0);
//     function doExchange (arr, depth) {
//         for (var i = 0; i < arr[depth].length; i++) {
//             result[depth] = arr[depth][i]
//             if (depth != arr.length - 1) {
//                 doExchange(arr, depth + 1)
//             } else {
//                 results.push(result.join(','))
//             }
//         }
//     }
//     return results;
// }
// function num1020102 (betballs) {
//     var results = [];
//     betballs = betballs.split(' ');
//     betballs.forEach(item => {
//         let sp = item.split('');
//         if (sp.length === 2 && /^[0-9]*$/.test(item) && !results.some(vvv => vvv === item)) {
//             results.push(item);
//         }
//     });
//     return results;
// }
// function num1020103 (betballs) {
//     var results = [];
//     var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
//     var bettinggroups = betballs.split(",");
//     if (!bettinggroups[0]) return [];
//     for (var k = 0, len3 = bettinggroups.length; k < len3; k++) {
//         var bettingValue = Number(bettinggroups[k]);
//         for (var i = 0, len1 = seed.length; i < len1; i++) {
//             var dvalue = bettingValue - seed[i];
//             if (seed.indexOf(dvalue) > -1) {
//                 results.push([seed[i] + "", dvalue + ""])
//             }
//         }
//     }
//     return results;
// }
// function num1020201 (betballs) {
//     //构建所有可能性号码组合
//     var results = [];
//     var balls = betballs.split(",");
//     for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
//         var cur = [];
//         for (var j = 0, len2 = balls.length; j < len2; j++) {
//             if (i >> j & 1) {
//                 cur.push(balls[j]);
//             }
//         }
//         if (cur.length == 2) {//二个号码
//             results.push(cur)
//         }
//     }
//     return results;
// }
// function num1020202 (betballs) {
//     var results = [];
//     betballs = betballs.split(' ');
//     betballs.forEach(item => {
//         let sp = item.split('');
//         if (sp.length === 2 && /^[0-9]*$/.test(item) && !results.some(vvv => vvv === item)) {
//             results.push(item);
//         }
//     });
//     return results;
// }
// ///
// function num1020301 (betballs) {
//     var results = [];
//     var result = [];
//     var groups = [];
//     var ballGroups = betballs.split("|");
//     if (ballGroups.some(item => !item)) return results;
//     for (var i = 0, len = ballGroups.length; i < len; i++) {
//         groups.push(ballGroups[i].split(","));
//     }
//     doExchange(groups, 0);
//     function doExchange (arr, depth) {
//         for (var i = 0; i < arr[depth].length; i++) {
//             result[depth] = arr[depth][i]
//             if (depth != arr.length - 1) {
//                 doExchange(arr, depth + 1)
//             } else {
//                 results.push(result.join(','))
//             }
//         }
//     }
//     return results;
// }
// function num1020302 (betballs) {
//     var results = [];
//     betballs = betballs.split(' ');
//     betballs.forEach(item => {
//         let sp = item.split('');
//         if (sp.length === 2 && /^[0-9]*$/.test(item) && !results.some(vvv => vvv === item)) {
//             results.push(item);
//         }
//     });
//     return results;
// }
// function num1020303 (betballs) {
//     var results = [];
//     var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
//     var bettinggroups = betballs.split(",");
//     if (!bettinggroups[0]) return [];
//     for (var k = 0, len3 = bettinggroups.length; k < len3; k++) {
//         var bettingValue = Number(bettinggroups[k]);
//         for (var i = 0, len1 = seed.length; i < len1; i++) {
//             var dvalue = bettingValue - seed[i];
//             if (seed.indexOf(dvalue) > -1) {
//                 results.push([seed[i] + "", dvalue + ""])
//             }
//         }
//     }
//     return results;
// }
// function num1020401 (betballs) {
//     //构建所有可能性号码组合
//     var results = [];
//     var balls = betballs.split(",");
//     for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
//         var cur = [];
//         for (var j = 0, len2 = balls.length; j < len2; j++) {
//             if (i >> j & 1) {
//                 cur.push(balls[j]);
//             }
//         }
//         if (cur.length == 2) {//二个号码
//             results.push(cur)
//         }
//     }
//     return results;
// }
// function num1020402 (betballs) {
//     var results = [];
//     betballs = betballs.split(' ');
//     betballs.forEach(item => {
//         let sp = item.split('');
//         if (sp.length === 2 && /^[0-9]*$/.test(item) && !results.some(vvv => vvv === item)) {
//             results.push(item);
//         }
//     });
//     return results;
// }
// function num1030101 (betballs) {
//     var results = [];
//     var ballgroups = betballs.split("|");
//     for (var i = 0, len1 = ballgroups.length; i < len1; i++) {
//         var balls = ballgroups[i].split(",");
//         for (var j = 0, len2 = balls.length; j < len2; j++) {
//             if (balls[j] == '') continue;
//             results.push(balls[j]);
//         }
//     }
//     return results;
// }
// function num1040101 (betballs) {
//     var balls = betballs.split(",");
//     if (!balls[0]) return [];
//     return balls;
// }

// //腾讯分分彩
// function num9010101 (betballs) {
//     //构建所有可能性号码组合
//     function doExchange (arr, depth) {
//         for (var i = 0; i < arr[depth].length; i++) {
//             result[depth] = arr[depth][i]
//             if (depth != arr.length - 1) {
//                 doExchange(arr, depth + 1)
//             } else {
//                 results.push(result.join(','));
//             }
//         }
//     }
//     var results = [];
//     var result = [];
//     var groups = [];
//     var ballGroups = betballs.split("|");
//     if (ballGroups.length != 3) return [];//没有选够3组，返回0注
//     var flag = ballGroups.some(function (it) {
//         return !it;
//     })
//     if (flag) {
//         return [];//里面有空值
//     }
//     for (var i = 0, len = ballGroups.length; i < len; i++) {
//         groups.push(ballGroups[i].split(","));
//     }
//     doExchange(groups, 0);
//     return results
// };
// function num9010102 (betballs) {
//     var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
//     var results = [];
//     var bettinggroups = betballs.split(",");
//     for (var k = 0, len3 = bettinggroups.length; k < len3; k++) {
//         var bettingValue = Number(bettinggroups[k]);
//         for (var i = 0, len1 = seed.length; i < len1; i++) {
//             for (var j = 0, len2 = seed.length; j < len2; j++) {
//                 var dvalue = bettingValue - seed[i] - seed[j];
//                 if (seed.indexOf(dvalue) > -1) {
//                     results.push([seed[i] + "", seed[j] + "", dvalue + ""]);
//                 }
//             }
//         }
//     }
//     return results;
// };
// function num9010103 (betballs) {
//     var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
//     var results = [];
//     var bettinggroups = betballs.split(",");
//     for (var i = 0, len1 = seed.length; i < len1; i++) {
//         for (var j = 0, len2 = seed.length; j < len2; j++) {
//             for (var k = 0, len3 = seed.length; k < len3; k++) {
//                 //var max=(i < j ? (j < k ? k : j) : (i < k ? k : i));
//                 //var min=(i > j ? (j > k ? k : j) : (i > k ? k : i));
//                 var dvalue = seed[(i < j ? (j < k ? k : j) : (i < k ? k : i))]
//                     - seed[(i > j ? (j > k ? k : j) : (i > k ? k : i))];
//                 if (bettinggroups.indexOf(dvalue + "") > -1) {
//                     results.push([seed[i] + "", seed[j] + "", seed[k] + ""]);
//                 }
//             }
//         }
//     }
//     return results;
// }
// function num9020101 (betballs) {
//     //构建所有可能性号码组合
//     function doExchange (arr, depth) {
//         for (var i = 0; i < arr[depth].length; i++) {
//             result[depth] = arr[depth][i]
//             if (depth != arr.length - 1) {
//                 doExchange(arr, depth + 1)
//             } else {
//                 results.push(result.join(','));
//             }
//         }
//     }
//     var results = [];
//     var result = [];
//     var groups = [];
//     var ballGroups = betballs.split("|");
//     if (ballGroups.length != 2) return [];//没有选够2组，返回0注
//     var flag = ballGroups.some(function (it) {
//         return !it;
//     })
//     if (flag) {
//         return [];//里面有空值
//     }
//     for (var i = 0, len = ballGroups.length; i < len; i++) {
//         groups.push(ballGroups[i].split(","));
//     }
//     doExchange(groups, 0);
//     return results;
// };
// function num9020102 (betballs) {
//     var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
//     var results = [];
//     var bettinggroups = betballs.split(",");
//     for (var k = 0, len3 = bettinggroups.length; k < len3; k++) {
//         var bettingValue = Number(bettinggroups[k]);
//         for (var i = 0, len1 = seed.length; i < len1; i++) {
//             var dvalue = bettingValue - seed[i];
//             if (seed.indexOf(dvalue) > -1) {
//                 results.push([seed[i] + "", dvalue + ""]);
//             }
//         }
//     }
//     return results;
// };
// function num9020103 (betballs) {
//     var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
//     var results = [];
//     var bettinggroups = betballs.split(",");
//     for (var i = 0, len1 = seed.length; i < len1; i++) {
//         for (var j = 0, len2 = seed.length; j < len2; j++) {
//             var dvalue = Math.abs(seed[i] - seed[j]);
//             if (bettinggroups.indexOf(dvalue + "") > -1) {
//                 results.push([seed[i] + "", seed[j] + ""]);
//             }
//         }
//     }
//     return results;
// };
// function num9020201 (betballs) {
//     var results = [];
//     //构建所有可能性号码组合
//     var balls = betballs.split(",");
//     for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
//         var cur = [];
//         for (var j = 0, len2 = balls.length; j < len2; j++) {
//             if (i >> j & 1) {
//                 cur.push(balls[j]);
//             }
//         }
//         if (cur.length == 2) {//2个号码
//             results.push(cur);
//         }
//     }
//     return results;
// };
// function num9020202 (betballs) {
//     var seedJson = { "1": 1, "2": 1, "3": 2, "4": 2, "5": 3, "6": 3, "7": 4, "8": 4, "9": 5, "10": 4, "11": 4, "12": 3, "13": 3, "14": 2, "15": 2, "16": 1, "17": 1 };
//     var bettinggroups = betballs.split(",");
//     return bettinggroups;
// };
// function num9020203 (betballs) {
//     var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
//     var results = [];
//     var bettinggroups = betballs.split(",");
//     return bettinggroups;
// };
// function num9030101 (betballs) {
//     var balls = betballs.split(",");
//     return balls;
// };
// function num9030102 (betballs) {
//     var results = [];
//     var balls = betballs.split(",");
//     for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
//         var cur = [];
//         for (var j = 0, len2 = balls.length; j < len2; j++) {
//             if (i >> j & 1) {
//                 cur.push(balls[j]);
//             }
//         }
//         if (cur.length == 2) {//2个号码
//             results.push(cur);
//         }
//     }
//     return results;
// };
// function num9040101 (betballs) {
//     //构建所有可能性号码组合
//     function doExchange (arr, depth) {
//         for (var i = 0; i < arr[depth].length; i++) {
//             result[depth] = arr[depth][i]
//             if (depth != arr.length - 1) {
//                 doExchange(arr, depth + 1)
//             } else {
//                 results.push(result.join(','));
//             }
//         }
//     }
//     var results = [];
//     var result = [];
//     var groups = [];
//     var ballGroups = betballs.split("|");
//     if (ballGroups.length != 3) return [];//没有选够3组，返回0注
//     var flag = ballGroups.some(function (it) {
//         return !it;
//     })
//     if (flag) {
//         return [];//里面有空值
//     }
//     for (var i = 0, len = ballGroups.length; i < len; i++) {
//         groups.push(ballGroups[i].split(","));
//     }
//     doExchange(groups, 0);
//     return results;
// };
// function num9040102 (betballs) {
//     //构建所有可能性号码组合
//     function doExchange (arr, depth) {
//         for (var i = 0; i < arr[depth].length; i++) {
//             result[depth] = arr[depth][i]
//             if (depth != arr.length - 1) {
//                 doExchange(arr, depth + 1)
//             } else {
//                 results.push(result.join(','));
//             }
//         }
//     }
//     var results = [];
//     var result = [];
//     var groups = [];
//     var ballGroups = betballs.split("|");
//     if (ballGroups.length != 2) return [];//没有选够2组，返回0注
//     var flag = ballGroups.some(function (it) {
//         return !it;
//     })
//     if (flag) {
//         return [];//里面有空值
//     }
//     for (var i = 0, len = ballGroups.length; i < len; i++) {
//         groups.push(ballGroups[i].split(","));
//     }
//     doExchange(groups, 0);
//     return results;
// };
// module.exports = {
//     '1010101': num1010101,
//     '1010102': num1010102,
//     '1010103': num1010103,
//     '1010201': num1010201,
//     '1010202': num1010202,
//     '1010203': num1010203,
//     '1020101': num1020101,
//     '1020102': num1020102,
//     '1020103': num1020103,
//     '1020201': num1020201,
//     '1020202': num1020202,
//     '1020301': num1020301,
//     '1020302': num1020302,
//     '1020303': num1020303,
//     '1020401': num1020401,
//     '1020402': num1020402,
//     '1030101': num1030101,
//     '1040101': num1040101,
//     '9010101': num9010101,
//     '9010102': num9010102,
//     '9010103': num9010103,
//     '9020101': num9020101,
//     '9020102': num9020102,
//     '9020103': num9020103,
//     '9020201': num9020201,
//     '9020202': num9020202,
//     '9020203': num9020203,
//     '9030101': num9030101,
//     '9030102': num9030102,
//     '9040101': num9040101,
//     '9040102': num9040102
// }

/**
 * 上方为之前pc计算公式，测试说不对，使用下方从移动端拿来的计算公式
 */
function num9010101(betballs) {
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
    if (ballGroups.length != 3) return 0 //没有选够3组，返回0注
    var flag = ballGroups.some(function(it) {
        return !it
    })
    if (flag) {
        return [] //里面有空值
    }
    for (var i = 0, len = ballGroups.length; i < len; i++) {
        groups.push(ballGroups[i].split(','))
    }
    doExchange(groups, 0)
    return results
}

function num9010102(betballs) {
    var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    var results = []
    var bettinggroups = betballs.split(',')
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

function num9010103(betballs) {
    var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    var results = []
    var bettinggroups = betballs.split(',')
    for (var i = 0, len1 = seed.length; i < len1; i++) {
        for (var j = 0, len2 = seed.length; j < len2; j++) {
            for (var k = 0, len3 = seed.length; k < len3; k++) {
                //var max=(i < j ? (j < k ? k : j) : (i < k ? k : i));
                //var min=(i > j ? (j > k ? k : j) : (i > k ? k : i));
                var dvalue =
                    seed[i < j ? (j < k ? k : j) : i < k ? k : i] -
                    seed[i > j ? (j > k ? k : j) : i > k ? k : i]
                if (bettinggroups.indexOf(dvalue + '') > -1) {
                    results.push([seed[i] + '', seed[j] + '', seed[k] + ''])
                }
            }
        }
    }
    return results
}
function num9010104 (betballs) {
    var results = []
    betballs = betballs.trim();
    betballs = betballs.replace(/^[^\d]*(.*?)[^\d]*$/gm, '$1').replace(/\s*[，|,]+\s*/g, ',').replace(/[\s，|,]+/g, ',')
    betballs = betballs.split(/[\,\，]/)
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
function num9020101(betballs) {
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
    if (ballGroups.length != 2) return 0 //没有选够2组，返回0注
    var flag = ballGroups.some(function(it) {
        return !it
    })
    if (flag) {
        return [] //里面有空值
    }
    for (var i = 0, len = ballGroups.length; i < len; i++) {
        groups.push(ballGroups[i].split(','))
    }
    doExchange(groups, 0)
    return results
}

function num9020102(betballs) {
    if (!betballs) return []
    var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    var results = []
    var bettinggroups = betballs.split(',')
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

function num9020103(betballs) {
    if (!betballs) return []
    var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    var results = []
    var bettinggroups = betballs.split(',')
    for (var i = 0, len1 = seed.length; i < len1; i++) {
        for (var j = 0, len2 = seed.length; j < len2; j++) {
            var dvalue = Math.abs(seed[i] - seed[j])
            if (bettinggroups.indexOf(dvalue + '') > -1) {
                results.push([seed[i] + '', seed[j] + ''])
            }
        }
    }
    return results
}

function num9020201(betballs) {
    if (!betballs) return []
    var results = []
    //构建所有可能性号码组合
    var balls = betballs.split(',')
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

function num9020202(betballs) {
    if (!betballs) return []
    var seedJson = {
        '1': 1,
        '2': 1,
        '3': 2,
        '4': 2,
        '5': 3,
        '6': 3,
        '7': 4,
        '8': 4,
        '9': 5,
        '10': 4,
        '11': 4,
        '12': 3,
        '13': 3,
        '14': 2,
        '15': 2,
        '16': 1,
        '17': 1
    }
    var bettinggroups = betballs.split(',')
    var total = 0
    for (var k = 0, len3 = bettinggroups.length; k < len3; k++) {
        total += seedJson[bettinggroups[k]]
    }
    return {
        len: total
    }
}

function num9020203(betballs) {
    if (!betballs) return []
    var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    var results = []
    var bettinggroups = betballs.split(',')

    return {
        len: bettinggroups.length * 9
    }
}

function num9030101(betballs) {
    if (!betballs) return []
    var balls = betballs.split(',')
    return balls
}

function num9030102(betballs) {
    if (!betballs) return []
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
            //2个号码
            results.push(cur)
        }
    }
    return results
}

function num9040101(betballs) {
    //构建所有可能性号码组合
    if (!betballs) return []

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
    if (ballGroups.length != 3) return 0 //没有选够3组，返回0注
    var flag = ballGroups.some(function(it) {
        return !it
    })
    if (flag) {
        return [] //里面有空值
    }
    for (var i = 0, len = ballGroups.length; i < len; i++) {
        groups.push(ballGroups[i].split(','))
    }
    doExchange(groups, 0)
    return results
}

function num9040102(betballs) {
    if (!betballs) return []
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
    if (ballGroups.length != 2) return 0 //没有选够2组，返回0注
    var flag = ballGroups.some(function(it) {
        return !it
    })
    if (flag) {
        return [] //里面有空值
    }
    for (var i = 0, len = ballGroups.length; i < len; i++) {
        groups.push(ballGroups[i].split(','))
    }
    doExchange(groups, 0)
    return results
}

function num9050101(betballs) {
    var ret = [];
	var ballgroups = betballs.split("|");
	for(var i = 0,len1 = ballgroups.length; i < len1; i++){
		var balls = ballgroups[i].split(",");
		for(var j = 0,len2 = balls.length; j < len2; j++){
			if(balls[j] != "")ret.push(balls[j]);
		}
	}
	return ret;
}

function num1010101(betballs) {
    if (!betballs) return []
    var results = [] //清空对象
    var result = []
    //玩法规则
    var groups = []
    var ballGroups = betballs.split('|')
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
                results.push(result.join(','))
            }
        }
    }
    return results
}

function num1010102(betballs) {
    var results = []
    betballs = betballs.trim();
    betballs = betballs.replace(/^[^\d]*(.*?)[^\d]*$/gm, '$1').replace(/\s*[，|,]+\s*/g, ',').replace(/[\s，|,]+/g, ',')
    betballs = betballs.split(sdtxSpit)
    betballs.forEach(item => {
        let sp = item.split('')
        if (
            sp.length === 3 &&
            /^[0-9]*$/.test(item) &&
            !results.some(vvv => vvv === item)
        ) {
            results.push(item)
        }
    })
    return results
}

function num1010103(betballs) {
    var results = []
    var bettinggroups = betballs.split(',')
    if (!bettinggroups[0]) return []
    var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
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

function num1010201(betballs) {
    //构建所有可能性号码组合
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
    var farr = []
    //从0-9中任意选择2个或2个以上号码组成两注,且有1个号码重复
    for (var i = 0, len1 = results.length; i < len1; i++) {
        for (var j = 0, len2 = results[i].length; j < len2; j++) {
            var temp = results[i].concat()
            temp.push(results[i][j])
            farr.push(temp)
        }
    }
    return farr
}

function num1010202(betballs) {
    //构建所有可能性号码组合
    var results = []
    var balls = betballs.split(',')
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

function num1010203(betballs) {
    var results = []
    betballs = betballs.split(' ')
    betballs.forEach(item => {
        let sp = item.split('')
        if (
            sp.length === 3 &&
            /^[0-9]*$/.test(item) &&
            !item.match(/^([0-9])\1\1$/) &&
            !results.some(vvv => vvv === item)
        ) {
            results.push(item)
        }
    })
    return results
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
function num1020101(betballs) {
    var results = []
    var result = []
    var groups = []
    var ballGroups = betballs.split('|')
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
                results.push(result.join(','))
            }
        }
    }
    return results
}

function num1020102(betballs) {
    var results = []
    betballs = betballs.split(' ')
    betballs.forEach(item => {
        let sp = item.split('')
        if (
            sp.length === 2 &&
            /^[0-9]*$/.test(item) &&
            !results.some(vvv => vvv === item)
        ) {
            results.push(item)
        }
    })
    return results
}

function num1020103(betballs) {
    var results = []
    var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
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

function num1020201(betballs) {
    //构建所有可能性号码组合
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
    return results
}

function num1020202(betballs) {
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
function num1020301(betballs) {
    var results = []
    var result = []
    var groups = []
    var ballGroups = betballs.split('|')
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
                results.push(result.join(','))
            }
        }
    }
    return results
}

function num1020302(betballs) {
    var results = []
    betballs = betballs.split(' ')
    betballs.forEach(item => {
        let sp = item.split('')
        if (
            sp.length === 2 &&
            /^[0-9]*$/.test(item) &&
            !results.some(vvv => vvv === item)
        ) {
            results.push(item)
        }
    })
    return results
}

function num1020303(betballs) {
    var results = []
    var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
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

function num1020401(betballs) {
    //构建所有可能性号码组合
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
    return results
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

function num1030101(betballs) {
    var results = []
    var ballgroups = betballs.split('|')
    for (var i = 0, len1 = ballgroups.length; i < len1; i++) {
        var balls = ballgroups[i].split(',')
        for (var j = 0, len2 = balls.length; j < len2; j++) {
            if (balls[j] == '') continue
            results.push(balls[j])
        }
    }
    return results
}

function num1040101(betballs) {
    var balls = betballs.split(',')
    if (!balls[0]) return []
    return balls
}


function num9010201 (betballs){
	//构建所有可能性号码组合
	var results = [];
	var balls = betballs.split(",");
	for (var i = 0,len1 = Math.pow(2, balls.length);i < len1;i++){
		var cur = [];
		for (var j = 0,len2 = balls.length;j < len2;j++){
			if (i >> j&1){
				cur.push(balls[j]);
			}
		}
		if (cur.length == 2){//二个号码
			results.push(cur)
		}
    }
    // return results;
	// console.log(results);
	var fresult = [];
	for(var i = 0,len1 = results.length; i < len1; i++){
		fresult.push([results[i][0],results[i][0],results[i][1]]);
		fresult.push([results[i][0],results[i][1],results[i][1]]);
	}
	return fresult;
}



function num9010202(betballs){
	var results = [];
	var balls = betballs.split(",");
	if(balls.length < 3)return [];
	for (var i = 0,len1 = Math.pow(2, balls.length);i < len1;i++){
		var cur = [];
		for (var j = 0,len2 = balls.length;j < len2;j++){
			if (i >> j&1){
				cur.push(balls[j]);
			}
		}
		if (cur.length == 3){//三个号码
			results.push(cur)
		}
    }
    return  results;
	// return results.length;
}

function num9060101(betballs){
    //构建所有可能性号码组合
    function doExchange(arr, depth)
    {
        for (var i = 0; i < arr[depth].length; i++) {
            result[depth] = arr[depth][i]
            if (depth != arr.length - 1) {
                doExchange(arr, depth + 1)
            } else {
                results.push(result.join(','));
            }
        }
    }
    var results = [];
    var result = [];
    var groups = [];
    var ballGroups = betballs.split("|");
    if (ballGroups.length !== 3) return 0;//没有选够3组，返回0注
    var flag=ballGroups.some(function(it){
        return !it;
    })
    if(flag){
        return 0;//里面有空值
    }
    for(var i = 0,len = ballGroups.length; i < len; i++){
        groups.push(ballGroups[i].split(","));
    }
    doExchange(groups,0);
    return results;
}

function num9060102(betballs) {
    var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var results = [];
    if (!betballs) {
        return results;
    }
    var bettinggroups = betballs.split(",");
    for (var k = 0, len3 = bettinggroups.length; k < len3; k++) {
        var bettingValue = Number(bettinggroups[k]);
        for (var i = 0, len1 = seed.length; i < len1; i++) {
            for (var j = 0, len2 = seed.length; j < len2; j++) {
                var dvalue = bettingValue - seed[i] - seed[j];
                if (seed.indexOf(dvalue) > -1) {
                    results.push([seed[i] + "", seed[j] + "", dvalue + ""]);
                }
            }
        }
    }
    return results;
}

function num9060103(betballs){
    var seed = [0,1,2,3,4,5,6,7,8,9];
    var results = [];
    var bettinggroups = betballs.split(",");
    for(var i = 0,len1 = seed.length; i < len1; i++){
        for(var j = 0,len2 = seed.length; j < len2; j++){
            for(var k = 0,len3 = seed.length; k < len3; k++){
                //var max=(i < j ? (j < k ? k : j) : (i < k ? k : i));
                //var min=(i > j ? (j > k ? k : j) : (i > k ? k : i));
                var dvalue=seed[(i < j ? (j < k ? k : j) : (i < k ? k : i))]
                    -seed[(i > j ? (j > k ? k : j) : (i > k ? k : i))];
                if(bettinggroups.indexOf(dvalue+"") > -1){
                    results.push([seed[i]+"",seed[j]+"",seed[k]+""]);
                }
            }
        }
    }
    return results;
}
function num9060104 (betballs) {
    var results = []
    betballs = betballs.trim();
    betballs = betballs.replace(/^[^\d]*(.*?)[^\d]*$/gm, '$1').replace(/\s*[，|,]+\s*/g, ',').replace(/[\s，|,]+/g, ',')
    betballs = betballs.split(/[,，]/g)
    betballs = betballs.map(item => item.trim())
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
function num9060201(betballs){
    //构建所有可能性号码组合
    var results = [];
    var balls = betballs.split(",");
    for (var i = 0,len1 = Math.pow(2, balls.length);i < len1;i++){
        var cur = [];
        for (var j = 0,len2 = balls.length;j < len2;j++){
            if (i >> j&1){
                cur.push(balls[j]);
            }
        }
        if (cur.length == 2){//二个号码
            results.push(cur)
        }
    }
    // console.log(results);
    var fresult = [];
    for(var i = 0,len1 = results.length; i < len1; i++){
        fresult.push([results[i][0],results[i][0],results[i][1]]);
        fresult.push([results[i][0],results[i][1],results[i][1]]);
    }
    return fresult;
}

function num9060202(betballs){
    var results = [];
    var balls = betballs.split(",");
    if(balls.length < 3)return 0;
    for (var i = 0,len1 = Math.pow(2, balls.length);i < len1;i++){
        var cur = [];
        for (var j = 0,len2 = balls.length;j < len2;j++){
            if (i >> j&1){
                cur.push(balls[j]);
            }
        }
        if (cur.length == 3){//三个号码
            results.push(cur)
        }
    }
    return results;
}

function num9070101(betballs){
    //构建所有可能性号码组合
    function doExchange(arr, depth)
    {
        for (var i = 0; i < arr[depth].length; i++) {
            result[depth] = arr[depth][i]
            if (depth !== arr.length - 1) {
                doExchange(arr, depth + 1)
            } else {
                results.push(result.join(','));
            }
        }
    }
    var results = [];
    var result = [];
    var groups = [];
    var ballGroups = betballs.split("|");
    if (ballGroups.length !== 2) return 0;//没有选够2组，返回0注
    var flag=ballGroups.some(function(it){
        return !it;
    })
    if(flag){
        return 0;//里面有空值
    }
    for(var i = 0,len = ballGroups.length; i < len; i++){
        groups.push(ballGroups[i].split(","));
    }
    doExchange(groups,0);
    return results;
}

function num9070102(betballs) {
    var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var results = [];
    if (!betballs) {
        return results;
    }
    var bettinggroups = betballs.split(",");
    for (var k = 0, len3 = bettinggroups.length; k < len3; k++) {
        var bettingValue = Number(bettinggroups[k]);
        for (var i = 0, len1 = seed.length; i < len1; i++) {
            var dvalue = bettingValue - seed[i];
            if (seed.indexOf(dvalue) > -1) {
                results.push([seed[i] + "", dvalue + ""]);
            }
        }
    }
    return results;
}

function num9070103(betballs){
    var seed = [0,1,2,3,4,5,6,7,8,9];
    var results = [];
    var bettinggroups = betballs.split(",");
    for(var i = 0,len1 = seed.length; i < len1; i++){
        for(var j = 0,len2 = seed.length; j < len2; j++){
            var dvalue=Math.abs(seed[i]-seed[j]);
            if(bettinggroups.indexOf(dvalue+"") > -1){
                results.push([seed[i]+"",seed[j]+""]);
            }
        }
    }
    return results;
}

function num9070201(betballs){
    var results = [];
    //构建所有可能性号码组合
    var balls = betballs.split(",");
    for (var i = 0,len1 = Math.pow(2, balls.length);i < len1;i++){
        var cur = [];
        for (var j = 0,len2 = balls.length;j < len2;j++){
            if (i >> j&1){
                cur.push(balls[j]);
            }
        }
        if (cur.length === 2){//2个号码
            results.push(cur);
        }
    }
    return results;
}

function num9070202(betballs){
    var seed = [0,1,2,3,4,5,6,7,8,9];
    var resultSet=[];
    var bettinggroups = betballs.split(",");
    for(var k = 0,len3 = bettinggroups.length; k < len3; k++){
        var bettingValue = Number(bettinggroups[k]);
        for(var i = 0,len1 = seed.length; i < len1; i++){
            for(var j = 0,len1 = seed.length; j < len1; j++){
                if(i==j){//对子号 不属于范围
                    continue;
                }
                if(bettingValue==(seed[i]+seed[j])){
                    var retSet=[seed[i]+"",seed[j]+""];
                    retSet.sort();
                    resultSet.push(retSet.join());
                }
            }
        }
    }
    return resultSet;
}

function num9070203(betballs) {
    var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var results = [];
    if (!betballs) {
        return results;
    }
    var bettinggroups = betballs.split(",");
    return {
        len: bettinggroups.length * 9
    };
}

function num9080101(betballs){
    //构建所有可能性号码组合
    function doExchange(arr, depth)
    {
        for (var i = 0; i < arr[depth].length; i++) {
            result[depth] = arr[depth][i]
            if (depth != arr.length - 1) {
                doExchange(arr, depth + 1)
            } else {
                origin.push(result.join(','))
            }
        }
    }
    var origin = [];
    var result = [];
    var groups = [];
    var ballGroups = betballs.split("|");
    if (ballGroups.length != 2) return 0;//没有选够2组，返回0注
    for(var i = 0,len = ballGroups.length; i < len; i++){
        groups.push(ballGroups[i].split(","));
    }
    doExchange(groups,0);
    //四重号，1单号
    var betgroups = [];
    for(var i = 0,len = origin.length; i < len; i++){
        var balls = origin[i].split(",");
        betgroups.push([balls[0],balls[0],balls[0],balls[0],balls[1]]);
    }
    // console.log(results.length, results.join(','));
    //记录重复号码
    var repeat = [];
    for(var i = 0,len = betgroups.length; i < len; i++){
        var str = (betgroups[i]+"");
        var balls = betgroups[i];
        for(var j = 0,length = balls.length; j < length; j++){
            var regret = str.match(new RegExp(balls[j],"g"));
            if (regret && (regret.length > 4)){
                repeat.push(i);
            }
        }
    }
    //号码不能重复,在此复制新数组
    var norepeat = [];
    var results = [];
    for(var i = 0,len = origin.length; i < len; i++){
        if(repeat.indexOf(i) < 0){
            norepeat.push(origin[i]);
            results.push(betgroups[i]);
        }
    }
    return norepeat;
}

function num9080102(betballs){
    var ballgroups = betballs.split("|");
    //构建所有可能性号码组合
    function doExchange(arr, depth)
    {
        for (var i = 0; i < arr[depth].length; i++) {
            result[depth] = arr[depth][i]
            if (depth != arr.length - 1) {
                doExchange(arr, depth + 1)
            } else {
                origin.push(result.join(','))
            }
        }
    }
    var origin = [];
    var result = [];
    var groups = [];
    var ballGroups = betballs.split("|");
    if (ballGroups.length != 2) return 0;//没有选够2组，返回0注
    for(var i = 0,len = ballGroups.length; i < len; i++){
        groups.push(ballGroups[i].split(","));
    }
    doExchange(groups,0);
    //三重号，2重号
    var betgroups = [];
    for(var i = 0,len = origin.length; i < len; i++){
        var balls = origin[i].split(",");
        betgroups.push([balls[0],balls[0],balls[0],balls[1],balls[1]]);
    }
    // console.log(results.length, results.join(','));
    //记录重复号码
    var repeat = [];
    for(var i = 0,len = betgroups.length; i < len; i++){
        var str = (betgroups[i]+"");
        var balls = betgroups[i];
        for(var j = 0,length = balls.length; j < length; j++){
            var regret = str.match(new RegExp(balls[j],"g"));
            if (regret && (regret.length > 4)){
                repeat.push(i);
            }
        }
    }
    //号码不能重复,在此复制新数组
    var norepeat = [];
    var results = [];
    for(var i = 0,len = origin.length; i < len; i++){
        if(repeat.indexOf(i) < 0){
            norepeat.push(origin[i]);
            results.push(betgroups[i]);
        }
    }
    return norepeat;
}

function num9080103(betballs){
    var ballgroups = betballs.split("|");
    if (ballgroups.length != 2) return 0;//没有选够2组，返回0注
    var results = [];
    var balls = ballgroups[0].split(",");
    for (var i = 0,len1 = Math.pow(2, balls.length);i < len1;i++){
        var cur = [];
        for (var j = 0,len2 = balls.length;j < len2;j++){
            if (i >> j&1){
                cur.push(balls[j],balls[j],balls[j]);
            }
        }
        if (cur.length == 3){//3个号码重号
            results.push(cur);
        }
    }
    // console.log(results);
    var sresults = [];
    var balls = ballgroups[1].split(",");
    for (var i = 0,len1 = Math.pow(2, balls.length);i < len1;i++){
        var cur = [];
        for (var j = 0,len2 = balls.length;j < len2;j++){
            if (i >> j&1){
                cur.push(balls[j]);
            }
        }
        if (cur.length == 2){//2个号码
            sresults.push(cur);
        }
    }
    // console.log(sresults);
    //组合所有号码可能性
    var fresult = [];//组合结果集
    balls = ballgroups[1].split(",");
    for(var i = 0,len1 = results.length; i < len1; i++) {
        for(var j = 0,len2 = sresults.length; j < len2; j++) {
            var temp = results[i].concat();//copy
            temp = temp.concat(sresults[j]);
            fresult.push(temp);
        }
    }
    // console.log(fresult);
    //记录重复号码
    var repeat = [];
    for(var i = 0,len = fresult.length; i < len; i++){
        var str = (fresult[i]+"");
        var balls = str.split(",");
        for(var j = 0,length = balls.length; j < length; j++){
            var regret = str.match(new RegExp(balls[j],"g"));
            if (regret && (regret.length > 3)){
                repeat.push(i);
            }
        }
    }
    // console.log(repeat);
    //号码不能重复,在此复制新数组
    var norepeat = [];
    for(var i = 0,len = fresult.length; i < len; i++){
        if(repeat.indexOf(i) < 0){
            norepeat.push(fresult[i]);
        }
    }
    return norepeat;
}

function num9080104(betballs){
    var results = [];
    var ballgroups = betballs.split("|");
    if (ballgroups.length != 2) return 0;//没有选够2组，返回0注
    var results = [];
    var balls = ballgroups[0].split(",");
    for (var i = 0,len1 = Math.pow(2, balls.length);i < len1;i++){
        var cur = [];
        for (var j = 0,len2 = balls.length;j < len2;j++){
            if (i >> j&1){
                cur.push(balls[j],balls[j]);
            }
        }
        if (cur.length == 4){//2个号码重号
            results.push(cur);
        }
    }
    // console.log(results);
    var fresult = [];//组合结果集
    balls = ballgroups[1].split(",");
    for(var i = 0,len1 = results.length; i < len1; i++) {
        for(var j = 0,len2 = balls.length; j < len2; j++) {
            var temp = results[i].concat();//copy
            temp.push(balls[j]);
            fresult.push(temp);
        }
    }
    // console.log(fresult);
    //记录重复号码
    var repeat = [];
    for(var i = 0,len = fresult.length; i < len; i++){
        var str = (fresult[i]+"");
        var balls = str.split(",");
        for(var j = 0,length = balls.length; j < length; j++){
            var regret = str.match(new RegExp(balls[j],"g"));
            if (regret && (regret.length > 2)){
                repeat.push(i);
            }
        }
    }
    // console.log(repeat);
    //号码不能重复,在此复制新数组
    var norepeat = [];
    for(var i = 0,len = fresult.length; i < len; i++){
        if(repeat.indexOf(i) < 0){
            norepeat.push(fresult[i]);
        }
    }
    return norepeat;
}

function num9080105(betballs){
    var results = [];
    var result = [];
    function doExchange(arr, depth)
    {
        for (var i = 0; i < arr[depth].length; i++) {
            result[depth] = arr[depth][i]
            if (depth != arr.length - 1) {
                doExchange(arr, depth + 1)
            } else {
                results.push(result.join(','))
            }
        }
    }

    var groups = [];
    var ballGroups = betballs.split("|");
    if (ballGroups.length != 2) return 0;//没有选够2组，返回0注
    //构建单号可能性号码组合
    var sresult = [];
    var group = ballGroups[1].split(",");
    for (var i = 0,len1 = Math.pow(2, group.length);i < len1;i++){
        var cur = [];
        for (var j = 0,len2 = group.length;j < len2;j++){
            if (i >> j&1){
                cur.push(group[j]);
            }
        }
        if (cur.length == 3){//二个号码
            sresult.push(cur)
        }
    }
    //第一个分组号码要求重号
    var temp = [];
    var balls = ballGroups[0].split(",");
    for(var j = 0,len2 = balls.length; j < len2; j++){
        temp.push(balls[j]+","+balls[j]);
    }
    groups.push(temp);
    groups.push(sresult);
    doExchange(groups,0);
    // console.log(results);
    //记录重复号码
    var repeat = [];
    for(var i = 0,len = results.length; i < len; i++){
        var str = (results[i]+"");
        var balls = str.split(",");
        for(var j = 0,length = balls.length; j < length; j++){
            var regret = str.match(new RegExp(balls[j],"g"));
            if (regret && (regret.length > 2)){
                repeat.push(i);
            }
        }
    }
    // console.log(repeat);
    //号码不能重复,在此复制新数组
    var norepeat = [];
    for(var i = 0,len = results.length; i < len; i++){
        if(repeat.indexOf(i) < 0){
            norepeat.push(results[i]);
        }
    }
    return norepeat;
}

function num9080106(betballs){
    var results = [];
    var balls = betballs.split(",");
    for (var i = 0,len1 = Math.pow(2, balls.length);i < len1;i++){
        var cur = [];
        for (var j = 0,len2 = balls.length;j < len2;j++){
            if (i >> j&1){
                cur.push(balls[j]);
            }
        }
        if (cur.length == 5){//5个号码
            results.push(cur)
        }
    }
    return results;
}

function num9080201(betballs) {
    if (!betballs) {
        return [];
    }
    var balls = betballs.split(",");
    return balls; //选几个算几注
}

function num9080202(betballs){
    var results = [];
    var balls = betballs.split(",");
    if(balls.length < 2)return 0;
    for (var i = 0,len1 = Math.pow(2, balls.length);i < len1;i++){
        var cur = [];
        for (var j = 0,len2 = balls.length;j < len2;j++){
            if (i >> j&1){
                cur.push(balls[j]);
            }
        }
        if (cur.length == 2){//二个号码
            results.push(cur)
        }
    }
    return results;
}

function num9080203(betballs){
    var results = [];
    var balls = betballs.split(",");
    if(balls.length < 3)return 0;
    for (var i = 0,len1 = Math.pow(2, balls.length);i < len1;i++){
        var cur = [];
        for (var j = 0,len2 = balls.length;j < len2;j++){
            if (i >> j&1){
                cur.push(balls[j]);
            }
        }
        if (cur.length == 3){//三个号码
            results.push(cur)
        }
    }
    return results;
}

function num9080301(betballs){
    var results = [];
    var result = [];
    var norepeat = [];
    function doExchange(arr, depth)
    {
        for (var i = 0; i < arr[depth].length; i++) {
            result[depth] = arr[depth][i]
            if (depth != arr.length - 1) {
                doExchange(arr, depth + 1)
            } else {
                results.push(result.join(','))
            }
        }
    }

    //玩法规则
    var groups = [];
    var ballGroups = betballs.split("|");
    for(var i = 0,len = ballGroups.length; i < len; i++){
        if(ballGroups[i] == '' || ballGroups[i].length == 0)continue;
        groups.push(ballGroups[i].split(","));
    }
    if(groups.length < 5)return 0;//选号组别不够
    doExchange(groups,0);

    return results;
}

function num9080302(betballs, optballs = '0,1,2,3,4,5,6,7,8,9'){
    var ret = [];//init
    //因为是手写，需要判断投注号码是否符合要求
    betballs = betballs.trim();
    betballs = betballs.replace(/^[^\d]*(.*?)[^\d]*$/gm, '$1').replace(/\s*[，|,]+\s*/g, ',').replace(/[\s，|,]+/g, ',')
    var ballgroups = betballs.split(",");
    var opts = optballs.split("|");
    //判断每一组是否存在重复号码
    for(var i = 0,len = ballgroups.length; i < len; i++){
        //空格分割为数组
        var balls = ballgroups[i].trim();
        if(balls.length != 5)continue;//如果分割个数不是5个则跳过
        //判断输入文字是否是可选号码之一
        var flag = 1;
        for(var k = 0,len1 = balls.length; k < len1; k++){
            if(optballs.indexOf(balls[k]) < 0){
                flag &= 0;break;
            }
        }
        if(!flag)continue;
        flag = 1;//重置标识符
        var code = balls;
        for(var j = 0,len2 = opts.length; j < len2; j++){
            var regret = code.match(new RegExp(opts[j],"g"));
            if (regret && (regret.length > 1)){
                flag &= 0;break;
            }
        }
        if(flag){
            ret.push(code);
        }
    }
    return ret;
}

module.exports = {
    '1010101': num1010101,
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
    '1040101': num1040101,
    '9010101': num9010101,
    '9010102': num9010102,
    '9010103': num9010103,
    '9010104': num9010104,
    '9020101': num9020101,
    '9020102': num9020102,
    '9020103': num9020103,
    '9020201': num9020201,
    '9020202': num9020202,
    '9020203': num9020203,
    '9030101': num9030101,
    '9030102': num9030102,
    '9040101': num9040101,
    '9040102': num9040102,
    '9050101': num9050101,
    '9010201': num9010201,
    '9010202': num9010202,
    '9060101': num9060101,
    '9060102': num9060102,
    '9060103': num9060103,
    '9060104': num9060104,
    '9060201': num9060201,
    '9060202': num9060202,
    '9070101': num9070101,
    '9070102': num9070102,
    '9070103': num9070103,
    '9070201': num9070201,
    '9070202': num9070202,
    '9070203': num9070203,
    '9080101': num9080101,
    '9080102': num9080102,
    '9080103': num9080103,
    '9080104': num9080104,
    '9080105': num9080105,
    '9080106': num9080106,
    '9080201': num9080201,
    '9080202': num9080202,
    '9080203': num9080203,
    '9080301': num9080301,
    '9080302': num9080302
}
