<template>
    <div class="home-lottery-countdown">
        <div class="home-lottery-countdown__bg">{{hhZero}}</div>
        <div class="home-lottery-countdown__symbol">:</div>
        <div class="home-lottery-countdown__bg">{{mmZero}}</div>
        <div class="home-lottery-countdown__symbol">:</div>
        <div class="home-lottery-countdown__bg">{{ssZero}}</div>
    </div>
</template>

<script>
  export default {
    name: "HomeLotteryCountdown",
    props: {
      value: {
        type: Number,
        default: 0,
        required: true
      }
    },
    data() {
      return {
        timer: null
      };
    },
    computed: {
      count: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit("input", value);
        }
      },
      dd() {
        return Math.floor(this.count / (24 * 60 * 60));
      },
      ddZero() {
        return this.addZero(this.dd);
      },
      hh() {
        const remain = this.count % (24 * 60 * 60);
        return Math.floor(remain / (60 * 60)) + this.dd * 24;
      },
      hhZero() {
        return this.addZero(this.hh);
      },
      mm() {
        const remain = (this.count % (24 * 60 * 60)) % (60 * 60);
        return Math.floor(remain / (60));
      },
      mmZero() {
        return this.addZero(this.mm);
      },
      ss() {
        const remain = (this.count % (24 * 60 * 60)) % (60 * 60) % 60;
        return Math.round(remain);
      },
      ssZero() {
        return this.addZero(this.ss);
      }
    },
    watch: {
      count: {
        immediate: true,
        handler(num) {
          this.count = num;
          clearInterval(this.timer);
          this.timer = setInterval(() => {
            this.count--;
            if (this.count <= 0) {
              this.count = 0;
              clearInterval(this.timer);
              this.$emit("end");
            }
          }, 1000);
        }
      }
    },
    methods: {
        addZero(value = 0) {
          return value < 10 ? `0${value}` : `${value}`;
        }
    }
  }
</script>

<style scoped lang="less">
    .home-lottery-countdown {
        display: flex;
        color: #ffffff;
        font-size: 16px;
        align-items: center;
    }

    .home-lottery-countdown__bg {
        width: 26px;
        height: 26px;
        line-height: 26px;
        background-color: #111111;
        border-radius: 3px;
        text-align: center;
    }

    .home-lottery-countdown__symbol {
        font-size: 18px;
        margin: 0 4px;
    }
</style>
