<template>
    <div class="default-set">
        <div class="main">
            <div class="money"><span>{{$tex("金额")}}</span></div>
            <InputNumber :max="max" :min="min" :precision="precision" :step="step" v-model="singleMoney" @on-change="changeSingleMoney"></InputNumber>
            <div>
                <Button type="primary" style="margin: 0 10px;" @click.stop="reset">{{$tex("重置")}}</Button>
            </div>
        </div>
    </div>
</template>

<script>
  import { hasPermission } from "@/utils/authority-utils";

export default {
    props:['max', 'min'],
    data() {
        return{
            singleMoney: 0
        }
    },
  computed: {
    precision() {
      if (hasPermission("buyLottery.decimals")) {
        return 2;
      }
      return void 0;
    },
    step() {
      if (hasPermission("buyLottery.decimals")) {
        return 0.01;
      }
      return 1
    }
  },
  mounted() {
      this.singleMoney = this.min;
  },
    methods:{
        /**
         * 改变默认单注金额
         */
        changeSingleMoney(val) {
            this.$emit('send-single-money',val);
        },
        /**
         * 重置
         */
        reset() {
            this.singleMoney = this.min;
            this.$emit('reset',this.singleMoney,true);
        }
    }
}
</script>

<style lang="less" scoped>
@deep: ~'>>>';
    .default-set{
        width:100%;
        overflow:hidden;
        .main {
            width: 100%;
            display:flex;
            align-items:flex-start;
            &>div{
                font-size:14px;
            }
            &:first-child {
                margin-left:200px;
            }
            .money {
                line-height: 30px;
                margin:0 10px;
            }
            .ivu-input-number {
                width:114px;
                @{deep}.ivu-input-number-input-wrap{
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 90px;
                }
            }
        }
    }
</style>
