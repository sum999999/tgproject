function random1010101(optballs) {
  var randomArr = [];
  var balls = optballs.split("|");
  for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
    var cur = [];
    for (var j = 0, len2 = balls.length; j < len2; j++) {
      if ((i >> j) & 1) {
        cur.push(balls[j]);
      }
    }
    if (cur.length == 3) {
      //三个号码
      randomArr.push(cur);
    }
  }
  // var index = Math.ceil(Math.random() * (randomArr.length - 1));
  var index = Math.ceil(Math.random() * 9999) % randomArr.length;
  return randomArr[index].join("|");
}
function random1010102(optballs) {
  var randomArr = [];
  var balls = optballs.split("|");
  for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
    var cur = [];
    for (var j = 0, len2 = balls.length; j < len2; j++) {
      if ((i >> j) & 1) {
        cur.push(balls[j]);
      }
    }
    if (cur.length == 3) {
      //三个号码
      randomArr.push(cur);
    }
  }
  // var index = Math.ceil(Math.random() * (randomArr.length - 1))
  var index = Math.ceil(Math.random() * 9999) % randomArr.length;
  return randomArr[index].join("");
}
function random1010103(optballs) {
  var balls = optballs.split("|");
  // var index = Math.ceil(Math.random() * (balls.length - 1))
  var index = Math.ceil(Math.random() * 9999) % balls.length;
  // 计算注数
  let result = bettingAmount(balls[index]);
  function bettingAmount(betballs) {
    var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var results = [];
    for (var i = 0, len1 = seed.length; i < len1; i++) {
      for (var j = 0, len2 = seed.length; j < len2; j++) {
        var dvalue = Number(betballs) - seed[i] - seed[j];
        if (seed.indexOf(dvalue) > -1) {
          results.push([seed[i] + "", seed[j] + "", dvalue + ""]);
        }
      }
    }
    return results;
  }
  return { len: result.length, ball: balls[index] };
}
function random1010201(optballs) {
  var randomArr = [];
  var balls = optballs.split("|");
  for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
    var cur = [];
    for (var j = 0, len2 = balls.length; j < len2; j++) {
      if ((i >> j) & 1) {
        cur.push(balls[j]);
      }
    }
    if (cur.length == 2) {
      //三个号码
      randomArr.push(cur);
    }
  }
  // var index = Math.ceil(Math.random() * (randomArr.length - 1))
  var index = Math.ceil(Math.random() * 9999) % randomArr.length;
  // return randomArr[index].join(",");
  return { len: 2, ball: randomArr[index].join(",") };
}
function random1010202(optballs) {
  var randomArr = [];
  var balls = optballs.split("|");
  for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
    var cur = [];
    for (var j = 0, len2 = balls.length; j < len2; j++) {
      if ((i >> j) & 1) {
        cur.push(balls[j]);
      }
    }
    if (cur.length == 3) {
      //三个号码
      randomArr.push(cur);
    }
  }
  // var index = Math.ceil(Math.random() * (randomArr.length - 1))
  var index = Math.ceil(Math.random() * 9999) % randomArr.length;
  return randomArr[index].join(",");
}
function random1010203(optballs) {
  var randomArr = [];
  var balls = optballs.split("|");
  for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
    var cur = [];
    for (var j = 0, len2 = balls.length; j < len2; j++) {
      if ((i >> j) & 1) {
        cur.push(balls[j]);
      }
    }
    if (cur.length == 3) {
      //三个号码
      randomArr.push(cur);
    }
  }
  // var index = Math.ceil(Math.random() * (randomArr.length - 1))
  var index = Math.ceil(Math.random() * 9999) % randomArr.length;
  return randomArr[index].join("");
}
function random1010204(optballs) {
  var randomArr = [];
  var balls = optballs.split("|");
  for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
    var cur = [];
    for (var j = 0, len2 = balls.length; j < len2; j++) {
      if ((i >> j) & 1) {
        cur.push(balls[j]);
      }
    }
    if (cur.length == 2) {
      //三个号码
      randomArr.push(cur);
    }
  }
  var index = Math.ceil(Math.random() * (randomArr.length - 1));
  var ret = randomArr[index].concat();
  ret.push(randomArr[index][0]);
  return ret.sort().join("");
}
function random1010205(optballs) {
  var randomArr = [];
  var balls = optballs.split("|");
  for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
    var cur = [];
    for (var j = 0, len2 = balls.length; j < len2; j++) {
      if ((i >> j) & 1) {
        cur.push(balls[j]);
      }
    }
    if (cur.length == 3) {
      //三个号码
      randomArr.push(cur);
    }
  }
  var index = Math.ceil(Math.random() * (randomArr.length - 1));
  var ret = randomArr[index];
  return ret.sort().join("");
}
function random1020101(optballs) {
  var randomArr = [];
  var balls = optballs.split("|");
  for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
    var cur = [];
    for (var j = 0, len2 = balls.length; j < len2; j++) {
      if ((i >> j) & 1) {
        cur.push(balls[j]);
      }
    }
    if (cur.length == 2) {
      //三个号码
      randomArr.push(cur);
    }
  }
  // var index = Math.ceil(Math.random() * (randomArr.length - 1))
  var index = Math.ceil(Math.random() * 9999) % randomArr.length;
  return randomArr[index].join("|");
}
function random1020102(optballs) {
  var randomArr = [];
  var balls = optballs.split("|");
  for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
    var cur = [];
    for (var j = 0, len2 = balls.length; j < len2; j++) {
      if ((i >> j) & 1) {
        cur.push(balls[j]);
      }
    }
    if (cur.length == 2) {
      //2个号码
      randomArr.push(cur);
    }
  }
  // var index = Math.ceil(Math.random() * (randomArr.length - 1))
  var index = Math.ceil(Math.random() * 9999) % randomArr.length;
  return randomArr[index].join("");
}
function random1020103(optballs) {
  var balls = optballs.split("|");
  // var index = Math.ceil(Math.random() * (balls.length - 1))
  var index = Math.ceil(Math.random() * 9999) % balls.length;
  // 计算注数
  let result = bettingAmount(balls[index]);
  function bettingAmount(betballs) {
    var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var results = [];
    for (var i = 0, len1 = seed.length; i < len1; i++) {
      var dvalue = Number(betballs) - seed[i];
      if (seed.indexOf(dvalue) > -1) {
        results.push([seed[i] + "", dvalue + ""]);
      }
    }
    return results;
  }
  return { len: result.length, ball: balls[index] };
}
function random1020201(optballs) {
  var randomArr = [];
  var balls = optballs.split("|");
  for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
    var cur = [];
    for (var j = 0, len2 = balls.length; j < len2; j++) {
      if ((i >> j) & 1) {
        cur.push(balls[j]);
      }
    }
    if (cur.length == 2) {
      //三个号码
      randomArr.push(cur);
    }
  }
  // var index = Math.ceil(Math.random() * (randomArr.length - 1))
  var index = Math.ceil(Math.random() * 9999) % randomArr.length;
  return randomArr[index].join(",");
}
function random1020202(optballs) {
  var randomArr = [];
  var balls = optballs.split("|");
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
  return randomArr[index].join("");
}
function random1020301(optballs) {
  var randomArr = [];
  var balls = optballs.split("|");
  for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
    var cur = [];
    for (var j = 0, len2 = balls.length; j < len2; j++) {
      if ((i >> j) & 1) {
        cur.push(balls[j]);
      }
    }
    if (cur.length == 2) {
      //三个号码
      randomArr.push(cur);
    }
  }
  // var index = Math.ceil(Math.random() * (randomArr.length - 1))
  var index = Math.ceil(Math.random() * 9999) % randomArr.length;
  return randomArr[index].join("|");
}
function random1020302(optballs) {
  var randomArr = [];
  var balls = optballs.split("|");
  for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
    var cur = [];
    for (var j = 0, len2 = balls.length; j < len2; j++) {
      if ((i >> j) & 1) {
        cur.push(balls[j]);
      }
    }
    if (cur.length == 2) {
      //2个号码
      randomArr.push(cur);
    }
  }
  // var index = Math.ceil(Math.random() * (randomArr.length - 1))
  var index = Math.ceil(Math.random() * 9999) % randomArr.length;
  return randomArr[index].join("");
}
function random1020303(optballs) {
  var balls = optballs.split("|");
  // var index = Math.ceil(Math.random() * (balls.length - 1))
  var index = Math.ceil(Math.random() * 9999) % balls.length;
  // 计算注数
  let result = bettingAmount(balls[index]);
  function bettingAmount(betballs) {
    var seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var results = [];
    for (var i = 0, len1 = seed.length; i < len1; i++) {
      var dvalue = Number(betballs) - seed[i];
      if (seed.indexOf(dvalue) > -1) {
        results.push([seed[i] + "", dvalue + ""]);
      }
    }
    return results;
  }
  return { len: result.length, ball: balls[index] };
}
function random1020401(optballs) {
  var randomArr = [];
  var balls = optballs.split("|");
  for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
    var cur = [];
    for (var j = 0, len2 = balls.length; j < len2; j++) {
      if ((i >> j) & 1) {
        cur.push(balls[j]);
      }
    }
    if (cur.length == 2) {
      //三个号码
      randomArr.push(cur);
    }
  }
  // var index = Math.ceil(Math.random() * (randomArr.length - 1))
  var index = Math.ceil(Math.random() * 9999) % randomArr.length;
  return randomArr[index].join(",");
}
function random1020402(optballs) {
  var randomArr = [];
  var balls = optballs.split("|");
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
  return randomArr[index].join("");
}
function random1030101(optballs) {
  var rnd = ["", "", ""];
  var balls = optballs.split("|");
  // var index = Math.ceil(Math.random() * (balls.length - 1))
  var index = Math.ceil(Math.random() * 9999) % balls.length;
  rnd[index % 3] = balls[index] + ""; //定位胆，应该是3位中任意选择一个给值
  return rnd.join("|"); //返回随机的格式|04|||，表示在5个分组里04是落在第二位，随机一个04号码
}
function random1040101(optballs) {
  var balls = optballs.split("|");
  // var index = Math.ceil(Math.random() * (balls.length - 1))
  var index = Math.ceil(Math.random() * 9999) % balls.length;
  return balls[index] + "";
}

function random11010101(optballs) {
  var randomArr = ["", "", "", ""];
  var idxArr = [0, 1, 2, 3];
  var balls = optballs.split("|");
  var id1 = Math.ceil(Math.random() * 999999) % idxArr.length;
  var idx1 = idxArr.splice(id1, 1);
  var idx2 = idxArr[Math.ceil(Math.random() * 999999) % idxArr.length];
  var ball1 = balls[Math.ceil(Math.random() * 999999) % 10];
  var ball2 = balls[Math.ceil(Math.random() * 999999) % 10];
  randomArr[idx1] = ball1;
  randomArr[idx2] = ball2;
  return randomArr.join("|");
}
function random11020101(optballs) {
  var randomArr = ["", "", "", ""];
  var idxArr = [0, 1, 2, 3];
  var balls = optballs.split("|");
  var id1 = Math.ceil(Math.random() * 999999) % idxArr.length;
  var idx1 = idxArr.splice(id1, 1);
  var id2 = Math.ceil(Math.random() * 999999) % idxArr.length;
  var idx2 = idxArr.splice(id2, 1);
  var idx3 = idxArr[Math.ceil(Math.random() * 999999) % idxArr.length];
  var ball1 = balls[Math.ceil(Math.random() * 999999) % 10];
  var ball2 = balls[Math.ceil(Math.random() * 999999) % 10];
  var ball3 = balls[Math.ceil(Math.random() * 999999) % 10];
  randomArr[idx1] = ball1;
  randomArr[idx2] = ball2;
  randomArr[idx3] = ball3;
  return randomArr.join("|");
}
function random11030101(optballs) {
  var randomArr = ["", "", "", ""];
  var idxArr = [0, 1, 2, 3];
  var balls = optballs.split("|");
  var id1 = Math.ceil(Math.random() * 999999) % idxArr.length;
  var idx1 = idxArr.splice(id1, 1);
  var id2 = Math.ceil(Math.random() * 999999) % idxArr.length;
  var idx2 = idxArr.splice(id2, 1);
  var id3 = Math.ceil(Math.random() * 999999) % idxArr.length;
  var idx3 = idxArr.splice(id3, 1);
  var idx4 = idxArr[0];
  var ball1 = balls[Math.ceil(Math.random() * 999999) % 10];
  var ball2 = balls[Math.ceil(Math.random() * 999999) % 10];
  var ball3 = balls[Math.ceil(Math.random() * 999999) % 10];
  var ball4 = balls[Math.ceil(Math.random() * 999999) % 10];
  randomArr[idx1] = ball1;
  randomArr[idx2] = ball2;
  randomArr[idx3] = ball3;
  randomArr[idx4] = ball4;
  return randomArr.join("|");
}
function random11040101(optballs) {
  var randomArr = ["", "", "", ""];
  var idxArr = [0, 1, 2, 3];
  var balls = optballs.split("|");
  var id1 = Math.ceil(Math.random() * 999999) % idxArr.length;
  var idx1 = idxArr.splice(id1, 1);
  var ball1 = balls[Math.ceil(Math.random() * 999999) % 10];
  randomArr[idx1] = ball1;
  return randomArr.join("|");
}
function random11050101(optballs) {
  var randomArr = [];
  var balls = optballs.split("|");
  for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
    var cur = [];
    for (var j = 0, len2 = balls.length; j < len2; j++) {
      if ((i >> j) & 1) {
        cur.push(balls[j]);
      }
    }
    if (cur.length == 2) {
      //2个号码
      randomArr.push(cur);
    }
  }
  var index = Math.ceil(Math.random() * (randomArr.length - 1));
  return randomArr[index].join(",");
}
function random11060101(optballs) {
  var randomArr = [];
  var balls = optballs.split("|");
  for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
    var cur = [];
    for (var j = 0, len2 = balls.length; j < len2; j++) {
      if ((i >> j) & 1) {
        cur.push(balls[j]);
      }
    }
    if (cur.length == 3) {
      //3个号码
      randomArr.push(cur);
    }
  }
  var index = Math.ceil(Math.random() * (randomArr.length - 1));
  return randomArr[index].join(",");
}

function random10010101(optballs) {
  var randomArr = ["", "", "", ""];
  var idxArr = [0, 1, 2, 3];
  var balls = optballs.split("|");
  var id1 = Math.ceil(Math.random() * 999999) % idxArr.length;
  var idx1 = idxArr.splice(id1, 1);
  var idx2 = idxArr[Math.ceil(Math.random() * 999999) % idxArr.length];
  var ball1 = balls[Math.ceil(Math.random() * 999999) % 10];
  var ball2 = balls[Math.ceil(Math.random() * 999999) % 10];
  randomArr[idx1] = ball1;
  randomArr[idx2] = ball2;
  return randomArr.join("|");
}
function random10020101(optballs) {
  var randomArr = ["", "", "", ""];
  var idxArr = [0, 1, 2, 3];
  var balls = optballs.split("|");
  var id1 = Math.ceil(Math.random() * 999999) % idxArr.length;
  var idx1 = idxArr.splice(id1, 1);
  var id2 = Math.ceil(Math.random() * 999999) % idxArr.length;
  var idx2 = idxArr.splice(id2, 1);
  var idx3 = idxArr[Math.ceil(Math.random() * 999999) % idxArr.length];
  var ball1 = balls[Math.ceil(Math.random() * 999999) % 10];
  var ball2 = balls[Math.ceil(Math.random() * 999999) % 10];
  var ball3 = balls[Math.ceil(Math.random() * 999999) % 10];
  randomArr[idx1] = ball1;
  randomArr[idx2] = ball2;
  randomArr[idx3] = ball3;
  return randomArr.join("|");
}
function random10030101(optballs) {
  var randomArr = ["", "", "", ""];
  var idxArr = [0, 1, 2, 3];
  var balls = optballs.split("|");
  var id1 = Math.ceil(Math.random() * 999999) % idxArr.length;
  var idx1 = idxArr.splice(id1, 1);
  var id2 = Math.ceil(Math.random() * 999999) % idxArr.length;
  var idx2 = idxArr.splice(id2, 1);
  var id3 = Math.ceil(Math.random() * 999999) % idxArr.length;
  var idx3 = idxArr.splice(id3, 1);
  var idx4 = idxArr[0];
  var ball1 = balls[Math.ceil(Math.random() * 999999) % 10];
  var ball2 = balls[Math.ceil(Math.random() * 999999) % 10];
  var ball3 = balls[Math.ceil(Math.random() * 999999) % 10];
  var ball4 = balls[Math.ceil(Math.random() * 999999) % 10];
  randomArr[idx1] = ball1;
  randomArr[idx2] = ball2;
  randomArr[idx3] = ball3;
  randomArr[idx4] = ball4;
  return randomArr.join("|");
}
function random10040101(optballs) {
  var randomArr = ["", "", "", ""];
  var idxArr = [0, 1, 2, 3];
  var balls = optballs.split("|");
  var id1 = Math.ceil(Math.random() * 999999) % idxArr.length;
  var idx1 = idxArr.splice(id1, 1);
  var ball1 = balls[Math.ceil(Math.random() * 999999) % 10];
  randomArr[idx1] = ball1;
  return randomArr.join("|");
}
function random10050101(optballs) {
  var randomArr = [];
  var balls = optballs.split("|");
  for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
    var cur = [];
    for (var j = 0, len2 = balls.length; j < len2; j++) {
      if ((i >> j) & 1) {
        cur.push(balls[j]);
      }
    }
    if (cur.length == 2) {
      //2个号码
      randomArr.push(cur);
    }
  }
  var index = Math.ceil(Math.random() * (randomArr.length - 1));
  return randomArr[index].join(",");
}
function random10060101(optballs) {
  var randomArr = [];
  var balls = optballs.split("|");
  for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
    var cur = [];
    for (var j = 0, len2 = balls.length; j < len2; j++) {
      if ((i >> j) & 1) {
        cur.push(balls[j]);
      }
    }
    if (cur.length == 3) {
      //2个号码
      randomArr.push(cur);
    }
  }
  var index = Math.ceil(Math.random() * (randomArr.length - 1));
  return randomArr[index].join(",");
}
function random1040102(optballs) {
  var randomArr = [];
  var balls = optballs.split("|");
  for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
    var cur = [];
    for (var j = 0, len2 = balls.length; j < len2; j++) {
      if ((i >> j) & 1) {
        cur.push(balls[j]);
      }
    }
    if (cur.length == 2) {
      //2个号码
      randomArr.push(cur);
    }
  }
  var index = Math.ceil(Math.random() * (randomArr.length - 1));
  return randomArr[index].join(",");
}
//前二
function random4140115(optballs) {
  var randomArr = [];
  var balls = optballs.split("|");
  for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
    var cur = [];
    for (var j = 0, len2 = balls.length; j < len2; j++) {
      if ((i >> j) & 1) {
        cur.push(balls[j]);
      }
    }
    if (cur.length == 2) {
      //2个号码
      randomArr.push(cur);
    }
  }
  // var index = Math.ceil(Math.random() * (randomArr.length - 1))
  var index = Math.ceil(Math.random() * 9999) % randomArr.length;
  return randomArr[index].join("|");
}
//后二
function random4140116(optballs) {
  var randomArr = [];
  var balls = optballs.split("|");
  for (var i = 0, len1 = Math.pow(2, balls.length); i < len1; i++) {
    var cur = [];
    for (var j = 0, len2 = balls.length; j < len2; j++) {
      if ((i >> j) & 1) {
        cur.push(balls[j]);
      }
    }
    if (cur.length == 2) {
      //2个号码
      randomArr.push(cur);
    }
  }
  // var index = Math.ceil(Math.random() * (randomArr.length - 1))
  var index = Math.ceil(Math.random() * 9999) % randomArr.length;
  return randomArr[index].join("|");
}
//总和
function random4140117(optballs) {
  var balls = optballs.split("|");
  // var index = Math.ceil(Math.random() * (balls.length - 1))
  var index = Math.ceil(Math.random() * 9999) % balls.length;
  return balls[index] + "";
}
module.exports = {
  "1010101": random1010101,
  "1010102": random1010102,
  "1010103": random1010103,
  "1010201": random1010201,
  "1010202": random1010202,
  "1010203": random1010203,
  "1010204": random1010204,
  "1010205": random1010205,
  "1020101": random1020101,
  "1020102": random1020102,
  "1020103": random1020103,
  "1020201": random1020201,
  "1020202": random1020202,
  "1020301": random1020301,
  "1020302": random1020302,
  "1020303": random1020303,
  "1020401": random1020401,
  "1020402": random1020402,
  "1030101": random1030101,
  "1040101": random1040101,
  "1040102": random1040102,
  "11010101": random11010101,
  "11020101": random11020101,
  "11030101": random11030101,
  "11040101": random11040101,
  "11050101": random11050101,
  "11060101": random11060101,
  "10010101": random10010101,
  "10020101": random10020101,
  "10030101": random10030101,
  "10040101": random10040101,
  "10050101": random10050101,
  "10060101": random10060101,
  "4140115": random4140115,
  "4140116": random4140116,
  "4140117": random4140117,
};
