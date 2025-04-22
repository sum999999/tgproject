<template>
  <modal
    :modalShow="modal1"
    :title="$tex('开户协议')"
    @btn-ok="$emit('back')"
    @btn-cancel="$emit('back')"
    width="1100"
    :hasFooter='true'
    :hasOkBtn='true'
    :hasNoBtn="false"
    :okText="$tex('返回')"
    claName="agree-wrap"
  >
    <div
      ref="content"
      class="content-wrap"
      slot="content"
    >
      <p
        class='content'
        style="color:#ec0022"
      ><span>{{$configText.main}}{{$tex("郑重提示")}}：</span>{{$tex("彩票有风险，投注需谨慎。不向未满18周岁的青少年出售彩票！")}}</p>
      <p class='title'>{{$tex("一. 服务协议的接纳")}}</p>
      <p class='content'>{{$tex('合法购彩年龄的用户在注册过程中勾选"同意"《{name}开户协议》即表示用户完全接受本协议项下的全部条款。在任何情况下，用户使用{name}的任何服务，即视为用户完全同意并接受本服务协议，受到本服务协议的指引和约束。', { name: $configText.main })}}</p>
      <p class='server'>{{$tex("二. 服务协议的修订与新增")}}</p>
      <p class='content'>
        {{$tex("{name}有权在必要时修改服务条款，服务条款一旦发生变动，将会在重要页面上提示修改内容。如果用户不同意所改动的内容，用户可以主动取消获得的相关服务。如果用户继续享用服务，则视为接受服务条款的变动。 {name}将不定期提供其它服务，而这些其它服务可能是受不同的服务条款和条件约束的，若新服务未发布服务条款和条件时，则适用于本条款，其它未尽事宜，{name}有限公司拥有最终解释权利。", { name: $configText.main })}}
      </p>
      <p class='server'>{{$tex("三. 相关定义")}}</p>
      <p class='content'>
        {{$tex("1、用户：指在{name}注册登记，并得到{name}在线认可，有资格享受{name}服务的注册会员。", { name: $configText.main })}}<br /> {{$tex("2、购彩帐户：指用户按{name}的要求，在{name}网站上设立的账户。购彩账户用于存放用户通过{name}各充值渠道充值现金和购彩中奖的奖金。", { name: $configText.main })}}
      </p>
      <p class='server'>{{$tex("四. 本协议服务范围")}}</p>
      <p class='content'>
        {{$tex("本协议服务范围包括：提供购买彩票的平台；提供彩票相关资讯；提供在线预付支付结算服务。彩种包括高频彩和低频彩等。")}}<br /> {{$tex("本协议服务范围不包括向注册会员提供电脑终端及其附属设备、网络和通信等资源。")}}
      </p>
      <p class='server'>{{$tex("五. 用户资料隐私和安全")}}</p>
      <p class='content'>
        {{$tex("{name}承诺对用户注册资料隐私信息绝对保密。", { name: $configText.main })}}<br /> {{$tex("{name}对用户注册信息提供最大限度的安全保障。同时，用户务必对其用户密码、个人帐号等信息自行保密，免被盗用或篡改。另外每个用户都要对其帐户中的所有活动和事件负全责。用户若发现任何非法使用用户帐号或安全漏洞的情况，请立即与{name}联系。", { name: $configText.main })}}
        <br /> {{$tex("为保障用户的合法权益，避免在中奖提款时因用户注册资料与真实情况不符而发生纠纷，请用户注册时务必按照真实、全面、准确的原则填写个人资料。对因用户自身原因而造成的不能兑奖情况，{name}概不负责。", { name: $configText.main })}}
      </p>
      <p class='server'>{{$tex("六. 免责条款")}}</p>
      <p class='content'>{{$tex("发生下列情况时，{name}不予承担任何法律责任：", { name: $configText.main })}}</p>
      <p class="case">{{$tex("1、用户资料泄露：由于用户将密码告知他人或与他人共享注册帐户，或由于用户的疏忽，由此导致的任何个人资料泄露，以及由此产生的纠纷。无论何种原因导致的用户资料未授权使用、修改，用户密码、个人帐号或注册信息被未授权篡改、盗用而产生的一切后果。")}}</p>
      <p class="case">{{$tex("2、不可抗力及不可预见的情势发生：不可抗力和不可预见情势包括：自然灾害、政府行为、罢工、战争等；黑客攻击、计算机病毒侵入或发作、政府管制、彩票发行和销售机构的原因、彩票出票机或服务的故障、网络故障、国家政策变化、法律法规之变化等。因不可抗力和不可预见情势造成：暂时性关闭。因不可抗力和不可预见的情势造成本协议不能履行的。")}}</p>
      <p class="case">{{$tex("3、用户原因或第三方原因造成损失：由于用户自身原因、或违反法律法规，以及第三方的原因，造成用户无法使用彩票服务或产生其他损失的。")}}</p>
      <p class="case">{{$tex("4、用户使用链接或下载资料产生的损害：由于使用与{name}链接的其它网站，或者使用通过{name}下载或取得的资料，造成用户资料泄露、用户电脑系统损坏等情况及由此而导致的任何争议和后果。", { name: $configText.main })}}</p>
    </div>
  </modal>
</template>
<script>
import modal from "./modal.vue";
export default {
  components: { modal },
  props: {
    modal1: false,
    type: Boolean
  },
  mounted() {
    this.$refs.content.style.maxHeight = window.innerHeight * 0.7 + "px";
  }
};
</script>
<style lang="less">
.content-wrap {
  overflow: auto;
}
.v-transfer-dom {
  .agree-wrap {
    .title {
      font-weight: 600;
      color: #3056b2;
      font-size: 14px;
    }
    .content {
      width: 100%;
      line-height: 20px;
    }
    .server {
      &:extend(.v-transfer-dom .agree-wrap .title);
      margin-top: 8px;
    }
    .case {
      text-indent: 20px;
      width: 100%;
      line-height: 20px;
    }
  }
}
</style>


