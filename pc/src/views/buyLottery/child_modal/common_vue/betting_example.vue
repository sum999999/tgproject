<template>
    <div class="example-wrap">
        <play-rule-button></play-rule-button>
        <div class="example">
            <Icon type="clipboard"></Icon>&nbsp;&nbsp;{{$tex("范例")}}
            <div class="info">
                <Icon type="arrow-down-b"></Icon>
                <span>{{bettingExample}}</span>
            </div>
        </div>
        <div class="example">
            <Icon type="ribbon-a"></Icon>&nbsp;&nbsp;{{$tex("中奖说明")}}
            <div class="info">
                <Icon type="arrow-down-b"></Icon>
                <span>{{prizeDesc}}</span>
            </div>
        </div>
        <!-- 快捷投注 -->
        <div class="example fast" v-if="showFastBtn" @click.stop="toggleMenu">
            <i class="iconfont icon-lightning"></i>
            <span>{{$tex("快捷投注")}}</span>
        </div>
    <!-- </div> -->

  </div>

</template>
<script>
import playRuleButton from "./playRuleButton";

export default {
  components: {playRuleButton},
  props: {
        bettingExample: {
            type: String,
            default: ''
        },
        prizeDesc: {
            type: String,
            default: ''
        },
        showFastBtn:{ //是否展示快捷投注按钮
            type:Boolean,
            default: false
        }
    },
  data() {
    return {
      showMenu: false
    };
  },
  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu;
      this.$emit("toggle-fast-menu", this.showMenu);
    }
  }
};
</script>
<style lang="less" scoped>
.example-wrap .example {
  position: relative;
  float: left;
  padding: 3px 13px;
  margin-left: 10px;
  /*  border: 1px solid @tab-menu-example-border;
    color: @tab-menu-example-color; */
  border-radius: 3px;
  height: 30px;
  line-height: 23px;
  &.fast {
    // font-size: 30px;
    margin-left: 25px;
    /*    background-color:@primary-color; */
    color: #fff;
    cursor: pointer;
    border: none;
    &:hover {
      opacity: 0.9;
    }
  }
}
.example-wrap .example:hover .info {
  display: block;
}
.example-wrap .example > i {
  font-size: 16px;
}
.example-wrap .example .info {
  position: absolute;
  bottom: 45px;
  right: 0px;
  background: @tab-menu-example-bg;
  min-width: 400px;
  color: #fff;
  padding: 10px;
  border-radius: 3px;
  display: none;
}
.example-wrap .example .info i {
  position: absolute;
  bottom: -16px;
  right: 15px;
  color: @tab-menu-example-bg;
  font-size: 26px;
}

</style>


