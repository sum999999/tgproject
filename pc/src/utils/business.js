import getZodiac from '@/utils/format-ball/zodica.js'

let LIU_HE = {
    red: [
        '01',
        '02',
        '07',
        '08',
        '12',
        '13',
        '18',
        '19',
        '23',
        '24',
        '29',
        '30',
        '34',
        '35',
        '40',
        '45',
        '46'
    ],
    blue: [
        '03',
        '04',
        '09',
        '10',
        '14',
        '15',
        '20',
        '25',
        '26',
        '31',
        '36',
        '37',
        '41',
        '42',
        '47',
        '48'
    ],
    green: [
        '05',
        '06',
        '11',
        '16',
        '17',
        '21',
        '22',
        '27',
        '28',
        '32',
        '33',
        '38',
        '39',
        '43',
        '44',
        '49'
    ]
}
let PCDD = {
    green: ['1', '4', '7', '10', '16', '19', '22', '25'],
    blue: ['2', '5', '8', '11', '17', '20', '23', '26'],
    red: ['3', '6', '9', '12', '15', '18', '21', '24'],
    gray: ['0', '13', '14', '27']
}

function setLiuheColor(data, time) {
    let arr = []
    let zodiac = getZodiac(time + '')
    data.forEach(item => {
        let zTxt, clr
        zodiac.forEach(value => {
            if (value.data.some(vvv => vvv === item)) {
                zTxt = value.label
            }
        })
        // 计算红波绿波蓝波
        for (var key in LIU_HE) {
            if (LIU_HE[key].some(value => item === value)) {
                clr = key
            }
        }
        arr.push({
            zodiac: zTxt,
            clr: clr
        })
    })
    return arr
}

function setPcddColor(data) {
    let arr = [],
        clr = ''
    for (let i = 0; i < data.length; i++) {
        clr = ''
        if (i === data.length - 1) {
            for (let key in PCDD) {
                if (PCDD[key].indexOf(String(data[i])) > -1) {
                    clr = key === 'red' ? '#d11606' : key
                }
            }
        }
        arr.push({
            clr: clr
        })
    }
    return arr
}

function setBallStyle(element) {
    if (!element || !element.lotteryNumber) return
    element.clr = []
    if (element.code === '6hc') {
        let num = element.lotteryNumber.split(',')
        let lastNumbers = num[num.length - 1].split('+')
        num[num.length - 1] = lastNumbers[0]
        num.push('+')
        num.push(lastNumbers[1])
        element.info = setLiuheColor(num, element.lastPrizeTime)
        element.dispNumber = num
    } else if (element.code === 'pcdd') {
        let num = element.lotteryNumber.replace(/,/g, '+')
        let lastNumber = 0
        element.dispNumber = []
        for (let i = 0; i < num.length; i++) {
            let current = num.slice(i, i + 1)
            if (parseInt(current)) lastNumber += parseInt(current)
            element.dispNumber.push(current)
        }
        element.dispNumber.push('=')
        element.dispNumber.push(lastNumber)
        element.info = setPcddColor(element.dispNumber)
    } else {
        element.dispNumber = element.lotteryNumber.split(',')
    }
}

export default {
    setBallStyle: setBallStyle,
    liuHeColor: LIU_HE,
    pcddColor: PCDD
}
