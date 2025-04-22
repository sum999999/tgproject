<template>
    <div class="rq-banner" >
        <swiper :options="swiperOption" class="rq-swiper-container" ref="rqHomeBanner"  @mouseleave.native="swiper.autoplay.start()"
                @mouseenter.native="swiper.autoplay.stop()">
            <swiper-slide v-for="(item, idx) in list" :key="idx" >
                <img :src="item.netUrl">
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
            <div class="swiper-button-prev" slot="button-prev"></div>
            <div class="swiper-button-next" slot="button-next"></div>
        </swiper>
    </div>
</template>

<script>
let vm = null;
export default {
    data () {
        return {
            list: [],
            imgList: null,
            swiperOption: {
                init: false,
                loop: true,
                initialSlide: 0,
                activeIndex: 0,
                spaceBetween: 30,
                centeredSlides: true,
                effect: 'coverflow',
                grabCursor: false,
                observer:true,
                coverflowEffect: {
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows : true
                },
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                on: {
                    slideChangeTransitionEnd: function(){
                        //切换结束后
                    },
                    click:function(e) {
                        let classList= e.target.classList;
                        if(classList.contains('swiper-button-next') || classList.contains('swiper-button-prev') || classList.contains('swiper-pagination-bullet')) {
                            return;
                        }
                        vm.goUrl(this.realIndex);
                    }
                }
            }
        }
    },
    computed: {
        swiper () {
            return this.$refs.rqHomeBanner.$swiper
        }
    },
    updated() {
        if (this.list.length>0) {
            this.$refs.rqHomeBanner.$swiper.init();
        }
    },
    methods: {
        goUrl (idx) {
            let banner = this.list[idx];
            let { targetUrl, contentType, resourceId } = banner;
            if (contentType === -1) {
                if (targetUrl) {
                    if (targetUrl.indexOf('http') > -1) {
                        window.open(targetUrl.trim(), '_blank')
                        return true
                    } else {
                        this.$router.push(targetUrl.trim());
                    }
                }
            } else if (contentType === 1 || contentType === 2) {
                this.$router.push({
                    path: '/active',
                    query: { resourceId: resourceId }
                });
            } else if (contentType === 3) {
                this.$router.push('/active');
            }
        },
    },
    created () {
        vm = this;
        this.$http.post('/api/v2/cms/queryBanners', { frontType: 'pc' }, { unenc: true }).then(response => {
            if (response.data.code !== 0) return;
            this.list = response.data.data;
        })
    },
    beforeDestroy () {
        clearInterval(this.autoPlayObj)
    }
}
</script>
<style lang="less" scoped>
@deep: ~'>>>';
.rq-banner {
    cursor: pointer;
    position: relative;
    height:440px;
    z-index: 3;
    border-radius: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    overflow:hidden;
    .rq-swiper-container {
        .swiper-lazy-preloader {
            top: 220px;
        }
        .swiper-button-prev {
            width: 75px;
            height: 75px;
            left: 17px;
            border-radius: 50%;
            text-align: center;
            background-color: rgba(0, 0, 0, .6);
            background-size: 17px 31px;
            background-image: url('~@/assets/images-v3/index/banner-pre-angle.png');
            &:hover {
                background-color: rgba(0, 0, 0, .5);
            }
        }
        .swiper-button-next {
            left: initial;
            right: 17px;
            &:extend(.rq-banner .rq-swiper-container .swiper-button-prev);
            background-image: url('~@/assets/images-v3/index/banner-next-angle.png');
        }
        .swiper-pagination {
            left: 83px;
            top: 392px;
            text-align: left;
            @{deep}.swiper-pagination-bullet {
                width: 26px;
                height: 4px;
                border-radius:4px;
                margin-right: 15px;
                background: rgba(0, 0, 0, .5);
                opacity: 1;
                &.swiper-pagination-bullet-active {
                    background: @textLightColor;
                }
            }
        }
    }

}
</style>
