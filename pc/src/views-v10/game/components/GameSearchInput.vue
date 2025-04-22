<template>
  <div class="game-search-input">
    <div class="game-search">
      <Input
        prefix="ios-contact"
        v-model="searchValue"
        class="search-input"
        :placeholder="$tex('请输入游戏名称')"
      ></Input>
      <Icon type="search" size="20"></Icon>
    </div>
  </div>
</template>

<script>
export default {
  name: "GameSearchInput",
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  computed: {
    searchValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
};
</script>

<style scoped>
.game-search {
  width: 270px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.search-input {
  height: 30px;
  width: 250px;
}
</style>
