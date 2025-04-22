<template>
    <ul class="num-card">
        <num-card-item v-for="(num, index) in betNum" :key="index" :num="num" :numIndex="index" @end="onTransitionEnd"></num-card-item>
    </ul>
</template>

<script>
  import NumCardItem from './NumCardItem';

  export default {
    name: "NumCard",
    components: {
      NumCardItem
    },
    props: {
      num: {
        type: [String, Number],
        default: '16,888,888.66'
      },
      stepBet: {
        type: [Boolean],
        default: true
      }
    },
    data() {
      return {
        betNum: '',
        stepBetIndex: 0
      }
    },
    watch: {
      num(num) {
        setTimeout(() => {
          this.betNum = this.num
        }, 100)
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        if (!this.stepBet) {
          if (this.num) {
            this.betNum = this.num.replace(/\d/g, '0');
            this.$nextTick(() => {
              setTimeout(() => {
                this.betNum = this.num
              }, 100)
            });
          } else {
            this.betNum = this.num
          }
          return
        }
        if (!this.num) {
          return;
        }
        this.stepBetIndex = 0;
        this.betNum = this.num.replace(/\d/g, '0');
        this.$nextTick(() => {
          setTimeout(() => {
            this.runBetNum()
          }, 100)
        });
      },
      runBetNum() {
        if (!this.stepBet || !this.num) {
          return
        }
        const index = this.num.length - 1 - this.stepBetIndex;
        if (index < 0) {
          return
        }
        const numsArr = this.betNum.split('');
        numsArr[index] = this.num[index];
        this.betNum = numsArr.join('');
        this.stepBetIndex++;
        if (!Number.isInteger(Number(numsArr[index]))) {
          this.runBetNum()
        }
      },
      onTransitionEnd (index, num) {
        if (this.stepBet) {
          this.runBetNum()
        }
      }
    }
  }
</script>

<style scoped lang="less">
    .num-card {
        display: flex;
        justify-content: flex-end;
        font-size: 48px;
        margin-right: -50px;
    }
</style>
