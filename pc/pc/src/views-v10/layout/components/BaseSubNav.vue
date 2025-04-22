<template>
  <div class="base-sub-nav">
    <ul class="container">
      <vue-loaders-line-scale
        v-if="loading"
        :color="themeColorList.primaryColor"
      ></vue-loaders-line-scale>
      <li
        v-else-if="!list.length"
        class="base-sub-nav-tips"
      >
        <span
          class="glitch"
          :data-text="$tex('暂无数据')"
        >{{$tex('暂无数据')}}</span>
      </li>
      <li
        v-for="(item, index) in list"
        :key="index"
        class="base-sub-nav__item"
        :class="{
              'base-sub-nav__item--disabled': itemDisabledIfNeeded(item)
          }"
        @click="onItemClick(item)"
      >
        <img
          class="base-sub-nav__img"
          :src="item.typeIcon"
          :alt="item.typeName"
        >
        <span class="base-sub-nav__text">{{item.typeName}}</span>
        <Button
          class="ivu-btn-style--4 base-sub-nav__btn"
          shape="circle"
          style="border-width: 1px;"
          @click="$router.push('/register')"
        >{{$tex('立即游戏')}}</Button>
      </li>
    </ul>
  </div>

</template>

<script>
import VueLoadersLineScale from 'vue-loaders/dist/loaders/line-scale'
import { mapGetters } from 'vuex'

export default {
  name: 'BaseSubNav',
  components: {
    VueLoadersLineScale: VueLoadersLineScale.component,
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      },
    },
    loading: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapGetters(['themeColorList']),
  },
  methods: {
    onItemClick(item) {
      if (this.itemDisabledIfNeeded(item)) {
        return void 0
      }
      this.$router.push({ name: 'game', params: { id: item.code } })
    },
    itemDisabledIfNeeded(item) {
      return item.dispType === '1' && item.platformStatus !== '1'
    },
  },
}
</script>

<style scoped lang="less">
.base-sub-nav {
  position: absolute;
  left: 0;
  right: 0;
  background: #f5f9ff;
  border: 2px solid #ffffff;
  box-shadow: 0 0 18px 1px rgba(107, 168, 220, 0.1), inset 0 0 10px 0 #ebf2fb;
  > ul {
    margin: auto;
    min-height: 166px;
    overflow: hidden;
    display: flex;
    padding: 15px 78px;
    flex-wrap: wrap;
    font-size: 12px;
    color: #999999;
  }
}
.base-sub-nav__item {
  width: 14.285%;
  padding: 15px 12px;
  text-align: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  &:not(.base-sub-nav__item--disabled):hover {
    .base-sub-nav__text {
      color: rgb(var(--tg-accent));
    }
    .base-sub-nav__btn {
      background: url(~@/assets/images-v10/home/topgames_button_xz.png) no-repeat center / 135%,
        linear-gradient(180deg, #3be6e5 0%, #1f94ff 100%);
      border: 2px solid #5cb1ff;
      box-shadow: 0 3px 5px 0 rgba(0, 95, 176, 0.3);
      font-family: PingFang-SC-Bold;
      color: #ffffff;
    }
  }
  &.base-sub-nav__item--disabled {
    cursor: not-allowed;
    img {
      filter: grayscale(1);
    }
  }
}
.base-sub-nav__img {
  width: 80px;
  height: 80px;
  float: none;
  margin-bottom: 8px;
  object-fit: contain;
  border-radius: 20px;
}
.base-sub-nav__btn {
  min-width: 120px;
  margin: auto;
  margin-top: 8px;
}
.vue-loaders {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0) scale(0.8);
}
.base-sub-nav-tips {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  top: 50%;
  margin-top: -20px;
  .glitch {
    font-size: 26px;
    font-weight: 700;
  }
}
</style>
