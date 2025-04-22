<template>
  <div class="yi-dun" v-show="isOpenBehavior">
    <div :id="id"></div>
    <div ref="popupBtn" v-if="showPopupBtn" class="behavior-button" :class="behaviorStatusClass" :id="btnId">
      <span class="txt">
        <template v-if="behaviorStatusClass === 'success'">{{$tex("验证成功")}}</template>
        <template v-else-if="behaviorStatusClass === 'error'">{{$tex("验证失败")}}</template>
        <template v-else>{{$tex("请点击按钮进行行为验证")}}</template>
      </span>
    </div>
  </div>
</template>

<script>
let sxeInstance = null;

export default {
  name: "YiDun",
  props: {
    moduleName: {
      // YI_DUN_VAILD_CONFIG
      type: String,
      required: true,
      validator: function (value) {
        return ['addAgent', 'bindPhone', 'loginFilter', 'realNameAct', 'register'].indexOf(value) !== -1
      }
    },
    mode: {
      type: String,
      default: "float",
      validator: function (value) {
        return ['float', 'popup'].indexOf(value) !== -1
      }
    },
    width: {
      type: String,
      default: "auto"
    }
  },
  data() {
    return {
      prefix: "yi-dun",
      uid: "",
      productNumber: "",
      yiDunConfig: {},
      behaviorInstance: null,
      behaviorSuccess: false,
      behaviorValidate: "",
      entryBehaviorVerify: false
    };
  },
  computed: {
    showPopupBtn() {
      return this.mode === "popup";
    },
    id() {
      return `${this.prefix}-${this.uid}`;
    },
    btnId() {
      return `${this.id}-btn`;
    },
    behaviorStatusClass() {
      if (this.entryBehaviorVerify) {
        return this.behaviorSuccess ? "success" : "error";
      } else {
        return "";
      }
    },
    isOpenBehavior() {
      return this.yiDunConfig.captchaFlag;
    },
    isOpenSXE() {
      return this.yiDunConfig.antiCheatFlag;
    }
  },
  created() {
    this.uid = window.uuid();
  },
  mounted() {
    this.bindPopupEvent();
    this.handleYiDunSysConfig().then(() => {
      if (this.isOpenBehavior) {
        this.initBehavior();
      }
      if (this.isOpenSXE) {
        this.initSXE()
      }
    });
  },
  beforeDestroy() {
    this.removePopupEvent();
    this.destroyBehavior();
  },
  methods: {
    bindPopupEvent() {
      if (this.showPopupBtn) {
        this.$refs.popupBtn.addEventListener("click", this.handleBehaviorPopup);
      }
    },
    removePopupEvent() {
      if (this.showPopupBtn) {
        this.$refs.popupBtn.removeEventListener("click", this.handleBehaviorPopup);
      }
    },
    async handleYiDunSysConfig() {
      const sysConfig = await this.$store.dispatch("querySystemConfig");
      const yiDunConfig = JSON.parse(sysConfig["YI_DUN_VAILD_CONFIG"]);
      this.productNumber = yiDunConfig.productNumber;
      this.yiDunConfig = yiDunConfig[this.moduleName];
    },
    async initSXE() {
      // 初始化反作弊
      if (sxeInstance) {
        return sxeInstance;
      }
      sxeInstance = await new Promise((resolve, reject) => {
        window.initWatchman({
          productNumber: this.productNumber,
          onload: function(instance) {
            resolve(instance);
          },
          onerror: function(error) {
            reject(new Error(error));
          }
        });
      });
    },
    async getSXEToken() {
      // 获取反作弊token
      if (!this.yiDunConfig.businessId) {
        throw new Error("businessId not empty");
      }
      const token = await new Promise(resolve => {
        sxeInstance.getToken(this.yiDunConfig.businessId, function(token) {
          resolve(token);
        });
      });
      return token;
    },
    async initBehavior() {
      window.initNECaptcha(
        {
          captchaId: this.yiDunConfig.captchaId,
          element: document.getElementById(`${this.id}`),
          mode: this.mode,
          width: this.width,
          onVerify: (err, res) => {
            this.entryBehaviorVerify = true;
            if (!err) {
              this.behaviorSuccess = true;
              this.behaviorValidate = res.validate;
            } else {
              this.behaviorSuccess = false;
            }
            this.$emit("verify", {
              err,
              data: res
            })
          },
          onClose: () => {
            this.$emit("popup-close");
          }
        },
        instance => {
          // 初始化成功
          this.behaviorInstance = instance;
        },
        err => {
          console.log(err);
          this.$Message.error(this.$tex("行为验证失败"));
        }
      );
    },
    resetBehavior() {
      this.entryBehaviorVerify = false;
      this.behaviorSuccess = false;
    },
    refreshBehavior() {
      if (this.behaviorInstance) {
        this.behaviorInstance.refresh();
        this.behaviorValidate = "";
      }
    },
    destroyBehavior() {
      this.behaviorInstance && this.behaviorInstance.destroy()
    },
    handleBehaviorPopup() {
      if (this.behaviorInstance) {
        this.behaviorInstance.popUp();
        this.refreshBehavior();
      }
    }
  }
};
</script>

<style scoped lang="less">
  .behavior-button {
    background-color: #f7f9fa;
    text-align: center;
    height: 2.1rem;
    padding: 12px 10px 12px 5px;
    border-radius: 20px;
    display: flex;
    align-self: center;
    width: 100%;
    cursor: pointer;
  }
  .behavior-button .txt {
    flex: 1;
    display: flex;
    align-self: center;
  }
  .behavior-button .txt {
    flex: 1;
    text-align: center;
    font-size: 0.6rem;
    justify-content: center;
  }
  .behavior-button::before {
    content: "\F400";
    font-size: 1.5rem;
    line-height: 0.6rem;
    color: #0ecf9b;
    font-family: 'Ionicons';
    margin-left: 6px;
  }
  .behavior-button::after {
    content: "\F2A9";
    font-size: 1.5rem;
    line-height: 0.6rem;
    color: #d2d2d2;
    font-family: 'Ionicons';
  }
  .behavior-button.success {
    background-color: #f1fcf8;
  }
  .behavior-button.success::before {
    color: #0ece9b;
    content: "\F3FF";
    font-size: 1.5rem;
    line-height: 0.6rem;
    font-family: 'Ionicons';
    margin-left: 4px;
  }
  .behavior-button.success::after {
    color: #c5f0e6;
  }
  .behavior-button.success .txt {
    color: #0ece9b;
  }
  .behavior-button.error {
    background-color: #fef0f0;
  }
  .behavior-button.error::before {
    color: #ee0022;
    content: "\F44D";
    font-family: 'Ionicons';
    font-size: 1.5rem;
    line-height: 0.6rem;
    margin-left: 4px;
  }
  .behavior-button.error .txt {
    color: #ee0022;
  }
  .behavior-button.error::after {
    color: #edcdd2;
  }
</style>
