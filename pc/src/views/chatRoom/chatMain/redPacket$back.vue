<template>
  <div class="redpacket-wrap">

    <span
      class="redpacket-pos"
      @click="onShowRecket"
    >
      <img
        src="/static/images/chat/hongbao.png"
        alt=""
      >
    </span>
    <!--  发红包入口弹框 -->
    <Modal
      v-model="showRedpacketGulid"
      class="redpacket-dlg chat-dlg"
      width="415"
    >
      <span
        class="btn"
        @click="clkShowRedpacktDlg"
      >{{$tex("发红包")}}</span>
      <span
        class="btn btn-me"
        @click="goPage('#/personalCenter/trade')"
      >{{$tex("我的红包")}}</span>
    </Modal>

    <!--  发红包红包弹框 -->
    <Modal
      v-model="showRedpacketModal"
      class="redpacket-dlg2 chat-model"
      :title="$tex('发红包')"
    >
      <Form
        :model="redpackForm"
        ref="redpackForm"
        :rules="ruleInline"
        :label-width="80"
      >
        <FormItem
          :label="$tex('金额')"
          prop="totalMoney"
        >
          <Col span="18">
          <Input
            v-model="redpackForm.totalMoney"
            :placeholder="$tex('请填写红包金额')"
          />
          </Col>
          <Col
            span="4"
            offset="1"
          >{{$tex("元")}}</Col>
        </FormItem>
        <FormItem
          :label="$tex('个数')"
          prop="totalNum"
        >
          <Col span="18">
          <Input
            v-model="redpackForm.totalNum"
            :placeholder="$tex('请填写红包个数')"
          ></Input>
          </Col>
          <Col
            span="4"
            offset="1"
          >{{$tex('个')}}</Col>
        </FormItem>
        <FormItem
          :label="$tex('备注')"
          class="redpacketDesc"
          prop="redpacketDesc"
        >
          <Col span="18">
          <Input
            v-model="redpackForm.redpacketDesc"
            type="textarea"
            :readonly="true"
            :maxlength="25"
            :autosize="{minRows: 2,maxRows: 2}"
            placeholder=""
          ></Input>
          </Col>
          <Col
            span="4"
            offset="1"
          >
          </Col>
        </FormItem>
        <FormItem
          :label="$tex('密码')"
          prop="payPwd"
        >
          <Col span="18">
          <Input
            v-model="redpackForm.payPwd"
            type="password"
            :placeholder="$tex('请填写交易密码')"
          ></Input>
          </Col>

        </FormItem>
        <div
          class="balance"
          v-if="redpacketChatConfig"
        >
          {{$tex("余额")}}：
          <span class="money">{{redpacketChatConfig.balance | keepDecimalOf2}}{{$tex("元")}}</span>
        </div>
        <div class="btn-wrap">
          <span
            class="btn-red"
            @click="sendRedPacket('redpackForm')"
          >{{$tex("发红包")}}</span>
        </div>

      </Form>
    </Modal>

    <!--  抢红包入口弹框 -->
    <Modal
      v-model="showGetPacket"
      footer-hide
      class="getpacket-dlg chat-dlg"
      width="300"
    >
      <img
        class="hd"
        :src="currentMsg.user && currentMsg.user.portrait || defHdImg"
        alt=""
      >
      <p class="name">{{currentMsg.user && currentMsg.user.name}}</p>
      <p
        class="dec"
        v-if="currentMsg.redpacketStatus=='00'"
      >{{currentMsg.remark}}</p>
      <p
        class="dec"
        v-else
      >{{currentMsg.redpacketDesc}}</p>
      <!--  v-if="currentMsg.redpacketStatus=='00'"  00:可领,01:过期,02:已领,03:领完 -->
      <span
        class="open"
        @click="openRedPacket"
        v-if="currentMsg.redpacketStatus=='00'"
        :class="{
        'openning':openLoad,
        'en': !checkChineseKey()
        }"
      ></span>

      <!--  currentMsg.self || currentMsg.redpacketStatus!='00'-->
      <div
        class="look"
        v-if="currentMsg.self "
        @click="clkRedpacketList"
      >{{$tex("看看领取详情")}}></div>
    </Modal>

    <!--  红包详情 -->
    <Modal
      v-model="showRedpacketRetail"
      :title="$tex('红包详情')"
      class="redpacketDetail-dlg chat-dlg"
    >
      <div
        class="redpacket-info"
        v-if="redpacketListInfo.selfRedpacket"
      >
        <img
          class="me-hd"
          :src="currentMsg.user.portrait  || defHdImg"
          alt=""
        >
        <p class="me-name">{{currentMsg.user.name}}</p>
        <p class="me-money">
          <span
            class="num"
            v-if="redpacketListInfo.selfRedpacket.money"
          >{{redpacketListInfo.selfRedpacket.money | keepDecimalOf2}}</span> {{$tex("元")}}</p>
        <span
          class="link"
          @click.prevent="goPage('#/personalCenter/trade')"
        >{{$tex("查看我的红包详情")}}</span>
        <p
          class="tip"
          v-if="redpacketListInfo.selfRedpacket.money"
        >{{$tex("已存入余额，可直接消费")}}</p>
      </div>
      <div
        v-else-if="currentMsg.user"
        class="redpacket-info"
      >
        <img
          class="me-hd"
          :src="currentMsg.user.portrait  || defHdImg"
          alt=""
        >
        <p class="me-name">{{ currentMsg.user.name}}</p>
        <span
          class="link"
          @click.prevent="goPage('#/personalCenter/trade')"
        >{{$tex("查看我的红包详情")}}</span>
      </div>

      <!-- 自己的红包才能看得到 -->
      <div
        class="redpacket-box"
        v-if="redpacketListInfo.redpacketList && currentMsg.user.id == user.userId"
      >
        <div class="box-hd">{{redpacketListInfo.redpacketDesc}}</div>
        <ul class="redpacket-list nice-scroll">
          <li
            v-for="(item,index) in redpacketListInfo.redpacketList"
            :key="index"
          >
            <img
              class="hd"
              :src="item.userIcon"
              alt=""
            >
            <div class="cont">
              <p class="name">{{item.receiveUserCode}}</p>
              <p class="time">{{item.receiveTime }}</p>
            </div>
            <span class="money">{{item.money | keepDecimalOf2}} {{$tex("元")}}</span>
          </li>

        </ul>
      </div>
    </Modal>
  </div>
</template>

<script>
import encryption from "@/utils/md5";
import * as RongYun from '@/utils/rongyun';

import {
  UserTypes
} from "@/constant/user";
import { checkChineseKey } from "@/lang";

const HB_Msg_TYPE = "TG:HBMsg";
export default {
  props: {
    joinRoomSuccess: false,
    roomType: ""
  },
  data() {
    let validaMoney = (rule, value, callback) => {
      let val = Number(value);
      let redpacketChatConfig = this.redpacketChatConfig;
      if (
        val == 0 ||
        !/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(
          value
        )
      ) {
        callback(new Error(this.$tex("请填写正确的红包金额")));
      } else if (val < Number(redpacketChatConfig.redpacketMoneyMin)) {
        callback(
          new Error(this.$tex("红包金额必须大于等于{money}{unit}", {money: redpacketChatConfig.redpacketMoneyMin, unit: "元"}))
        );
      } else if (val > Number(redpacketChatConfig.redpacketMoneyMax)) {
        callback(
          new Error(this.$tex("红包金额必须小于等于{money}{unit}", { money: redpacketChatConfig.redpacketMoneyMax, unit: "元" }))
        );
      } else {
        callback();
      }
    };
    let validateNum = (rule, value, callback) => {
      let redpacketChatConfig = this.redpacketChatConfig;
      let val = Number(value);
      if (!/^[0-9](\d){0,1000000}$/.test(value)) {
        callback(new Error(this.$tex("请填写正确的红包个数")));
      } else if (val < Number(redpacketChatConfig.redpacketMin)) {
        callback(
          new Error(this.$tex("红包个数必须大于等于{num}", {num: redpacketChatConfig.redpacketMin }))
        );
      } else if (val > Number(redpacketChatConfig.redpacketMax)) {
        callback(
          new Error(this.$tex("红包个数必须小于等于{num}", { num: redpacketChatConfig.redpacketMax }))
        );
      } else {
        callback();
      }
    };
    let validaPayPwd = (rule, value, callback) => {
      if (!/^(\d){3,6}$/.test(value)) {
        callback(new Error(this.$tex("请填写正确的交易密码")));
      } else {
        callback();
      }
    };

    return {
      currentMsg: {},
      redpacketListInfo: {}, // 红包列表
      showRedpacketGulid: false,
      showRedpacketModal: false,
      showRedpacketRetail: false, // 红包详情
      showGetPacket: false, // 抢红包窗口
      openLoad: false,
      redpacketChatConfig: {},
      redpackForm: {
        totalMoney: "",
        totalNum: "",
        redpacketDesc: this.$tex("恭喜发财，大吉大利！"),
        payPwd: ""
      },
      ruleInline: {
        totalMoney: [
          { required: true, validator: validaMoney, trigger: "blur" }
        ],
        payPwd: [{ required: true, validator: validaPayPwd, trigger: "blur" }],
        totalNum: [{ required: true, validator: validateNum, trigger: "blur" }],
        redpacketDesc: [
          { required: true, message: this.$tex("请输入红包描述信息"), trigger: "blur" },
          {
            type: "string",
            min: 1,
            max: 25,
            message: this.$tex("描述信息长度不能超过{num}", {num: 25}),
            trigger: "blur"
          }
        ]
      },
      defHdImg: "/static/images/chat/chat_def_hd.png"
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  filters: {
    keepDecimalOf2(val) {
      return val ? Number(val).toFixed(2) : "0.00";
    }
  },
  methods: {
    checkChineseKey,
    goPage(link) {
      window.open(link, "_blank");
    },
    onShowRecket() {
      if (!this.joinRoomSuccess) {
        return;
      }
      if (!this.user.userCode) {
        //this.$parent.showLoginDialog = true;
        this.$store.commit("getShowLoginDialog", true);
        return;
      }
      if (this.user.userType === UserTypes.TRY_PLAY) {
        return;
      }
      this.payLoad = false;
      this.showRedpacketGulid = true;
    },
    clkShowRedpacktDlg() {
      this.queryRedpacketChatConfig();

      if (!this.user.userCode) {
        //this.$parent.showLoginDialog = true;
        this.$store.commit("getShowLoginDialog", true);
        return;
      }
      this.showRedpacketGulid = false;
      this.showRedpacketModal = true;
    },
    queryRedpacketChatConfig() {
      if (this.user.userCode) {
        this.$http
          .post(
            "/api/v2/user/redpacketChatConfig",
            {},
            {
              userId: true,
              unenc: true
            }
          )
          .then(response => {
            if (response.data.code !== 0) return;
            ///  vm.chatPeopleInfo = response.data.data;

            this.redpacketChatConfig = response.data.data;
          });
      }
    },
    clkRedpacketList() {
      // 查看红包列表
      this.showGetPacket = false;
      this.$http
        .post(
          "/api/v2/user/redpacketList ",
          {
            redpacketChatId: this.currentMsg.redpacketChatId
          },
          { userId: true, unenc: true }
        )
        .then(response => {
          this.showRedpacketRetail = true;
          if (response.data.code !== 0) return;
          this.redpacketListInfo = response.data.data;
        });
    },
    getRedpacket(item, roomNo) {
      // 点击抢红包
      this.currentMsg = JSON.parse(JSON.stringify(item));
      if (!this.user.userCode) {
        // this.$parent.showLoginDialog = true;
        this.$store.commit("getShowLoginDialog", true);
        return;
      }
      if (
        this.user.userType === UserTypes.TRY_PLAY ||
        item.state == 0 ||
        !this.currentMsg.redpacketChatId
      )
        return;

      this.$http
        .post(
          "/api/v2/user/redpacketStatus",
          {
            redpacketChatId: this.currentMsg.redpacketChatId,
            roomNo: roomNo
          },
          { userId: true, unenc: true }
        )
        .then(response => {
          this.openLoad = false;
          if (response.data.code !== 0) return;
          this.currentMsg.self = response.data.data.self;
          this.currentMsg.redpacketStatus = response.data.data.redpacketStatus; //00:可领,01:过期,02:已领,03:领完
          this.currentMsg.redpacketDesc = response.data.data.redpacketDesc;
          if (this.currentMsg.redpacketStatus == "02") {
            //this.showRedpacketRetail = true;  // 红包列表详情
            this.clkRedpacketList(); // 红包列表详情
          } else {
            this.showGetPacket = true;
          }
        });
    },
    getKUserMarkType() {
      if (!this.user.userId) {
        return "kUserMarkType_UnLogin"; // 未登录
      } else if (this.user.userType === UserTypes.TRY_PLAY) {
        return "kUserMarkType_Guest"; // 试玩
      }
      return "kUserMarkType_Login"; // 登录
    },
    /**
     * 设置信息需要携带的用户信心
     */
    setMessageUserInfo(message) {
      const senderUser = {
        id: this.user.userId,
        name: this.user.nickName || RongYun.FeatureEx.hideUserCode(this.chatUser.name),
        nickName: this.user.nickName,
        portrait: this.chatUser.portrait,
        userCode: this.user.userCode,
        userLevelIcon: this.user.userLevelIcon
      };
      message.user = {
        id: this.chatUser.uid,
        name: this.user.nickName || RongYun.FeatureEx.hideUserCode(this.chatUser.name),
        portrait: this.chatUser.portrait
      };
      message.extra.senderUser = senderUser;
      message.extra.sendUserLevelIcon = this.user.userLevelIcon;
      message.extra.userCode = this.user.userCode;
      message.extra.kUserMarkType = this.getKUserMarkType();
    },
    sendRedPacket(name) {
      // 发红包
      let vm = this;
      if (vm.payLoad) return;
      if (!this.redpacketChatConfig.passwordSet) {
        this.$Modal.confirm({
          title: this.$tex("温馨提示"),
          content:
            `<p>${this.$tex("您还没有设置过资金密码，请先设置!")}</p>`,
          onOk: () => {
            this.goPage("#/personalCenter/withdraw");
          }
        });
        return;
      }
      vm.$refs[name].validate(valid => {
        if (valid) {
          vm.payLoad = true;
          if (vm.user.userCode) {
            let pwd = encryption.encrypt.md5(vm.redpackForm.payPwd);

            let param = { ...vm.redpackForm };
            param.payPwd = pwd;
            this.$http
              .post("/api/v2/user/sendRedpacket", param, { userId: true })
              .then(response => {
                vm.payLoad = false;
                if (response.data.code == 166) {
                  this.$Modal.warning({
                    title: vm.$tex("提示"),
                    content: vm.$tex("余额不足")
                  });
                } else if (response.data.code == 1021) {
                  this.$Modal.warning({
                    title: vm.$tex("提示"),
                    content: response.data.msg
                  });
                }
                if (response.data.code !== 0) return;
                vm.showRedpacketModal = false;

                var message = new RongIMClient.RegisterMessage.HBMessage({
                  content: "",
                  extra: {
                    type: "103",
                    redpacketChatId: response.data.data.redpacketChatId,
                    remark: vm.redpackForm.redpacketDesc
                  },
                  user: {}
                });
                vm.setMessageUserInfo(message);
                message.objectName === HB_Msg_TYPE;
                // vm.sendIMMessage(message);
                vm.$emit("sendRedPacketMessage", message);
                vm.redpackForm = {
                  totalMoney: "",
                  totalNum: "",
                  redpacketDesc: vm.$tex("恭喜发财，大吉大利！"),
                  payPwd: ""
                };
              });
          } else {
            vm.payLoad = false;
          }
        } else {
        }
      });
    },
    openRedPacket() {
      // 抢红包
      if (
        !this.joinRoomSuccess ||
        this.openLoad ||
        !this.user.userCode ||
        this.user.userType === UserTypes.TRY_PLAY
      )
        return;
      this.openLoad = true;
      let roomId = this.$store.state.chatRoomId;
      if (this.roomType === "0") {
        roomId = "";
      }
      // let currentRoomId = '';
      // if (this.$route.name === 'chatRoom') {
      //   currentRoomId = ''
      // } else {
      //   currentRoomId =  roomId;
      // }
      this.$http
        .post(
          "/api/v2/user/receiveRedpacket",
          {
            redpacketChatId: this.currentMsg.redpacketChatId,
            roomId: roomId
          },
          { userId: true }
        )
        .then(response => {
          const { code, msg } = response.data;
          this.openLoad = false;
          if (0 == code) {
            this.clkRedpacketList();
          } else if (179 == code) {
            this.currentMsg.redpacketStatus = "03";
            this.currentMsg.redpacketDesc = response.data.msg;
          } else {
            this.$Message.error(msg);
          }
        });
    }
  }
};
</script>

<style lang="less" scoped>
  @deep: ~">>>";
.redpacket-wrap {
  display: inline-block;
  vertical-align: text-bottom;
  height: 22px;
  line-height: 35px;
}
.redpacket-pos {
  /*    position: absolute;
    right: 10px;
    top: 90px;
    text-align: center; */
  img {
    cursor: pointer;
    width: 30px;
  }
}
.redpacket-dlg {
  @{deep} {
    .btn {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: block;
      width: 113px;
      text-align: center;
    }
  }
}
</style>
