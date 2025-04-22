<template>
  <!-- 订单完成界面 -->
  <div
    class="step-three"
    id="step-three"
  >
    <div
      class="go-back"
      @click="goBack"
    >
      <!-- <img src="/static/images/bk-one.png" alt=""> -->
      <span>{{$tex("返回充值列表")}}</span>
    </div>
    <div v-if="!offBank">
      <div class="head-info">
        <img
          src="/static/images/commit.png"
          alt=""
        >
        <!-- 订单已生成 -->
        <span v-if="notOrder">{{$tex("扫码支付")}}</span>
        <span v-else-if="data.currentData.onOrOff !== '01'">{{$tex("订单已生成")}}</span>
        <span v-else>{{$tex("充值申请成功")}}</span>
      </div>
      <div class="cont-info">
        <div
          class="cont-tip clearfix"
          v-if="!notOrder && data.data.orderMoney && data.orderMoney != data.data.orderMoney "
        >
          <i class="img"></i>
          <div class="cont">
            <p>
              {{$tex("①为快速充值到账，部分支付通道金额随机一位小数，请您放心支付{num}{unit}", {
                num: data.data.orderMoney,
                unit: ""
              })}}
            </p>
            <p>{{$tex("②转账时必须备注订单号才能快速到账")}}</p>
          </div>
        </div>
        <div
          class=""
          v-if="data.data && (data.data.type === '2' || data.data.type === '3' || data.data.type === '5' || data.data.type === '6')"
        >
          <!-- <h6>审核订单</h6> -->

          <div class="cont">
            <div class="img">
              <img
                class="w-full"
                :src="data.currentData.channelIcon || data.currentData.accountIcon"
                alt=""
              >
            </div>
            <div class="txt">
              <p>
                <label for="">{{$tex("类型")}}：</label>
                <span>{{$tex("第三方支付")}}</span>
              </p>
              <p>
                <label for="">{{$tex("订单号")}}：</label>
                <span>{{data.data.orderId}}</span>
              </p>
              <p>
                <label for="">{{$tex("订单金额")}}：</label>
                <span class="font-yellow">
                  <strong>{{data.money}}</strong>
                </span>
              </p>
            </div>
            <div class="clr"></div>
          </div>
          <a
            class="btn"
            :href="data.data.content"
            target="_blank"
            @click="goSubmit(data.data.type)"
            v-if="!beforSubmit && (data.data.type === '2' || data.data.type === '5')"
          >{{$tex("确认支付")}}</a>
          <a
            class="btn"
            @click="goSubmit(data.data.type)"
            target="_blank"
            v-else-if="!beforSubmit && (data.data.type === '3' || data.data.type === '6') && !flag"
          >{{$tex("确认支付")}}</a>
          <a
            class="btn ordered"
            v-if="!(!beforSubmit && (data.data.type === '3' || data.data.type === '6'))"
          >
            <span v-if="data.currentData.onOrOff !== '01'">{{$tex("订单已提交")}}</span>
            <span v-else>{{$tex("充值申请成功")}}</span>
          </a>
          <!-- <a class="btn ordered" v-if="(!(!beforSubmit && data.data.type === '3')) && data.currentData.onOrOff !== '01'">订单已提交</a>
                <a class="btn ordered" v-else-if="(!(!beforSubmit && data.data.type === '3')) && data.currentData.onOrOff === '01'">充值申请成功</a> -->
          <a
            class="btn"
            @click="queryRechargeList"
            v-show="beforSubmit"
          >{{$tex("查看充值记录")}}</a>
        </div>
        <div
          class="saoma"
          v-else
        >
          <div class="cont">
            <div
              class="qr-img qr-img-more"
              v-if="notOrder"
            >
              <img
                class="ewm"
                :src="data.currentData.accountImgUrl"
                alt=""
              >
              <div class="input-wrap">
                <label>{{$tex("存款人信息")}}:</label>
                <input
                  v-model="rechargeUsername"
                  @input="nameChange"
                  :placeholder="$tex('填写真实姓名、微信、支付宝用户名')"
                ></input>
              </div>
            </div>
            <div
              class="img"
              v-else
            >
              <div
                class="qr-img"
                v-if="data.data.type === '0'"
              >
                <div id="qr-code"></div>
              </div>
              <div
                class="qr-img"
                v-else-if="data.data.type === '1'"
              >
                <img
                  :src="data.data.content"
                  alt=""
                >
              </div>
              <div
                class="qr-img"
                v-else-if="data.data.type === '4'"
              >
                <img
                  :src="'data:image/png;base64,'+data.data.content"
                  alt=""
                >
              </div>

            </div>
            <div
              class="txt"
              :class="{'txt-notOrder':notOrder}"
            >
              <h6>{{$tex("扫描二维码进行支付")}}</h6>
              <p>
                <label for="">{{$tex("类型")}}：</label>
                <span>{{$tex("扫码支付")}}</span>
              </p>
              <p>
                <label for="">{{$tex("订单金额")}}：</label>
                <span class="font-yellow">
                  <strong>{{$tex("{unit}{money}", { unit: "", money: data.money })}}</strong>
                </span>
              </p>
              <div
                class="detailed"
                v-if="data.currentData.onOrOff !== '01'"
              >
                <span>{{$tex('1.) 请在APP中打开 "扫一扫"')}}</span><br />
                <span>{{$tex('2.) 输入充值金额')}}</span><br />
                <!-- <span>3.)&nbsp;点击添加备注</span><br/>
                            <span>4.)&nbsp;填上备注订单号</span><br/> -->
                <span>{{$tex('3.) 付款成功后，点击"支付完成"')}}</span>
              </div>
              <div
                class="detailed"
                v-else-if="notOrder"
              >
                <span>{{$tex('1.) 请在APP中打开 "扫一扫"')}}</span><br />
                <span>{{$tex("2.) 进入APP后至转账页/加好友并转账")}}</span><br />
                <span>{{$tex("3.) 输入充值金额")}}</span><br />
                <span>{{$tex("4.) 付款成功后,记录商户订单号")}}</span>
              </div>
              <div
                class="detailed"
                v-else
              >
                <span>{{$tex('1.) 请在APP中打开 "扫一扫"')}}</span><br />
                <span>{{$tex("2.) 进入APP后至转账页/加好友并转账")}}</span><br />
                <span>{{$tex("3.) 输入充值金额")}}</span><br />
                <span>{{$tex("4.) 点击添加备注")}}</span><br />
                <span>{{$tex("5.) 填上备注例如订单号")}}
                  <span class="font-blue">{{data.data.orderId}}</span>
                </span><br />
                <span>{{$tex('6.) 付款成功后，点击"支付完成"')}}</span>
              </div>
            </div>
            <div class="clr"></div>

            <div
              class="check-order"
              v-if="notOrder"
            >
              <a
                class="btn"
                @click="onRecharge"
              >{{$tex("已支付,提交订单")}}</a>
            </div>
            <div
              class="check-order"
              v-else
            >
              <a
                class="btn"
                @click="queryRechargeList"
              >{{$tex("支付完成，查看订单")}}</a>
            </div>

          </div>

        </div>
      </div>

    </div>
    <div
      class="done-order"
      v-else
    >
      <div class="top-tip">
        <div class="confirmicon"></div>
        <div class="confirm1">
          <!-- <span>订单已提交</span> -->
          <span v-if="data.currentData.onOrOff !== '01'">{{$tex("订单已提交")}}</span>
          <span v-else>{{$tex("充值申请成功")}}</span>
          <p>
            <span>{{$tex("根据地区银行的不同，存款后到账时间快2-5分钟，具体以银行到账时间和金额为准，如有疑问，请联系客服.")}}</span>
          </p>
        </div>
      </div>

      <div class="info">
        <dl class="first-in">
          <dt>
            {{$tex("充值信息")}}
          </dt>
          <dd>
            <span class="bk-clr bk-clr-child-wrap">
              {{$tex("收款人")}}：{{data.currentData.accountName}}
              <span
                class="bk-clr-child "
                @click="copyWords(data.currentData.accountName)"
              >{{$tex("复制")}}</span>
            </span>
            <span class="bk-clr-child-wrap">
              {{$tex("开户行")}}：{{data.currentData.bankName}}
              <span
                class="bk-clr-child"
                @click="copyWords(data.currentData.openBankName)"
              >{{$tex("复制")}}</span>
            </span>
            <span class="bk-clr bk-clr-child-wrap">
              {{$tex("银行卡号")}}：{{data.currentData.bankNo}}
              <span
                class="bk-clr-child"
                @click="copyWords(data.currentData.bankNo)"
              >{{$tex("复制")}}</span>
            </span>
          </dd>
        </dl>
        <dl>
          <dt>
            {{$tex("充值金额")}}
          </dt>
          <dd>
            <span>{{data.money}}</span>
          </dd>
        </dl>
        <dl>
          <dt>
            {{$tex("充值时间")}}
          </dt>
          <dd>
            <span class="bk-clr">{{rechargeTime}}</span>
          </dd>
        </dl>
        <dl>
          <dt>
            {{$tex("充值类型")}}
          </dt>
          <dd>
            <span class="bo-b">{{data.currentData.rechargeUserType}}</span>
          </dd>
        </dl>
      </div>
      <div style="text-align:center;">
        <Button
          type="primary"
          size="large"
          class="confirmbutton"
          @click="queryRechargeList"
        >{{$tex("查看充值记录")}}</Button>
      </div>
    </div>
    <!-- 回退提示 -->
    <modal
      :modalShow="payTip"
      claName="pay_tip"
      :width="355"
      :maskClosable="true"
      :hasFooter="true"
      :hasOkBtn="true"
      scrollable
      @btn-ok="closePayTipDialog"
      @btn-cancel="holdPayTipDialog"
    >
      <div
        slot="content"
        style="text-align:center;font-size:12px;padding-top:10px;"
      >
        <p style="font-weight:bold;font-size:16px">{{$tex("请确认支付已完成后再退出!")}}</p>
        <p style="line-height:26px;">{{$tex("若未实际付款，审核将不通过")}}</p>
      </div>
    </modal>
  </div>
</template>

<script>
import QRCode from '@/utils/qrcode' // 不使用 import QRCode from "qrcodejs2";  网站太长会报错
import modal from '@/components/modal'
import { hasPermission } from '@/utils/authority-utils'
import { convert2LocalDateTime } from '@/filters'

export default {
  components: { modal },
  props: {
    data: {
      type: Object,
    },
    parentData: {
      type: Object,
    },
    flag: {
      default: false,
    },
    localApiCoin: {
      type: Object,
    },
  },
  data() {
    return {
      beforSubmit: false,
      offBank: false,
      payTip: false,
      nextFlag: false, //返回还是查看充值记录的标识
      selectData: {},
      rechargeUsername: '', // 充值描述
    }
  },
  computed: {
    notOrder() {
      //不生订单号
      return this.data.currentData.companyType == '0'
    },
    rechargeTime() {
      return convert2LocalDateTime(this.data.currentData.rechargeTime).slice(5)
    },
  },
  watch: {
    data: {
      deep: true,
      handle(value) {
        this.needRecharge = false
      },
    },
  },
  methods: {
    convert2LocalDateTime,
    nameChange() {
      let value = null
      if (hasPermission('validator.chinese')) {
        value = this.rechargeUsername.match(/([\u4e00-\u9fa5\w]*)/gi).join('')
      } else {
        value = this.rechargeUsername
          .match(/[^.'"\\\-?\[\]{}|,:;<>&=#!@$%^*_\/+！＠＃＄％︿＆＊（）＿＋／？’＂｜［］｛｝。，＞＜]/gi)
          .join('')
      }
      this.rechargeUsername = value
    },
    /**
     * 阻止键盘后退
     */
    stopBackSpace() {
      history.pushState(null, null, document.URL)
      window.addEventListener(
        'popstate',
        (e) => {
          history.pushState(null, null, document.URL)
          this.payTip = true
        },
        false
      )
      document.addEventListener('keydown', this.handlerKey, false)
      document.addEventListener('keypress', this.handlerKey, false)
    },
    /**
     * 键盘后退事件
     */
    handlerKey(e) {
      let ev = e || window.event
      const nodeName = (ev.target || ev.srcElement).nodeName
      if (this.$route.params.id === 'recharge' && ev.keyCode === 8 && nodeName != 'TEXTAREA' && nodeName != 'INPUT') {
        window.event && (window.event.returnValue = false)
        e && e.preventDefault()
        this.payTip = true
      }
    },
    holdPayTipDialog() {
      this.payTip = false
      if (this.nextFlag) this.nextFlag = false
    },
    async closePayTipDialog() {
      //返回充值列表提示支付
      if (this.needRecharge) {
        await this.recharge()
      }
      this.payTip = false
      document.removeEventListener('keydown', this.handlerKey, false)
      document.removeEventListener('keypress', this.handlerKey, false)
      window.removeEventListener(
        'popstate',
        (e) => {
          history.pushState(null, null, document.URL)
          this.payTip = true
        },
        false
      )
      if (this.nextFlag) {
        //去充值记录
        this.$router.push({ name: 'personalCenter', params: { id: 'trade' } })
        return
      }
      this.$emit('get-back-status', 0) //返回
    },
    copyWords(text) {
      //复制文本
      let copyInput = document.createElement('input')
      copyInput.value = text
      document.body.appendChild(copyInput)
      copyInput.select() //选择对象
      document.execCommand('copy')
      document.body.removeChild(copyInput)
      this.$Message.success(this.$tex('复制成功'))
    },
    queryRechargeList() {
      if (this.data.currentData.onOrOff !== '01') {
        this.$router.push({ name: 'personalCenter', params: { id: 'trade' } })
        return
      }
      this.nextFlag = true
      this.payTip = true
    },
    recharge() {
      if (this.isSubmit) return
      this.isSubmit = true
      return new Promise((resolve, reject) => {
        this.$http
          .post(
            '/api/v2/user/recharge',
            {
              totalFee: this.data.money,
              rechargeType: this.data.currentData.onOrOff,
              companyAccountId: this.data.currentData.companyAccountId,
              rechargeUsername: this.rechargeUsername,
            },
            {
              userId: true,
              timeout: 30 * 1000,
              timeoutDialog: true,
              headers: {
                scur: this.localApiCoin.scur,
              },
            }
          )
          .then((res) => {
            this.isSubmit = false
            if (res.data.code !== 0) return
            resolve(res)
          })
          .catch(() => {
            this.isSubmit = false
          })
      })
    },
    onRecharge() {
      let rechargeUsername = this.rechargeUsername || ''
      rechargeUsername = rechargeUsername.trim().replace(/^\s+|\s+$/g, '')
      if (rechargeUsername.length <= 0) {
        this.$Message.error(this.$tex('请填写存款人信息'))
        return
      }
      this.rechargeUsername = rechargeUsername
      this.nextFlag = true
      this.payTip = true
      this.needRecharge = true
    },

    goSubmit(type) {
      if (type === '3' || type === '6') {
        let width = document.documentElement.clientWidth || document.body.clientWidth
        let height = document.documentElement.clientHeight || document.body.clientHeight
        /*      let mywindow = window.open('', '', 'width=600,height=750,left=' + width / 3 + ',top=' + height / 6)
             mywindow.left = "400px"
             mywindow.document.write(this.data.data.content) */
        var newWindow = window.open()
        newWindow.document.write(this.data.data.content)
      }
      this.beforSubmit = true
    },
    goBack() {
      if (this.data.currentData.onOrOff !== '01') {
        this.$emit('get-back-status', 0)
        return
      }
      this.payTip = true
    },
  },
  mounted() {
    let data = this.data.data
    if (data && data.type === '0') {
      let code = new QRCode('qr-code', this.data.data.content)
    }
  },
  created() {
    this.stopBackSpace()
    if (this.data.currentData.accountType === '0' && this.data.currentData.onOrOff === '01') {
      this.offBank = true
    }
    // if (this.data.data.type === '2') {
    //     window.open(this.data.data.content)
    // }
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.handlerKey, false)
    document.removeEventListener('keypress', this.handlerKey, false)
    window.removeEventListener(
      'popstate',
      (e) => {
        history.pushState(null, null, document.URL)
        this.payTip = true
      },
      false
    )
  },
}
</script>
<style scoped lang="less">
@imgSrc: '~@/assets/images';
.step-three .done-order dl dd .bk-clr-child {
  /*position: absolute;*/
  top: 6px;
  background-color: white;
  text-align: center;
  color: #989899;
  right: 10px;
  width: 40px;
  cursor: pointer;
  border: 1px solid #989899;
  padding: 0px 4px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 18px;
}
.step-three .done-order dl dd .bk-clr-child:hover {
  color: #ff7614;
  border-color: #ff7614;
}
.bk-clr-child-wrap {
  position: relative;
}
.cont-tip {
  color: #ff1100;
  margin-bottom: 20px;
  .img {
    float: left;
    margin-right: 10px;
    width: 51px;
    height: 44px;
    background: url('@{imgSrc}/kefu.png');
  }
  .cont {
    p {
    }
  }
}
</style>

<style lang="less" scoped>
.step-three .go-back {
  display: inline-block;
  padding: 4px 10px 4px 40px;
  border: 1px solid #ff7614;
  border-radius: 6px;
  color: #ff7614;
  background: url('/static/images/bk-one.png') no-repeat left center;
  background-position-x: 10px;
  text-align: center;
  cursor: pointer;
  margin-bottom: 10px;
}
.step-three .go-back img {
  width: auto;
  height: auto;
}
.step-three .done-order {
  margin-top: 86px;
}
.top-tip {
  text-align: center;
}
// .step-three .done-order .top-tip{

// }
.step-three .done-order .info {
  border-right: 1px solid #e2e2e2;
  width: 425px;
  margin: 30px auto 0;
}
.step-three .done-order dl.first-in {
  height: 105px;
}
.step-three .done-order dl {
  height: 35px;
  line-height: 35px;
  border-bottom: 1px solid #fff;
  display: table;
  table-layout: fixed;
  width: 100%;
}
.step-three .done-order dl dd,
.step-three .done-order dl dt {
  display: inline-block;
  height: 100%;
  /*float: left;*/
}
/*.step-three .done-order dl.first-in dt {*/
/*  height: 100%;*/
/*  line-height: 105px;*/
/*}*/
.step-three .done-order dl dt {
  color: #fff;
  width: 90px;
  text-align: center;
  display: table-cell;
  vertical-align: middle;
  /*   background: @primary-color; */
}
.step-three .done-order dl dd span {
  display: block;
  padding-left: 12px;
  width: 334px;
  display: flex;
  justify-content: space-between;
}
.step-three .done-order dl dd span.bk-clr {
  background: #e2e2e2;
}
.step-three .done-order dl dd span.bo-b {
  border-bottom: 1px solid #e2e2e2;
  height: 34px;
  line-height: 34px;
}
.step-three .confirmicon {
  // float: left;
  display: inline-block;
  vertical-align: top;
  width: 60px;
  height: 60px;
  background: url('~@/assets/images/icon.png') no-repeat -76px -509px;
}
.step-three .confirm1 {
  display: inline-block;
  vertical-align: top;
}
.step-three .confirm1 span {
  font-size: 24px;
  color: #313131;
  font-weight: bold;
}
.step-three .confirm1 p > span {
  font-size: 16px;
  font-weight: normal;
}
.step-three .confirmbutton {
  // margin-left: 290px;
  margin-top: 28px;
  width: 162px;
  /*   background-color: @primary-color;
  border: 1px solid @primary-color; */
}

/* 线上 */
.step-three .font-yellow {
  color: #ff7614;
  font-size: 20px;
}
.step-three .font-blue {
  color: #106ddc;
}
.step-three .head-info {
  height: 50px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  display: flex;
  align-items: center;
  background: #12b886;
  border-radius: 10px;
  justify-content: center;
}
.step-three .head-info img {
  width: auto;
  max-width: 55px;
  margin-right: 10px;
}
.step-three .cont-info {
  /*  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); */
  position: absolute;
  top: 180px;
  left: 50%;
  transform: translate(-50%, 0);
}
.step-three .cont-info .cont .txt {
  /* width: 300px; */
  font-size: 16px;
}
/* .step-three .cont-info h6{
        font-size: 20px;
    } */
.step-three .cont-info .cont .txt label {
  min-width: 80px;
  display: inline-block;
}
.step-three .cont-info .cont .txt .detailed {
  font-size: 14px;
  color: #7a7a7a;
  overflow: hidden;
  background: url('/static/images/shaomiao.png') no-repeat left center;
}
.step-three .cont-info .cont .img {
  width: 80px;
  height: 80px;
  margin-right: 20px;
  float: left;
}
/* .step-three .qr-img{
        width: 300px;
        height: 300px;
        padding: 10px;
        border: 1px solid #eee;
    } */
.step-three .cont-info .saoma .cont {
  min-width: 600px;
}
.step-three .cont-info .saoma .cont h6 {
  font-size: 20px;
  margin-bottom: 10px;
  margin-top: 10px;
}
.step-three .cont-info .saoma .cont .img {
  width: 240px;
  height: 240px;
  padding: 10px;
  border: 1px solid #eee;
}
.step-three .qr-img-more {
  width: 240px;
  padding: 10px;
  float: left;
  margin-right: 40px;
}
.step-three .txt-notOrder {
  padding-top: 40px;
}
.step-three .qr-img-more .input-wrap {
  height: 40px;
  overflow: hidden;
  margin-top: 5px;
}
.step-three .qr-img-more .input-wrap label {
  float: left;
  width: 100px;
  height: 40px;
  line-height: 40px;
  background-color: #eeeeee;
  text-align: center;
  color: #860e03;
}
.step-three .qr-img-more .input-wrap input {
  float: left;
  height: 40px;
  width: 114px;
  padding: 0 5px;
  font-size: 12px;
}
.step-three .cont-info .saoma .cont .qr-img-more .ewm {
  width: 220px;
  height: 220px;
  padding: 25px;
  display: block;
  margin: 0 auto;
  float: none;
  border: 1px solid #eee;
}
.step-three .cont-info .saoma .cont .img * {
  width: 100%;
  height: 100%;
}
.step-three .cont-info .saoma .check-order {
  border-top: 1px solid #ccc;
  text-align: center;
  margin-top: 20px;
}
.step-three .cont-info .saoma .check-order .btn {
  /* margin: 0 auto; */
  float: none;
  display: inline-block;
}
.step-three .cont-info .btn {
  color: #fff;
  /*   border-color: #be1204;
   background: #be1204; */
  max-width: 160px;
  text-align: center;
  margin-top: 20px;
  margin-right: 20px;
  float: left;
}
.step-three .cont-info .ordered {
  background: #ccc;
  color: #666;
  border-color: #eee;
}
.step-three .cont-info .btn.ordered:hover {
  background: #ccc;
}
.step-three .cont-info .btn:hover {
  background: #860e03;
}
</style>
<style scoped>
.v-transfer-dom >>> .ivu-modal-wrap.pay_tip .ivu-modal-footer {
  padding-bottom: 28px;
  padding-top: 8px;
}
</style>

