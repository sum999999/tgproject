function random12010101(optballs){
  var balls = optballs.split("|");
  var index = Math.ceil(Math.random()*9999)%3;
  return balls[index]+"";
}

function random12020101(optballs){
  var balls = optballs.split("|");
  var index = Math.ceil(Math.random()*(balls.length - 1));
  return balls[index]+"";
}

module.exports = {
  '12010101': random12010101,
  '12020101': random12020101
}
