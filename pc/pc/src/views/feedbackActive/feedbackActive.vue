<template>
  <div class="feedback">
    <div class="feedback-head">
      <div class="w">
        <a href="#" class="logo">
          <img src="/configstatic/pc/images/logo/logo.png" alt="" />
        </a>
        <ul class="nav">
          <li @click="goPage('/home')">
            <i class="icon-index"></i>{{ $tex("网站首页") }}
          </li>
          <li @click="showMyPrize(1)">
            <i class="icon-git"></i>{{ $tex("我的领奖") }}
          </li>
          <li>
            <a
              :href="servicer.url"
              target="_blank"
              @click.stop="openService(servicer.url)"
            >
              <i class="icon-kf"></i>{{ $tex("在线客服") }}
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="feedback-body">
      <img
        class="banner"
        src="../../assets/images/feedback/banner.png"
        alt=""
      />
      <div class="feedback-notice">
        <span class="tit">{{ $tex("活动公告") }}：</span>

        <div class="txt">
          <marquee direction="left" align="middle">{{ notice }}</marquee>
        </div>
      </div>
      <!--    <luckyWheel></luckyWheel> -->

      <div class="luckyWheel-box">
        <div class="luckyWheel">
          <div ref="luckyWheel" class="img-wrap">
            <img class="img" :src="activityPrizeImg" alt="" />
          </div>
          <span class="turnTable" @click="turnTable">
            <span class="zhizhen"></span>
          </span>
        </div>
        <i18n class="tip" path="您有{num}次抽奖机会" tag="div">
          <template slot="num">
            <span class="num">{{ drawTime }}</span>
          </template>
        </i18n>
      </div>
      <div class="feedback-section">
        <!-- <div class="feedback-box">
                    <div class="box-head">
                        <div class="title">奖项设置</div>
                    </div>
                    <div class="box-body">
                        一等奖 一等奖 一等奖 一等奖 一等奖 一等奖
                    </div>
                </div> -->
        <div class="feedback-box" v-loading="loading">
          <div class="box-head">
            <div class="title">{{ $tex("问卷调查") }}</div>
          </div>
          <div class="box-body">
            <Form
              class="feedback-form"
              ref="formValidate"
              :model="feedbackForm"
              :rules="ruleValidate"
              :label-width="75"
            >
              <p class="tip-item">
                {{ $tex("我们励志把用户体验做到最好，期待您的意见和建议！") }}
              </p>
              <FormItem :label="`${$tex('标  题')}：`" prop="title">
                <Row>
                  <Col span="8">
                    <Input
                      type="text"
                      v-model="feedbackForm.title"
                      :placeholder="$tex('标题')"
                    ></Input>
                  </Col>
                </Row>
              </FormItem>
              <FormItem :label="`${$tex('反馈类型')}：`" prop="type">
                <Row>
                  <Col span="5">
                    <Select v-model="feedbackForm.type">
                      <Option value="01">{{ $tex("产品bug") }}</Option>
                      <Option value="02">{{ $tex("吐槽") }}</Option>
                      <Option value="03">{{ $tex("功能建议") }}</Option>
                      <Option value="04">{{ $tex("其他") }}</Option>
                    </Select>
                  </Col>
                </Row>
              </FormItem>
              <div class="feedback-form-block">
                <FormItem label="" prop="content" :label-width="1">
                  <Input
                    class="desc"
                    v-model="feedbackForm.content"
                    type="textarea"
                    :autosize="{ minRows: 5, maxRows: 5 }"
                    :placeholder="
                      $tex(
                        '如果使用中有什么不好用的地方，请大声说出来！我们会每天关注您的反馈，不断优化产品，为您提供更好的服务！'
                      )
                    "
                  ></Input>
                </FormItem>

                <div class="upload-img clearfix">
                  <ul class="clearfix">
                    <li class="" v-for="(file, idx) in uploadFiles" :key="idx">
                      <img class="img" :src="file.data" alt="" />
                      <i
                        class="ivu-icon ivu-icon-close-round"
                        @click="delFile(idx)"
                      ></i>
                    </li>
                    <!--   <li class="">
                                            <img class="img" src="" alt="">
                                        </li>
                                        <li class="">
                                            <img class="img" src="" alt="">
                                        </li> -->
                  </ul>
                  <div class="create">
                    +
                    <input
                      type="file"
                      multiple="multiple"
                      accept="image/png,image/gif,image/jpeg"
                      @change="addFile"
                    />
                  </div>
                  <div class="tip">
                    <p>
                      {{ $tex("最多上传{num}张图片", { num: 5 }) }}({{
                        $tex("图片最大{num}M", { num: 5 })
                      }})
                    </p>
                    <p>({{ $tex("添加截图能更好的帮您反馈问题") }})</p>
                  </div>
                </div>
              </div>
              <p class="tip-item">
                {{ $tex("活动要求") }}:{{
                  $tex(
                    "对平台的所有会员开发活动，只要最低充值达到6{unit}即可参加活动，活动奖品2部iPhonex！！！！",
                    { unit: "元" }
                  )
                }}
              </p>
              <Button
                type="primary"
                class="ask-btn"
                v-preventReClick="2000"
                @click="addCustomerFeedback('formValidate')"
                >{{ $tex("提交") }}</Button
              >
            </Form>
          </div>
        </div>
        <div class="feedback-box">
          <div class="box-head">
            <div class="title">{{ $tex("获奖名单") }}</div>
          </div>
          <div class="box-body nbc">
            <div class="feedback-order-wrap">
              <div class="item">
                <ul
                  class="feedback-orders"
                  ref="scroll1"
                  @mouseover="scrollEnd('scroll1')"
                  @mouseout="scroll('scroll1')"
                >
                  <li v-for="(item, index) in orderList" :key="index">
                    {{
                      $tex("恭喜 {user} 获得 {name}", {
                        user: item.userCode,
                        name: item.prizeName,
                      })
                    }}
                  </li>
                  <li v-for="(item, index) in orderList" :key="index">
                    {{
                      $tex("恭喜 {user} 获得 {name}", {
                        user: item.userCode,
                        name: item.prizeName,
                      })
                    }}
                  </li>
                </ul>
              </div>
              <div class="item">
                <ul
                  class="feedback-orders"
                  ref="scroll2"
                  @mouseover="scrollEnd('scroll2')"
                  @mouseout="scroll('scroll2')"
                >
                  <li v-for="(item, index) in orderList2" :key="index">
                    {{
                      $tex("恭喜 {user} 获得 {name}", {
                        user: item.userCode,
                        name: item.prizeName,
                      })
                    }}
                  </li>
                  <li v-for="(item, index) in orderList2" :key="index">
                    {{
                      $tex("恭喜 {user} 获得 {name}", {
                        user: item.userCode,
                        name: item.prizeName,
                      })
                    }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="feedback-box">
          <div class="box-head">
            <div class="title">{{ $tex("活动规则") }}</div>
          </div>
          <div class="box-body">
            <div v-html="escapeHtml(activityRuleDetail)"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="foot">
      <p>{{ $configText.main }} © Copyright {{ $tex("版权所有") }}</p>
    </div>

    <Modal v-model="showPrize" class="feedback-dlg" title="">
      <div class="prize-fail" v-if="prizeInfo.type == '03'">
        <div class="prize-text">{{ prizeInfo.text }}</div>
        <div class="dlg-btn" @click="showPrize = false">{{ $tex("确认") }}</div>
      </div>
      <div class="prize-success" v-else>
        <div class="prize-text">{{ prizeInfo.text }}</div>
        <div class="dlg-btn" @click="goGetPrize">{{ $tex("马上去领奖") }}</div>
      </div>
    </Modal>

    <Modal v-model="showAddressModal" class="address-dlg" :width="640" title="">
      <div class="header"></div>
      <div class="body">
        <!--  <div class="title">领奖登记表</div> -->
        <Form
          :model="addressForm"
          label-position="top"
          ref="addressForm"
          :rules="addressRuleValidate"
        >
          <FormItem :label="$tex('联系人')" prop="name">
            <Input v-model="addressForm.name"></Input>
          </FormItem>
          <FormItem :label="$tex('联系电话')" prop="phone">
            <Input
              v-model="addressForm.phone"
              :placeholder="$tex('您的联系电话')"
            ></Input>
          </FormItem>
          <FormItem :label="$tex('详细地址')" prop="address">
            <Input
              v-model="addressForm.address"
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 5 }"
              :placeholder="$tex('详细地址')"
            ></Input>
          </FormItem>
          <p class="tip">
            {{ $tex("请确认信息无误后提交，如信息错误请联系官方客服。") }}
          </p>
          <div class="dlg-btn" @click="addTurntableUserInfo('addressForm')">
            {{ $tex("确定") }}
          </div>
        </Form>
      </div>
    </Modal>
    <Modal v-model="showAddressSucess" class="feedback-dlg" title="">
      <div class="address-block">
        <div class="address-text">
          <p>{{ $tex("恭喜您提交成功！") }}</p>
          <p>{{ $tex("请耐心等待审核！") }}</p>
        </div>
        <!--        <div class="dlg-btn" @click="showAddressSucess=false">马上去领奖</div> -->
      </div>
    </Modal>

    <Modal v-model="showRuleModal" class="feedback-dlg" :width="680" title="">
      <div class="rule-block">
        <div class="dlg-name">{{ $tex("很抱歉") }}</div>
        <div class="cont">
          <div class="tip">{{ prizeMsg }}</div>
          <span class="rule-btn" @click="goRule">{{ $tex("查看规则") }}</span>
        </div>
        <!--        <div class="dlg-btn" @click="showAddressSucess=false">马上去领奖</div> -->
      </div>
    </Modal>

    <Modal
      v-model="showList"
      class="list-dlg"
      :title="$tex('我的奖品')"
      width="580"
    >
      <table class="search-tb" v-loading="tbLoading">
        <thead>
          <tr>
            <th>{{ $tex("奖品内容") }}</th>
            <th>{{ $tex("获奖时间") }}</th>
            <th>{{ $tex("状态") }}</th>
          </tr>
        </thead>
        <tbody v-if="userPrizeList.length > 0">
          <tr v-for="(item, index) in userPrizeList" :key="index">
            <td>{{ item.prizeName }}</td>
            <td>{{ item.createTime | formateDate }}</td>
            <td>
              <!--  prizeType 01实物类，02彩金类，03谢谢参与 -->
              <!-- 红包状态：00冻结，01未提现，02已提现 -->
              <template v-if="item.status === '01'">
                <span
                  class="btn"
                  @click="setAddress(item)"
                  v-if="item.prizeType == '01'"
                  >{{ $tex("填写收货地址") }}</span
                >
                <span class="btn" v-else @click="takeMoney(item, $event)">{{
                  $tex("提现")
                }}</span>
              </template>
              <span class="" v-else>{{ item.statusDesc }}</span>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td class="empty" colspan="4">{{ $tex("亲,您还没抢过红包哦") }}</td>
          </tr>
        </tbody>
      </table>
      <Page
        class="packetPage"
        :currentPage="currentPage"
        :total="total"
        :pageSize="pageSize"
        @get-Page-Data="getPageData"
      ></Page>
    </Modal>
    <Modal v-model="showTakeSucess" :width="452" class="feedback-dlg" title="">
      <div class="take-block"></div>
    </Modal>
  </div>
</template>

<script>
import luckyWheel from "./lucky_wheel.vue";
import dateModal from "@/utils/format_date.js";
import utils from "@/utils/utils";
import eleInfo from "@/utils/dom.js";
import Page from "@/components/page";
import Util from "@/utils/dom.js";
export default {
  data() {
    const fundNumber = (rule, value, callback) => {
      // 只能输入数字
      if (!value) {
        callback(new Error(this.$tex("请输入您的手机号码")));
      } else if (value && !/^1(\d){10}$/.test(value)) {
        callback(new Error(this.$tex("手机号码输入有误")));
      } else {
        callback();
      }
    };
    return {
      notice: "",
      feedbackForm: {
        content: "",
        title: "",
        type: "01",
      },
      activityRuleDetail: "", // 活动规则
      drawTime: 0, // 转盘次数
      showPrize: false,
      showAddressModal: false, //领奖登记表弹框
      showAddressSucess: false, // 地址添加成功弹框
      showTakeSucess: false, // 展示提现成功
      showList: false, // 领奖列表弹框
      showRuleModal: false, // 展示规则弹框
      prizeMsg: "", // 领奖提示
      prizeInfo: {
        type: "",
        text: "",
      },
      orderList: [],
      orderList2: [],
      ruleValidate: {
        title: [
          {
            required: true,
            message: this.$tex("请填写反馈标题"),
            trigger: "blur",
          },
        ],
        content: [
          {
            required: true,
            message: this.$tex("请填写反馈内容"),
            trigger: "blur",
          },
        ],
      },
      activityPrizeImg: "",
      uploadFiles: [],
      loading: false,
      addressForm: {},
      addressRuleValidate: {
        name: [
          {
            required: true,
            message: this.$tex("请填写联系人"),
            trigger: "blur",
          },
        ],
        phone: [
          { required: true, validator: fundNumber, trigger: "blur" },
          {
            min: 11,
            max: 11,
            message: this.$tex("请输入{num}位数的号码", { num: 11 }),
            trigger: "blur",
          },
        ],
        address: [
          {
            required: true,
            message: this.$tex("请填写详细地址"),
            trigger: "blur",
          },
        ],
      },
      userPrizeList: [], // 用户奖品列表

      currentPage: 1,
      total: 0,
      pageSize: 10,
      tbLoading: false,
    };
  },
  methods: {
    goPage(url) {
      this.$router.push(url);
    },
    openService(url) {
      //打开客服
      const link = this.user.userCode ? url + `?id=${this.user.userCode}` : url;
      Util.openWin(link);
    },
    turnTable() {
      let vm = this;
      let index = 2;
      let luckyWheel = this.$refs.luckyWheel;

      if (this.drawTime <= 0) {
        this.$Message.success(this.$tex("抽奖次数不足"));
        return;
      }

      this.$http
        .post(
          "/api/v2/user/get/turnTable",
          { clientType: "pc", id: this.activeId },
          { userId: true, stopDialog: true }
        )
        .then((response) => {
          // 查询活动信息
          if (response.data.code !== 0) {
            this.prizeMsg = response.data.msg;
            this.showRuleModal = true;
            return;
          }
          let data = response.data.data;
          this.turnIndex += 3;
          vm.willDeg =
            this.turnIndex * 360 +
            ((vm.prizes.length - data.index) / vm.prizes.length) * 360;
          setTimeout(() => {
            luckyWheel.style.webkitTransitionTimingFunction =
              "cubic-bezier(.53,.3,.24,1.01)";
            luckyWheel.style.webkitTransitionDuration = "2s";
            luckyWheel.style.webkitTransitionProperty = "all";
            luckyWheel.style.webkitTransform = "rotate(" + vm.willDeg + "deg)";

            luckyWheel.style.msTransitionTimingFunction =
              "cubic-bezier(.53,.3,.24,1.01)";
            luckyWheel.style.msTransitionDuration = "2s";
            luckyWheel.style.msTransitionProperty = "all";
            luckyWheel.style.msTransform = "rotate(" + vm.willDeg + "deg)";

            luckyWheel.style.transitionTimingFunction =
              "cubic-bezier(.53,.3,.24,1.01)";
            luckyWheel.style.transitionDuration = "2s";
            luckyWheel.style.transitionProperty = "all";
            luckyWheel.style.transform = "rotate(" + vm.willDeg + "deg)";
          }, 100);
          //转盘停止后操作
          setTimeout(() => {
            this.drawTime--;
            vm.prizeInfo.type = data.prizeType;
            vm.prizeInfo.prizeId = data.prizeId;
            if (data.prizeType == "01" || data.prizeType == "02") {
              //01实物类，02彩金类，03谢谢参与
              vm.prizeInfo.text = vm.$tex("恭喜获得{name}", {
                name: data.turnTableName,
              });
            } else if (data.prizeType == "03") {
              vm.prizeInfo.text = this.$tex("您没有抽中！请再接再励!");
            }
            vm.showPrize = true;
          }, 2100);
        });
    },
    addCustomerFeedback(name) {
      let vm = this;
      if (vm.loading) return;
      vm.loading = true;
      vm.$refs[name].validate((valid) => {
        if (valid) {
          if (vm.uploadFiles.length) {
            var form = new FormData(); // FormData 对象
            let files = [];
            for (let uploadFile of this.uploadFiles) {
              form.append("imagefiles", uploadFile.file);
            }
            vm.$http
              .post("/api/v2/cms/qiniuUpload", form, {
                contentType: "multipart/form-data",
                unenc: true,
              })
              .then((res) => {
                if (res.data.code !== 0) return;
                vm.feedbackForm.attachment = JSON.stringify(res.data.data);

                vm.submitCustomerFeedback();
              })
              .catch((e) => {
                vm.loading = false;
              });
          } else {
            vm.submitCustomerFeedback();
          }
        } else {
          vm.loading = false;
        }
      });
    },
    submitCustomerFeedback() {
      this.$http
        .post("/api/v2/user/addCustomerFeedback", this.feedbackForm, {
          userId: true,
        })
        .then((response) => {
          this.loading = false;
          if (response.data.code !== 0) return;
          let data = response.data.data;
          this.$Message.success(this.$tex("反馈成功"));
          this.uploadFiles = [];
          this.feedbackForm = {
            title: "",
            type: "01",
          };
        });
    },
    delFile(idx) {
      this.uploadFiles.splice(idx, 1);
    },
    addFile(event) {
      let vm = this;
      let target = event.target || event.srcElement;
      let _files = target.files;
      let size = 0;
      for (let file of vm.uploadFiles) {
        size += file.size;
      }
      for (let i = 0; i < _files.length; i++) {
        let file = _files[i];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e) {
          if (vm.uploadFiles.length >= 5) return;
          size += file.size;
          if (size > 1024 * 1204 * 4) {
            this.$Message.info(this.$tex("图片不能超过{num}M", { num: 4 }));
            return;
          }
          vm.uploadFiles.push({
            file: file,
            data: this.result,
          });
        };
      }
    },
    goGetPrize() {
      // 获得奖品
      this.showPrize = false;
      if (this.prizeInfo.type == "01") {
        //01实物类，02彩金类，03谢谢参与
        this.showAddressModal = true;
      } else if (this.prizeInfo.type == "02") {
        this.showMyPrize();
      }
    },
    setAddress(item) {
      this.showAddressModal = true;
      this.showList = false;
      this.prizeInfo.prizeId = item.redpacketId;
    },
    addTurntableUserInfo(name) {
      // 添加用户信息
      let vm = this;
      if (vm.submitFormIng) return;
      vm.submitFormIng = true;
      vm.$refs[name].validate((valid) => {
        if (valid) {
          vm.addressForm.id = vm.prizeInfo.prizeId;

          vm.$http
            .post("/api/v2/user/turntable/userInfo", vm.addressForm, {
              userId: true,
            })
            .then((response) => {
              vm.submitFormIng = false;
              if (response.data.code !== 0) return;
              this.showAddressSucess = true;
              this.showAddressModal = false;
            });
        } else {
          vm.submitFormIng = false;
        }
      });
    },
    showMyPrize(currentPage) {
      this.showList = true;
      this.getPageData(currentPage);
    },
    getPageData(currentPage) {
      // 获取用户红包列表
      this.tbLoading = true;
      this.$http
        .post(
          "/api/v2/user/turntable/myPrize",
          {
            current: currentPage,
            size: this.pageSize,
          },
          { userId: true, unenc: true }
        )
        .then((response) => {
          if (response.data.code !== 0) return;
          let data = response.data.data;
          this.total = data.total;
          this.userPrizeList = data.userTurnTableList;
          this.tbLoading = false;
        })
        .catch(() => {
          this.tbLoading = false;
        });
    },
    takeMoney(info, event) {
      if (!event.target.className) return;
      if (this.hasMoreClick) {
        //阻止连续提交
        return;
      }
      this.hasMoreClick = true;
      this.$http
        .post(
          "/api/v2/user/redpacket/take",
          {
            redpacketId: info.redpacketId,
          },
          { userId: true }
        )
        .then((response) => {
          this.hasMoreClick = false;
          var code = response.data.code;
          if (code === 0) {
            info.status = "02";
            info.statusDesc = this.$tex("已提现");
            this.showTakeSucess = true;
            //   this.digShow4 = true;
          }
        });
    },
    scroll(dom) {
      // 人气榜单滚动
      let scroll = this.$refs[dom];
      this["timer" + dom] = setInterval(() => {
        let top = parseFloat(scroll.style.top ? scroll.style.top : 0) - 2;
        if (scroll.scrollHeight + top <= 180) {
          top = 0;
        }
        scroll.style.top = top + "px";
      }, 100);
    },
    scrollEnd(dom) {
      clearInterval(this["timer" + dom]);
    },
    goRule() {
      eleInfo.setScrollTop(10000);
      this.showRuleModal = false;
    },
    escapeHtml(str) {
      //转义html
      return utils.escapeHtml(str);
    },
  },
  computed: {
    servicer() {
      return this.$store.state.servicer;
    },
    user() {
      return this.$store.state.user;
    },
  },
  filters: {
    formateDate(val) {
      return val ? dateModal.getFormatDate(val) : "";
    },
  },
  mounted() {
    this.$store.dispatch("querySystemConfig").then((data) => {
      this.activeId = data.settingId || "";

      this.$http
        .post(
          "/api/v2/user/redpacketSetting/info",
          {
            id: this.activeId,
          },
          { unenc: true, userId: true }
        )
        .then((response) => {
          // 查询活动信息
          if (response.data.code !== 0) return;
          let data = response.data.data;
          this.activityRuleDetail = data.activityRuleDetail;
          this.activityPrizeImg = data.activityPrizeImg;
          this.drawTime = data.drawTime;
          this.prizes = data.prizes;
          this.notice = data.noticeDesc;
        });
    });
    this.$http
      .post("/api/v2/user/turntable/pattern", "", { unenc: true })
      .then((response) => {
        // 查询榜单
        if (response.data.code !== 0) return;
        this.orderList = response.data.data;
        this.orderList2 = this.orderList.slice().reverse();
        setTimeout(() => {
          this.scroll("scroll1");
          this.scroll("scroll2");
        });
      });
    this.turnIndex = 0;
  },
  components: {
    Page,
  },
};
</script>
<style lang="less">
.feedback-form-block {
  background-color: #ffe9b5;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  .desc {
    textarea {
      background-color: transparent;
      border: 0;
      color: #c91e12;
      &::-webkit-input-placeholder {
        /* placeholder颜色  */
        color: #ff5b5b;
      }
    }
  }
}
.feedback-form {
  .ask-btn {
    width: 180px;
    height: 40px;
    margin: 0 auto 20px;
    background-color: #ff7614;
    display: block;
  }
  .ivu-form-item-label {
    color: #ffe9b5;
  }
  .ivu-form-item-error-tip {
    color: #000;
  }
}
.list-dlg {
  .ivu-modal-content {
    background: transparent;
  }
  .ivu-modal-body {
    height: 480px;
    padding: 10px 30px;
    background: url(/static/images/packet/dig-bg.png) repeat;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
  .ivu-modal-close {
    width: 20px;
    height: 20px;
    background: url(/static/images/packet/icons.png) -147px 0 no-repeat;
    cursor: pointer;
    position: absolute;
    right: 20px;
    top: 9px;
    z-index: 10;
    .ivu-icon {
      font-size: 0;
    }
  }
  .ivu-modal-footer {
    display: none;
  }
  .ivu-modal-header {
    height: 36px;
    line-height: 46px;
    font-size: 16px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding: 0 15px;
    background: url(/static/images/packet/dlg-hd-bg.png) repeat;
    .ivu-modal-header-inner {
      color: #f1f3b3;
    }
  }
  .search-tb {
    width: 100%;
    border-collapse: collapse;
    position: relative;
    overflow: hidden;
    margin-top: 30px;
    margin-bottom: 30px;
    .ivu-spin {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      line-height: 120px;
      color: #fff;
      background-color: #aaa;
      background-color: rgba(0, 0, 0, 0.5);
    }
    th,
    td {
      text-align: center;
      width: 25%;
      border: 1px solid @td-border-color;
    }
    .btn {
      border: 0;
      cursor: pointer;
      color: #fff;
      background-color: @td-border-color;
      padding: 1px 5px;
    }
    thead {
      th {
        font-size: 16px;
        height: 30px;
        color: #fff;
        font-weight: normal;
      }
    }
    tbody {
      td {
        height: 30px;
        background-color: #efddb7;
        color: @tbody-td-color;
      }
    }
    .empty {
      height: 120px;
    }
  }
}
.address-dlg {
  .header {
    width: 640px;
    height: 120px;
    background: url("../../assets/images/feedback/addr-top.png");
  }
  /* .ivu-modal-close {
        width: 30px;
        height: 30px;
        border-radius: 100%;
        background: #c91e12;
        text-align: center;
        .ivu-icon {
            color: #fff;
        }
    } */
  .ivu-modal-close {
    width: 38px;
    height: 38px;
    background: url("../../assets/images/feedback/dlg-close.png");
    .ivu-icon-ios-close-empty {
      font-size: 0;
    }
  }
  .body {
    padding: 20px;
  }
  .title {
    text-align: center;
    font-size: 18px;
    color: #000;
    padding-bottom: 10px;
    margin-bottom: 20px;
    border-bottom: 1px dotted #b6b6b6;
  }
  .ivu-modal-body {
    padding: 0;
  }
  .ivu-modal-footer {
    display: none;
  }
  .tip {
    color: #ed202c;
    margin-bottom: 20px;
  }
  .dlg-btn {
    background-color: #ffb70a;
    width: 343px;
    height: 45px;
    line-height: 45px;
    text-align: center;
    color: #ed202c;
    border-radius: 50px;
    cursor: pointer;
    font-size: 20px;
    margin: 0 auto;
  }
}
.packetPage {
  .first-page,
  .last-page {
    background-color: #fff;
  }
  .last-page-wrapper {
    .jump-to {
      color: #fff;
    }
  }
  li {
    height: 24px;
    line-height: 24px;
  }
}
.feedback-dlg {
  .ivu-modal-content {
    background: transparent;
  }
  .ivu-modal-footer {
    display: none;
  }
  .dlg-btn {
    background-color: #ffb70a;
    width: 343px;
    height: 58px;
    line-height: 58px;
    text-align: center;
    color: #ed202c;
    border-radius: 100px;
    cursor: pointer;
    font-size: 25px;
    position: absolute;
    bottom: 152px;
    left: 131px;
  }
  .prize-fail {
    width: 585px;
    height: 528px;
    background: url("../../assets/images/feedback/prize-none-bg.png");
    .dlg-btn {
      left: 141px;
    }
  }
  .address-block {
    width: 529px;
    height: 442px;
    background: url("../../assets/images/feedback/submit-success-bg.png");
    .dlg-btn {
      bottom: -60px;
      left: 108px;
    }
  }
  .take-block {
    background: url(/static/images/packet/txcg.png) no-repeat;
    width: 452px;
    height: 325px;
  }
  .rule-block {
    background: url(/static/images/packet/dlg-bg2.png) no-repeat;
    width: 680px;
    height: 600px;
    .dlg-name {
      text-align: center;
      padding-top: 78px;
      margin-bottom: 30px;
      color: #795548;
      font-size: 23px;
    }
    .tip {
      font-size: 16px;
      color: #795548;
      margin: 40px auto 0;
      width: 250px;
    }
    .rule-btn {
      font-size: 24px;
      color: #fff;
      position: absolute;
      width: 200px;
      height: 60px;
      left: 50%;
      margin-left: -86px;
      bottom: 85px;
      text-align: center;
      cursor: pointer;
    }
  }
  .address-text {
    color: #685fa1;
    padding-top: 270px;
    padding-left: 170px;
    font-size: 25px;
  }
  .prize-text {
    padding-top: 200px;
    padding-left: 180px;
    padding-right: 140px;
    font-size: 24px;
    color: #ed202c;
  }
  .prize-success {
    width: 585px;
    height: 629px;
    background: url("../../assets/images/feedback/prize-win-bg.png");
  }
  .ivu-modal-close {
    width: 38px;
    height: 38px;
    background: url("../../assets/images/feedback/dlg-close.png");
    .ivu-icon-ios-close-empty {
      font-size: 0;
    }
  }
}
</style>

<style lang="less" scoped>
.feedback {
  min-width: 1200px;
  [class^="icon"] {
    display: inline-block;
    vertical-align: middle;
    background: url(/static/images/packet/icons.png) no-repeat;
  }
  .w {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;
  }
  .foot {
    text-align: center;
    background-color: #2e0800;
    color: @foot-color;
    padding: 15px 0;
    a {
      color: @foot-color;
    }
  }
}
.feedback-order-wrap {
  width: 848px;
  height: 174px;
  margin: 0 auto;
  color: @order-wrap-color;
  padding: 35px 50px;
  background: url(/static/images/packet/order-bg.png);
  box-sizing: content-box;
  font-size: 14px;
  line-height: 30px;
  position: relative;
  &::before {
    content: "";
    position: absolute;
    width: 2px;
    background-color: @order-wrap-before-bg;
    height: 190px;
    left: 50%;
    top: 50%;
    margin-top: -95px;
  }
  .item {
    width: 50%;
    float: left;
    height: 180px;
    overflow: hidden;
  }
}

.feedback-orders {
  position: relative;
  li {
    padding-left: 100px;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.feedback-head {
  background-color: #cc0000;
  height: 70px;
  line-height: 70px;
  .logo {
    float: left;
    max-height: 70px;
    width: auto;
    img {
      max-height: 70px;
      width: auto;
    }
  }
  .nav {
    float: right;
    width: 410px;
    height: 70px;
    overflow: hidden;
    li {
      float: left;
      height: 70px;
      line-height: 70px;
      width: 135px;
      text-align: center;
      color: #fff;
      font-size: 16px;
      cursor: pointer;
      background: url(/static/images/packet/nav-bg2.png);
      a {
        color: #fff;
      }
      i {
        width: 30px;
        height: 30px;
      }
      .icon-git {
        background-position: -178px 0;
      }
      .icon-kf {
        background-position: -67px 0;
      }
      &:hover {
        background: url(/static/images/packet/nav-bg1.png);
      }
    }
  }
}
.feedback-body {
  background-color: #c50c05;
  overflow: auto;
  .banner {
    border-top: 4px solid @banner-border-top;
    width: 100%;
    float: none;
    margin-bottom: 20px;
  }
}
.feedback-notice {
  width: 1128px;
  height: 70px;
  line-height: 70px;
  overflow: hidden;
  background: url(/static/images/packet/notice-bg.png);
  margin: 0 auto 30px;
  font-size: 16px;
  color: @notice-color;
  .tit {
    float: left;
    width: 125px;
    text-align: right;
  }
  .txt {
    float: left;
    width: 950px;
    overflow: hidden;
  }
}
.feedback-section {
  width: 1200px;
  margin: 0 auto;
  overflow: hidden;
}
.feedback-box {
  padding: 30px;
  background-color: #af0d0b;
  margin-bottom: 30px;
  border-radius: 10px;
  .box-head {
    margin-bottom: 30px;

    .title {
      text-align: center;
      background: url("../../assets/images/feedback/title-bg.png");
      width: 177px;
      line-height: 66px;
      height: 66px;
      margin: 0 auto;
      color: #c91e12;
      font-size: 20px;
    }
  }
  .box-body {
    // margin: 20px;
    padding: 20px;
    background-color: #c91e12;
    border-radius: 10px;
    color: #ffe9b5;
    &.nbc {
      background-color: transparent;
    }
  }
}
.feedback-form {
  .tip-item {
    margin-bottom: 20px;
  }

  .upload-img {
    ul {
      float: left;
    }
    li {
      float: left;
      margin-right: 20px;
      cursor: pointer;
      position: relative;
      .ivu-icon {
        position: absolute;
        right: -3px;
        top: -4px;
        font-size: 12px;
        color: #fff;
        display: none;
        background: #c50c05;
        width: 16px;
        height: 16px;
        line-height: 16px;
        border-radius: 100%;
        text-align: center;
      }
      &:hover {
        .ivu-icon {
          display: block;
        }
      }
    }
    .img {
      width: 70px;
      height: 70px;
    }
    .create {
      float: left;
      width: 70px;
      height: 70px;
      overflow: hidden;
      border: 1px dotted #c91e12;
      margin-right: 10px;
      cursor: pointer;
      color: #c91e12;
      font-size: 90px;
      text-align: center;
      line-height: 55px;
      font-weight: 200;
      position: relative;
      input {
        position: absolute;
        font-size: 100px;
        right: 0;
        top: 0;
        cursor: pointer;
        opacity: 0;
        height: 100%;
      }
    }
    .tip {
      float: left;
      color: #c91e12;
      margin-top: 15px;
    }
  }
}
.luckyWheel-box {
  margin: 0 auto;
  text-align: center;
  width: 425px;
  .tip {
    width: 260px;
    height: 50px;
    line-height: 50px;
    border-radius: 50px;
    margin: 30px auto 40px;
    font-size: 16px;
    text-indent: 10px;
    color: #f25804;
    background: url("../../assets/images/feedback/tip-img.png") 35px 8px
      no-repeat #ffffe7;
    .num {
      color: #c91e12;
      font-size: 18px;
      font-weight: bolder;
      margin-left: -2px;
    }
  }
}
.luckyWheel {
  width: 425px;
  height: 425px;
  position: relative;
  .img-wrap {
    background: url("../../assets/images/feedback/luckyWheel-bg.png") no-repeat;

    padding: 32px;
    width: 100%;
    height: 100%;
  }
  .img {
    width: 100%;
    float: none;
    border-radius: 100%;
  }
  .turnTable {
    position: absolute;
    width: 166px;
    height: 166px;
    left: 50%;
    top: 50%;
    margin-top: -83px;
    margin-left: -83px;
    cursor: pointer;
    background: url("../../assets/images/feedback/luckyWheel-bg-btn.png");
  }
  .zhizhen {
    position: absolute;
    width: 33px;
    height: 163px;
    top: -50px;
    background-color: #ffffe7;
    left: 50%;
    margin-left: -16px;
    background: url("../../assets/images/feedback/zhizhen.png");
  }
}
</style>
