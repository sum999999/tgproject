import context from "@/main";

let category = [context.$tex('牛牛'), context.$tex('牛一'), context.$tex('牛二'), context.$tex('牛三'), context.$tex('牛四'), context.$tex('牛五'), context.$tex('牛六'), context.$tex('牛七'), context.$tex('牛八'), context.$tex('牛九'), context.$tex('无牛')];

function bullfightingCount (arr) {
    arr = arr.map(function (item) {
        return Number(item)
    })
    for (let i = 0, len = arr.length - 3; i <= len; i++) {
        for (let j = i + 1, len1 = arr.length - 2; j <= len1; j++) {
            for (let k = j + 1, len2 = arr.length - 1; k <= len2; k++) {
                let choiceSum = arr[i] + arr[j] + arr[k];
                if (choiceSum % 10 === 0) {
                    let totalSum = arr.reduce((preValue, curValue) => {
                        return preValue + curValue
                    }, 0);
                    let count = (totalSum - choiceSum) % 10;
                    return category[count];
                }
                if (i === len && j === len1 && k === len2) {
                    return category[category.length - 1];
                }
            }
        }
    }
}

function formatSsc (balls) {
    let des = {
        sum: 0,
        size: context.$tex('小'),
        num: context.$tex('单')
    };
    let sum = balls.reduce((acc, val) => {
        return acc + parseInt(val);
    }, 0)
    des.sum = sum;
    if (sum > 22) {
        des.size = context.$tex('大');
    }
    if (sum % 2 === 0) {
        des.num = context.$tex('双')
    }
    des.niuniu = bullfightingCount(balls);
    return des;
}

export {
    formatSsc
}
