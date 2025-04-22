<template>
  <div class="personal-center content">
    <div class="navList">
      <div class="vip-info">
        {{ $tex("会员中心") }}
      </div>
      <ul>
        <li
          v-for="item in personCenter"
          :key="item.label"
          :class="[
            item.label == view ? 'active' : '',
            hasInformation && item.label === 'information' ? 'info-tip' : '',
          ]"
          @click="changeTab(item.label)"
        >
          <i
            v-if="item.bgClass"
            :class="
              item.label == view ? item.bgClass + '-active' : item.bgClass
            "
          ></i>
          <i
            v-else
            class="iconfont icon-eduzhuanhuan"
            :class="[item.label === view ? 'active' : '']"
          ></i>
          <span
            >{{ item.name
            }}<b
              v-if="
                item.label === 'information' &&
                  essayCount + userCount > 0 &&
                  hasInformation
              "
              >{{
                essayCount + userCount > 99
                  ? essayCount + userCount + "+"
                  : essayCount + userCount
              }}</b
            ></span
          >
        </li>
      </ul>
      <!-- isHiddenProxy判断盘口是否为339 满足条件则不展示代理中心 -->
      <div
        class="vip-info"
        v-if="
          user &&
            user.userType !== '08' &&
            hasPermission('personalCenter.agentCenter') &&
            !isHiddenProxy
        "
      >
        {{ $tex("代理中心") }}
      </div>
      <ul v-if="user && user.userType !== '08' && !isHiddenProxy">
        <li
          v-for="item in agencyCenter"
          :key="item.label"
          :class="{ active: item.label == view || item.key == view }"
          @click="changeTab(item.label)"
        >
          <i
            :class="
              item.label == view ? item.bgClass + '-active' : item.bgClass
            "
          ></i>
          <span>{{ item.name }}</span>
        </li>
      </ul>
    </div>
    <div
      class="personal-content"
      :class="[view === 'borrow' ? 'borrow-content' : '']"
    >
      <keep-alive exclude="account,userManage,recharge,withdraw,myExpand">
        <component :is="view" @handler-spin="handlerSpin"></component>
      </keep-alive>

      <Spin fix v-show="showLoading">
        <Icon type="load-c" size="24" class="demo-spin-icon-load"></Icon>
        <div>Loading</div>
      </Spin>
    </div>
    <!-- 
    <yeb-protocol-detail v-if="visibleYebProtocol"
    @sure="handleYebPtSure"
    @cancel="visibleYebProtocol = false"
    @fail="visibleYebProtocol = false"
    >
    </yeb-protocol-detail>
     -->
  </div>
</template>

<script>
import { UserTypes } from "@/constant/user";
import personalContent from "./child_modal/index";
import { hasPermission } from "@/utils/authority-utils";

export default {
  components: { ...personalContent },
  data() {
    // 资金密码的规则方法
    const addCapitalRealName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$tex("请输入真实姓名")));
      } else {
        callback();
      }
    };
    const addCapitalPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$tex("请输入密码")));
      } else {
        if (this.addObj.payPwdCheck !== "") {
          // 对第二个密码框单独验证
          this.$refs.addCustom.validateField("payPwdCheck");
        }
        callback();
      }
    };
    const addCapitalPassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$tex("请再次输入密码")));
      } else if (value !== this.addObj.payPwd) {
        callback(new Error(this.$tex("两次输入密码不匹配")));
      } else {
        callback();
      }
    };
    return {
      view: "",
      user: "",
      personCenter: [
        { name: this.$tex("我的账号"), label: "account", bgClass: "i-account" },
        {
          name: this.$tex("投注记录"),
          label: "record",
          bgClass: "i-bett-record",
        },
        {
          name: this.$tex("最新信息"),
          label: "information",
          bgClass: "i-new-info",
        },
      ],
      agencyCenter: [],
      hasInformation: false, //是否有消息过来
      essayCount: 0, //系统消息数量
      userCount: 0, //会员消息
      showLoading: false,
      visibleYebProtocol: false,
      hiddenProxy: [], // 隐藏代理的盘口
    };
  },
  watch: {
    $route(n) {
      this.view = n.params.id;
    },
  },
  computed: {
    yebFlag() {
      return this.$store.state.user.yebFlag === "1";
    },
    // 隐藏代理的盘口
    isHiddenProxy() {
      return this.hiddenProxy.includes(this.$store.getters.sysPlatformFlag);
    },
  },
  methods: {
    hasPermission,
    /**
     *加载提示的显示隐藏
     */
    handlerSpin(flag) {
      this.showLoading = flag;
    },
    changeTab(label) {
      if (label) {
        if (label === "information") {
          this.hasInformation = false;
        }
        if (label === "yeb" && !this.yebFlag) {
          this.visibleYebProtocol = true;
          return void 0;
        }
        this.$router.push({ params: { id: label, label: "" } });
      }
    },
    //是否有新消息
    hasNewInformation() {
      this.$http
        .post("/api/v2/user/isqueryUserMessage", "", {
          userId: true,
          unenc: true,
        })
        .then((response) => {
          if (response.data.code !== 0) return;
          let data = response.data.data;
          if (data.isEssayConut || data.isUserCount) {
            //暂未考虑游戏信息
            this.hasInformation =
              this.$route.params.id !== "information" ? true : false;
            this.essayCount = data.isEssayConut;
            this.userCount = data.isUserCount;
          }
        });
    },
    // handleYebPtSure () {
    //   this.visibleYebProtocol = false
    //   this.$router.push({ 'params': { 'id': 'yeb' } });
    // }
    // 是否实名
    queryLotUser() {
      this.$http
        .post("/api/v2/user/queryLotUserBankInfo", "", { userId: true })
        .then((response) => {
          this.$store.commit(
            "SAVE_SYSTEM_REALNAME",
            response.data.data.isRealName
          );
        });
    },
  },
  async created() {
    let user = localStorage.getItem("user");
    if (!user) {
      return;
    }
    const {
      JIEBEI_STATUS,
      HANDSFEE_RECHARGE_OPEN,
      NEW_EXPAND_GROUP_STATUE,
    } = await this.$store.dispatch("querySystemConfig");
    this.view = this.$route.params.id;
    this.user = JSON.parse(user);
    if (this.user !== null) {
      if (this.user.userType !== UserTypes.TRY_PLAY) {
        this.personCenter.splice(2, 0, {
          name: this.$tex("交易明细"),
          label: "trade",
          bgClass: "i-transaction-details",
        });
        hasPermission("personalCenter.report") &&
          this.personCenter.splice(3, 0, {
            name: this.$tex("个人报表"),
            label: "report",
            bgClass: "i-personal-report",
          });
      }
      if (
        JIEBEI_STATUS === "1" &&
        this.user.userType !== "09" &&
        hasPermission("personalCenter.borrow")
      ) {
        // this.personCenter.splice(this.personCenter.length, 0, { name: '余额宝', label: 'yeb', 'bgClass': 'i-yeb' }, );
        this.personCenter.splice(this.personCenter.length, 0, {
          name: "理财/借呗",
          label: "borrow",
          bgClass: "borrow",
        });
      }

      if (this.user.userType === "10" || this.user.userType === "00") {
        this.personCenter.splice(1, 0, {
          name: this.$tex("在线充值"),
          label: "recharge",
          bgClass: "i-funds",
        });
        this.personCenter.splice(2, 0, {
          name: this.$tex("在线提现"),
          label: "withdraw",
          bgClass: "i-online-withdrawal",
        });
        this.personCenter.splice(3, 0, {
          name: this.$tex("额度转换"),
          label: "creditConver",
        });
        if (HANDSFEE_RECHARGE_OPEN === "1") {
          this.personCenter.splice(2, 0, {
            name: this.$tex("免提直充"),
            label: "freeCharge",
            bgClass: "i-free-charge",
          });
        }
        // 盘口339 不展示投注记录 额度转换
        if (this.isHiddenProxy) {
          this.personCenter.splice(5, 1);
          this.personCenter.splice(4, 1);
        }
      }
      if (
        (this.user.userType === "10" || this.user.userType === "08") &&
        hasPermission("personalCenter.agentCenter")
      ) {
        //会员与代理
        if (!this.$configText.agentDescClose) {
          hasPermission("personalCenter.description") &&
            this.agencyCenter.push({
              name: this.$tex("代理说明"),
              label: "description",
              bgClass: "i-report-description",
            });
        }

        hasPermission("personalCenter.userManage") &&
          this.agencyCenter.push({
            name: this.$tex("会员管理"),
            label: "userManage",
            bgClass: "i-user-manager",
          });
        hasPermission("personalCenter.myExpand") &&
          this.agencyCenter.push({
            name: this.$tex("我的二维码"),
            label: "myExpand",
            bgClass: "iconfont icon-ewm2 ii",
          });
        if (NEW_EXPAND_GROUP_STATUE == "1") {
          hasPermission("personalCenter.expand") &&
            this.agencyCenter.push({
              name: this.$tex("推广管理"),
              label: "expand",
              bgClass: "i-promote-management",
            });
        }

        hasPermission("personalCenter.override") &&
          this.agencyCenter.push({
            name: this.$tex("代理佣金"),
            label: "override",
            bgClass: "i-acting-commission",
          });
        hasPermission("personalCenter.subReport") &&
          this.agencyCenter.push({
            name: this.$tex("下级报表"),
            label: "subReport",
            bgClass: "i-personal-report",
          });
        hasPermission("personalCenter.agentReport") &&
          this.agencyCenter.push({
            name: this.$tex("团队报表"),
            label: "agentReport",
            bgClass: "i-personal-report",
          });
        hasPermission("personalCenter.agentBetting") &&
          this.agencyCenter.push({
            name: this.$tex("代理投注明细"),
            label: "agentBetting",
            bgClass: "i-agent-betting",
          });
        hasPermission("personalCenter.agentTrade") &&
          this.agencyCenter.push({
            name: this.$tex("代理交易明细"),
            label: "agentTrade",
            bgClass: "i-agent-trade",
          });
      }
    }
    this.hasNewInformation();
    this.queryLotUser();
  },
};
</script>

<style lang="less" scoped>
.personal-center {
  padding: 30px 0;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}

.personal-center .navList {
  width: 200px;
  background-color: #fff;
  /*   border: 1px solid @common-border-color; */
  border-radius: 4px;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  -ms-border-radius: 4px;
  -o-border-radius: 4px;
  text-align: center;
  padding: 10px 12px;
}

.personal-center .navList .vip-info {
  line-height: 30px;
  text-align: left;
  font-size: 14px;
  font-weight: bold;
  color: #313131;
  /* border-bottom: 1px dashed @common-border-color; */
}

.personal-center .navList ul {
  padding-top: 10px;
  color: #313131;
}

.personal-center .navList li {
  position: relative;
  margin: 10px 0;
  display: flex;
  align-items: center;
  padding: 8px 10px;
  cursor: pointer;
}

.personal-center .navList li.info-tip b {
  position: absolute;
  right: -20px;
  top: -13px;
  display: block;
  height: 16px;
  line-height: 16px;
  padding: 0 5px;
  border-radius: 16px;
  color: #fff;
  font-weight: 700;
  font-size: 12px;
  text-align: center;
  background-color: #ff0000;
}

.personal-center .navList li i {
  display: inline-block;
  margin-right: 6px;
  &.icon-eduzhuanhuan {
    margin-left: -11px;
    + span {
      margin-left: -2px;
    }
  }
}

.personal-center .navList li i.borrow {
  width: 19px;
  height: 17px;
  background: url("/static/images/borrow.png") no-repeat center center;
}

.personal-center .navList li i.borrow-active {
  width: 19px;
  height: 17px;
  background: url("/static/images/borrow-active.png") no-repeat center center;
}

.personal-center .navList li .iconfont {
  top: 1px;
  font-size: 18px;
}

.personal-center .navList .active .iconfont {
  color: #fff;
}

.personal-center .navList li .icon-eduzhuanhuan {
  left: 22px;
  top: 0;
  color: #000;
  font-size: 18px;
}

.personal-center .navList li .icon-eduzhuanhuan.active {
  color: #fff;
}

.personal-center .navList li span {
  display: block;
  font-size: 14px;
  cursor: pointer;
  text-align: left;
  position: relative;
  word-break: break-all;
}

.personal-center .navList li.active span,
.personal-center .navList li.active span:hover {
  /*   background: @primary-color; */
  color: #fff;
}

.personal-center .navList li span:hover {
  /* background: #f6f6f6; */
}

.personal-center .personal-content {
  background-color: #fff;
  width: 780px;
  // min-height: 745px;
  // min-height: 880px;
  min-height: 915px;
  /*   border: 1px solid @common-border-color; */
  padding: 10px 11px 10px;
  position: relative;
  border-radius: 4px;

  &.borrow-content {
    padding: 12px 12px 0 12px;
  }
}
</style>
