function num8010101(betballs) {
	return betballs.split(",").filter(item => item);
}

function num8010102(betballs) {
	return betballs.split(",").filter(item => item);
}

function num8020101(betballs) {
	var ballsArr = betballs.split("|");
	if (ballsArr.length != 2 || !ballsArr[0] || !ballsArr[1]) {
		return {
			len: 0
		};
	}
	var len = 0;
	var balls1 = ballsArr[0].split(",");
	var balls2 = ballsArr[1].split(",");
	for (var i = 0; i < balls1.length; i++) {
		if (!balls1[i]) {
			continue
		}
		len += balls2.length;
		if (balls2.indexOf(balls1[i]) >= 0) {
			len -= 1;
		}
	}

	return {
		len: len
	};
}

function num8020102(betballs) {
	var balls = betballs.split(",");
	//排列组合Cm取2
	var a = balls.length * (balls.length - 1) / 2;
	return a > 0 ? {
		len: a
	} : {
		len: 0
	};
}

function num8030101(betballs) {
	var ballsArr = betballs.split("|");
	if (ballsArr.length != 3 || !ballsArr[0] || !ballsArr[1] || !ballsArr[2]) {
		return {
			len: 0
		};
	}
	var len = 0;
	var balls1 = ballsArr[0].split(",");
	var balls2 = ballsArr[1].split(",");
	var balls3 = ballsArr[2].split(",");
	for (var i = 0; i < balls1.length; i++) {
		if (!balls1[i]) {
			continue
		}
		for (var j = 0; j < balls2.length; j++) {
			if (!balls2[j] || balls2[j] == balls1[i]) {
				continue
			}
			len += balls3.length;
			if (balls3.indexOf(balls1[i]) >= 0) {
				len -= 1;
			}
			if (balls3.indexOf(balls2[j]) >= 0) {
				len -= 1;
			}
		}
	}

	return {
		len: len
	};
}

function num8030102(betballs) {
	var balls = betballs.split(",");
	//排列组合Cm取3
	var a = balls.length * (balls.length - 1) * (balls.length - 2) / 6;
	return a > 0 ? {
		len: a
	} : {
		len: 0
	};
}

function num8040101(betballs) {
	var balls = betballs.split(",");
	//排列组合Cm取2
	var a = balls.length * (balls.length - 1) / 2;
	return a > 0 ? {
		len: a
	} : {
		len: 0
	};
}

function num8040102(betballs) {
	var balls = betballs.split(",");
	//排列组合Cm取3
	var a = balls.length * (balls.length - 1) * (balls.length - 2) / 6;
	return a > 0 ? {
		len: a
	} : {
		len: 0
	};
}

function num8040103(betballs) {
	var balls = betballs.split(",");
	//排列组合Cm取4
	var a = balls.length * (balls.length - 1) * (balls.length - 2) * (balls.length - 3) / 24;
	return a > 0 ? {
		len: a
	} : {
		len: 0
	};
}

function num8040104(betballs) {
	var balls = betballs.split(",");
	//排列组合Cm取5
	var a = balls.length * (balls.length - 1) * (balls.length - 2) * (balls.length - 3) * (balls.length - 4) / 120;
	return a > 0 ? {
		len: a
	} : {
		len: 0
	};
}

module.exports = {
	'8010101': num8010101,
	'8010102': num8010102,
	'8020101': num8020101,
	'8020102': num8020102,
	'8030101': num8030101,
	'8030102': num8030102,
	'8040101': num8040101,
	'8040102': num8040102,
	'8040103': num8040103,
	'8040104': num8040104
}
