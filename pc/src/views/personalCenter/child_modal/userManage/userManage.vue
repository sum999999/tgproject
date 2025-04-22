<template>
  <div class="user-manage">
    <div class="lee-share"></div>
    <div class="search clearfix">
      <div class="addUser">
        <Button v-if="!isDianziVersion" type="warning" @click="addUser">
          <Icon type="plus"></Icon>{{ $tex("创建新会员") }}
        </Button>
      </div>
      <template v-if="$store.getters.sysPlatformFlag != 'by326'">
        <div class="datetext">{{ $tex("起始日期") }}：</div>
        <div class="selectDate">
          <Row>
            <Col span="12">
              <DatePicker
                v-model="manageTime"
                type="daterange"
                :options="optionEndTime"
                :editable="false"
                placement="bottom-end"
                :placeholder="$tex('请选择查询时间')"
                style="width: 200px"
              ></DatePicker>
            </Col>
          </Row>
        </div>
      </template>

      <div class="select-user">
        <Input
          v-model.trim="userCode"
          :placeholder="$tex('搜索会员名')"
        ></Input>
      </div>
      <div class="button">
        <Button type="primary" @click="changePageWithUserCode(1)">{{
          $tex("搜索")
        }}</Button>
      </div>
    </div>

    <!-- 未开奖弹窗 -->
    <Spin fix v-show="leeWrapSpinShow">
      <Icon type="load-c" size="24" class="demo-spin-icon-load"></Icon>
      <div>Loading</div>
    </Spin>
    <modal
      :modalShow="detailFlag"
      :title="title"
      :width="440"
      :maskClosable="true"
      @btn-cancel="cancelAddUser"
      @btn-ok="saveUser('userInfo')"
    >
      <div slot="content">
        <Form
          ref="userInfo"
          :model="userInfo"
          :rules="ruleInline"
          style="margin-top:9px;"
        >
          <FormItem
            :label="`${$tex('会员名')} : `"
            prop="userCode"
            :label-width="80"
            style="margin-left:24px;"
          >
            <Input
              type="text"
              :value="userInfo.userCode"
              @input="userInfo.userCode = arguments[0].replace(/\s+/g, '')"
              :placeholder="$tex('会员名')"
              style="width:258px;"
            ></Input>
            <p
              v-if="showUserCodeTip"
              style="height:24px;line-height:24px;position:absolute;color:#313131;font-size:12px;"
            >
              {{ $tex("账号: 8-14个字符,字母与数字") }}
            </p>
          </FormItem>
          <FormItem
            :label="`${$tex('密码')} : `"
            prop="password"
            :label-width="80"
            style="margin-left:24px;"
          >
            <Input
              type="password"
              :value="userInfo.password"
              @input="userInfo.password = arguments[0].replace(/\s+/g, '')"
              :placeholder="`${$tex('密码')} : `"
              style="width:258px;"
            ></Input>
            <p
              v-if="showPasswordTip"
              style="height:24px;line-height:24px;position:absolute;color:#313131;"
            >
              {{ $tex("密码规则: 6-14个字符,字母与数字组合") }}
            </p>
          </FormItem>
          <FormItem
            v-if="showRealName"
            :label="`${$tex('真实姓名')} : `"
            prop="realName"
            :label-width="80"
            style="margin-left:24px;"
          >
            <Input
              type="text"
              :value="userInfo.realName"
              @input="
                userInfo.realName = isInternational
                  ? arguments[0]
                  : arguments[0].replace(/\s+/g, '')
              "
              :placeholder="`${$tex('真实姓名')} : `"
              style="width:258px;"
            ></Input>
            <p
              v-if="showRealNameTip"
              style="height:24px;line-height:24px;position:absolute;color:#313131;font-size:12px;"
            >
              {{ $tex("请输入真实姓名") }}
            </p>
          </FormItem>
          <FormItem
            v-if="showPhone"
            :label="`${$tex('手机')} : `"
            prop="phone"
            :label-width="80"
            class="phone-num-item"
            :class="{
              areaCode: hasPermission('element.areaCode'),
            }"
            style="margin-left:24px;"
          >
            <Dropdown
              v-if="hasPermission('element.areaCode')"
              class="phone-num-item__area-code"
              @on-click="onAreaCodeClick"
            >
              <span>+{{ curAreaCode }}</span>
              <Icon type="arrow-down-b"></Icon>
              <DropdownMenu slot="list">
                <DropdownItem
                  v-for="(code, index) in areaCode"
                  :key="index"
                  :name="code"
                >
                  <span>{{ code }}</span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Input
              type="text"
              :value="userInfo.phone"
              @input="userInfo.phone = arguments[0].replace(/\s+/g, '')"
              :placeholder="`${$tex('手机')} : `"
              style="width:258px;"
            ></Input>
            <p
              v-if="showPhoneTip"
              style="height:24px;line-height:24px;position:absolute;color:#313131;font-size:12px;"
            >
              {{ $tex("请输入您的手机号码") }}
            </p>
          </FormItem>
          <!--   <FormItem label="会员类型 : "
                    prop="userType"
                    :label-width="80"
                    style='margin-left:24px;'>
            <RadioGroup v-model="userInfo.userType"
                        style='position:relative;top:-2px;'>
              <Radio label="10"
                     style='margin-left:33px;margin-right:36px;'>代理</Radio>
              <Radio label="00">会员</Radio>
            </RadioGroup>
          </FormItem> -->
          <FormItem
            :label="`${$tex('代理返点')}：`"
            prop="bonusGroupName"
            :label-width="80"
            style="margin-left:24px;padding-top:10px;"
          >
            <span style="color:#ff7614;text-align:left;">{{
              "(" +
                ((userInfo.bonusGroupName - 1800) / 20).toFixed(1) +
                "%) " +
                Number(userInfo.bonusGroupName).toFixed(0)
            }}</span>
          </FormItem>
          <FormItem :label-width="0">
            <div class="slider" v-if="bonusGroup[0] != bonusGroup[1]">
              <!-- left -->
              <span color="ff7614" style="margin-left:45px;"
                >{{ bonusGroup[0] }} ({{
                  ((groupName.min - 1800) / 20).toFixed(1)
                }}%)</span
              >
              <Slider
                :value="userInfo.bonusGroupName"
                :min="groupName.min"
                :max="groupName.max"
                style="margin:0 3px;margin-left:7px;"
                @on-input="changeGroupName"
                :step="groupName.step"
                :tip-format="showProgress"
              ></Slider>
              <!-- right -->
              <span color="ff7614" style="margin-left:0px;"
                >{{ bonusGroup[1] }} ({{
                  ((groupName.max - 1800) / 20).toFixed(1)
                }}%)</span
              >
            </div>
            <!-- <div v-else>
                            <span color="ff7614" style='margin-left:0px;'>{{bonusGroup[1]}} ({{((groupName.max-this.userInfo.minBonusGroupName)/20).toFixed(1)}}%)</span>
                        </div> -->
          </FormItem>
          <FormItem
            :label="`${$tex('验证码')} : `"
            prop="checkCode"
            class="valida"
            v-if="!captchaFlag"
            :label-width="80"
            style="margin-left:24px;"
          >
            <Input
              type="text"
              v-model="userInfo.checkCode"
              :placeholder="`${$tex('验证码')} : `"
              style="width:258px;"
              @on-enter="saveUser('userInfo')"
              @on-focus="refreshCheckCode()"
            >
            </Input>
            <img class="valida-code" :src="ewmUrl" @click="getImageCode" />
          </FormItem>
          <FormItem
            label=""
            prop=""
            :label-width="80"
            v-if="captchaFlag"
            style="margin-left:24px;"
          >
            <div id="addUserCaptcha">
              <!-- <div id="text"
                   v-show="cTextVisible">
                行为验证™ 安全组件加载中
              </div>
              <div id="wait"
                   class="show"
                   v-show="cWaitVisible">
                <div class="loading">
                  <div class="loading-dot"></div>
                  <div class="loading-dot"></div>
                  <div class="loading-dot"></div>
                  <div class="loading-dot"></div>
                </div>
              </div> -->
            </div>
          </FormItem>
        </Form>
      </div>
    </modal>
    <modal
      :modalShow="changeUserShow"
      :title="changeUserTitle"
      :width="440"
      @btn-cancel="changeUserHide"
      @btn-ok="changeUserSubmit('userInfo')"
      :maskClosable="true"
    >
      <div slot="content">
        <div class="change-user-content">
          <div class="change-user-content-first">
            <div></div>
            {{ changeUserInfo.row.userCode }}
          </div>
          <div class="change-user-content-second">
            <div class="userType">{{ $tex("会员类别") }} :</div>
            <p>
              &nbsp;{{
                userInfo.userType === "00" ? $tex("会员") : $tex("代理")
              }}
              <!-- <RadioGroup v-model="userInfo.userType">
                                <Radio label='00'>
                                    <span>会员</span>
                                </Radio>
                                <Radio label='10'>
                                    <span>代理</span>
                                </Radio>
                            </RadioGroup> -->
            </p>
          </div>
          <div class="change-user-content-third">
            <div>
              <span> {{ $tex("代理返点") }} : </span>
              <span>
                <span class="span-main">{{
                  "(" +
                    ((userInfo.bonusGroupName - 1800) / 20).toFixed(1) +
                    "%) " +
                    Number(userInfo.bonusGroupName).toFixed(0)
                }}</span>
              </span>
            </div>
            <div>
              <div class="slider">
                <div class="slider">
                  <!-- left -->
                  <span color="ff7614"
                    >{{ groupName.min }} ({{
                      ((groupName.min - 1800) / 20).toFixed(1)
                    }}%)</span
                  >

                  <Slider
                    :value="userInfo.bonusGroupName"
                    :min="groupName.min"
                    :max="groupName.max"
                    :disabled="disableSlider || groupName.min == groupName.max"
                    @on-input="changeGroupName"
                    :step="groupName.step"
                    :tip-format="showProgress"
                  ></Slider>
                  <!-- right -->
                  <span color="ff7614" style="margin-left:0px;">
                    {{ bonusGroup[1] }} ({{
                      ((groupName.max - 1800) / 20).toFixed(1)
                    }}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </modal>
    <modal
      :modalShow="teamReportShow"
      :title="$tex('团队报表')"
      :width="440"
      @btn-cancel="teamReportHide"
      :maskClosable="true"
      :hasFooter="false"
      claName="delete-foot"
    >
      <div slot="content">
        <div class="lee-team-inwrap">
          <p class="lee-team-fir-p">
            <span class="fir-span"></span>
            {{ teamUserCode }}
          </p>
          <div class="lee-row">
            <DatePicker
              type="date"
              :options="option"
              :editable="false"
              :placeholder="$tex('请选择查询时间')"
              v-model="teamReportTime.startTime"
              style="width: 180px"
              @on-change="reportTimeChange"
            ></DatePicker>
            <span class="lee-dialog-centerText"> - </span>
            <DatePicker
              type="date"
              :options="option"
              :editable="false"
              v-model="teamReportTime.endTime"
              :placeholder="$tex('请选择查询时间')"
              style="width: 180px"
              @on-change="reportTimeChange"
            ></DatePicker>
          </div>
          <div class="lee-row lee-row2">
            <Button
              :class="{ 'lee-active-button': leeActiveButton == 1 }"
              @click="changeActiveButton(1)"
              >{{ $tex("昨天") }}</Button
            >
            <Button
              :class="{ 'lee-active-button': leeActiveButton == 2 }"
              @click="changeActiveButton(2)"
              >{{ $tex("本周") }}</Button
            >
            <Button
              :class="{ 'lee-active-button': leeActiveButton == 3 }"
              @click="changeActiveButton(3)"
              >{{ $tex("上周") }}</Button
            >
            <Button
              :class="{ 'lee-active-button': leeActiveButton == 4 }"
              @click="changeActiveButton(4)"
              >{{ $tex("本月") }}</Button
            >
            <Button
              :class="{ 'lee-active-button': leeActiveButton == 5 }"
              @click="changeActiveButton(5)"
              >{{ $tex("上月") }}</Button
            >
          </div>
          <ul>
            <li class="lee-row lee-row-li">
              <span>{{ $tex("团队盈亏") }}</span>
              <span class="lee-team-money"
                >{{ teamReportCount.profitLossTotal | doubleShow }}
                {{ $tex("元") }}</span
              >
            </li>
            <li class="lee-row lee-row-li">
              <span>{{ $tex("投注总额") }}</span>
              <span class="lee-team-money"
                >{{ teamReportCount.buyTotal | doubleShow }}
                {{ $tex("元") }}</span
              >
            </li>
            <li class="lee-row lee-row-li">
              <span>{{ $tex("派彩总额") }}</span>
              <span class="lee-team-money"
                >{{ teamReportCount.prizeTotal | doubleShow }}
                {{ $tex("元") }}</span
              >
            </li>
            <li class="lee-row lee-row-li">
              <span>{{ $tex("佣金总额") }}</span>
              <span class="lee-team-money"
                >{{ teamReportCount.rebateTotal | doubleShow }}
                {{ $tex("元") }}</span
              >
            </li>
            <li class="lee-row lee-row-li">
              <span>{{ $tex("充值总额") }}</span>
              <span class="lee-team-money"
                >{{ teamReportCount.rechargeTotal | doubleShow }}
                {{ $tex("元") }}</span
              >
            </li>
            <li class="lee-row lee-row-li">
              <span>{{ $tex("提现总额") }}</span>
              <span class="lee-team-money"
                >{{ teamReportCount.takeFeeTotal | doubleShow }}
                {{ $tex("元") }}</span
              >
            </li>
          </ul>
          <Spin fix v-if="spinShow">
            <Icon type="load-c" size="24" class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
          </Spin>
          <!-- <Spin size="large" fix ></Spin> -->
        </div>
      </div>
    </modal>
    <div class="lee-breadcrumb">
      <div class="pointer" @click="breadcrumbClick(0)">
        {{ $store.state.user.userCode }}
      </div>
      <!-- <div class="pointer" v-for="(itm,idx) in breadcrumblist" :key='idx' @click="breadcrumbClick(idx+2)">
                {{itm}}
                <i v-if="idx == (breadcrumblist.length-1)" class="lee-breadcrumb-last-child-after" @click.stop="breadcrumbClick(idx+1)"></i>
            </div> -->
      <!-- 层级链 -->
      <div
        class="pointer"
        v-for="(itm, idx) in aboveList"
        :key="idx"
        @click="showBelow(itm, idx, true)"
      >
        {{ itm.userCode }}
        <i
          v-if="idx === aboveList.length - 1"
          class="lee-breadcrumb-last-child-after"
          @click.stop="showBelow(itm, idx, false)"
        ></i>
      </div>
    </div>
    <div class="table ">
      <Table
        :columns="columns"
        stripe
        width="756"
        height="625"
        v-for="(itm, idx) in listData"
        :key="idx"
        :data="itm"
        v-show="idx == listData.length - 1"
      ></Table>
      <div class="empty" v-if="!listData.length">{{ $tex("暂无数据") }}</div>
    </div>
    <page
      :total="paramData.total"
      :currentPage="paramData.current"
      :pageSize="paramData.size"
      :showSizer="showSizer"
      @get-Page-Data="changePage"
      @on-page-size-change="onPageSizeChange"
    ></page>
  </div>
</template>
<script>
import encryption from "@/utils/md5";
import formatDate from "@/utils/format_date.js";
import modal from "@/components/modal.vue";
import page from "@/components/page.vue";
import captcha from "@/mixins/captcha";
import utils from "@/utils/utils";
import common from "../../common/mixin";
// import { ruleFn } from "@/views/common/module_js/rule";
import { getConfigList } from "@/utils/getSysConfig";
import { convert2LocalDateTime, convert2ServerDateTime } from "@/filters";
import { hasPermission } from "@/utils/authority-utils";
import { getThisWeek } from "@/utils/date";
import { mapGetters } from "vuex";

//新分支
export default {
  mixins: [captcha(258, "#addUserCaptcha"), common],
  computed: {
    ...mapGetters(["isInternational", "userAreaCode", "isDianziVersion"]),
    changeUserTitle() {
      try {
        return `${this.$tex("会员名")} : ${this.changeUserInfo.row.userCode}`;
      } catch (error) {
        return "";
      }
    },
    showProgressLee(val) {
      return `${val.toFixed(0)} (${(
        ((val - this.sliderObj.minBonusGroupName) / val) *
        100
      ).toFixed(0)}%)`;
    },
    configList() {
      return this.$store.state.configList;
    },
    wmInstance() {
      return this.$store.state.wmInstance;
    },
    isYzm() {
      // return this.typeOfCaptcha == '1' || this.typeOfCaptcha == '4'
      return !this.captchaFlag;
    },
  },
  components: { modal, page },
  filters: {
    doubleShow: function(val) {
      return val ? Number(val).toFixed(2) : "0.00";
    },
  },
  // watch: {
  //   configList: {
  //     handler (newVal) {
  //       this.configLists = newVal;
  //       this.initConfig(newVal);
  //     },
  //     deep: true
  //   }
  // },
  data() {
    const validatePass = (rule, value, callback) => {
      //验证密码
      // let result = ruleFn.isPassWord(
      //     value,
      //     undefined,
      //     undefined,
      //     "",
      //     callback
      // );
      let flag = false;
      if (!value) {
        callback(new Error(this.$tex("请输入密码")));
      } else if (/[^A-Za-z0-9]/g.test(value)) {
        callback(new Error(this.$tex("请输入数字和字母")));
      } else if (value.length < 6 || value.length > 14) {
        callback(
          new Error(this.$tex("密码在{min}至{max}位之间", { min: 6, max: 14 }))
        );
      } else {
        callback();
        flag = true;
      }
      this.showPasswordTip = flag;
    };
    const validaName = (rule, value, callback) => {
      let flag = false;
      if (!value) {
        callback(new Error(this.$tex("请输入账号")));
      } else if (/[^A-Za-z0-9]/g.test(value)) {
        callback(new Error(this.$tex("请输入数字和字母")));
      } else if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
        callback(new Error(this.$tex("账号必须包含数字和字母")));
      } else if (value.length < 8 || value.length > 14) {
        callback(
          new Error(this.$tex("账号在{min}至{max}位之间", { min: 8, max: 14 }))
        );
      } else {
        callback();
        flag = true;
      }
      this.showUserCodeTip = flag;
    };
    let validaRealName = null;
    if (hasPermission("validator.chinese")) {
      validaRealName = (rule, value, callback) => {
        let flag = false;
        if (this.needValiRealName && !value) {
          callback(new Error(this.$tex("请输入真实姓名")));
        } else if (value && !/^[\u4E00-\u9FA5]{2,4}$/.test(value)) {
          callback(
            new Error(
              this.$tex("请输入{min}-{max}位的中文字符", {
                min: 2,
                max: 4,
              })
            )
          );
        } else {
          callback();
          flag = true;
        }
        this.showRealNameTip = flag;
      };
    } else {
      validaRealName = (rule, value, callback) => {
        let flag = false;
        if (this.needValiRealName && !value) {
          callback(new Error(this.$tex("请输入真实姓名")));
        } else if (
          /[.'"\\\-?\[\]{}|,:;<>&=#!@$%^*_\/+！＠＃＄％︿＆＊（）＿＋／？’＂｜［］｛｝。，＞＜\d]/.test(
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
          flag = true;
        }
        this.showRealNameTip = flag;
      };
    }

    const validaPhone = (rule, value, callback) => {
      let flag = false;
      if (this.needValiPhone && !value) {
        callback(new Error(this.$tex("请输入您的手机号码")));
      } else if (
        hasPermission("validator.phone.length") &&
        value &&
        !/^1(\d){10}$/.test(value)
      ) {
        callback(new Error(this.$tex("手机号码输入有误")));
      } else {
        callback();
        flag = true;
      }
      this.showPhoneTip = flag;
    };
    return {
      showSizer: true,
      // typeOfCaptcha: -1,
      disableSlider: false, //是否禁用滑块,0禁止滑动
      maxPriGroupDiffVal: 0, //我的返点最大值与代理返点的最大值之差
      ewmUrl: "", //图形验证码
      configLists: [], //配置文件
      aboveList: [], //层级链
      loading: true,
      breadcrumblist: [],
      userCode: "",
      uploadUserCode: "",
      leeWrapSpinShow: false,
      teamUserCode: "",
      spinShow: false,
      teamReportCount: {
        profitLossTotal: 0,
        buyTotal: 0,
        prizeTotal: 0,
        rebateTotal: 0,
        rechargeTotal: 0,
        takeFeeTotal: 0,
      },
      leeActiveButton: 0,
      teamUserId: "",
      teamReportTime: {
        startTime: "",
        endTime: "",
      },
      showLevels: false,
      titleList: [
        "会员名",
        "最后登录日期",
        "离线提醒",
        "类型",
        "返点",
        "人数",
        "团队余额",
        "个人余额",
        "个人投注",
        "个人充值",
        "个人提款",
        "操作",
      ],
      changeUserInfo: {
        row: {
          userCode: "",
          userType: "00",
        },
      },
      changeUserShow: false,
      showUserCodeTip: true,
      showPasswordTip: true,
      showRealNameTip: true,
      showPhoneTip: true,
      paramData: {
        userCode: "",
        current: 1,
        size: 10,
        total: 0,
      },
      detailFlag: false,
      model1: "",
      dateList: [{ name: "一周" }, { name: "一月" }],
      ruleInline: {
        userCode: [{ validator: validaName, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
        realName: [{ validator: validaRealName, trigger: "blur" }],
        phone: [{ validator: validaPhone, trigger: "blur" }],
      },
      groupName: { step: 2, min: 0, max: 0 },
      bonusGroup: [], //添加的
      // dispGroupName:"",
      userInfo: {
        userType: "10",
        userCode: "",
        password: "",
        checkCode: "",
        realName: "",
        phone: "",
      },
      title: "创建新会员",
      listData: [],
      columns: [
        {
          title: this.$tex("会员名"),
          key: "userCode",

          width: 60,
          render: (h, params) => {
            let className = "";
            let popOverCLass = "";
            let popOverText = "";
            if (params.row.onlineStatus == "00") {
              className = "lee-userName-behind1 lee-userName-behind";
              popOverText = this.$tex("离线");
              popOverCLass = "lee-popover1";
            } else {
              className = "lee-userName-behind2 lee-userName-behind";
              popOverText = this.$tex("在线");
              popOverCLass = "lee-popover2";
            }
            return h(
              "div",
              [
                h(
                  "div",
                  {
                    class: "lee-red back-after",
                    on: {
                      click: () => {
                        //  this.showBelow(params);
                      },
                    },
                  },
                  params.row.userCode
                ),
                h(
                  "div",
                  {
                    class: className,
                    on: {
                      click: () => {},
                    },
                  },
                  [
                    h(
                      "div",
                      {
                        class: "lee-popover " + popOverCLass,
                      },
                      popOverText
                    ),
                  ]
                ),
              ]
              // params.row.userCode
            );
          },
        },
        {
          title: this.$tex("最后登录日期"),
          key: "loginTime",
          width: 90,
          render: (h, params) => {
            var text = this.$tex("暂无");
            if (params.row.loginTime) {
              text = convert2LocalDateTime(params.row.loginTime);
            }
            return h("span", { class: "lee-text-ind" }, text);
          },
        },
        {
          title: this.$tex("注册时间"),
          key: "createTime",
          width: 90,
          render: (h, params) => {
            var text;
            if (params.row.createTime) {
              text = convert2LocalDateTime(params.row.createTime);
            }
            return h("span", text);
          },
        },
        {
          title: this.$tex("离线天数"),
          key: "offLineDay",
          width: 62,
          render: (h, params) => {
            var text = 0;
            if (params.row.offLineDay) {
              text = params.row.offLineDay;
            }
            return h("span", text);
          },
        },
        {
          title: this.$tex("类型"),
          key: "userTypeText",
          width: 50,
          render: (h, params) => {
            return h("span", params.row.userTypeText);
          },
        },
        {
          title: this.$tex("返点"),
          key: "bonusGroupName",
          width: 62,
          render: (h, params) => {
            return h(
              "div",
              [
                h("p", Number(params.row.bonusGroupName)),
                h(
                  "p",
                  "(" +
                    ((params.row.bonusGroupName - 1800) / 20).toFixed(1) +
                    "%" +
                    ")"
                ),
              ]
              // ''+ Number(params.row.bonusGroupName) +'(' + ((params.row.bonusGroupName - this.userInfo.minBonusGroupName)/20).toFixed(1)+'%'+')'
              // ''+ Number(params.row.bonusGroupName).toFixed(2) +'%'
            );
          },
        },
        {
          title: this.$tex("人数"),
          key: "subuserCount",
          width: 44,
        },
        {
          title: this.$tex("团队余额"),
          key: "totalAmount",
          width: 65,
          render: (h, params) => {
            const totalAmount = Math.floor(+params.row.totalAmount * 100) / 100;
            return h("span", totalAmount.toFixed(2));
          },
        },
        {
          title: this.$tex("个人余额"),
          key: "balance",
          width: 71,
          render: (h, params) => {
            const balance = Math.floor(+params.row.balance * 100) / 100;
            return h("span", balance.toFixed(2));
          },
        },
        {
          title: this.$tex("个人投注"),
          key: "bettingAmount",
          width: 62,
          render: (h, params) => {
            return h("span", Number(params.row.bettingAmount).toFixed(2));
          },
        },
        {
          title: this.$tex("个人充值"),
          key: "totalFee",
          width: 62,
          render: (h, params) => {
            return h("span", Number(params.row.totalFee).toFixed(2));
          },
        },
        {
          title: this.$tex("个人提款"),
          key: "takeFee",
          width: 62,
          render: (h, params) => {
            return h("span", Number(params.row.takeFee).toFixed(2));
          },
        },
        {
          title: this.$tex("操作"),
          key: "operate",
          width: 105,
          render: (h, params) => {
            let nexttLevelClass = "";
            if (!this.showLevels) {
              nexttLevelClass = "pointer-not";
            }
            let exchangClassName = "lee-opera-div-inside-p ";
            if (this.listData.length > 1) {
              exchangClassName += " pointer-not un-click-color";
            }
            // if(this.)
            console.log("params.row", params.row);

            return h(
              "div",
              {
                class: "lee-opera-div",
              },
              [
                h(
                  "div",
                  {
                    class: "lee-opera-div-inside",
                  },
                  [
                    h(
                      "p",
                      {
                        class: exchangClassName,
                        on: {
                          click: () => {
                            this.changeUser(params);
                          },
                        },
                      },
                      this.$tex("修改")
                    ),
                    h(
                      "p",
                      {
                        class: "lee-opera-div-inside-p",
                      },
                      this.$tex("转账")
                    ),
                    h(
                      "p",
                      {
                        class: "lee-opera-div-inside-p",
                        on: {
                          click: () => {
                            this.teamUserCode = params.row.userCode;
                            this.teamReportCount = {
                              profitLossTotal: 0,
                              buyTotal: 0,
                              prizeTotal: 0,
                              rebateTotal: 0,
                              rechargeTotal: 0,
                              takeFeeTotal: 0,
                            };
                            this.leeActiveButton = 0;
                            this.teamReportTime = {
                              startTime: "",
                              endTime: "",
                            };
                            this.teamReportShow = true;
                            this.teamUserId = params.row.userId;
                            this.getTeamReport();
                          },
                        },
                      },
                      this.$tex("报表")
                    ),
                    h(
                      "p",
                      {
                        class: nexttLevelClass,
                        on: {
                          click: () => {
                            if (this.showLevels) {
                              this.showBelow(params);
                            }
                            // this.chooseNextLevelUser(
                            //     params
                            // );
                          },
                        },
                      },
                      this.$tex("下级代理")
                    ),
                  ]
                ),
              ]
            );
          },
        },
      ],
      manageTime: [],
      sliderObj: {
        min: 0,
        max: 0,
        minBonusGroupName: 0,
      },
      // 请求下级代理
      requestContinues: false,
      teamReportShow: false,
      currentUserId: [],
      userInfoList: [],
      uploadUserCode: "",
      hasRefreshChode: false,
      showRealName: false,
      needValiRealName: false,
      showPhone: false,
      needValiPhone: false,
      areaCode: "",
      curAreaCode: "",
    };
  },
  watch: {
    detailFlag(val) {
      if (val) {
        // this.captchaObj && this.captchaObj.reset && this.captchaObj.reset()
      } else {
        this.hasRefreshChode = false;
      }
    },
    /*  configList: {
       handler (newVal) {
         this.configLists = newVal;
         this.initConfig(newVal);
       },
       deep: true
     } */
  },
  methods: {
    hasPermission,
    onAreaCodeClick(name) {
      this.curAreaCode = name;
    },
    refreshCheckCode() {
      //获取焦点刷新验证码
      // this.isActive = 3
      if (this.hasRefreshChode) {
        return;
      }
      this.getImageCode();
      this.hasRefreshChode = true;
    },
    async getImageCode() {
      if (this.isYzm) {
        const data = await utils.loadEwmUrl();
        this.ewmUrl = data.url;
        this.kaptchaFlag = data.kaptchaFlag;
      }
    },
    initConfig(configList) {
      getConfigList().then((res) => {
        res.forEach((itm) => {
          if (hasPermission("element.areaCode")) {
            if (itm.key === "AREA_CODE") {
              this.areaCode = JSON.parse(itm.value).areaCode || [];
              if (this.areaCode.length) {
                this.curAreaCode = this.areaCode[0];
              }
            }
          } else {
            this.curAreaCode = this.userAreaCode;
          }
          if (itm.key === "PROXY_REGISTER_COLUMN") {
            const proxyRegColumn = JSON.parse(itm.value);
            this.showRealName = proxyRegColumn["realName"]["show"];
            this.needValiRealName = proxyRegColumn["realName"]["need"];
            this.showPhone = proxyRegColumn["phone"]["show"];
            this.needValiPhone = proxyRegColumn["phone"]["need"];
          }
          if (itm.key === "AGENT_LEVEL_SWITCH") {
            this.showLevels = itm.value === "0" ? false : true;
            return;
          }
          if (itm.key === "EXPAND_BONUS_GROUP_VALUE") {
            //我的返点最大值与代理返点的最大值之差
            this.maxPriGroupDiffVal = itm.value;
            this.getUserInfoFromLocal(); //初始化代理返点
          }
          if (itm.key === "EXPAND_BONUS_GROUP_STATUE") {
            //是否禁用返点滑块
            this.disableSlider = itm.value === "0" ? true : false;
          }
          if (itm.key === "YI_DUN_VAILD_CONFIG") {
            let {
              captchaFlag,
              antiCheatFlag,
              businessId,
              captchaId,
            } = JSON.parse(itm.value).addAgent;
            this.captchaFlag = captchaFlag;
            this.antiCheatFlag = antiCheatFlag;
            this.businessId = businessId;
            this.captchaId = captchaId;
          }
        });
        this.getImageCode();
      });
    },
    /**
     * 显示下级层级
     * flag:false表示点击面包屑导航
     * flag:true表示点击标题
     */
    showBelow(item, idx, flag) {
      /*  if (flag) {
                //  return
                this.uploadUserId = item.userId;//8.30
                this.uploadUserCode = '';
            } else */ if (
        item.row &&
        item.row.userType == "00"
      ) {
        this.$Message.info(this.$tex("会员没有下级代理"));
        return;
      } else if (flag === false) {
        if (idx === 0) {
          this.uploadUserId = "";
          this.uploadUserCode = ""; //8.30
        } else {
          this.aboveList.splice(idx, 1);
          this.uploadUserId = this.aboveList[idx - 1].userId;
        }
      } else {
        this.uploadUserId = item.userId || item.row.userId;
        this.uploadUserCode = "";

        // if (this.userCode) {
        //     this.uploadUserId = '';
        // }
      }
      this.paramData.current = 1;
      this.getDataList();
      this.getUserInfoFromLocal();
    },
    /**
     * @author Lee
     * @param Object
     * 修改会员详情
     *
     * ****/
    changeUser(params) {
      if (this.listData.length > 1) return;
      this.changeUserShow = true;
      this.changeUserInfo = params;
      var user = this.$store.state.user;

      let minBonusGroup = Number(user.minBonusGroupName);
      let userMinBonusGroup = Number(
        JSON.parse(JSON.stringify(params.row)).bonusGroupName
      );
      let bonusGroup = Number(user.bonusGroupName);
      let maxBonusGroup = bonusGroup - this.maxPriGroupDiffVal;
      let newMaxBonusGroup =
        maxBonusGroup < minBonusGroup ? minBonusGroup : maxBonusGroup;
      newMaxBonusGroup =
        newMaxBonusGroup < userMinBonusGroup
          ? userMinBonusGroup
          : newMaxBonusGroup;
      // this.$set(this.groupName,"min",Number(JSON.parse(JSON.stringify(params.row)).bonusGroupName));
      // this.$set(this.groupName, "max", Number(user.bonusGroupName));
      this.$set(this.groupName, "min", userMinBonusGroup);
      this.$set(this.groupName, "max", newMaxBonusGroup);

      this.$set(
        this.groupName,
        "bonusGroupName",
        Number(params.row.bonusGroupName)
      );
      this.$set(
        this.userInfo,
        "bonusGroupName",
        Number(params.row.bonusGroupName)
      );
      // this.$set(this.userInfo,"minBonusGroupName", Number(user.minBonusGroupName));
      this.$set(this.userInfo, "minBonusGroupName", minBonusGroup);

      this.bonusGroup.splice(0, 0, minBonusGroup);
      this.bonusGroup.splice(1, 0, newMaxBonusGroup);
      this.userInfo.userType = params.row.userType;
      this.userInfo.userCode = params.row.userCode;
    },
    changeUserHide() {
      this.changeUserShow = false;
    },
    teamReportHide() {
      this.teamReportShow = false;
    },
    /**
     * @author Lee
     * @param {object}
     * 判断是否请求下级代理列表
     *
     * ****/
    chooseNextLevelUser({ row }, bool) {
      if (!this.showLevels) {
        return;
      }
      if (row.userType === "00") {
        this.$Message.info(this.$tex("该会员已没有下级代理"));
        return;
      }
      // let obj = Object.assign({}, this.paramData);
      let obj = {
        current: 1,
        size: 10,
        userType: "",
        userCode: "",
      };
      obj.userId = row.userId;
      if (this.requestContinues) return;
      this.requestContinues = true;
      this.leeWrapSpinShow = true;
      this.currentUserId[this.currentUserId.length] = row.userId;
      this.userInfoList.push(row);
      this.$http
        .post(
          "/api/v2/agent/subuser/list",
          obj,
          { userId: true, unenc: true },
          { unenc: true }
        )
        .then(({ data }) => {
          this.currentUserId.pop();
          this.leeWrapSpinShow = false;
          this.aboveList = data.data.userDevRela;
          if (data.data.list.length == 0) {
            this.requestContinues = false;
            this.$Message.info(this.$tex("该会员已没有下级代理"));
            return;
          }
          // this.listData  = [data.data.list]
          if (!bool) {
            this.breadcrumblist.push(row.userCode);
            // debugger;
            // if (this.aboveList.length) { //
            // debugger;
            let filterList = this.aboveList.filter(
              (item) => item.userCode !== row.userCode
            );
            for (let i = 0; i < filterList.length; i++) {
              this.breadcrumblist.unshift(filterList[i].userCode);
            }
            this.breadcrumblist = Array.from(new Set(this.breadcrumblist));
            // } else{
            //     this.
            // }
          }
          this.uploadUserId = row.userId;
          this.paramData.current = 1;
          this.paramData.total = data.data.total;
          this.listData = [];
          this.listData.push(data.data.list);
          this.requestContinues = false;
        });
    },

    /**
     * @author Lee
     * @param {Object}
     * 面包屑导航
     * **/
    breadcrumbClick(idx) {
      // let arr = Object.assign([], this.listData);
      let arrForBread = Object.assign([], this.breadcrumblist);
      let userIdList = [...this.currentUserId];
      let userInfoList = [...this.userInfoList];
      if (!idx) {
        // arr.length = 1;
        arrForBread.length = 0;
        userIdList.length = 0;
        userInfoList.length = 0;
      } else {
        // arr.length = idx;
        arrForBread.length = idx - 1;
        userIdList.length = idx - 1;
        userInfoList.length = idx - 1;
      }
      // this.listData = arr;
      this.breadcrumblist = arrForBread;
      this.currentUserId = userIdList;
      this.userInfoList = userInfoList;
      let flagLength = userInfoList.length;
      this.paramData.current = 1;
      if (flagLength) {
        this.chooseNextLevelUser(
          { row: this.userInfoList[flagLength - 1] },
          true
        );
      } else {
        //  this.$set(this.paramData, "userCode", "");
        this.uploadUserCode = "";
        this.paramData.userCode = "";
        this.paramData.userId = "";
        this.uploadUserId = "";
        this.getDataList();
        this.getUserInfoFromLocal();
        this.configLists.forEach((item) => {
          if (item.key === "AGENT_LEVEL_SWITCH") {
            this.showLevels = item.value === "0" ? false : true;
            return;
          }
        });
      }
    },
    /**
     * @author Lee
     *
     * 获取团队报表
     * ***/
    getTeamReport(id) {
      let userId = this.teamUserId;
      let obj = {};
      if (this.leeActiveButton == 0) {
        setTimeout(() => {
          let startTime = this.teamReportTime.startTime;
          let endTime = this.teamReportTime.endTime;
          if (!startTime || !endTime) return;
          const cpEndTime1 = new Date(endTime);
          const cpEndTime2 = new Date();
          if (
            `${cpEndTime1.getFullYear()}/${cpEndTime1.getMonth() +
              1}/${cpEndTime1.getDay()}` ===
            `${cpEndTime2.getFullYear()}/${cpEndTime2.getMonth() +
              1}/${cpEndTime2.getDay()}`
          ) {
            endTime = new Date();
          } else {
            endTime.setHours(23);
            endTime.setMinutes(59);
            endTime.setSeconds(59);
          }
          obj = {
            userId,
            gtBuyTime: startTime,
            ltBuyTime: endTime,
          };
          this.requestTeamReport(obj);
        }, 0);
        // debugger;
        return;
      } else if (this.leeActiveButton == 1) {
        //昨日
        let time = new Date();
        let time2 = new Date();
        time2.setDate(time.getDate() - 1);
        time2.setHours(0);
        time2.setMinutes(0);
        time2.setSeconds(0);
        time.setDate(time.getDate() - 1);
        time.setHours(23);
        time.setMinutes(59);
        time.setSeconds(59);
        obj = {
          userId,
          gtBuyTime: time2,
          ltBuyTime: time,
        };
      } else if (this.leeActiveButton == 2) {
        //本周
        const { startTime, endTime } = getThisWeek();
        obj = {
          userId,
          gtBuyTime: startTime,
          ltBuyTime: endTime,
        };
      } else if (this.leeActiveButton == 3) {
        //上周
        let time = new Date();
        let time2 = new Date();
        time2.setDate(time.getDate() - time.getDay() + 1 - 7);
        time2.setHours(0);
        time2.setMinutes(0);
        time2.setSeconds(0);
        time.setDate(time.getDate() - time.getDay() + 1);
        time.setDate(time.getDate() - 1);
        time.setHours(23);
        time.setMinutes(59);
        time.setSeconds(59);
        obj = {
          userId,
          gtBuyTime: time2,
          ltBuyTime: time,
        };
      } else if (this.leeActiveButton == 4) {
        //本月
        let time = new Date();
        let time2 = new Date();
        time2.setDate(1);
        time2.setHours(0);
        time2.setMinutes(0);
        time2.setSeconds(0);

        obj = {
          userId,
          gtBuyTime: time2,
          ltBuyTime: time,
        };
      } else if (this.leeActiveButton == 5) {
        //上月
        let time = new Date();
        let time2 = new Date();
        time2.setDate(0);
        time2.setDate(1);
        time2.setHours(0);
        time2.setMinutes(0);
        time2.setSeconds(0);
        time.setDate(1);
        time.setHours(23);
        time.setMinutes(59);
        time.setSeconds(59);
        time.setDate(time.getDate() - 1);
        obj = {
          userId,
          gtBuyTime: time2,
          ltBuyTime: time,
        };
      }
      this.requestTeamReport(obj);
    },
    /**
     * @author Lee
     * @param {Object}
     * 请求团队报表
     */
    requestTeamReport(obj) {
      // obj.gtBuyTime = '' + obj.gtBuyTime.getFullYear() + '-' + (obj.gtBuyTime.getMonth() + 1) + '-' + obj.gtBuyTime.getDate()
      // obj.ltBuyTime = '' + obj.ltBuyTime.getFullYear() + (obj.ltBuyTime.getMonth() + 1) + obj.ltBuyTime.getDate()
      obj.gtBuyTime = convert2ServerDateTime(obj.gtBuyTime);
      obj.ltBuyTime = convert2ServerDateTime(obj.ltBuyTime);
      console.log(obj);
      if (
        new Date(obj.ltBuyTime).getTime() - new Date(obj.gtBuyTime).getTime() <
        0
      ) {
        this.$Message.info(this.$tex("日期范围不正确"));
        return;
      }
      this.spinShow = true;
      // debugger;
      this.$http
        .post("/api/v2/agent/subuser/teamReport", obj, {
          userId: true,
          unenc: true,
        })
        .then(({ data }) => {
          this.spinShow = false;
          if (data.code !== 0) return;
          this.teamReportCount = data.data;
        });
    },
    reportTimeChange() {
      this.leeActiveButton = 0;
      this.getTeamReport();
    },
    changeActiveButton(num) {
      this.teamReportTime.startTime = "";
      this.teamReportTime.endTime = "";
      this.$nextTick(() => {
        this.leeActiveButton = num;
        this.getTeamReport();
      });
    },
    addUser() {
      this.detailFlag = true;
      if (this.$refs.userInfo) {
        this.$refs.userInfo.resetFields();
      }
      this.$set(this, "title", this.$tex("创建新会员"));
      this.getUserInfoFromLocal();
      this.$nextTick(() => {
        if (this.captchaFlag) {
          this.initCapthca();
        }
      });
    },
    getUserInfoFromLocal() {
      const user = this.$store.state.user;
      const min = Number(user.minBonusGroupName);
      // const max = Number(user.bonusGroupName)-this.maxPriGroupDiffVal;// 2019.5.12
      let newMax = Number(user.bonusGroupName) - this.maxPriGroupDiffVal;
      const max = newMax < min ? min : newMax;

      const curPoint = max - min < 20 ? min : max - 20;
      this.$set(this.groupName, "min", min);
      this.$set(this.groupName, "max", max);
      this.$set(this.userInfo, "bonusGroupName", curPoint); //代理返点
      this.$set(this.userInfo, "minBonusGroupName", min);
      this.bonusGroup.splice(0, 0, min);
      this.bonusGroup.splice(1, 0, max);
    },
    cancelAddUser() {
      this.refreshCaptchaValidate(); //关闭弹框清空行为验证
      //取消创建会员
      this.$refs.userInfo.resetFields();
      this.detailFlag = false;
      this.showUserCodeTip = true;
      this.showPasswordTip = true;
      this.verifyData = {};
    },
    showProgress(val) {
      //显示赔率
      return `${val.toFixed(0)} (${((val - 1800) / 20).toFixed(1)}%)`;
    },
    changePageWithUserCode() {
      this.uploadUserCode = this.userCode;
      this.uploadUserId = null;
      this.changePage(1);
    },
    onPageSizeChange(size) {
      this.paramData.size = size;
      this.changePage(1);
    },
    changePage(page, uploadUserCode) {
      // debugger;
      // vm.$set(vm.paramData, "current", page);
      if (!this.aboveList.length) {
        // this.uploadUserCode = this.$store.state.user.userCode;
        // this.uploadUserId = this.$store.state.user.userId;
        this.uploadUserCode = this.uploadUserCode ? this.uploadUserCode : "";
        //  this.uploadUserCode = '';
        this.uploadUserId = "";
      } else {
        //this.uploadUserCode = this.aboveList[this.aboveList.length - 1].userCode;
        this.uploadUserId = this.aboveList[this.aboveList.length - 1].userId;
      }
      this.paramData.current = page;
      this.getDataList();
    },
    formatDate(value) {
      if (!value) {
        return "无";
      }
      return convert2LocalDateTime(value);
    },
    changeGroupName(val) {
      this.$set(this.userInfo, "bonusGroupName", val);
    },
    getDataList() {
      let vm = this;
      let ltTime = "";
      let gtTime = "";
      if (this.manageTime && this.manageTime[0] && this.manageTime[1]) {
        this.manageTime[1].setHours(23);
        this.manageTime[1].setMinutes(59);
        this.manageTime[1].setSeconds(59);
        ltTime = convert2ServerDateTime(this.manageTime[1]);
        gtTime = convert2ServerDateTime(this.manageTime[0]);
      }
      // if (ltTime == "1970-01-01") ltTime = "";
      // if (gtTime == "1970-01-01") gtTime = "";
      this.$set(vm.paramData, "ltTime", ltTime);
      this.$set(vm.paramData, "gtTime", gtTime);
      //   debugger;
      this.leeWrapSpinShow = true;
      if (this.uploadUserCode) {
        this.paramData.userCode = this.uploadUserCode;
      } else {
        this.paramData.userCode = "";
      }
      if (this.uploadUserId) {
        this.paramData.userId = this.uploadUserId;
      } else {
        this.paramData.userId = "";
      }

      this.$http
        .post("/api/v2/agent/subuser/list", vm.paramData, {
          userId: true,
          unenc: true,
        })
        .then((response) => {
          this.leeWrapSpinShow = false;
          if (response.data.code !== 0) return;
          let list = Object.assign([], response.data.data.list);
          this.userCode = "";
          // this.manageTime = []; // 12.5
          if (!list.length) {
            // this.$Message.info("未找到下级代理");
            // this.paramData.current = '1';
            //  return
          }
          this.listData = [list];
          this.paramData.total = response.data.data.total;
          let data = response.data.data;
          this.aboveList = response.data.data.userDevRela;
        });
    },
    getWxToken() {
      //获取易盾验证的token
      let vm = this;
      if (this.wmInstance) {
        return new Promise((resolve, reject) => {
          this.wmInstance.getToken(vm.businessId, function(token) {
            resolve(token);
          });
        });
      } else {
        return Promise.reject("");
      }
    },
    saveUser(name) {
      let vm = this;
      this.$refs[name].validate((valid) => {
        if (!valid) {
          vm.detailFlag = true;
          loading();
          if (vm.captchaFlag) {
            vm.refreshCaptchaValidate();
          }
          // (vm.typeOfCaptcha === '2' || vm.typeOfCaptcha === '3') && vm.captchaObj && vm.captchaObj.reset && vm.captchaObj.reset()
          vm.getImageCode();
          console.log("验证非法");
          return;
        }
        console.log("验证通过");
        // vm.detailFlag = false;
        vm[name].password = encryption.encrypt.md5(vm[name].password);
        var params = {
          ...vm[name],
        };
        if (!this.captchaFlag) {
          //未开启行为验证
          console.log("验证码验证");
          // if (this.antiCheatFlag) {
          //   let loading = this.$Message.loading({
          //     content: '加载中...',
          //     duration: 0
          //   })
          //   // this.registerSubmit(obj, loading);
          //   this.subMitEditPhoneNumber(obj);
          //   return;
          // }
          // this.subMitEditPhoneNumber(obj);
          if (this.antiCheatFlag) {
            //如果开启了反作弊
            vm.getWxToken().then((res) => {
              // if (!res) {
              //   return;
              // }
              params = { ydtoken: res, ...params };
              subMit(params);
            });
            return;
          }
          subMit(params);
          return;
        }

        const capObj = this.capthcaValidate(); //行为验证
        // console.log(capObj);
        // console.log(capObj);
        console.log("开启了行为验证");
        if (!capObj) {
          this.registerStatus = false;
          this.userInfo.password = "";
          return;
        }
        var { validate, loading } = capObj;
        params = {
          ydNECaptchaValidate: validate,
          ...params,
        };
        if (this.antiCheatFlag) {
          //如果开启反作弊
          vm.getWxToken().then((res) => {
            // if (!res) {
            //   return;
            // }
            params = { ydtoken: res, ...params };
            subMit(params, loading);
          });
          return;
        }
        subMit(params, loading);
        // this.subMitEditPhoneNumber(obj, loading);

        // switch (vm.typeOfCaptcha) {
        //   case "1": //普通验证

        //     subMit(params);
        //     console.log('验证' + vm.typeOfCaptcha);
        //     break;
        //   case "2":
        //     const capObj = vm.capthcaValidate()
        //     console.log('验证' + vm.typeOfCaptcha);
        //     if (!capObj) {
        //       break;
        //     }
        //     var { capthcaParams, loading } = capObj
        //     params = { ...params, ...capthcaParams }
        //     subMit(params, loading);
        //     break;
        //   case "3":
        //     console.log('验证' + vm.typeOfCaptcha);
        //     var capObj = vm.capthcaValidate()
        //     if (!capObj) {
        //       break;
        //     }
        //     var { capthcaParams, loading } = capObj;
        //     vm.getWxToken().then(res => {
        //       // if (!res) {
        //       //   return;
        //       // }
        //       params = { ydtoken: res, ...params, ...capthcaParams }
        //       subMit(params, loading);
        //     });
        //     break;
        //   case "4":
        //     console.log('验证' + vm.typeOfCaptcha);
        //     vm.getWxToken().then(res => {
        //       // if (!res) {
        //       //   return;
        //       // }
        //       params = { ydtoken: res, ...params }
        //       subMit(params);
        //     });
        //     break;
        // }
      });
      function subMit(obj, loading) {
        vm.$http
          .post(
            "/api/v2/agent/addSubuser",
            {
              areaCode: vm.curAreaCode,
              ...obj,
            },
            {
              userId: true,
              kaptchaFlag: vm.kaptchaFlag,
            }
          )
          .then((response) => {
            loading && loading();
            vm.verifyData = {};
            // (vm.typeOfCaptcha === '2' || vm.typeOfCaptcha === '3') && vm.captchaObj && vm.captchaObj.reset && vm.captchaObj.reset()
            if (response.data.code !== 0) {
              console.log("创建失败");
              vm.userInfo.password = "";
              vm.userInfo.checkCode = "";
              // vm.$refs["userInfo"].resetFields();
              if (vm.captchaFlag) {
                vm.refreshCaptchaValidate();
              }
              vm.getImageCode();
              return;
            }
            vm.detailFlag = false;
            vm.userInfo.userCode = "";
            vm.userInfo.password = "";
            vm.$Message.success(this.$tex("操作成功"));
            if (vm.captchaFlag) {
              vm.refreshCaptchaValidate();
            }
            vm.changePage(1);
            // loading && loading()
            //   (vm.typeOfCaptcha === '2' || vm.typeOfCaptcha === '3') && vm.captchaObj && this.captchaObj.reset && this.captchaObj.reset()
          });
      }
    },
    capthcaSuccess() {
      // console.log('cata sss ===')
    },
    changeUserSubmit(name) {
      this.$http
        .post("/api/v2/agent/updateSubuser", this[name], { userId: true })
        .then((res) => {
          if (res.data.code !== 0) return;
          this.$Message.success(this.$tex("操作成功"));
          this.changeUserShow = false;
          this.changePage(this.paramData.current);
        });
    },
  },
  created() {
    setTimeout(() => {
      this.loading = false;
    }, 5000);
    this.$set(this.paramData, "userCode", "");
    this.getDataList();
    // this.getUserInfoFromLocal(); // 2019.5.12
    this.initConfig(this.configList);
  },
};
</script>
<style lang="less" scoped>
@import "~@/mixins/captcha.less";
@deep: ~">>>";
.valida .valida-code {
  position: absolute;
  top: 4px;
  right: 45px;
  height: 26px;
  width: auto;
  cursor: pointer;
  z-index: 2;
}
#captcha {
  width: 260px !important;
  @{deep} .geetest_holder {
    width: 260px !important;
    min-width: 260px !important;
  }
}
.v-transfer-dom {
  @{deep} {
    .phone-num-item {
      margin-bottom: 20px;
      position: relative;
      &.areaCode {
        input {
          padding-left: 40px;
        }
      }
    }
    .phone-num-item__area-code {
      position: absolute;
      left: 5px;
      top: 1px;
      color: #313131;
      z-index: 1;
      cursor: pointer;
    }
  }
}
</style>
<style lang="less">
.user-manage .lee-opera-div-inside .un-click-color {
  color: #999;
}
.back-after {
  margin-left: -5px;
}
.lee-team-inwrap {
  padding: 0px 6px;
}
.delete-foot {
  .ivu-modal-footer {
    display: none;
  }
}
.lee-team-fir-p {
  line-height: 24px;
  margin-bottom: 14px;
  padding-left: 45px;
  position: relative;
  .fir-span {
    display: inline-block;
    width: 30px;
    height: 30px;
    background: url("~@/assets/images/icon.png") -238px -9px no-repeat;
    position: absolute;
    left: 10px;
    top: 0px;
  }
}
.lee-team-money {
  color: #ff7614;
}
.lee-row {
  display: flex;
  line-height: 30px;
  flex-wrap: wrap;
}
.lee-row2 {
  margin-top: 15px;
  button {
    width: 25%;
    margin: 4px 0px;
    background-color: white;
  }
  span {
    /*    color: #be1204; */
  }
  .lee-active-button {
    border-color: #ff8234;
    background-color: #ff8234;
    color: white;
    box-shadow: none;
    span {
      color: inherit;
    }
  }
}
.lee-row-li {
  padding-top: 14px;
  line-height: 30px;
  border-bottom: 1px solid #e2e2e2;
}
.lee-row-li:last-child {
  border-bottom: none;
}
.ivu-table-cell {
  position: relative;
}
.lee-text-ind {
  display: inline-block;
  padding-left: 5px;
}
.lee-userName-behind {
  display: block;
  height: 12px;
  width: 12px;
  top: 0px;
  bottom: 0;
  margin: auto;
  right: -13px;
  position: absolute;
  z-index: 3;
  cursor: pointer;
  border-radius: 50%;
  .lee-popover {
    width: 42px;
    line-height: 18px;
    text-align: center;
    position: absolute;
    border-radius: 4px;
    color: white;
    top: -20px;
    left: -12px;
    opacity: 0.9;
    z-index: 20000;
  }
  .lee-popover1 {
    background-color: #989898;
  }
  .lee-popover2 {
    background-color: #26aa00;
  }
}
.lee-userName-behind1 {
  background-color: #989899;
}
.lee-userName-behind2 {
  background-color: #16bb00;
}
.lee-popover {
  display: none;
}

.lee-userName-behind1:hover .lee-popover {
  display: block;
}
.lee-userName-behind2:hover .lee-popover {
  display: block;
}

.lee-table-title {
  display: flex;
  /* background: #be1204; */
  justify-content: space-between;
  li {
    line-height: 36px;
    color: white;
    font-size: 12px;
    min-width: 8%;
    text-align: center;
  }
}

.table .ivu-table-header span {
  font-size: 12px;
}
.table .empty {
  text-align: center;
  padding: 10px;
}
.change-user-content {
  padding: 10px 32px 5px;
  width: 400px;
  overflow: hidden;

  .ivu-radio-group {
    padding-left: 20px;
  }
  .userType {
    line-height: 46px;
  }
  .slider {
    display: flex;
    align-items: center;
    .ivu-slider {
      margin: 10px 0;
    }
  }
  .ivu-tooltip {
    margin-top: -2px;
  }
}
.change-user-content-third {
  & > div:nth-child(2) {
    padding-top: 30px;
  }
  .span-main {
    color: #ff7614;
    padding-left: 20px;
  }
}
.change-user-content-second {
  display: flex;
  line-height: 46px;
}
.change-user-content-first {
  display: flex;
  line-height: 30px;
  margin-bottom: 20px;
  & > div {
    height: 30px;
    width: 40px;
    background: url(~@/assets/images/icon.png) -235px -5px no-repeat;
  }
}
.user-manage {
  .lee-opera-div {
    background: url(~@/assets/images/icon.png) -578px -572px no-repeat;
    height: 42px;
    cursor: pointer;
    // position: relative;
  }
  .lee-opera-div:hover .lee-opera-div-inside {
    display: block;
  }
  .lee-opera-div-inside {
    position: absolute;
    z-index: 1000;
    display: none;
    background-color: white;
    padding: 0 5px;
    border: 1px solid #555;
    border-radius: 4px;
    left: 40px;
    & > p {
      width: 52px;
      padding: 4px 0;
      text-align: center;
      border-bottom: 1px solid #999;
      color: #555;
    }
    & > p:nth-child(2) {
      color: #999;
      cursor: not-allowed;
    }
    & > p:last-child {
      border-bottom: none;
    }
  }
  .table {
    overflow: visible;
    position: relative;
  }
  .ivu-table {
    font-size: 12px !important;
    overflow: visible !important;
  }
  .ivu-table-body {
    // overflow: visible !important;
    overflow-y: hidden !important;
    overflow-x: auto !important;
  }
  .ivu-table-cell {
    overflow: visible !important;
  }
}
</style>

<style scoped>
.user-manage {
  padding-top: 12px;
}
.user-manage .search {
  text-align: right;
  /*height: 30px;*/
}
.user-manage .addUser {
  float: left;
  width: 104px;
}
.user-manage .addUser button {
  width: 114px;
  height: auto;
  white-space: normal;
}
.user-manage .addUser button i {
  margin-right: 6px;
  margin-left: -7px;
  font-size: 14px;
}
.user-manage .table {
  width: 100%;
  margin: 0;
  margin-top: 13px;
  overflow: hidden;
}
.user-manage .datetext {
  display: inline-block;
  vertical-align: top;
  font-size: 14px;
  margin-top: 4px;
  margin-left: 5%;
}
.user-manage .button {
  display: inline-block;
  vertical-align: top;
  margin-left: 22px;
}
.user-manage .selectDate,
.user-manage .select-user {
  display: inline-block;
  vertical-align: top;
  margin-left: 20px;
}
.user-manage .selectDate {
  margin-left: 0;
}
.user-manage .wxbutton {
  margin-left: 33%;
}
.user-manage .modal1 {
  height: 100px;
  width: 500px;
  margin-left: 5%;
}
.user-manage .modal1img {
  float: left;
}
.user-manage .modal1info {
  float: left;
}
.user-manage .infotitle {
  font-size: 20px;
  font-weight: bold;
  margin-left: 15px;
}
.user-manage .infodate {
  font-size: 15px;
  margin-left: 15px;
  color: grey;
}
.user-manage .modal1status {
  float: left;
  width: 100px;
  height: 30px;
  margin-top: 15px;
  margin-left: 15%;
  background-color: grey;
  text-align: center;
  padding-top: 7px;
  border-radius: 13px 13px 13px 13px;
}
.user-manage .modal1detail {
  margin-bottom: 10px;
}
.user-manage .modal1status span {
  color: white;
}
.user-manage .detailnum {
  margin-left: 8%;
}
.user-manage .detailcss {
  margin-left: 20px;
}
/* .user-manage .circle {
    float:left;
    display: block;
    background: rgb(197, 189, 189);
    border-radius: 50%;
    height: 40px;
    width: 40px;
    margin: 0;
    background: -webkit-radial-gradient(5px 5px, circle, white, grey);
    background: -moz-radial-gradient(5px 5px, circle, white, grey);
    background: radial-gradient(5px 5px, circle, white, grey);
} */
.user-manage .left {
  margin-right: 1px;
}
.user-manage .first {
  margin-left: 5px;
}
.user-manage .text {
  margin-left: 40%;
  line-height: 40px;
  font-weight: bold;
}
.user-manage .button {
  height: 32px;
  text-align: right;
}
.user-manage .ivu-input {
  height: 30px;
}
.user-manage .ivu-btn-primary {
  /*width: 66px;*/
}
.user-manage >>> .ivu-table th:nth-child(6) .ivu-table-cell {
  padding-left: 9px !important;
}
.user-manage >>> .ivu-table td {
  background: transparent;
}
.user-manage >>> .ivu-table-row:nth-child(even) {
  background: #e2e2e2;
}
.user-manage >>> .ivu-table-cell .color-red {
  color: #be1204;
}
.ivu-form >>> .ivu-form-item-label {
  padding-right: 6px;
}
.v-transfer-dom >>> .yidun_tips__text {
  margin-left: 40px;
}
.ivu-form-item-content {
  margin-left: 0 !important;
  font-size: 14px;
  color: #313131;
}
.ivu-form .ivu-form-item-label {
  padding-right: 8px;
}
.ivu-form-item-error-tip {
  font-size: 12px;
}
.ivu-form-item {
  margin-bottom: 20px;
}
/* slider */
.v-transfer-dom >>> .ivu-slider {
  display: inline-block;
  width: 180px;
  margin: 0 7px;
  position: relative;
  top: -1px;
}
.slider >>> span {
  display: inline-block;
  vertical-align: top;
  /* margin-left:-3px; */
  color: #ff7614;
  font-size: 12px;
}

.user-manage .table {
  overflow: visible;
}
</style>
