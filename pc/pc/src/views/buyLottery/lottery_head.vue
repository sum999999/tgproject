<template>
  <div class="lottery-head">
    <div class="container">
      <div class="acount lf" v-if="user.userCode">
        <span class="lf"
          >{{ $tex("账号") }}&nbsp;:&nbsp;
          <span class="user-name">{{ user.userCode }}</span>
        </span>
        <span class="balance lf">
          {{ $tex("余额") }}:&nbsp;
          <span
            >{{ Number(user.balance) | keepDecimalOf2 }}
            <span v-if="hasPermission('element.unit')">{{ $tex("元") }}</span>
            <i
              class="i-icon i-refresh-white"
              @click="queryBalance()"
              :class="{ 'turn-round': turnRound }"
            ></i>
          </span>
        </span>
      </div>
      <div class="list rf">
        <ul class="lf">
          <li
            v-for="(item, idx) in list"
            :key="idx"
            :class="{
              'auth-hide':
                item.setAuth &&
                (user.userType === '09' || user.userType === '08'),
            }"
          >
            <i class="i-icon" :class="item.icon"></i>
            <span v-if="item.url && idx !== 1" @click="gopage(item.url, idx)">{{
              item.label
            }}</span>
            <!-- <router-link :to="item.url"
                                     v-if="item.url&&idx !== 1">{{item.label}}</router-link> -->
            <a
              href="javascript:void(0)"
              @click.stop="openService(servicer.url)"
              v-else-if="idx === 1"
              target="_blank"
              >{{ item.label }}</a
            >
            <a :href="servicer.url" v-else>{{ item.label }}</a>
          </li>
        </ul>
        <button
          v-preventReClick="2000"
          class="lf btn sign sign-out"
          @click="signOut()"
          v-if="user && user.userId"
        >
          <Icon type="log-out"></Icon>{{ $tex("登出") }}
        </button>
        <button
          v-preventReClick="2000"
          class="lf btn sign sign-in"
          @click="sign()"
          v-else
        >
          <Icon type="log-in"></Icon>{{ $tex("登入") }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import Util from "@/utils/dom";
import { hasPermission } from "@/utils/authority-utils";
import { queryQrcodesAndServicer } from "@/api/cms";

export default {
  data() {
    return {
      turnRound: false,
      list: [
        { label: this.$tex("返回首页"), icon: "i-home", url: "/" },
        { label: this.$tex("在线客服"), icon: "i-custom", url: "" },
        {
          label: this.$tex("投注记录"),
          icon: "i-record i-icon",
          url: "/personalCenter/record",
        },
        {
          label: this.$tex("会员中心"),
          icon: "i-user-center",
          url: "/personalCenter/account",
        },
        {
          label: this.$tex("在线充值"),
          icon: "i-recharge",
          url: "/personalCenter/recharge",
          setAuth: true,
        },
        {
          label: this.$tex("在线提现"),
          icon: "i-draw-money",
          url: "/personalCenter/withdraw",
          setAuth: true,
        },
      ],
    };
  },
  computed: {
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
      //gopage(url, flag, agent)
      if (!this.user.userCode && idx !== 0) {
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
      const userId = this.user.userCode ? `?id=${this.user.userCode}` : "";
      Util.openWin(url + userId);
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
      // this.$router.push('/login');
      this.$store.commit("getShowLoginDialog", true);
    },
  },
  created() {
    queryQrcodesAndServicer().then((response) => {
      if (response.data.code !== 0) return;
      this.list[1].url = response.data.data.servicer.url;
      this.$store.commit("getServicer", response.data.data.servicer);
    });
  },
};
</script>

<style lang="less" scoped>
.lottery-head {
  height: 50px;
  line-height: 50px;
  color: #fff;
  // 彩票大厅顶部颜色
  margin-bottom: 15px;
  font-size: 14px;
  min-width: 1360px;
}
.lottery-head .container {
  width: 1360px;
  margin: 0 auto;
}
.lottery-head .acount .user-name,
.lottery-head .acount .balance span {
  color: @buy-lottery-common-color;
}
.lottery-head .acount .balance {
  float: left;
  height: 25px;
  line-height: 25px;
  border-radius: 3px;
  // background: @buy-lottery-common-bg;
  padding: 0 40px 0 10px;
  margin-top: 12px;
  margin-left: 10px;
  position: relative;
}
.lottery-head .acount .balance .i-icon {
  position: absolute;
  right: 10px;
  top: 3px;
  cursor: pointer;
}
.lottery-head .list li {
  float: left;
  padding-left: 32px;
  margin-left: 10px;
  cursor: pointer;
  position: relative;
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
  color: @lottery-head-text-hover-color;
}
.lottery-head .list .sign {
  padding: 0 10px 0 35px;
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
.lottery-head .turn-round {
  animation: rotating 5s infinite linear;
  -webkit-animation: rotating 5s infinite linear;
}
</style>
