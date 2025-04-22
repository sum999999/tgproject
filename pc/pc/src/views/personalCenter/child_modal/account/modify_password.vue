<template>
  <div class="modify-password">
    <div class="tab">
      <span
        @click="changeType('1')"
        :class="{active: type === '1'}"
      >{{$tex("修改登录密码")}}</span>
      <span
        @click="changeType('2')"
        :class="{active: type === '2'}"
        v-if="payPwdFlag === '1'"
      >{{$tex("修改资金密码")}}</span>
      <span
        @click="changeType('3')"
        :class="{active: type === '3'}"
        v-if="user.realName"
      >{{$tex("修改真实姓名")}}</span>
    </div>
    <div
      class="user-password all-width"
      v-if="type === '1'"
    >
      <Form
        :model="modifyObj"
        ref="formCustom"
        :label-width="106"
        :rules="modifyRule"
      >
        <FormItem
          :label="`${$tex('输入旧密码')} : `"
          prop="oldPassword"
        >
          <Input
            type="password"
            :value="modifyObj.oldPassword"
            @input="modifyObj.oldPassword = arguments[0].replace(/\s+/g,'')"
            :placeholder="$tex('旧密码')"
            style='margin-left:-5px;width:182px;'
          ></Input>
        </FormItem>
        <FormItem
          :label="`${$tex('新密码')} : `"
          prop="newPassword"
        >
          <Input
            type="password"
            :value="modifyObj.newPassword"
            @input="modifyObj.newPassword = arguments[0].replace(/\s+/g,'')"
            :placeholder="$tex('{min}-{max}个字符（数字和字母）', { min: 6, max: 14 })"
            style='margin-left:-5px;width:182px;'
          ></Input>
        </FormItem>
        <FormItem
          :label="`${$tex('确认新密码')} : `"
          prop="passwdCheck"
        >
          <Input
            type="password"
            :value="modifyObj.passwdCheck"
            @input="modifyObj.passwdCheck = arguments[0].replace(/\s+/g,'')"
            :placeholder="$tex('确认新密码')"
            style='margin-left:-5px;width:182px;'
          ></Input>
        </FormItem>
        <FormItem :label-width='102'>
          <Button
            style='line-height:14px;'
            type="primary"
            @click="handleSubmit()"
          >{{$tex("提交")}}</Button>
        </FormItem>
      </Form>
    </div>

    <div
      class="card-password modify"
      v-else-if="type === '2'"
    >
      <div class="modify all-width">
        <Form
          :model="modifyObj"
          ref="formCustom"
          :label-width="106"
          :rules="modifyRule2"
        >
          <FormItem
            :label="`${$tex('输入旧密码')} : `"
            prop="oldPassword"
          >
            <Input
              type="password"
              :value="modifyObj.oldPassword"
              autocomplete="off"
              :maxlength="4"
              @input="modifyObj.oldPassword = arguments[0].replace(/\s+/g,'')"
              :placeholder="$tex('旧密码')"
              style='margin-left:-5px;width:182px;'
            ></Input>
          </FormItem>
          <FormItem
            :label="`${$tex('新密码')} : `"
            prop="newPassword"
          >
            <Input
              type="password"
              :value="modifyObj.newPassword"
              autocomplete="off"
              :maxlength="4"
              @input="modifyObj.newPassword = arguments[0].replace(/\s+/g,'')"
              :placeholder="$tex('{num}位数字', { num: 4 })"
              style='margin-left:-5px;width:182px;'
            ></Input>
          </FormItem>
          <FormItem
            :label="`${$tex('确认新密码')} : `"
            prop="passwdCheck"
          >
            <Input
              type="password"
              :value="modifyObj.passwdCheck"
              autocomplete="off"
              :maxlength="4"
              @input="modifyObj.passwdCheck = arguments[0].replace(/\s+/g,'')"
              :placeholder="$tex('确认新密码')"
              style='margin-left:-5px;width:182px;'
            ></Input>
          </FormItem>
          <FormItem :label-width='102'>
            <Button
              style='line-height:14px;font-size:14px;'
              type="primary"
              @click="handleSubmit()"
            >{{$tex("提交")}}</Button>
          </FormItem>
        </Form>
      </div>
    </div>
    <div
      class="modify-real-name"
      v-else-if="type === '3'"
    >
      <Form
        :model="realName"
        ref="realNameRef"
        :label-width="106"
        :rules="resetRealName"
      >
        <FormItem
          :label="`${$tex('旧姓名')} : `"
          prop="oldName"
        >
          <Input
            type="text"
            v-model="realName.oldName"
            style='margin-left:-5px;width:182px;'
            readonly
          ></Input>
        </FormItem>
        <FormItem
          :label="`${$tex('新姓名')} : `"
          prop="newName"
        >
          <Input
            type="text"
            v-model="realName.newName"
            :placeholder="$tex('请输入姓名')"
            style='margin-left:-5px;width:182px;'
          ></Input>
        </FormItem>
        <FormItem :label-width='102'>
          <Button
            type="primary"
            @click="realNameSubmit()"
            style='font-size:14px;line-height:14px;'
          >{{$tex("提交")}}</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import encryption from "@/utils/md5";
import {hasPermission} from "@/utils/authority-utils";

export default {
  data() {
    // 修改密码的规则方法
    const validaOldPassword = (rule, value, callback) => {
      //登录旧密码
      if (!value) {
        callback(new Error(this.$tex("请输入旧密码")));
      } else if (value.length < 6 || value.length > 14) {
        callback(new Error(this.$tex("密码{min}至{max}位", { min: 6, max: 14 })));
      } else {
        callback();
      }
    };
    const validaOldPassword2 = (rule, value, callback) => {
      //资金旧密码
      if (!value) {
        callback(new Error(this.$tex("请输入旧密码")));
      } else if (value.length != 4 || !/^[0-9]+[0-9]*]*$/.test(value)) {
        callback(new Error(this.$tex("密码为{num}位数字", { num: 4 })));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      //登录新密码
      // ruleFn.isPassWord(value, this.modifyObj.passwdCheck, this.$refs.formCustom.validateField, 'passwdCheck', callback);
      if (!value) {
        callback(new Error(this.$tex("请输入新密码")));
      } else if (value.length < 6 || value.length > 14) {
        callback(new Error(this.$tex("密码{min}至{max}位", { min: 6, max: 14 })));
      } else if (this.modifyObj.passwdCheck) {
        this.$refs.formCustom.validateField("passwdCheck");
        callback();
      } else {
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      //新的资金密码验证规则
      // ruleFn.isFundPassWord(value, this.modifyObj.passwdCheck, this.$refs.formCustom.validateField, 'passwdCheck', callback);
      if (!value) {
        callback(new Error(this.$tex("请输入新密码")));
      } else if (value.length != 4 || !/^[0-9]+[0-9]*]*$/.test(value)) {
        callback(new Error(this.$tex("密码为{num}位数字", { num: 4 })));
      } else if (this.modifyObj.passwdCheck) {
        this.$refs.formCustom.validateField("passwdCheck");
        callback();
      } else {
        callback();
      }
    };
    const validatePassCheck2 = (rule, value, callback) => {
      //确认密码
      // ruleFn.checkFundPassWord(value, this.modifyObj.newPassword, callback);
      if (!value) {
        callback(new Error(this.$tex("请再次输入密码")));
      } else if (value.length != 4 || !/^[0-9]+[0-9]*]*$/.test(value)) {
        callback(new Error(this.$tex("密码为{num}位数字", { num: 4 })));
      } else if (value !== this.modifyObj.newPassword) {
        callback(new Error(this.$tex("两次输入密码不一致")));
      } else {
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      //确认密码
      // ruleFn.checkFundPassWord(value, this.modifyObj.newPassword, callback);
      if (!value) {
        callback(new Error(this.$tex("请再次输入密码")));
      } else if (value.length < 6 || value.length > 14) {
        callback(new Error(this.$tex("密码{min}至{max}位", { min: 6, max: 14 })));
      } else if (value !== this.modifyObj.newPassword) {
        callback(new Error(this.$tex("两次输入密码不一致")));
      } else {
        callback();
      }
    };
    let realNameCheck = null;
    if (hasPermission("validator.chinese")) {
      realNameCheck = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$tex("请输入姓名")));
        } else if (!/^[\u4e00-\u9fa5]+((·|•)?[\u4e00-\u9fa5]+)$/.test(value)) {
          callback(new Error(this.$tex("请输入{min}-{max}位的中文字符", { min: 2, max: 16 })));
        } else if (value.length < 2 || value.length > 16) {
          callback(new Error(this.$tex("请输入{min}-{max}位的中文字符", { min: 2, max: 16 })));
        } else {
          callback();
        }
      };
    } else {
      realNameCheck = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$tex("请输入姓名")));
        } else if (/[.'"\\\-?\[\]{}|,:;<>&=#!@$%^*_\/+！＠＃＄％︿＆＊（）＿＋／？’＂｜［］｛｝。，＞＜]/.test(value)) {
          callback(new Error(this.$tex("请输入有效字符")));
        } else if (value.length < 2 || value.length > 16) {
          callback(new Error(this.$tex("请输入{min}-{max}位的字符", {
            min: 2,
            max: 16
          })));
        } else {
          callback();
        }
      };
    }

    return {
      type: "1",
      payPwdFlag: "",
      user: {},
      modifyObj: {
        oldPassword: "",
        newPassword: "",
        passwdCheck: ""
      },
      realName: {
        oldName: "",
        newName: ""
      },
      //登录密码规则
      modifyRule: {
        oldPassword: [{ validator: validaOldPassword, trigger: "blur" }],
        newPassword: [{ validator: validatePass, trigger: "blur" }],
        passwdCheck: [{ validator: validatePassCheck, trigger: "blur" }]
      },
      //资金密码验证规则
      modifyRule2: {
        oldPassword: [{ validator: validaOldPassword2, trigger: "blur" }],
        newPassword: [
          { validator: validatePass2, trigger: "blur" },
          {
            type: "string",
            min: 4,
            message: this.$tex("请输入{num}位数字", { num: 4 }),
            trigger: "blur"
          },
          { type: "string", max: 4, message: this.$tex("请输入{num}位数字", { num: 4 }), trigger: "blur" }
        ],
        passwdCheck: [{ validator: validatePassCheck2, trigger: "blur" }]
      },
      // 真实姓名
      resetRealName: {
        newName: [{ validator: realNameCheck, trigger: "blur" }]
      }
    };
  },
  methods: {
    setOldName() {
      let name = this.user.realName.split("");
      let str = "";
      for (let i = 0; i < name.length; i++) {
        if (i !== name.length - 1) {
          str += "*";
        } else {
          str += name[i];
        }
      }
      this.realName.oldName = str;
    },
    changeType(type) {
      this.type = type;
      try {
        this.$refs.formCustom.resetFields();
        this.$refs.realNameRef.resetFields();
      } catch (error) {}
    },
    handleSubmit() {
      let vm = this;
      this.$refs.formCustom.validate(valid => {
        if (valid) {
          let params = {
            oldPassword: encryption.encrypt.md5(vm.modifyObj.oldPassword),
            newPassword: encryption.encrypt.md5(vm.modifyObj.newPassword)
          };
          let url = "/api/v2/user/modifyPassword";
          if (vm.type !== "1") {
            url = "/api/v2/user/setPayPwd";
            params = {
              oldPayPwd: encryption.encrypt.md5(vm.modifyObj.oldPassword),
              newPayPwd: encryption.encrypt.md5(vm.modifyObj.newPassword),
              payPwdType: "2"
            };
          }

          vm.$http.post(url, params, { userId: true }).then(response => {
            if (response.data.code !== 0) return;
            vm.$refs.formCustom.resetFields();
            vm.$Message.success(this.$tex("修改成功"));
          });
        }
      });
    },
    realNameSubmit() {
      let vm = this;
      this.$refs.realNameRef.validate(valid => {
        if (valid) {
          let params = {
            newRealname: vm.realName.newName
          };
          vm.$http
            .post("/api/v2/user/updateName", params, { userId: true })
            .then(response => {
              if (response.data.code !== 0) return;
              vm.realName.newName = "";
              vm.$Message.success(this.$tex("修改成功，已提交到后台审核"));
            });
        }
      });
    }
  },
  created() {
    let user = localStorage.getItem("user");
    if (user) {
      this.user = JSON.parse(user);
      if (this.user.realName) {
        this.setOldName();
      }
    }
    this.$emit("handler-spin", true);
    this.$http
      .post("/api/v2/user/getUserPayPwd", "", { userId: true, unenc: true })
      .then(response => {
        this.$emit("handler-spin", false);
        if (response.data.code !== 0) return;
        this.payPwdFlag = response.data.data.payPwdFlag;
      });
  }
};
</script>

<style lang="less" scoped>
.modify-password .all-width {
  width: 70%;
}
.modify-password .all-width span {
  display: block;
  height: 30px;
  line-height: 30px;
}
.modify-password .tab {
  /* height: 30px;
    line-height: 30px; */
  height: 36px;
  /*   border: 2px solid @primary-color; */
  border-radius: 3px;
  display: inline-block;
  margin-bottom: 15px;
  margin-left: 28px;
}
.modify-password .tab span {
  cursor: pointer;
  height: 32px;
  line-height: 32px;
  /* height: 26px;
    line-height: 26px; */
  display: inline-block;
  vertical-align: top;
  padding: 0 10px;
  font-size: 14px;
  /*  color: @primary-color; */
}
.modify-password .tab span.active {
  color: #f1f1f1;
  /*   background: @primary-color; */
}
/* .modify-password .modify-real-name {
    width: 288px;
    margin: 0 auto;
} */
.modify-password .ivu-form .ivu-form-item-label {
  padding-right: 6px;
}
.modify-password input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px #fff inset;
  -webkit-text-fill-color: #333;
}
</style>
