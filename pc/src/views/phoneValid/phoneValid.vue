<template>
  <div class="phoneValid">
    <t-nav
      :title="theme"
      :hide="isSubmit"
    >
      <div v-if="isSubmit">
        <div class="b-wrap">
          <div class="userInput">
            <Input
              :placeholder="$tex('请输入账号')"
              style="width: 310px;height:46px;"
              v-model="param.userName"
              @on-blur="getNumber"
            />
            <i v-if="isSuccess===0"></i>
            <i
              class="iconfont icon-close"
              v-else-if="isSuccess===1"
            ></i>
            <i
              class="iconfont icon-check"
              v-else-if="isSuccess===2"
            ></i>
          </div>
          <Input
            :placeholder="$tex('手机号，请先验证账号')"
            readonly
            class="mt"
            style="width: 310px;height:46px;"
            v-model="param.showNumber"
          />
          <div class="smsWarp">
            <Input
              :placeholder="$tex('请输入短信验证码')"
              class="mt"
              style="width: 310px;height:46px;"
              v-model=" param.smsPhoneCode"
            />
            <span
              class="yzm-btn"
              v-if="downTimeText"
            >{{downTimeText}}S</span>
            <span
              class="yzm-btn redB"
              v-else
              @click="onPhoneYzm"
            >{{$tex("获取验证码")}}</span>
          </div>
        </div>
        <div class="t-btn ">
          <div
            class="p-submit"
            :class="{disabled:disabled}"
            @click.stop="updatePassword"
          >{{$tex("提交")}}</div>
        </div>
      </div>
      <div v-else>
        <div class="p-img">
          <img
            src="/static/images/chenggong.png"
            alt=""
          >
        </div>
        <div class="p-status">{{$tex("验证成功")}}</div>
        <div class="p-txt">{{$tex("重置密码已发送至您的手机号，请注意查收")}}</div>
      </div>
    </t-nav>
    <Modal
      v-model="warn"
      width="247"
      :closable="false"
      :footerHide="true"
      class-name="vertical-center-modal"
    >
      <p>{{msg}}</p>
    </Modal>
  </div>
</template>

<script>
import tNav from "@/components/t_nav.vue";
export default {
  data() {
    return {
      warn: false,
      msg: "",
      downTimeText: "",
      theme: this.$tex("手机号码验证"),
      isSubmit: true,
      isSend: false,
      disabled: true,
      submitStatus: false, // 阻止重复提交
      isSuccess: 0,
      param: {}
    };
  },
  watch: {
    param: {
      handler: function(val, oldval) {
        this.isDisabled = true;
      },
      deep: true //对象内部的属性监听，也叫深度监听
    },
    "param.userName": {
      handler(newName, oldName) {
        if (!newName) {
          this.isSuccess = false;
          this.$set(this.param, "showNumber", "");
          this.$set(this.param, "smsPhoneCode", "");
          this.downTimeText = "";
        }
      },
      immediate: true
    },
    "param.smsPhoneCode": {
      handler(newName, oldName) {
        this.resetState();
      },
      immediate: true
    }
  },
  methods: {
    /***
    获取电话号码
     */
    getNumber() {
      let vm = this;
      this.disabled = true;
      let { userName, phoneNumber, smsPhoneCode } = this.param;
      this.isSend = true;
      this.userId = "";
      this.isSuccess = 0;
      if (!userName) {
        this.isSend = false;
        this.warn = true;
        this.msg = this.$tex("账号不能为空");
        this.isDisabled = true;
        return;
      }
      this.$http
        .post(
          "api/v2/user/passWordUserCode",
          {
            userCode: userName
          },
          { unenc: true, stopDialog: true }
        )
        .then(response => {
          this.isSend = false;
          if (response.data.code !== 0) {
            this.warn = true;
            this.msg = response.data.msg;
            this.isSuccess = 1;
            this.isDisabled = true;
            vm.$set(this.param, "showNumber", "");
            return;
          }
          if (response.data.data) {
            this.isSuccess = 2;
            this.showPhone = response.data.data.phone.replace(
              /^(\d{3})\d{4}(\d+)/,
              "$1****$2"
            );
            // localStorage.setItem('user', JSON.stringify(response.data.data.userId));
            // vm.$store.commit('getUser', response.data.data.userId);
            this.userId = response.data.data.userId;
            vm.$set(this.param, "phoneNumber", response.data.data.phone);
            vm.$set(this.param, "showNumber", this.showPhone);
          }
        });
    },
    /**
     * 获取短信验证码
     */
    onPhoneYzm() {
      let { userName, phoneNumber, smsPhoneCode } = this.param;
      if (!this.userId) {
        return;
      }
      let userId = this.userId;
      this.$http
        .post(
          "/api/v2/user/smsYunXinPhone",
          {
            type: 2,
            smsType: 1,
            userId: userId,
            phoneNumber: phoneNumber
          },
          { unenc: false, stopDialog: true }
        )
        .then(response => {
          if (response.data.code !== 0) {
            this.warn = true;
            this.msg = response.data.msg;
            return;
          }
          this.downTime();
          this.sms = true;
        });
    },
    /**
     * 倒计时
     */
    downTime() {
      this.downTimeText = 300;
      this.timer = setInterval(() => {
        this.downTimeText--;
        if (this.downTimeText <= 0) {
          this.downTimeText = 0;
          clearInterval(this.timer);
        }
      }, 1000);
    },
    /***
     * 重置密码
     */
    updatePassword() {
      let vm = this;
      let userId = this.userId;
      let sms = this.sms;
      let { userName, phoneNumber, smsPhoneCode } = this.param;
      if (!userId) {
        return;
      }
      if (!smsPhoneCode) {
        return;
      }
      if (!sms) {
        return;
      }
      if (this.submitStatus) return;
      this.submitStatus = true;
      this.$http
        .post(
          "/api/v2/user/smsYunXinPhone",
          {
            type: 2,
            smsType: 2,
            userId: userId,
            code: smsPhoneCode,
            phoneNumber: phoneNumber
          },
          { unenc: false }
        )
        .then(response => {
          if (response.data.code !== 0) return;
          this.isSubmit = false;
           this.$Modal.info({
            title: this.$tex("手机验证成功"),
            content: this.$tex("现在为您跳转"),
            onOk: () => {
              vm.$router.push({
                name: "login",
                query: {
                  redirect: encodeURIComponent(this.$route.path)
                }
              });
            }
          });
        });
    },
    resetState() {
      this.disabled = true;
      this.submitStatus = false;
      let sms = this.sms;
      let { userName, phoneNumber, smsPhoneCode } = this.param;
      if (!this.userId) {
        return;
      }
      if (!phoneNumber) {
        return;
      }
      if (!smsPhoneCode) {
        return;
      }
      if (!sms) {
        return;
      }
      this.disabled = false;
    }
  },
  components: { tNav }
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
.b-wrap {
  width: 310px;
  margin: 62px auto 0;
  @{deep} .ivu-input {
    height: 46px;
    outline: none;
  }
  @{deep} .ivu-input:hover {
    box-shadow: 0 0 0 0 rgba(55, 255, 255, 0);
    border-color: #efefef;
  }
  @{deep} .ivu-input:focus {
    box-shadow: 0 0 0 0 rgba(55, 255, 255, 0);
    border-color: #eee;
  }
  @{deep} .ivu-input {
    padding-left: 38px;
    font-size: 14px;
    color: #333;
  }
  ::-webkit-input-placeholder {
    color: #a9a9a9;
  }
  ::-moz-placeholder {
    color: #a9a9a9;
  }
  ::-moz-placeholder {
    color: #a9a9a9;
  }
  :-ms-input-placeholder {
    color: #a9a9a9;
  }
  .mt {
    margin-top: 12px;
  }
}
.t-btn {
  width: 310px;
  margin: 44px auto 0;
  .p-submit {
    width: 100%;
    height: 44px;
    line-height: 44px;
    border-radius: 6px;
    font-size: 18px;
    color: #fff;
    text-align: center;
    background: #bf1204;
    cursor: pointer;
    &:hover {
      background-color: #e43535;
      border-color: #e43535;
    }
    &.disabled {
      background: #ddd;
      color: #fff;
    }
  }
}
.p-img {
  width: 100%;
  margin: 118px auto 0;
  text-align: center;
  font-size: 0;
  img {
    width: 98px;
    float: none;
  }
}
.p-status {
  text-align: center;
  margin-top: 30px;
  font-size: 24px;
  // color: #0ce22f;
}
.p-txt {
  text-align: center;
  margin-top: 26px;
  font-size: 18px;
  color: #333;
}
.smsWarp {
  position: relative;
  .yzm-btn {
    position: absolute;
    top: 12px;
    right: 0;
    width: 103px;
    height: 46px;
    cursor: pointer;
    font-size: 12px;
    line-height: 46px;
    color: #fff;
    text-align: center;
    border-radius: 4px;
    background: #cccccc;
    // &.redB {
    //   background-color: #bf1204;
    // }
  }
}
@{deep} .vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
    p {
      text-align: center;
      font-size: 17px;
      color: #2c2c2c;
      padding: 11px 0;
    }
  }
}
.userInput {
  position: relative;
  .iconfont {
    position: absolute;
    top: 6px;
    right: 21px;
    font-size: 23px;
    // color: #61f056;
    &.icon-close {
      /*   color: #be1204; */
    }
  }
}
</style>


