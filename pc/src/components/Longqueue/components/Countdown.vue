<template>
    <div class="countdown">
        <template v-if="count === 0 || stop">
            <slot name="end"></slot>
        </template>
        <template v-else>
            <div class="countdown__bg">{{hhZero}}</div>
            <div class="countdown__symbol">:</div>
            <div class="countdown__bg">{{mmZero}}</div>
            <div class="countdown__symbol">:</div>
            <div class="countdown__bg">{{ssZero}}</div>
        </template>
    </div>
</template>

<script>
  import countdown from "@/utils/countdown";

  export default {
    name: "Countdown",
    props: {
      value: {
        type: Number,
        default: null
      },
      stop: {
        type: Boolean,
        default: false
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
        set(val) {
          this.$emit("input", val);
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
      count(a, b) {
        const space = Math.abs(a - b);
        if (space > 1) {
          this.countdownHandler();
        }
      }
    },
    mounted() {
        this.countdownHandler()
    },
    beforeDestroy() {
      clearInterval(this.timer);
    },
    methods: {
      countdownHandler() {
        if (!this.count) {
          return void 0;
        }
        clearInterval(this.timer);
        this.timer = countdown(this.count, (s, ms) => {
          this.count = s;
          if (this.count <= 0) {
            this.count = 0;
            clearInterval(this.timer);
            this.$emit("end");
          }
        });
      },
        addZero(value = 0) {
          return value < 10 ? `0${value}` : `${value}`;
        }
    }
  }
</script>

<style scoped lang="less">
    .countdown {
        display: flex;
        align-items: center;
        font-size: 16px;
        color: #FF464B;
        >div {
            vertical-align: middle;
        }
    }

    .countdown__bg {

    }

    .countdown__symbol {

    }
</style>
