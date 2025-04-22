<template>
  <div class="header-date">
    <span>{{currDate}} {{currTime}}</span>
  </div>
</template>

<script>
import DateUtil from "@/utils/format_date.js";
export default {
  data() {
    return {
      currDate: "",
      currDay: "",
      currTime: "",
      calcuteDateTimer: ""
    };
  },
  computed: {
    curDayFormat() {
      return this.$tex(`星期${this.currDay}`);
    }
  },
  created() {
    this.calcuteDate();
    this.calcuteDateTimer = setInterval(this.calcuteDate, 1000);
  },
  methods: {
    calcuteDate() {
      const days = ["日", "一", "二", "三", "四", "五", "六"];
      const dt = new Date();
      this.currDay = days[dt.getDay()];
      let timeStr = DateUtil.getFormatDate(dt, "yymmddhhmmss");
      timeStr = timeStr.split(/\s/);
      this.currDate = timeStr[0].replace(/-/g, "/");
      this.currTime = timeStr[1];
    }
  },
  beforeCreate() {
    this.calcuteDateTimer && clearInterval(this.calcuteDateTimer);
  }
};
</script>

