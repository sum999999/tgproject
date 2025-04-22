<template>
  <div class="pure-pwd-input-wp">
    <input
      ref="pwdObj"
      :type="type"
      autocomplete="off"
      :maxlength="maxLength"
      v-model="pwd"
      @input="iptPwd"
      @click="clickIpt"
    />
    <div class="chars">
      <span
        v-for="n of 6"
        :key="n"
      ><i v-show="pwd.length>=n"></i></span>
    </div>
  </div>
</template>

<script>
/**
 * 密码输入框
 */
export default {
  props: {
    maxLength: {
      //密码个数
      type: Number,
      default: 6
    },
    type: {
      //input的type
      type: String,
      default: "text"
    }
  },
  data() {
    return {
      pwd: ""
    };
  },
  methods: {
    /**
     * 清除输入的秘密,父组件调用
     */
    clearPwd() {
      this.pwd && (this.pwd = "");
    },
    clickIpt() {
      let rf = this.$refs["pwdObj"];
      let vLen = this.pwd.length;
      if (rf.setSelectionRange) {
        //非ie
        rf.setSelectionRange(vLen, vLen);
      } else {
        //ie
        let a = rf.createTextRange(); //ie支持creatTextRange
        a.moveStart("character", vLen);
        a.collapse(true);
        a.select(); //选中操作
      }
    },
    iptPwd() {
      let ipt = this.$refs["pwdObj"];
      if (this.pwd.length >= this.maxLength) {
        this.$refs["pwdObj"].blur();
      }
      this.$emit("send-pwd", this.pwd);
    }
  }
};
</script>

<style lang="less" scoped>
.pure-pwd-input-wp {
  position: relative;
  width: 100%;
  height: 100%;
  input {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 9px 14px;
    font-size: 13px;
    letter-spacing: 22px;
    /*   color:#be1204; */
    color: transparent\0\9;
    -webkit-text-fill-color: transparent;
    outline: none;
    background: none;
    border: 0;
    z-index: 9;
    &::selection {
      background-color: transparent;
    }
    &::-moz-selection {
      background-color: transparent;
    }
  }
  .chars {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    align-items: flex-start;
    flex-wrap: nowrap;
    width: 100%;
    height: 100%;
    border: 1px solid #ccc;
    border-radius: 3px;
    font-size: 0;
    span {
      float: left;
      width: 29px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      &:not(:last-child) {
        border-right: 1px solid #f0efef;
      }
      i {
        display: inline-block;
        vertical-align: middle;
        width: 10px;
        height: 10px;
        background-color: #000;
        border-radius: 10px;
      }
    }
  }
}
</style>
