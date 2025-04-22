<template>
  <div class="sound-set">
    <div
      class="common if-open-sound"
      :class="{'has-close-voice':isCloseSound}"
    >
      <i @click="closeOpenSound">{{isCloseSound? $tex('打开声音') : $tex('关闭声音') }}</i>
      <span
        class="iconfont"
        @click="closeOpenSound"
        :class="[isCloseSound?'icon-voice_shurt':'icon-voice_open']"
      ></span>

    </div>
    <div class="common sound-setting">
      <i @click="openSetSound">{{$tex("铃声设置")}}</i>
      <span
        :class="soundClass"
        @click="openSetSound"
      >
        {{curSoundName}}
      </span>
    </div>
    <!-- 铃声设置 -->
    <transition name="hor-slide">
      <div
        class="sound-lists"
        v-show="showSelectSoundMenu"
      >
        <div class="lists">
          <RadioGroup
            v-model="selectSound"
            vertical
            @on-change="changeVoice"
          >
            <Radio
              v-for="sound of soundLists"
              :key="sound.src"
              :label="sound.src"
            >{{sound.soundName}}</Radio>
          </RadioGroup>
        </div>
        <div
          class="close"
          @click="closeSoundMenu($event)"
        ></div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCloseSound: false, //是否关闭了声音
      selectSound: "ring_01", //选择的铃声
      everyTime: 0, //提前响铃的时间
      showSelectSoundMenu: false, //是否显示选择铃声的菜单
      soundLists: [
        {
          soundName: this.$tex("默认(闹钟铃)"),
          src: "ring_01"
        },
        {
          soundName: this.$tex("声音二(上课铃)"),
          src: "ring_02"
        },
        {
          soundName: this.$tex("声音三(打锣声)"),
          src: "ring_03"
        },
        {
          soundName: this.$tex("声音四(打鼓声)"),
          src: "ring_04"
        },
        {
          soundName: this.$tex("声音五(点滴声)"),
          src: "ring_05"
        }
      ],
      everyTime: [5, 20]
    };
  },
  computed: {
    curSoundName() {
      const sound = this.soundLists.find(sound => {
        return sound.src === this.selectSound;
      }) || {};
      return sound.soundName;
    },
    soundClass() {
      return this.isCloseSound
        ? `${this.selectSound}_disabled`
        : `${this.selectSound}`;
    }
  },
  methods: {
    changeVoice(val) {
      //发送选择的铃声源
      this.$emit("send-select-voice", val);
    },
    closeOpenSound() {
      //打开或者关闭声音按钮
      this.isCloseSound = !this.isCloseSound;
      if (this.isCloseSound) {
        this.showSelectSoundMenu = false;
      }
      this.$emit("open-close-voice", this.isCloseSound);
    },
    openSetSound() {
      //打开设置铃声
      if (this.isCloseSound) return;
      this.showSelectSoundMenu = true;
    },
    closeSoundMenu(e) {
      //关闭设置铃声
      this.showSelectSoundMenu = false;
    },
    clickExtra(e) {
      //点击其它地方关闭铃声菜单
      if (!this.$el.contains(e.target)) {
        this.showSelectSoundMenu = false;
      }
    }
  },
  mounted() {
    document.addEventListener("click", this.clickExtra);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.clickExtra);
  }
};
</script>

<style lang="less" scoped>
.sound-set {
  position: relative;
  display: flex;
  height: 100%;
  justify-content: space-between;
  flex-direction: column;
  .common {
    display: flex;
    justify-content: flex-start;
    white-space: nowrap;
    i {
      display: block;
      width: 72px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      position: relative;
      z-index: 3;
      /*   background: #ff7b00; */
      color: #fff;
      font-size: 12px;
      border-radius: 4px;
      &:hover {
        cursor: pointer;
        opacity: 0.9;
      }
    }
    span {
      display: block;
      width: 118px;
      height: 22px;
      line-height: 20px;
      text-align: left;
      margin-left: 10px;
      background-size: 18px;
      border: none;
      font-size: 12px;
      white-space: normal;
      &:hover {
        cursor: pointer;
        opacity: 0.9;
      }
    }
    &.if-open-sound {
      .iconfont {
        font-size: 18px;
      }
      .icon-voice_shurt {
        color: #999;
      }
      span {
        border: none;
      }
    }
    &.sound-setting {
      span {
        &::before {
          /*content: "默";*/
        }
      }
      .ring_01 {
        &::before {
          /*content: "默";*/
        }
      }
      .ring_01_disabled,
      .ring_02_disabled,
      .ring_03_disabled,
      .ring_04_disabled,
      .ring_05_disabled {
        color: #999;
        border-color: #999;
      }
      .ring_02 {
        &::before {
          /*content: "二";*/
        }
      }
      .ring_03 {
        &::before {
          /*content: "三";*/
        }
      }
      .ring_04 {
        &::before {
          /*content: "四";*/
        }
      }
      .ring_05 {
        &::before {
          /*content: "五";*/
        }
      }
    }
    &.has-close-voice + div {
      i {
        background-color: rgb(204, 204, 204);
        cursor: not-allowed;
      }
      span {
        cursor: not-allowed;
      }
    }
  }
  .sound-lists {
    width: 170px;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
    position: absolute;
    z-index: 999999;
    background: #fff;
    color: #313131;
    right: -5px;
    top: 55px;
    overflow: hidden;
    .lists {
      padding: 10px 20px;
    }
    .ivu-radio-group {
      width: 100%;
    }
    .ivu-radio-wrapper {
      text-align: left;
      display: flex;
      line-height: normal;
      height: auto;
      white-space: normal;
      padding: 6px 0;
    }
    .close {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 22px;
      height: 22px;
      background: url("/static/images/buyLottery/voice_close.png") no-repeat;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
    }
  }
  .hor-slide-enter-active {
    transition: all 0.3s;
  }
  .hor-slide-leave-active {
    transition: all 0.3s;
  }
  .hor-slide-enter {
    /*width: 0;*/
    opacity: 0;
  }
  .hor-slide-leave-to {
    /*width: 0;*/
    opacity: 0;
  }
}
</style>
