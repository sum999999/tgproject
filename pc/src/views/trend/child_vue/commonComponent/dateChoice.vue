<template>
  <div class="date-wrap">
    <div class="date-title-wrap">
      <ul>
        <li
          v-for="(item,index) in dates"
          :key="index"
          @click="searchByDate(index)"
          :class="{'active':dateIndex===index}"
        >{{item}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
import formatDate from "@/utils/format_date.js";
import dateUtil from "@/utils/date.js";
export default {
  props: {
    lotteryId: {
      type: String
    }
  },
  data() {
    return {
      dateIndex: 0,
      dates: [this.$tex("今天"), this.$tex("昨天"), this.$tex("前天"), this.$tex("最近30期"), this.$tex("最近60期"), this.$tex("最近90期")],
      params: {
        time: "",
        num: "200"
      }
    };
  },
  methods: {
    /**
     * 按日期搜索
     */
    searchByDate(index) {
      if (this.dateIndex === index) return;
      this.dateIndex = index;
      if (index < 3) {
        this.$set(
          this.params,
          "time",
          formatDate.getFormatDate(
            Array.from(dateUtil)[index === 2 ? 6 : index]().startTime
          )
        );
        this.params.time = formatDate.getFormatDate(
          Array.from(dateUtil)[index === 2 ? 6 : index]().startTime
        );
        this.$set(this.params, "num", 200);
      } else if (index === 3) {
        this.$set(this.params, "num", 30);
      } else if (index === 4) {
        this.$set(this.params, "num", 60);
      } else {
        this.$set(this.params, "num", 90);
      }
      if (index > 2) {
        this.params.time = formatDate.getFormatDate(
          Array.from(dateUtil)[0]().startTime
        );
      }
      this.$emit("sendData", this.params);
    },
    created() {
      this.params.lotteryId = this.lotteryId;
    }
  }
};
</script>
<style lang="less" scoped>
.date-wrap {
  width: 100%;
  .date-title-wrap {
    ul {
      &:first-child {
        li {
          float: left;
          color: #b5b5b5;
          padding: 0 10px;
          cursor: pointer;
          font-size: 14px;
          font-weight: normal;
          &.active {
            /*   color: @primary-color; */
          }
          &:last-child {
            padding-right: 19px;
          }
          &:hover {
            /*   color: @primary-color; */
          }
        }
      }
    }
  }
}
</style>

