const fs = require("fs");
var readline = require('readline');
const objs = require("../src/lang/zh_CN.js");
// const data = [];
// for (let key in objs) {
//   const value = objs[key] || JSON.stringify(objs[key]);
//   data.push(value);
// }
// fs.writeFile("./zh.txt", data.join("\n"), function(err) {
//   console.log(err)
// })

function readFileToArr(fReadName,callback){
  var fRead = fs.createReadStream(fReadName);
  var objReadline = readline.createInterface({
    input:fRead
  });
  var arr = new Array();
  objReadline.on('line',function (line) {
    arr.push(line);
    //console.log('line:'+ line);
  });
  objReadline.on('close',function () {
    // console.log(arr);
    callback(arr);
  });
}

function a2() {
  readFileToArr("./zh.txt", (arr) => {
    const keys = []
    for (let key in objs) {
      keys.push(key);
    }
    for (let i = 0; i < arr.length; i++) {
      const key = keys[i];
      objs[key] = arr[i];
    }
    let strs = []
    for (let key in objs) {
      let value = objs[key];
      key = key.replace(/'/img, "\\'")
      value = value.replace(/'/img, "\\'")
      if (key.includes('"')) {
        key = `'${key}'`
      } else {
        key = `"${key}"`
      }
      if (value.includes('"')) {
        value = `'${value}'`
      } else {
        value = `"${value}"`
      }
      strs.push(`[${key}]: ${value}`)
    }
    var str = `export default { ${strs.join(",")} }`
    // console.log("objs", objs)
    fs.writeFile("./zh2.txt", str, function(err) {
      console.log(err)
    })
  })
}

a2();
