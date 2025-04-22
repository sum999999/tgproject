<template>
  <!-- :style="{ background: themeColorList.primaryColorHover }" -->
  <div class="lottery-head" style="background-color: white">
    <div class="container">
      <div class="acount">
        <span
          >Hi,&nbsp;&nbsp; 欢迎来到&nbsp;<span style="color: #dc3b40">{{
            $configText.main
          }}</span
          >!
        </span>
      </div>
      <div class="list">
        <div class="acount flexNew " v-if="user.userCode">
          <img @click="userHome" class="userImg " :src="user.imgUrl" />
          <span @click="userHome" class="userName"
            ><!-- {{ $tex("账号") }}&nbsp;:&nbsp; -->
            <span class="">{{ user.userCode }}</span>
          </span>
          <span class="balance ">
            {{ $tex("余额") }}:&nbsp;
            <span @click="queryBalance()" style="cursor: pointer;"
              >{{ Number(user.balance) | keepDecimalOf2 }}
              <span v-if="hasPermission('element.unit')">{{ $tex("元") }}</span>
              <img
                src="~@/assets/images-v11/sf6.png"
                class="i-icon i-refresh-white"
                :class="{ 'turn-round': turnRound }"
              />
            </span>
          </span>
          <ul class="flexNew">
            <li
              v-for="(item, idx) in list"
              :key="idx"
              v-show="item.setAuth || user.userCode"
              :class="{
                'auth-hide':
                  item.setAuth &&
                  (user.userType === '09' || user.userType === '08'),
              }"
            >
              <i class="i-icon" :class="item.icon"></i>
              <span @click="gopage(item.url, idx)">{{ item.label }}</span>
            </li>
          </ul>
          <button
            v-preventReClick="2000"
            class=" btnNew  sign-out"
            @click="signOut()"
            v-if="user && user.userId"
            style="margin-bottom: 2px;"
          >
            {{ $tex("退出") }}
          </button>
          <span class="Customer" @click.open="openCusService">
            <i class="iconfont icon-zxkf"></i>{{ $tex("在线客服") }}</span
          >
        </div>
        <!-- class=" btn sign sign-in" -->
        <template v-else class="flexNew">
          <button
            v-preventReClick="2000"
            class=" btnNew sign-in "
            @click="sign()"
          >
            <!--  <Icon type="log-in"></Icon> -->{{ $tex("亲，请登录") }}
          </button>
          <button
            v-preventReClick="2000"
            class=" btnNew  sign-in"
            @click="enroll()"
          >
            <!--  <Icon type="log-in"></Icon> -->{{ $tex("用户注册") }}
          </button>
          <span class="customer" @click.open="openCusService">
            <i class="iconfont icon-zxkf"></i>{{ $tex("在线客服") }}</span
          >
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import Util from "@/utils/dom";
import { hasPermission } from "@/utils/authority-utils";
import { queryQrcodesAndServicer } from "@/api/cms";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      turnRound: false,
      list: [
        // { label: this.$tex("返回首页"), icon: "i-home", url: "/" },
        // { label: this.$tex("在线客服"),  icon: "i-custom", url: "" },
        // {
        //   label: this.$tex("投注记录"),
        //   icon: "i-record i-icon",
        //   url: "/personalCenter/record",
        // },
        // {
        //   label: this.$tex("会员中心"),
        //   icon: "i-user-center",
        //   url: "/personalCenter/account",
        // },
        {
          label: this.$tex("充值"),
          // label: this.$tex("在线充值"),
          // icon: "i-recharge",
          url: "/personalCenter/recharge",
          setAuth: true,
        },
        {
          label: this.$tex("提现"),
          // label: this.$tex("在线提现"),
          // icon: "i-draw-money",
          url: "/personalCenter/withdraw",
          setAuth: true,
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["themeColorList"]),
    servicer() {
      return this.$store.state.servicer;
    },
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    hasPermission,
    gopage(url, idx) {
      // gopage(url, flag, agent)
      if (!this.user.userCode) {
        this.$Modal.confirm({
          title: this.$tex("提示"),
          content: `<p>${this.$tex("您还未登入！去登录？")}</p>`,
          onOk: () => {
            this.$router.push("/login");
          },
        });
        return;
      }
      this.$router.push(url);
    },
    openService(url) {
      //打开客服
      Util.openWin(url);
    },
    // 客服
    openCusService() {
      if (this.servicer) {
        let url = null;
        if (this.$store.getters.sysPlatformFlag != "by336") {
          url = this.user.userCode
            ? this.servicer.url + `?id=${this.user.userCode}`
            : this.servicer.url;
        } else {
          // 336客服链接携带参数会报错
          url = this.servicer.url;
        }
        Util.openWin(url);
      }
    },
    // 跳转主页
    userHome() {
      this.$router.push("/personalCenter/account");
    },
    signOut() {
      let vm = this;
      this.$http
        .post("/api/v2/user/loginOut", "", { userId: true })
        .then((response) => {
          if (response.data.code !== 0) return;
          localStorage.setItem("user", "");
          vm.$store.commit("getUser", "");
          vm.$router.push("/login");
          // window.location.reload();
        });
    },
    queryBalance() {
      let vm = this;
      this.turnRound = true;
      this.$http
        .post("/api/v2/user/balanceAdnSign", "", { userId: true, unenc: true })
        .then((response) => {
          if (response.data.code !== 0) return;
          this.turnRound = false;
          this.user.balance = response.data.data.balance;
          this.user.userLevel = response.data.data.levelId;
          this.$store.commit("getUser", this.user);
        });
    },
    sign() {
      this.$router.push("/login");
      // this.$store.commit("getShowLoginDialog", true);
    },
    enroll() {
      this.$router.push("/register");
    },
  },
  created() {
    queryQrcodesAndServicer().then((response) => {
      if (response.data.code !== 0) return;
      // this.list[1].url = response.data.data.servicer.url;
      this.$store.commit("getServicer", response.data.data.servicer);
    });
  },
};
</script>

<style lang="less" scoped>
.lottery-head {
  // height: 50px;
  // line-height: 50px;
  height: 30px;
  line-height: 30px;
  color: #f8f8f8;
  font-size: 14px;
  min-width: 1000px;
}
.lottery-head .container {
  width: 1000px;
  font-size: 13px;
  margin: 0 auto;
  color: grey;
  display: flex;
  justify-content: space-between;
}
.flexNew {
  display: flex;
}
.Customer {
  background: #de2f04;
  padding: 0px 5px;
  color: white;
  border-radius: 3px;
  cursor: pointer;
  /* display: flex; */
  height: 21px;
  line-height: 21px;
  margin-top: 3px;
}
.lottery-head .acount .userImg {
  height: 25px;
  border-radius: 3px;
  padding: 0 10px 0 10px;
  margin-top: 2px;
  margin-left: 10px;
  position: relative;
  cursor: pointer;
}
.lottery-head .acount .userName {
  cursor: pointer;
  &:hover {
    text-decoration: underline;
    color: #e4393c;
  }
}
.lottery-head .acount .balance span {
  /*  color: @buy-lottery-common-color; */
}
.lottery-head .acount .balance {
  height: 25px;
  line-height: 25px;
  // color: white;
  color: gray;
  border-radius: 3px;
  /*  background: @buy-lottery-common-bg; */
  background: none;
  padding: 0 40px 0 10px;
  margin-top: 2px;
  margin-left: 10px;
  position: relative;
  span {
    color: gray;
    &:hover {
      text-decoration: underline;
      color: #e4393c;
    }
  }
}
.lottery-head .acount .balance .i-icon {
  position: absolute;
  right: 10px;
  top: 3px;
  cursor: pointer;
  border-radius: 50%;
}

.lottery-head .list li {
  // padding-left: 32px;
  // margin-left: 10px;
  padding-left: 25px;
  margin-right: 10px;
  cursor: pointer;
  position: relative;
  height: 25px;
}
.lottery-head .list li.auth-hide {
  display: none;
}
.lottery-head .list li .i-icon {
  position: absolute;
  top: 10px;
  left: 0;
}
.lottery-head .list li i.i-draw-money {
  top: 12px;
}
.lottery-head .list li a {
  color: #fff;
}
// .lottery-head .list li:hover
.lottery-head .list li a:hover {
  /*   color: @lottery-head-text-hover-color; */
}
.lottery-head .list .btnNew {
  border: none;
  color: grey;
  cursor: pointer;
  background: none;
  padding: 0 20px;
  &:hover {
    color: rgb(255, 44, 85);
    text-decoration: underline;
  }
}
.lottery-head .list .sign {
  border-color: #fff;
  color: #fff;
  line-height: 30px;
  margin-top: 10px;
  margin-left: 10px;
  position: relative;
}
.lottery-head .list .sign:hover {
  color: #fff;
  /*   background: @buy-lottery-common-bg;
    border-color: @lottery-head-btn-border-color; */
}
.lottery-head .list .sign i {
  position: absolute;
  left: 8px;
  top: 4px;
  font-size: 22px;
}

.lottery-head .list .customer {
  background: rgb(222, 47, 4);
  padding: 3px 5px;
  color: white;
  border-radius: 3px;
  cursor: pointer;
}
.icon-zxkf {
  font-size: 12px;
  padding-right: 3px;
}
.lottery-head .turn-round {
  animation: rotating 5s infinite linear;
  -webkit-animation: rotating 5s infinite linear;
}
</style>
