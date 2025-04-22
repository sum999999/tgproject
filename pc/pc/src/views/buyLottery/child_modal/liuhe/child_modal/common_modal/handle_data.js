let clr = ''
let red = [
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
]
let blue = [
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
]
let green = [
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
// let zodiac = [
//     {label: '鼠', data:['10', '22', '34', '46']},
//     {label: '牛', data:['09', '21', '33', '45']},
//     {label: '虎', data:['08', '20', '32', '44']},
//     {label: '兔', data:['07', '19', '31', '43']},
//     {label: '龙', data:['06', '18', '30', '42']},
//     {label: '蛇', data:['05', '17', '29', '41']},
//     {label: '马', data:['04', '16', '28', '40']},
//     {label: '羊', data:['03', '15', '27', '39']},
//     {label: '猴', data:['02', '14', '26', '38']},
//     {label: '鸡', data:['01', '13', '25', '37', '49']},
//     {label: '狗', data:['12', '24', '36', '48']},
//     {label: '猪', data:['11', '23', '35', '47']}
// ]

let mantissa = [
    { label: '尾1', data: ['01', '11', '21', '31', '41'] },
    { label: '尾2', data: ['02', '12', '22', '32', '42'] },
    { label: '尾3', data: ['03', '13', '23', '33', '43'] },
    { label: '尾4', data: ['04', '14', '24', '34', '44'] },
    { label: '尾5', data: ['05', '15', '25', '35', '45'] },
    { label: '尾6', data: ['06', '16', '26', '36', '46'] },
    { label: '尾7', data: ['07', '17', '27', '37', '47'] },
    { label: '尾8', data: ['08', '18', '28', '38', '48'] },
    { label: '尾9', data: ['09', '19', '29', '39', '49'] },
    { label: '尾0', data: ['10', '20', '30', '40'] }
]
let banbo = [
    {
        label: '红单',
        clr: '#ca1e1e',
        data: ['01', '07', '13', '19', '23', '29', '35', '45']
    },
    {
        label: '红双',
        clr: '#ca1e1e',
        data: ['02', '08', '12', '18', '24', '30', '34', '40', '46']
    },
    {
        label: '红大',
        clr: '#ca1e1e',
        data: ['29', '30', '34', '35', '40', '45', '46']
    },
    {
        label: '红小',
        clr: '#ca1e1e',
        data: ['01', '02', '07', '08', '12', '13', '18', '19', '23', '24']
    },
    {
        label: '蓝单',
        clr: '#057ce4',
        data: ['03', '09', '15', '25', '31', '37', '41', '47']
    },
    {
        label: '蓝双',
        clr: '#057ce4',
        data: ['04', '10', '14', '20', '26', '36', '42', '48']
    },
    {
        label: '蓝大',
        clr: '#057ce4',
        data: ['25', '26', '31', '36', '37', '41', '42', '47', '48']
    },
    {
        label: '蓝小',
        clr: '#057ce4',
        data: ['03', '04', '09', '10', '14', '15', '20']
    },
    {
        label: '绿单',
        clr: '#0b7607',
        data: ['05', '11', '17', '21', '27', '33', '39', '43']
    },
    {
        label: '绿双',
        clr: '#0b7607',
        data: ['06', '16', '22', '28', '32', '38', '44']
    },
    {
        label: '绿大',
        clr: '#0b7607',
        data: ['27', '28', '32', '33', '38', '39', '43', '44']
    },
    {
        label: '绿小',
        clr: '#0b7607',
        data: ['05', '06', '11', '16', '17', '21', '22']
    }
]
let banbanbo = [
    { label: '红大单', clr: '#ca1e1e', data: ['29', '35', '45'] },
    { label: '红大双', clr: '#ca1e1e', data: ['30', '34', '40', '46'] },
    { label: '红小单', clr: '#ca1e1e', data: ['01', '07', '13', '19', '23'] },
    { label: '红小双', clr: '#ca1e1e', data: ['02', '08', '12', '18', '24'] },
    { label: '蓝大单', clr: '#057ce4', data: ['25', '31', '37', '41', '47'] },
    { label: '蓝大双', clr: '#057ce4', data: ['26', '36', '42', '48'] },
    { label: '蓝小双', clr: '#057ce4', data: ['04', '10', '14', '20'] },
    { label: '蓝小单', clr: '#057ce4', data: ['03', '09', '15'] },
    { label: '绿小双', clr: '#0b7607', data: ['06', '16', '22'] },
    { label: '绿大双', clr: '#0b7607', data: ['28', '32', '38', '44'] },
    { label: '绿大单', clr: '#0b7607', data: ['27', '33', '39', '43'] },
    { label: '绿小单', clr: '#0b7607', data: ['05', '11', '17', '21'] }
]
let wuhang = [
    {
        label: '金',
        data: ['03', '04', '17', '18', '25', '26', '33', '34', '47', '48']
    },
    {
        label: '木',
        data: ['07', '08', '15', '16', '29', '30', '37', '38', '45', '46']
    },
    {
        label: '水',
        data: ['05', '06', '13', '14', '21', '22', '35', '36', '43', '44']
    },
    {
        label: '火',
        data: ['01', '02', '09', '10', '23', '24', '31', '32', '39', '40']
    },
    {
        label: '土',
        data: ['11', '12', '19', '20', '27', '28', '41', '42', '49']
    }
]
function addClr(data) {
    data.forEach(item => {
        let arr = []
        item.data.forEach(value => {
            if (red.some(item => item === value)) {
                clr = '#ca1e1e'
            } else if (blue.some(item => item === value)) {
                clr = '#057ce4'
            } else if (green.some(item => item === value)) {
                clr = '#0b7607'
            }
            arr.push({ ball: value, clr: clr })
        })
        item.data = arr
    })
    return data
}
import getZodiac from '@/utils/format-ball/zodica.js'
export default Object.assign(
    {},
    {
        red: red,
        blue: blue,
        green: green,
        zodiac: function(endTime) {
            return addClr(JSON.parse(JSON.stringify(getZodiac(endTime))))
        },
        mantissa: addClr(mantissa),
        banbo: banbo,
        banbanbo: banbanbo,
        wuhang: addClr(wuhang),
        editData: function(data, addClr) {
            //data包括特码b,特码a,其它
            let arr = []
            data.forEach(item => {
                item.children[0].layout.rates.forEach(value => {
                    if (addClr) {
                        if (red.some(clr => clr === value.ball)) {
                            value.clr = '#ca1e1e'
                        } else if (blue.some(clr => clr === value.ball)) {
                            value.clr = '#057ce4'
                        } else if (green.some(clr => clr === value.ball)) {
                            value.clr = '#0b7607'
                        }
                    }
                    value.lotteryBettingId = item.children[0].lotteryBettingId
                    value.bettingMoney = ''
                    value.showPrice = false
                    //上面三步对应tima_ab里create里的data
                })
                arr.push(item)
            })
            return JSON.parse(JSON.stringify(arr))
        }
    }
)
