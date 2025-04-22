<template>
  <div class="bankValid">
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
              v-model="param.accountName"
              @on-blur="accountNameValid"
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
            :placeholder="$tex('请输入您的银行卡号')"
            type="text"
            class="mt"
            v-model="param.bankNo"
            style="width: 310px;height:46px;"
          />
          <Input
              :placeholder="$tex('请输入您的真实姓名')"
              class="mt"
              v-model="param.realName"
              style="width: 310px;height:46px;"
          />
        </div>
        <div class="t-btn">
          <div
            class="p-submit"
            :class="{disabled:disabled}"
            @click.stop="subMit"
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
        <i18n class="p-txt" path="您的重置密码为：{num}" tag="div">
          <template slot="num">
            <span>{{ pwd }}</span>
          </template>
        </i18n>
        <div
          class="p-copy"
          :class="[isDisabled?'disabled':'']"
          @click.stop="copy"
        >{{copyTxt}}</div>
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
import Util from "@/utils/utils";
export default {
  data() {
    return {
      theme: this.$tex("银行卡信息验证"),
      warn: false,
      isSuccess: 0,
      msg: "",
      pwd: "",
      copyTxt: this.$tex("点击复制"),
      isSubmit: true,
      isDisabled: false,
      disabled: true,
      submitStatus: false, // 阻止重复提交
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
    "param.realName": {
      handler(newName, oldName) {
        this.realNameValid();
      },
      immediate: true
    },
    "param.bankNo": {
      handler(newName, oldName) {
        this.bankValid();
      },
      immediate: true
    }
  },
  methods: {
    /**
     * 账号验证
     */
    accountNameValid() {
      let vm = this;
      this.submitStatus = false;
      this.isSuccess = 0;
      let { accountName, bankNo, realName } = this.param;
      if (!accountName) {
        this.disabled = true;
        return;
      }
      this.$http
        .post(
          "api/v2/user/passWordUserCode",
          {
            userCode: accountName,
            userType: "bink"
          },
          { unenc: true, loading: true, stopDialog: true }
        )
        .then(response => {
          if (response.data.code !== 0) {
            this.warn = true;
            this.msg = response.data.msg;
            this.disabled = true;
            this.isSuccess = 1;
            return;
          }
          if (response.data.data) {
            this.isSuccess = 2;
            this.acName = true;
            this.userId = response.data.data.userId;
            if (bankNo && realName) {
              this.disabled = false;
            }
          }
        });
    },
    /***
     * 银行卡验证
     */
    bankValid() {
      let { accountName, bankNo, realName } = this.param;
      if (!bankNo) {
        this.disabled = true;
        return;
      }
      if (!realName) {
        return;
      }
      if (Util.CapitalLength(realName) < 4) {
        return;
      }
      if (!accountName) {
        return;
      }
      this.disabled = false;
    },
    /***
     * 真实姓名验证
     */
    realNameValid() {
      let { accountName, bankNo, realName } = this.param;
      if (!realName) {
        this.disabled = true;
        return;
      }
      if (!bankNo) {
        return;
      }
      if (!accountName) {
        return;
      }
      this.disabled = false;
    },
    subMit() {
      let vm = this;
      let { accountName, bankNo, realName } = this.param;
      if (!this.userId) {
        return;
      }
      let userId = this.userId;
      if (!accountName) {
        return;
      }
      if (!realName) {
        return;
      }
      if (Util.CapitalLength(realName) < 4) {
        this.warn = true;
        this.msg = this.$tex("请填写全名");
        this.disabled = true;
        return;
      }
      if (!bankNo) {
        return;
      }
      if (bankNo.length < 16) {
        this.warn = true;
        this.msg = this.$tex("银行卡号码不能少于{num}位", {
          num: 16
        });
        this.disabled = true;
        return;
      }
      if (this.isSubmitIng) return;
      this.isSubmitIng = true;
      this.$http
        .post(
          "api/v2/user/passWordBink",
          {
            bankNo: bankNo,
            accountName: realName,
            userId: userId,
            type: "00"
          },
          { unenc: true, loading: true, stopDialog: true }
        )
        .then(response => {
          this.isSubmitIng = false;
          if (response.data.code !== 0) {
            this.warn = true;
            this.msg = response.data.msg;
            this.disabled = true;
            return;
          }
          if (response.data.data) {
            this.pwd = response.data.data.pwd;
            this.isSubmit = false;
            this.isDisabled = false;
          }
        });
    },
    /***
     * 点击复制
     */
    copy() {
      let vm = this;
      this.isDisabled = true;
      this.copyTxt = this.$tex("已复制");
      Util.copyText(this.pwd);
      vm.$router.push({
        name: "login",
        query: {
          redirect: encodeURIComponent(this.$route.path)
        }
      });
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
.p-img {
  width: 100%;
  margin: 96px auto 0;
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
  color: #0ce22f;
}
.p-txt {
  text-align: center;
  margin-top: 12px;
  font-size: 18px;
  color: #333;
}
.p-copy {
  width: 310px;
  height: 44px;
  margin: 0 auto;
  margin-top: 18px;
  font-size: 18px;
  line-height: 45px;
  text-align: center;
  color: #fff;
  background-color: #bf1204;
  border-radius: 6px;
  cursor: pointer;
  &.disabled {
    background-color: #cccccc;
  }
}
.userInput {
  position: relative;
  .iconfont {
    position: absolute;
    top: 6px;
    right: 21px;
    font-size: 23px;
    color: #61f056;
    &.icon-close {
      /* color: #be1204; */
    }
  }
}
</style>


