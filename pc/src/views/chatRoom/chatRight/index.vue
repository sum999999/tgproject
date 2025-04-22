<template>
  <div class="index-right">
    <ul class="right-tab" id="rightTab">
      <li
        v-for="(item, index) in tab"
        :key="index"
        @click="clickTab(index)"
        :class="{ selected: tabIndex == index }"
      >
        <i class="iconfont" :class="[item.icon]"></i>{{ item.name }}
      </li>
    </ul>
    <div class="right-body nice-scroll">
      <component :is="componentView"></component>
      <div
        class="right-detail"
        id="rightDetail"
        v-show="tabIndex === tab.length - 1"
      >
        <ul class="right-tab right-tab2">
          <li
            v-for="(item, index2) in tab2"
            :key="index2"
            :class="{ selected: true }"
          >
            {{ item.name }}
          </li>
        </ul>
        <div class="detail-body">
          <div class="body-item">
            <banner></banner>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import banner from "./banner";
import plan from "./plan2Version";
import prize from "./prize";
import liveVedio from "./liveVedio";
import pkVideo from "./pkVideo";
import drawALottery from "./drawAlottery";
import { hasPermission } from "@/utils/authority-utils";

export default {
  data() {
    const tab = [
      {
        icon: "icon-kaijiangqu1",
        name: this.$tex("开奖区"),
        view: drawALottery,
        callback: this.showDrawALottery,
      },
      {
        icon: "icon-more",
        name: this.$tex("文字开奖"),
        view: prize,
        callback: this.showPrizeView,
      },
      // {
      //   icon: "icon-jiangbei",
      //   name: this.$tex("彩票计划"),
      //   view: plan,
      //   callback: this.showPlanView,
      // },
    ];
    if (hasPermission("chatRoom.pkVideo")) {
      tab.push({
        icon: "icon-qizhi",
        name: this.$tex("PK10直播"),
        view: pkVideo,
        callback: this.showPkView,
      });
    }
    return {
      tabIndex: 0,
      tab2: [{ name: this.$tex("优惠活动") }],
      tab,
      notice: "",
      componentView: drawALottery,
    };
  },
  components: {
    banner,
  },
  methods: {
    obtainSysConfigAsync() {
      this.$store.dispatch("querySystemConfig").then((systemConfig) => {
        const { LIVESTATUS } = systemConfig;
        if (parseInt(LIVESTATUS) === 1) {
          this.tab.push({
            icon: "icon-vedio",
            name: this.$tex("美女直播"),
            view: liveVedio,
            callback: this.showLiveView,
          });
        }
      });
    },
    goPage(link) {
      window.open(link, "_blank");
    },
    clickTab(index) {
      this.tabIndex = index;
      const { view, callback } = this.tab[index];
      this.componentView = view;
      callback && callback();
    },
    async getSysData() {
      let sysData = await this.$store.dispatch("querySystemConfig");
      if (sysData.CHAT_ROOM_PLAN === "1") {
        this.tab.splice(2, 0, {
          icon: "icon-jiangbei",
          name: this.$tex("彩票计划"),
          view: plan,
          callback: this.showPlanView,
        });
      }
    },
    // showDrawALottery() {
    //
    // },
    // showLiveView() {
    //     this.$nextTick(() => {
    //         chatUtil.initVedioHeight();
    //     });
    // },
    // showPlanView() {
    //
    //     this.$nextTick(() => {
    //         chatUtil.initPlanHeight();
    //     });
    // },
    // showPkView() {
    //
    // },
    // showPrizeView() {
    //     this.$nextTick(() => {
    //         chatUtil.initPrizeHeight();
    //     });
    // }
  },
  created() {
    this.obtainSysConfigAsync();
    this.getSysData();
  },
};
</script>

<style scoped lang="less">
.index-right {
  background: #ffffff;
  position: relative;
  width: 450px;
  height: calc(100vh - 60px);
  margin-right: -450px;
  float: right;
  overflow: hidden;
  z-index: 999;

  .body-item {
    position: relative;
  }

  .iframe-shadow {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    height: 300px;
    z-index: 10;
    width: 100%;
  }
}

.right-detail {
  position: absolute;
  bottom: 0;
  .detail-body {
    width: 446px;
    height: 157px;
  }
}

.right-tab {
  border-radius: 2px 2px 0 0;
  overflow: hidden;
  height: 46px;
  line-height: 42px;
  font-size: 12px;
  background: #fff;
  border-bottom: 1px #e6e6e6 solid;
  display: flex;

  li {
    flex: 1;
    color: #374254;
    text-align: center;
    cursor: pointer;

    .iconfont {
      font-size: 18px;
      vertical-align: middle;
    }

    &.selected {
      border-bottom: 2px #0188fb solid;
      color: #0188fb;
    }
  }
}

.right-body {
  overflow: auto;
  position: absolute;
  width: 100%;
  top: 45px;
  bottom: 0;
}

.right-tab2 {
  li {
    width: inherit;
    padding: 0 20px;
  }
}
</style>
