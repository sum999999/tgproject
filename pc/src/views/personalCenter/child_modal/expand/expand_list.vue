<template>
  <div class="expand-list">
    <div class="flex items-center">
      <!-- <div  v-if="!isDianziVersion" class="addUser mr-4"> -->
      <div class="addUser mr-4">
        <Button type="warning" class="wxbutton2" @click="createExpand">
          <Icon type="plus-round" color="#fff;"></Icon>
          {{ $tex("创建新邀请码") }}
        </Button>
      </div>
      <!-- <div>{{$tex("起始日期")}} :</div>
      <div class="ml-1">
        <Row>
          <Col span="12">
          <DatePicker
            v-model="data.updateTime"
            type="daterange"
            placement="bottom-end"
            :placeholder="$tex('请选择查询时间')"
            :options="option"
            :editable="false"
            style='width:200px;'
          ></DatePicker>
          </Col>
        </Row>
      </div>
      <div class="grow"></div>
      <div class="button">
        <Button
          type="primary"
          class="wxbutton"
          @click="search"
        >{{$tex("搜索")}}</Button>
      </div> -->
    </div>
    <div class="table">
      <Table
        :columns="columns"
        :data="expandList"
        :loading="loading"
        stripe
      ></Table>
    </div>
    <page
      :total="pageParams.total"
      :currentPage="pageParams.currentPage"
      :pageSize="10"
      @get-Page-Data="queryExpandList"
    ></page>
    <!-- 新增邀请码 -->
    <modal
      :modalShow="detailFlag"
      :title="title"
      :width="440"
      :maskClosable="true"
      @btn-cancel="
        detailFlag = false;
        $refs['expandInfo'].resetFields();
      "
      @btn-ok="saveOrUpdate(expandInfo)"
    >
      <div slot="content" class="expand-modal-content">
        <Form ref="expandInfo" :model="expandInfo" :rules="ruleInline">
          <FormItem prop="status">
            <span class="status">{{ $tex("邀请码状态") }}：</span>
            <div>
              <i-switch size="small" v-model="iswitchStatus"></i-switch>
            </div>
            &nbsp;&nbsp;
            <span class="open-code" v-if="iswitchStatus">{{
              $tex("启用邀请码")
            }}</span>
            <span class="close-code" v-else-if="!iswitchStatus">{{
              $tex("禁用邀请码")
            }}</span>
          </FormItem>
          <FormItem prop="expandCode">
            <Input
              v-show="expandInfo.expandId == null"
              type="text"
              :disabled="expandInfo.expandId != null"
              v-model="expandInfo.expandCode"
              :placeholder="$tex('邀请码')"
              :maxlength="20"
              @input="changeLength"
            />
            <Input
              v-show="expandInfo.expandId !== null"
              type="text"
              :disabled="expandInfo.expandId != null"
              v-model="expandInfo.expandCode"
              :placeholder="$tex('邀请码')"
              :maxlength="20"
              @input="changeLength"
            />
            <span v-show="expandInfo.expandId == null" class="code-size"
              >{{ expandCodeSize }}/20</span
            >
            <Button
              v-show="expandInfo.expandId == null"
              type="warning"
              style="display: inline-block;"
              @click="createExpandCode"
            >
              <font class="color-yellow">{{ $tex("生成邀请码") }}</font>
            </Button>
          </FormItem>
          <!--   <FormItem label="用户类别 : ">

            <RadioGroup v-model="expandInfo.type">
              <Radio label="10"
                     :disabled="expandInfo.expandId != null">代理</Radio>
              <Radio label="00"
                     :disabled="expandInfo.expandId != null">会员</Radio>
            </RadioGroup>
          </FormItem> -->
          <FormItem :label="`${$tex('推广类型')} : `" prop="platformCode">
            <Select v-model="expandInfo.platformCode" style="width:260px">
              <Option
                v-for="item in plateFormList"
                :value="item.platformCode"
                :key="item.value"
                >{{ item.platformName }}</Option
              >
            </Select>
          </FormItem>
          <FormItem prop="bonusGroupName">
            <span class="rebate">{{ $tex("代理返点") }}：</span>
            <span>
              <font color="ff7614">{{
                "(" +
                  ((expandInfo.bonusGroupName - 1800) / 20).toFixed(1) +
                  "%) " +
                  Number(expandInfo.bonusGroupName).toFixed(0)
              }}</font>
            </span>
            <div class="slider" v-if="bonusGroup[0] != bonusGroup[1]">
              <span color="ff7614"
                >{{ bonusGroup[0] }} ({{
                  ((groupName.min - 1800) / 20).toFixed(1)
                }}%)</span
              >
              <Slider
                :disabled="
                  (disableSlider && title !== $tex('创建新邀请码')) ||
                    stickBonusGroup
                "
                :value="+Number(expandInfo.bonusGroupName).toFixed(0)"
                :min="groupName.min"
                :max="groupName.max"
                :step="groupName.step"
                @on-input="changeGroupName"
                :tip-format="showProgress"
              ></Slider>
              <span
                >{{ bonusGroup[1] }} ({{
                  ((groupName.max - 1800) / 20).toFixed(1)
                }}%)</span
              >
            </div>
          </FormItem>
        </Form>
      </div>
    </modal>
    <modal
      :modalShow="showExpUrl"
      :title="$tex('推广链接')"
      @btn-cancel="showExpUrl = false"
      @btn-ok="copyUrl()"
      :okText="$tex('复制链接')"
      :maskClosable="true"
    >
      <div slot="content">
        <span style="user-select:none">{{ expUrl }}</span>
      </div>
    </modal>
    <!-- 显示详情 -->
  </div>
</template>

<script>
import dateUtil from "@/utils/format_date.js";
import util from "@/utils/utils";
import page from "@/components/page.vue";
import modal from "@/components/modal.vue";
import common from "../../common/mixin";
import { ExpandStatus } from "@/constant/user";
import { convert2LocalDateTime, convert2ServerDateTime } from "@/filters";
import { mapGetters } from "vuex";

export default {
  components: { page, modal },
  mixins: [common],
  data() {
    /*   const validatePlatFormCode = (rule, value, callback) => { //同意协议
        if (!value) {
          callback(new Error('请选择推广类型'));
        } else {
          callback();
        }
      } */
    const startTime = new Date();
    startTime.setHours(0);
    startTime.setMinutes(0);
    startTime.setSeconds(0);
    const endTime = new Date();
    endTime.setHours(23);
    endTime.setMinutes(59);
    endTime.setSeconds(59);
    return {
      disableSlider: false, //是否禁止
      stickBonusGroup: false, //是否禁止
      maxPriGroupDiffVal: 0, //本级与代理的最大奖金组之差
      isUpDateSwitch: false,
      loading: false,
      userInfo: {},
      groupName: {},
      detailFlag: false,
      title: "",
      expandList: [],
      groupName: { step: 2, min: 0, max: 0 },
      expUrl: "",
      showExpUrl: false,
      // dispGroupName:0,
      bonusGroup: [], //添加的
      data: {
        updateTime: [startTime, endTime],
      },
      pageParams: {
        total: 0,
        currentPage: 1,
      },
      expandInfo: {
        expandId: null,
        expandCode: "",
        status: true,
        type: "10",
        // type: '02',
        platformCode: "",
      },
      expandCodeSize: 0,
      iswitchStatus: false,
      columns: [
        {
          title: this.$tex("最后更新"),
          key: "updateTime",
          width: 145,
          render: (h, params) => {
            return h("span", convert2LocalDateTime(params.row.updateTime));
          },
        },
        {
          title: this.$tex("邀请码"),
          key: "expandCode",
          width: 156,
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: "#be1204",
                },
              },
              params.row.expandCode
            );
          },
        },
        {
          title: this.$tex("用户类别"),
          key: "type",
          width: 86,
          render: (h, params) => {
            let type =
              params.row.type === "00" ? this.$tex("会员") : this.$tex("代理");
            return h("span", type);
          },
        },
        {
          title: this.$tex("注册用户数"),
          key: "registerCount",
          width: 94,
        },
        {
          title: this.$tex("返点"),
          key: "bonusGroupName",
          width: 76,
          render: (h, params) => {
            // let text = parseInt(params.row.bonusGroupName).toFixed(2)
            return h("div", [
              h("p", parseInt(params.row.bonusGroupName)),
              h(
                "p",
                "(" +
                  ((params.row.bonusGroupName - 1800) / 20).toFixed(1) +
                  "%" +
                  ")"
              ),
            ]);
          },
        },
        {
          title: this.$tex("状态"),
          key: "statusDesc",
          width: 61,
          render: (h, params) => {
            return h("p", params.row.statusDesc);
          },
        },
        {
          title: this.$tex("操作"),
          key: "",
          width: 124,
          render: (h, params) => {
            return h(
              "div",
              {
                class: `expand-content ${
                  params.row.status === ExpandStatus.kForceDisable
                    ? "disable"
                    : ""
                }`,
              },
              [
                h(
                  "span",
                  {
                    on: {
                      click: () => {
                        if (params.row.status === ExpandStatus.kForceDisable) {
                          return this.$Modal.confirm({
                            title: this.$tex("操作提示"),
                            content: this.$tex("请联系在线客服"),
                            okText: this.$tex("联系客服"),
                            onOk: () => {
                              window.open(this.servicer.url, "_blank");
                            },
                          });
                        }
                        this.showUrlDeatil(params.row);
                      },
                    },
                  },
                  this.$tex("链接")
                ),
                h(
                  "span",
                  {
                    on: {
                      click: () => {
                        if (params.row.status === ExpandStatus.kForceDisable) {
                          return this.$Modal.confirm({
                            title: this.$tex("操作提示"),
                            content: this.$tex("请联系在线客服"),
                            okText: this.$tex("联系客服"),
                            onOk: () => {
                              window.open(this.servicer.url, "_blank");
                            },
                          });
                        }
                        this.updateExpand(params.row);
                      },
                    },
                  },
                  this.$tex("修改")
                ),
                h(
                  "span",
                  {
                    class: "delete",
                    on: {
                      click: () => {
                        if (params.row.status === ExpandStatus.kForceDisable) {
                          return this.$Modal.confirm({
                            title: this.$tex("操作提示"),
                            content: this.$tex("请联系在线客服"),
                            okText: this.$tex("联系客服"),
                            onOk: () => {
                              window.open(this.servicer.url, "_blank");
                            },
                          });
                        }
                        this.delExpand(params.row.expandId, params.index);
                      },
                    },
                  },
                  [
                    h(
                      "i",
                      {
                        class: "i-red-delete",
                        style: {
                          display: "inline-block",
                          verticalAlign: "-2px",
                        },
                      },
                      ""
                    ),
                  ]
                ),
              ]
            );
          },
        },
      ],
      ruleInline: {
        /*  platformCode: [
           { validator: validatePlatFormCode, trigger: 'change' }
         ] */
      },
      plateFormList: [], //绑定的平台
      fixedBonus: "",
    };
  },
  computed: {
    ...mapGetters(["isDianziVersion"]),
    servicer() {
      return this.$store.state.servicer;
    },
  },
  methods: {
    showProgress(val) {
      //显示赔率
      return `${val} (${((val - 1800) / 20).toFixed(1)}%)`;
    },
    rowClassName(row, index) {
      if (index === 1) {
        return "demo-table-info-row";
      } else if (index === 3) {
        return "demo-table-error-row";
      }
      return "";
    },
    search() {
      // this.pageChange(1);
      this.queryExpandList(1);
    },
    formatDate(value) {
      return convert2LocalDateTime(value);
    },
    pageChange(page) {
      //切换页码
      if (this.pageParams.currentPage == page) {
        return;
      }
      this.queryExpandList(page);
    },
    updateExpand(expandInfo) {
      //点击修改
      // debugger;
      this.detailFlag = true;
      this.title = this.$tex("修改邀请码");

      // var user = JSON.parse(localStorage.getItem('user'));
      let useBonusGroupName = Number(expandInfo.bonusGroupName);
      var user = this.$store.state.user;
      let minBonusGroup = Number(user.minBonusGroupName);
      let bonusGroup = Number(user.bonusGroupName);
      let maxBonusGroup = bonusGroup - this.maxPriGroupDiffVal;
      let newMaxBonusGroup =
        maxBonusGroup < minBonusGroup ? minBonusGroup : maxBonusGroup;
      newMaxBonusGroup =
        newMaxBonusGroup < useBonusGroupName
          ? useBonusGroupName
          : newMaxBonusGroup;
      // this.$set(this.groupName, "min", Number(user.minBonusGroupName));
      // this.$set(this.groupName, "max", Number(user.bonusGroupName));

      // this.$set(this.groupName, "min", minBonusGroup);
      this.$set(this.groupName, "min", minBonusGroup);
      this.$set(this.groupName, "max", newMaxBonusGroup);

      this.expandInfo = Object.assign({}, expandInfo);
      this.iswitchStatus = this.expandInfo.status == 1 ? true : false;
      this.$set(
        this.expandInfo,
        "bonusGroupName",
        Number(expandInfo.bonusGroupName)
      );
      this.$set(
        this.expandInfo,
        "minBonusGroupName",
        Number(user.minBonusGroupName)
      );
      this.$set(this.expandInfo, "platformCode", expandInfo.platformCode);
      // this.$set(thjis.expandInfo,'plat')
    },
    createExpand() {
      this.title = this.$tex("创建新邀请码");
      this.$set(this.expandInfo, "expandId", null);
      var user = this.$store.state.user;

      let minBonusGroup = Number(user.minBonusGroupName);
      let bonusGroup = Number(user.bonusGroupName);
      let maxBonusGroup = bonusGroup - this.maxPriGroupDiffVal;
      let newMaxBonusGroup =
        maxBonusGroup < minBonusGroup ? minBonusGroup : maxBonusGroup;
      this.$set(this.groupName, "min", minBonusGroup);
      this.$set(this.groupName, "max", newMaxBonusGroup);
      // this.$set(this.groupName, "min", Number(user.minBonusGroupName));
      // this.$set(this.groupName, "max", Number(user.bonusGroupName));

      this.$set(this.expandInfo, "expandCode", "");
      //this.$set(this.expandInfo, 'platformCode', ''); //默认平台
      this.iswitchStatus = true;
      //默认减少一个1点(代理返点)
      // let oriBonusGroupName = Number(user.bonusGroupName) - 20;
      let oriBonusGroupName = null;
      if (this.fixedBonus && this.fixedBonus.length != 0) {
        // 代理返点固定
        this.stickBonusGroup = true;
        oriBonusGroupName = newMaxBonusGroup;
      } else {
        // 代理返点可修改
        oriBonusGroupName = newMaxBonusGroup - 20;
      }
      oriBonusGroupName =
        oriBonusGroupName < minBonusGroup ? minBonusGroup : oriBonusGroupName;

      this.$set(this.expandInfo, "bonusGroupName", oriBonusGroupName);

      // this.$set(
      //   this.expandInfo,
      //   "minBonusGroupName",
      //   Number(user.minBonusGroupName)
      // );

      this.$set(this.expandInfo, "minBonusGroupName", minBonusGroup);

      this.createExpandCode();
      // this.bonusGroup.splice(0, 0, Number(user.minBonusGroupName)); //添加的
      // this.bonusGroup.splice(1, 0, Number(user.bonusGroupName)); //添加的
      this.bonusGroup.splice(0, 0, minBonusGroup); //添加的
      this.bonusGroup.splice(1, 0, newMaxBonusGroup); //添加的
      this.detailFlag = true;
    },
    saveOrUpdate(expandInfo) {
      if (
        expandInfo.expandCode.length <= 5 ||
        /[^A-Za-z0-9]/g.test(expandInfo.expandCode)
      ) {
        this.$Message.info(
          this.$tex("邀请码必须为{min}~{max}位的字母或数字组成", {
            min: 6,
            max: 20,
          })
        );
        return;
      }
      this.$set(expandInfo, "status", this.iswitchStatus ? "1" : "0");
      //add by xiaojiji
      if (!this.expandInfo.type) {
        this.$set(expandInfo, "type", "10");
      }
      // end add
      var url =
        expandInfo.expandId == null
          ? "/api/v2/user/addExpand"
          : "/api/v2/user/modifyExpand";
      this.$refs["expandInfo"].validate((valid) => {
        if (valid) {
          this.$http
            .post(url, expandInfo, { userId: true })
            .then((response) => {
              if (response.data.code == 0) {
                this.detailFlag = false;
                if (expandInfo.expandId == null) {
                  this.showExpUrl = true;
                  this.expUrl = response.data.data.expandQrCode;
                } else {
                  this.$Message.info(this.$tex("操作成功"));
                }
                this.queryExpandList(1);
              }
            });
        }
      });
    },
    showUrlDeatil(item) {
      this.expUrl = item.expandQrCode;
      this.showExpUrl = true;
    },
    copyUrl() {
      this.showExpUrl = false;
      util.copyText(this.expUrl);
    },
    delExpand(id, index) {
      //删除邀请码
      this.$http
        .post("/api/v2/user/deleteExpand", { expandId: id }, { userId: true })
        .then((response) => {
          if (response.data.code == 0) {
            this.$Message.info(this.$tex("删除成功"));
            this.expandList.splice(index);
            this.queryExpandList(1);
          }
        });
    },
    queryExpandList(page) {
      // debugger;
      this.loading = true;
      var startTime = "",
        endTime = "";
      if (this.data.updateTime.length > 0) {
        if (this.data.updateTime[0] != null) {
          startTime = convert2ServerDateTime(this.data.updateTime[0]);
        }
        if (this.data.updateTime[1] != null) {
          this.data.updateTime[1].setHours(23);
          this.data.updateTime[1].setMinutes(59);
          this.data.updateTime[1].setSeconds(59);
          endTime = convert2ServerDateTime(this.data.updateTime[1]);
        }
      }
      this.$http
        .post(
          "/api/v2/user/queryUserExpandList",
          { current: page, startTime: startTime, endTime: endTime },
          { userId: true, unenc: true }
        )
        .then((response) => {
          this.loading = false;
          const data = response.data;
          if (data.code !== 0) return;
          const realData = data.data;
          this.expandList = realData.expandList;
          // this.pageParams.currentPage = page;
          // this.pageParams.total = realData.total;
          this.$set(this.pageParams, "currentPage", page);
          this.$set(this.pageParams, "total", realData.total);
        });
    },
    changeGroupName(val) {
      this.$set(this.expandInfo, "bonusGroupName", val);
    },
    createExpandCode() {
      this.$http
        .post("/api/v2/user/randomExpand", {}, { userId: true, unenc: true })
        .then((response) => {
          if (response.data.code !== 0) return;
          this.expandInfo.expandCode = response.data.data.expand;
          this.expandCodeSize = this.expandInfo.expandCode.length;
        });
    },
    changeLength() {
      this.expandCodeSize = this.expandInfo.expandCode.length;
    },
    getUserInfoFromLocal() {
      var user = JSON.parse(localStorage.getItem("user"));
      let userBonusGroup = Number(user.bonusGroupName);
      let userMinBonusGroup = Number(user.minBonusGroupName);
      // this.$set(this.groupName, "max", Number(user.bonusGroupName)); //2019.5.12 by xiaojiji
      // this.$set(this.groupName, "min", Number(user.minBonusGroupName));
      let newUserMaxBonusGroup = userBonusGroup - this.maxPriGroupDiffVal;
      let agencyMaxBonusGroup =
        newUserMaxBonusGroup < userMinBonusGroup
          ? userMinBonusGroup
          : newUserMaxBonusGroup;
      // this.$set(this.userInfo, "bonusGroupName", Number(user.bonusGroupName)); 2019.5.12
      this.$set(this.userInfo, "bonusGroupName", agencyMaxBonusGroup);
      // this.$set(  // 2019.5.12
      //   this.userInfo,
      //   "minBonusGroupName",
      //   Number(user.minBonusGroupName)
      // );
      this.$set(this.userInfo, "minBonusGroupName", userMinBonusGroup);
      // this.bonusGroup.splice(0, 0, Number(user.minBonusGroupName));
      // this.bonusGroup.splice(1, 0, Number(user.bonusGroupName));

      this.bonusGroup.splice(0, 0, userMinBonusGroup);
      this.bonusGroup.splice(1, 0, agencyMaxBonusGroup);
    },
    queryExpandPlatformType() {
      //2019 1.2 by xiaojiji
      this.$http
        .post(
          "/api/v2/user/queryExpandPlatformType",
          {},
          { userId: true, unenc: true }
        )
        .then((res) => {
          if (res.data.code !== 0) return;
          this.plateFormList = res.data.data.types;
          if (this.plateFormList.length) {
            let df = this.plateFormList[0];
            this.expandInfo.platformCode = df.platformCode;
            this.expandInfo.platformName = df.platformName;
            //   this.$set(this.expandInfo, 'platformCode', ''); //默认平台
          }
        });
    },
    // setPlateFormType (val) { //设置推广平台 2019 1.2 by xiaojiji
    //   if (!val) return
    //   // debugger;
    //   let name = this.plateFormList.filter(item => item.platformCode === val)[0].platformName;
    //   this.$set(this.expandInfo, 'platformName', name);
    // }
  },
  async created() {
    let config = await this.$store.dispatch("querySystemConfig");
    this.maxPriGroupDiffVal = config.EXPAND_BONUS_GROUP_VALUE;
    let bonusStatus = config.EXPAND_BONUS_GROUP_STATUE;
    bonusStatus === "0" && (this.disableSlider = true);
    bonusStatus === "2" && (this.disableSlider = true);
    this.fixedBonus = config.EXPAND_STICK_BONUSGROUP;
    this.getUserInfoFromLocal();
    this.queryExpandList(1);
    this.queryExpandPlatformType();
  },
};
</script>
<style></style>

<style lang="less">
.f(@f) {
  float: @f;
}
.back-bg (@bc;@br) {
  background-color: @bc;
  border: 1px solid @br;
}
.mix-one (@clr;@fs;@lh;@ml) {
  color: @clr;
  font-size: @fs;
  line-height: @lh;
  margin-left: @ml;
}
.border-radius (@radius: 4px) {
  border-radius: @radius;
}
.ivu-switch-disabled {
  background: #ccc;
  border-color: #ccc;
}
.expand-list {
  .table {
    margin-top: 13px;
    .expand-content {
      display: inline-block;
      vertical-align: top;
      line-height: 36px;
      text-align: center;
      font-size: 14px;
      span {
        display: inline-block;
        /*     color: @primary-color; */
        cursor: pointer;
        margin: 0 2px;
        &.ivu-switch-checked {
          .back-bg(#ffaa4e, #ffaa4e);
        }
        &.ivu-switch-disabled {
          cursor: not-allowed;
          background: #f3f3f3;
          border-color: #f3f3f3;
        }
        .delete {
          vertical-align: top;
        }
      }
    }
    .expand-content.disable {
      span {
        color: #ccc;
        cursor: not-allowed;
      }
      i {
        -webkit-filter: grayscale(100%); /* webkit */
        -moz-filter: grayscale(100%); /*firefox*/
        -ms-filter: grayscale(100%); /*ie9*/
        -o-filter: grayscale(100%); /*opera*/
        filter: grayscale(100%);
        filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
        filter: gray; /*ie9- */
      }
    }
  }
}
.v-transfer-dom {
  .expand-modal-content {
    form {
      margin-left: 39px;
      margin-top: 10px;
      .ivu-form-item {
        position: relative;
        margin-bottom: 25px;
        .ivu-form-item-error-tip {
          left: 67px;
        }
        &:first-child {
          .status {
            display: inline-block;
            margin-right: 20px;
            font-size: 14px;
            color: #313131;
          }
          div {
            display: inline-block;
            vertical-align: top;
          }
          .open-code {
            .mix-one(#ff7614, 14px, 32px, -6px);
          }
          .close-code {
            .mix-one(#a9a9a9, 14px, 32px, -6px);
          }
        }
        &:nth-child(2) {
          span {
            color: #a9a9a9;
          }
          .ivu-input-wrapper {
            width: 235px;
            &:nth-child(2) {
              width: 330px;
              height: 30px;
            }
          }
          .code-size {
            position: absolute;
            left: 194px;
            top: 2px;
            color: #a9a9a9;
          }
          button {
            position: relative;
            background: #fff;
            margin-left: 10px;
            /*   color: @expand-list-color;
            border: 1px solid @expang-list-border-color; */
            .border-radius();
          }
        }
        &:nth-child(3) {
          margin-bottom: 20px;
          color: #313131;
          .ivu-radio-group {
            position: relative;
            top: -2px;
            margin-left: 30px;
            .ivu-radio-wrapper {
              &:first-child {
                margin-right: 40px;
              }
            }
          }
        }
        &:last-child {
          .rebate {
            font-size: 14px;
            color: #313131;
            span {
              margin-left: 18px;
            }
          }
          .slider {
            margin-top: 25px;
            .ivu-slider {
              display: inline-block;
              position: relative;
              width: 180px;
              margin: 0 3px 0 6px;
            }
            span {
              display: inline-block;
              vertical-align: top;
              /*    color: @expand-list-color; */
              font-size: 12px;
              margin-left: 0;
            }
          }
        }
        .ivu-switch-checked {
          position: relative;
          top: -2px;
          &.ivu-switch-small {
            .back-bg(#ffaa4e, #ffaa4e);
          }
        }
        .ivu-switch-small {
          &:extend(.v-transfer-dom
              .expand-modal-content
              form
              .ivu-form-item
              .ivu-switch-checked);
          .back-bg(#aaa, #aaa);
        }
      }
    }
  }
}
</style>
