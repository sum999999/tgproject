<template>
    <li class="num-card-item" :class="{
                        'num-card-item-symbol': !Number.isInteger(Number(num))
                    }">
        <template v-if="!Number.isInteger(Number(num))">
            <span class="num-card-item__text">{{ num }}</span>
        </template>
        <template v-else>
            <div ref="num" class="num-card-item__animate" :style="{
            'transform': `translateY(${-(100 * num)}%)`
        }">
                <span v-for="(value, index) in 10" :key="index" class="num-card-item__text" :style="{
            'transform': `translateY(${100 * index}%)`
        }">{{ index }}</span>
            </div>
        </template>
    </li>
</template>

<script>
    import utils from "@/utils/utils";

  export default {
    name: "NumCardItem",
    props: {
      num: [String, Number],
      numIndex: [String, Number]
    },
    data() {
      return {
        betNum: 0
      }
    },
    computed: {
      transitionEnd() {
        const prefix = utils.supportCss3('transition')
        const pre = prefix.toLowerCase();
        if (typeof prefix === 'boolean' || pre === 'moz') {
          return 'transitionend';
        }
        return `${pre}TransitionEnd`;
      }
    },
    watch: {
      num(value) {
        this.betNum = value
      }
    },
    mounted() {
      if (Number.isInteger(Number(this.num))) {
        this.betNum = this.num;
      }
      this.$nextTick(() => {
        this.$refs.num && this.$refs.num.addEventListener(this.transitionEnd, this.transtionEndEvent)
      })
    },
    beforeDestroy() {
      this.$refs.num && this.$refs.num.removeEventListener(this.transitionEnd, this.transtionEndEvent)
    },
    methods: {
      transtionEndEvent() {
        this.$emit('end', this.numIndex, this.betNum)
      }
    }
  }
</script>

<style scoped lang="less">
    .num-card-item {
        background: url("~@/assets/images-v6/game/jiangchi.png") no-repeat center center;
        background-size: 100% 100%;
        width: 55px;
        height: 76px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 4px;
        overflow: hidden;
        position: relative;
        &.num-card-item-symbol {
            background: none;
            width: 10px;
        }
    }

    .num-card-item__animate {
        display: flex;
        justify-content: center;
        align-items: center;
        transition: transform .4s ease-in-out;
        position: relative;
        height: 100%;
    }

    .num-card-item__text {
        position: absolute;
        background-image: -webkit-gradient(linear, 0 bottom, 0 top, color-stop(40%, #aa8743), color-stop(80%, #f5f3a9));
        -webkit-text-fill-color: transparent;
        -webkit-background-clip: text;
        height: 100%;
    }

</style>
