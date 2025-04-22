<template>
  <div class="game-wrap">
    <component
      :is="view"
      :code="code"
      :plat-code="platCode"
    ></component>
  </div>
</template>

<script>
import GameSlot from './components/GameSlot'
import GameBall from './components/GameBall'
import GameVideo from './components/GameVideo'
import GamePoker from './components/GamePoker'
import GameFish from './components/GameFish'
import GameSports from './components/GameSports'

export default {
  name: 'game',
  components: {
    GameSlot,
    GameBall,
    GameVideo,
    GamePoker,
    GameFish,
    GameSports,
  },
  data() {
    return {}
  },
  computed: {
    code() {
      const id = this.$route.params.id
      if (id.indexOf('_') !== -1) {
        const [_, code] = id.split('_')
        return code
      }
      return id
    },
    platCode() {
      const id = this.$route.params.id
      if (id.indexOf('_') !== -1) {
        return id
      }
      return ''
    },
    view() {
      return `Game${this.firstUpperCase(this.code)}`
    },
  },
  methods: {
    firstUpperCase(str) {
      return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
    },
  },
}
</script>

<style scoped lang="less">
</style>
