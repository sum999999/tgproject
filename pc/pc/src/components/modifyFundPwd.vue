<template>
  <modal :modalShow='value'
         :title="$tex('温馨提示')"
         :okText="$tex('设置')"
         claName="pwd-modal"
         @btn-cancel='cancle'
         @btn-ok="handleAddSubmit">
    <div slot="content">
      <div>{{$tex("您尚未完善以下信息，请先完善。")}}<br>
        <div class="my-mt-field">
          <label for="">{{$tex("资金密码")}}</label>
          <input type="text"
                 ref="payPwd"
                 maxlength="4"
                 autocomplete="off"
                 v-model="payPwd"
                 @click="lastRange('payPwd')"
                 @input="setPayPwd('payPwd')" />
          <div class="analog-input">
            <span>
              <i v-show="payPwd.length >= 1"></i>
            </span>
            <span>
              <i v-show="payPwd.length >= 2"></i>
            </span>
            <span>
              <i v-show="payPwd.length >= 3"></i>
            </span>
            <span>
              <i v-show="payPwd.length >= 4"></i>
            </span>
          </div>
        </div>
        <div class="my-mt-field">
          <label for="">{{$tex("确认密码")}}</label>
          <input type="text"
                 ref="confirmPwd"
                 autocomplete="off"
                 maxlength="4"
                 v-model="confirmPwd"
                 @click="lastRange('confirmPwd')"
                 @input="setPayPwd('confirmPwd')" />
          <div class="analog-input">
            <span>
              <i v-show="confirmPwd.length >= 1"></i>
            </span>
            <span>
              <i v-show="confirmPwd.length >= 2"></i>
            </span>
            <span>
              <i v-show="confirmPwd.length >= 3"></i>
            </span>
            <span>
              <i v-show="confirmPwd.length >= 4"></i>
            </span>
          </div>
        </div>
        <span class="tip"
              v-if="textError">{{textError}}</span>
      </div>
    </div>
  </modal>
</template>
<script>
import encryption from '@/utils/md5';
import modal from '@/components/modal.vue';
export default {
  props: {
    value: false
  },
  components: { modal },
  data () {
    return {
      payPwd: '',
      confirmPwd: '',
      textError: ''
    }
  },
  methods: {
    setPayPwd (box) {
      let len = this[box].length;
      if (len >= 4) {
        let rf = this.$refs[box];
        // this[box] = this[box].substr(0, 4);
        rf.blur()
      }
    },
    lastRange (box) {
      let rf = this.$refs[box];
      let vLen = this[box].length;
      if (rf.setSelectionRange) {                    //非ie
        rf.setSelectionRange(vLen, vLen);
      } else {                                         //ie
        let a = rf.createTextRange();            //ie支持creatTextRange
        a.moveStart('character', vLen);
        a.collapse(true);
        a.select();                                //选中操作
      }
    },
    cancle () {
      this.$emit('input', false);
    },
    handleAddSubmit () {
      if (!this.payPwd) {        0
        this.textError = this.$tex('资金密码不能为空');
        return;
      }
      if (!this.confirmPwd) {
        this.textError = this.$tex('确认资金密码不能为空');
        return;
      }
      let payStr = /^\d{4}$/;
      if (!payStr.test(this.payPwd)) {
        this.textError = this.$tex('密码只能是数字');
        return;
      }
      if (this.confirmPwd !== this.payPwd) {
        this.textError = this.$tex('两次输入密码不一致');
        return;
      }
      let params = {
        payPwdType: '1',
        payPwd: encryption.encrypt.md5(this.payPwd)
      }
      this.$http.post('/api/v2/user/setPayPwd', params, { userId: true }).then(response => {
        if (response.data.code !== 0) return;
        this.$Message.success(this.$tex('设置资金密码成功'));
        this.$store.state.user.payPwdFlag = "1"
        this.$store.commit('getUser', this.$store.state.user)
        this.$emit('on-end');
        // this.$emit('input', false);
      })
    }
  }
}
</script>
<style lang="less">
.pwd-modal .ivu-modal-close {
  display: none;
}
.my-mt-field input:-webkit-autofill {
  -webkit-text-fill-color: #333;
}
.pwd-modal .close {
  display: block;
}
.my-mt-field {
  position: relative;
  height: 48px;
  padding: 0 10px;
  display: flex;
  align-items: center;
}
.my-mt-field label {
  color: #999;
  font-size: 16px;
  width: 95px;
  display: inline-block;
  word-break: break-all;
}
@hack:\9;
.my-mt-field input {
  height: 100%;
  position: absolute;
  left: 115px;
  right: 10px;
  z-index: 30;
  background: none;
  letter-spacing: 28px;
  padding-left: 18px;
  // opacity: 0;
  color:red;
  color:transparent\0\9;
  width: 144px;
  padding-right: 18px;
  text-shadow: #fff;
  -webkit-text-fill-color: transparent;
  border: 0;
  outline: none;
}
.my-mt-field input::selection{
  background-color: #fff;
}
.my-mt-field input::-moz-selection{
  background-color: #fff;
}
.my-mt-field .analog-input {
  height: 36px;
  border-left: 1px solid #eee;
  position: absolute;
  top: 6px;
  left: 115px;
  background-color:#fff;
}
.my-mt-field .analog-input span {
  display: inline-block;
  width: 36px;
  height: 36px;
  border: 1px solid #eee;
  text-align: center;
  line-height: 33px;
  float: left;
  border-left: 0;
}
.my-mt-field .analog-input span i {
  display: inline-block;
  width: 10px;
  height: 10px;
  background: #000;
  border-radius: 100%;
}
.pwd-modal .tip {
  display: block;
  margin-left: 115px;
  color: #ec0022;
  font-size: 12px;
}
</style>

