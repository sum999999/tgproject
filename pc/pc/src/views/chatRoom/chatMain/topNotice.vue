<template>
  <div class="chat-noitce" id="chatNotice" :class="{ isAdmin: admin }">
    <span
      class="txt"
      :class="{
        en: !checkChineseKey(),
      }"
      >{{ $tex("最新公告") }}</span
    >
    <div class="marquee" v-if="notice">
      <marquee scrolldelay="100" scrollAmount="6">
        <div v-html="notice"></div>
      </marquee>
    </div>
    <div class="opt">
      <span class="clear" v-if="admin" @click="onClearClick">
        <i class="iconfont icon-clear"></i>
        <em>{{ $tex("清屏") }}</em>
      </span>
      <span>
        <iSwitch
          class="barrage"
          :class="{
            en: !checkChineseKey(),
          }"
          size="large"
          v-model="isOpenBarrage"
        >
          <span slot="open">{{ $tex("弹幕") }}</span>
          <span slot="close">{{ $tex("弹幕") }}</span>
        </iSwitch>
      </span>
    </div>
  </div>
</template>

<script>
import { checkChineseKey } from "@/lang";

export default {
  name: "topNotice",
  props: {
    notice: {
      type: String,
      default: "",
    },
    admin: {
      type: Boolean,
      default: false,
    },
    barrage: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isOpenBarrage: true,
    };
  },
  watch: {
    isOpenBarrage(newValue) {
      if (newValue !== this.barrage) {
        this.$emit("update:barrage", newValue);
      }
    },
  },
  created() {
    this.isOpenBarrage = this.barrage;
  },
  methods: {
    checkChineseKey,
    onClearClick() {
      this.$emit("clear-click");
    },
  },
};
</script>

<style scoped lang="less">
@deep: ~">>>";
@imgSrc: "~@/assets/images/chat";
.chat-noitce {
  height: 46px;
  line-height: 46px;
  position: relative;
  z-index: 0;
  background: #fff;
  border-bottom: 1px #e3e3e3 solid;
  padding-left: 100px;
  padding-right: 70px;
  white-space: nowrap;

  &.isAdmin {
    padding-right: 130px;
  }

  .txt {
    position: absolute;
    left: 10px;
    top: 15px;
    color: #c50c0b;
    width: 80px;
    height: 19px;
    font-size: 0;
    background: url("@{imgSrc}/cptt.png") no-repeat;
    &.en {
      background: url("@{imgSrc}/cptt-en.png");
    }
  }

  .marquee {
    font-size: 14px;
    display: block;
    width: 100%;
    overflow: hidden;
  }

  .opt {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 5px;
    float: right;
    padding-left: 5px;
    background-color: #ffffff;

    span {
      margin-right: 1px;
      cursor: pointer;

      em {
        display: inline-block;
        vertical-align: middle;
        font-style: normal;
      }
    }

    .iconfont {
      font-size: 22px;
      vertical-align: middle;
    }

    .check {
      color: #999;
    }

    .checked {
      color: #333;

      .icon-check {
        color: #77c308;
      }
    }
  }
  .barrage.en {
    width: 88px;
    &.ivu-switch-checked:after {
      left: 65px;
    }
    @{deep} {
      .ivu-switch-inner {
        span {
          display: block;
          width: 70px;
        }
      }
    }
  }
}
</style>
