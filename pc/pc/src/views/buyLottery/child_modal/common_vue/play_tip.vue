<template>
  <div class="play_tip">
    <span class="icon">
      <Icon
        type="alert"
        color="#fff"
        :size="10"
      ></Icon>
    </span>
    <span class="tip">{{$tex("玩法提示")}} :</span>
    <span v-html="escapeHtml(playDesc)"></span>
    <span v-html="escapeHtml(tip)"></span>
    <!-- <span class='maxOdd' v-if="isLiuHe && hasLogin">【最大赔率：{{maxOdd}}】</span> -->
    <template v-if="hasLogin&&isLiuHe">
      <span class='maxOdd' v-if="!is2zhongTe">【{{$tex("最大赔率")}}：{{maxOdd}}】</span>
      <!-- 中二特需要展示中特赔率和中二赔率 -->
      <span class='maxOdd' v-else>【{{$tex("中二赔率是{max},中特赔率是{min}", { max: maxOdd, min: minOdd })}}】</span>
    </template>
  </div>
</template>
<script>
  import util from "@/utils/utils";

export default {
  props: {
    playDesc: {
      type: String,
      default: ""
    },
    tip: {
      type: String,
      default: ""
    },
    maxOdd: {
      type: Number,
      default: null
    },
    isLiuHe: {
      type: Boolean,
      default: false
    },
    hasLogin: {
      type: Boolean,
      default: false
    },
    is2zhongTe: {
      type: Boolean,
      default: false
    },
    minOdd: {
      type: Number,
      default: 0
    }
  },
  methods: {
    escapeHtml(str) {
      if (str) {
        return util.escapeHtml(str);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.play_tip {
  width: 66%;
  font-size: 14px;
  word-wrap: break-word;
  word-break: normal;
}
.play_tip .icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: #ae291a;
  text-align: center;
  line-height: 20px;
  border-radius: 50%;
}
.play_tip .tip {
  margin: 0 5px;
  color: #ae291a;
}
.play_tip .maxOdd {
  color: #ae291a;
}
</style>


