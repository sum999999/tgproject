<template>
  <!-- 银行卡转账充值页面 -->
  <div class='step-one'>
    <div
      class="list"
      v-if="!noData"
    >
      <ul>
        <li class="list-thead">
          <span>&nbsp;</span>
          <span class="name">{{$tex("开户银行")}}</span>
          <span class="type">{{$tex("收款人")}}</span>
          <span class="num">{{$tex("收款账户")}}</span>
          <span class="place">{{$tex("开户网点")}}</span>
        </li>
      </ul>
      <ul>
        <li
          v-for="(item, index) in bankPayList"
          :key="index"
        >
          <!-- <span>
                        <input type="radio" name="bank" @change="getSelect(item)">
                    </span> -->
          <div class='radio-wrapper'>
            <span
              :class='{"focus-label":labelClicked === index}'
              @click="focusSpan(index,item)"
            >
            </span>
            <input type="radio">
          </div>
          <span class='name'>
            <label>{{item.bankName}}</label>
          </span>
          <span class="type">
            <label class="type">{{item.accountName}}</label>
          </span>
          <span class="num">
            <label>{{item.bankNo}}</label>
          </span>
          <span class="place">
            <label>{{item.openBankName}}</label>
          </span>
        </li>
      </ul>
      <div class="yhk-button">
        <Button
          type="primary"
          class="buttonback"
          size="large"
          @click="enteryhkback()"
        >{{$tex("返回")}}</Button>
        <Button
          type="error"
          class="buttonnext"
          size="large"
          @click="enteryhkNext()"
        >{{$tex("确认")}}</Button>
      </div>
    </div>
    <div
      v-else
      class="no-data"
    >
      {{$tex("暂无开放接口，请选择其他支付方式")}}
      <div class="yhk-button">
        <Button
          type="primary"
          class="buttonback"
          size="large"
          @click="enteryhkback()"
        >{{$tex("返回")}}</Button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
    },
  },
  data() {
    return {
      bankPayList: [],
      selectData: '',
      labelClicked: '',
      noData: false,
    }
  },
  methods: {
    focusSpan(index, item) {
      this.labelClicked = index
      this.selectData = item
    },
    enteryhkNext() {
      if (!this.selectData) {
        this.$Message.error(this.$tex('请选择银行卡'))
        return
      }
      this.$emit('get-back-status', this.selectData)
    },
    enteryhkback() {
      this.$emit('get-back-status', 0)
    },
    // getSelect (item) {
    //     console.log(item);
    //     this.selectData = item;
    // }
  },
  created() {
    // 银行卡转账  并且时线下的逻辑
    if (this.data.onAndOffList.length) {
      // if (this.data.onAndOffList[0].onOrOff === '01' && this.data.onAndOffList[0].accountType === '0') {
      //     this.bankPayList = this.data.onAndOffList;
      // //  跳过第一步
      // } else {
      //     this.$emit('get-back-status', this.data);
      // }
      this.$emit('get-back-status', this.data)
    } else {
      this.noData = true
    }
  },
}
</script>

<style lang="less" scoped>
/* 银行卡列表样式 */
.step-one .list li {
  height: 36px;
  line-height: 36px;
}
.step-one .list li > span {
  width: 20%;
  display: inline-block;
  overflow: hidden;
  float: left;
  text-align: center;
}
.step-one .list li.list-thead {
  /*     background: @primary-color; */
  color: #fff;
}
.step-one .list li:nth-child(even) {
  background: #eee;
}
.step-one .yhk-button {
  display: flex;
  margin-top: 20px;
}
.step-one .yhk-button button {
  margin-right: 10px;
}
.step-one .radio-wrapper {
  width: 20%;
  position: relative;
  float: left;
  display: inline-block;
  vertical-align: middle;
  line-height: 1;
  cursor: pointer;
  text-align: center;
}
.step-one .radio-wrapper input[type='radio'] {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  width: 13px;
  height: 13px;
  opacity: 0;
  filter: alpha(opacity=0);
  border: 1px solid #dddee1;
  cursor: pointer;
}

.step-one .radio-wrapper span {
  display: inline-block;
  box-sizing: content-box;
  padding: 1px;
  width: 11px;
  height: 11px;
  position: relative;
  top: 12px;
  left: 0;
  background-color: #fff;
  border: 1px solid #dddee1;
  border-radius: 50%;
  -webkit-border-radius: 50%;
  -ms-border-radius: 50%;
  -moz-border-radius: 50%;
  -o-border-radius: 50%;
  transition: all 0.2s ease-in-out;
  -webkit-transition: all 0.2s ease-in-out;
  -ms-transition: all 0.2s ease-in-out;
  -moz-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  z-index: 2;
}
.step-one .radio-wrapper span.focus-label {
  border: 1px solid #dddee1;
}
.step-one .radio-wrapper span:after {
  display: inline-block;
  position: absolute;
  top: 3px;
  left: 3px;
  width: 8px;
  height: 8px;
  content: '';
  border-radius: 6px;
  -webkit-border-radius: 6px;
  -ms-border-radius: 6px;
  -moz-border-radius: 6px;
  -o-border-radius: 6px;
  background: #ff7614;
  border: 1px solid #fff;
  border-top: 0;
  border-left: 0;
  opacity: 0;
  filter: alpha(opacity=0);
  transform: scale(0);
  -webkit-transform: scale(0);
  -ms-transform: scale(0);
  -moz-transform: scale(0);
  -o-transform: scale(0);
  transition: all 0.2s ease-in-out;
  -webkit-transition: all 0.2s ease-in-out;
  -moz-transition: all 0.2s ease-in-out;
  -ms-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
}
.radio-wrapper span.focus-label:after {
  opacity: 1;
  filter: alpha(opacity=1);
  transform: scale(1);
  -webkit-transform: scale(1);
  -ms-transform: scale(1);
  -moz-transform: scale(1);
  -o-transform: scale(1);
}
.step-one .no-data {
  text-align: center;
  font-size: 20px;
  margin-top: 50px;
}
</style>
