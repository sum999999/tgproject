<template>
  <!--  红包列表 -->
  <Modal
    v-model="showRedpacketModal"
    class="chat-rank-modal"
    :class="{
            'en': !checkChineseKey()
        }"
    :title="$tex('红包')"
    width="480"
  >
    <div class="rp-num-l">Remaining</div>
    <div class="rp-num">{{redpackList.length}}</div>
    <div class="rp-num-r">Take</div>
    <div
      class="chat-redpacket-list nice-scroll"
      v-loading="redpacketLoading"
    >
      <ul v-if="redpackList.length">
        <li
          v-for="(item,index) in redpackList"
          :key="index"
        >
          <p>
            <img
              src="/static/images/packet/yellow_hb.png"
              class="rp-icon"
            >
            <span class="cont">
              {{$tex("{name}发送{money}{unit}", {name: item.createUserCode, money: item.totalMoney, unit: "元"})}}{{$tex(item.redpacketDesc)}}
            </span>
          </p>
          <!-- 1：可领取 -->
          <template v-if="redpackType=='1'">
            <span
              class="go"
              @click="onReceiveRedpacket(item)"
              v-if="item.status=='0' || item.status=='1'"
            >
              {{$tex("点选领取")}}
            </span>

            <span
              class="go disabled"
              v-else
            >{{item.status == '4' && $tex('已领取') || item.status== '2' && $tex('已领取') || item.status=='3' && $tex('已过期') || $tex('点选领取')}}</span>
          </template>

          <!-- 不可领取 -->
          <template v-else>
            <span
              class="go"
              :class="{disabled:allDisabled}"
              @click="dealRedpackState"
            >
              {{redpackType == '2' && $tex('去充值') || redpackType == '3' && $tex('去投注') || $tex('点选领取')}}
            </span>
          </template>
        </li>
      </ul>
      <div
        v-else
        class="chat-data-empty"
      >
        {{$tex("暂无红包")}}
      </div>
    </div>
    <div class="conditionDesc nice-scroll">
      <div>{{conditionDesc}}</div>
    </div>
    <img
      class="close"
      @click="showRedpacketModal = false"
      src="/static/images/packet/qhb_close.png"
    />
  </Modal>
</template>

<script>
  import {
    UserTypes
  } from "@/constant/user";
  import { checkChineseKey } from "@/lang";

export default {
  props: {
    showRedPacket: {
      type: Boolean
    },
    redPackDetail: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      redpacketLoading: false,
      redpackType: "1",
      redpackList: [], //红包列表
      allDisabled: false,
      showRedpacketModal: false, // 显示红包列表弹框
      conditionDesc: ""
    };
  },
  watch: {
    redPackDetail: {
      deep: true,
      handler(data) {
        this.redpackList = data.unclaimedRedpacketRsp || [];
        this.redpackType = data.type || "";
        this.conditionDesc = data.conditionDesc || "";
        this.allDisabled = false;
        this.hasClick = false;
      },
      immediate: true
    },
    showRedPacket(v) {
      this.showRedpacketModal = v;
    },
    showRedpacketModal(v) {
      this.$emit("update:showRedPacket", v);
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    checkChineseKey,
    /*
     *  @dec 红包领取条件判断
     */
    dealRedpackState() {
      if (this.handleReceiveFilter()) {
        return;
      }
      if (this.allDisabled) return;
      switch (
        this.redpackType // 跳转到购彩页面
      ) {
        case "0":
          this.allDisabled = true;
          this.$Message.error(this.$tex("所在ip被限制"));
          break;
        case "2": // 跳转到充值页面
          window.open("/#/personalCenter/recharge", "_blank");
          break;
        case "3":
          window.open("/#/lottery", "_blank");
          break;
        case "4":
          this.allDisabled = true;
          this.$Message.error(this.$tex("领取会员层级不满足"));
          break;
      }
    },

    /*
     *  @dec 显示领取红包列表
     */
    queryRecketList() {
      this.redpacketLoading = true;
      this.allDisabled = false;
      let roomId = this.$store.state.chatRoomId;
      this.$http
        .post(
          "/api/v2/user/queryUnclaimedRedpacket",
          { userId: this.user.userId, roomId: roomId },
          { unenc: true }
        )
        .then(response => {
          this.redpacketLoading = false;
          if (response.data.code !== 0) return;
          this.redpackList = response.data.data.unclaimedRedpacketRsp;
          /* 0：所在ip被限制；1：可领取；2：充值不足；3投注不足；4：层级不符 */
          this.redpackType = response.data.data.type;
          this.conditionDesc = response.data.data.conditionDesc;
        });
    },
    handleReceiveFilter() {
      if (!this.user.userCode) {
        this.$Modal.confirm({
          title: this.$tex("提示"),
          content: this.$tex("请先登录!"),
          onOk: () => {
            this.showRedpacketModal = false;
          }
        });
        return true;
      }
      if (this.user.userType === UserTypes.TRY_PLAY) {
        this.$Message.error(this.$tex("试玩账号没有权限"));
        return true;
      }
      return false;
    },
    /*
     *  @dec 点击抢红包
     */
    onReceiveRedpacket(item) {
      if (item.redpacketType === "01") {
        this.$Message.error(this.$tex("您好，仅通过手机App自助领取！"));
        return;
      }
      if (this.handleReceiveFilter()) {
        return;
      }
      if (item.status == "1") {
        item.status = "100"; // 设置状态
        this.$Message.error(this.$tex("同ip只能领取一次"));
        return;
      }
      let roomId = this.$store.state.chatRoomId;
      let currentRoomId = "";
      if (this.$route.name === "chatRoom") {
        currentRoomId = "";
      } else {
        currentRoomId = roomId;
      }
      if (this.redpacketLoading) {
        return;
      }
      this.redpacketLoading = true;
      this.$http
        .post(
          "/api/v2/user/receiveRedpacket",
          {
            redpacketChatId: item.redpacketChatId,
            roomId: currentRoomId
          },
          { userId: true }
        )
        .then(response => {
          this.redpacketLoading = false;
          const code = response.data.code;
          if (code == 0) {
            item.status = "4"; // 已领取
          } else if (code == 178) {
            item.status = "4"; //  已领取
          } else if (code == 177) {
            item.status = "2"; // 已过期
          } else if (code == 179) {
            item.status = "3"; // 已被抢完
          } else if (code == 307) {
            // 真实姓名不能为空
            this.allDisabled = true;
            this.redpackType = 10;
          } else {
            item.status = "10"; // 已被抢完
          }
        });
    }
  }
};
</script>
<style lang="less">
@media (max-width: 768px) {
  .ivu-modal {
    width: 480px !important;
    margin: auto;
  }
}
</style>
<style lang="less" scoped>
@deep: ~">>>";
.rp-num {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  top: -104px;
  width: 90px;
  height: 88px;
  margin: auto;
  padding-left: 2px;
  line-height: 88px;
  font-size: 48px;
  color: #ff6130;
}
.rp-num-l {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  top: -104px;
  width: 210px;
  height: 88px;
  padding-left: 2px;
  line-height: 88px;
  font-size: 40px;
  font-weight: bold;
  color: #ffffff;
  transform: rotateY(
          41deg
  );
  text-shadow: 1px 0 2px rgba(0, 0, 0, .1), 2px 0 2px rgba(0, 0, 0, .1), 3px 0 2px rgba(0, 0, 0, .1), 4px 0 2px rgba(0, 0, 0, .1), 5px 0 2px rgba(0, 0, 0, .1);
  visibility: hidden;
}
.rp-num-r {
  position: absolute;
  right: 0;
  top: -104px;
  width: 210px;
  height: 88px;
  padding-left: 2px;
  line-height: 88px;
  font-size: 40px;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 1px 0 2px rgba(0, 0, 0, .1), 2px 0 2px rgba(0, 0, 0, .1), 3px 0 2px rgba(0, 0, 0, .1), 4px 0 2px rgba(0, 0, 0, .1), 5px 0 2px rgba(0, 0, 0, .1);
  transform: rotateY(
          -41deg
  );
  text-align: left;
  visibility: hidden;
}
.conditionDesc {
  position: absolute;
  bottom: -76px;
  cursor: pointer;
  height: 48px;
  left: 68px;
  right: 68px;
  margin: auto;
  color: #fff;
  overflow: auto;
}
.close {
  position: absolute;
  bottom: -130px;
  cursor: pointer;
  width: 32px;
  height: 32px;
  left: 0;
  right: 0;
  margin: auto;
}
.chat-rank-modal {
  @{deep} .ivu-modal-header {
    display: none;
  }
  @{deep} .ivu-modal-content {
    background: url(/static/images/packet/hb_form_bg.png) no-repeat;
    background-size: 100%;
    height: 674px;
    position: relative;
    border: none;
  }
  @{deep} .ivu-modal-body {
    position: relative;
    top: 216px;
    height: 376px;
    padding: 0;
  }
  @{deep} .ivu-modal-close {
    display: none;
  }
  &.en {
    @{deep} .ivu-modal-content {
      background: url(/static/images/packet/hb_form_bg-en.png) center top no-repeat;
      background-size: cover;
    }
    @{deep} {
      .rp-num-l, .rp-num-r {
        visibility: visible;
      }
    }
  }
}
.chat-data-empty {
  text-align: center;
  width: 100%;
  padding: 30px;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
}
.chat-redpacket-list {
  overflow: auto;
  height: 376px;
  ul {
    position: relative;
  }
  li {
    position: relative;
    padding: 10px 100px 10px 10px;
    font-size: 14px;
    p {
      color: #fff;
      padding-left: 42px;
      position: relative;
    }
    .rp-icon {
      position: absolute;
      left: 4px;
      top: 50%;
      margin-top: -15px;
    }
    .cont {
      color: #fff;
      max-height: 11vw;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    .go {
      position: absolute;
      right: 10px;
      top: 8px;
      width: 80px;
      height: 28px;
      line-height: 28px;
      background: linear-gradient(to right, #fae799, #ffc04a);
      color: #c30b00;
      border-radius: 12px;
      text-align: center;
      cursor: pointer;
      &.disabled {
        background: linear-gradient(to right, #fff, #b9b9b9);
        cursor: not-allowed;
      }
    }
    &:last-child {
      border-bottom: 1px solid transparent;
    }
  }
}
.chat-rank-modal @{deep} .ivu-modal-footer {
  display: none;
}
.rp-icon {
  margin-right: 8px;
  width: 26px;
  height: 30px;
  float: none;
  vertical-align: middle;
}
</style>
