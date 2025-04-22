const fs = require("fs");
var readline = require('readline');

function unique (arr) {
    return Array.from(new Set(arr))
}

function getUnicodeArr(str) {
    const regxArr = [];
    str.match(/[\u4e00-\u9fa5]*/igm).forEach(str => {
        const tmp = str.trim()
        tmp && regxArr.push(tmp)
    })
    return unique(regxArr);
}

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

readFileToArr("./unicode.txt", (arr) => {
    const unicodeArr = getUnicodeArr(arr.join(''))
    console.log('unicodeArr', unicodeArr)
    // console.log("objs", objs)
    fs.writeFile("./unicode2.txt", unicodeArr.join('\n'), function(err) {
        console.log(err)
    })
})