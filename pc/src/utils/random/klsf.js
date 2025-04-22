function random8010101(optballs) {
	var balls = optballs.split("|");
	var index = Math.ceil(Math.random() * 999) % 18;
	return balls[index] + "";
}

function random8010102(optballs) {
	var balls = optballs.split("|");
	var index = Math.ceil(Math.random() * 999) % 2;
	return balls[index] + "";
}

function random8020101(optballs) {
	var balls1 = optballs.split("|");
	var index1 = Math.ceil(Math.random() * 999) % 20;
	var balls2 = optballs.split("|");
	balls2.splice(index1, 1);
	var index2 = Math.ceil(Math.random() * 999) % 19;
	return balls1[index1] + "|" + balls2[index2];
}

function random8020102(optballs) {
	var balls1 = optballs.split("|");
	var index1 = Math.ceil(Math.random() * 999) % 20;
	var balls2 = optballs.split("|");
	balls2.splice(index1, 1);
	var index2 = Math.ceil(Math.random() * 999) % 19;
	return balls1[index1] + "," + balls2[index2];
}


function random8030101(optballs) {
	var balls1 = optballs.split("|");
	var index1 = Math.ceil(Math.random() * 999) % 20;
	var balls2 = optballs.split("|");
	balls2.splice(index1, 1);
	var index2 = Math.ceil(Math.random() * 999) % 19;
	var balls3 = optballs.split("|");
	balls3.splice(index1, 1);
	balls3.splice(index2, 1);
	var index3 = Math.ceil(Math.random() * 999) % 18;
	return balls1[index1] + "|" + balls2[index2] + "|" + balls3[index3];
}

function random8030102(optballs) {
	var balls1 = optballs.split("|");
	var index1 = Math.ceil(Math.random() * 999) % 20;
	var balls2 = optballs.split("|");
	balls2.splice(index1, 1);
	var index2 = Math.ceil(Math.random() * 999) % 19;
	var balls3 = optballs.split("|");
	balls3.splice(index1, 1);
	balls3.splice(index2, 1);
	var index3 = Math.ceil(Math.random() * 999) % 18;
	return balls1[index1] + "," + balls2[index2] + "," + balls3[index3];
}

function random8040101(optballs) {
	var ret = [];
	var balls = optballs.split("|");
	var index1 = Math.ceil(Math.random() * 999) % balls.length;
	ret.push(balls.splice(index1, 1));
	var index2 = Math.ceil(Math.random() * 999) % balls.length;
	ret.push(balls.splice(index2, 1));
	return ret.join(",");
}

function random8040102(optballs) {
	var ret = [];
	var balls = optballs.split("|");
	var index1 = Math.ceil(Math.random() * 999) % balls.length;
	ret.push(balls.splice(index1, 1));
	var index2 = Math.ceil(Math.random() * 999) % balls.length;
	ret.push(balls.splice(index2, 1));
	var index3 = Math.ceil(Math.random() * 999) % balls.length;
	ret.push(balls.splice(index3, 1));
	return ret.join(",");
}

function random8040103(optballs) {
	var ret = [];
	var balls = optballs.split("|");
	var index1 = Math.ceil(Math.random() * 999) % balls.length;
	ret.push(balls.splice(index1, 1));
	var index2 = Math.ceil(Math.random() * 999) % balls.length;
	ret.push(balls.splice(index2, 1));
	var index3 = Math.ceil(Math.random() * 999) % balls.length;
	ret.push(balls.splice(index3, 1));
	var index4 = Math.ceil(Math.random() * 999) % balls.length;
	ret.push(balls.splice(index4, 1));
	return ret.join(",");
}

function random8040104(optballs) {
	var ret = [];
	var balls = optballs.split("|");
	var index1 = Math.ceil(Math.random() * 999) % balls.length;
	ret.push(balls.splice(index1, 1));
	var index2 = Math.ceil(Math.random() * 999) % balls.length;
	ret.push(balls.splice(index2, 1));
	var index3 = Math.ceil(Math.random() * 999) % balls.length;
	ret.push(balls.splice(index3, 1));
	var index4 = Math.ceil(Math.random() * 999) % balls.length;
	ret.push(balls.splice(index4, 1));
	var index5 = Math.ceil(Math.random() * 999) % balls.length;
	ret.push(balls.splice(index5, 1));
	return ret.join(",");
}

module.exports = {
	'8010101': random8010101,
	'8010102': random8010102,
	'8020101': random8020101,
	'8020102': random8020102,
	'8030101': random8030101,
	'8030102': random8030102,
	'8040101': random8040101,
	'8040102': random8040102,
	'8040103': random8040103,
	'8040104': random8040104
}
