import context from "@/main";

const CONFIG_PK_10 = {
    maxBall: 10,//最大刻度值
    label: 2,//刻度数
    title: [context.$tex('冠军'), context.$tex('亚军'), context.$tex('季军'), context.$tex('第四名'), context.$tex('第五名'), context.$tex('第六名'), context.$tex('第七名'), context.$tex('第八名'), context.$tex('第九名'), context.$tex('第十名')],
    getRankNumber: function (arr, index) { //index:号码索引
        let [numbers, periodNos] = [[], []];
        arr.forEach(item => {
            numbers.push(item.lotteryNumber.split(',')[index] * 1);
            periodNos.push(item.periodNo.slice(-3));
        });
        return [numbers, periodNos]
    }
};
const CONFIG_SSC = {
    maxBall: 10,//最大刻度值
    label: 2,//刻度数
    title: [context.$tex('第一球'), context.$tex('第二球'), context.$tex('第三球'), context.$tex('第四球'), context.$tex('第五球')],
    getRankNumber: function (arr, index) { //index:号码索引
        let [numbers, periodNos] = [[], []];
        arr.forEach(item => {
            numbers.push(item.lotteryNumber.split(',')[index] * 1);
            periodNos.push(item.periodNo.slice(-3));
        });
        return [numbers, periodNos]
    }
}
const CONFIG_11x5 = {
    maxBall: 15,//最大刻度值
    label: 3,//刻度数
    title: [context.$tex('第一球'), context.$tex('第二球'), context.$tex('第三球'), context.$tex('第四球'), context.$tex('第五球')],
    getRankNumber: function (arr, index) { //index:号码索引
        let [numbers, periodNos] = [[], []];
        arr.forEach(item => {
            numbers.push(item.lotteryNumber.split(',')[index] * 1);
            periodNos.push(item.periodNo.slice(-3));
        });
        return [numbers, periodNos]
    }
}
const CONFIG_KSAN = {
    maxBall: 6,//最大刻度值
    label: 3,//刻度数
    title: [context.$tex('第一球'), context.$tex('第二球'), context.$tex('第三球')],
    getRankNumber: function (arr, index) { //index:号码索引
        let [numbers, periodNos] = [[], []];
        arr.forEach(item => {
            numbers.push(item.lotteryNumber.split(',')[index] * 1);
            periodNos.push(item.periodNo.slice(-3));
        });
        return [numbers, periodNos]
    }
}

export default {
    "pk10": CONFIG_PK_10,
    "ssc": CONFIG_SSC,
    "11x5": CONFIG_11x5,
    "ksan": CONFIG_KSAN
}
