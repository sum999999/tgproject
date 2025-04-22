export default {
  data() {
    return {
      option: {
        // 2019 1.1 by xiaojiji  可选日期从今天往前3个月
        disabledDate(date) {
          if (!date) return false
          let selectTime = date.getTime()
          let startTime = new Date()
          let endTime = new Date().getTime()
          startTime.setMonth(startTime.getMonth() - 3)
          startTime = startTime.getTime() - 1000 * 60 * 60 * 24
          return selectTime > endTime || selectTime < startTime
        },
      },
      optionEndTime: {
        disabledDate(date) {
          if (!date) return false
          return date.getTime() > Date.now()
        },
      },
    }
  },
}
