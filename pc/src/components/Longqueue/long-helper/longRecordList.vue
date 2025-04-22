<template>
  <pull-refresh v-model="isLoading" class="longrecordlist" @refresh="onRefresh">
    <div
      v-for="info in bettingInfoList"
      :key="info.userBettingInfoId"
      class="longrecordlist__item"
    >
      <div class="longrecordlist__top">
        <span class="longrecordlist__lotname">{{ info.lotteryName }}</span>
        <i18n class="longrecordlist__period" path="第{num}期" tag="span">
          <template slot="num">
            <span>{{ info.periodNo }}</span>
          </template>
        </i18n>
        <span class="longrecordlist__amount">{{
          info.localAmount | keepDecimalOf2
        }}</span>
      </div>
      <div class="longrecordlist__bottom">
        <span class="longrecordlist__playname">{{ info.playName }}</span>
        <span v-if="info.status === '02'" class="longrecordlist__win">
          <Icon type="trophy"></Icon>{{ info.statusDesc }}{{ info.prize
          }}{{ $scur("元") }}
        </span>
        <span v-else class="longrecordlist__desc">{{ info.statusDesc }}</span>
      </div>
    </div>
  </pull-refresh>
</template>

<script>
import PullRefresh from "../components/PullRefresh/index";
import { mapGetters } from "vuex";

export default {
  name: "LongRecordList",
  components: {
    PullRefresh,
  },
  computed: {
    ...mapGetters(["bettingInfoList"]),
  },
  data() {
    return {
      isLoading: false,
    };
  },
  mounted() {
    this.recordListHandler();
  },
  methods: {
    async onRefresh() {
      await this.recordListHandler();
      this.isLoading = false;
    },
    async recordListHandler() {
      await this.$store.dispatch("bettingRecord");
    },
  },
};
</script>

<style scoped lang="less">
.longrecordlist {
  position: relative;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  &__item {
    padding: 10px;
    background: #fff;
    border-bottom: 1px solid #eeecec;
    margin: 7px;
    border-radius: 8px;
    min-height: 80px;
    color: #333333;
    font-size: 12px;
  }
  &__top,
  &__bottom {
    display: flex;
    justify-content: space-between;
  }
  &__bottom {
    margin-top: 16px;
  }
  &__lotname {
    font-size: 16px;
  }
  &__amount,
  &__win {
    color: #ff464b;
  }
  &__desc {
    color: #999;
  }
  &__period {
    color: #868484;
  }
}
</style>
