<template>
  <div class="liuhe">
    <div class="liuhe-nva">
      <ul>
        <li
          v-for="item in menu"
          :key="item.id"
          :style="{ width: 100 / menu.length + '%' }"
          :class="{ curr: currMenu === item.id }"
          @click="chooseMenu(item)"
        >
          <span>{{ item.name }}</span>
        </li>
      </ul>
    </div>
    <div class="liuhe-content">
      <component
        :is="view && `sixHC_${view}`"
        ref="liuheCon"
        :data="data"
        :betLimRate="betLimRate"
        :singleLimit="singleLimit"
        :self-flag="selfFlag"
        @add-note="addNotes"
        @has-change-menu="changeMenu"
        v-if="data"
      ></component>
      <result-page
        :list="orderList"
        :data="menu"
        :itemLimit="itemLimit"
        :self-flag="selfFlag"
        :isChangeSubMenu="isChangeSubMenu"
        :handle-odd-if-needed="handleOddIfNeeded"
      ></result-page>
    </div>
    <div
      v-if="showSpin"
      style="width: 1150px; position: absolute; left: 0; top: 0"
      :style="{ height: menuHeight + 'px' }"
    >
      <Spin
        size="large"
        fix
        :style="{ height: menuHeight + 'px' }"
        v-if="showSpin"
      ></Spin>
    </div>
  </div>
</template>

<script>
import allLiuhe from "./child_modal/index";
import resultPage from "./result_page";
import liuhe from "./child_modal/common_modal/handle_data.js";
export default {
  components: Object.assign({}, allLiuhe, { resultPage: resultPage }),
  data() {
    return {
      menuHeight: this.$attrs.menuHeight,
      view: "",
      currMenu: "",
      data: " ",
      menu: [],
      showSpin: true,
      orderList: [],
      isChangeSubMenu: 0, //判断是否多次空投
      betLimRate: "1", //几成
      itemLimit: 1000000, //单项限额
      singleLimit: 5000, //单注限额
      selfFlag: "",
    };
  },
  watch: {
    $route() {
      // this.menu = []; // 5.6
      // this.data = {}; // 5.6
      this.orderList = [];
      this.showSpin = true;
      this.init();
    },
  },
  methods: {
    handleOddIfNeeded() {
      return Number(this.view) === 708;
    },
    /**
     * @param{投注的注数} len
     * @param{投注限制的注数} limitLen
     * @param{输入框组件} ipts
     * @param{单个输入框的索引} index
     */
    changeIptDisabled(len, limitLen, ipts, index) {
      // 输入金额时改变输入框的禁用状态
      if (len >= Math.floor(limitLen)) {
        ipts.forEach((item, idx) => {
          let ipt = this.getComIpt(item);
          if (!ipt.value && idx !== index) ipt.setAttribute("disabled", true);
        });
      } else {
        ipts.forEach((item, idx) => {
          let ipt = this.getComIpt(item);
          if (!ipt.value && idx !== index)
            ipt.hasAttribute("disabled") && ipt.removeAttribute("disabled");
        });
      }
    },
    /**
     * @param {输入框组件ref值} ipts
     */
    clearDisabled(ipts) {
      //清除输入框的禁用状态---供子组件调用
      function clearDisabled(list) {
        //清除输入框的禁用
        list.forEach((item) => {
          let ipt = this.getComIpt(item);
          ipt.hasAttribute("disabled") && ipt.removeAttribute("disabled");
        });
      }
      clearDisabled.call(this, ipts);
    },
    /**
     * @param{输入框组件ref值} name
     */
    getIptsParent(name) {
      // 获取输入框组件---供子组件用
      return Array.from(this.$refs["liuheCon"].$refs[name]);
    },
    /**
     * @param{输入框组件} parent
     */
    getComIpt(parent) {
      //获取输入框组件的子元素input---供子组件用
      return parent.$el.getElementsByTagName("input")[0];
    },
    reInit() {
      this.init();
    },
    changeMenu(digistal) {
      //判断是否多次空投
      this.isChangeSubMenu = digistal;
    },
    addNotes(list) {
      this.orderList = list;
    },
    chooseMenu(item) {
      //切换六合彩玩法项---玩法的数据都存在
      if (this.view === item.id) return;
      this.orderList = [];
      this.view = item.id;
      this.currMenu = item.id;
      this.data = this.handleData(item);
    },
    handleData(data) {
      //处理data
      data.children.forEach((child) => {
        let originRates = child.children[0].layout.rates;
        // console.log("ppp",originRates);
        let balls = child.children[0].layout.optballs.split("|");
        if (originRates.length === 1) {
          let rate = originRates[0];
          originRates = [];
          balls.forEach((ball) => {
            let obj = Object.assign({}, rate);
            obj.ball = ball;
            originRates.push(obj);
          });
          child.children[0].layout.rates = originRates;
        } else if (originRates.length > 1) {
          let rates = [];
          for (let i = 0, len = balls.length; i < len; i++) {
            for (let j = 0, len2 = originRates.length; j < len2; j++) {
              if (originRates[j].ball === balls[i]) {
                rates.push(originRates[j]);
                break;
              }
            }
          }
          child.children[0].layout.rates = rates;
        }
      });
      data = liuhe.editData(data.children, true);
      return data;
    },
    init() {
      this.$http
        .post(
          "/api/v2/lottery/getLotteryDetail",
          { lotteryId: this.$route.params.id },
          { unenc: true }
        )
        .then((response) => {
          if (response.data.code !== 0) return;
          this.showSpin = false;
          this.menu = response.data.data.list;
          let defaultId = response.data.data.title1Id;
          let default2Id = response.data.data.title2Id;
          this.selfFlag = response.data.data.selfFlag;
          // console.log("response.data.data", response.data.data);
          this.view = defaultId; //默认玩法
          this.currMenu = defaultId;
          const data = this.menu.filter((item) => item.id === defaultId)[0];
          const defaultSpIndex = data.children.findIndex(
            (item) => item.id === default2Id
          );
          data.children.unshift(data.children.splice(defaultSpIndex, 1)[0]);
          this.data = this.handleData(data);
          this.itemLimit = data.children[0].children[0].itemLimit;
          this.singleLimit = data.children[0].children[0].singleLimit;
          this.showSpin = false;
          this.changeAssembly = true;
        });
      this.$store.dispatch("querySystemConfig").then((systemConfig) => {
        //获取投注限制的成数
        this.betLimRate = systemConfig.BET_TOTAL_NOTE_LIMIT;
      });
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="less">
.lihe {
  position: relative;
}
.liuhe .ivu-spin-large {
  position: absolute;
  width: 1150px;
  /* height:622px; */
  left: 50%;
  top: 50%;
  /* margin-top:65px; */
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  transform-origin: 50% 50%;
}
.liuhe .liuhe-content {
  padding: 0 15px;
}
.liuhe .liuhe-nva {
  height: 44px;
  line-height: 44px;
  font-size: 14px;
  color: #fff;
}
.liuhe .liuhe-nva li {
  float: left;
  text-align: center;
  cursor: pointer;
}
.liuhe .curr {
  color: #fff;
}

/* 子模块样式 */
.liuhe .tab {
  min-height: 65px;
  width: 100%;
  margin: 10px 0;
  margin-bottom: 0;
  border-bottom: 1px solid #d2d0d0;
}
.liuhe .tab li {
  float: left;
  padding: 0 15px;
  cursor: pointer;
  background: @liuhe-btn-default-bg;
  border: 1px solid #eee;
  margin-right: 5px;
  border-radius: 3px;
}
.liuhe .tab li.active {
  background: @liuhe-btn-active-bg;
  color: #fff;
  border-color: @liuhe-btn-active-border;
}
.liuhe .detail-thead {
  width: 100%;
  font-size: 14px;
  overflow: hidden; // 2019.6.7
}
.liuhe .detail-thead.nav-bg {
  background: #eee url("/static/images/nav-bg.png") repeat-x;
  background-size: 100% 100%;
}
.liuhe .detail-thead.title-tip {
  /*   background: @primary-color; */
  color: #fff;
  margin-top: 10px;
}
.liuhe .detail-thead.title-tip li {
  border-left: 1px solid #fff;
}
.liuhe .detail-thead.title-tip li:first-child {
  border: 0;
}
.liuhe .detail-body {
  border-right: 1px solid #eee;
}
.liuhe .detail-thead li,
.detail-body li {
  float: left;
}
.liuhe .detail-body li {
  border-left: 1px solid #eee;
}
.liuhe .detail-body li .container {
  border-bottom: 1px solid #eee;
}
.liuhe .detail-thead li .container,
.detail-body li .container {
  width: 100%;
  text-align: center;
}
.liuhe .detail-thead li .container > span,
.detail-body li .container > span {
  display: block;
  height: 100%;
  text-align: center;
  float: left;
  line-height: 32px;
  word-break: break-all;
}
.liuhe .detail-body li span.price {
  padding: 5px 10px;
  position: relative;
  line-height: 0;
}
.liuhe .detail-body li span.price input {
  width: 100%;
  height: 22px;
  border-radius: 3px;
  border: 1px solid #cce;
  padding-left: 5px;
}
.liuhe .detail-body li span .bomb-box {
  position: absolute;
  top: 30px;
  left: 10px;
  right: 10px;
  line-height: 25px;
  background: #fff;
  z-index: 100;
  border: 1px solid #eee;
}
.liuhe .detail-body li span .bomb-box p {
  cursor: pointer;
}
.liuhe .detail-body li i.ball {
  width: 22px;
  height: 22px;
  line-height: 22px;
  border-radius: 50%;
  display: inline-block;
  color: #fff;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.27);
  -webkit-box-shadow: 0 0 8px rgba(0, 0, 0, 0.27);
  -ms-box-shadow: 0 0 8px rgba(0, 0, 0, 0.27);
  -moz-box-shadow: 0 0 8px rgba(0, 0, 0, 0.27);
  -o-box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
}
.liuhe .operation {
  margin: 10px 0;
}
.liuhe .operation .btn {
  padding: 8px 25px;
  cursor: pointer;
}

.zhengma-16 {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  tr td {
    border: 1px solid #eee;
  }
}
.zhengma-16_head {
  th {
    font-weight: normal;
  }
}
.zhengma-16__ball {
  text-align: center;
  width: 10%;
  font-weight: bold;
}
.zhengma-16_play {
  color: #ffffff;
}
.zhengma-16_type {
  background: #eee url(/static/images/nav-bg.png) repeat-x;
  background-size: 100% 100%;
  height: 32px;
}
.zhengma-16_type-cp {
  display: flex;
}
.zhengma-16_type-odds {
  width: 30%;
}
.zhengma-16_type-price {
  flex: 1;
}
.zhengma-16_body-odds {
  width: 30%;
  text-align: center;
  font-weight: bold;
}
.zhengma-16_body-price {
  flex: 1;
  padding: 5px 10px;
  position: relative;
  input {
    width: 100%;
    height: 22px;
    border-radius: 3px;
    border: 1px solid #cce;
    padding-left: 5px;
  }
  .bomb-box {
    position: absolute;
    cursor: pointer;
    top: 30px;
    left: 10px;
    right: 10px;
    line-height: 25px;
    background: #fff;
    z-index: 100;
    border: 1px solid #eee;
    text-align: center;
  }
}
.zhengma-16_cell {
  display: flex;
  align-items: center;
}
</style>
