<template>
  <div class="game-search-input">
    <div class="search-input">
      <Input
        v-model="searchValue"
        class="search-input"
        :placeholder="$tex('请输入游戏名称')"
      ></Input>
      <Icon type="search"></Icon>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameSearchInput',
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  computed: {
    searchValue: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
}
</script>

<style scoped>
</style>
