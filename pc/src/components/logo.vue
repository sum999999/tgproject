<!--
 *           佛曰:  
 *                   写字楼里写字间，写字间里程序员；  
 *                   程序人员写程序，又拿程序换酒钱。  
 *                   酒醒只在网上坐，酒醉还来网下眠；  
 *                   酒醉酒醒日复日，网上网下年复年。  
 *                   但愿老死电脑间，不愿鞠躬老板前；  
 *                   奔驰宝马贵者趣，公交自行程序员。  
 *                   别人笑我忒疯癫，我笑自己命太贱；  
 *                   不见满街漂亮妹，哪个归得程序员？
 * 
 * @Author: jerry
 * @Date: 2023-12-29 15:26:24
 * @LastEditors: jerry
 * @LastEditTime: 2024-05-16 16:03:22
 * @FilePath: \pc\src\components\logo.vue
 * @Description: 头部注释
 -->

<template>
  <div class="logo">
    <h1>
      <router-link to="/">
        <img class="w-full" :src="picture" :title="$configText.main + ''" />
      </router-link>
    </h1>
  </div>
</template>
<script>
export default {
  data() {
    return {
      picture: "/configstatic/pc/images/logo.gif",
    };
  },
  mounted() {
    const key = this.$store.getters.sysPlatformFlag;
    if (key == "tgdemo") {
      this.picture = "/configstatic/pc/images/logo_C.gif";
    }
  },
};
</script>

<style lang="less" scoped>
.logo {
  width: 180px;
  height: 100%;
  // padding-top: 10px;
  h1 {
    height: 100%;
    a {
      display: flex;
      align-items: center;
      height: 100%;
    }
    img {
      float: initial;
      display: block;
    }
  }
}
</style>
