<template>
  <div class="content index-register-wp">
    <div class="index-register">
      <div class="cont">
        <div class="cont-title">
          <h4>账号注册</h4>
        </div>
        <Form ref="formCustom" :model="formCustom" :rules="ruleInline">
          <FormItem prop="userCode">
            <i class="extra-icon user"></i>
            <Input
              type="text"
              :value="formCustom.userCode"
              @input="formCustom.userCode = arguments[0].replace(/\s+/g, '')"
              placeholder="账号"
            >
            </Input>
            <p v-if="showUserCodeTip">账号: 8-14个字符,字母与数字</p>
          </FormItem>
          <FormItem prop="password" style="position:relative;">
            <i class="extra-icon pwd"></i>
            <Input
              type="password"
              :value="formCustom.password"
              @input="formCustom.password = arguments[0].replace(/\s+/g, '')"
              v-model="formCustom.password"
              placeholder="密码"
            >
            </Input>
            <p v-if="showPasswordTip">密码规则: 6-14个字符,字母与数字组合</p>
          </FormItem>
          <FormItem prop="passwdCheck">
            <i class="extra-icon check-pwd"></i>
            <Input
              type="password"
              v-model="formCustom.passwdCheck"
              @input="formCustom.passwdCheck = arguments[0].replace(/\s+/g, '')"
              placeholder="确认密码"
            >
            </Input>
          </FormItem>

          <!-- 新增表单 -->
          <FormItem prop="realName" v-if="otherData.realName.show">
            <i class="extra-icon user"></i>
            <Input
              type="text"
              v-model="formCustom.realName"
              :placeholder="
                otherData.realName.need
                  ? '请输入真实姓名（必填）'
                  : '请输入真实姓名（选填）'
              "
            >
            </Input>
          </FormItem>
          <FormItem prop="idCard" v-if="otherData.idCard.show">
            <i class="extra-icon id"></i>
            <Input
              type="text"
              v-model="formCustom.idCard"
              :placeholder="
                otherData.idCard.need
                  ? '请输入身份证号码（必填）'
                  : '请输入身份证号码（选填）'
              "
            >
            </Input>
          </FormItem>
          <FormItem prop="phone" v-if="otherData.phone.show">
            <i class="extra-icon phone"></i>
            <Input
              type="text"
              v-model="formCustom.phone"
              :placeholder="
                otherData.phone.need
                  ? '请输入手机号码（必填）'
                  : '请输入手机号码（选填）'
              "
            >
            </Input>
          </FormItem>
          <FormItem prop="wechat" v-if="otherData.wechat.show">
            <i class="extra-icon wechat"></i>
            <Input
              type="text"
              :value="formCustom.wechat"
              @input="formCustom.wechat = arguments[0].replace(/\s+/g, '')"
              :placeholder="
                otherData.wechat.need
                  ? '请输入微信号（必填）'
                  : '请输入微信号（选填）'
              "
            >
            </Input>
          </FormItem>
          <FormItem prop="email" v-if="otherData.email.show">
            <i class="extra-icon email"></i>
            <Input
              type="text"
              v-model="formCustom.email"
              :placeholder="
                otherData.email.need
                  ? '请输入邮箱（必填）'
                  : '请输入邮箱（选填）'
              "
            >
            </Input>
          </FormItem>
          <FormItem prop="qq" v-if="otherData.qq.show">
            <i class="extra-icon qq"></i>
            <Input
              type="text"
              v-model="formCustom.qq"
              :placeholder="
                otherData.qq.need
                  ? '请输入QQ号码（必填）'
                  : '请输入QQ号码（选填）'
              "
            >
            </Input>
          </FormItem>
          <!-- 新增表单结束 -->
          <FormItem
            prop="expandCode"
            class="yqm-wp"
            v-show="!inviteHide"
            :rules="{
              required: !!otherData.expandCode.need,
              message: '请输入邀请码',
              trigger: 'blur',
            }"
          >
            <i class="extra-icon yqm"></i>
            <Input
              type="text"
              v-model="formCustom.expandCode"
              :placeholder="
                '请输入邀请码' +
                  (!!otherData.expandCode.need ? '（必填）' : '（选填）')
              "
              :disabled="urlExp || urlTTPaste"
            >
            </Input>
          </FormItem>
          <FormItem
            prop="checkCode"
            class="valida checkCode"
            v-if="!captchaFlag"
          >
            <Input
              type="text"
              v-model="formCustom.checkCode"
              placeholder="验证码"
              @on-enter="handleSubmit('formCustom')"
              @on-focus="refreshCheckCode()"
            >
            </Input>
            <img class="valida-code" :src="ewmUrl" @click="getImageCode" />
          </FormItem>
          <FormItem class="valida-captcha" v-else>
            <div id="registerCaptcha-v3"></div>
          </FormItem>
          <FormItem class="agree" prop="agree">
            <Checkbox v-model="formCustom.agree"></Checkbox
            ><a href="" class="khxy" @click.prevent="modal1 = true"
              >本人同意<span class="i-agree">开户协议</span></a
            >
            <agree :modal1="modal1" @back="modal1 = false"></agree>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              size="large"
              class="commit-register"
              long
              @click="handleSubmit('formCustom')"
              >注册</Button
            >
          </FormItem>
        </Form>
      </div>
      <!-- 背景球 -->
      <div class="bg-ball"></div>
    </div>
  </div>
</template>

<script>
import encryption from "@/utils/md5";
import agree from "@/components/agree.vue";
import { getConfigList } from "@/utils/getSysConfig";
import captcha from "@/mixins/captcha";
import utils from "@/utils/utils";

export default {
  mixins: [captcha(288, "#registerCaptcha-v3")],
  components: { agree },
  data() {
    const validaName = (rule, value, callback) => {
      let flag = false;
      if (!value) {
        callback(new Error("请输入账号"));
      } else if (/[^A-Za-z0-9]/g.test(value)) {
        callback(new Error("请输入数字和字母"));
      } else if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
        callback(new Error("账号必须包含数字和字母"));
      } else if (value.length < 8 || value.length > 14) {
        callback(new Error("账号在八至十四位之间"));
      } else {
        callback();
        flag = true;
      }
      this.showUserCodeTip = flag;
    };
    const validatePass = (rule, value, callback) => {
      let flag = false;
      if (!value) {
        callback(new Error("请输入密码"));
      } else if (/[^A-Za-z0-9]/g.test(value)) {
        callback(new Error("请输入数字和字母"));
      } else if (value.length < 6 || value.length > 14) {
        callback(new Error("密码在六至十四位之间"));
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
        callback(new Error("请输入密码"));
      } else if (value !== this.formCustom.password) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    const validateAgree = (rule, value, callback) => {
      //同意协议
      if (!value) {
        callback(new Error("请勾选我同意"));
      } else {
        callback();
      }
    };
    const fundNumber = (rule, value, callback) => {
      // 只能输入数字
      if (this.otherData.phone.need && !value) {
        callback(new Error("请输入您的手机号码"));
      } else if (value && !/^1(\d){10}$/.test(value)) {
        callback(new Error("手机号码输入有误"));
      } else {
        callback();
      }
    };

    const validRealName = (rule, value, callback) => {
      if (this.otherData.realName.need && !value) {
        callback("请输入您的姓名");
      } else if (
        value &&
        !/^[\u4e00-\u9fa5]+((·|•)?[\u4e00-\u9fa5]+)$/.test(value)
      ) {
        callback("请输入2-16位的中文字符");
      } else if (value && (value.length < 2 || value.length > 16)) {
        callback("请输入2-16位的中文字符");
      } else {
        callback();
      }
    };

    const validIdcard = (rule, value, callback) => {
      if (this.otherData.idCard.need && !value) {
        callback(new Error("请输入您的身份证号码"));
      } else if (value && !/^((\d){14}|(\d){17})(\d|x|X)$/.test(value)) {
        callback(new Error("身份证号码输入有误"));
      } else {
        callback();
      }
    };
    const validEmail = (rule, value, callback) => {
      if (this.otherData.email.need && !value) {
        callback(new Error("请输入您的邮箱"));
      } else if (
        value &&
        !/^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/.test(
          value
        )
      ) {
        callback(new Error("邮箱号码输入有误"));
      } else {
        callback();
      }
    };
    const validQQ = (rule, value, callback) => {
      if (this.otherData.qq.need && !value) {
        callback(new Error("请输入您的QQ号码"));
      } else if (value && !/^\d{5,16}$/.test(value)) {
        callback(new Error("QQ号码输入有误"));
      } else {
        callback();
      }
    };
    const validWechat = (rule, value, callback) => {
      if (this.otherData.wechat.need && !value) {
        callback(new Error("请输入您的微信号"));
      } else if (value && !/^[-_a-zA-Z0-9]{5,20}$/.test(value)) {
        callback(new Error("5-20个字符,字母、数字、下划线和-"));
      } else {
        callback();
      }
    };
    return {
      // captchaId: '',
      // antiCheatFlag: false, //是否开启反作弊
      // businessId: '', //
      // captchaFlag: false, //是否开启行为验证
      // typeOfCaptcha: -1, //1 普通验证码,2 geetest,3 geetest 与 易盾,4 易盾
      // gtServerStatus: null,
      ttCode: "",
      loginAvatar: "",
      showUserCodeTip: true,
      isCheckPassWord: false,
      showPasswordTip: true,
      otherData: {
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
      formCustom: {
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
      },
      modal1: false,
      expandCodeMust: false,
      ruleInline: {
        userCode: [{ validator: validaName, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
        passwdCheck: [{ validator: validatePassCheck, trigger: "blur" }],
        checkCode: [
          { required: true, message: "请输入验证码", trigger: "blur" },
        ],
        agree: [{ validator: validateAgree, trigger: "change" }],
        phone: [
          { validator: fundNumber, trigger: "blur" },
          { min: 11, max: 11, message: "请输入11位数的号码", trigger: "blur" },
        ],
        realName: [{ validator: validRealName, trigger: "blur" }],
        idCard: [{ validator: validIdcard, trigger: "blur" }],
        email: [
          { validator: validEmail, trigger: "blur" },
          { type: "email", message: "您的邮箱填写有误", trigger: "blur" },
        ],
        qq: [{ validator: validQQ, trigger: "blur" }],
        wechat: [{ validator: validWechat, trigger: "blur" }],
      },
      registerStatus: false,
    };
  },
  computed: {
    // configList () {
    //   return this.$store.state.configList;
    // },
    inviteHide() {
      return this.urlTTPaste || this.urlExp || !this.otherData.expandCode.show;
    },
    wmInstance() {
      return this.$store.state.wmInstance;
    },
    isYzm() {
      // return this.typeOfCaptcha == '1' || this.typeOfCaptcha == '4'
      return !this.captchaFlag;
    },
  },
  methods: {
    initConfig() {
      let vm = this;
      // for (let content of configList) {
      // if (content.key === 'REGISTER_NEED_EXPEND_CODE') { //非资讯包
      //   this.expandCodeMust = content.value; // "1"--必填 或 "0"--非必填
      //   console.log(expandCodeMust);
      // } else if (content.key === 'REGISTER_COLUMN') {
      //   let obj = JSON.parse(content.value);
      //   for (var k in obj) {
      //     this.$set(this.otherData, k, obj[k])
      //   }
      // } else if (content.key === 'PC_LOGIN_IMG_URL') {
      //   this.loginAvatar = content.value;
      //   return
      // }
      // },
      getConfigList().then((res) => {
        vm.$store.commit("getConfigList", res); //获取全局配置文件
        res.forEach((item) => {
          // console.log(item);
          if (item.key === "YI_DUN_VAILD_CONFIG") {
            // console.log('有字段');
            // console.log(typeof item.value);
            let {
              captchaFlag,
              antiCheatFlag,
              businessId,
              captchaId,
            } = JSON.parse(item.value).register;
            // console.log(captchaFlag);
            this.captchaFlag = captchaFlag;
            // debugger;
            this.antiCheatFlag = antiCheatFlag;
            this.businessId = businessId;
            this.captchaId = captchaId;
            // console.log(this.captchaFlag);
            // console.log(this.antiCheatFlag);
            if (captchaFlag) {
              this.initGtCapthca();
            }
          }
          if (item.key === "REGISTER_NEED_EXPEND_CODE") {
            //非资讯包
            this.expandCodeMust = item.value; // "1"--必填 或 "0"--非必填
            // debugger
            // console.log(expandCodeMust);
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
          // if (item.key === 'TYPE_OF_CAPTCHA') { //验证的类型
          //   this.typeOfCaptcha = item.value;
          // }
        });
        if (this.isYzm) {
          this.getImageCode();
        }
      });
    },
    async loadEwmUrl() {
      const data = await utils.loadEwmUrl();
      this.ewmUrl = data.url;
      this.kaptchaFlag = data.kaptchaFlag;
      return this.kaptchaFlag;
    },
    refreshCheckCode() {
      //获取焦点刷新验证码
      // this.isActive = 3
      if (this.hasRefreshChode) {
        return;
      }
      this.getImageCode();
      this.hasRefreshChode = true;
    },
    getImageCode() {
      this.loadEwmUrl();
    },
    capthcaSuccess() {},
    getWxToken() {
      //获取易盾验证的token
      let vm = this;
      if (this.wmInstance) {
        return new Promise((resolve, reject) => {
          this.wmInstance.getToken(vm.businessId, function(token) {
            resolve(token);
          });
        });
      } else {
        return Promise.reject("");
      }
    },
    async registerSubmit(obj, loading) {
      //注册
      let vm = this;
      // console.log(obj);
      this.$http
        .post("/api/v2/user/register", obj, { kaptchaFlag: this.kaptchaFlag })
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
            if (this.captchaFlag) {
              this.refreshCaptchaValidate();
            }
            // (this.typeOfCaptcha === '2' || this.typeOfCaptcha === '3') && this.captchaObj && this.captchaObj.reset && this.captchaObj.reset()
            if (this.isYzm) {
              this.getImageCode();
            }
            return;
          }
          // console.log(response.data.data);
          localStorage.setItem("user", JSON.stringify(response.data.data));
          this.removeLocalExp();
          vm.$store.commit("getUser", response.data.data);
          vm.$store.commit(
            "setRegAddDefaultExpandStatus",
            response.data.data.addDefaultExpand
          );
          // vm.$router.push('/');
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
      if (!valid) {
        this.specialRefreshCaptcha();
        this.verifyData = {};
        if (this.isYzm) {
          this.getImageCode();
        }
        return;
      }
      this.registerStatus = true;
      let obj = Object.assign({}, vm[name]);
      obj.password = encryption.encrypt.md5(obj.password);
      obj.passwdCheck = encryption.encrypt.md5(obj.passwdCheck);

      if (this.antiCheatFlag) {
        //如果开启了反作弊
        let token = await this.getWxToken();
        console.log("开启了反作弊");
        obj = {
          ydtoken: token,
          ...obj,
        };
      }

      if (!this.captchaFlag) {
        //未开启行为验证
        console.log("验证码验证");
        if (this.antiCheatFlag) {
          let loading = this.$Message.loading({
            content: "加载中...",
            duration: 0,
          });
          this.registerSubmit(obj, loading);
          return;
        }
        // console.log(obj);
        this.registerSubmit(obj);
        return;
      }

      const capObj = this.capthcaValidate(); //行为验证
      // console.log(capObj);
      console.log("开启了行为验证");
      if (!capObj) {
        vm.registerStatus = false;
        return;
      }
      var { validate, loading } = capObj;
      obj = {
        ydNECaptchaValidate: validate,
        ...obj,
      };
      // console.log(obj);
      this.registerSubmit(obj, loading);
      // const valid = await this.$refs[name].validate()
      // if (valid) {
      //   vm.registerStatus = true;
      //   const capObj = this.capthcaValidate()
      //   if (!capObj) {
      //     vm.registerStatus = false
      //     return capObj
      //   }
      //   this.wmInstance && this.wmInstance.getToken(REGISTER_BUSINESS_ID, function (token) {
      //     const { capthcaParams, loading } = capObj
      //     var obj = Object.assign({}, vm[name]);
      //     obj.password = encryption.encrypt.md5(obj.password);
      //     obj.passwdCheck = encryption.encrypt.md5(obj.passwdCheck);
      //     obj = {
      //       ydtoken: token,
      //       ...obj,
      //       ...capthcaParams,
      //     }
      //     vm.$http.post('/api/v2/user/register', obj).then(response => {
      //       const code = response.data.code
      //       vm.registerStatus = false;
      //       if (code !== 0) {
      //         //222  邀请码错误，请核实后输入253 该邀请码已被禁用 118 奖金组不存在！
      //         if (code == 253 || code == 222 || code == 118) {
      //           vm.removeLocalExp()
      //           vm.urlExp = false
      //           vm.urlTTPaste = false
      //           vm.formCustom.expandCode = ''
      //           vm.getTTPasteCode()
      //         }
      //         loading()
      //         vm.captchaObj && vm.captchaObj.reset && vm.captchaObj.reset()
      //         vm.getImageCode();
      //         return;
      //       }
      //       // console.log(response.data.data);
      //       localStorage.setItem('user', JSON.stringify(response.data.data));
      //       vm.removeLocalExp()
      //       vm.$store.commit('getUser', response.data.data);
      //       // vm.$router.push('/');
      //       loading()
      //       if (vm.ttcode) {
      //         if (vm.ttcode !== 'TG_GAME') {
      //           vm.$router.push({ name: 'game', query: { type: vm.ttcode } });
      //         } else {
      //           vm.$router.push({ name: 'lottery' })
      //         }
      //       } else vm.$router.push('/');
      //     })
      //   })
      // } else {
      //   vm.getImageCode();
      // }
    },
    removeLocalExp() {
      sessionStorage.setItem("exp", "");
      sessionStorage.setItem("ttpaste", "");
      sessionStorage.setItem("ttcode", "");
    },
    getSpreadCode() {
      // let url = window.location.href;
      // if (url.indexOf('?') !== -1) {
      // let ql = url.split('?')[1].split('='); //old code
      // if (ql[0] === 'exp' && ql[1]) {
      //   this.urlExp = true;
      //   this.formCustom.expandCode = ql[1];
      //   localStorage.setItem('exp', JSON.stringify({ value: ql[1], time: new Date().getTime() }))
      // }
      // }
      // 检测上一个判断不成立, 取缓存里面的值
      // let exp = localStorage.getItem('exp')
      // if (!this.urlExp && exp) {
      //   let obj = JSON.parse(exp);
      //   let time = new Date().getTime() - parseInt(obj.time);
      //   if (time > (2 * 24 * 60 * 60 * 1000)) {  // 如果缓存时间大于2天， 清除掉
      //     localStorage.setItem('exp', '')
      //   } else {
      //     this.urlExp = true;
      //     this.formCustom.expandCode = obj.value;
      //   }
      // }
      // if (this.urlExp) {
      //   localStorage.setItem('ttpaste', '')
      //   this.urlTTPaste = false;
      // }
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
  },
  created() {
    this.initConfig();
    this.getTTPasteCode();
    // this.removeLocalExp();
  },
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
.index-register-wp {
  @{deep}.index-register {
    position: relative;
    // height: 660px;
    padding: 70px 328px 200px;
    // height: 1110px;
    background: url("~@/assets/images-v4/register/bg.png") no-repeat;
    background-size: 100% 100%;
    // &:after{
    //     position: absolute;
    //     left: 330px;
    //     bottom: 52px;
    //     display: block;
    //     content: '';
    //     width: 504px;
    //     height: 74px;
    // }
    .cont {
      width: 516px;
      // height: 786px;
      // height: 414px;
      padding: 30px 98px 33px;
      border-radius: 5px;
      background: #111;
      // overflow-y: auto;
    }
    .cont-title {
      height: 21px;
      line-height: 21px;
      margin-bottom: 17px;
      h4 {
        float: left;
        font-size: 16px;
        color: @textLightColor;
        font-family: "PingFangSC-semibold";
      }
    }
    .ivu-form-item-content {
      // width: 320px;
      // height: 32px;
      // height: 30px;
      // line-height: 30px;
      .yidun_control {
        height: 30px !important;
        line-height: 30px;
      }
      .yidun_tips {
        line-height: 30px !important;
      }
      .yidun_slide_indicator {
        height: 30px !important;
      }
    }

    .yidun.yidun--light .yidun_tips__text {
      vertical-align: initial;
    }
    #registerCaptcha {
      width: 268px;
    }
    .ivu-input-wrapper {
      vertical-align: initial;
      + p {
        height: 20px;
        line-height: 20px;
        position: absolute;
        left: -2px;
        top: 30px;
        color: @textLightColor;
        transform: scale(0.9);
      }
    }
    .ivu-form-item {
      margin-bottom: 22px;
      &.yqm-wp {
        margin-bottom: 20px;
      }
      &.valida-captcha {
        margin-bottom: 20px;
      }
      &.agree {
        margin-bottom: 20px;
        .ivu-form-item-content {
          line-height: initial;
          // height:initial;
        }
        .i-agree {
          color: @textLightColor;
          transform: all 0.3s;
          &:hover {
            opacity: 0.9;
          }
        }
        .ivu-form-item-error-tip {
          top: 23px;
          left: -16px;
        }
      }
    }
    .ivu-input {
      height: 32px;
      padding: 9px 0 9px 8px;
      border: none;
      background-color: @baseColor;
      caret-color: #fff;
      font-size: 12px;
      color: @textColor;
      border-radius: 3px;
    }
    .ivu-form-item-error-tip {
      position: absolute;
      width: 320px;
      left: -32px;
      top: 35px;
      padding-top: 0;
      // line-height: 20px;
      font-size: 12px;
      color: @textLightColor;
      position: absolute;
      transform: scale(0.8);
      // &:first-child {
      //   left: -8px;
      // }
    }

    .valida-code {
      position: absolute;
      right: 0;
      top: 0;
      width: 82px;
      height: 100%;
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
      &:hover {
        cursor: pointer;
      }
    }
    .checkCode {
      position: relative;
      // overflow:hidden;
    }
    .khxy {
      display: inline-block;
      color: @textColor;
      margin-left: 10px;
      line-height: 18px;
    }
    .ivu-checkbox-inner {
      width: 18px;
      height: 18px;
      background-color: transparent;
      border-color: @baseColor;
      &:after {
        width: 6px;
        height: 10px;
        left: 5px;
        // border-color: @button-bg-color;
        border-color: @textLightColor;
      }
    }
    .ivu-checkbox-input {
      height: 18px;
    }
    .ivu-checkbox-focus {
      border: 1px solid @textLightColor;
    }
    .ivu-checkbox-wrapper {
      margin-right: 0;
    }
    .commit-register {
      height: 36px;
      font-family: "PingFangSC Medium";
      font-size: 14px;
      border-radius: 3px;
      color: @btnTxtColor;
      background: @buttonChangeColor;
      border: none;
      transition: all 0.3s;
      &:hover {
        opacity: 0.9;
      }
    }
    .extra-icon {
      position: absolute;
      left: 8px;
      top: 9px;
      display: block;
      width: 17px;
      height: 18px;
      background: url("~@/assets/images-v4/index/yhm.png");
      background-repeat: no-repeat;
      z-index: 2;
      + .ivu-input-wrapper {
        input {
          padding-left: 32px;
        }
      }
      &.pwd {
        background-image: url("~@/assets/images-v4/index/mm.png");
      }
      &.check-pwd {
        background-image: url("~@/assets/images-v4/index/mm.png");
      }
      &.id {
        top: 11px;
        background-image: url("~@/assets/images-v4/register/id.png");
      }
      &.phone {
        left: 10px;
        top: 7px;
        background-image: url("~@/assets/images-v4/register/phone.png");
      }
      &.wechat {
        top: 9px;
        background-image: url("~@/assets/images-v4/register/wechat.png");
      }
      &.email {
        top: 11px;
        background-image: url("~@/assets/images-v4/register/email.png");
      }
      &.qq {
        top: 7px;
        background-image: url("~@/assets/images-v4/register/qq.png");
      }
      &.yqm {
        background-image: url("~@/assets/images-v4/register/yqm.png");
      }
    }
    .bg-ball {
      position: absolute;
      bottom: 50px;
      left: 248px;
      width: 668px;
      height: 99px;
      background: url("~@/assets/images-v4/register/balls.png") no-repeat;
    }
  }
}
</style>
