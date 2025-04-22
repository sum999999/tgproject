const SM_SINGLE = 24;
const SUM_SINGLE = 6;
const zodiac = liuhe.zodiac();
import liuhe from "../common_modal/handle_data.js";
export default {
    data() {

    },
    methods:{
         /**
     * 改变默认单注金额
     * flag=true表示恢复默认
     */
    changeSingleMoney(val,flag) {
        this.setBetMoney = val;
         this.numBalls.forEach(item =>{
           item.bettingMoney && (item.bettingMoney = flag ? '' : val);
         })
         if(flag) {
           let numInpts = this.$refs['numIpt'];
           numInpts.forEach(item =>{
             let ipt = item.$el.getElementsByTagName('input')[0];
             ipt.hasAttribute('disabled') && ipt.removeAttribute('disabled');
           })
         }
     },
     /**
      * 快捷投注选号
      */
     selectBetType(item) {
        //  debugger;
       // console.log(label);
       this.setBetNumber(item);
     },
     /**
      * 是否显示快捷投注菜单
      */
     toggleFstMenu(flag) {
       this.isShowFastBetMenu = flag;
     },
        setBetNumber({label,title}) {
            let numIpts = this.$refs['numIpt'];
            let numBalls = this.numBalls;
            let maxBetNum = this.maxBetNum;
            let selectLen = 0;
            switch (label) {
                case 'single':
                case 'double':
                case 'sm-single':
                case 'sm-double':
                case 'big-single':
                case 'big-double':
                case 'sum-single':
                case 'sum-double':
                    for(let i = 0,len = numBalls.length;i<len;i++){
                        let item = numBalls[i];
                        let flag = item.ball % 2 === 0;
                        //排除的条件flag
                        if(label === 'sm-double' || label === 'double' || label === 'big-double') {
                            flag = item.ball % 2 !== 0;
                        }
                        if(label === 'sum-single' || label === 'sum-double') {
                            let ballArr = item.ball.split('');
                            let sum = ballArr.reduce((pre,curr) => Number(curr) + pre,0);
                            flag = sum % 2 === 0;
                            if(label === 'sum-double') {
                                flag = sum % 2 !== 0;
                            }
                        }
                        if(label === 'sm-single' || label === 'sm-double') {
                            if(item.ball > SM_SINGLE) {
                                item.bettingMoney && (item.bettingMoney = '');
                                continue;
                            }
                        } 
                        if(label === 'big-single' || label === 'big-double') {
                            if(item.ball <= SM_SINGLE) {
                                item.bettingMoney && (item.bettingMoney = '');
                                continue;
                            }
                        }
                        if(flag) {
                            item.bettingMoney && (item.bettingMoney = '');
                            continue;
                        }
                        !item.bettingMoney && ( item.bettingMoney = this.setBetMoney);
                        selectLen++;
                    }
                    judgeSelectBall(selectLen)
                    break;
                case 'big':
                case 'small':
                case 'sum-big':
                case 'sum-small':
                    for(let i = 0,len = numBalls.length;i<len;i++){
                        let item = numBalls[i];
                        let flag = item.ball <= SM_SINGLE;
                        if(label === 'small') {
                            flag = item.ball >SM_SINGLE;
                        }
                        if(label === 'sum-big' || label === 'sum-small') {
                           let ballArr = item.ball.split('');
                           let sum = ballArr.reduce((pre,curr) => Number(curr) + pre,0);
                           flag = sum > SUM_SINGLE;
                           if(label === 'sum-big') {
                            flag = sum <= SUM_SINGLE;
                           }
                        }
                        if(flag) {
                            item.bettingMoney && (item.bettingMoney = '');
                            continue;
                        }
                        !item.bettingMoney && (item.bettingMoney=this.setBetMoney);
                        selectLen++;
                    }
                    judgeSelectBall(selectLen)
                    break;
                case 'start0':
                case 'start1':
                case 'start2':
                case 'start3':
                case 'start4':
                case 'end0':
                case 'end1':
                case 'end2':
                case 'end3':
                case 'end4':
                case 'end5':
                case 'end6':
                case 'end7':
                case 'end8':
                case 'end9':
                    let num = label.slice(-1);
                    let loc = label.slice(0,label.length-1);
                    for(let i = 0,len = numBalls.length;i<len;i++){
                        let item = numBalls[i];
                        let ballArr = item.ball.split('');
                        let splitIndex = loc === 'start' ? 0 : 1;
                        let flag = ballArr[splitIndex] !== num;
                        if(flag) {
                            item.bettingMoney && (item.bettingMoney = '');
                            continue;
                        }
                        !item.bettingMoney && (item.bettingMoney=this.setBetMoney);
                        selectLen++;
                    }
                    judgeSelectBall(selectLen)
                    break;
                case 'mouse':
                case 'cattle':     
                case 'tiger':
                case 'rabbit':
                case 'dragon':
                case 'snake':
                case 'horse':
                case 'sheep': 
                case 'monkey':
                case 'chicken':     
                case 'dog':
                case 'pig':
                    for(let i = 0,len = numBalls.length;i<len;i++){
                        let item = numBalls[i];
                        if(!item.zodiac) {
                            one:for(let j =0,len = zodiac.length; j<len;j++) {
                                let data = zodiac[j].data;
                                for(let k=0,len2= data.length;k<len2;k++) {
                                    if(data[k].ball === item.ball) {
                                        item.zodiac = {
                                            label:zodiac[j].label,
                                            clr:zodiac[j].clrs[k]
                                        }
                                        break one;
                                    }
                                }
                            }
                        }
                        if(title !== item.zodiac.label) {
                            item.bettingMoney && (item.bettingMoney = '');
                            continue;
                        }
                        !item.bettingMoney && (item.bettingMoney=this.setBetMoney);
                        selectLen++;
                    }
                    judgeSelectBall(selectLen)
                    break;
                case 'red':
                case 'red-single':
                case 'red-double':
                case 'red-big':
                case 'red-small':
                case 'blue':
                case 'blue-single':
                case 'blue-double':
                case 'blue-big':
                case 'blue-small':    
                case 'green':
                case 'green-single':
                case 'green-double':
                case 'green-big':
                case 'green-small':
                    let extra;
                    if(label.includes('-')) {
                        let splitStr = label.split('-');
                        extra = splitStr[1];
                        label = splitStr[0];
                    }  
                    for(let i = 0,len = numBalls.length;i<len;i++){
                        let item = numBalls[i];
                        if(!item.zodiac) {
                            one:for(let j =0,len = zodiac.length; j<len;j++) {
                                let data = zodiac[j].data;
                                for(let k=0,len2= data.length;k<len2;k++) {
                                    if(data[k].ball === item.ball) {
                                        item.zodiac = {
                                            label:zodiac[j].label,
                                            clr:zodiac[j].clrs[k]
                                        }
                                        break one;
                                    }
                                }
                            }
                        }
                        if(label !== item.zodiac.clr) {
                            item.bettingMoney && (item.bettingMoney = '');
                            continue;
                        }
                        !item.bettingMoney && (item.bettingMoney=this.setBetMoney);
                        selectLen++;
                        switch(extra) {
                            case 'single':
                                item.ball % 2 === 0 && item.bettingMoney && (item.bettingMoney='');
                                break;
                            case 'double':
                                item.ball % 2 !== 0 && item.bettingMoney &&(item.bettingMoney='');
                                break;
                            case 'big':
                                item.ball <= SM_SINGLE && item.bettingMoney &&(item.bettingMoney='');
                                break;
                            case 'small':
                                item.ball > SM_SINGLE && item.bettingMoney &&(item.bettingMoney='');
                        }
                    }
                    judgeSelectBall(selectLen)
                    break;
                case 'all':
                    for(let i=0,len=numBalls.length;i<len;i++) {
                        let ball = numBalls[i];
                        let input = getInut(numIpts[i]);
                        if(i< this.maxBetNum) {
                            !ball.bettingMoney && (ball.bettingMoney = this.setBetMoney);
                            input.hasAttribute('disabled') && input.removeAttribute('disabled');
                        } else {
                            ball.bettingMoney && (ball.bettingMoney = '');
                            !input.hasAttribute('disabled') && input.setAttribute('disabled', true);
                        }
                    }
                    break;
                case 'inverse':
                    for(let i=0,len=numBalls.length;i<len;i++) {
                        if(numBalls[i].bettingMoney) {
                            numBalls[i].bettingMoney = '';
                            continue;
                        } 
                        numBalls[i].bettingMoney = this.setBetMoney;
                        selectLen++;
                    }
                    judgeSelectBall(selectLen);
                    break;
                case 'cancel':
                    numBalls.forEach(item =>{
                        item.bettingMoney && (item.bettingMoney = '');
                    })
                    numIpts.forEach(item =>{
                        let input = getInut(item);
                        input.hasAttribute('disabled') && input.removeAttribute('disabled');
                    })
                default:
                    break;
            }
            function getInut(ele) { //获取input的值
               return ele.$el.getElementsByTagName('input')[0];
            }
            function judgeSelectBall(selectLen){ //处理超出的号码
                if(selectLen>maxBetNum) { //选择的号码大于最大投注数
                    for(let i=numBalls.length-1;i>=0;i--) {
                        if(numBalls[i].bettingMoney) {
                            numBalls[i].bettingMoney = '';
                            let input = getInut(numIpts[i]);
                            input.setAttribute('disabled', true);
                            selectLen--;
                            if(selectLen === maxBetNum) {
                                for(let j=0;j<i;j++) {
                                    if(!numBalls[j].bettingMoney) {
                                        let input = getInut(numIpts[j]);
                                        input.setAttribute('disabled', true);
                                    } else {
                                        let input = getInut(numIpts[j]);
                                        input.removeAttribute('disabled');
                                    }
                                }
                               break;
                            }
                        } else {
                            let input = getInut(numIpts[i]);
                            input.setAttribute('disabled', true);
                        }
                    }
                } else if(selectLen === maxBetNum){ //选择的号码等于最大投注数
                    for(let i=numBalls.length-1;i>=0;i--) {
                        if(!numBalls[i].bettingMoney) {
                            let input = getInut(numIpts[i]);
                            input.setAttribute('disabled', true);
                        } else {
                            let input = getInut(numIpts[i]);
                            input.removeAttribute('disabled');
                        }
                    }
                }
                 else if(selectLen < maxBetNum) { //选择的号码小于最大值
                    for(let i=numBalls.length-1;i>=0;i--) {
                        if(!numBalls[i].bettingMoney) {
                            let input = getInut(numIpts[i]);
                            input.removeAttribute('disabled');
                        }else {
                            let input = getInut(numIpts[i]);
                            input.removeAttribute('disabled');
                        }
                    }
                }
            }
        } 
    }
}