<template>
  <div>
    <div class="field-item">
      <span class="field-item__title">可转余额：</span>
      <div class="field-item__content">
        <span class="convert-blance">{{$tex("￥")}}{{yebBalance}}</span>
      </div>
    </div>
    <div class="field-item">
      <span class="field-item__title">转出余额：</span>
      <div class="field-item__content">
        <zk-input v-model="transInVal"
                  type="digit"
                  :digitilen="2"
                  :max="yebBalance"
                  :min="0"
                  placeholder="请输入转出金额">
        </zk-input>
      </div>
    </div>
    <div class="field-item">
      <span class="field-item__title">资金密码：</span>
      <amout-pw-input v-model="inputval"></amout-pw-input>
    </div>
    <div class="field-item">
      <span class="field-item__title"
            style="visibility: hidden;">按钮排列：</span>
      <div class="field-item__content">
        <Button type="primary"
                class="transferIn-btn"
                :disabled="disTransfer"
                @click="onTransferClick">确认转出</Button>
      </div>
    </div>

  </div>
</template>

<script>
import encryption from '@/utils/md5'
import { ZkInput } from '@/components/ZkInput'
import { AmoutPwInput } from '@/components/AmoutPwInput'
import numeral from 'numeral'

export default {
  components: { ZkInput, AmoutPwInput },
  data () {
    return {
      inputval: '',
      transInVal: '',
    }
  },
  computed: {
    yebBalance () {
      return numeral(this.$store.state.yebInfo.balance).format('0,0.00', Math.floor) || '0.00'
    },
    disTransfer () {
      if (
        !!this.transInVal &&
        this.inputval.length === 4 &&
        this.inputval !== 0 &&
        this.inputval !== '0'
      ) {
        return false
      }
      return true
    },
  },
  methods: {
    createTransfer (playload) {
      return new Promise((resolve, reject) => {
        this.$http.post('/api/v2/user/yebTransform', playload, { userId: true }).then(response => {
          if (response.data.code !== 0) {
            return reject(response.data)
          }
          return resolve(response.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    onTransferClick () {
      this.createTransfer({
        type: '02',
        money: this.transInVal,
        password: encryption.encrypt.md5(this.inputval)
      }).then(data => {
        this.$store.state.yebInfo.balance = this.$store.state.yebInfo.balance - this.transInVal
        this.$Message.success('转出成功');
        this.$emit('tab-replace-pageview', 'YebTransferResult', {
          title: '转出成功',
          dsc: `成功转出${this.transInVal}元至账户余额`
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.field-item__title {
  vertical-align: middle;
}
.field-item__content {
  vertical-align: middle;
  display: inline-block;
}
.field-item {
  margin-bottom: 20px;
}
.convert-blance {
  font-size: 20px;
}
.transferIn-btn {
  width: 106px;
}
</style>
