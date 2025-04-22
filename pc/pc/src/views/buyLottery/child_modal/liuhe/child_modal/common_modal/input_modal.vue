<template>
  <span class="price" @mouseleave="hidePirce()" @keydown="tabDown($event)">
    <input
      type="number"
      v-model="value"
      @input="fn2"
      @focus="showPrice = true"
      :class="{ active: showPrice }"
    />

    <transition name="down-fade">
      <div class="bomb-box" v-show="showPrice">
        <p v-for="item in betAmount" :key="item" @click="selectPrice(item)">
          {{ item }}
          {{ $scur("元") }}
        </p>
      </div>
    </transition>
  </span>
</template>

<script>
import { mapGetters } from "vuex";
import { hasPermission } from "@/utils/authority-utils";

export default {
  model: {
    // 使用model， 这儿2个属性，prop属性说，我要将msg作为该组件被使用时（此处为aa组件被父组件调用）v-model能取到的值，event说，我emit ‘cc’ 的时候，参数的值就是父组件v-model收到的值。
    prop: "msg",
    event: "cc",
  },
  props: {
    msg: "",
  },
  data() {
    return {
      value: this.msg,
      showPrice: false,
    };
  },
  inheritAttrs: false,
  computed: {
    ...mapGetters(["sysExchangeInfo"]),
    betAmount() {
      let amount = [100, 500, 1000, 5000];
      if (this.$store.getters.sysPlatformFlag == "by330") {
        amount = [50, 100, 300, 500];
      }
      return amount;
    },
  },
  watch: {
    msg(n) {
      this.value = n;
    },
  },
  methods: {
    hasPermission,
    fn2() {
      if (hasPermission("buyLottery.decimals")) {
        const matchArr = `${this.value}`.match(
          /^([1-9][\d]{0,}|0)\.([\d]{1,})?$/
        );
        if (matchArr && matchArr[2] && matchArr[2].length > 2) {
          this.value = Number(this.value).toFixed(2);
        }
      } else {
        this.value = parseInt(this.value);
      }
      if (this.value <= 0) this.value = 1; //379 北京28玩金额输入框可鼠标滑动出负数，投注成功。 at 2018/02/02 by Daniel
      let singleLimit = +this.$attrs.singleLimit;
      if (this.value > singleLimit) this.value = singleLimit;
      this.$emit("cc", this.value);
    },
    hidePirce() {
      this.showPrice = false;
    },
    selectPrice(price) {
      this.value = price;
      this.showPrice = false;
      this.$emit("cc", this.value); //11.6
    },
    tabDown(e) {
      if (e.keyCode === 9) {
        //tab
        this.showPrice = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.price input[type="number"] {
  border: 1px solid #dddee1;
  outline: none;
  transition: all 0.2s ease-in-out;
  -webkit-transition: all 0.2s ease-in-out;
}

.price input[type="number"].active {
  border-color: @border-color;
  box-shadow: 0 0 2px @box-shadow;
  -webkit-box-shadow: 0 0 2px @box-shadow;
}
</style>
