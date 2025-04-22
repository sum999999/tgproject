<template>
  <div
    class="jetton-box"
    :class="{
      [`jetton-box--${size}`]: true,
      'jetton-box--readonly': !editStatus,
    }"
  >
    <div
      v-for="(jetton, index) in jettons"
      :key="index"
      class="jetton-box-item"
      :class="{
        'jetton-box-item--selected': jetton.selected,
      }"
      @click="onJettonClick(jetton, index)"
    >
      <i
        class="jetton-box-item__icon"
        :class="[`jetton-box-item__icon-${index}`]"
      ></i>
      <zk-input
        v-model="jetton.value"
        type="number"
        :min="min"
        :max="max"
        :disabled="jetton.disabled"
        :style="{
          width: `${80 + String(jetton.value).length * 5}px`,
        }"
      ></zk-input>
      <span class="jetton-box-item__unit">
        <template v-if="hasPermission('element.currencyExchange')">{{
          sysExchangeInfo.scurIcon
        }}</template>
        <template v-else>{{ $tex("元") }}</template>
      </span>
      <span class="jetton-box-item__flag"></span>
    </div>
    <div class="jetton-box-btn jetton-box-edit" @click="onEditClick">
      {{ editStatus ? $tex("确定") : $tex("编辑金额") }}
    </div>
  </div>
</template>

<script>
import { ZkInput } from "@/components/ZkInput";
import { mapGetters } from "vuex";
import { hasPermission } from "@/utils/authority-utils";

export default {
  name: "JettonBox",
  components: {
    ZkInput,
  },
  props: {
    value: {
      type: Number | String,
      default: 0,
    },
    min: {
      type: Number | String,
      default: 0,
    },
    max: {
      type: Number | String,
      default: null,
    },
    size: {
      type: String,
      default: "big",
    },
    match: {
      type: Boolean,
      default: false,
    },
    resetValue: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    ...mapGetters(["sysExchangeInfo"]),
    curValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", Number(value));
      },
    },
    // 修改快捷投注逻辑盘口
    isQuickBet() {
      return this.quickBet.includes(this.$store.getters.sysPlatformFlag);
    },
  },
  watch: {
    curValue(value) {
      if (Number(value) === 0) {
        this.clear();
      } else if (this.match) {
        const jettonIndex = this.jettons.findIndex(
          (jetton) => Number(jetton.value) === Number(value)
        );
        const jetton = this.jettons[jettonIndex];
        if (jettonIndex !== -1 && !jetton.selected) {
          this.onJettonClick(jetton, jettonIndex);
        }
        // this.isQuickBet： 341盘口不执行这段逻辑
        if (jettonIndex === -1 && !this.isQuickBet) {
          this.clear();
        }
      }
    },
  },
  data() {
    return {
      editStatus: false,
      lastJettonClickIndex: -1,
      jettons: [
        {
          value: 10,
          disabled: true,
          selected: false,
        },
        {
          value: 100,
          disabled: true,
          selected: false,
        },
        {
          value: 1000,
          disabled: true,
          selected: false,
        },
        {
          value: 5000,
          disabled: true,
          selected: false,
        },
        {
          value: 10000,
          disabled: true,
          selected: false,
        },
        {
          value: 50000,
          disabled: true,
          selected: false,
        },
      ],
      quickBet: ["by341"], // 修改快捷投注逻辑盘口
    };
  },
  created() {
    this.jettonsHandler();
  },
  methods: {
    hasPermission,
    jettonsHandler() {
      try {
        const jettonsStr = localStorage.getItem("jettons");
        if (jettonsStr) {
          this.jettons = JSON.parse(jettonsStr);
        } else {
          this.saveJettons();
        }
      } catch (e) {
        this.jettons = [];
      }
    },
    onJettonClick(jetton, index) {
      if (!this.editStatus) {
        if (this.lastJettonClickIndex !== index) {
          this.removeLastJettonSelected();
        }
        // 341盘口快捷投注逻辑
        if (this.isQuickBet) {
          if (
            this.lastJettonClickIndex === index &&
            this.jettons[this.lastJettonClickIndex].selected
          ) {
            this.curValue += Number(jetton.value);
          } else if (
            this.lastJettonClickIndex !== index ||
            (this.lastJettonClickIndex === index &&
              !this.jettons[this.lastJettonClickIndex].selected)
          ) {
            jetton.selected = !jetton.selected;
            this.curValue = Number(jetton.value);
          }
          this.lastJettonClickIndex = index;
          return;
        }
        jetton.selected = !jetton.selected;
        this.lastJettonClickIndex = index;
        if (jetton.selected) {
          this.curValue = jetton.value;
        } else {
          this.resetCurValue();
        }
      }
    },
    removeLastJettonSelected() {
      if (this.lastJettonClickIndex !== -1) {
        this.jettons[this.lastJettonClickIndex].selected = false;
      }
    },
    onEditClick() {
      this.editStatus = !this.editStatus;
      this.jettons.forEach((jetton) => {
        jetton.disabled = !this.editStatus;
      });
      this.removeLastJettonSelected();
      this.resetCurValue();
      if (!this.editStatus) {
        this.saveJettons();
      }
    },
    resetCurValue() {
      this.curValue = this.resetValue;
    },
    clear() {
      this.removeLastJettonSelected();
    },
    saveJettons() {
      localStorage.setItem("jettons", JSON.stringify(this.jettons));
    },
  },
};
</script>

<style scoped lang="less">
@deep: ~">>>";

.jetton-box {
  font-size: 0;
}
.jetton-box--readonly {
  @{deep} {
    .zk-input__inner {
      cursor: pointer;
    }
  }
}
.jetton-box--big {
  .jetton-box-item {
    margin: 20px 5px;
    @{deep} {
      .zk-input__inner {
        width: 100px;
      }
    }
  }
}
.jetton-box--small {
  .jetton-box-item {
    margin: 20px 2px;
    @{deep} {
      .zk-input__inner {
        width: 100%;
        height: 28px;
        padding-top: 2px;
        padding-bottom: 2px;
      }
    }
  }
  .jetton-box-btn {
    padding: 4px 8px;
    font-size: 13px;
  }
}
.jetton-box-item {
  position: relative;
  display: inline-block;
  cursor: pointer;
  padding: 3px;
  font-size: 12px;
  @{deep} {
    .zk-input__inner {
      background-color: #f3f3f3;
      border-radius: 15px;
      padding-left: 33px;
      padding-right: 17px;
    }
  }
}
.jetton-box-item--selected {
  .jetton-box-item__flag {
    display: block;
  }
  @{deep} {
    .zk-input__inner {
      border: 1px solid @primary-color;
    }
  }
}
.jetton-box-item__icon {
  position: absolute;
  left: 6px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-block;
  width: 25px;
  height: 25px;
  background-repeat: no-repeat;
  background-size: contain;
  z-index: 1;
  &.jetton-box-item__icon-0 {
    background-image: url("~@/assets/images/jetton/white.png");
  }
  &.jetton-box-item__icon-1 {
    background-image: url("~@/assets/images/jetton/yellow.png");
  }
  &.jetton-box-item__icon-2 {
    background-image: url("~@/assets/images/jetton/green.png");
  }
  &.jetton-box-item__icon-3 {
    background-image: url("~@/assets/images/jetton/blue.png");
  }
  &.jetton-box-item__icon-4 {
    background-image: url("~@/assets/images/jetton/red.png");
  }
  &.jetton-box-item__icon-5 {
    background-image: url("~@/assets/images/jetton/black.png");
  }
}
.jetton-box-item__unit {
  position: absolute;
  top: 50%;
  right: 7px;
  transform: translateY(-50%);
  z-index: 2;
}
.jetton-box-btn {
  display: inline-block;
  padding: 6px 12px;
  background-color: #666666;
  color: #ffffff;
  font-size: 14px;
  border-radius: 15px;
  margin: 20px 5px;
  cursor: pointer;
}
.jetton-box-item__flag {
  display: none;
  position: absolute;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: @primary-color;
  border-color: @primary-color;
  top: 0;
  right: 0;
  direction: ltr;
  border-collapse: separate;
  transition: all 0.3s;
  z-index: 1;
  &:after {
    position: absolute;
    display: table;
    border: 2px solid #fff;
    border-top: 0;
    border-left: 0;
    transform: rotate(45deg) scale(1) translate(-50%, -50%);
    opacity: 1;
    transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
    content: " ";
    top: 48%;
    left: 22%;
    width: 5.71428571px;
    height: 9.14285714px;
  }
}
</style>
