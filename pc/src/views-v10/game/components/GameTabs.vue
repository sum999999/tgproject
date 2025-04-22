<template>
  <div class="game-tabs grid grid-cols-8 gap-5 mb-4">
    <Button
      v-for="(tab, index) in filterTabs"
      :key="tab.platformId"
      class="game-tabs-item"
      shape="circle"
      :class="{
        'ivu-btn-style--4': curIndex !== index,
        'ivu-btn-style--2':
          $store.getters.pageTemplate.index === 10 && curIndex === index,
        'ivu-btn-style--11':
          $store.getters.pageTemplate.index === 11 && curIndex === index,
        'game-tabs-item--active': curIndex === index,
        'game-tabs-item--disabled': slideDisabledIfNeeded(tab),
      }"
      @click="onTabClick(index, tab)"
    >
      <img
        class="game-tabs-item__icon"
        :src="curIndex === index ? tab[iconActiveField] : tab[iconField]"
        alt=""
      />
      {{ tab.typeName }}
      <div
        class="game-tabs-tips animate__animated animate__infinite animate__top2bottom"
      >
        <span class="game-tabs-tips__text">{{ slideTipsText(tab) }}</span>
      </div>
    </Button>
  </div>
</template>

<script>
export default {
  name: "GameTabs",
  props: {
    title: {
      type: String,
      default: "",
    },
    value: {
      type: [Number, String],
      default: -1,
    },
    tabs: {
      type: Array,
      default() {
        return [];
      },
    },
    labelField: {
      type: String,
      default: "typeName",
    },
    iconField: {
      type: String,
      default: "pc2Icon",
    },
    iconActiveField: {
      type: String,
      default: "pc3Icon",
    },
  },
  computed: {
    curIndex: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    allTab() {
      return this.tabs.find((tab) => {
        return tab.platformId === "-1";
      });
    },
    filterTabs() {
      return this.tabs.filter((tab) => {
        return tab.platformId !== "-1";
      });
    },
  },
  watch: {
    allTab: {
      deep: true,
      immediate: true,
      handler(tab) {
        if (this.tabs.length && !tab && this.curIndex === -1) {
          this.curIndex = 0;
        }
      },
    },
  },
  methods: {
    onTabClick(index, tab) {
      // console.log("filterTabs", this.filterTabs);
      if (this.slideDisabledIfNeeded(tab)) {
        return void 0;
      }
      this.curIndex = index;
      this.$nextTick(() => {
        this.$emit("change", index);
      });
    },
    onAllClick() {
      this.curIndex = -1;
      this.$nextTick(() => {
        this.$emit("change", this.curIndex);
      });
    },
    slideDisabledIfNeeded(tab) {
      return tab.platformStatus !== "1";
    },
    slideTipsText(tab) {
      if (tab.platformStatus === "2") {
        return this.$tex("即将上线");
      } else if (tab.platformStatus === "3") {
        return this.$tex("维护中");
      }
    },
  },
};
</script>

<style scoped lang="less">
.game-tabs {
  font-size: 20px;
  border-radius: 10px;
  position: relative;
}
.swiper-container {
  flex: 1;
  width: 100%;
  height: 744px;

  z-index: 0;
  position: relative;
  padding: 10px 22px;
  margin-top: 56px;
}
.game-tabs-item {
  position: relative;
  cursor: pointer;
  color: #999999;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin: auto;
  border-radius: 20px;
  &.game-tabs-item--disabled {
    > img {
      filter: grayscale(1);
    }
  }
  &.ivu-btn-style--11 {
    background-color: rgb(228, 57, 60);
    color: white;
  }
  &:not(.game-tabs-item--disabled) {
    .game-tabs-tips {
      visibility: hidden;
    }
  }
  .game-tabs-tips {
    visibility: visible;
  }
}
.game-tabs__all {
  cursor: pointer;
  display: flex;
  align-items: center;
  /*width: 80px;*/
  color: #999999;
  padding: 15px 15px 15px 15px;
  &.game-tabs__all--active,
  &:hover {
    color: #ddc17c;
  }
}
.game-tabs-item__icon {
  float: none;
  object-fit: contain;
  width: 40px;
  height: 20px;
  margin-right: 8px;
}
.game-tabs-item__title {
  /*overflow: hidden;*/
  /*text-overflow: ellipsis;*/
  /*white-space: nowrap;*/
  word-break: break-all;
}
.game-tabs-tips {
  position: absolute;
  bottom: 66%;
  right: 8px;
  padding: 0 8px;
  line-height: 20px;
  color: #ffffff;
  font-size: 14px;
  background-image: linear-gradient(to top, #795d1b, #aa8743 40%, #f7df99);
  span {
    vertical-align: bottom;
    display: inline-block;
    max-width: 120px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  &:after {
    content: "";
    display: inline-block;
    width: 0;
    height: 0;
    border-top: 5px solid #795d1b;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    position: absolute;
    right: 8px;
    bottom: -5px;
  }
}
</style>
