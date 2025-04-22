<template>
  <div class="my-yeb">
    <div v-if="visibleComponent">
      <div class="tab">
        <ul>
          <li
            v-for="item in tabList"
            :key="item.view"
            @click="replaceView(item)"
            :class="liClass(item)"
          >
            <span>{{item.name}}</span>
            <i v-if="item.interval"></i>
          </li>
        </ul>
      </div>
      <div class="yeb-content">
        <component
          :is="view"
          v-on="$listeners"
          @tab-replace-pageview="replacePageView"
          @tab-clear-pageview="clearPageView"
          @tab-replace-curview="replaceCurView"
          ref="view"
        ></component>
      </div>
    </div>
    <set-pw-amount
      v-if="userNoPayPwd"
      @tab-replace-curview="replaceCurView"
    ></set-pw-amount>
    <yeb-transfer-result
      v-if="pageView === 'YebTransferResult'"
      @tab-clear-pageview="clearPageView"
      @tab-replace-view="replaceView"
      :title="transTitle"
      :dsc="transDsc"
    ></yeb-transfer-result>
  </div>
</template>

<script>
import {
  YebDetail,
  ProfitLossDetail,
  SetPwAmount,
  YebTransferResult
} from "./components";

export default {
  name: "YebIndex",
  components: {
    YebDetail,
    ProfitLossDetail,
    SetPwAmount,
    YebTransferResult
  },
  data() {
    return {
      view: "YebDetail", // tab下的视图
      curView: "YebDetail", //当所有tab内都是一样的视图，记录当前点击的tab，用于恢复到当前点击的tab视图
      pageView: "", //当前整个页面的视图
      tabList: [
        { name: "余额宝", view: "YebDetail", interval: true },
        { name: "收支明细", view: "ProfitLossDetail", interval: false }
      ],
      transTitle: "",
      transDsc: ""
    };
  },
  computed: {
    userNoPayPwd() {
      let ret = false;
      if (this.$store.state.user.payPwdFlag === "0") {
        ret = true;
      }
      if (!this.$store.state.user.payPwdFlag) {
        ret = true;
      }
      return ret;
    },
    visibleComponent() {
      return !this.userNoPayPwd && !this.pageView;
    }
  },
  methods: {
    liClass(item) {
      let active = false;
      if (this.view === item.view) {
        active = true;
      }
      if (!this.visibleComponent && this.curView === item.view) {
        active = true;
      }
      return {
        active
      };
    },
    replaceCurView() {
      this.view = null;
      this.$nextTick(() => {
        this.view = this.curView;
      });
    },
    replaceView(item) {
      this.$refs.view &&
        this.$refs.view.handleTabClick &&
        this.$refs.view.handleTabClick();
      this.curView = typeof item === "object" ? item.view : item;
      if (typeof item === "string") {
        this.view = item;
        return void 0;
      }
      if (!this.visibleComponent) return void 0;
      this.view = item.view;
    },
    clearPageView() {
      this.pageView = "";
    },
    replacePageView(view, playload) {
      this.pageView = view;
      const action = {
        YebTransferResult: playload => {
          const { title, dsc } = playload;
          this.transTitle = title;
          this.transDsc = dsc;
        }
      };
      action[view] && action[view](playload);
    }
  }
};
</script>

<style lang="less" scoped>
.tab {
  height: 40px;
  line-height: 38px;
  font-size: 16px;
  /*  border-bottom: 2px solid @common-border-color; */
}
.tab li {
  float: left;
  padding: 0 28px;
  cursor: pointer;
  height: 40px;
  position: relative;
}
.tab li.active {
  /*   border-bottom: 2px solid @primary-color;
  color: @primary-color */
}
.tab li i {
  position: absolute;
  right: 0;
  top: 14px;
  height: 12px;
  width: 1px;
  background: #c0c0c0;
}
.yeb-content {
  padding-top: 20px;
}
</style>
