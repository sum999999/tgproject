import BallTable from "./BallTable";
import * as algorithm from "@/utils/algorithm";

export default {
  components: {
    BallTable
  },
  props: {
    code: {
      type: String
    },
    currentLottery: {
      type: Object
    },
    betLimRate: {
      type: Number
    },
    jetton: {
      type: Number
    }
  },
  data() {
    return {
      layout: {}
    }
  },
  computed: {
    layouts() {
      return this.layout.layout || [];
    },
    limitTotalNote() {
      return this.currentLottery.totalNote > 0
    }
  },
  watch: {
    currentLottery: {
      deep: true,
      immediate: true,
      handler(lottery) {
        if (lottery) {
          const layout = JSON.parse(lottery.layout);
          algorithm.layoutBalls2Array(layout, { value: 0 });
          this.layout = layout;
        }
      }
    },
    layouts: {
      deep: true,
      handler(layouts) {
        this.$emit("change", layouts);
      }
    }
  },
  methods: {
    onFocus(ball, iIndex) {
      if (this.jetton > 0) {
        ball.value = this.jetton;
      }
    },
    onBlur(ball, iIndex) {
      if (!this.limitTotalNote) {
        return;
      }
      const betNum = Math.floor(this.layout.rates.length * this.betLimRate);
      const filledNum = this.getBallTableFilledNum();
      if (filledNum > betNum) {
        ball.value = 0;
      }
    },
    getBallTableFilledNum() {
      let result = 0;
      this.layouts.forEach(layout => {
        result += layout.balls.filter(ball => {
          return ball.value > 0;
        }).length
      });
      return result;
    },
    clear() {
      this.layouts.forEach(layout => {
        layout.balls.forEach(ball => {
          ball.value = 0;
        })
      });
    },
  }
}
