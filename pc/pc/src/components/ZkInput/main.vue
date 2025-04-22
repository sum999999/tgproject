<template>
  <div :class="{ 'zk-input__disabled': disabled }" class="zk-input-wrap">
    <input
      v-model="innervalue"
      @focus="handleFocus"
      @blur="handleBlur"
      @click="handleClick"
      @change="handleChange"
      @select="handleSelect"
      :readonly="disabled"
      :placeholder="placeholder"
      :type="password ? 'password' : 'text'"
      class="zk-input__inner"
    />
  </div>
</template>

<script>
import Validate from "./validate.js";
import { isEmpty, isNotEmpty } from "./utils.js";
/**
 * zk-input
 * @desc zk-input
 * @module components/zk-input
 *
 * @example
 * <zk-input v-model="value" type="text" maxlength="10" :disabled="false">
 * </zk-input>
 * <zk-input v-model="value" type="number" maxlength="10" :disabled="false" :max="10" :min="5">
 * </zk-input>
 * <zk-input v-model="value" type="digit" maxlength="10" :disabled="false" :max="10" :min="5" :digitilen="2">
 * </zk-input>
 */
export default {
  name: "zk-input",
  props: {
    type: {
      default: "text",
    },
    password: {
      default: false,
    },
    value: {
      default: undefined,
    },
    maxlength: {
      default: undefined,
    },
    max: {
      default: undefined,
    },
    min: {
      default: undefined,
    },
    positive: {
      default: true,
    },
    disabled: {
      default: false,
    },
    digitilen: {
      default: undefined,
    },
    placeholder: {
      default: undefined,
    },
  },
  data() {
    return {
      innertype: undefined,
      innervalue: undefined,
      validate: Validate(),
      next: undefined,
      prev: undefined,
    };
  },
  watch: {
    type: {
      handler(next, prev) {
        if (next !== this.innertype) {
          this.innertype = next;
        }
      },
      immediate: true,
    },
    innertype: {
      handler(next, prev) {
        this.$emit("type", next);
      },
      immediate: true,
    },
    value: {
      handler(next, prev) {
        if (next !== this.innervalue) {
          this.innervalue = next;
        }
      },
      immediate: true,
    },
    innervalue: {
      handler(next, prev) {
        this.next = next;
        this.prev = prev;
        if (next === this.value) {
          return void 0;
        }
        this.$emit("input", next);
        this[this.type](next, prev);
      },
      immediate: true,
    },
  },
  mounted() {},

  methods: {
    async text(next, prev, action) {
      if (
        isNotEmpty(this.maxlength) &&
        this.validate.validate(`maxlength:${this.maxlength}`, next)
      ) {
        this.innervalue = prev;
        this.$emit("input", prev);
      }
    },
    async number(next, prev, action) {
      if (this.positive) {
        if (next === "-") {
          this.innervalue = prev;
          this.$emit("input", prev);
          return void 0;
        }
      }
      if (
        isNotEmpty(this.maxlength) &&
        this.validate.validate(`maxlength:${this.maxlength}`, next)
      ) {
        this.innervalue = prev;
        this.$emit("input", prev);
        return void 0;
      }

      if (isNotEmpty(next) && this.validate.validate(`number`, next)) {
        this.innervalue = prev;
        this.$emit("input", prev);
        return void 0;
      }

      if (isNotEmpty(next) && this.validate.validate(`nonzero`, next)) {
        const next_num = parseFloat(next);
        this.innervalue = next_num;
        this.$emit("input", next_num);
        return void 0;
      }

      if (
        isNotEmpty(this.max) &&
        this.validate.validate(`max:${this.max}`, next)
      ) {
        this.innervalue = parseInt(this.max) || 0;
        this.$emit("input", parseInt(this.max) || 0);
        return void 0;
      }

      if (
        action === "blur" &&
        isNotEmpty(this.min) &&
        this.validate.validate(`min:${this.min}`, next)
      ) {
        this.innervalue = this.min;
        this.$emit("input", this.min);
        return void 0;
      }

      if (action === "blur" && isNotEmpty(next)) {
        const next_parse = parseInt(next);
        let next_num = "";
        if (!isEmpty(next_parse)) {
          if (next_parse == "-0") {
            this.innervalue = 0;
            this.$emit("input", 0);
          }
        }
        return void 0;
      }
    },
    async digit(next, prev, action) {
      if (
        isNotEmpty(this.maxlength) &&
        this.validate.validate(`maxlength:${this.maxlength}`, next)
      ) {
        this.innervalue = prev;
        this.$emit("input", prev);
        return void 0;
      }
      if (isNotEmpty(next) && this.validate.validate(`digit`, next)) {
        this.innervalue = prev;
        this.$emit("input", prev);
        return void 0;
      }

      if (isNotEmpty(next) && this.validate.validate(`nonzero`, next)) {
        const next_num = parseFloat(next);
        this.innervalue = next_num;
        this.$emit("input", next_num);
        return void 0;
      }

      if (
        isNotEmpty(this.max) &&
        this.validate.validate(`max:${this.max}`, next)
      ) {
        this.innervalue = this.max;
        this.$emit("input", this.max);
        return void 0;
      }

      if (
        action === "blur" &&
        isNotEmpty(this.min) &&
        this.validate.validate(`min:${this.min}`, next)
      ) {
        this.innervalue = this.min;
        this.$emit("input", this.min);
        return void 0;
      }

      if (
        isNotEmpty(this.digitilen) &&
        this.validate.validate(`digitilen:${this.digitilen}`, next)
      ) {
        this.innervalue = prev;
        this.$emit("input", prev);
        return void 0;
      }
      if (action === "blur" && isNotEmpty(next)) {
        if (next == "-0" || next == ".") {
          this.innervalue = 0;
          this.$emit("input", 0);
        }
        if (`${next}`.indexOf(".") > -1 && !`${next}`.split(".")[1]) {
          this.innervalue = `${next}`.split(".")[0];
          this.$emit("input", `${next}`.split(".")[0]);
        }
        return void 0;
      }
      this.innervalue = next;
      this.$emit("input", next);
    },
    async handleClick(event) {
      this.$emit("click", event, this.innervalue);
    },
    async handleFocus(event) {
      this.$emit("focus", event, this.innervalue);
    },
    async handleBlur(event) {
      if (!this.disabled) {
        await this[this.type](this.innervalue, this.prev, "blur");
        this.$emit("blur", event, this.innervalue);
      }
    },
    async handleChange(event) {
      this.$emit("change", event, this.innervalue);
    },
    async handleSelect(event) {
      this.$emit("select", event, this.innervalue);
    },
  },
};
</script>

<style lang="less" scoped>
.zk-input__disabled input {
  background-color: #eee;
  border: 1px solid #eee;
  color: #999;
  cursor: not-allowed;
}
.zk-input__inner {
  width: 122px;
  height: 30px;
  line-height: 1.5;
  padding: 4px 7px;
  outline: 0;
  display: inline-block;
  font-size: 12px;
  border: 1px solid #dddee1;
  border-radius: 4px;
  color: #313131;
  background-color: #fff;
  background-image: none;
  position: relative;
  cursor: text;
  transition: border 0.2s ease-in-out, background 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out, -webkit-box-shadow 0.2s ease-in-out;
  &::-webkit-input-placeholder {
    color: #bbbec4;
  }
  &:-moz-placeholder {
    color: #bbbec4;
  }
  &::-moz-placeholder {
    color: #bbbec4;
  }
  &:-ms-input-placeholder {
    color: #bbbec4;
  }
}

.zk-input__inner:not([readonly]) {
  &:focus {
    outline: 0;
  }
}
</style>
