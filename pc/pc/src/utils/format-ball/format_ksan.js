import context from "@/main";

function formatKsan (balls) {
    let des = { sumVal: `${context.$tex("和值")}=`, sum: 0, size: context.$tex('小'), num: context.$tex('单') };
    let sum = balls.reduce((acc, val) => {
        return acc + parseInt(val);
    }, 0);
    des.sum = sum;
    if (sum > 10) {
        des.size = context.$tex("大");
    }
    if (sum % 2 === 0) {
        des.num = context.$tex('双');
    }

    return des;
}

export default formatKsan;
