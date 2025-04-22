<template>
  <div class="login">
    <div class="user-auth">
      <div class="user-auth__header">
        <h1 class="user-auth__title user-auth__title--link user-auth__title--active">{{$tex("账号登入")}}</h1>
        <h1
          class="user-auth__title user-auth__title--link"
          @click="$router.push('/register')"
        >{{$tex("账号注册")}}</h1>
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
            v-model="formCustom.userCode"
            :placeholder="$tex('账号')"
          >
          </Input>
        </FormItem>
        <FormItem
          prop="password"
          class="user-auth-form-item- user-auth-form-item--append"
        >
          <i class="user-auth-form-item__icon pwd"></i>
          <Input
            type="password"
            v-model="formCustom.password"
            :placeholder="$tex('密码')"
          >
          </Input>
          <div
            class="user-auth-form-item__tips"
            @click="$router.push('/password')"
          >{{$tex("忘记密码")}}?</div>
        </FormItem>
        <FormItem
          prop="checkCode"
          class="user-auth-form-item"
          v-if='isYzm'
        >
          <Input
            type="text"
            v-model="formCustom.checkCode"
            :placeholder="$tex('验证码')"
            @on-enter="handleSubmit('formCustom')"
            class="label-block__color"
            @on-focus='refreshCheckCode()'
          >
          </Input>
          <img
            class="user-auth-form-item__checkcode"
            :src='ewmUrl'
            @click='getImageCode'
          >
        </FormItem>
        <yi-dun
          ref="yidun"
          moduleName="loginFilter"
          width="288px"
        ></yi-dun>
        <FormItem>
          <Button
            class="user-auth-form__submit"
            type="primary"
            :loading="loginStatus"
            long
            size="large"
            @click="handleSubmit('formCustom')"
          >
            <span v-if="!loginStatus">{{$tex("登录")}}</span>
            <span v-else>{{$tex("登录中")}}</span>
          </Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import encryption from '@/utils/md5'
import utils from '@/utils/utils'
import YiDun from '@/components/YiDun'

export default {
  name: 'login',
  components: {
    YiDun,
  },
  data() {
    return {
      loginStatus: false, //防止连续登录
      loginAvatar: '',
      formCustom: {
        userCode: '',
        password: '',
        checkCode: '',
      },
      ewmUrl: '', //图形验证码
      ruleInline: {
        userCode: [{ required: true, message: this.$tex('请输入账号'), trigger: 'blur' }],
        password: [{ required: true, message: this.$tex('请输入密码'), trigger: 'blur' }],
        checkCode: [{ required: true, message: this.$tex('请输入验证码'), trigger: 'blur' }],
      },
      yidunRef: null,
    }
  },
  computed: {
    configList() {
      return this.$store.state.configList
    },
    isYzm() {
      return !this.isOpenBehavior
    },
    isOpenBehavior() {
      return this.yidunRef && this.yidunRef.isOpenBehavior
    },
    behaviorValidate() {
      return this.yidunRef && this.yidunRef.behaviorValidate
    },
    isOpenSXE() {
      return this.yidunRef && this.yidunRef.isOpenSXE
    },
  },
  watch: {
    configList: {
      handler(newVal) {
        this.initConfig(newVal)
      },
      deep: true,
    },
  },
  created() {
    this.initConfig(this.configList)
    this.getImageCode()
    this.$nextTick(() => {
      this.yidunRef = this.$refs.yidun
    })
    let user = localStorage.getItem('user')
    let redirect = decodeURIComponent(this.$route.query.redirect)
    if (user && user !== '{}' && redirect !== '/bankValid' && redirect !== '/phoneValid') {
      // debugger;
      this.$router.push('/home')
    }
  },
  methods: {
    initConfig(configList) {
      for (let content of configList) {
        if (content.key === 'PC_LOGIN_IMG_URL') {
          this.loginAvatar = content.value
        }
      }
    },
    forgetPass() {
      this.$router.push('/password')
    },
    refreshCheckCode() {
      //获取焦点刷新验证码
      if (this.hasRefreshChode) {
        return
      }
      this.getImageCode()
      this.hasRefreshChode = true
    },
    async getImageCode() {
      if (this.isYzm) {
        const data = await utils.loadEwmUrl()
        this.ewmUrl = data.url
        this.kaptchaFlag = data.kaptchaFlag
      }
    },
    async goLogin(name) {
      if (localStorage.getItem('user')) {
        let user = JSON.parse(localStorage.getItem('user'))
        let userId = user.userId
        if (userId) {
          this.$Modal.info({
            title: this.$tex('不能连续登陆'),
            content: this.$tex('现在为您跳转'),
            onOk: () => {
              this.$store.commit('getUser', user)
            },
          })
          return
        }
      }
      if (this.loginStatus) return
      const valid = await this.$refs[name].validate()
      if (!valid) {
        this.yidunRef.refreshBehavior()
        this.verifyData = {}
        this.getImageCode()
        return
      }
      this.loginStatus = true
      let obj = Object.assign({}, this[name])
      obj.password = encryption.encrypt.md5(obj.password)

      if (this.isOpenBehavior) {
        if (!this.behaviorValidate) {
          this.$Message.error(this.$tex('请完成验证'))
          this.loginStatus = false
          return
        }
        obj.ydNECaptchaValidate = this.behaviorValidate
      }
      if (this.isOpenSXE) {
        obj.ydtoken = await this.yidunRef.getSXEToken()
      }
      this.loginSubmit(obj)
    },
    loginSubmit(obj, loading) {
      const curKaptchaFlag = this.kaptchaFlag
      this.$http
        .post('/api/v2/user/login', obj, {
          kaptchaFlag: curKaptchaFlag,
        })
        .then(async (response) => {
          this.loginStatus = false
          if (response.data.code !== 0) {
            loading && loading()
            this.yidunRef.refreshBehavior()
            if (response.data.code === 256) {
              //异地登录异常
              this.$store.commit('getCacheLoginUserInfo', JSON.stringify(obj)) //存储临时的登录信息
              this.$store.commit('getKaptchaFlag', curKaptchaFlag)
            }
            return
          }
          loading && loading()
          localStorage.setItem('user', JSON.stringify(response.data.data))
          this.$store.commit('getUser', response.data.data)
          let path = sessionStorage.getItem('path')
          if (path) {
            //调转到之前要跳到的页面
            let strArr = path.split('&')
            this.$router.push({
              name: strArr[0],
              params: {
                id: strArr[1],
                order: strArr[2] ? JSON.parse(strArr[2]) : undefined,
              },
            })
            return
          }
          this.$router.push('/home')
        })
    },
    handleSubmit(name) {
      if (this.$store.state.user.userCode) {
        this.$Modal.confirm({
          title: this.$tex('温馨提示'),
          content: this.$tex('当前已登录，是否切换账号？'),
          onOk: () => {
            this.$http.post('/api/v2/user/loginOut', '', { userId: true }).then((response) => {
              if (response.data.code !== 0) return
              localStorage.setItem('user', '')
              this.$store.commit('getUser', '')
              this.goLogin(name)
            })
          },
        })
      } else {
        this.goLogin(name)
      }
    },
  },
}
</script>

<style scoped lang="less">
.login {
  background: url('~@/assets/images-v6/register/dengruzhucebg.png') no-repeat;
  background-size: cover;
  padding: 60px 0 40px;
}
</style>


