function random1010101(optballs) {
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
    // var index = Math.ceil(Math.random() * (randomArr.length - 1))
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
    // return randomArr[index].join(",");
    return { len: 2, ball: randomArr[index].join(',') }
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
//腾讯分分彩
function random9010101(optballs) {
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
function random9010102(optballs) {
    var balls = optballs.split('|')
    // var index = Math.ceil(Math.random() * (balls.length - 1))
    var index = Math.ceil(Math.random() * 9999) % balls.length
    return balls[index] + ''
}
function random9010103(optballs) {
    var balls = optballs.split('|')
    // var index = Math.ceil(Math.random() * (balls.length - 1))
    var index = Math.ceil(Math.random() * 9999) % balls.length
    return balls[index] + ''
}
function random9010104 (optballs) {
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
function random9020101(optballs) {
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
function random9020102(optballs) {
    var balls = optballs.split('|')
    // var index = Math.ceil(Math.random() * (balls.length - 1))
    var index = Math.ceil(Math.random() * 9999) % balls.length
    return balls[index] + ''
}
function random9020103(optballs) {
    var balls = optballs.split('|')
    // var index = Math.ceil(Math.random() * (balls.length - 1))
    var index = Math.ceil(Math.random() * 9999) % balls.length
    console.log(balls[index] + '')
    return balls[index] + ''
}
function random9020201(optballs) {
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
function random9020202(optballs) {
    var balls = optballs.split('|')
    // var index = Math.ceil(Math.random() * (balls.length - 1))
    var index = Math.ceil(Math.random() * 9999) % balls.length
    return balls[index] + ''
}
function random9020203(optballs) {
    var balls = optballs.split('|')
    // var index = Math.ceil(Math.random() * (balls.length - 1))
    var index = Math.ceil(Math.random() * 9999) % balls.length
    return balls[index] + ''
}
function random9030101(optballs) {
    var balls = optballs.split('|')
    var index = Math.ceil(Math.random() * 999) % 9
    return balls[index] + ''
}
function random9030102(optballs) {
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
function random9040101(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0; i < 3; i++) {
        var idx = Math.ceil(Math.random() * 999) % 4
        randomArr.push(balls[idx])
    }
    return randomArr.join('|')
}
function random9040102(optballs) {
    var randomArr = []
    var balls = optballs.split('|')
    for (var i = 0; i < 2; i++) {
        var idx = Math.ceil(Math.random() * 999) % 4
        randomArr.push(balls[idx])
    }
    return randomArr.join('|')
}

function random9050101 (optballs) {
    var rnd = ["","","","",""];
    var balls = optballs.split("|");
    var ballIdx = Math.ceil(Math.random()*99999)%5;
    var rndIdx = Math.ceil(Math.random()*99999)%5;
    rnd[rndIdx] = balls[ballIdx]+"";
    return rnd.join("|");
}

function random9010201(optballs){
	var randomArr = [];
	var balls = optballs.split("|");
	for (var i = 0,len1 = Math.pow(2, balls.length);i < len1;i++){
		var cur = [];
		for (var j = 0,len2 = balls.length;j < len2;j++){
			if (i >> j&1){
				cur.push(balls[j]);
			}
		}
		if (cur.length == 2){//2个号码
			randomArr.push(cur);
		}
	}
	var index = Math.ceil(Math.random()*(randomArr.length-1));
	return randomArr[index].join(",");
}


function random9010202(optballs){
	var randomArr = [];
	var balls = optballs.split("|");
	for (var i = 0,len1 = Math.pow(2, balls.length);i < len1;i++){
		var cur = [];
		for (var j = 0,len2 = balls.length;j < len2;j++){
			if (i >> j&1){
				cur.push(balls[j]);
			}
		}
		if (cur.length == 3){//3个号码
			randomArr.push(cur);
		}
	}
	var index = Math.ceil(Math.random()*(randomArr.length-1));
	return randomArr[index].join(",");
}

function random9060101(optballs){
    var randomArr = [];
    var balls = optballs.split("|");
    for (var i = 0,len1 = Math.pow(2, balls.length);i < len1;i++){
        var cur = [];
        for (var j = 0,len2 = balls.length;j < len2;j++){
            if (i >> j&1){
                cur.push(balls[j]);
            }
        }
        if (cur.length == 3){//3个号码
            randomArr.push(cur);
        }
    }
    var index = Math.ceil(Math.random()*99999) % randomArr.length;
    return randomArr[index].join("|");
}

function random9060102(optballs){
    var balls = optballs.split("|");
    var index = Math.ceil(Math.random()*99999) % balls.length;
    return balls[index]+"";
}

function random9060103(optballs){
    var balls = optballs.split("|");
    var index = Math.ceil(Math.random()*99999) % balls.length;
    return balls[index]+"";
}
function random9060104 (optballs) {
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
function random9060201(optballs){
    var randomArr = [];
    var balls = optballs.split("|");
    for (var i = 0,len1 = Math.pow(2, balls.length);i < len1;i++){
        var cur = [];
        for (var j = 0,len2 = balls.length;j < len2;j++){
            if (i >> j&1){
                cur.push(balls[j]);
            }
        }
        if (cur.length == 2){//2个号码
            randomArr.push(cur);
        }
    }
    var index = Math.ceil(Math.random()*(randomArr.length-1));
    return randomArr[index].join(",");
}

function random9060202(optballs){
    var randomArr = [];
    var balls = optballs.split("|");
    for (var i = 0,len1 = Math.pow(2, balls.length);i < len1;i++){
        var cur = [];
        for (var j = 0,len2 = balls.length;j < len2;j++){
            if (i >> j&1){
                cur.push(balls[j]);
            }
        }
        if (cur.length == 3){//3个号码
            randomArr.push(cur);
        }
    }
    var index = Math.ceil(Math.random()*(randomArr.length-1));
    return randomArr[index].join(",");
}

function random9070101(optballs){
    var randomArr = [];
    var balls = optballs.split("|");
    for (var i = 0,len1 = Math.pow(2, balls.length);i < len1;i++){
        var cur = [];
        for (var j = 0,len2 = balls.length;j < len2;j++){
            if (i >> j&1){
                cur.push(balls[j]);
            }
        }
        if (cur.length == 2){//2个号码
            randomArr.push(cur);
        }
    }
    var index = Math.ceil(Math.random()*9999) % randomArr.length;
    return randomArr[index].join("|");
}

function random9070102(optballs){
    var balls = optballs.split("|");
    var index = Math.ceil(Math.random()*9999) % balls.length;
    return balls[index]+"";
}

function random9070103(optballs){
    var balls = optballs.split("|");
    var index = Math.ceil(Math.random()*9999) % balls.length;
    return balls[index]+"";
}

function random9070201(optballs){
    var randomArr = [];
    var balls = optballs.split("|");
    for (var i = 0,len1 = Math.pow(2, balls.length);i < len1;i++){
        var cur = [];
        for (var j = 0,len2 = balls.length;j < len2;j++){
            if (i >> j&1){
                cur.push(balls[j]);
            }
        }
        if (cur.length == 2){//2个号码
            randomArr.push(cur);
        }
    }
    var index = Math.ceil(Math.random()*9999) % randomArr.length;
    return randomArr[index].join(",");
}

function random9070202(optballs){
    var balls = optballs.split("|");
    var index = Math.ceil(Math.random()*9999) % balls.length;
    return balls[index]+"";
}

function random9070203(optballs){
    var balls = optballs.split("|");
    var index = Math.ceil(Math.random()*9999) % balls.length;
    return balls[index]+"";
}

function random9080101(optballs){
    var randomArr = [];
    var balls = optballs.split("|");
    for (var i = 0,len1 = Math.pow(2, balls.length);i < len1;i++){
        var cur = [];
        for (var j = 0,len2 = balls.length;j < len2;j++){
            if (i >> j&1){
                cur.push(balls[j]);
            }
        }
        if (cur.length == 2){//2个号码
            randomArr.push(cur);
        }
    }
    var index = Math.ceil(Math.random()*9999) % randomArr.length;
    return randomArr[index].join("|");
}

function random9080102(optballs){
    var randomArr = [];
    var balls = optballs.split("|");
    for (var i = 0,len1 = Math.pow(2, balls.length);i < len1;i++){
        var cur = [];
        for (var j = 0,len2 = balls.length;j < len2;j++){
            if (i >> j&1){
                cur.push(balls[j]);
            }
        }
        if (cur.length == 2){//2个号码
            randomArr.push(cur);
        }
    }
    var index = Math.ceil(Math.random()*9999) % randomArr.length;
    return randomArr[index].join("|");
}

function random9080103(optballs){
    var randomArr = [];
    var balls = optballs.split("|");
    for (var i = 0,len1 = Math.pow(2, balls.length);i < len1;i++){
        var cur = [];
        for (var j = 0,len2 = balls.length;j < len2;j++){
            if (i >> j&1){
                cur.push(balls[j]);
            }
        }
        if (cur.length == 2){//2个号码
            randomArr.push(cur);
        }
    }
    var index = Math.ceil(Math.random()*(randomArr.length-1));
    var temp = randomArr[index];//选到随机三个号码
    //从可选号码中剔除随机选到的3个号码
    var leftballs = [];
    for(var i = 0,len1 = balls.length; i < len1; i++){
        if(randomArr[index].indexOf(balls[i]) < 0){
            leftballs.push(balls[i]);
        }
    }
    var twoindex = Math.ceil(Math.random()*9999) % leftballs.length;
    return leftballs[twoindex] + "|" + randomArr[index].join(",");
}

function random9080104(optballs){
    var randomArr = [];
    var balls = optballs.split("|");
    for (var i = 0,len1 = Math.pow(2, balls.length);i < len1;i++){
        var cur = [];
        for (var j = 0,len2 = balls.length;j < len2;j++){
            if (i >> j&1){
                cur.push(balls[j]);
            }
        }
        if (cur.length == 2){//3个号码
            randomArr.push(cur);
        }
    }
    var index = Math.ceil(Math.random()*(randomArr.length-1));
    var temp = randomArr[index];//选到随机三个号码
    //从可选号码中剔除随机选到的3个号码
    var leftballs = [];
    for(var i = 0,len1 = balls.length; i < len1; i++){
        if(randomArr[index].indexOf(balls[i]) < 0){
            leftballs.push(balls[i]);
        }
    }
    var twoindex = Math.ceil(Math.random()*9999) % leftballs.length;
    return randomArr[index].join(",") + "|" + leftballs[twoindex];
}

function random9080105(optballs){
    var randomArr = [];
    var balls = optballs.split("|");
    for (var i = 0,len1 = Math.pow(2, balls.length);i < len1;i++){
        var cur = [];
        for (var j = 0,len2 = balls.length;j < len2;j++){
            if (i >> j&1){
                cur.push(balls[j]);
            }
        }
        if (cur.length == 3){//3个号码
            randomArr.push(cur);
        }
    }
    var index = Math.ceil(Math.random()*(randomArr.length-1));
    var temp = randomArr[index];//选到随机三个号码
    //从可选号码中剔除随机选到的3个号码
    var leftballs = [];
    for(var i = 0,len1 = balls.length; i < len1; i++){
        if(randomArr[index].indexOf(balls[i]) < 0){
            leftballs.push(balls[i]);
        }
    }
    var twoindex = Math.ceil(Math.random()*9999) % leftballs.length;
    return leftballs[twoindex] + "|" + randomArr[index].join(",");
}

function random9080106(optballs){
    var randomArr = [];
    var balls = optballs.split("|");
    for (var i = 0,len1 = Math.pow(2, balls.length);i < len1;i++){
        var cur = [];
        for (var j = 0,len2 = balls.length;j < len2;j++){
            if (i >> j&1){
                cur.push(balls[j]);
            }
        }
        if (cur.length == 5){//5个号码
            randomArr.push(cur);
        }
    }
    var index = Math.ceil(Math.random()*9999) % randomArr.length;
    return randomArr[index].join(",");
}

function random9080201(optballs){
    var balls = optballs.split("|");
    var index = Math.ceil(Math.random()*9999) % balls.length;
    return balls[index]+"";
}

function random9080202(optballs){
    var randomArr = [];
    var balls = optballs.split("|");
    for (var i = 0,len1 = Math.pow(2, balls.length);i < len1;i++){
        var cur = [];
        for (var j = 0,len2 = balls.length;j < len2;j++){
            if (i >> j&1){
                cur.push(balls[j]);
            }
        }
        if (cur.length == 2){//2个号码
            randomArr.push(cur);
        }
    }
    var index = Math.ceil(Math.random()*9999) % randomArr.length;
    return randomArr[index].join(",");
}

function random9080203(optballs){
    var randomArr = [];
    var balls = optballs.split("|");
    for (var i = 0,len1 = Math.pow(2, balls.length);i < len1;i++){
        var cur = [];
        for (var j = 0,len2 = balls.length;j < len2;j++){
            if (i >> j&1){
                cur.push(balls[j]);
            }
        }
        if (cur.length == 3){//3个号码
            randomArr.push(cur);
        }
    }
    var index = Math.ceil(Math.random()*(randomArr.length-1));
    return randomArr[index].join(",");
}

function random9080301(optballs){
    var randomArr = [];
    var balls = optballs.split("|");
    for (var i = 0,len1 = Math.pow(2, balls.length);i < len1;i++){
        var cur = [];
        for (var j = 0,len2 = balls.length;j < len2;j++){
            if (i >> j&1){
                cur.push(balls[j]);
            }
        }
        if (cur.length == 5){//5个号码
            randomArr.push(cur);
        }
    }
    var index = Math.ceil(Math.random()*9999) % randomArr.length;
    return randomArr[index].join("|");
}

function random9080302(optballs){
    var randomArr = [];
    var balls = optballs.split("|");
    for (var i = 0,len1 = Math.pow(2, balls.length);i < len1;i++){
        var cur = [];
        for (var j = 0,len2 = balls.length;j < len2;j++){
            if (i >> j&1){
                cur.push(balls[j]);
            }
        }
        if (cur.length == 5){//5个号码
            randomArr.push(cur);
        }
    }
    var index = Math.ceil(Math.random()*9999) % randomArr.length;
    console.log('random', randomArr[index].join(""))
    return randomArr[index].join("");//单式以空格分割
}

module.exports = {
    '1010101': random1010101,
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
    '1040101': random1040101,
    '9010101': random9010101,
    '9010102': random9010102,
    '9010103': random9010103,
    '9010104': random9010104,
    '9020101': random9020101,
    '9020102': random9020102,
    '9020103': random9020103,
    '9020201': random9020201,
    '9020202': random9020202,
    '9020203': random9020203,
    '9030101': random9030101,
    '9030102': random9030102,
    '9040101': random9040101,
    '9040102': random9040102,
    '9050101': random9050101,
    '9010201': random9010201,
    '9010202': random9010202,
    '9060101': random9060101,
    '9060102': random9060102,
    '9060103': random9060103,
    '9060104': random9060104,
    '9060201': random9060201,
    '9060202': random9060202,
    '9070101': random9070101,
    '9070102': random9070102,
    '9070103': random9070103,
    '9070201': random9070201,
    '9070202': random9070202,
    '9070203': random9070203,
    '9080101': random9080101,
    '9080102': random9080102,
    '9080103': random9080103,
    '9080104': random9080104,
    '9080105': random9080105,
    '9080106': random9080106,
    '9080201': random9080201,
    '9080202': random9080202,
    '9080203': random9080203,
    '9080301': random9080301,
    '9080302': random9080302
}
