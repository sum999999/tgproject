/**
 * 基本走势图
 * id:存放canvas的容器
 * origin:画图的起始元素
 * reclyCount：canvas的列数
 * trendList:处理的数据
 */
const colors = ["#3f99f2", "#FF0000"];
export function getCanvasLine (context, wrapId, eleRef, reclyCount, trendList) {
    // 获取table元素
    var tabBody = document.getElementById(wrapId);
    var width = tabBody.clientWidth;
    var height = tabBody.clientHeight;
    var canvas;
    var canvasTxt;
    var beforeX, beforeY;
    var fragment = document.createDocumentFragment();
    for (var j = 1; j <= reclyCount; j++) { //10表示绘制10张图
        for (var i = 0; i < trendList.length; i++) {
            let leeParent = null;
            if (reclyCount === 1) {
                leeParent = context.$refs[eleRef + i] && context.$refs[eleRef + i][0].parentNode;
            } else {
                leeParent = context.$refs[eleRef + i + j] && context.$refs[eleRef + i + j][0].parentNode;
            }
              if (!leeParent) {
                  continue;
              }
            // let leeParent = context.$refs[eleRef + i + j][0].parentNode;
            let leftLee = parseInt(leeParent.offsetLeft + leeParent.clientWidth / 2);
            let Leetop = parseInt(leeParent.offsetTop + leeParent.clientHeight / 2);
            if (i <= 0) {
                beforeX = leftLee
                beforeY = Leetop
            } else {
                canvas = document.createElement("canvas");
                canvasTxt = canvas.getContext("2d");
                canvas.id = reclyCount == 1 ? "table-canvas" + i : "table-canvas" + j + i;
                let dix, diy;
                dix = leftLee - beforeX;//x轴方向的差值
                diy = Leetop - beforeY;//y轴方向的差值

                fragment.appendChild(canvas);
                canvas.width = Math.abs(dix);
                canvas.height = diy;
                if (dix === 0) {
                    canvas.width = 2;
                    canvas.style.left = `${beforeX}` + 'px';
                    canvas.style.top = `${beforeY}` + 'px';
                    canvasTxt.moveTo(0, 0);
                    canvasTxt.lineTo(1, diy);
                } else if (dix < 0) {
                    canvas.style.left = `${leftLee}` + 'px';
                    canvas.style.top = `${Leetop - diy}` + 'px';
                    canvasTxt.moveTo(-dix, 0);
                    canvasTxt.lineTo(0, diy);
                } else {
                    canvas.style.left = `${beforeX}` + 'px';
                    canvas.style.top = `${beforeY}` + 'px';
                    canvasTxt.moveTo(0, 0);
                    canvasTxt.lineTo(dix, diy);
                }

                canvasTxt.lineWidth = 2; // 设置线宽
                canvasTxt.lineCap = "butt"; //设置端点样式:butt(默认),round,square
                canvasTxt.lineJoin = "miter"; //设置连接样式:miter(默认),bevel,round
                canvasTxt.strokeStyle = j % 2 === 0 ? colors[1] : colors[0]; // 设置线的颜色
                canvasTxt.stroke(); // 进行线的着色，这时整条线才变得可见
                beforeX = leftLee
                beforeY = Leetop
            }
        }

    }
    tabBody.appendChild(fragment);
}
