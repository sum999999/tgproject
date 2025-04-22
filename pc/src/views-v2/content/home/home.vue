<!--
 *                        _oo0oo_
 *                       o8888888o
 *                       88" . "88
 *                       (| -_- |)
 *                       0\  =  /0
 *                     ___/`---'\___
 *                   .' \\|     |// '.
 *                  / \\|||  :  |||// \
 *                 / _||||| -:- |||||- \
 *                |   | \\\  - /// |   |
 *                | \_|  ''\---/''  |_/ |
 *                \  .-\__  '-'  ___/-. /
 *              ___'. .'  /--.--\  `. .'___
 *           ."" '<  `.___\_<|>_/___.' >' "".
 *          | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *          \  \ `_.   \_ __\ /__ _/   .-` /  /
 *      =====`-.____`.___ \_____/___.-`___.-'=====
 *                        `=---='
 * 
 * 
 *      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * 
 *            佛祖保佑     永不宕机     永无BUG
 * 
 *        佛曰:  
 *                写字楼里写字间，写字间里程序员；  
 *                程序人员写程序，又拿程序换酒钱。  
 *                酒醒只在网上坐，酒醉还来网下眠；  
 *                酒醉酒醒日复日，网上网下年复年。  
 *                但愿老死电脑间，不愿鞠躬老板前；  
 *                奔驰宝马贵者趣，公交自行程序员。  
 *                别人笑我忒疯癫，我笑自己命太贱；  
 *                不见满街漂亮妹，哪个归得程序员？
 * 
 * @Author: 
 * @Date: 2023-12-29 15:26:24
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-21 10:34:17
 * @FilePath: \pc\src\views-v2\content\home\home.vue
 * @Description: 头部注释
 -->

<template>
  <div class="home-contaner">
    <gameSwiper :gameList="gameSwiperList"></gameSwiper>
    <gameCard :gameList="gameList"></gameCard>
    <appDown></appDown>
    <operateStep></operateStep>
  </div>
</template>

<script>
import gameSwiper from "./gameSwiper.vue";
import gameCard from "./gameCard.vue";
import appDown from "./appDown.vue";
import operateStep from "./operateStep.vue";
import { queryGameListTypes } from "@/api/game";

export default {
  components: { gameSwiper, gameCard, appDown, operateStep },
  data() {
    return {
      gameSwiperList: [],
      gameList: [],
    };
  },
  created() {
    this.getGameInfo();
  },
  methods: {
    getGameInfo() {
      queryGameListTypes({ code: null }).then((res) => {
        if (res.data.code !== 0) return;
        let data = res.data.data;
        this.gameSwiperList = data.list.slice(0, 3);
        this.gameList = data.list.filter((item) => item.code !== "LOTTERY");
      });
    },
  },
};
</script>

<style lang="less" scoped>
@imgSrc: "../../../assets/images/template-v2";
@deep: ~">>>";
.home-contaner {
  background-color: #121222;
  min-height: 900px;
}
</style>
