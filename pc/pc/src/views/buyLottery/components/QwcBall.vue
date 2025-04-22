<template>
    <div class="qwc-ball">
        <span class="qwc-ball__text">{{ ball }}</span>
        <span v-for="(color, index) in ballColor" :key="index" class="qwc-ball__color" :style="{
            'background-color': color
        }"></span>
    </div>
</template>

<script>
  export default {
    name: "QwcBall",
    props: {
      ball: {
        type: Number | String,
        default: null
      }
    },
    data() {
      return {
        ballColors: {
          ['0']: ['#f80400', '#c614e4'],
          ['1']: ['#4caf50'],
          ['2']: ['#f80400'],
          ['3']: ['#4caf50'],
          ['4']: ['#f80400'],
          ['5']: ['#4caf50', '#c614e4'],
          ['6']: ['#f80400'],
          ['7']: ['#4caf50'],
          ['8']: ['#f80400'],
          ['9']: ['#4caf50'],
        }
      }
    },
    computed: {
      ballColor() {
        return this.ballColors[this.ball] || [];
      }
    }
  }
</script>

<style scoped lang="less">
    .qwc-ball {
        font-size: 0;
        display: flex;
        align-items: center;
    }
    .qwc-ball__text {
        font-size: 16px;
        font-weight: bold;
        vertical-align: middle;
    }
    .qwc-ball__color {
        display: inline-block;
        width: 20px;
        height: 20px;
        margin-left: 10px;
        border-radius: 3px;
        vertical-align: middle;
    }
</style>
