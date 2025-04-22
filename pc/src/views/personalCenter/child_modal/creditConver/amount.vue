<template>
  <div class="conver-amount">
    <!-- 操作 -->
    <div class="handler">
      <Form v-if="plateList.length">
        <FormItem :label="$tex('平台转出')">
          <Select
            v-model="plateOutId"
            style="width:200px"
            clearable
            @on-change="getMaxConverMoney"
          >
            <Option
              v-for="itm in plateList"
              :value="itm.platformId"
              :disabled="itm.balance <= 0 || itm.platformId === plateInId"
              :key="itm.gameAccountId"
              >{{ itm.platformName }}&nbsp;&nbsp;&nbsp;{{
                itm.balance | splitDecimalOf2
              }}
              <!--                <span v-if="hasPermission('element.unit')">{{itm.currencyIcon}}</span>-->
              <span v-if="hasPermission('element.unit')">{{ $tex("元") }}</span>
            </Option>
          </Select>
        </FormItem>
        <FormItem :label="$tex('平台转入')">
          <Select
            v-model="plateInId"
            clearable
            @on-change="onInPlatChange"
            style="width:200px"
          >
            <Option
              v-for="item in plateList"
              :value="item.platformId"
              :disabled="plateOutId === item.platformId"
              :key="item.gameAccountId"
              >{{ item.platformName }}&nbsp;&nbsp;&nbsp;{{
                item.balance | splitDecimalOf2
              }}
              <!--                <span v-if="hasPermission('element.unit')">{{item.currencyIcon}}</span>-->
              <span v-if="hasPermission('element.unit')">{{ $tex("元") }}</span>
            </Option>
          </Select>
        </FormItem>
        <FormItem :label="$tex('转换额度')">
          <div
            class="conver-amount__input ivu-input-wrapper ivu-input-type"
            style="width:170px;"
          >
            <zk-input
              v-model="chargeMoney"
              type="number"
              :disabled="!plateOutId || !plateInId"
              :max="maxAmount"
              :min="1"
              :placeholder="$tex('请输入转换金额')"
            />
            <span class="unit">{{ curExChangeRate.scurIcon }}</span>
          </div>
        </FormItem>
        <FormItem label="">
          <div v-if="showCurrencyExchange" class="currency-exchange">
            <img src="~@/assets/images-v6/jinggao.png" alt="" />
            {{ chargeMoney }}{{ curExChangeRate.scur }}={{ tcurMoney
            }}{{ curExChangeRate.tcur }}
          </div>
          <Button
            type="primary"
            size="small"
            @click="conver"
            :disabled="!plateInId || !plateOutId || chargeMoney < 1"
            >{{ $tex("确认转换") }}</Button
          >
        </FormItem>
      </Form>
    </div>
    <!-- 表格 -->
    <div class="table tab-body" :class="{ active: hasVerflow }">
      <ul ref="tab-wrapper">
        <li v-for="(itm, idx) in plateList" :key="itm.plateformId">
          <dl>
            <dt>{{ itm.platformName }}</dt>
            <dd>
              <div>
                <span>{{ itm.balance | splitDecimalOf2 }}</span>
                <!--                  <span v-if="hasPermission('element.unit')">-->
                <!--                      {{itm.currencyIcon}}-->
                <!--                  </span> -->
                <span v-if="hasPermission('element.unit')">
                  {{ $tex("元") }}
                </span>
              </div>
              <div>
                <Button
                  @click="refreshBalance(itm.platformId, idx)"
                  :disabled="diffs[idx] !== '' && diffs[idx] !== -1"
                  >{{
                    diffs[idx] !== "" && diffs[idx] !== -1
                      ? `${diffs[idx]}s`
                      : $tex("刷新")
                  }}</Button
                >
              </div>
            </dd>
          </dl>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ZkInput } from "@/components/ZkInput";
import { mapGetters } from "vuex";
import { hasPermission } from "@/utils/authority-utils";
import numeral from "numeral";

export default {
  components: { ZkInput },
  data() {
    return {
      amount: 0, //转换额度
      plateList: [],
      plateOutId: "", //转出的平台
      plateInId: "", //转入的平台
      chargeMoney: 1, //额度
      hasClick: false,
      // hasRefresh: false,
      hasVerflow: false,
      timers: [], //计时器组
      diffs: [], //秒数
      exchangeCache: {},
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    tcurMoney() {
      const chargeMoney = this.chargeMoney || 0;
      return numeral(chargeMoney)
        .multiply(this.curExChangeRate.exchangeRate)
        .format("0.00", Math.floor);
    },
    curOutPlat() {
      return (
        this.plateList.find((plat) => {
          return plat.platformId === this.plateOutId;
        }) || {}
      );
    },
    curInPlat() {
      return (
        this.plateList.find((plat) => {
          return plat.platformId === this.plateInId;
        }) || {}
      );
    },
    showCurrencyExchange() {
      return (
        hasPermission("element.currencyExchange") &&
        this.curOutPlat.currency &&
        this.curInPlat.currency &&
        this.curExChangeRate.scur &&
        this.curExChangeRate.tcur
      );
    },
    curExChangeRate() {
      return (
        this.exchangeCache[
          `${this.curOutPlat.currency}-${this.curInPlat.currency}`
        ] || {
          exchangeRate: 1,
          scur: "",
          scurIcon: null,
          tcur: "",
          tcurIcon: null,
        }
      );
    },
    maxAmount() {
      return hasPermission("element.currencyExchange")
        ? Number(
            numeral(this.amount)
              .divide(this.curExChangeRate.exchangeRate)
              .format("0", Math.floor)
          )
        : this.amount;
    },
  },
  methods: {
    hasPermission,
    /**
     * 刷新金额
     */
    refreshBalance(plateId, idx) {
      if (this.diffs[idx] !== "" && this.diffs[idx] !== -1) return; //倒计时未结束返回
      let totalTime = 30;
      this.timers[idx] && clearTimeout(this.timers[idx]);
      let timer = setInterval(() => {
        totalTime -= 1;
        if (totalTime < 0) {
          // clearTimeout(this.timers[idx])
          clearTimeout(timer);
        }
        this.diffs.splice(idx, 1, totalTime);
        if (!this.timers[idx]) {
          this.timers.splice(idx, 1, timer);
        }
      }, 1000);
      this.getPlateForm({ platformId: plateId }, true);
    },
    /**
     * 确认转换
     */
    conver() {
      if (this.hasClick) return;
      this.hasClick = true;
      let params = {
        money: this.chargeMoney,
        platformId: this.plateOutId,
        toPlatformId: this.plateInId,
      };
      this.$emit("handler-spin", true);
      this.$http
        .post("/party/v2/game/transform", params, {
          unenc: false,
          userId: true,
        })
        .then((res) => {
          this.$emit("handler-spin", false);
          this.hasClick = false;
          if (res.data.code !== 0) return;
          this.$Message.success(this.$tex("额度转换成功"));
          this.plateOutId = "";
          this.plateInId = "";
          this.chargeMoney = 1;
          this.plateList = [];
          this.$nextTick(() => {
            //处理下拉框金额不更新bug
            this.plateList = res.data.data;
            const mainPlat = this.plateList.find((item) => item.isMain === "1");
            if (mainPlat) {
              this.user.balance = mainPlat.balance;
              this.$store.commit("getUser", this.user);
              localStorage.setItem("user", JSON.stringify(this.user));
            }
          });
        });
    },
    /**
     * 计算允许转出的最大金额
     */
    async getMaxConverMoney() {
      if (!this.plateOutId) return;
      this.getPlateForm({ platformId: this.plateOutId });
      this.handleExChange();
    },
    onInPlatChange() {
      this.handleExChange();
    },
    async handleExChange() {
      if (this.curOutPlat.currency === this.curInPlat.currency) {
        return;
      }
      this.$emit("handler-spin", true);
      if (this.curOutPlat.currency && this.curInPlat.currency) {
        if (
          !this.exchangeCache[
            `${this.curOutPlat.currency}-${this.curInPlat.currency}`
          ]
        ) {
          const mainPlat =
            this.curOutPlat.isMain === "1" ? this.curOutPlat : this.curInPlat;
          const thirdPlat =
            this.curOutPlat.isMain === "0" ? this.curOutPlat : this.curInPlat;
          const exchangeInfo = await this.$store.dispatch(
            "queryCurrencyExchangeByScur",
            {
              scur: thirdPlat.currency,
              tcur: mainPlat.currency,
            }
          );
          this.$set(
            this.exchangeCache,
            `${this.curOutPlat.currency}-${this.curInPlat.currency}`,
            exchangeInfo
          );
          this.$set(
            this.exchangeCache,
            `${this.curInPlat.currency}-${this.curOutPlat.currency}`,
            exchangeInfo
          );
        }
      }
      this.$emit("handler-spin", false);
    },
    getPlateForm(params, flag) {
      this.$emit("handler-spin", true);
      if (params.platformId) {
        //选择转出下拉框或点击刷新
        let plateform = this.plateList.filter((item) => item.isMain === "1")[0]; //主平台
        if (plateform.platformId === params.platformId) {
          //主平台
          this.$http
            .post(
              "/api/v2/user/queryBalance",
              {},
              { userId: true, unenc: true }
            )
            .then((response) => {
              this.chargeMoney = 1;
              // if (flag) this.hasRefresh = false;
              this.$emit("handler-spin", false);
              if (response.data.code !== 0) return;
              let balance = response.data.data.balance;
              this.plateList[0].balance = balance;
              this.user.balance = balance;
              localStorage.setItem("user", JSON.stringify(this.user));
              if (!flag) this.amount = balance;
              //转出下拉框选择主平台
              else if (
                this.plateOutId &&
                this.plateOutId === plateform.platformId
              ) {
                //选择了主平台转出并刷新主平台
                this.amount = balance;
              }
              return;
            });
          return;
        }
      }
      this.$http
        .post("/party/v2/game/queryLotUserAccount", params, {
          unenc: true,
          userId: true,
        })
        .then((res) => {
          this.$emit("handler-spin", false);
          // if (flag) this.hasRefresh = false;
          if (res.data.code !== 0) return;
          let plateList = res.data.data;
          if (!params.platformId) {
            //查询所有的平台
            this.plateList = plateList;
            this.timers = new Array(plateList.length).fill("");
            this.diffs = new Array(plateList.length).fill("");
            this.hasVerflow = this.plateList.length > 6 ? true : false;
            return;
          }
          //选择转出下拉框或者刷新查询某个非主平台
          let platformId = plateList[0].platformId;
          let list = this.plateList.filter(
            (item) => item.platformId !== platformId
          );
          let idx = this.plateList.findIndex((value, index) => {
            return value.platformId === platformId;
          });
          this.plateList = [];
          this.$nextTick(() => {
            //更新列表
            // this.plateList = plateList[0].isMain === '1' ? plateList.concat(list) : list.concat(plateList);
            idx !== -1 && list.splice(idx, 0, plateList[0]);
            this.plateList = list;
            if (this.plateOutId && this.plateOutId === platformId) {
              //选择了转出下拉框并且刷新这个平台
              this.amount = this.plateList.filter(
                (item) => item.platformId === this.plateOutId
              )[0].balance;
            }
          });
        });
    },
  },
  created() {
    this.getPlateForm({});
  },
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
.conver-amount {
  padding-top: 40px;
  .table {
    font-size: 0;
    max-height: 361px;
    overflow: auto;
    &.active {
      border-top: 1px solid #e2e2e2;
      border-bottom: 1px solid #e2e2e2;
      li {
        &:nth-child(1) {
          border-top: none;
        }
        &:nth-child(2) {
          border-top: none;
        }
        &:nth-last-child(2) {
          // dd {
          //   border-bottom: none;
          // }
        }
        &:nth-last-child(1) {
          dd {
            border-bottom: none;
          }
        }
      }
    }
    li {
      display: inline-block;
      width: 50%;
      font-size: 14px;
      border-left: 1px solid #e2e2e2;
      border-right: 1px solid #e2e2e2;
      &:nth-child(2n + 1) {
        border-top: none;
      }
      &:nth-child(1) {
        border-top: 1px solid #e2e2e2;
      }
      &:nth-child(2n) {
        border-left: none;
        border-bottom: none;
      }
      &:nth-child(2) {
        border-top: 1px solid #e2e2e2;
      }
      dt {
        width: 100%;
        height: 45px;
        line-height: 44px;
        padding-left: 23px;
      }
      dd:extend(.conver-amount .table li dt) {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-right: 24px;
        color: #ff7614;
        font-size: 20px;
        border-bottom: 1px solid #e2e2e2;
        .ivu-btn {
          height: 30px;
          vertical-align: 3px;
        }
      }
    }
  }
  .handler {
    padding-left: 20px;
    // margin-top: 40px;
    margin-bottom: 40px;
    @{deep} .ivu-form-item {
      margin-bottom: 16px;
    }
    @{deep} .ivu-form-item-label {
      width: 96px;
      padding-right: 40px;
      font-size: 14px;
    }
    .ivu-input-wrapper {
      width: 172px;
      height: 30px;
    }
    .ivu-btn {
      width: 76px;
      margin-left: 96px;
    }
  }
}
.currency-exchange {
  font-size: 14px;
  color: #b2b2b2;
  padding-left: 96px;
  img {
    width: 15px;
    height: 15px;
    margin-right: 4px;
    float: none;
    vertical-align: text-bottom;
  }
}
.conver-amount__input {
  position: relative;
  @{deep} .zk-input__inner {
    width: 100%;
  }

  .unit {
    position: absolute;
    right: 3px;
    top: 9px;
  }
}
</style>
