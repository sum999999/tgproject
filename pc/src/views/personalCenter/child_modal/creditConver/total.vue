<template>
  <div class="total-wrap">
    <div class="table">
      <ul>
        <li v-for="itm in plateList"
            :key="itm.plateformId">
          <dl>
            <dt>{{itm.platformName}}</dt>
            <dd>{{itm.balance|splitDecimalOf2}}</dd>
          </dl>
        </li>
      </ul>
    </div>
    <div class="handler">
      <Button type="primary"
              size="small"
              @click="total"
              :disabled="hasBalance">{{$tex("一键归户总额")}}</Button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      plateList: [],
      hasClick: false,//阻止重复点击
      hasBalance: false//非主平台是否余额不足
    }
  },
  methods: {
    /**
     * 判断非主平台余额是否全部不足
     */
    judgePlateBalance (plateList) {
      this.hasBalance = plateList.filter(item => item.balance <= 0 && item.isMain !== '1').length === this.plateList.length - 1 ? true : false;
    },
    /**
     * 一键归户
     */
    total () {
      if (this.hasClick) return;
      this.hasClick = true;
      let totalMoney = (this.plateList.filter(item => item.isMain !== '1').reduce((acc, cur, idx) => {
        return cur.balance + acc;
      }, 0));
      // if (!totalMoney) return;
      this.$emit('handler-spin', true);
      this.$http.post('/party/v2/game/regressionAccount', { money: `${totalMoney}` }, { unenc: false, userId: true }).then(res => {
        this.$emit('handler-spin', false);
        if (res.data.code !== 0) return;
        this.$Message.success(this.$tex('一键归户总额成功'));
        this.hasClick = false;
        this.plateList = res.data.data;
        this.judgePlateBalance(this.plateList);
      });
    },
    /**
     * 查询所有平台
     */
    getPlateForm () {
      this.$emit('handler-spin', true);
      this.$http.post('/party/v2/game/queryLotUserAccount', {}, { unenc: true, userId: true }).then(res => {
        this.$emit('handler-spin', false);
        if (res.data.code !== 0) return;
        this.plateList = res.data.data;
        this.judgePlateBalance(this.plateList);
      })
    }
  },
  created () {
    this.getPlateForm();
  }
}
</script>

<style lang="less" scoped>
.total-wrap {
    padding-top: 40px;
    .table {
        font-size: 0;
        color: #000;
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
                border-bottom: 1px solid #e2e2e2;
            }
            dd:extend(.total-wrap .table li dt) {
                color: #ff7614;
                font-size: 20px;
            }
        }
    }
    .handler {
        padding-top: 24px;
        text-align: center;
        .ivu-btn {
            width: 130px;
        }
    }
}
</style>
