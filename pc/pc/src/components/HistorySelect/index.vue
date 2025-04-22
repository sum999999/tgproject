<template>
  <Select v-model="date">
    <Option v-for="item in list"
            :value="item.value"
            :key="item.value">{{ item.label }}</Option>
  </Select>
</template>

<script>
import { getToday } from "@/utils/date.js";
import { convert2LocalDateTime, convert2ServerDateTime } from "@/filters";

export default {
  name: 'HistorySelect',
  props: {
    value: {
      type: String,
      default: '今天'
    }
  },
  data () {
    return {
      list: [
        {
          value: "日期",
          label: this.$tex("日期")
        },
        {
          value: '今天',
          label: this.$tex('今天')
        },
        {
          value: '昨天',
          label: this.$tex('昨天')
        },
        {
          value: '本周',
          label: this.$tex('本周')
        },
        {
          value: '上周',
          label: this.$tex('上周')
        },
        {
          value: '本月',
          label: this.$tex('本月')
        },
        {
          value: '上月',
          label: this.$tex('上月')
        },
      ],
    }
  },
  computed: {
    date: {
      get() {
        return this.value;
      },
      set(val) {
        this.selectType(val);
        this.$emit("input", val);
      }
    },
  },
  methods: {
    selectType (type) {
      let obj = {};
      let days = 0;
      let currentDate = new Date();
      let currentDay = currentDate.getDay();
      if (currentDay === 0) currentDay = 7;
      switch (type) {
        case '今天':
          days = 0;
          obj.endTime = convert2ServerDateTime(getToday().endTime);
          break;
        case '昨天':
          days = 1;
          currentDate.setHours(23);
          currentDate.setMinutes(59);
          currentDate.setSeconds(59);
          obj.endTime = convert2ServerDateTime(currentDate.getTime() - days * 24 * 3600 * 1000);
          break;
        case '本周':
          days = currentDay - 1;
          obj.endTime = convert2ServerDateTime(getToday().endTime);
          break;
        case '上周':
          currentDate.setHours(23);
          currentDate.setMinutes(59);
          currentDate.setSeconds(59);
          obj.endTime = convert2ServerDateTime(currentDate.getTime() - currentDay * 24 * 3600 * 1000);
          days = currentDay + 6;
          break;
        case '本月':
          days = currentDate.getDate() - 1;
          obj.endTime = convert2ServerDateTime(getToday().endTime);
          break;
        case '上月':
          let lastMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
          let lastMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
          const endTime = new Date(convert2ServerDateTime(lastMonthEnd));
          endTime.setHours(23);
          endTime.setMinutes(59);
          endTime.setSeconds(59);
          obj.endTime = endTime;
          days = (currentDate.getTime() - lastMonthStart.getTime()) / 24 / 60 / 60 / 1000;
          break;
        default:
          this.$emit('get-history-select', null);
          return;
      }

      const startTime = new Date(convert2ServerDateTime(currentDate.getTime() - days * 24 * 3600 * 1000));
      startTime.setHours(0);
      startTime.setMinutes(0);
      startTime.setSeconds(0);
      obj.startTime = startTime;
      this.$emit('get-history-select', obj)
    }
  }
}
</script>
