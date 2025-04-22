<template>
  <div class="game-slot">
    <div class="game-slot-header">
      <div class="container">
        <h1 class="game-slot-header__title1 text-title text-title--repeat-gradient">{{$tex("千万累计奖池")}}</h1>
        <h1 class="game-slot-header__title2 text-title text-title--repeat-gradient">{{$tex("大奖一触即发")}}</h1>
        <num-card :num="betNum"></num-card>
      </div>
    </div>
    <div class="game-slot-body">
      <div class="container">
        <game-search-input v-model="searchValue"></game-search-input>
        <game-tabs
          v-model="curTabIndex"
          :tabs="tabs"
          icon-field="pc2Icon"
          label-field="typeName"
          @change="onTabChange"
        ></game-tabs>
        <game-list
          :tab="curAllTab"
          :games="games"
          :loading="gameLoading"
          @game-click="onGameClick"
        ></game-list>
      </div>
    </div>
  </div>
</template>

<script>
import gameMixin from './gameMixin'
import NumCard from './NumCard'
import utils from '@/utils/utils'

export default {
  name: 'GameSlot',
  mixins: [gameMixin],
  components: {
    NumCard,
  },
  data() {
    return {
      betNum: '16,888,888.66',
    }
  },
  mounted() {
    this.startRandomBetNum()
  },
  beforeDestroy() {
    clearInterval(this.RandomTimer)
  },
  methods: {
    startRandomBetNum() {
      clearInterval(this.RandomTimer)
      this.RandomTimer = setInterval(() => {
        this.betNum = utils.numberFormat(
          Number(this.betNum.replace(/,/g, '')) + Math.floor(Math.random() * (10000 - 1000 + 1) + 1000),
          2,
          'floor',
          '.',
          ','
        )
      }, 8000)
    },
  },
}
</script>

<style scoped lang="less">
@deep: ~'>>>';

.game-slot-header {
  background: url('~@/assets/images-v6/game/dianzibg.png') no-repeat center center;
  background-size: cover;
  padding-bottom: 62px;
  .container {
    position: relative;
    padding-top: 120px;
  }
}

.game-slot-header__title1 {
  padding-right: 86px;
  width: 592px;
  margin: 0 0 0 auto;
  word-break: break-all;
}

.game-slot-header__title2 {
  margin: 30px 0 40px;
}

.game-slot-body {
  background: url('~@/assets/images-v6/game/dianzibg_2.png') no-repeat center center;
  background-size: cover;
  padding: 40px 0 50px;
  @{deep} {
    .game-list-item {
      padding: 23px;
    }
    .game-list-scroll {
      margin: 0 -13px;
    }
  }
}

.text-title {
  font-size: 72px;
  line-height: 1.2;
  text-align: right;
}

.game-search-input {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 15px;
}
</style>
