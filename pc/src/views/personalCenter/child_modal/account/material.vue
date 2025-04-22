<template>
  <div class="material">
    <div class="accont-info">
      <div class="lf account-logo" @click="showStarImg">
        <template v-if="user && user.imgUrl">
          <img :src="user.imgUrl" class="img" />
        </template>
        <template v-else-if="user && !user.imeUrl">
          <img src="/static/images/account.png" />
        </template>
      </div>
      <div class="lf contact-method contact-way">
        <ul>
          <li>
            <span class="gray">{{ $tex("昵称") }} :</span>
            <span v-if="!newNickName">
              <span class="font-black">{{ user.nickName }}</span>
              <span
                class="font-red"
                style="margin-left:3px;"
                v-if="!user.nickName"
                @click="newNickName = true"
                >{{ $tex("添加昵称") }}</span
              >
              <i
                v-else
                class="iconfont icon-xiugai"
                @click="newNickName = true"
              ></i>
            </span>
            <span v-if="newNickName" class="modify ">
              <span class="input-cl">
                <Input
                  type="text"
                  size="small"
                  v-model="nickName"
                  :placeholder="$tex('请输入昵称')"
                ></Input>
              </span>
              <span class="opera-icon commit" @click="setNick">
                &nbsp;
                <Icon type="checkmark-circled" color="#45b46a" size="18"></Icon>
              </span>
              <span class="opera-icon cancel" @click="newNickName = false">
                &nbsp;
                <Icon type="close-circled" color="#ff0000" size="18"></Icon>
              </span>
            </span>
          </li>
          <li>
            <span class="gray">{{ $tex("账号") }} :</span>
            <span class="font-black"> {{ user.userCode }}</span>
          </li>
          <li v-if="sysApiPhoneOpen">
            <span class="gray">{{ $tex("手机号码") }} :</span>
            <!--            <span-->
            <!--              v-if="phone"-->
            <!--              class="modify"-->
            <!--            >-->
            <!--            </span>-->
            <span>
              <span class="font-black">
                <template v-if="hasPermission('element.areaCode')"
                  >+{{ userAreaCode }}</template
                >{{ userPhone }}
              </span>
              <span
                class="font-red"
                :class="[
                  userPhone ? 'font-phone' : '',
                  user.userType === '09' ? 'disabled' : '',
                ]"
                @click="modifyPhoneNum"
                >&nbsp;{{
                  userPhone ? $tex("修改请联系客服") : $tex("绑定手机")
                }}</span
              >
            </span>
          </li>
          <li v-if="user.userType !== 10">
            <span class="gray">{{ $tex("代理返点") }} :</span>
            <span class="modify"></span>
            <span
              >{{ (proxyInfo.bonusGroupRebate * 100).toFixed(1) }}%({{
                proxyInfo.bonusGroupName
              }})</span
            >
          </li>
          <li>
            <span class="gray">{{ $tex("会员等级") }} :</span>
            <img :src="proxyInfo.userLevelIcon" alt="" width="20" height="22" />
          </li>
          <li class="email-wrap">
            <span class="gray">{{ $tex("邮箱账号") }} :</span>
            <span v-if="email" class="modify">
              <span class="input-cl">
                <Input
                  type="text"
                  size="small"
                  v-model="user.emailInfo"
                  :placeholder="$tex('请输入邮箱地址')"
                ></Input>
              </span>
              <span class="opera-icon commit" @click="setUser('email')">
                &nbsp;
                <Icon type="checkmark-circled" color="#45b46a" size="18"></Icon>
              </span>
              <span class="opera-icon cancel" @click="email = false">
                &nbsp;
                <Icon type="close-circled" color="#ff0000" size="18"></Icon>
              </span>
            </span>
            <span v-if="!email">
              <span class="font-black">{{ user.email }}</span>
              <span
                class="font-red"
                :class="[user.userType === '09' ? 'disabled' : '']"
                @click="
                  user.userType === '09' ? (email = false) : (email = true)
                "
                >&nbsp;{{ user.email ? $tex("修改") : $tex("绑定邮箱") }}</span
              >
            </span>
          </li>
        </ul>
      </div>
    </div>
    <!-- 个人信息结束 -->
    <div class="balance">
      <ul>
        <li>
          <span>{{ $tex("账号余额") }}</span>
          <span v-if="hasPermission('element.coin')" class="balance-rate">
            ≈ {{ localBalance }}{{ sysExchangeInfo.scurIcon }}
            <Icon
              type="ios-loop-strong"
              class="animate__animated animate__infinite"
              :class="{
                animate__rotate: turnRoundBalance,
              }"
              @click.native="refreshBalance"
            ></Icon>
          </span>
        </li>
        <li v-if="user.userType !== '09'" class="sign-in">
          <span class="txt">{{ $tex("签到") }}</span>
          <span class="tip" @click="showSignIn = true"
            ><i class="iconfont icon-bangzhu"></i
            ><i class="desc">{{ $tex("签到说明") }}</i></span
          >
        </li>
        <li class="money">
          <span>
            <strong
              >{{ user.balance | keepDecimalOf2 }}
              <span v-if="hasPermission('element.unit')">{{
                $tex("元")
              }}</span></strong
            >
          </span>
          <span v-if="user && user.userType !== '09' && user.userType !== '08'">
            <Button type="primary" class="deposit" @click="widthDraw">{{
              $tex("提现")
            }}</Button>
            <Button
              :type="hasAuth ? 'warning' : 'primary'"
              class="recharge"
              @click="recharge"
              >{{ $tex("充值") }}</Button
            >
          </span>
        </li>
        <li v-if="user && user.userType !== '09'">
          <!-- <span>已连续签到 -->
          <div class="progress-wrap">
            <strong
              v-if="proxyInfo.experienceNext || proxyInfo.experienceNext === 0"
              >{{
                `${proxyInfo.experienceValue}/${proxyInfo.experienceNext}`
              }}</strong
            >
            <Progress :percent="experProgress" hide-info />
          </div>
          <!-- 天</span> -->
          <span
            class="sign"
            @click="goSign"
            v-show="!proxyInfo.signFlag && user.userType !== '09'"
          >
            <span>{{ $tex("立即签到") }}</span>
            <i></i>
          </span>
          <span class="sign issign" v-show="proxyInfo.signFlag">
            <span>{{ $tex("已签到{num}天", { num: proxyInfo.signDay }) }}</span>
            <i class="sign-icon"></i>
          </span>
        </li>
      </ul>
      <div class="clr"></div>
    </div>
    <div v-if="hasPermission('personalCenter.loginHistory')" class="history">
      <h5>{{ $tex("登录历史") }}</h5>
      <Table
        :columns="columns"
        :data="historyList"
        stripe
        height="216"
        style="border:1px solid #e2e2e2;"
      ></Table>
    </div>
    <!-- 设置用户头像的模态框 -->
    <modal
      claName="starImges-warp"
      :modalShow="hasAvatar"
      :title="$tex('修改头像')"
      :width="469"
      @btn-cancel="(hasAvatar = false), (orderNum = null)"
      :noText="$tex('取消')"
      :okText="$tex('确定')"
      :maskClosable="true"
      @btn-ok="choiceAvatar"
    >
      <div slot="content" ref="starImges" style="overflow-y: scroll;">
        <ul>
          <li v-for="(img, idx) in starImages" :key="img.orderNum">
            <img
              :src="img.netUrl"
              :class="[orderNum === idx ? 'active' : '']"
              @click="orderNum = idx"
            />
          </li>
        </ul>
      </div>
    </modal>
    <!-- 签到说明 -->
    <modal
      :modalShow="showSignIn"
      :title="$tex('签到说明')"
      :width="440"
      :maskClosable="true"
      :hasNoBtn="false"
      @btn-cancel="showSignIn = false"
      @btn-ok="showSignIn = false"
    >
      <div slot="content">
        <template v-if="isInternational">
          {{
            $tex(
              "每天签到累加{num1}点经验值，如第一天签到加{num2}点经验，第二天加{num3}点经验值，第三天加{num4}点，以此类推，中间断签，重新从{num5}点开始计算；签到每日获得经验值的上限是{num6}点。",
              {
                num1: 1,
                num2: 1,
                num3: 2,
                num4: 3,
                num5: 1,
                num6: 6,
              }
            )
          }}
        </template>
        <template v-else>
          {{
            $tex(
              "每天签到累加{num1}点经验值，如第一天签到加{num2}点经验，第二天加{num3}点经验值，第三天加{num4}点，以此类推，中间断签，重新从{num5}点开始计算；签到每日获得经验值的上限是{num6}点。",
              {
                num1: 5,
                num2: 5,
                num3: 10,
                num4: 15,
                num5: 5,
                num6: 30,
              }
            )
          }}
        </template>
      </div>
    </modal>
    <phone-bind-dialog v-model="showBindPhoneNum" type="2"></phone-bind-dialog>
  </div>
</template>

<script>
import numeral from "numeral";
import modal from "@/components/modal.vue";
import PhoneBindDialog from "@/components/PhoneBindDialog";
import { mapGetters } from "vuex";
import { hasPermission } from "@/utils/authority-utils";
import { convert2LocalDateTime } from "@/filters";

export default {
  components: { modal, PhoneBindDialog },
  data() {
    return {
      showSignIn: false, //签到说明flag
      orderNum: null, //激活了
      hasAvatar: false, //显示修改头像界面
      email: false,
      phone: "",
      newNickName: false,
      historyList: [],
      proxyInfo: {},
      columns: [
        {
          title: this.$tex("登录时间"),
          key: "time",
          width: 387,
          render: (h, params) => {
            return h("span", params.row.time);
          },
        },
        {
          title: this.$tex("登录地区"),
          key: "loginAddress",
          width: 346,
          render: (h, params) => {
            return h(
              "span",
              params.row.loginAddress
                ? params.row.loginAddress
                : this.$tex("不详")
            );
          },
        },
      ],
      starImages: [],
      showBindPhoneNum: false,
      nickName: "",
      hasEditNickName: false,
      turnRoundBalance: false,
    };
  },
  computed: {
    ...mapGetters([
      "user",
      "sysApiPhoneOpen",
      "isInternational",
      "userAreaCode",
      "sysExchangeInfo",
    ]),
    experProgress() {
      let experienceValue =
        this.proxyInfo.experienceValue - this.proxyInfo.experienceNext > 0
          ? this.proxyInfo.experienceNext
          : this.proxyInfo.experienceValue;
      return Math.round(
        (experienceValue / this.proxyInfo.experienceNext) * 100
      );
    },
    wmInstance() {
      return this.$store.state.wmInstance;
    },
    userPhone() {
      let phone = this.user.phone;
      if (phone) {
        phone = phone.replace(phone.slice(3, 7), "****");
      }
      return phone;
    },
    hasAuth() {
      return this.user.userType === "00" || this.user.userType === "10"
        ? true
        : false;
    },
    localBalance() {
      return +numeral(this.user.balance)
        .divide(this.sysExchangeInfo.exchangeRate || 1)
        .format("0.00", Math.floor);
    },
  },
  methods: {
    hasPermission,
    /**
     * 设置昵称
     */
    refreshBalance() {
      if (this.turnRoundBalance) {
        return;
      }
      this.turnRoundBalance = true;
      this.$http
        .post("/api/v2/user/balanceAdnSign", {}, { userId: true, unenc: true })
        .then((response) => {
          if (response.data.code !== 0) return;
          let { balance, levelId } = response.data.data;
          let user = Object.assign({}, this.user, {
            balance: balance,
            levelId: levelId,
          });
          this.$store.commit("getUser", user);
          this.turnRoundBalance = false;
        });
    },
    setNick() {
      if (this.hasEditNickName) return;
      const nickName = (this.nickName + "").trim();
      const handlerName = nickName.replace(/[^\x00-\xff]/g, "aa");

      if (!nickName || nickName.length < 1) {
        this.$Message.error(this.$tex("请输入昵称！"));
        return;
      } else if (nickName === this.user.nickName) {
        this.$Message.error(this.$tex("修改前后的昵称相同"));
        return;
      } else {
        if (hasPermission("validator.chinese")) {
          if (
            handlerName.length > 16 ||
            !/^[A-Za-z0-9\u4e00-\u9fa5]+$/.test(nickName)
          ) {
            this.$Message.error(
              this.$tex("最多输入{num1}个汉字或者{num2}个字母, 数字", {
                num1: 8,
                num2: 16,
              })
            );
            return;
          }
        } else {
          if (
            /[.'"\\\-?\[\]{}|,:;<>&=#!@$%^*_\/+！＠＃＄％︿＆＊（）＿＋／？’＂｜［］｛｝。，＞＜]/.test(
              nickName
            )
          ) {
            return this.$Message.error(this.$tex("请输入有效字符"));
          }
          if (handlerName.length > 16) {
            return this.$Message.error(
              this.$tex("请输入{min}-{max}位的字符", {
                min: 1,
                max: 16,
              })
            );
          }
        }
      }
      this.hasEditNickName = true;
      this.$http
        .post(
          "/api/v2/user/updateNickName",
          { nickName: nickName },
          { userId: true }
        )
        .then((res) => {
          this.hasEditNickName = false;
          if (res.data.code !== 0) return;
          this.newNickName = false;
          this.$Message.success(this.$tex("修改昵称成功"));
          this.$set(this.user, "nickName", nickName);
          localStorage.setItem("user", JSON.stringify(this.user));
          this.$store.commit("getUser", this.user);
        });
    },
    /**
     * 绑定或修改手机号码
     */
    modifyPhoneNum() {
      if (this.user.phone || this.user.userType === "09") return;
      this.showBindPhoneNum = true;
    },
    choiceAvatar() {
      //提交选择的用户头像
      let avatarUrl = "";
      if (this.orderNum === null) {
        this.$Message.warning({
          content: this.$tex("您还没有选择头像"),
          duration: 2,
        });
        return;
      }
      if (this.orderNum !== null) {
        avatarUrl = this.starImages[this.orderNum].netUrl;
      }
      this.$http
        .post(
          "/api/v2/user/updateUserImg",
          { imgUrl: avatarUrl },
          { userId: true }
        )
        .then((response) => {
          if (response.data.code !== 0) return;
          this.hasAvatar = false;
          this.user.imgUrl = avatarUrl;
          localStorage.setItem("user", JSON.stringify(this.user));
          this.$store.commit("getUser", this.user);
          this.$Message.success({
            content: this.$tex("修改头像成功"),
            duration: 3,
          });
        });
    },
    showStarImg() {
      //获取头像列表
      this.$http
        .post("/api/v2/cms/headImg", "", { userId: true, unenc: true })
        .then((response) => {
          if (response.data.code !== 0) return;
          this.starImages = response.data.data;
        });
      this.hasAvatar = true;
    },
    goSign() {
      if (this.$_orderSubmitFlag) {
        return;
      }
      this.$_orderSubmitFlag = true;
      //签到
      this.$http
        .post("/api/v2/user/sign", "", { userId: true })
        .then((response) => {
          this.$_orderSubmitFlag = false;
          if (response.data.code !== 0) return;
          this.proxyInfo.signFlag = true;
          let data = response.data.data;
          this.proxyInfo.experienceNext = data.experienceNext;
          this.proxyInfo.experienceValue = data.experienceValue;
          this.proxyInfo.signDay = data.signDay;
          this.$Message.success(response.data.msg);
        })
        .catch(() => {
          this.$_orderSubmitFlag = false;
        });
    },
    widthDraw() {
      //提现
      if (!this.user.realName && this.$store.getters.sysRealName == 1) {
        this.$emit("realNameReg", true);
      } else {
        this.$router.push({
          name: "personalCenter",
          params: { id: "withdraw" },
        });
      }
    },
    recharge() {
      //充值
      this.$router.push({ name: "personalCenter", params: { id: "recharge" } });
    },
    setUser(type) {
      this.email = false;
      if (
        !/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(
          this.user.emailInfo
        )
      ) {
        this.$Message.error(this.$tex("邮箱地址格式错误"));
        return;
      }
      this.email = false;
      this.$http
        .post(
          "/api/v2/user/updateEmail",
          { email: this.user.emailInfo },
          { userId: true }
        )
        .then((response) => {
          if (response.data.code != 0) return;
          this.$set(this.user, "email", this.user.emailInfo);
          localStorage.setItem("user", JSON.stringify(this.user));
          this[type] = false;
        });
    },
  },
  created() {
    this.$emit("handler-spin", true);
    this.$http
      .post("/api/v2/user/balanceAdnSign", "", { userId: true, unenc: true })
      .then((response) => {
        //获取签到信息
        this.$emit("handler-spin", false);
        if (response.data.code !== 0) return;
        this.proxyInfo = response.data.data;
        let phone = this.proxyInfo.phone;
        let nickName = this.proxyInfo.nickName;
        this.user.phone = phone;
        this.user.nickName = nickName;
        this.user.levelName = this.proxyInfo.levelName;
        this.user.userLevelIcon = this.proxyInfo.userLevelIcon;
        this.user.realName = this.proxyInfo.realName;
        this.user.imgUrl = this.proxyInfo.imgUrl;
        this.user.userLevel = this.proxyInfo.levelId;
        localStorage.setItem("user", JSON.stringify(this.user));
        this.$store.commit("getUser", this.user);
      });
    this.$http
      .post("/api/v2/user/findUserLoginLog", "", { userId: true, unenc: true })
      .then((response) => {
        if (response.data.code !== 0) return;
        this.historyList = response.data.data.slice(0, 10);
        this.historyList.forEach((item) => {
          item.time = convert2LocalDateTime(item.loginTime);
        });
      });
  },
  mounted() {
    this.$refs.starImges.style.maxHeight = window.innerHeight * 0.7 + "px";
  },
};
</script>

<style lang="less" scoped>
@import "~@/mixins/captcha.less";

@deep: ~">>>";
@{deep} .geetest_holder.geetest_wind {
  width: 224px !important;
  min-width: 100px !important;
}

@{deep} .geetest_holder.geetest_wind .geetest_radar_tip.geetest_multi_line {
  line-height: 44px !important;
}

.valida {
  margin-bottom: 10px;
}

// #captcha #text,
// #captcha #wait {
//   width: 224px !important;
// }
.material {
  margin-bottom: 30px;
}

.material .accont-info {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 12px;
}

.material .accont-info img {
  width: 82px;
  height: 82px;
}

.material .accont-info .contact-method {
  font-size: 0;

  ul {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }

  .iconfont {
    margin-left: 7px;
    /*     color: #be1204; */
    font-size: 14px;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }

  .email-wrap {
    .font-red:not(.disabled) {
      &:hover {
        opacity: 0.8;
      }
    }
  }
}

.material .accont-info .contact-method img {
  display: inline-block;
  vertical-align: top;
  width: 70px;
  height: 16px;
  object-fit: contain;
  margin-left: 2px;
}

.material .accont-info .lf li {
  display: inline-block;
  font-size: 12px;
  padding-left: 2px;
}

.material .accont-info .lf li .email-wrap {
  position: relative;

  .modify {
    position: absolute;
  }
}

.material .accont-info > div {
  display: inline-block;
  height: 100%;
  padding: 18px 0 18px 22px;
}

.material .accont-info > div.last {
  left: 466px;
}

.material .accont-info .lf li {
}

.material .accont-info .account-logo {
  display: inline-block;
  padding: 0;
  margin-left: 7px;
  cursor: pointer;
}

.material .accont-info .account-logo img {
  border-radius: 50%;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  -ms-border-radius: 50%;
  -o-border-radius: 50%;
}

.material .accont-info .account-logo .material .accont-info > div li {
}

.material .accont-info > div.contact-method li {
  width: 33.333333%;
  display: flex;
  margin-bottom: 10px;
}

.material .accont-info .material .contact-method .ivu-input {
  height: 22px;
}

.material .accont-info > div li span {
  color: #313131;
}

.material .accont-info > div li span.font-red {
  color: #be1204;
}

.material .accont-info > div li span.gray {
  color: #282828;
  white-space: nowrap;
}

.material .accont-info .font-black {
  color: #333;
  max-width: 120px;
  margin-left: 3px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.material .accont-info .contact-way .font-phone {
  cursor: inherit;
  padding: 0 2px;
}

.material .accont-info .font-red {
  /*  color: @primary-color; */
  cursor: pointer;

  &:hover:not(.disabled) {
    opacity: 0.8;
  }

  &.disabled {
    cursor: not-allowed;
    color: #e2e2e2;
  }
}

.material .accont-info .modify {
  height: 22px;
  display: flex;
  align-items: center;
}

.material .accont-info .modify .input-cl {
  display: flex;
  flex: 1;
  padding: 0 4px;
  .ivu-input-wrapper {
    vertical-align: -3px;
  }
}

.material .accont-info .modify .input-cl input {
  width: 100%;
  border: 1px solid #eee;
}
.material .accont-info .modify .opera-icon {
  display: flex;
  align-items: center;
}
.material .accont-info .modify .opera-icon .ivu-icon {
  cursor: pointer;
  float: left;
}

.material .balance {
  /*   border-top: 1px solid @common-border-color;
        border-left: 1px solid @common-border-color; */
  margin-top: 34px;
}

.material .balance li {
  line-height: 44px;
  float: left;
  width: 50%;
  /*   border-right: 1px solid @common-border-color;
        border-bottom: 1px solid @common-border-color; */
  padding: 0 8px 0 24px;
  font-size: 14px;
  color: #313131;

  &:nth-child(4) {
    padding-left: 7px;
    min-height: 47px;
  }

  .progress-wrap {
    float: left;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    width: 210px;
    height: 28px;
    margin-top: 8px;
    line-height: 14px;
    margin-bottom: 10px;
    strong {
      font-size: 14px;
      font-weight: normal;
    }
  }

  &.sign-in {
    .txt {
      float: left;
    }

    .tip {
      float: right;
      color: #ff7614;
      cursor: pointer;
      font-size: 12px;
    }

    .desc {
      position: relative;
      top: -2px;

      &:hover {
        opacity: 0.8;
      }
    }

    .iconfont {
      margin-right: 4px;
      font-size: 17px;
    }
  }

  .ivu-progress {
    @{deep}.ivu-progress-bg {
      background-color: #fc7716;
    }

    @{deep}.ivu-progress-inner {
      background-color: #ebebeb;
    }
  }
}

.material .balance li strong {
  /*   color: @personal-center-strong-color; */
  font-size: 20px;
}
.money {
  display: flex;
  white-space: nowrap;
  .recharge {
    margin-bottom: 8px;
  }
}
.material .balance .money button {
  float: right;
  line-height: 16px;
  margin-left: 10px;
  color: #fff;
  padding: 5px 15px;
  margin-top: 8px;
}

.material .balance .sign {
  float: right;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 132px;
  line-height: 1;
  padding: 4px 6px;
  border-radius: 2px;
  margin-top: 8px;
  font-size: 0;
  text-align: center;
  cursor: pointer;
  margin-bottom: 8px;
}

.material .balance .sign:hover {
  /*  color: @primary-color; */
}

.material .balance .sign span {
  font-size: 14px;
  margin-right: 10px;
  flex: 1;
}

.material .balance .sign i {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 22px;
  background: url("~@/assets/images/icon.png") no-repeat -307px -548px;
}

.material .balance .issign {
  border: none;
  border-radius: 4px;
  background: #ff7614;
  color: #fff;
  cursor: inherit;
}

.material .balance .sign.issign:hover {
  color: #fff;
}

.material .balance .sign.issign span {
  display: inline-block;
  vertical-align: middle;
  width: 98px;
  max-width: 98px;
  margin-right: 0;
  word-break: break-all;
}

.material .balance .issign .sign-icon {
  height: 20px;
  background-position: -280px -549px;
}

.material .history h5 {
  height: 38px;
  line-height: 36px;
  /*   border-bottom: 2px solid @common-border-color; */
  margin: 12px 0 16px 0;
  padding-left: 28px;
  color: #313131;
  font-size: 16px;
  font-weight: normal;
}
.ivu-icon-ios-loop-strong {
  cursor: pointer;
}
.balance-rate {
  float: right;
  color: #ff7614;
}
</style>
<style scoped>
.material .history >>> .ivu-table-header th,
.material .history >>> .ivu-table {
  font-size: 12px !important;
}

/* 修改头像弹框 */
.v-transfer-dom >>> .starImges-warp .ivu-modal-body {
  padding: 0;
}

.v-transfer-dom >>> .starImges-warp .ivu-modal-body ul {
  display: flex;
  width: 100%;
  padding: 14px 2px 23px;
  -webkit-display: flex;
  -moz-display: flex;
  -ms-display: flex;
  -o-display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.v-transfer-dom >>> .starImges-warp .ivu-modal-body li {
  width: 62px;
  height: 62px;
  margin: 8px 12px 16px;
  justify-content: flex-start;
  cursor: pointer;
}

.v-transfer-dom >>> .starImges-warp .ivu-modal-body li img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  -webkit-border-radius: 50%;
  border: 2px solid transparent;
  margin-left: 2px;
}

.v-transfer-dom >>> .starImges-warp .ivu-modal-body li img.active {
  border-color: #ff7614;
}

.v-transfer-dom >>> .starImges-warp .ivu-modal-footer {
  padding-bottom: 20px;
}

/* 修改头像弹框结束 */
</style>
