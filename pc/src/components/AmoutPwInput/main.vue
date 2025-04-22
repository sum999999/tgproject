<template>
  <div class="six-password">
    <input
      class="six-digit-password"
      type="text"
      autocomplete="off"
      v-model="inputval"
      @focus="onInputFocus"
      @blur="onInputBlur"
      @click="onInputClick"
      ref="input"
      :maxlength="maxlen"
      :minlength="maxlen"
    >
    <div
      tabindex="0"
      class="six-digit-password__box"
    >
      <i
        v-for="i in maxlen"
        :key="i"
        :style="{'width': '30px', 'border-color': i===1?'transparent':''}"
        class="middle"
        :class="{active: (i === inputval.length + 1) && isFouce}"
      >
        <b :style="{visibility: +i <= +inputval.length?'visible':''}"></b>
      </i>
      <span
        :style="itemStyle"
        id="cardwrap"
      ></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "AmoutPwInput",
  props: {
    maxlen: {
      type: Number,
      default: 4
    },
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isFouce: false,
      width: 30,
      height: "0",
      selectionfn: null
    };
  },
  computed: {
    inputval: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    itemStyle() {
      let visibility = "";
      let left = "";
      if (this.inputval.length > this.maxlen) {
        visibility = "hidden";
      } else if (!this.isFouce) {
        visibility = "hidden";
      } else {
        visibility = "visible";
      }

      if (+this.inputval.length < +this.maxlen) {
        left = `${this.inputval.length * 30}px`;
      } else {
        left = `${(this.inputval.length - 1) * 30}px`;
      }
      return {
        width: "30px",
        left,
        visibility
      };
    }
  },
  watch: {
    inputval(next, prev) {
      const regx = /^(\-)?\d*?$/;
      if (!regx.test(next)) {
        this.$nextTick(() => {
          this.inputval = prev;
        });
      }
    }
  },
  mounted() {
    this.selectionfn = () => {
      this.removeSelection();
    };
    document.addEventListener("mouseup", this.selectionfn, false);
  },
  destroyed() {
    document.removeEventListener("mouseup", this.selectionfn, false);
  },
  methods: {
    onInputSelect() {
      return false;
    },
    onInputFocus() {
      this.isFouce = true;
    },
    onInputBlur() {
      this.isFouce = false;
    },
    onInputClick() {
      this.removeSelection();
    },
    removeSelection() {
      const element = this.$refs.input;
      const len = this.inputval.length;
      if (element.setSelectionRange) {
        element.setSelectionRange(len, len);
      } else {
        let r = element.createTextRange();
        r.moveStart("character", len);
        r.collapse(true);
        r.select();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.middle:after {
  display: inline-block;
  content: "";
  height: 100%;
  vertical-align: middle;
}
.middle > b {
  vertical-align: middle;
}
.six-password {
  position: relative;
  height: 33px;
  overflow: hidden;
  vertical-align: middle;
  display: inline-block;
}
.six-digit-password {
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  color: #fff;
  font-size: 12px;
  -webkit-user-select: initial;
  outline: "none";
  z-index: 3;
  opacity: 0;
  border: none;
  filter: alpha(opacity=0);
}
.six-digit-password__box {
  cursor: text;
  background: #fff;
  outline: none;
  position: relative;
  // padding: 8px 0;
  height: 100%;
  border: 1px solid #cccccc;
  border-radius: 4px;
  height: 100%;
  z-index: 2;
}
.six-digit-password__box i {
  float: left;
  display: block;
  padding: 4px 0;
  border-left: 1px solid #cccccc;
  text-align: center;
  height: 100%;
}
.six-digit-password__box b {
  display: inline-block;
  margin: 0 auto;
  width: 9px;
  height: 9px;
  overflow: hidden;
  visibility: hidden;
  background: black;
  border-radius: 100%;
}
.six-digit-password__box span {
  position: absolute;
  display: block;
  left: 0px;
  top: 0px;
  height: 100%;
  border-radius: 2px;
}
.six-digit-password__box .active {
  background: url("data:image/gif;base64,R0lGODlhAwAaAJECAB4eHgAAAP///wAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9xiaojijiiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk5QUExQUQyMEM1MTFFNUIwOUU5QUFCMkJCRDUyMDkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk5QUExQUUyMEM1MTFFNUIwOUU5QUFCMkJCRDUyMDkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5OTlBQTFBQjIwQzUxMUU1QjA5RTlBQUIyQkJENTIwOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5OTlBQTFBQzIwQzUxMUU1QjA5RTlBQUIyQkJENTIwOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAACH5BAkrAAIALAAAAAADABoAAAIPlC9gsS38HJyyxkuxU8gUACH5BAUrAAIALAAAAAADABoAAAIHlI+py+0PCwA7")
    no-repeat center center;
}
</style>