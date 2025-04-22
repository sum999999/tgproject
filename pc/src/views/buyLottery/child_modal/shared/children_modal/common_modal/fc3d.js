var sdtxSpit = /[\,\，]/;
function num1010101(betballs) {
  var results = []; //清空对象
  var result = [];
  //玩法规则
  var groups = [];
  var ballGroups = betballs.split("|");
  if (ballGroups.some((item) => !item)) return results;
  for (var i = 0, len = ballGroups.length; i < len; i++) {
    groups.push(ballGroups[i].split(","));
  }
  doExchange(groups, 0);
  function doExchange(arr, depth) {
    for (var i = 0; i < arr[depth].length; i++) {
      result[depth] = arr[depth][i];
      if (depth != arr.length - 1) {
        doExchange(arr, depth + 1);
      } else {
        results.push(result.join(","));
      }
    }
  }
  return results;
}
function num1010102(betballs) {
  var results = [];
  // betballs = betballs.split(' ')
  betballs = betballs.trim();
  betballs = betballs
    .replace(/^[^\d]*(.*?)[^\d]*$/gm, "$1")
    .replace(/\s*[，|,]+\s*/g, ",")
    .replace(/[\s，|,]+/g, ",");
  betballs = betballs.split(sdtxSpit);
  betballs.forEach((item) => {
    let sp = item.split("");
    if (
      sp.length === 3 &&
      /^[0-9]*$/.test(item) &&
      !results.some((vvv) => vvv === item)
    ) {
      if (!results.includes(item)) {
        results.push(item);
      }
    }
  });
  return results;
}
function num1010103(betballs) {
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
          results.push([seed[i] + "", seed[j] + "", dvalue + ""]);
        }
      }
    }
  }
  return results;
}
function num1010201(betballs) {
  //构建所有可能性号码组合
  var results = [];
  var balls = betballs.split(",");
  for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
    var cur = [];
    for (var j = 0, len2 = balls.length; j < len2; j++) {
      if ((i >> j) & 1) {
        cur.push(balls[j]);
      }
    }
    if (cur.length == 2) {
      //二个号码
      results.push(cur);
    }
  }
  var farr = [];
  //从0-9中任意选择2个或2个以上号码组成两注,且有1个号码重复
  for (var i = 0, len1 = results.length; i < len1; i++) {
    for (var j = 0, len2 = results[i].length; j < len2; j++) {
      var temp = results[i].concat();
      temp.push(results[i][j]);
      farr.push(temp);
    }
  }
  return farr;
}
function num1010202(betballs) {
  //构建所有可能性号码组合
  var results = [];
  var balls = betballs.split(",");
  for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
    var cur = [];
    for (var j = 0, len2 = balls.length; j < len2; j++) {
      if ((i >> j) & 1) {
        cur.push(balls[j]);
      }
    }
    if (cur.length == 3) {
      //三个号码
      results.push(cur);
    }
  }
  return results;
}
function num1010203(betballs) {
  var results = [];
  betballs = betballs.split(" ");
  betballs.forEach((item) => {
    let sp = item.split("");
    if (
      sp.length === 3 &&
      /^[0-9]*$/.test(item) &&
      !item.match(/^([0-9])\1\1$/) &&
      !results.some((vvv) => vvv === item)
    ) {
      results.push(item);
    }
  });
  return results;
}
function num1010204(betballs) {
  var results = [];
  betballs = betballs.trim();
  betballs = betballs
    .replace(/^[^\d]*(.*?)[^\d]*$/gm, "$1")
    .replace(/\s*[，|,]+\s*/g, ",")
    .replace(/[\s，|,]+/g, ",");
  var ballgroups = betballs.split(/[\,\，]/);
  //判断是否存在同号情况
  for (var i = 0, length = ballgroups.length; i < length; i++) {
    //是二同号，且不是三同号
    if (
      (ballgroups[i].match(/^(\d)\1\d$/) ||
        ballgroups[i].match(/^\d(\d)\1$/) ||
        ballgroups[i].match(/^(\d)\d\1$/)) &&
      !ballgroups[i].match(/^(\d)\1\1$/)
    ) {
      results.push(
        ballgroups[i]
          .split("")
          .sort()
          .join("")
      );
    }
  }
  //去重
  var rets = results.filter(function(element, index, results) {
    return results.indexOf(element) == index;
  });
  return rets;
}
function num1010205(betballs) {
  var results = [];
  betballs = betballs.trim();
  betballs = betballs
    .replace(/^[^\d]*(.*?)[^\d]*$/gm, "$1")
    .replace(/\s*[，|,]+\s*/g, ",")
    .replace(/[\s，|,]+/g, ",");
  var ballgroups = betballs.split(/[\,\，]/);
  //判断是否存在同号情况
  for (var i = 0, length = ballgroups.length; i < length; i++) {
    //三个数字，并且不能有同号
    if (
      /^\d{3}$/.test(ballgroups[i]) &&
      !(
        ballgroups[i].match(/^(\d)\1\d$/) ||
        ballgroups[i].match(/^\d(\d)\1$/) ||
        ballgroups[i].match(/^(\d)\d\1$/)
      )
    ) {
      results.push(
        ballgroups[i]
          .split("")
          .sort()
          .join("")
      );
    }
  }
  //去重
  var rets = results.filter(function(element, index, results) {
    return results.indexOf(element) == index;
  });
  return rets;
}
function num1020101(betballs) {
  var results = [];
  var result = [];
  var groups = [];
  var ballGroups = betballs.split("|");
  if (ballGroups.some((item) => !item)) return results;
  for (var i = 0, len = ballGroups.length; i < len; i++) {
    groups.push(ballGroups[i].split(","));
  }
  doExchange(groups, 0);
  function doExchange(arr, depth) {
    for (var i = 0; i < arr[depth].length; i++) {
      result[depth] = arr[depth][i];
      if (depth != arr.length - 1) {
        doExchange(arr, depth + 1);
      } else {
        results.push(result.join(","));
      }
    }
  }
  return results;
}
function num1020102(betballs) {
  var results = [];
  // betballs = betballs.split(' ')
  betballs = betballs.trim();
  betballs = betballs
    .replace(/^[^\d]*(.*?)[^\d]*$/gm, "$1")
    .replace(/\s*[，|,]+\s*/g, ",")
    .replace(/[\s，|,]+/g, ",");
  betballs = betballs.split(sdtxSpit);
  betballs.forEach((item) => {
    let sp = item.split("");
    if (
      sp.length === 2 &&
      /^[0-9]*$/.test(item) &&
      !results.some((vvv) => vvv === item)
    ) {
      if (!results.includes(item)) {
        results.push(item);
      }
    }
  });
  return results;
}
function num1020103(betballs) {
  var results = [];
  var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  var bettinggroups = betballs.split(",");
  if (!bettinggroups[0]) return [];
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
function num1020201(betballs) {
  //构建所有可能性号码组合
  var results = [];
  var balls = betballs.split(",");
  for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
    var cur = [];
    for (var j = 0, len2 = balls.length; j < len2; j++) {
      if ((i >> j) & 1) {
        cur.push(balls[j]);
      }
    }
    if (cur.length == 2) {
      //二个号码
      results.push(cur);
    }
  }
  return results;
}
function num1020202(betballs) {
  var results = [];
  betballs = betballs.trim();
  betballs = betballs
    .replace(/^[^\d]*(.*?)[^\d]*$/gm, "$1")
    .replace(/\s*[，|,]+\s*/g, ",")
    .replace(/[\s，|,]+/g, ",");
  betballs = betballs.split(/[\,\，]/);
  betballs.forEach((item) => {
    if (
      item.length === 2 &&
      !item.match(/^([0-9])\1$/) &&
      !results.some((value) => value === item)
    ) {
      if (!results.includes(item)) {
        results.push(item);
      }
    }
  });
  return results;
}
///
function num1020301(betballs) {
  var results = [];
  var result = [];
  var groups = [];
  var ballGroups = betballs.split("|");
  if (ballGroups.some((item) => !item)) return results;
  for (var i = 0, len = ballGroups.length; i < len; i++) {
    groups.push(ballGroups[i].split(","));
  }
  doExchange(groups, 0);
  function doExchange(arr, depth) {
    for (var i = 0; i < arr[depth].length; i++) {
      result[depth] = arr[depth][i];
      if (depth != arr.length - 1) {
        doExchange(arr, depth + 1);
      } else {
        results.push(result.join(","));
      }
    }
  }
  return results;
}
function num1020302(betballs) {
  var results = [];
  // betballs = betballs.split(' ')
  betballs = betballs.trim();
  betballs = betballs
    .replace(/^[^\d]*(.*?)[^\d]*$/gm, "$1")
    .replace(/\s*[，|,]+\s*/g, ",")
    .replace(/[\s，|,]+/g, ",");
  betballs = betballs.split(sdtxSpit);
  betballs.forEach((item) => {
    let sp = item.split("");
    if (
      sp.length === 2 &&
      /^[0-9]*$/.test(item) &&
      !results.some((vvv) => vvv === item)
    ) {
      if (!results.includes(item)) {
        results.push(item);
      }
    }
  });
  return results;
}
function num1020303(betballs) {
  var results = [];
  var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  var bettinggroups = betballs.split(",");
  if (!bettinggroups[0]) return [];
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
function num1020401(betballs) {
  //构建所有可能性号码组合
  var results = [];
  var balls = betballs.split(",");
  for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
    var cur = [];
    for (var j = 0, len2 = balls.length; j < len2; j++) {
      if ((i >> j) & 1) {
        cur.push(balls[j]);
      }
    }
    if (cur.length == 2) {
      //二个号码
      results.push(cur);
    }
  }
  return results;
}
function num1020402(betballs) {
  var results = [];
  betballs = betballs.trim();
  betballs = betballs
    .replace(/^[^\d]*(.*?)[^\d]*$/gm, "$1")
    .replace(/\s*[，|,]+\s*/g, ",")
    .replace(/[\s，|,]+/g, ",");
  betballs = betballs.split(/[\,\，]/);
  betballs.forEach((item) => {
    if (
      item.length === 2 &&
      !item.match(/^([0-9])\1$/) &&
      !results.some((value) => value === item)
    ) {
      if (!results.includes(item)) {
        results.push(item);
      }
    }
  });
  return results;
}
function num1030101(betballs) {
  var results = [];
  var ballgroups = betballs.split("|");
  for (var i = 0, len1 = ballgroups.length; i < len1; i++) {
    var balls = ballgroups[i].split(",");
    for (var j = 0, len2 = balls.length; j < len2; j++) {
      if (balls[j] == "") continue;
      results.push(balls[j]);
    }
  }
  return results;
}
function num1040101(betballs) {
  var balls = betballs.split(",");
  if (!balls[0]) return [];
  return balls;
}

function num11010101(betballs) {
  //构建所有可能性号码组合
  function doExchange(arr, depth) {
    for (var i = 0; i < arr[depth].length; i++) {
      result[depth] = arr[depth][i];
      if (depth != arr.length - 1) {
        doExchange(arr, depth + 1);
      } else {
        results.push(result.join(","));
      }
    }
  }
  var results = [];
  var result = [];
  var groups = [];
  var ballGroups = betballs.split("|");
  for (var i = 0, len = ballGroups.length; i < len; i++) {
    if (ballGroups[i] == "" || ballGroups[i].length == 0) continue;
    groups.push(ballGroups[i].split(","));
  }
  if (groups.length != 2) return { len: 0 }; //如果不是选择的两组，返回0注
  doExchange(groups, 0);
  return results;
}
function num11020101(betballs) {
  //构建所有可能性号码组合
  function doExchange(arr, depth) {
    for (var i = 0; i < arr[depth].length; i++) {
      result[depth] = arr[depth][i];
      if (depth != arr.length - 1) {
        doExchange(arr, depth + 1);
      } else {
        results.push(result.join(","));
      }
    }
  }
  var results = [];
  var result = [];
  var groups = [];
  var ballGroups = betballs.split("|");
  for (var i = 0, len = ballGroups.length; i < len; i++) {
    if (ballGroups[i] == "" || ballGroups[i].length == 0) continue;
    groups.push(ballGroups[i].split(","));
  }
  if (groups.length != 3) return { len: 0 }; //如果不是选择的三组，返回0注
  doExchange(groups, 0);
  return results;
}
function num11030101(betballs) {
  //构建所有可能性号码组合
  function doExchange(arr, depth) {
    for (var i = 0; i < arr[depth].length; i++) {
      result[depth] = arr[depth][i];
      if (depth != arr.length - 1) {
        doExchange(arr, depth + 1);
      } else {
        results.push(result.join(","));
      }
    }
  }
  var results = [];
  var result = [];
  var groups = [];
  var ballGroups = betballs.split("|");
  for (var i = 0, len = ballGroups.length; i < len; i++) {
    if (ballGroups[i] == "" || ballGroups[i].length == 0) continue;
    groups.push(ballGroups[i].split(","));
  }
  if (groups.length != 4) return { len: 0 }; //如果不是选择的四组，返回0注
  doExchange(groups, 0);
  return results;
}
function num11040101(betballs) {
  var ret = [];
  var ballgroups = betballs.split("|");
  for (var i = 0, len1 = ballgroups.length; i < len1; i++) {
    var balls = ballgroups[i].split(",");
    for (var j = 0, len2 = balls.length; j < len2; j++) {
      if (balls[j] != "") ret.push(balls[j]);
    }
  }
  return ret;
}
function num11050101(betballs) {
  var results = [];
  var balls = betballs.split(",");
  for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
    var cur = [];
    for (var j = 0, len2 = balls.length; j < len2; j++) {
      if ((i >> j) & 1) {
        cur.push(balls[j]);
      }
    }
    if (cur.length == 2) {
      //2个号码
      results.push(cur);
    }
  }
  return results;
}
function num11060101(betballs) {
  var results = [];
  var balls = betballs.split(",");
  for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
    var cur = [];
    for (var j = 0, len2 = balls.length; j < len2; j++) {
      if ((i >> j) & 1) {
        cur.push(balls[j]);
      }
    }
    if (cur.length == 3) {
      //3个号码
      results.push(cur);
    }
  }
  return results;
}

function num10010101(betballs) {
  //构建所有可能性号码组合
  function doExchange(arr, depth) {
    for (var i = 0; i < arr[depth].length; i++) {
      result[depth] = arr[depth][i];
      if (depth != arr.length - 1) {
        doExchange(arr, depth + 1);
      } else {
        results.push(result.join(","));
      }
    }
  }
  var results = [];
  var result = [];
  var groups = [];
  var ballGroups = betballs.split("|");
  for (var i = 0, len = ballGroups.length; i < len; i++) {
    if (ballGroups[i] == "" || ballGroups[i].length == 0) continue;
    groups.push(ballGroups[i].split(","));
  }
  if (groups.length != 2) return { len: 0 }; //如果不是选择的两组，返回0注
  doExchange(groups, 0);
  return results;
}
function num10020101(betballs) {
  function doExchange(arr, depth) {
    for (var i = 0; i < arr[depth].length; i++) {
      result[depth] = arr[depth][i];
      if (depth != arr.length - 1) {
        doExchange(arr, depth + 1);
      } else {
        results.push(result.join(","));
      }
    }
  }
  var results = [];
  var result = [];
  var groups = [];
  var ballGroups = betballs.split("|");
  for (var i = 0, len = ballGroups.length; i < len; i++) {
    if (ballGroups[i] == "" || ballGroups[i].length == 0) continue;
    groups.push(ballGroups[i].split(","));
  }
  if (groups.length != 3) return { len: 0 }; //如果不是选择的三组，返回0注
  doExchange(groups, 0);
  return results;
}
function num10030101(betballs) {
  //构建所有可能性号码组合
  function doExchange(arr, depth) {
    for (var i = 0; i < arr[depth].length; i++) {
      result[depth] = arr[depth][i];
      if (depth != arr.length - 1) {
        doExchange(arr, depth + 1);
      } else {
        results.push(result.join(","));
      }
    }
  }
  var results = [];
  var result = [];
  var groups = [];
  var ballGroups = betballs.split("|");
  for (var i = 0, len = ballGroups.length; i < len; i++) {
    if (ballGroups[i] == "" || ballGroups[i].length == 0) continue;
    groups.push(ballGroups[i].split(","));
  }
  if (groups.length != 4) return { len: 0 }; //如果不是选择的四组，返回0注
  doExchange(groups, 0);
  return results;
}
function num10040101(betballs) {
  var ret = [];
  var ballgroups = betballs.split("|");
  for (var i = 0, len1 = ballgroups.length; i < len1; i++) {
    var balls = ballgroups[i].split(",");
    for (var j = 0, len2 = balls.length; j < len2; j++) {
      if (balls[j] != "") ret.push(balls[j]);
    }
  }
  return ret;
}
function num10050101(betballs) {
  var results = [];
  var balls = betballs.split(",");
  for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
    var cur = [];
    for (var j = 0, len2 = balls.length; j < len2; j++) {
      if ((i >> j) & 1) {
        cur.push(balls[j]);
      }
    }
    if (cur.length == 2) {
      //2个号码
      results.push(cur);
    }
  }
  return results;
}

function num10060101(betballs) {
  var results = [];
  var balls = betballs.split(",");
  for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
    var cur = [];
    for (var j = 0, len2 = balls.length; j < len2; j++) {
      if ((i >> j) & 1) {
        cur.push(balls[j]);
      }
    }
    if (cur.length == 3) {
      //3个号码
      results.push(cur);
    }
  }
  return results;
}

function num1040102(betballs) {
  var results = [];
  var balls = betballs.split(",");
  if (balls.length < 2) return 0;
  for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
    var cur = [];
    for (var j = 0, len2 = balls.length; j < len2; j++) {
      if ((i >> j) & 1) {
        cur.push(balls[j]);
      }
    }
    if (cur.length == 2) {
      //二个号码
      results.push(cur);
    }
  }
  return results;
}
function num4140115(betballs) {
  //构建所有可能性号码组合
  function doExchange(arr, depth) {
    for (var i = 0; i < arr[depth].length; i++) {
      result[depth] = arr[depth][i];
      if (depth != arr.length - 1) {
        doExchange(arr, depth + 1);
      } else {
        results.push(result.join(","));
      }
    }
  }
  var results = [];
  var result = [];
  var groups = [];
  var ballGroups = betballs.split("|");
  for (var i = 0, len = ballGroups.length; i < len; i++) {
    if (ballGroups[i] == "" || ballGroups[i].length == 0) continue;
    groups.push(ballGroups[i].split(","));
  }
  if (groups.length < 2) return []; //没有选够2组，返回0注
  doExchange(groups, 0);
  return results;
}

function num4140116(betballs) {
  //构建所有可能性号码组合
  function doExchange(arr, depth) {
    for (var i = 0; i < arr[depth].length; i++) {
      result[depth] = arr[depth][i];
      if (depth != arr.length - 1) {
        doExchange(arr, depth + 1);
      } else {
        results.push(result.join(","));
      }
    }
  }
  var results = [];
  var result = [];
  var groups = [];
  var ballGroups = betballs.split("|");
  for (var i = 0, len = ballGroups.length; i < len; i++) {
    if (ballGroups[i] == "" || ballGroups[i].length == 0) continue;
    groups.push(ballGroups[i].split(","));
  }
  if (groups.length < 2) return []; //没有选够2组，返回0注
  doExchange(groups, 0);
  return results;
}

function num4140117(betballs) {
  var results = [];
  var balls = betballs.split(",");
  if (!balls.length) return results;
  for (var i = 0; i < balls.length; i++) {
    if (balls[i]) {
      results.push([balls[i]]);
    }
  }
  return results;
}
module.exports = {
  "1010101": num1010101,
  "1010102": num1010102,
  "1010103": num1010103,
  "1010201": num1010201,
  "1010202": num1010202,
  "1010203": num1010203,
  "1010204": num1010204,
  "1010205": num1010205,
  "1020101": num1020101,
  "1020102": num1020102,
  "1020103": num1020103,
  "1020201": num1020201,
  "1020202": num1020202,
  "1020301": num1020301,
  "1020302": num1020302,
  "1020303": num1020303,
  "1020401": num1020401,
  "1020402": num1020402,
  "1030101": num1030101,
  "1040101": num1040101,
  "1040102": num1040102,
  "11010101": num11010101,
  "11020101": num11020101,
  "11030101": num11030101,
  "11040101": num11040101,
  "11050101": num11050101,
  "11060101": num11060101,
  "10010101": num10010101,
  "10020101": num10020101,
  "10030101": num10030101,
  "10040101": num10040101,
  "10050101": num10050101,
  "10060101": num10060101,
  "4140115": num4140115,
  "4140116": num4140116,
  "4140117": num4140117,
};
