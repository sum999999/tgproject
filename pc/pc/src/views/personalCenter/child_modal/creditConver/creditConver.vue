<template>
  <div class="credit-conver">
    <!-- tab按钮 -->
    <div class="tab">
      <ul>
        <li
          v-for="(itm, idx) in tabList"
          :key="idx"
          @click="changeTab(itm)"
          :class="[itm.label === label ? 'active' : '']"
        >
          {{ itm.name }}
        </li>
      </ul>
    </div>
    <div class="credit-conver-content">
      <amount v-if="label === 'amount'" v-on="$listeners"></amount>
      <conver v-else-if="label === 'conver'" v-on="$listeners"></conver>
      <betting v-else-if="label === 'betting'" v-on="$listeners"></betting>
      <!-- <total v-else-if="label==='total'"
             v-on="$listeners"></total> -->
    </div>
  </div>
</template>

<script>
import amount from "./amount.vue";
import conver from "./conver.vue";
import betting from "./betting.vue";
import total from "./total.vue";
export default {
  components: {
    amount,
    conver,
    betting,
    total,
  },
  inheritAtts: false,
  data() {
    return {
      tabList: [
        { name: this.$tex("转换额度"), label: "amount", interval: true },
        { name: this.$tex("转换记录"), label: "conver", interval: true },
        { name: this.$tex("投注记录"), label: "betting" },
        // { name: '一键归户总额', label: 'total' }
      ],
      label: "amount",
    };
  },
  methods: {
    changeTab(itm) {
      if (this.label === itm.label) return;
      this.label = itm.label;
    },
  },
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
.credit-conver {
  .tab {
    height: 40px;
    line-height: 38px;
    font-size: 0;
    /*  border-bottom: 2px solid @common-border-color; */
    li {
      position: relative;
      display: inline-block;
      padding: 0 28px;
      cursor: pointer;
      height: 40px;
      font-size: 16px;
      &.active {
        /*    border-bottom: 2px solid @primary-color;
        color: @primary-color; */
      }
    }
  }
}
</style>
