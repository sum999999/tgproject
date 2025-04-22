<!--
 *  ┌─────────────────────────────────────────────────────────────┐
 *  │┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐│
 *  ││Esc│!1 │@2 │#3 │$4 │%5 │^6 │&7 │*8 │(9 │)0 │_- │+= │|\ │`~ ││
 *  │├───┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴───┤│
 *  ││ Tab │ Q │ W │ E │ R │ T │ Y │ U │ I │ O │ P │{[ │}] │ BS  ││
 *  │├─────┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴─────┤│
 *  ││ Ctrl │ A │ S │ D │ F │ G │ H │ J │ K │ L │: ;│" '│ Enter  ││
 *  │├──────┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴────┬───┤│
 *  ││ Shift  │ Z │ X │ C │ V │ B │ N │ M │< ,│> .│? /│Shift │Fn ││
 *  │└─────┬──┴┬──┴──┬┴───┴───┴───┴───┴───┴──┬┴───┴┬──┴┬─────┴───┘│
 *  │      │Fn │ Alt │         Space         │ Alt │Win│   HHKB   │
 *  │      └───┴─────┴───────────────────────┴─────┴───┘          │
 *  └─────────────────────────────────────────────────────────────┘
 * 
 * @Author: 
 * @Date: 2023-12-29 15:26:24
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-07-04 10:19:19
 * @FilePath: \pc\src\views\personalCenter\child_modal\account\currencyAccount.vue
 * @Description: 绑定数字货币
 -->

<template>
  <div class="currency-account">
    <div v-if="showPage">
      <div class="bank-card-add-list">
        <div
          v-for="(bank, index) in lotUserDigiccyList"
          :key="index"
          class="bank-card-add-list__item bank-card-bank"
          :class="{
            active: curIndex === index,
          }"
          @click="onBankCardSelected(index)"
        >
          <img
            class="bank-card-add-list__logo"
            src="~@/assets/images/currency.png"
            alt=""
          />
          <Icon type="android-done"></Icon>
          <div class="bank-card-bank__content">
            {{ $tex("货币类型") }}：{{ bank.digiccyName }}
          </div>
        </div>
        <div
          v-if="canAddBankCard"
          class="bank-card-add-list__item bank-card-add"
          @click="onBankAddClick"
        >
          <i class="bank-icon-add"></i>
          <p>{{ $tex("添加") }}</p>
        </div>
      </div>
      <div v-if="cardSelected" class="account-detail-card">
        <div class="account-detail-card__header">
          <div class="account-detail-card__logo">
            <img
              class="account-detail-card__icon-logo"
              src="~@/assets/images/currency.png"
              alt=""
            />
          </div>
        </div>
        <div class="account-detail-card__line"></div>
        <div class="account-detail-card__content">
          <Form
            class="currency-detail-form"
            :label-width="62"
            key="display-form"
          >
            <FormItem
              class="currency-detail-form__item"
              :label="$tex('货币类型')"
            >
              <Input
                v-model="curDigiccy.digiccyName"
                :placeholder="$tex('请输入货币类型')"
                readonly
              ></Input>
            </FormItem>
            <FormItem
              class="currency-detail-form__item"
              :label="$tex('收币地址')"
            >
              <Input
                v-model="curDigiccy.bankNo"
                :placeholder="$tex('请输入收币地址')"
                readonly
              ></Input>
            </FormItem>
          </Form>
        </div>
      </div>
      <div v-if="!cardSelected" class="account-detail-card">
        <div class="account-detail-card__header">
          <div class="account-detail-card__logo">
            <img
              class="account-detail-card__icon-logo"
              src="~@/assets/images/currency.png"
              alt=""
            />
          </div>
        </div>
        <div class="account-detail-card__line"></div>
        <div class="account-detail-card__content">
          <Form
            :model="currencyFormValidate"
            ref="currencyForm"
            :rules="currencyRuleValidate"
            class="currency-detail-form"
            :label-width="62"
            key="submit-form"
          >
            <FormItem
              class="currency-detail-form__item"
              :label="$tex('货币类型')"
              prop="takeFeeDigiccyConfigId"
            >
              <Select
                v-model="currencyFormValidate.takeFeeDigiccyConfigId"
                :placeholder="$tex('请选择货币类型')"
              >
                <Option
                  v-for="digiccy in digiccyInfoList"
                  :value="digiccy.takeFeeDigiccyConfigId"
                  :key="digiccy.takeFeeDigiccyConfigId"
                  >{{ digiccy.digiccyName }}
                </Option>
              </Select>
            </FormItem>
            <FormItem
              class="currency-detail-form__item"
              :label="$tex('收币地址')"
              prop="adderss"
            >
              <Input
                v-model="currencyFormValidate.adderss"
                :placeholder="$tex('请输入收币地址')"
              ></Input>
            </FormItem>
            <p
              v-if="showBankAuth && $store.getters.sysRealName == 1"
              class="bank-auth-tips"
            >
              {{ $tex("账户未实名") }}，{{ $tex("请前往")
              }}<span class="bank-auth-tips--link" @click="onAuthClick">{{
                $tex("实名认证")
              }}</span>
            </p>
          </Form>
        </div>
      </div>
      <div v-if="!cardSelected" class="uploadFiles">
        <div class="aliPayCode">
          <img class="img" v-if="imgUrl" :src="imgUrl" alt="" />
        </div>
        <div class="create">
          <input
            type="file"
            multiple="multiple"
            accept="image/png,image/gif,image/jpeg"
            @change="onImgChange"
          />
        </div>
        <span v-if="showUploadButton" class="gatheringQr">{{
          $tex("点击上传收款码")
        }}</span>
        <span v-else class="gatheringQr">{{ $tex("收款码已上传") }}</span>
      </div>
      <div class="currency-account-tips">
        <div>{{ $tex("注：") }}</div>
        <div>
          {{ $tex("请绑定大型商业银行，如需修改，请你联系在线客服；") }}<br />
          {{ $tex("解绑数字货币/微信/支付宝请联系在线客服") }}
        </div>
      </div>
      <button
        v-if="cardSelected && sysApiPhoneOpen"
        type="button"
        class="ivu-btn ivu-btn-warning currency-account-button"
        @click="onUnBindClick"
      >
        <i class="ivu-icon iconfont icon-bank"></i
        ><span>{{ $tex("解绑数字货币") }}</span>
      </button>
      <button
        v-if="!cardSelected"
        type="button"
        class="ivu-btn ivu-btn-primary currency-account-button"
        @click="onBindClick"
      >
        <i class="ivu-icon iconfont icon-bank"></i
        ><span>{{ $tex("绑定数字货币") }}</span>
      </button>
    </div>
    <phone-bind-dialog
      v-model="showBindFirstDialog"
      type="2"
      @success="onPhoneFirstSuccess"
      @cancel="onPhoneFirstCancel"
    ></phone-bind-dialog>
    <phone-valid-dialog
      v-model="showValidDialog"
      :title="$tex('验证信息')"
      :ok-text="$tex('验证')"
      type="9"
      :submit="verifyDigiccy"
      @success="onPhoneBindSuccess"
      @cancel="onPhoneBindCancel"
    ></phone-valid-dialog>
    <phone-valid-dialog
      v-model="showUnBindValidDialog"
      :title="$tex('验证信息')"
      :ok-text="$tex('验证')"
      type="9"
      :submit="unBindBank"
      @success="onPhoneUnBindSuccess"
      @cancel="onPhoneUnBindCancel"
    ></phone-valid-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import modal from "@/components/modal";
import PhoneValidDialog from "@/components/PhoneValidDialog";
import PhoneBindDialog from "@/components/PhoneBindDialog";
import { verifyDigiccy } from "@/api/user";

export default {
  name: "currencyAccount",
  components: {
    modal,
    PhoneValidDialog,
    PhoneBindDialog,
  },
  props: {
    userBankInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      curIndex: -1,
      showBindFirstDialog: false,
      showValidDialog: false,
      showUnBindValidDialog: false,
      currencyFormValidate: {
        takeFeeDigiccyConfigId: "",
        adderss: "",
      },
      currencyRuleValidate: {
        takeFeeDigiccyConfigId: [
          {
            required: true,
            message: this.$tex("请选择货币类型"),
            trigger: "change",
          },
        ],
        adderss: [
          {
            required: true,
            message: this.$tex("请输入收币地址"),
            trigger: "blur",
          },
        ],
      },
      validLoading: false,
      bindLoading: false,
      imgUrl: "",
      showUploadButton: true,
      uploadFiles: [],
      isPhoneBindSuccess: false,
      showPopups: "0",
      businesses: "",
    };
  },
  computed: {
    ...mapGetters(["user", "sysApiPhoneOpen"]),
    isVerifydigiccy() {
      return (
        this.userBankInfo.verifydigiccy === "1" &&
        !this.userBankInfo.lotUserDigiccyList.length
      );
    },
    digiccyInfoList() {
      return this.userBankInfo.digiccyInfoList;
    },
    lotUserDigiccyList() {
      return this.userBankInfo.lotUserDigiccyList || [];
    },
    showUnBindButton() {
      // return !!this.lotUserDigiccyList.length;
      return this.userBankInfo.unBindBank === "1";
    },
    showBankAuth() {
      return !this.user.realName;
    },
    hasPhone() {
      return this.user.phone;
    },
    showPage() {
      if (!this.isVerifydigiccy) {
        return true;
      } else if (this.isVerifydigiccy && this.isPhoneBindSuccess) {
        return true;
      }
      return false;
    },
    curDigiccy() {
      return (
        this.lotUserDigiccyList[this.curIndex] || {
          accountMsg: null,
          accountName: "",
          bankName: "",
          bankNo: "",
          bankNo2: "",
          certNo: null,
          digiccyName: "",
          exchangeRate: 1,
          imgUrl: "",
          openBankName: null,
          status: "1",
          takeFeeDigiccyConfigId: "",
          type: "",
          universalType: null,
          userBankId: "",
          userId: "",
        }
      );
    },
    cardSelected() {
      return this.curIndex !== -1;
    },
    cryptoMaxnum() {
      return this.userBankInfo.cryptoMaxnum || 1;
    },
    canAddBankCard() {
      return this.lotUserDigiccyList.length < this.cryptoMaxnum;
    },
  },
  watch: {
    userBankInfo: {
      deep: true,
      immediate: true,
      handler(info) {
        if (info && info.lotUserDigiccyList) {
          this.switchBankCardView();
        }
      },
    },
  },
  created() {
    this.handleUserBankInfo();
    console.log(this.showUnBindButton);
    this.businessNber();
  },
  methods: {
    // 商户标识
    async businessNber() {
      const { PLATFORM_FLAG } = await this.$store.dispatch("querySystemConfig");
      this.businesses = PLATFORM_FLAG;
    },
    // 是否开启手机验证
    async handleUserBankInfo() {
      let response = await this.$http.post(
        "/api/v2/user/queryLotUserBankInfo",
        "",
        { userId: true }
      );
      this.showPopups = response.data.data.verifydigiccy;
      this.handleAuth();
    },
    onBankAddClick() {
      this.curIndex = -1;
    },
    onBankCardSelected(index) {
      this.curIndex = index;
    },
    switchBankCardView() {
      if (this.lotUserDigiccyList.length) {
        this.curIndex = 0;
      } else {
        this.curIndex = -1;
      }
    },
    handleAuth() {
      if (!this.sysApiPhoneOpen) {
        return (this.isPhoneBindSuccess = true);
      }
      if (!this.hasPhone) {
        this.showBindFirstDialog = this.showPopups === "1" ? true : false;
        // this.showBindFirstDialog = true ;
      } else if (this.isVerifydigiccy) {
        this.showValidDialog = true;
      }
    },
    verifyDigiccy({ smsPhoneCode }) {
      return verifyDigiccy({
        smsPhoneCode,
      });
    },
    async unBindBank({ smsPhoneCode }) {
      const response = await this.$http.post(
        "/api/v2/user/unBindBank",
        {
          type: "1",
          bankId: this.curDigiccy.userBankId,
          smsPhoneCode,
        },
        {
          userId: true,
        }
      );
      if (response.data.code !== 0) return;

      await this.$emit("update");
      this.showUnBindValidDialog = false;
    },
    onPhoneFirstSuccess() {
      this.isPhoneBindSuccess = true;
    },
    onPhoneFirstCancel() {
      this.$emit("jump-base-info");
    },
    onPhoneBindSuccess() {
      this.isPhoneBindSuccess = true;
    },
    onPhoneBindCancel() {
      this.$emit("jump-base-info");
    },
    onPhoneUnBindSuccess() {
      // this.$emit("update");
      this.$emit("jump-base-info");
    },
    onPhoneUnBindCancel() {},
    async onBindClick() {
      if (this.showBankAuth && this.$store.getters.sysRealName == 1) {
        return this.$Message.error(this.$tex("请先实名认证！"));
      }
      const validFlag = await this.$refs["currencyForm"].validate();
      if (!validFlag) {
        return;
      }
      if (this.bindLoading) {
        return;
      }
      this.bindLoading = true;
      if (this.uploadFiles.length) {
        const formData = new FormData();
        formData.append("imagefiles", this.uploadFiles[0].file);
        const systemConfig = await this.$store.dispatch("querySystemConfig");
        formData.append("flag", systemConfig.PLATFORM_FLAG);
        const uploadRes = await this.$http.post(
          "/api/v2/cms/qiniuUpload",
          formData,
          {
            contentType: "multipart/form-data",
            unenc: true,
          }
        );
        if (uploadRes.data.code !== 0) {
          this.bindLoading = false;
          return;
        }
        this.imgUrl = uploadRes.data.data[0].url;
      }
      const response = await this.$http.post(
        "/api/v2/user/bandingBankInfo",
        {
          bankName: "数字货币",
          bankNo: this.currencyFormValidate.adderss,
          accountName: this.user.realName,
          takeFeeDigiccyConfigId: this.currencyFormValidate
            .takeFeeDigiccyConfigId,
          type: "03",
          imgUrl: this.imgUrl,
        },
        { userId: true }
      );
      this.bindLoading = false;
      if (response.data.code !== 0) {
        return;
      }
      this.$emit("update");
    },
    onImgChange() {
      this.uploadFiles = [];
      let target = event.target || event.srcElement;
      let _files = target.files;
      if (!_files || !_files.length) {
        return;
      }
      let size = 0;
      for (let file of this.uploadFiles) {
        size += file.size;
      }
      for (let i = 0; i < _files.length; i++) {
        let file = _files[i];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          if (this.uploadFiles.length >= 5) return;
          size += file.size;
          if (size > 1024 * 1204 * 4) {
            this.$Message.info(this.$tex("图片不能超过{num}M", { num: 4 }));
            return;
          }
          this.uploadFiles = [
            {
              file: file,
              data: this.result,
            },
          ];
        };
      }
      var newsrc = this.getObjectURL(_files[0]);
      this.imgUrl = newsrc;
      this.showUploadButton = false;
    },
    getObjectURL(file) {
      var url = null;
      if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    onAuthClick() {
      this.$emit("jump-bank");
    },
    onUnBindClick() {
      this.showUnBindValidDialog = true;
    },
  },
};
</script>

<style scoped lang="less">
@deep: ~">>>";
.currency-detail-form {
  @{deep} {
    .ivu-form-item-label:before {
      display: none;
    }

    .ivu-form-item-content {
      position: relative;
    }
  }
}

.account-detail-card {
  width: 348px;
  border: 1px solid #f3f3f3;
  box-shadow: 0px 4px 12px 0px #f3f3f3;
  border-radius: 4px;
  margin: auto;
  position: relative;
}

.account-detail-card__header {
  height: 100px;
  line-height: 100px;
  border-bottom: 3px dashed #eee;
  padding-top: 20px;
}

.account-detail-card__logo {
  text-align: center;
}

.account-detail-card__icon-logo {
  float: none;
  width: 44px;
  height: 44px;
  display: inline-block;
}

.account-detail-card__line {
  position: absolute;
  width: 350px;
  left: -2px;
  right: 0;
  overflow: hidden;
  margin-top: -12px;

  &:before {
    content: "";
    float: left;
    margin-left: -12px;
    display: inline-block;
    width: 25px;
    height: 25px;
    border-radius: 100%;
    border: 1px solid #f3f3f3;
    box-shadow: 0px 4px 12px 0px #f3f3f3;
    background-color: #fcfcfc;
  }

  &:after {
    content: "";
    float: right;
    margin-right: -12px;
    display: inline-block;
    width: 25px;
    height: 25px;
    border-radius: 100%;
    border: 1px solid #f3f3f3;
    box-shadow: 0px 4px 12px 0px #f3f3f3;
    background-color: #fcfcfc;
  }
}

.account-detail-card__content {
  margin-top: 30px;
  padding: 0 36px;
}

.currency-account-button {
  display: block;
  height: 44px;
  line-height: 44px !important;
  padding: 0 27px;
  margin: 30px auto 0;

  i {
    font-size: 30px;
    line-height: 44px;
    vertical-align: bottom;
  }

  span {
    font-size: 14px;
    line-height: 44px;
    margin-left: 10px;
    display: inline-block;
  }
}

.currency-account-tips {
  color: #a0a0a0;
  font-size: 12px;
  display: flex;
  justify-content: center;
  margin-top: 26px;
}

.uploadFiles {
  width: 215px;
  height: 215px;
  margin: 20px auto 0;
  position: relative;
  background: url("/static/images/digiccy-qr.png") center center no-repeat;
  background-size: contain;

  .aliPayCode {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    width: 144px;
    height: 144px;
    z-index: 3;

    img {
      width: 100%;
      height: 100%;
      float: initial;
    }
  }

  & > .gatheringQr {
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    text-align: center;
    font-size: 14px;
    bottom: 12px;
    color: #ff9822;
  }

  & > .create {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    width: 144px;
    height: 144px;
    z-index: 10;

    & > input {
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }
}

.bank-auth-tips {
  font-size: 12px;
  padding-bottom: 10px;
}

.bank-auth-tips--link {
  text-decoration: underline;
  color: #ff9822;
  cursor: pointer;
}
.currency-icon-add {
  display: inline-block;
  width: 28px;
  height: 28px;
  background: url("~@/assets/images/bank-add.png") center center no-repeat;
  background-size: contain;
}

.bank-icon-add {
  display: inline-block;
  width: 28px;
  height: 28px;
  background: url("~@/assets/images/bank-add.png") center center no-repeat;
  background-size: contain;
}

.bank-card-add-list {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;

  .bank-card-add-list__item:nth-child(2n + 1) {
    margin-right: 2%;
  }
  .bank-card-add-list__logo {
    width: 48px;
    height: 48px;
    float: none;
    margin-right: 20px;
  }
}

.bank-card-add,
.bank-card-bank {
  border: 1px solid #f3f3f3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  height: 80px;
  width: 48%;
  cursor: pointer;
  margin-bottom: 10px;
  position: relative;
  overflow: hidden;
  box-shadow: 0px 4px 12px 0px #f3f3f3;

  .ivu-icon-android-done {
    display: none;
  }

  &.active {
    border: 1px solid #ec0022;

    .ivu-icon-android-done {
      position: absolute;
      right: 5px;
      bottom: -2px;
      color: #fff;
      z-index: 1;
      font-size: 20px;
      display: inline;
    }

    &:after {
      content: "";
      display: inline-block;
      position: absolute;
      right: 0;
      bottom: 0;
      width: 0;
      height: 0;
      border-bottom: 30px solid #ec0022;
      border-left: 40px solid transparent;
    }
  }

  p {
    margin-top: 6px;
  }
}

.bank-card-bank {
  flex-direction: row;
  padding: 20px;
  color: #333333;

  .ivu-icon-card {
    width: 48px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    padding-right: 20px;
    font-size: 28px;
    color: #d62629;
  }

  p {
    margin-top: 0px;
  }
}

.bank-card-bank__content {
  flex: 1;
}

.bank-card-bank__text {
  color: #999999;
  font-size: 12px;
}

.bank-card-bank__title {
  display: flex;
  justify-content: space-between;
}

.bank-select {
  .bank-select__item {
    display: flex;
    align-items: center;

    img {
      float: none;
      width: 40px;
    }

    span {
      white-space: normal;
      padding-left: 10px;
    }
  }
}
</style>
