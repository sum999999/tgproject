<template>
  <div class="card accoutCard">
    <modal
      :modalShow="showModal"
      :width="440"
      :title="$tex('添加银行账号')"
      :hasFooter="true"
      :maskClosable="true"
      @close="oncancel"
      @btn-ok="cardSaveSubmit"
      @btn-cancel="cancel"
    >
      <div slot="content">
        <Form
          :model="card"
          ref="addCard"
          :label-width="100"
          :rules="addCardRule"
        >
          <FormItem
                  :label="`${$tex('真实姓名')} :`"
            prop="accountName"
          >
            <span v-if="realName">{{realName}}</span>
            <Input
              type="text"
              v-show="!realName"
              v-model="card.accountName"
              :placeholder="$tex('真实姓名')"
            ></Input>
          </FormItem>
          <FormItem
                  :label="`${$tex('银行账号')} :`"
            prop="bankNo"
          >
            <Input
              type="text"
              :placeholder="$tex('请输入银行卡号')"
              :value="card.bankNo"
              :maxlength="19"
              @input="card.bankNo = arguments[0].replace(/\s+/g,'')"
            >
            </Input>
          </FormItem>
          <FormItem
                  :label="`${$tex('银行名称')} :`"
            prop="bankName"
          >
            <Input
              type="text"
              v-model="card.bankName"
              :placeholder="$tex('银行名称')"
            ></Input>
          </FormItem>
          <FormItem
                  :label="`${$tex('开户行')} :`"
            prop="openBankName"
          >
            <Input
              type="text"
              v-model="card.openBankName"
              :placeholder="$tex('请输入开户行')"
            ></Input>
          </FormItem>
          <p style="color:#be1204;padding-left: 40px;margin-bottom: 15px;">
            {{$tex("尊敬的用户，为了保障您的资金安全，请您绑定您的真实姓名和设置取款密码。如果姓名与开户名不一致，将无法取款")}}
          </p>
          <!-- <FormItem :label-width='100'>
                        <Button type="primary" @click="cardSaveSubmit()" style='width:80px;height:30px;line-height:18px;'>提交</Button>
                        <Button type="warning" @click="cancel()" style='background:#ff7614;color:#fff;margin-left:16px;width:80px;height:30px;line-height:18px;'>取消</Button>
                    </FormItem> -->
        </Form>
      </div>
    </modal>
    <!-- <FormItem label="身份证号 :" prop="certNo">
                        <Input type="text" v-model="card.certNo" placeholder="请输入身份证号"></Input>
                    </FormItem> -->
    <!-- <Modal v-model="showModal" title="添加银行账号" @on-ok="cardSaveSubmit" width='440'>

                <div slot="footer"></div>
        </Modal> -->
    <div
      v-show="!list.length&&showList"
      style='padding-top:56px;'
    >
      <div
        class="addCard"
        class-name="add1"
      >
        <div class="addAccount">
          {{$tex("马上建立专属个人银行账号")}}
        </div>
        <div class="addButton">
          <Button
            type="primary"
            @click="changeStatus()"
            style='height:40px;line-height:28px;'
          >十{{$tex("专为您打造的出款通道")}}</Button>
        </div>
      </div>
    </div>
    <div v-show="list.length&&showList">
      <Button
        type="primary"
        @click="changeStatus()"
        style='width:66px;height:30px;line-height:14px;'
        :disabled="list.length>0&&showList"
      >{{$tex("新增")}}</Button>

      <!-- 户名 银行卡号 开户行 银行卡名称 身份证号码 -->
      <div class="list">
        <ul>
          <li class="list-thead">
            <span class="accountName">{{$tex("开户名")}}</span>
            <span class="bank">{{$tex("开户行")}}</span>
            <span class="bankNo">{{$tex("卡号")}}</span>
            <!-- <span class="bankName">银行名称</span> -->
            <span class="status">{{$tex("状态")}}</span>
            <!-- <span class="time">绑定时间</span> -->
            <!-- <span class="operation">操作</span> -->
          </li>
          <li
            class="list-body"
            v-for="(item, idx) in list"
            :key="idx"
          >
            <span class="accountName">{{item.accountName|formatName}}</span>
            <span class="bank">{{item.bankName}}</span>
            <span class="bankNo">{{item.bankNo|formatBankNo}}</span>
            <span class="status">{{item.status==="1"? $tex('正常') : $tex('不正常') }}</span>
            <!-- <span class="">{{item.status}}</span>  -->
            <!-- <span class="">{{item.time}}</span> -->
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
import modal from "@/components/modal";
import {hasPermission} from "@/utils/authority-utils";
import { mapGetters } from "vuex";

export default {
  components: { modal },
  data() {
    //姓名验证规则
    let addChineseCheck = null;
    if (hasPermission("validator.chinese")) {
      addChineseCheck = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$tex("请输入真实姓名")));
        } else if (!/^[\u4e00-\u9fa5]+((·|•)?[\u4e00-\u9fa5]+)$/.test(value)) {
          callback(new Error(this.$tex("请输入{min}-{max}位的中文字符", {
            min: 2,
            max: 16
          })));
        } else if (value.length < 2 || value.length > 16) {
          callback(new Error(this.$tex("请输入{min}-{max}位的中文字符", {
            min: 2,
            max: 16
          })));
        } else {
          callback();
        }
      };
    } else {
      addChineseCheck = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$tex("请输入真实姓名")));
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
    //银行名称、开户行验证规则
    const addOPenNameCheck = (rule, value, callback) => {
      if (!/^[^\u0000-\u00FF]*$/.test(value)) {
        callback(new Error(this.$tex("请输入中文")));
      } else {
        callback();
      }
    };
    const bankNum = (rule, value, callback) => {
      let vm = this;
      let role = /^[0-9]*$/;
      if (!role.test(value)) {
        callback(new Error(this.$tex("只能输入数字")));
      } else if (!this.isInternational && `${value}`.length < 16) {
        callback(new Error(this.$tex("请输入正确的银行卡号")));
      } else {
        this.$http
          .post(
            "/api/v2/user/queryBankFrom",
            { bankNo: value },
            { userId: true, stopDialog: true, unenc: true }
          )
          .then(response => {
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
    console.log('this.isInternational', this.isInternational)
    return {
      isBack: false,
      showList: false,
      showModal: false,
      //user:{},
      card: {
        accountName: "",
        bankName: "",
        bankNo: "",
        openBankName: "" /*,certNo:''*/
      },
      realName: "",
      list: [],
      //卡号验证
      addCardRule: {
        accountName: [
          { required: true, validator: addChineseCheck, trigger: "blur" }
        ],
        bankNo: [
          { required: true, message: this.$tex("银行卡号不能为空"), trigger: "blur" },
          { validator: bankNum, trigger: "blur" }
        ],
        bankName: [
          { required: true, message: this.$tex("银行卡名称不能为空"), trigger: "blur" },
          { validator: addOPenNameCheck, trigger: "blur" }
        ],
        openBankName: [
          { required: true, message: this.$tex("开户行不能为空"), trigger: "blur" },
          { validator: addOPenNameCheck, trigger: "blur" }
        ]
      }
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
        newStr = name.substr(0, 1) + '*';
      } else if (name.length > 2) {
        var char = '';
        for (var i = 0, len = name.length - 2; i < len; i++) {
          char += '*';
        }
        newStr = name.substr(0, 1) + char + name.substr(-1, 1);
      } else {
        newStr = name;
      }
      return newStr;
    }
  },
  methods: {
    changeStatus() {
      this.showModal = true;
    },
    getBankList() {
      this.$emit("handler-spin", true);
      let vm = this;
      vm.$http
        .post("/api/v2/user/queryLotUserBankInfo", "", { userId: true })
        .then(response => {
          this.$emit("handler-spin", false);
          let data = response.data.data;
          vm.showList = true;
          vm.list = data.lotUserBankList;
        });
    },
    resetFormStatus() {
      //重置添加银行卡表单的状态
      this.$refs.addCustom.resetFields();
    },
    cardSaveSubmit() {
      let vm = this;
      this.$refs.addCard.validate(valid => {
        if (valid) {
          if (vm.isSubmit) return;
          vm.isSubmit = true;
          vm.$http
            .post("/api/v2/user/bandingBankInfo", vm.card, { userId: true })
            .then(response => {
              vm.isSubmit = false;
              if (response.data.code !== 0) return;
              vm.$Message.success(vm.$tex("添加银行卡成功"));
              vm.showList = true;
              vm.getBankList();
              this.user.realName = vm.card.accountName;
              localStorage.setItem("user", JSON.stringify(this.user));
              this.$store.commit("getUser", this.user);
              vm.$refs.addCard.resetFields();
              vm.showModal = false;
            });
        }
      });
    },
    cancel() {
      this.$refs.addCard.resetFields();
      this.$refs.addCard.resetFields();
      this.showModal = false;
    },
    //  onCancle () { //取消添加银行卡弹框
    //     this.resetFormStatus();
    // },
    oncancel() {
      this.showModal = false;
    },
    getRealName() {
      if (!this.user.realName) return;
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
  computed: {
    ...mapGetters(["isInternational"]),
    user() {
      return this.$store.state.user;
    }
  },
  created() {
    let vm = this;
    this.getBankList();
    this.getRealName();
  }
};
</script>


<style lang="less" scoped>
.card {
  margin-top: -16px;
}
.card .list {
  margin-top: 16px;
}
.card .list li {
  height: 36px;
  line-height: 36px;
  padding: 0 0 0 25px;
}
.card .list li:nth-child(odd) {
  /*  background: @common-border-color; */
}
.card .list li.list-thead {
  /*  background: @primary-color; */
  color: #fff;
}
.card .list li span {
  display: inline-block;
  float: left;
  width: 30%;
}
.card .list li span.name {
  width: 10%;
}
.card .list li span.type {
  width: 10%;
}
.card .list li span.num {
  width: 30%;
}
.card .list li span.status {
  width: 10%;
}
.card .list li span.time {
  width: 20%;
}
.card .list li span.operation {
  width: 20%;
}
.card .list li.list-thead span,
.card .list li.list-body span {
  width: 190px;
}
.card .list li.list-body {
  color: #313131;
}
.card .list li.list-thead span.bank,
.card .list li.list-body span.bank {
  width: 190px;
}
.card .list li.list-thead span.bankNo,
.card .list li.list-body span.bankNo {
  width: 205px;
}
.card .list li.list-thead span.status,
.card .list li.list-body span.status {
  width: 100px;
}
.card .list li.list-body:nth-child(odd) {
  /*   background: @common-border-color; */
}
.card .list li.list-body:hover {
  background: #ebf7ff;
}
.card .addCard {
  width: 505px;
  height: 236px;
  margin: 0 auto 0;
  background: transparent;
  border-radius: 18px 18px 18px 18px;
  border: 3px dashed #e1e1e1;
}
.card .addAccount {
  text-align: center;
  font-size: 36px;
  padding-top: 12%;
  color: #a9a9a9;
}
.card .addButton {
  height: 40px;
  text-align: center;
  margin-top: 22px;
}
.card .input1 {
  text-align: center;
}
.card .model .ivu-icon {
  color: white;
}
.card .model {
  padding-bottom: 20px !important;
}
.ivu-form .ivu-form-item-label {
  padding-right: 5px;
}
</style>
