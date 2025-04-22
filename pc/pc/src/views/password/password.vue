<template>
  <div class="password accout-pwd">
    <t-nav
      :title="theme"
      :hide="isSubmit"
    >
      <div class="selectType">
        <div class="p-type pl">
          <div class="p-icon">
            <i class="iconfont  icon-phone"></i>
          </div>
          <div class="p-txt">
            <h3>{{$tex("手机号码验证")}}</h3>
            <p>{{$tex("填写您的账号，手机号")}}</p>
          </div>
          <div
            class="p-btn"
            @click="goPhoneValid"
          >
            <i class="iconfont icon-qianjin"></i>
          </div>
        </div>
<!--        <div class="p-type pr">-->
<!--          <div class="p-icon">-->
<!--            <i class="iconfont icon-bank"></i>-->
<!--          </div>-->
<!--          <div class="p-txt">-->
<!--            <h3>银行卡信息验证</h3>-->
<!--            <p>填写您的账号，银行卡 真实姓名</p>-->
<!--          </div>-->
<!--          <div-->
<!--            class="p-btn"-->
<!--            @click="goBankValid"-->
<!--          >-->
<!--            <i class="iconfont icon-qianjin"></i>-->
<!--          </div>-->
<!--        </div>-->
      </div>
    </t-nav>
  </div>
</template>
<script>
import tNav from "@/components/t_nav.vue";
export default {
  data() {
    return {
      theme: this.$tex("忘记密码"),
      isSubmit: true
    };
  },

  methods: {
    goBankValid() {
      this.$router.push("/bankValid");
    },
    goPhoneValid() {
      return this.$Modal.info({
        title: this.$tex('忘记密码'),
        content: this.$tex('请使用移动端操作'),
        onOk: () => {}
      });
      this.$router.push("/phoneValid");
    }
  },
  components: { tNav }
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
.selectType {
  width: 488px;
  margin: 52px auto 0;
  .p-type {
    width: 194px;
    height: 245px;
    border: 1px solid #f2f2f2;
    border-radius: 6px;
    &.pl {
      /*float: left;*/
      margin: auto;
    }
    &.pr {
      float: right;
    }
    .p-txt {
      h3,
      p {
        text-align: center;
        padding: 0 23px;
      }
      h3 {
        font-size: 18px;
        color: #333333;
        font-weight: 400;
      }
      p {
        font-size: 12px;
        color: #8b8c8d;
      }
    }
    .p-btn {
      text-align: center;
      cursor: pointer;
    }
  }
  &.pr {
    float: right;
  }
  .p-txt {
    h3,
    p {
      text-align: center;
    }
    h3 {
      font-size: 18px;
      color: #333333;
      font-weight: 400;
    }
    p {
      font-size: 12px;
      color: #8b8c8d;
    }
  }
  .p-btn {
    text-align: center;
    cursor: pointer;
  }
}
// }
.p-icon {
  text-align: center;
  /*   color: #be1204; */
  height: 110px;
  line-height: 110px;
}
.p-btn {
  margin-top: 25px;
  .iconfont {
    font-size: 25px;
    color: #d9d9d9;
  }
}
@{deep} .icon-phone,
.icon-bank {
  font-size: 50px;
}
</style>


