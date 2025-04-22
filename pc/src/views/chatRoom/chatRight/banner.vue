<template>
    <div class="banner" @mouseenter="slideArrow = true" @mouseleave="slideArrow = false">
        <swipe class="my-swipe" ref="mySwipe" @change="changeSwipe" :auto="3000" :loop="true" :pagination-clickable="true">
            <swipe-item v-for="(item, idx) in list" :key="idx">
                <span :data="item.targetUrl" @click="goPage(item.targetUrl , item.resourceId)"><img :src="item.netUrl"></span>
            </swipe-item>
        </swipe>
        <span class="slide-to change-slide" :class="{'show-arrow': slideArrow}" @click="prev()">
            <i class="i-icon i-arrow-big-left"></i>
        </span>
        <span class="slide-next change-slide" :class="{'show-arrow': slideArrow}" @click="next()">
            <i class="i-icon i-arrow-big-right"></i>
        </span>
    </div>
</template>

<script>
require('vue-swipe/dist/vue-swipe.css');
import { Swipe, SwipeItem } from 'vue-swipe';
export default {
    components: {
        Swipe,
        SwipeItem
    },
    data () {
        return {
            slideArrow: false,
            current: 0,
            list: []
        }
    },
    methods: {
        changeSwipe (newIndex) {
            this.current = newIndex;
        },
        next () {
            if (this.current === this.list.length - 1) return;
            this.$refs.mySwipe.next();
        },
        prev () {
            if (this.current === 0) return;
            this.$refs.mySwipe.prev();
        },
        goPage (url, resourceId) {
            if (url) {
                url = url.trim();
                if (url.indexOf('http') !== -1) {
                    window.open(url, '_blank');
                } else {
                    this.$store.commit('getResourceId', resourceId);
                    window.open("#" + url, '_blank');
                }
            }
        }
    },
    created () {
        this.$http.post('/api/v2/cms/queryBanners', { frontType: 'pc' }, { unenc: true }).then(response => {
            if (response.data.code !== 0) return;
            this.list = response.data.data;
        })
    }
}
</script>

<style scoped>
.banner {
    width: 100%;
    height: 157px;
    position: relative;
    overflow: hidden;
}
.banner .change-slide {
    display: block;
    position: absolute;
    top: 50%;
    width: 30px;
    height: 50px;
    background: rgba(51, 51, 51, 0.27);
    transform: translate(0, -50%);
    cursor: pointer;
    transition: all 1s;
}
.banner .my-swipe img {
    cursor: pointer;
    width: 100%;
}
.banner .slide-to {
    left: -30px;
}
.banner .slide-next {
    right: -30px;
}
.banner .slide-to.show-arrow {
    left: 0;
}
.banner .slide-next.show-arrow {
    right: 0;
}
.banner .change-slide i {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.banner >>> .mint-swipe-indicators {
    width: 100%;
    left: 0;
    text-align:center;
    transform: inherit;
}
.banner >>> .mint-swipe-indicator {
    background: #fff;
    opacity: 1;
    filter: alpha(opacity=50);
}
.banner >>> .mint-swipe-indicator.is-active {
    background: #ff7614;
}
</style>
