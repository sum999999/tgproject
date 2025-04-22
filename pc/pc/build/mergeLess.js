var fs = require('fs')
const path = require('path')

//文件遍历方法
function mergeLessFile(dev) {
    var srcPath = path.join(__dirname, '../src/styles/theme/')
    var outPath = path.join(__dirname, '../static/css/theme.less')
    var viewPath = path.join(__dirname, '../node_modules/iview/src/styles')

    //根据文件路径读取文件，返回文件列表
    /*   if (dev) {
        outPath = path.join(__dirname, '../static/css/color.less') //path.resolve('../pc/static/css/color.less')
    } */
    if (fs.existsSync(outPath)) {
        fs.writeFileSync(outPath, '')
    }

    fileDirectorys(viewPath, outPath)
    fileDirectorys(srcPath, outPath, true)
}

function fileDirectorys(inFile, outPath, filter) {
    if (!fs.existsSync(inFile)) {
        console.log(inFile, '文件不存在')
        return
    }
    const regExp = /[@|\{\}|\&|,|(\*)|(*\)|(\\)]|(\.[A-Za-z])/

    if (!fs.existsSync(outPath)) {
        fs.writeFileSync(outPath, '')
    }
    const files = fs.readdirSync(inFile)
    //遍历读取到的文件列表
    files.forEach(function(filename) {
        //获取当前文件的绝对路径
        const filedir = path.join(inFile, filename)
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        const stats = fs.statSync(filedir)
        const isFile = stats.isFile() //是文件
        const isDir = stats.isDirectory() //是文件夹
        if (isFile) {
            var content = fs.readFileSync(filedir, 'utf-8')
            var isNeed = false
            if (path.extname(filedir) === '.less') {
                isNeed = true
            } else if (path.extname(filedir) === '.vue') {
                if (content.includes('less')) {
                    const strArr = content.match(
                        /\<style[\D\d]+(\<\/style\>)+/gm
                    )
                    isNeed = true
                    content = strArr[0].replace(/<[^>]+>/g, '')
                }
            }
            if (isNeed) {
                content = content
                    .replace(/>>>/gim, '')
                    .replace(/@import.*;/gim, '')
                    .replace(/background.*?url(.*)(.|\s)*?(?<=;)/gim, '')
                    .replace(/@{deep}\((.*?)\)/gim, '$1')
                content = content.split('\n')
                if (filter) {
                    content = content.filter(
                        item => item.indexOf('transform') <= -1
                    )
                } else {
                    content = content.filter(
                        item =>
                            item.search(regExp) > -1 &&
                            item.indexOf('transform') <= -1 &&
                            item.indexOf('@{ionicons-font-path}') <= -1
                    )
                }

                fs.appendFile(
                    outPath,
                    '\n' + content.join('\n'),
                    'utf-8',
                    () => {}
                )
            }
        }
        if (isDir) {
            fileDirectorys(filedir, outPath) //递归，如果是文件夹，就继续遍历该文件夹下面的文件
        }
    })
}

module.exports = mergeLessFile
