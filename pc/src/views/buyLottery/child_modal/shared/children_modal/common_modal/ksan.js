var sdtxSpit = /[\,\，]/

// 和值 -- 和值
function num2060101(betballs) {
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
function num2060102(betballs) {
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
// 三同号单选 -- 三同号单选
function num2040101(betballs) {
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
// 二同号复选 -- 二同号复选
function num2020201(betballs) {
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
// 二不同号 -- 标准选号
function num2010101(betballs) {
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
function num2010102(betballs) {
  var results = []
  betballs = betballs.trim()
  betballs = betballs
    .replace(/^[^\d]*(.*?)[^\d]*$/gm, '$1')
    .replace(/\s*[，|,]+\s*/g, ',')
    .replace(/[\s，|,]+/g, ',')
  betballs = betballs.split(sdtxSpit)
  betballs.forEach((item) => {
    let sp = item.split('')
    if (!results.includes(item)) {
      if (sp.length === 2 && /^[1-6]*$/.test(item) && sp[0] !== sp[1]) {
        results.push(item)
      }
    }
  })
  return results
}
function num2020102(betballs) {
  var results = []
  betballs = betballs.trim()
  betballs = betballs
    .replace(/^[^\d]*(.*?)[^\d]*$/gm, '$1')
    .replace(/\s*[，|,]+\s*/g, ',')
    .replace(/[\s，|,]+/g, ',')
  betballs = betballs.split(sdtxSpit)
  betballs.forEach((item) => {
    if (
      (item.match(/^([1-6])\1[1-6]$/) || item.match(/^[1-6]([1-6])\1$/) || item.match(/^([1-6])[1-6]\1$/)) &&
      !item.match(/^([1-6])\1\1$/)
    ) {
      if (!results.includes(item)) {
        results.push(item)
      }
    }
  })
  return results
}
function num2030102(betballs) {
  var results = []
  betballs = betballs.trim()
  betballs = betballs
    .replace(/^[^\d]*(.*?)[^\d]*$/gm, '$1')
    .replace(/\s*[，|,]+\s*/g, ',')
    .replace(/[\s，|,]+/g, ',')
  betballs = betballs.split(sdtxSpit)
  betballs.forEach((item) => {
    let sp = item.split('')
    if (sp.length === 3 && /^[1-6]*$/.test(item) && sp[0] !== sp[1] && sp[0] !== sp[2] && sp[1] !== sp[2]) {
      if (!results.includes(item)) {
        results.push(item)
      }
    }
  })
  return results
}
// 三不同号 -- 标准选号
function num2030101(betballs) {
  var results = []
  var balls = betballs.split(',')
  if (balls.length < 3) return results
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
// 二同号单选 -- 标准选号
function num2020101(betballs) {
  var results = []
  var dtballgroups = betballs.split('|') //胆拖分组
  if (!dtballgroups[0] || !dtballgroups[1]) return results
  var tballs = dtballgroups[1].split(',')
  for (var i = 0, len = tballs.length; i < len; i++) {
    results.push([dtballgroups[0].substr(0, 1), tballs[i]]) //塞入胆码,拖码
  }
  return results
}
// 二不同号 -- 胆拖选号
function num2010103(betballs) {
  var results = []
  var dtballgroups = betballs.split('|') //胆拖分组
  if (!dtballgroups[0] || !dtballgroups[1]) return results
  var tballs = dtballgroups[1].split(',')
  for (var i = 0, len = tballs.length; i < len; i++) {
    results.push([dtballgroups[0], tballs[i]]) //塞入胆码,拖码
  }
  return results
}
// 三连号通选 -- 三连号通选
function num2050101(betballs) {
  var results = []
  if (!betballs.length) return results
  results.push(betballs.split(','))
  return results
}
// 三同号通选 -- 三同号通选
function num2040202(betballs) {
  var results = []
  if (!betballs.length) return results
  results.push(betballs.split(','))
  return results
}
// 和值 -- 整合
function num2060103(betballs) {
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
module.exports = {
  2010101: num2010101,
  2010102: num2010102,
  2010103: num2010103,
  2020101: num2020101,
  2020102: num2020102,
  2020201: num2020201,
  2030101: num2030101,
  2030102: num2030102,
  2040101: num2040101,
  2040202: num2040202,
  2050101: num2050101,
  2060101: num2060101,
  2060102: num2060102,
  2060103: num2060103,
}
