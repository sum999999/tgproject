<template>
  <div class="register">
    <img
      class="register__bg"
      src="~@/assets/images-v10/register/zhuce_bg_2.png"
    />
    <div class="user-auth relative">
      <img
        class="absolute w-auto pointer-events-none"
        src="~@/assets/images-v10/login/Dengru_image_2.png"
        style="    top: -182px;right: 45%;"
      />
      <img
        class="absolute w-auto pointer-events-none"
        src="~@/assets/images-v10/login/Dengru_image_1.png"
        style="top: -196px;right: 29%;"
      />
      <div class="user-auth__header">
        <h1
          class="user-auth__title user-auth__title--link"
          @click="$router.push('/login')"
        >
          {{ $tex("账号登入") }}
        </h1>
        <h1
          class="user-auth__title user-auth__title--link user-auth__title--active"
        >
          {{ $tex("账号注册") }}
        </h1>
      </div>
      <Form
        class="user-auth-form"
        ref="formCustom"
        :model="formCustom"
        :rules="ruleInline"
      >
        <FormItem prop="userCode">
          <i class="user-auth-form-item__icon user"></i>
          <Input
            type="text"
            :value="formCustom.userCode"
            @input="formCustom.userCode = arguments[0].replace(/\s+/g, '')"
            :placeholder="$tex('账号')"
          >
          </Input>
          <!-- <p
            v-if='showUserCodeTip'
            class="user-auth-form__tips"
          >{{$tex("账号: 8-14个字符,字母与数字")}}</p> -->
        </FormItem>
        <FormItem prop="password" style="position:relative;">
          <i class="user-auth-form-item__icon pwd"></i>
          <Input
            type="password"
            :value="formCustom.password"
            @input="formCustom.password = arguments[0].replace(/\s+/g, '')"
            v-model="formCustom.password"
            :placeholder="$tex('密码')"
          >
          </Input>
          <!-- <p
            v-if='showPasswordTip'
            class="user-auth-form__tips"
          >{{$tex("密码规则: 6-14个字符,字母与数字组合")}}</p> -->
        </FormItem>
        <FormItem prop="passwdCheck">
          <i class="user-auth-form-item__icon check-pwd"></i>
          <Input
            type="password"
            v-model="formCustom.passwdCheck"
            @input="formCustom.passwdCheck = arguments[0].replace(/\s+/g, '')"
            :placeholder="$tex('确认密码')"
          >
          </Input>
        </FormItem>

        <!-- 新增表单 -->
        <FormItem prop="realName" v-if="otherData.realName.show">
          <i class="user-auth-form-item__icon user"></i>
          <Input
            type="text"
            v-model="formCustom.realName"
            :placeholder="
              otherData.realName.need
                ? $tex('请输入真实姓名（必填）')
                : $tex('请输入真实姓名（选填）')
            "
          >
          </Input>
        </FormItem>
        <FormItem prop="idCard" v-if="otherData.idCard.show">
          <i class="user-auth-form-item__icon id"></i>
          <Input
            type="text"
            v-model="formCustom.idCard"
            :placeholder="
              otherData.idCard.need
                ? $tex('请输入身份证号码（必填）')
                : $tex('请输入身份证号码（选填）')
            "
          >
          </Input>
        </FormItem>
        <FormItem prop="phone" v-if="otherData.phone.show">
          <i class="user-auth-form-item__icon phone"></i>
          <Dropdown
            v-if="hasPermission('element.areaCode')"
            class="user-auth-form-item__area-code dropdown"
            @on-click="onAreaCodeClick"
          >
            <span>+{{ curAreaCode }}</span>
            <Icon type="arrow-down-b"></Icon>
            <DropdownMenu slot="list">
              <DropdownItem
                v-for="(code, index) in areaCode"
                :key="index"
                :name="code"
              >
                <span>{{ code }}</span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Input
            class="user-auth-form-item__input"
            :class="{
              phone: hasPermission('element.areaCode'),
            }"
            type="text"
            v-model="formCustom.phone"
            :placeholder="
              otherData.phone.need
                ? $tex('请输入手机号码（必填）')
                : $tex('请输入手机号码（选填）')
            "
          >
          </Input>
        </FormItem>
        <!--                <FormItem-->
        <!--                        prop="currency"-->
        <!--                >-->
        <!--                    <i class="user-auth-form-item__icon currency"></i>-->
        <!--                    <Select v-model="formCustom.currency" placeholder="请选择货币类型">-->
        <!--                        <Option v-for="(currency, index) in currencys" :value="currency.scur" :key="index">{{ currency.scur }}</Option>-->
        <!--                    </Select>-->
        <!--                </FormItem>-->
        <div class="form-sms" v-if="otherData.smsPhoneCode">
          <FormItem prop="smsPhoneCode" style="width: 100%;">
            <i class="user-auth-form-item__icon sms"></i>
            <Input
              type="text"
              :value="formCustom.smsPhoneCode"
              @input="
                formCustom.smsPhoneCode = arguments[0].replace(/\s+/g, '')
              "
              :placeholder="$tex('请输入短信验证码')"
            >
            </Input>
          </FormItem>
          <Button
            class="ivu-btn-style--1"
            :disabled="smsPhoneCodeDisabled"
            @click="onSendSmsPhoneCodeClick('formCustom')"
            >{{ smsPhoneCodeText }}
          </Button>
          <div id="captcha"></div>
        </div>
        <FormItem prop="wechat" v-if="otherData.wechat.show">
          <i class="user-auth-form-item__icon wechat"></i>
          <Input
            type="text"
            :value="formCustom.wechat"
            @input="formCustom.wechat = arguments[0].replace(/\s+/g, '')"
            :placeholder="
              otherData.wechat.need
                ? $tex('请输入微信号（必填）')
                : $tex('请输入微信号（选填）')
            "
          >
          </Input>
        </FormItem>
        <FormItem prop="email" v-if="otherData.email.show">
          <i class="user-auth-form-item__icon email"></i>
          <Input
            type="text"
            v-model="formCustom.email"
            :placeholder="
              otherData.email.need
                ? $tex('请输入邮箱（必填）')
                : $tex('请输入邮箱（选填）')
            "
          >
          </Input>
        </FormItem>
        <FormItem prop="qq" v-if="otherData.qq.show">
          <i class="user-auth-form-item__icon qq"></i>
          <Input
            type="text"
            v-model="formCustom.qq"
            :placeholder="
              otherData.qq.need
                ? $tex('请输入QQ号码（必填）')
                : $tex('请输入QQ号码（选填）')
            "
          >
          </Input>
        </FormItem>
        <!-- 新增表单结束 -->
        <!-- 邀请码可见不可编辑v-show="!inviteHide" -->
        <FormItem
          v-show="isShowInviteCodeInput"
          prop="expandCode"
          class="yqm-wp"
          :rules="{
            required: !!otherData.expandCode.need,
            message: $tex('请输入邀请码'),
            trigger: 'blur',
          }"
        >
          <i class="user-auth-form-item__icon yqm"></i>
          <Input
            type="text"
            v-model="formCustom.expandCode"
            :placeholder="
              $tex('请输入邀请码') +
                (!!otherData.expandCode.need
                  ? $tex('（必填）')
                  : $tex('（选填）'))
            "
            :disabled="urlExp || urlTTPaste"
          >
          </Input>
        </FormItem>
        <FormItem
          prop="checkCode"
          class="user-auth-form-item"
          v-if="!isOpenBehavior"
        >
          <i class="user-auth-form-item__icon yzm"></i>
          <Input
            type="text"
            v-model="formCustom.checkCode"
            :placeholder="$tex('验证码')"
            @on-enter="handleSubmit('formCustom')"
            @on-focus="refreshCheckCode()"
          >
          </Input>
          <img
            class="user-auth-form-item__checkcode"
            :src="ewmUrl"
            @click="getImageCode"
          />
        </FormItem>
        <FormItem prop="agree">
          <Checkbox
            v-model="formCustom.agree"
            class="user-auth-form-item__checkbox"
          ></Checkbox>
          <a
            href=""
            class="user-auth-form-item__agree"
            @click.prevent="modal1 = true"
          >
            {{ $tex("我已年满18周岁,已阅读同意") }}
            <span>{{ $tex("开户协议") }}</span>
          </a>
          <agree :modal1="modal1" @back="modal1 = false"></agree>
        </FormItem>
        <yi-dun ref="yidun" moduleName="register" width="288px"></yi-dun>
      </Form>
      <Button
        class="user-auth-form__submit ivu-btn-style--2"
        :loading="registerStatus"
        long
        size="large"
        shape="circle"
        @click="handleSubmit('formCustom')"
      >
        <span v-if="!registerStatus">{{ $tex("注册") }}</span>
        <span v-else>{{ $tex("注册中") }}</span>
      </Button>
    </div>
    <div class="flex justify-center mt-20">
      <img
        src="~@/assets/images-v10/register/zhuce_welcome.png"
        class="w-auto"
      />
    </div>
  </div>
</template>

<script>
import register from "@/mixins/register";

export default {
  name: "register",
  mixins: [register],
};
</script>

<style scoped lang="less">
.register {
  padding: 250px 0 253px;
  position: relative;
  &__bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
  }
}
</style>
