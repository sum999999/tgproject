<template>
    <div class="balls-prize-result">
        <div class="balls-wp">
            <template v-if="code==='pk10'">
                <span v-for="(ball,index) of lotNumbers" :key="index" class="ball pk10" :class="[index !==0 ? `pk10-${ball}` : '']">{{ball}}</span>
            </template>
            <template v-if="code === 'ssc'">
                <span v-for="(ball,index) of lotNumbers" class="ball base-bg" :key="index">{{ball}}</span>
                <!-- 其它信息 26 大 | 双 -->
                <span></span>
            </template>
            <template v-if="code==='ksan'">
                <span v-for="(ball,index) of lotNumbers" :key="index" class="ksan" :class="[`ksan-${ball}`]">{{ball}}</span>
                <span></span>
            </template>
             <template v-if="code==='6hc'">
                <!-- <span v-for="(ball,index) of lotNumbers" :key="index" class="ksan" :class="[`ksan-${ball}`]">{{ball}}</span>
                <span></span> -->
            </template>
            <template v-if="code==='pcdd'">
                <!-- <span v-for="(ball,index) of lotNumbers" :key="index" class="ksan" :class="[`ksan-${ball}`]">{{ball}}</span>
                <span></span> -->
            </template>
            <template v-if="code==='fc3d'">
                <span v-for="(ball,index) of lotNumbers" :key="index" class="ball base-bg">{{ball}}</span>
            </template>
            <template v-if="code==='11x5'">
                <span v-for="(ball,index) of lotNumbers" :key="index" class="ball base-bg">{{ball}}</span>
            </template>
            <template v-if="code==='klsf'">
                <span v-for="(ball,index) of lotNumbers" :key="index" class="ball base-bg">{{ball}}</span>
            </template>
            <template v-if="code === 'qtcp'">
                <span v-for="(ball,index) of lotNumbers" :key="index" class="ball base-bg">{{ball}}</span>
            </template>
            <!-- <span v-if="isShowBtmDom"></span> -->
        </div>
    </div>
</template>

<script>
export default {
    props:{
        lotNumbers:{
            type:Array,
            default:function() {
                return []
            }
        },
        code:{
            type:String,
            default:[]
        }
    },
    computed:{
        // pureClass() { //第一个span的class
        //     switch (code) {
        //         case 'pk10':
        //             return 'pk10'
        //         default:
        //             break;
        //     }
        // },
        // isShowBtmDom() { //六合彩才显示第二个span
        //     return code === '6hc' || code === 'pcdd';
        // }
    }
}
</script>

<style lang="less">
.balls-award-result {
    width: 100%;
    height: 100%;
    overflow:hidden;
    .balls-wp {
        font-size: 0;
        .ball { //号码公共样式
            display: inline-block;
            width: 25px;
            height: 25px;
            margin: 0 2px;
            line-height: 25px;
            text-align: center;
            border-radius: 50%;
            color: #fff;
            font-size: 14px;
        }
        .base-bg {
            background:radial-gradient(#ff6050 7%, #e50000);
        }
        .pk10 {
            border-radius: 0;
            background: url(/static/images/icon.png) no-repeat -242px -10px;
        }
        .pk10-02 {
            background-position: -210px -10px;
        }
        .pk10-03 {
            background-position: -178px -10px;
        }
        .pk10-04 {
            background-position: -147px -10px;
        }
        .pk10-05 {
            background-position: -20px -10px;
        }
        .pk10-06 {
            background-position: -52px -10px;
        }
        .pk10-07 {
            background-position: -272px -10px;
        }
        .pk10-08 {
            background-position: -83px -10px;
        }
        .pk10-09 {
            background-position: -115px -10px;
        }
        .pk10-10 {
            background-position: -305px -10px;
        }
        // 时时彩
        .ssc {
            background:radial-gradient(#ff6050 7%, #e50000);
            &:last-child {
                width: auto;
                background: none;
                color: #313131;
                text-align: left;
            }
        }
        //快三
        .ksan {
            height: 24px;
            background: url(~@/assets/images/icon.png) no-repeat -326px -463px;
            &:last-child {
                vertical-align: top;
                width: auto;
                background: none;
                color: #313131;
                border-radius: 0px;
                text-align: left;
            }
        }
        .ksan-2 {
            background-position: -355px -463px;
        }
        .ksan-3 {
            background-position: -385px -463px;
        }
        .ksan-4 {
            background-position: -414px -463px;
        }
        .ksan-5 {
            background-position: -444px -463px;;
        }
        .ksan-6 {
            background-position: -473px -463px;
        }
    }
}
</style>
