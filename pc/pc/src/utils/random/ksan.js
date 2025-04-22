function random2010101(optballs) {
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
  // var index = Math.ceil(Math.random() * (randomArr.length - 1));
  var index = Math.ceil(Math.random() * 9999) % randomArr.length
  return randomArr[index].join(',')
}
function random2010102(optballs) {
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
function random2010103(optballs) {
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
function random2020101(optballs) {
  var randomArr = []
  var gballs = optballs.split('|')
  var balls = []
  for (var i = 0, len1 = gballs.length; i < len1; i++) {
    balls.push(gballs[i][0])
  }
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
  return randomArr[index][0] + '' + randomArr[index][0] + '|' + randomArr[index][1]
}
function random2020102(optballs) {
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
  return randomArr[index][0] + '' + randomArr[index][0] + '' + randomArr[index][1]
}
function random2020201(optballs) {
  var gballs = optballs.split('|')
  var balls = []
  for (var i = 0, len1 = gballs.length; i < len1; i++) {
    balls.push(gballs[i][0])
  }
  // var index = Math.ceil(Math.random() * (balls.length - 1))
  var index = Math.ceil(Math.random() * 9999) % balls.length
  return balls[index] + '' + balls[index] + '*'
}
function random2030101(optballs) {
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
function random2030102(optballs) {
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
function random2040101(optballs) {
  var balls = optballs.split('|')
  // var index = Math.ceil(Math.random() * (balls.length - 1))
  var index = Math.ceil(Math.random() * 9999) % balls.length
  return balls[index]
}
function random2040202(optballs) {
  var ret = []
  var balls = optballs.split('|')
  return balls.join(',')
}
function random2050101(optballs) {
  var ret = []
  var balls = optballs.split('|')
  return balls.join(',')
}
function random2060101(optballs) {
  var balls = optballs.split('|')
  // var index = Math.ceil(Math.random() * (balls.length - 1))
  var index = Math.ceil(Math.random() * 9999) % balls.length
  return balls[index] + ''
}
function random2060102(optballs) {
  var balls = optballs.split('|')
  // var index = Math.ceil(Math.random() * (balls.length - 1))
  var index = Math.ceil(Math.random() * 9999) % balls.length
  return balls[index] + ''
}

function random2060103(optballs) {
  var balls = optballs.split('|')
  // var index = Math.ceil(Math.random() * (balls.length - 1))
  var index = Math.ceil(Math.random() * 9999) % balls.length
  return balls[index] + ''
}

module.exports = {
  2010101: random2010101,
  2010102: random2010102,
  2010103: random2010103,
  2020101: random2020101,
  2020102: random2020102,
  2020201: random2020201,
  2030101: random2030101,
  2030102: random2030102,
  2040101: random2040101,
  2040202: random2040202,
  2050101: random2050101,
  2060101: random2060101,
  2060102: random2060102,
  2060103: random2060103,
}
