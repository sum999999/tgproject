<template>
  <div class="bankAccount">
    <template v-if="hadBind">
      <accountCard>
        <img src="/static/images/zhifubao1.png" alt="" slot="cardImg" />
        <div slot="cardContent">
          <div class="addContent">
            <Form
              :model="card"
              ref="addCard"
              :label-width="80"
              label-position="left"
              :rules="addCardRule"
              v-for="(item, idx) in list"
              :key="idx"
            >
              <FormItem :label="`${$tex('真实姓名')}:`" prop="accountName">
                <Input
                  type="text"
                  :value="item.accountName | formatName"
                  :disabled="!!user.realName"
                ></Input>
              </FormItem>
              <FormItem :label="`${$tex('账    号')}:`" prop="bankNo">
                <Input type="text" :value="item.bankNo | formatBankNo" disabled>
                </Input>
              </FormItem>
              <FormItem :label="`${$tex('状    态')}:`" prop="openBankName">
                <Input
                  type="text"
                  disabled
                  v-if="item.status == 1"
                  :value="$tex('正常')"
                ></Input>
                <Input
                  type="text"
                  disabled
                  v-else
                  :value="$tex('异常')"
                ></Input>
              </FormItem>
              <div class="aliPayQrCode">
                <img :src="item.imgUrl" alt="" />
              </div>
            </Form>
          </div>
        </div>
      </accountCard>
    </template>
    <template v-else>
      <div class="bankAccount-content">
        <Form
          :model="card"
          ref="addCard"
          :label-width="80"
          :rules="addCardRule"
        >
          <FormItem :label="`${$tex('账号')}:`" prop="bankNo">
            <Input
              type="text"
              :placeholder="$tex('请输入您的手机号/账号')"
              :value="card.bankNo"
              :maxlength="19"
              @input="card.bankNo = arguments[0].replace(/\s+/g, '')"
            >
            </Input>
          </FormItem>
          <FormItem :label="`${$tex('真实姓名')}:`" prop="accountName">
            <Input
              type="text"
              :disabled="!!user.realName"
              :value="card.accountName | formatName"
              :placeholder="$tex('请输入您的真实姓名')"
            ></Input>
          </FormItem>
          <div class="uploadFiles">
            <div class="aliPayCode">
              <img class="img" v-if="card.imgUrl" :src="card.imgUrl" alt="" />
            </div>
            <div class="create">
              <input
                type="file"
                accept="image/png,image/gif,image/jpeg"
                @change="addFile"
              />
            </div>
            <span v-if="!hadUpLoadFiles" class="gatheringQr">{{
              $tex("点击上传收款码")
            }}</span>
            <span v-else class="gatheringQr">{{ $tex("收款码已上传") }}</span>
          </div>
        </Form>
      </div>
      <div class="card-submit">
        <div class="addBtn">
          <button
            type="button"
            class="ivu-btn ivu-btn-primary"
            @click="doBanding"
          >
            <i class="ivu-icon icon-zfb"></i
            ><span>{{ $tex("添加支付宝账号") }}</span>
          </button>
        </div>
      </div>
    </template>
    <modal
      :modalShow="bandBankFlag"
      :title="$tex('请先绑定银行卡进行实名认证')"
      @btn-ok="toAddBank"
      @btn-cancel="cancel"
    >
      <div slot="content" style="text-align:center">
        {{
          $tex("您还没有绑定银行卡，暂时无法提现，马上建立专属个人银行账号！")
        }}
      </div>
    </modal>
  </div>
</template>
<script>
import accountCard from "./accountCard";
import modal from "@/components/modal";
import { hasPermission } from "@/utils/authority-utils";

export default {
  components: {
    accountCard,
    modal,
  },
  data() {
    //姓名验证规则
    let addChineseCheck = null;
    if (hasPermission("validator.chinese")) {
      addChineseCheck = (rule, value, callback) => {
        if (!value && this.$store.getters.sysRealName != 1) {
          callback();
          return;
        } else if (!value) {
          callback(new Error(this.$tex("请输入真实姓名")));
        }
        if (!/^[\u4e00-\u9fa5]+((·|•)?[\u4e00-\u9fa5]+)$/.test(value)) {
          callback(
            new Error(
              this.$tex("请输入{min}-{max}位的中文字符", {
                min: 2,
                max: 16,
              })
            )
          );
        } else if (value.length < 2 || value.length > 16) {
          callback(
            new Error(
              this.$tex("请输入{min}-{max}位的中文字符", {
                min: 2,
                max: 16,
              })
            )
          );
        } else {
          callback();
        }
      };
    } else {
      addChineseCheck = (rule, value, callback) => {
        if (!value && this.$store.getters.sysRealName != 1) {
          callback();
          return;
        } else if (!value) {
          callback(new Error(this.$tex("请输入真实姓名")));
        }
        if (
          /[.'"\\\-?\[\]{}|,:;<>&=#!@$%^*_\/+！＠＃＄％︿＆＊（）＿＋／？’＂｜［］｛｝。，＞＜]/.test(
            value
          )
        ) {
          callback(new Error(this.$tex("请输入有效字符")));
        } else if (value.length < 2 || value.length > 16) {
          callback(
            new Error(
              this.$tex("请输入{min}-{max}位的字符", {
                min: 2,
                max: 16,
              })
            )
          );
        } else {
          callback();
        }
      };
    }

    //支付宝账号验证
    const accountCheck = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$tex("请输入支付宝账号")));
      }
      if (
        !/^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/.test(
          value
        ) &&
        !/^1(\d){10}$/.test(value)
      ) {
        callback(new Error(this.$tex("支付宝账号格式为手机号或者邮箱！")));
      }
    };
    //支付宝账号验证
    const imgCheck = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$tex("请输入支付宝账号")));
      }
    };
    //银行名称、开户行验证规则
    let addOPenNameCheck = null;
    if (hasPermission("validator.chinese")) {
      addOPenNameCheck = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$tex("请输入开户行名称")));
        }
        if (!/^[^\u0000-\u00FF]*$/.test(value)) {
          callback(new Error(this.$tex("请输入中文")));
        } else {
          callback();
        }
      };
    } else {
      addOPenNameCheck = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$tex("请输入开户行名称")));
        }
        if (
          /[.'"\\\-?\[\]{}|,:;<>&=#!@$%^*_\/+！＠＃＄％︿＆＊（）＿＋／？’＂｜［］｛｝。，＞＜]/.test(
            value
          )
        ) {
          callback(new Error(this.$tex("请输入有效字符")));
        } else {
          callback();
        }
      };
    }

    const bankNum = (rule, value, callback) => {
      let vm = this;
      let role = /^[0-9]*$/;
      if (!role.test(value)) {
        callback(new Error(this.$tex("只能输入数字")));
      } else {
        this.$http
          .post(
            "/api/v2/user/queryBankFrom",
            { bankNo: value },
            { userId: true, stopDialog: true, unenc: true }
          )
          .then((response) => {
            if (response.data.code !== 0) {
              callback();
              return;
            }
            let data = response.data.data;
            vm.card.bankName = data.bankName;
            callback();
          });
      }
    };
    return {
      hadBind: false,
      isSubmit: true,
      hadUpLoadFiles: false,
      currentAccount: {},
      card: {
        accountName: "",
        bankName: "支付宝",
        bankNo: "",
        type: "02",
      },
      uploadFiles: [],
      realName: "",
      list: [],
      isUpload: true,
      isLoading: true,
      bandBankFlag: false,
      //卡号验证
      addCardRule: {
        accountName: [
          //   { message: this.$tex("真实姓名不能为空"), trigger: "blur" },
          { validator: addChineseCheck, trigger: "blur" },
        ],
        bankNo: [
          { message: this.$tex("支付宝账号不能为空"), trigger: "blur" },
          { validator: accountCheck, trigger: "blur" },
        ],
      },
    };
  },
  filters: {
    formatBankNo(bankNo) {
      return (
        bankNo.slice(0, 4) +
        bankNo.slice(4, bankNo.length - 4).replace(/\d/g, "*") +
        bankNo.slice(bankNo.length - 4)
      );
    },
    formatName(name) {
      let newStr;
      if (name.length === 2) {
        newStr = name.substr(0, 1) + "*";
      } else if (name.length > 2) {
        var char = "";
        for (var i = 0, len = name.length - 2; i < len; i++) {
          char += "*";
        }
        newStr = name.substr(0, 1) + char + name.substr(-1, 1);
      } else {
        newStr = name;
      }
      return newStr;
    },
  },
  methods: {
    getBankList() {
      this.$emit("handler-spin", true);
      let vm = this;
      vm.$http
        .post("/api/v2/user/queryLotUserBankInfo", "", { userId: true })
        .then((response) => {
          this.$emit("handler-spin", false);
          let data = response.data.data;
          vm.list = data.lotUserAlipayList;
          if (vm.list.length) {
            vm.hadBind = true;
          }
          // vm.list.push(data.lotUserAlipayList[0]);
        });
    },
    resetFormStatus() {
      //重置添加银行卡表单的状态
      this.$refs.addCustom.resetFields();
    },
    cardSaveSubmit() {
      let vm = this;
      if (!vm.isSubmit) {
        return;
      }
      vm.isSubmit = false;
      vm.$http
        .post("/api/v2/user/bandingBankInfo", vm.card, { userId: true })
        .then((response) => {
          vm.isSubmit = true;
          if (response.data.code !== 0) return;
          vm.getBankList();
          vm.isUpload = true;
          vm.isLoading = true;
          vm.hadUpLoadFiles = true;
        })
        .catch(() => {
          vm.isSubmit = true;
          vm.isUpload = true;
          vm.isLoading = true;
          vm.hadUpLoadFiles = true;
        });
    },
    toAddBank() {
      this.bandBankFlag = false;
      this.$emit("realNameReg", true);
    },
    cancel() {
      this.bandBankFlag = false;
      this.$emit("returnsHomepage", true);
    },
    getRealName() {
      console.log("getRealName", this.$store.getters.sysRealName);
      if (!this.user.realName && this.$store.getters.sysRealName == 1) {
        this.bandBankFlag = true;
        return;
      }
      if (this.user.realName) {
        let name = this.user.realName;
        this.card.accountName = name;
        let str = "";
        for (let i = 0; i < name.length; i++) {
          if (i !== name.length - 1) {
            str += "*";
          } else {
            str += name[i];
          }
        }
        this.realName = str;
      }
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
    addFile(event) {
      let vm = this;
      vm.uploadFiles = [];
      let target = event.target || event.srcElement;
      let _files = target.files;
      if (!_files.length) {
        return void 0;
      }
      for (let i = 0; i < _files.length; i++) {
        const file = _files[i];
        if (!/\.(gif|jpg|jpeg|png)$/gim.test(file.name)) {
          return void 0;
        }
        if (file.size > 1024 * 1204 * 4) {
          this.$Message.info(this.$tex("图片不能超过{num}M", { num: 4 }));
          return;
        }
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e) {
          vm.uploadFiles = [
            {
              file: file,
              data: this.result,
            },
          ];
        };
      }
      const newsrc = vm.getObjectURL(_files[0]);
      vm.card.imgUrl = newsrc;
      vm.hadUpLoadFiles = true;
    },
    doBanding() {
      let vm = this;
      if (!vm.isLoading) {
        return;
      }
      vm.isLoading = false;
      vm.$refs.addCard.validate((valid) => {
        if (valid) {
        }
      });
      if (!vm.card.bankNo) {
        vm.isLoading = true;
        return;
      }
      if (!vm.uploadFiles.length) {
        this.$Message.error(this.$tex("请上传图片！"));
        vm.isLoading = true;
        return;
      }
      if (vm.uploadFiles[0].url) {
        vm.cardSaveSubmit();
        return;
      }
      if (vm.uploadFiles.length) {
        var form = new FormData(); // FormData 对象
        let files = [];
        form.append("imagefiles", vm.uploadFiles[0].file);
      }
      if (!vm.isUpload) {
        return;
      }
      vm.isUpload = false;
      vm.$store.dispatch("querySystemConfig").then((systemConfig) => {
        form.append("flag", systemConfig["PLATFORM_FLAG"]);
      });
      vm.$http
        .post("/api/v2/cms/qiniuUpload", form, {
          contentType: "multipart/form-data",
          unenc: true,
        })
        .then((res) => {
          vm.isUpload = true;
          if (res.data.code !== 0) return;
          vm.uploadFiles = res.data.data;
          vm.card.imgUrl = vm.uploadFiles[0].url;
          vm.cardSaveSubmit();
          vm.isLoading = true;
          vm.hadUpLoadFiles = true;
        })
        .catch((e) => {
          vm.isUpload = true;
          vm.isLoading = true;
          vm.hadUpLoadFiles = true;
        });
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  created() {
    let vm = this;
    this.getBankList();
    this.getRealName();
  },
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
@{deep} .ivu-input[disabled],
@{deep} fieldset[disabled] .ivu-input {
  color: #313131;
  background-color: #fff;
}
.bankAccount {
  margin-top: 10px;
  @{deep} .ivu-btn {
    height: 44px;
    padding: 0 27px;
    vertical-align: middle;
    & > i {
      vertical-align: middle;
    }
    & > span {
      display: inline-block;
      font-size: 16px;
      margin-left: 10px;
      vertical-align: middle;
    }
  }
  @{deep} .icon-warn {
    font-size: 16px;
    float: left;
  }
  .warn-word {
    width: 298px;
    float: left;
    margin-left: 10px;
  }
  @{deep} .icon-bank {
    font-size: 36px;
    line-height: 44px !important;
  }
  .card-submit {
    width: 324px;
    margin: auto;
    .addBtn {
      text-align: center;
    }
  }
}
.bankAccount-content {
  width: 280px;
  margin: auto;
  @{deep} .ivu-form .ivu-form-item-label {
    font-size: 14px;
  }
}
@{deep} .ivu-input:hover {
  box-shadow: none;
  border-color: #dddee1;
}
@{deep} .ivu-input:focus {
  box-shadow: none;
  border-color: #dddee1;
}
.addContent {
  width: 260px;
  margin: auto;
  padding-bottom: 20px;
  @{deep} .ivu-form .ivu-form-item-label {
    font-size: 14px;
  }
  @{deep} .ivu-form-item {
    margin-bottom: 20px;
  }
}
.aliPayQrCode {
  width: 135px;
  height: 135px;
  margin: auto;
  overflow: hidden;
  & > img {
    width: 100%;
  }
}
.addBtn {
  margin-top: 40px;
}
@{deep} .ivu-form .ivu-form-item-label {
  text-align-last: justify;
  text-align: justify;
  text-justify: distribute-all-lines;
}
.uploadFiles {
  width: 215px;
  height: 215px;
  margin: auto;
  position: relative;
  background: url("/static/images/zfb.png") center center no-repeat;
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
    color: #23a9f1;
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
.icon-zfb {
  width: 25px;
  height: 25px;
  background: url(/static/images/zhifubao.png) center center no-repeat;
  background-size: contain;
}
</style>
