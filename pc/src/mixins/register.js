import encryption from "@/utils/md5";
import agree from "@/components/agree.vue";
import { getConfigList } from "@/utils/getSysConfig";
import utils from "@/utils/utils";
import YiDun from "@/components/YiDun";
import { mapGetters } from "vuex";
import { hasPermission } from "@/utils/authority-utils";
import { getInvitedInquire } from "@/api/app.js";

export default {
  components: { agree, YiDun },
  data() {
    const validaName = (rule, value, callback) => {
      let flag = false;
      if (!value) {
        callback(new Error(this.$tex("请输入账号")));
      } else if (/[^A-Za-z0-9]/g.test(value)) {
        callback(new Error(this.$tex("请输入数字和字母")));
      } else if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
        callback(new Error(this.$tex("账号必须包含数字和字母")));
      } else if (value.length < 8 || value.length > 14) {
        callback(
          new Error(this.$tex("账号在{min}至{max}位之间", { min: 8, max: 14 }))
        );
      } else {
        callback();
        flag = true;
      }
      this.showUserCodeTip = flag;
    };
    const validatePass = (rule, value, callback) => {
      let flag = false;
      if (!value) {
        callback(new Error(this.$tex("请输入密码")));
      } else if (/[^A-Za-z0-9]/g.test(value)) {
        callback(new Error(this.$tex("请输入数字和字母")));
      } else if (value.length < 6 || value.length > 14) {
        callback(
          new Error(this.$tex("密码在{min}至{max}位之间", { min: 6, max: 14 }))
        );
      } else {
        if (this.formCustom.passwdCheck) {
          this.$refs.formCustom.validateField("passwdCheck");
        }
        callback();
        flag = true;
      }
      this.showPasswordTip = flag;
    };

    const validatePassCheck = (rule, value, callback) => {
      //确认密码
      if (!value) {
        callback(new Error(this.$tex("请输入密码")));
      } else if (value !== this.formCustom.password) {
        callback(new Error(this.$tex("两次输入的密码不一致")));
      } else {
        callback();
      }
    };
    const validateAgree = (rule, value, callback) => {
      //同意协议
      if (!value) {
        callback(new Error(this.$tex("请勾选开户协议")));
      } else {
        callback();
      }
    };
    const fundNumber = (rule, value, callback) => {
      // 只能输入数字
      if (this.otherData.phone.need && !value) {
        callback(new Error(this.$tex("请输入您的手机号码")));
      } else if (
        hasPermission("validator.phone.length") &&
        value &&
        !/^1(\d){10}$/.test(value)
      ) {
        callback(new Error(this.$tex("手机号码输入有误")));
      } else {
        callback();
      }
    };

    const validRealName = (rule, value, callback) => {
      if (this.otherData.realName.need && !value) {
        callback(new Error(this.$tex("请输入您的姓名")));
      } else if (
        hasPermission("validator.chinese") &&
        value &&
        !/^[\u4e00-\u9fa5]+((·|•)?[\u4e00-\u9fa5]+)$/.test(value)
      ) {
        callback(
          new Error(
            this.$tex("请输入{min}-{max}位的中文字符", { min: 2, max: 16 })
          )
        );
      } else if (
        hasPermission("validator.chinese") &&
        value &&
        (value.length < 2 || value.length > 16)
      ) {
        callback(
          new Error(
            this.$tex("请输入{min}-{max}位的中文字符", { min: 2, max: 16 })
          )
        );
      } else {
        callback();
      }
    };

    const validIdcard = (rule, value, callback) => {
      if (this.otherData.idCard.need && !value) {
        callback(new Error(this.$tex("请输入您的身份证号码")));
      } else if (value && !/^((\d){14}|(\d){17})(\d|x|X)$/.test(value)) {
        callback(new Error(this.$tex("身份证号码输入有误")));
      } else {
        callback();
      }
    };
    const validEmail = (rule, value, callback) => {
      if (this.otherData.email.need && !value) {
        callback(new Error(this.$tex("请输入您的邮箱")));
      } else if (
        value &&
        !/^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/.test(
          value
        )
      ) {
        callback(new Error(this.$tex("邮箱号码输入有误")));
      } else {
        callback();
      }
    };
    const validQQ = (rule, value, callback) => {
      if (this.otherData.qq.need && !value) {
        callback(new Error(this.$tex("请输入您的QQ号码")));
      } else if (value && !/^\d{5,16}$/.test(value)) {
        callback(new Error(this.$tex("QQ号码输入有误")));
      } else {
        callback();
      }
    };
    const validWechat = (rule, value, callback) => {
      if (this.otherData.wechat.need && !value) {
        callback(new Error(this.$tex("请输入您的微信号")));
      } else if (value && !/^[-_a-zA-Z0-9]{5,20}$/.test(value)) {
        callback(
          new Error(
            this.$tex("{min}-{max}个字符,字母、数字、下划线和-", {
              min: 5,
              max: 20,
            })
          )
        );
      } else {
        callback();
      }
    };
    const validSmsPhoneCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$tex("请输入短信验证码")));
      } else if (!/^[0-9]*?$/gim.test(value)) {
        callback(new Error(this.$tex("请输入纯数字")));
      } else {
        callback();
      }
    };
    return {
      ttCode: "",
      loginAvatar: "",
      showUserCodeTip: true,
      isCheckPassWord: false,
      showPasswordTip: true,
      otherData: {
        smsPhoneCode: "",
        realName: "",
        idCard: "",
        phone: "",
        email: "",
        qq: "",
        wechat: "",
        expandCode: {},
      },
      ewmUrl: "", //图形验证码
      urlExp: false,
      urlTTPaste: false,
      // timeInter: new Date().getTime(),
      smsPhoneCodeText: this.$tex("发送验证码"),
      smsPhoneCodeTime: 300,
      smsPhoneCodeDisabled: false,
      formCustom: {
        smsPhoneCode: "",
        userCode: "",
        password: "",
        passwdCheck: "", // 不传给后端
        expandCode: "",
        checkCode: "",
        agree: true,
        userType: "00", // 判断是不是试玩
        realName: "",
        phone: "",
        idCard: "",
        email: "",
        qq: "",
        wechat: "",
        // currency: ""
      },
      modal1: false,
      expandCodeMust: false,
      ruleInline: {
        userCode: [{ validator: validaName, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
        passwdCheck: [{ validator: validatePassCheck, trigger: "blur" }],
        checkCode: [
          {
            required: true,
            message: this.$tex("请输入验证码"),
            trigger: "blur",
          },
        ],
        smsPhoneCode: [{ validator: validSmsPhoneCode, trigger: "blur" }],
        agree: [{ validator: validateAgree, trigger: "change" }],
        phone: [{ validator: fundNumber, trigger: "blur" }],
        realName: [{ validator: validRealName, trigger: "blur" }],
        idCard: [{ validator: validIdcard, trigger: "blur" }],
        email: [
          { validator: validEmail, trigger: "blur" },
          {
            type: "email",
            message: this.$tex("您的邮箱填写有误"),
            trigger: "blur",
          },
        ],
        qq: [{ validator: validQQ, trigger: "blur" }],
        wechat: [{ validator: validWechat, trigger: "blur" }],
        // currency: [
        //   { required: true, message: this.$tex("请选择货币类型"), trigger: 'change' },
        // ]
      },
      registerStatus: false,
      yidunRef: null,
      areaCode: "",
      curAreaCode: "",
      // currencys: []
    };
  },
  computed: {
    ...mapGetters(["userAreaCode"]),
    inviteHide() {
      return this.urlTTPaste || this.urlExp;
    },
    isShowInviteCodeInput() {
      const { EXPAND_HIDE } = this.$store.getters.sysSystemConfig;
      //有邀请码或者exp判断字段
      if (this.inviteHide && EXPAND_HIDE != 1) {
        return true;
      }
      if (this.inviteHide && EXPAND_HIDE == 1) {
        return false;
      }
      //没有邀请码必填显示
      //非必填时候默认显示show字段后台默认为true
      return (
        (!this.inviteHide && this.otherData.expandCode.need) ||
        (!this.otherData.expandCode.need && this.otherData.expandCode.show)
      );
    },
    wmInstance() {
      return this.$store.state.wmInstance;
    },
    isYzm() {
      return !this.isOpenBehavior;
    },
    isOpenBehavior() {
      return this.yidunRef && this.yidunRef.isOpenBehavior;
    },
    behaviorValidate() {
      return this.yidunRef && this.yidunRef.behaviorValidate;
    },
    isOpenSXE() {
      return this.yidunRef && this.yidunRef.isOpenSXE;
    },
  },
  created() {
    this.initConfig();
    this.getTTPasteCode();
    this.getInvitedInquire();
    this.$nextTick(() => {
      this.yidunRef = this.$refs.yidun;
    });
  },
  methods: {
    hasPermission,
    initConfig() {
      let vm = this;
      getConfigList().then((res) => {
        vm.$store.commit("getConfigList", res); //获取全局配置文件
        res.forEach((item) => {
          // if (item.key === 'currencyWeb') {
          //   this.currencys = JSON.parse(item.value) || [];
          //   if (this.currencys.length) {
          //     this.formCustom.currency = this.currencys[0].scur
          //   }
          // }
          if (hasPermission("element.areaCode")) {
            if (item.key === "AREA_CODE") {
              this.areaCode = JSON.parse(item.value).areaCode || [];
              if (this.areaCode.length) {
                this.curAreaCode = this.areaCode[0];
              }
            }
          } else {
            this.curAreaCode = this.userAreaCode;
          }

          if (item.key === "REGISTER_NEED_EXPEND_CODE") {
            //非资讯包
            this.expandCodeMust = item.value; // "1"--必填 或 "0"--非必填
          }
          if (item.key === "REGISTER_COLUMN") {
            let obj = JSON.parse(item.value);
            for (var k in obj) {
              this.$set(this.otherData, k, obj[k]);
            }
          }
          if (item.key === "PC_LOGIN_IMG_URL") {
            this.loginAvatar = item.value;
          }
          if (item.key === "SMS_TYPE_REGISTER_BIND_PHONE") {
            this.otherData.smsPhoneCode = item.value === "1";
            if (this.otherData.smsPhoneCode) {
              this.$set(this.otherData, "phone", {
                show: true,
                need: true,
              });
            }
          }
        });
      });
      this.getImageCode();
    },
    async loadEwmUrl() {
      const data = await utils.loadEwmUrl();
      this.ewmUrl = data.url;
      this.kaptchaFlag = data.kaptchaFlag;
      return this.kaptchaFlag;
    },
    refreshCheckCode() {
      if (this.hasRefreshChode) {
        return;
      }
      this.getImageCode();
      this.hasRefreshChode = true;
    },
    getImageCode() {
      this.isYzm && this.loadEwmUrl();
    },
    async onSendSmsPhoneCodeClick(name) {
      if (this.smsPhoneCodeDisabled) {
        return;
      }
      const err = await new Promise((r) => {
        this.$refs[name].validateField("phone", r);
      });
      if (err) {
        return console.log("err", err);
      }
      const smsPhoneCodeTimeBackUp = this.smsPhoneCodeTime;
      const smsPhoneCodeTextBackUp = this.smsPhoneCodeText;
      this.smsPhoneCodeDisabled = true;

      const resetSmsPhoneCode = () => {
        this.smsPhoneCodeDisabled = false;
        this.smsPhoneCodeTime = smsPhoneCodeTimeBackUp;
        this.smsPhoneCodeText = smsPhoneCodeTextBackUp;
        clearInterval(this.countTimer);
      };
      let Reacquire = true;
      const sysConfig = await this.$store.dispatch("querySystemConfig");
      const yiDunConfig = JSON.parse(sysConfig["YI_DUN_VAILD_CONFIG"]);
      let vm = this;
      // 验证码行为验证
      initNECaptcha(
        {
          captchaId: yiDunConfig.register.captchaId,
          element: "#captcha",
          mode: "popup",
          width: "320px",
          protocol: "https",
          onVerify: async function(err, data) {
            if (data) {
              Reacquire = false;
              const response = await vm.$http.post(
                "/api/v2/user/smsYunXinPhone",
                {
                  type: "8",
                  smsType: "8",
                  userId: "",
                  phoneNumber: vm[name].phone,
                  areaCode: vm.curAreaCode,
                  ydtoken: yiDunConfig.productNumber,
                  ydNECaptchaValidate: data.validate,
                },
                {}
              );
              if (response.data.code !== 0) {
                return resetSmsPhoneCode();
              }
              vm.countTimer = setInterval(() => {
                vm.smsPhoneCodeText = `倒计时：${vm.smsPhoneCodeTime}s`;
                if (vm.smsPhoneCodeTime < 0) {
                  return resetSmsPhoneCode();
                }
                vm.smsPhoneCodeTime--;
              }, 1000);
            }
          },
          onClose: function() {
            // 弹出关闭结束后将会触发该函数
            if (Reacquire) resetSmsPhoneCode();
          },
        },
        function(instance) {
          // vm.captchaInstance = instance;
          instance.popUp();
          instance.refresh();
        },
        (err) => {
          console.log(err);
          this.$Message.error(this.$tex("行为验证失败"));
          resetSmsPhoneCode();
        }
      );

      // const response = await this.$http
      //   .post(
      //     "/api/v2/user/smsYunXinPhone",
      //     {
      //       type: "8",
      //       smsType: "8",
      //       userId: "",
      //       phoneNumber: this[name].phone,
      //       areaCode: this.curAreaCode,
      //     },
      //     {}
      //   );
      // if (response.data.code !== 0) {
      //   return resetSmsPhoneCode();
      // }
      // this.countTimer = setInterval(() => {
      //   this.smsPhoneCodeText = `${this.$tex("倒计时")}：${this.smsPhoneCodeTime}s`;
      //   if (this.smsPhoneCodeTime < 0) {
      //     return resetSmsPhoneCode();
      //   }
      //   this.smsPhoneCodeTime--;
      // }, 1000);
    },
    async registerSubmit(obj, loading) {
      //注册
      let vm = this;
      this.$http
        .post(
          "/api/v2/user/register",
          {
            areaCode: this.curAreaCode,
            ...obj,
          },
          { kaptchaFlag: this.kaptchaFlag }
        )
        .then((response) => {
          vm.registerStatus = false;
          const code = response.data.code;
          this.verifyData = {};
          if (code !== 0) {
            //222  邀请码错误，请核实后输入253 该邀请码已被禁用 118 奖金组不存在！
            if (code == 253 || code == 222 || code == 118) {
              this.removeLocalExp();
              this.urlExp = false;
              this.urlTTPaste = false;
              this.formCustom.expandCode = "";
              this.getTTPasteCode();
            }
            loading && loading();
            this.yidunRef.refreshBehavior();
            this.getImageCode();
            return;
          }
          localStorage.setItem("user", JSON.stringify(response.data.data));
          this.removeLocalExp();
          response.data.data.areaCode = this.curAreaCode;
          vm.$store.commit("getUser", response.data.data);
          vm.$store.commit(
            "setRegAddDefaultExpandStatus",
            response.data.data.addDefaultExpand
          );
          loading && loading();
          if (vm.ttcode) {
            if (vm.ttcode !== "TG_GAME") {
              vm.$router.push({ name: "game", query: { type: vm.ttcode } });
            } else {
              vm.$router.push({ name: "lottery" });
            }
          } else vm.$router.push("/");
        });
    },
    async handleSubmit(name) {
      let vm = this;
      if (this.registerStatus) return;
      const valid = await this.$refs[name].validate();
      const props = this.$refs[name].fields.map((field) => {
        return field.prop;
      });
      const valiErrors = [];
      for (let key in props) {
        this.$refs[name].validateField(props[key], (err) => {
          if (!!err) {
            valiErrors.push(err);
          }
        });
      }
      if (valiErrors.length) {
        return this.$Modal.error({
          title: this.$tex("提示"),
          render(h) {
            const result = valiErrors.map((err, index) => {
              return h("div", `${index + 1}、${err}`);
            });
            return h(
              "div",
              {
                style: {
                  marginTop: "10px",
                  fontSize: "14px",
                  color: "#ed3f14",
                },
              },
              result
            );
          },
        });
      }
      if (!valid) {
        this.yidunRef.refreshBehavior();
        this.verifyData = {};
        this.getImageCode();
        return;
      }
      this.registerStatus = true;
      let obj = Object.assign({}, vm[name]);
      obj.password = encryption.encrypt.md5(obj.password);
      obj.passwdCheck = encryption.encrypt.md5(obj.passwdCheck);

      if (this.isOpenBehavior) {
        if (!this.behaviorValidate) {
          this.$Message.error(this.$tex("请完成验证"));
          vm.registerStatus = false;
          return;
        }
        obj.ydNECaptchaValidate = this.behaviorValidate;
      }
      if (this.isOpenSXE) {
        obj.ydtoken = await this.yidunRef.getSXEToken();
      }
      this.registerSubmit(obj);
    },
    removeLocalExp() {
      sessionStorage.setItem("exp", "");
      sessionStorage.setItem("ttpaste", "");
      sessionStorage.setItem("ttcode", "");
    },
    //判断扫码进来还是推广邀请码进来
    getTTPasteCode() {
      //query 两种情况：1. ttpaste&ttcode, 2. exp&ttcode
      const ttpaste = sessionStorage.getItem("ttpaste"); //layout存到localStorage
      if (!!ttpaste) {
        //ttpaste存在
        this.urlTTPaste = true; //输入邀请码不可见，同理this.urlExp=true
        this.formCustom.expandCode = ttpaste;
        this.urlExp = false;
        sessionStorage.setItem("exp", "");
      } else {
        let exp = sessionStorage.getItem("exp");
        if (!this.urlExp && exp) {
          //推广邀请码进来
          exp = JSON.parse(exp);
          this.urlExp = true;
          this.formCustom.expandCode = exp.value;
          let ttcodeOjb = JSON.parse(sessionStorage.getItem("ttcode"));
          if (ttcodeOjb) {
            let ttcode = ttcodeOjb.value;
            if (ttcode) this.ttcode = ttcode;
          }
        }
      }
      if (this.urlExp) {
        sessionStorage.setItem("ttpaste", "");
        this.urlTTPaste = false;
      }
    },
    async getInvitedInquire() {
      const res = await getInvitedInquire();
      if (!res.data.data) return;
      this.formCustom.expandCode = res.data.data;
    },
    onAreaCodeClick(name) {
      this.curAreaCode = name;
    },
  },
};
