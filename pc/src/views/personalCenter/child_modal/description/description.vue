<template>
  <div class="description">
    <div class="tab" v-if="$store.getters.sysPlatformFlag != 'by329'">
      <ul>
        <li
          v-for="(list, index) in tabNav"
          :key="index"
          :class="[tab === list.label ? 'active' : '']"
        >
          {{ list.name }}
        </li>
      </ul>
    </div>
    <div class="content-wrap">
      <!-- <div
        class="top-img"
        :class="{
            en: isInternational
          }"
      ></div> -->
      <template v-if="false">
        <div>
          <p>
            {{
              $tex(
                "您的账号既是玩家账号也是代理账号；既可以投注，也可以发展下级玩家，赚取返点佣金。"
              )
            }}
          </p>
          <h3>{{ $tex("如何赚取返点？（不计输赢，有投注就能赚返点）") }}</h3>
          <p>
            {{
              $tex(
                "可获得的返点，等于自身返点与下级返点的差值，如自身返点5，下级返点3，你将能获得下级投注金额2%的返点，如下级投注100元，你将会获得2元。点击下级开户，可查看自身返点，也可为下级设置返点。"
              )
            }}
          </p>
          <h3>{{ $tex("如何为下级开户？（新增邀请码，生成邀请码连接）") }}</h3>
          <p>
            {{
              $tex(
                "点击推广链接，先为您的下级设置返点，设置成功后会生成一条邀请码，将邀请码发送给您的下级注册，注册后他就是您的下级，点击会员管理，就能查看他注册的账号；如果您为下级设置的是代理类型的账号，那么您的下级就能继续发展下级；"
              )
            }}
          </p>
          <h3>{{ $tex("返点何时结算？") }}</h3>
          <p>
            {{
              $tex(
                "不是月结也不是日结，是现结！您的下级每次下注，您的账户即可获取返点佣金，可随时提现，返点佣金可在您的会员账户里面查看。"
              )
            }}
          </p>
          <h3>{{ $tex("温馨提示") }}：</h3>
          <i18n
            path="尊敬的 {name}用户，您当前的返点等级为: {groupRebate}%（{groupName}奖金组）;"
            tag="p"
          >
            <template slot="name">
              <span>{{ user.userCode }}</span>
            </template>
            <template slot="groupRebate">
              <span>{{ (user.bonusGroupRebate * 100).toFixed(1) }}</span>
            </template>
            <template slot="groupName">
              <span>{{ user.bonusGroupName }}</span>
            </template>
          </i18n>
          <p>{{ $tex("1. 返点佣金比例 = 您的返点等级 - 下级返点等级;") }}</p>
          <p>
            {{
              $tex(
                "2. （可赚佣金 = 所有下级代理和会员的投注总额 X 返点佣金比例）"
              )
            }}
          </p>
          <P>{{
            $tex(
              "3. 返点不同赔率也不同，返点越低，赔率就越低，建议为下级设置的返点不要过低；可在代理报表、投注明细、交易明细查看下级代理充值投注详情；建议开设的下级也是代理类型，无论发展了几级，您都能获得返点。（六合彩为固定赔率，不参与返点计算。第三方游戏不参与此形式的返佣计算。）"
            )
          }}</P>
          <p>
            {{
              $tex(
                "4. 假如您拥有10个线下会员，平均每人总存款金额10万元，平均每人实际投注金额达到50万元，若您设置抽下级2%返佣，您当日所获得的佣金为：（500000×10×2%）=100000元，因此，月收入轻松超百万不再是梦）"
              )
            }}
          </p>
        </div>
      </template>
      <div class="content description-tpl" v-html="agentDesc"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      tab: "one",
      tabNav: [{ label: "one", name: this.$tex("代理中心") }],
    };
  },
  computed: {
    ...mapGetters(["isInternational", "agentDesc"]),
    user() {
      return this.$store.state.user;
    },
  },
  created() {
    this.$store.dispatch("fetchAgentDesc");
  },
};
</script>

<style lang="less">
.description {
  color: #282828;
  .tab {
    height: 41px;
    font-size: 16px;
    /* border-bottom: 2px solid @common-border-color; */
    ul {
      li {
        float: left;
        height: 41px;
        line-height: 40px;
        padding: 0 25px;
        border-bottom: 2px solid transparent;
        &.active {
          /*  color: @primary-color;
                    border-bottom-color: @primary-color; */
        }
      }
    }
  }
  .content-wrap {
    padding: 14px;
    .top-img {
      width: 730px;
      height: 178px;
      margin: 0 auto;
      background: url("/static/images/agency-desc.png") no-repeat;
      &.en {
        background: url("/static/images/agency-desc-en.png") no-repeat;
      }
    }
    .content {
      // padding-top: 25px;
      font-size: 14px;
      width: 100%;
      p {
        width: 730px;
        line-height: 26px;
        word-wrap: break-word;
        word-break: normal;
      }
      h3 {
        line-height: 30px;
        margin-top: 9px;
        /*    color: @primary-color; */
        font-size: 18px;
        font-weight: normal;
      }
    }
  }
}
</style>
