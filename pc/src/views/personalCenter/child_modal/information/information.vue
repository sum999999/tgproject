<template>
  <div class="my-account">
    <div class="tab">
      <ul>
        <li
          v-for="item in tabList"
          :key="item.label"
          @click="changeLabel(item)"
          :class="[label === item.label?'active':'',item.label==='information_system'&&systemInfos?'info-tip':''||item.label==='information_member'&&userInfos?'info-tip':'']"
        >
          <span>{{item.name}}</span>
          <i v-if="item.interval"></i>
        </li>
      </ul>
    </div>
    <div class="account-content">
      <member
        v-if="label === 'information_member'"
        v-on="$listeners"
      ></member>
      <system
        v-if="label === 'information_system'"
        v-on="$listeners"
      ></system>
      <Spin
        fix
        v-show="showLoading"
      >
        <Icon
          type="load-c"
          size=24
          class="demo-spin-icon-load"
        ></Icon>
        <div>Loading</div>
      </Spin>
    </div>
  </div>
</template>

<script>
import member from "./information_member";
import system from "./information_system";
export default {
  inheritAttrs: false,
  components: {
    member,
    system
  },
  data() {
    return {
      model1: "",
      // essayId: '',
      label: "information_member",
      tabList: [
        { name: this.$tex("会员消息"), label: "information_member", interval: true },
        { name: this.$tex("系统公告"), label: "information_system" }
      ],
      systemInfos: this.essayCount,
      userInfos: this.userCount,
      showLoading: false
    };
  },
  watch: {
    $route() {
      if (this.$route.query.essayId) {
        if (this.label !== "information_system") {
          this.label = "information_system";
        } else {
          // this.$router.push(`/personalCenter/information?essayId=${this.$route.query.essayId}`);
        }
      }
    }
  },
  methods: {
    changeLabel(item) {
      this.$router.push("/personalCenter/information");
      this.label = item.label;
      if (this.label === "information_member") {
        this.userInfos = 0;
      } else {
        this.systemInfos = 0;
      }
    },
    hasNewInformation() {
      this.$http
        .post("/api/v2/user/isqueryUserMessage", "", {
          userId: true,
          unenc: true
        })
        .then(response => {
          if (response.data.code !== 0) return;
          let data = response.data.data;
          if (data.isEssayConut || data.isUserCount) {
            //暂未考虑游戏信息
            this.hasInformation = true;
            this.systemInfos = data.isEssayConut;
            this.userInfos = data.isUserCount;
            // console.log(this.essayCount, this.userCount);
          }
        });
    }
  },
  created() {
    this.hasNewInformation();
    if (this.$route.query.essayId) {
      this.label = "information_system";
    }
  }
};
</script>

<style lang = "less">
.my-account {
  /*  width: 742px; */
  .tab {
    height: 40px;
    line-height: 38px;
    font-size: 16px;
    /*     border-bottom: 2px solid @common-border-color; */
    li {
      float: left;
      padding: 0 20px;
      cursor: pointer;
      height: 40px;
      position: relative;
      &.active {
        /*   color: @primary-color;
                border-bottom: 2px solid @primary-color; */
      }
      &.info-tip {
        &:before {
          display: block;
          position: absolute;
          content: "";
          width: 12px;
          height: 12px;
          right: 11px;
          top: 6px;
          border-radius: 50%;
          /*          background: #be1204; */
          transform: scale(0.5);
          -webkit-transform: scale(0.5);
        }
      }
      i {
        position: absolute;
        right: 0;
        top: 15px;
        height: 10px;
        width: 1px;
        background: #c0c0c0;
      }
    }
  }
  .account-content {
    padding-top: 15px;
  }
}
</style>
