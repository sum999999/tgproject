<template>
  <div class="home-reality-wrap">
    <div class="container">
      <h1 class="text-title text-title--gradient animate__animated animate__delay-600ms">{{$tex("真人娱乐")}}</h1>
      <p class="text-title-secondary animate__animated animate__delay-600ms">{{$tex("真实的赌场环境、稳定的高端设备、专业的技术支持，给予玩家仿佛置身于现场的绝妙体验，随时可尽情享受游戏乐趣。")}}</p>
      <ul class="container home-reality animate__animated animate__delay-600ms">
        <li
          v-for="(plat, index) in filterPlats"
          :key="plat.platformId"
          class="home-reality-item"
        >
          <div class="home-reality-item__content">
            <div class="home-reality-item__card">
              <img
                class="home-reality-item__bg"
                :src="plat.pc5Icon"
                alt=""
              >
              <div class="home-reality-item__btn-wrap">
                <Button
                  class="home-reality-item__btn animate__animated animate__fast"
                  type="primary"
                  shape="circle"
                  @click="onPlatClick(plat, index)"
                >{{$tex("立即游戏")}}</Button>
              </div>
            </div>
            <div class="home-reality-item__title">{{plat.typeName}}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { queryTypePlatforms } from '@/api/game'
import ScrollReveal from 'scrollreveal'
export default {
  name: 'HomeReality',
  data() {
    return {
      plats: [
        {
          platformId: '1',
          pc5Icon: require('@/assets/images-v6/home/zhenren_ag.png'),
          typeName: this.$tex('加载中'),
        },
        {
          platformId: '2',
          pc5Icon: require('@/assets/images-v6/home/zhenren_bg.png'),
          typeName: this.$tex('加载中'),
        },
        {
          platformId: '3',
          pc5Icon: require('@/assets/images-v6/home/zhenren_bbin2.png'),
          typeName: this.$tex('加载中'),
        },
        {
          platformId: '4',
          pc5Icon: require('@/assets/images-v6/home/zhenren_lebo.png'),
          typeName: this.$tex('加载中'),
        },
      ],
    }
  },
  computed: {
    filterPlats() {
      return this.plats
        .filter((plat) => {
          return plat.platformId !== '-1'
        })
        .slice(0, 4)
    },
  },
  created() {
    this.handlePlats()
  },
  mounted() {
    this.handleScrollReveal()
  },
  methods: {
    handleScrollReveal() {
      this.$nextTick(() => {
        ScrollReveal().reveal('.home-reality-wrap .text-title', {
          delay: 600,
          beforeReveal(el) {
            el.classList.add('animate__slideInDown')
          },
        })
        ScrollReveal().reveal('.home-reality-wrap .text-title-secondary', {
          delay: 600,
          beforeReveal(el) {
            el.classList.add('animate__fadeInRight')
          },
        })
        ScrollReveal().reveal('.home-reality-wrap .home-reality', {
          delay: 600,
          beforeReveal(el) {
            el.classList.add('animate__slideInUp')
          },
        })
      })
    },
    handlePlats() {
      queryTypePlatforms({ code: 'VIDEO' }).then((res) => {
        if (res.data.code !== 0) return
        const list = res.data.data.list
        this.plats = list
      })
    },
    onPlatClick(plat, index) {
      this.$router.push(`/game/${plat.code}`)
    },
  },
}
</script>

<style scoped lang="less">
.home-reality-wrap {
  background: url('~@/assets/images-v6/home/bgzhenren.png') no-repeat center top;
  background-size: cover;
  padding: 40px 0 58px;
  overflow: hidden;
}
.text-title,
.text-title-secondary {
  text-align: center;
  visibility: hidden;
}
.text-title-secondary {
  padding: 20px 0 40px;
}
.home-reality {
  display: flex;
  justify-content: center;
  min-height: 424px;
  visibility: hidden;
}
.home-reality-item {
  margin: 0 10px;
  cursor: pointer;
}
.home-reality-item__content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.home-reality-item__card {
  position: relative;
  width: 280px;
  height: 380px;
  overflow: hidden;
  border-radius: 10px;
  &:hover {
    &::before {
      animation: Light_left 1000ms infinite linear;
    }
    &::after {
      animation: Light_right 1000ms infinite linear;
    }
    .home-reality-item__btn {
      opacity: 1;
    }
  }
}
.home-reality-item__btn-wrap {
  position: absolute;
  transform: translateY(-50%);
  top: 50%;
  left: 0;
  right: 0;
  text-align: center;
}
.home-reality-item__btn {
  opacity: 0;
  transition: all 500ms;
  margin: auto;
  width: 140px;
  height: 38px;
  font-size: 16px;
  &:hover {
    color: #ffffff;
    animation-name: pulse;
    animation-timing-function: ease-in-out;
  }
}
@keyframes Light_right {
  0% {
    left: 100%;
    transform: translateX(0);
  }
  100% {
    left: 0;
    transform: translateX(-100%);
  }
}
@keyframes Light_left {
  0% {
    left: 0;
    transform: translateX(-100%);
  }
  100% {
    left: 100%;
    transform: translateX(0);
  }
}
.home-reality-item__card:before,
.home-reality-item__card:after {
  content: '';
  width: 150px;
  height: 16px;
  position: absolute;
  left: 0;
  top: -1px;
  transform: translateX(-100%);
  z-index: 999;
  background-position-y: bottom;
  background-image: url(data:image/png;base64,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);
  background-size: cover;
  background-repeat: no-repeat;
}
.home-reality-item__card:after {
  height: 14px;
  left: 100%;
  top: auto;
  transform: translateX(0);
  bottom: 0;
  background-position-y: top;
}
.home-reality-item__title {
  color: #eadf91;
  margin-top: 20px;
  font-size: 16px;
}
</style>
