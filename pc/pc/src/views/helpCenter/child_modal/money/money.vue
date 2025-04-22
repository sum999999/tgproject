<template>
  <div class='money'>
    <div style="height:40px;color:grey">
      {{$tex("充值、提现问题")}}
    </div>
    <hr style="margin-bottom:20px">
    <Collapse
      v-model="newIndex"
      accordion
    >
      <Panel name="1">
        <span
          class="title"
          ref='slot1'
        >{{$tex("1. 使用网上银行安全吗？")}}</span>
        <div
          slot="content"
          class="pcontent"
        >
          <p>{{$tex("用户在本站充值时选择任一银行卡支付通道后立即进入银行网关，银行卡资料全部在银行网关加密页面上填写，资料提交过程全部采用国际通用的SSL或SET及数字证书进行加密传输，安全性由银行全面提供支持和保护，各银行网上支付系统对网上支付的安全提供保障。")}}</p>
        </div>
      </Panel>
      <Panel name="2">
        <span
          class="title"
          ref='slot2'
        >{{$tex("2. 有银行卡就可以充值了吗？")}}</span>
        <div
          slot="content"
          class="pcontent"
        >
          <p>· {{$tex("用户拥有了银行卡后，即有多种充值方式可以充值；")}}</p>
          <p>· {{$tex("已开通网上银行，使用第三方在线支付平台进行充值，方便、快捷。")}}</p>
          <p>· {{$tex("未开通网银，可以使用手机银行转账、微信或支付宝等方式进行充值。")}}</p>
        </div>
      </Panel>
      <Panel name="3">
        <span
          class="title"
          ref='slot3'
        >{{$tex("3. 提款金额有没有限制？")}}</span>
        <div
          slot="content"
          class="pcontent"
        >{{$tex("{name}，支持单笔最低充值1{unit}起，单笔提款最低金额为10{unit}起，无最高提款额度限制。", { name: $configText.main, unit: "元" })}}</div>
      </Panel>
      <Panel name="4">
        <span
          class="title"
          ref='slot4'
        >{{$tex("4. 提款次数有没有限制？")}}</span>
        <div
          slot="content"
          class="pcontent"
        >{{$tex("{name}支持每个账户每天可享有3次免手续费提款，单次提款金额无上限；当日超过3次以上提款的申请，收取提款金额5%手续费。", { name: $configText.main })}}</div>
      </Panel>
      <Panel name="5">
        <span
          class="title"
          ref='slot5'
        >{{$tex("5. 提款不成功怎么办？")}}</span>
        <div
          slot="content"
          class="pcontent"
        >
          <p>{{$tex("提款不成功分两种情况：")}}</p>
          <p>· {{$tex("提款申请未成功：")}}</p>
          <p>{{$tex("1、提款金额大于账户实有金额。")}}</p>
          <p>{{$tex("2、提款时填写的提款密码与用账户信息设置的提款密码不一致。")}}</p>
          <p>{{$tex("3、银行卡信息不符合规定格式。")}}</p>
          <p>· {{$tex("申请提款成功，但款项没有到达指定账户：")}}</p>
          <p>{{$tex("1、银行卡卡号填写错误，与用户姓名不符，银行退单。")}}</p>
          <p>{{$tex("一旦发生上述现象，请及时联系24小时在线客服或QQ客服，由客服人员协助您完成提款。")}}</p>
        </div>
      </Panel>
      <Panel name="6">
        <span
          class="title"
          ref='slot6'
        >{{$tex("6. 如何查询提款记录？")}}</span>
        <div
          slot="content"
          class="pcontent"
        >
          <p>· {{$tex('用户登录后点击首页右侧的"提款"。')}} </p>
          <p>· {{$tex('在提款页面，点击右上角"查看提款记录"。')}} </p>
        </div>
      </Panel>
      <Panel name="7">
        <span
          class="title"
          ref='slot7'
        >{{$tex("7. 网银/手机银行转账入款？")}}</span>
        <div
          slot="content"
          class="pcontent"
        >
          <p>· {{$tex('我们同时支持全国超过35家银行，进行网银转帐支付：进入【会员中心】-【充值】页面点”银行卡入款”，进入公司入款页面即可查看“{name}”所支持的最新入款银行账户,选择相应银行进行转账入款；', { name: $configText.main })}}</p>
          <p>· {{$tex("同行互转存款到帐时间约为一到三分钟，跨行实时转账需依据银行划款作业时间为基准，我们将于确认到帐后，即时为您游戏帐户充值；")}} </p>
          <p>· {{$tex("单笔超过5万以上的入款，请选择“银行卡入款”，单笔和累计转账入款金额，转账入款赠送1%存款红利，无封顶上限，支持7X24小时资金即时到账。")}}</p>
        </div>
      </Panel>
      <Panel name="8">
        <span
          class="title"
          ref='slot8'
        >{{$tex("8. 网银/手机银行在线支付？")}}</span>
        <div
          slot="content"
          class="pcontent"
        >
          <p>
            · {{$tex('会员登入后点击充值，选"在线支付"，进入线上第三方支付。')}}
          </p>
          <p>
            · {{$tex("选择入款额度，提交后进入第三方支付平台,完成入款后会在3-5分钟内自动把额度充入您的游戏账户中。")}}
          </p>
          <p>
            · {{$tex("在线支付单次最高存款:50000")}}
          </p>
          <p>
            · {{$tex("支持借记卡：中国民生银行总行,中国工商银行,中国建设银行,兴业银行,中国光大银行,深圳发展银行,中国邮政,华夏银行,上海浦东发展银行,中国银行,上海银行,交通银行,广东发展银行,北京银行,中信银行,深圳平安银行,中国农业银行,招商银行。")}}
          </p>
          <p>
            · {{$tex("确认充值金额后﹐将请您确认您的支付订单无误，并建议您记录您的支付订单号后，确认送出，并耐心等待· 载入网络银行页面﹐传输中已将您账户数据加密﹐请耐心等待。")}}
          </p>
          <p>
            · {{$tex("进入网络银行页面﹐请确实填写您银行账号信息﹐支付成功﹐额度将在5分钟内系统处理完成，立即加入您的彩票会员账户(由于银行原因,第三方支付有时会有一定延迟,如果在5-30分钟内还未到账,请联系在线客服,提供相应资料进行处理)。")}}
          </p>
        </div>

      </Panel>
      <Panel name="9">
        <span
          class="title"
          ref='slot9'
        >{{$tex("9. 微信、支付宝扫码支付？")}}</span>
        <div
          slot="content"
          class="pcontent"
        >
          · {{$tex("{name}，聚合目前最主流最先进的在线支付场景技术，支持微信、支付宝、QQ钱包的直接支付、扫码支付、转账支付，您只需要登录会员账户后，点击【充值】，选择相应的支付渠道和方式，完成支付就可以；通过微信、支付宝，进行转账支付充值的，单笔金额100{unit}以上，赠送1%存款红利，次次存次次送，无封顶上限；如在充值支付过程有遇到任何问题或疑难，请联系24小时在线客服或QQ客服，以便即时协助您完成支付充值。", { name: $configText.main, unit: "元" })}}
        </div>
      </Panel>
      <Panel name='10'>
        <span
          class='title'
          ref='slot10'
        >{{$tex("10. 中奖后如何返奖?")}}</span>
        <div
          slot='content'
          class='pcontent'
        >· {{$tex('本彩票"自动兑奖，自动返奖"，所有奖金均由网站系统自动开兑，并自动返还到用户的会员账户中。')}}</div>
      </Panel>
      <Panel name='11'>
        <span
          class='title'
          ref='slot11'
        >{{$tex("11. 提款时需要注意哪些事项？")}}</span>
        <div
          slot='content'
          class='pcontent'
        >
          · {{$tex("确认提款时提交的的银行信息的正确性。")}}<br /> · {{$tex("为了防止少数用户利用信用卡套现和洗钱的行为，保护正常用户的资金安全，本站针对提款做出如下规定：")}} <br /> {{$tex("1、用户需要达到一定的打码量，才能正常办理提款。")}}
          <br /> {{$tex("2、发现异常的提款，要经过审核。")}}
        </div>
      </Panel>
      <Panel name='12'>
        <span
          class='title'
          ref='slot12'
        >{{$tex("12. 提款需要手续费吗？")}}</span>
        <div
          slot='content'
          class='pcontent'
        >
          · {{$tex("达到提款条件才能取款。")}} <br /> · {{$tex("提款不限次数，手续费根据网站设定。")}}<br /> · {{$tex("提款时所产生的银行手续费将全部由本网站为您承担。")}}<br />
        </div>
      </Panel>
      <Panel name='13'>
        <span
          class='title'
          ref='slot13'
        >{{$tex("13. 如何提款？")}}</span>
        <div
          slot='content'
          class='pcontent'
        >
          · {{$tex('用户登录后点击首页右侧的"提款"进入提款页面，在提款页面输入提款金额及提款密码并确认。')}} <br /> · {{$tex('您的提款申请成功并经核对无误后，将通过银行转账方式提款，1到3分钟实时到账。支持全国所有大小银行')}}<br /> · {{$tex('为了保障您的资金安全，公司提供7X24小时一对一服务。')}}<br />
        </div>
      </Panel>
    </Collapse>
  </div>
</template>
<script>
export default {
  props: {
    index: {
      type: String
    }
  },
  data() {
    return {
      newIndex: this.index || "1"
    };
  },
  watch: {
    index(n) {
      this.newIndex = n;
    }
  }
};
</script>

<style scoped>
.money {
  /*     width: 756px; */
}
</style>
