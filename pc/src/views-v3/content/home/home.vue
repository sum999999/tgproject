<template>
    <div class="home content">
         <banner></banner>
         <div>
             <announce/>
         </div>
         <main-content></main-content>
    </div>
</template>

<script>
import banner from "./banner3d";
import announce from '@/views-v3/common/module_vue/annouce';
import mainContent from './main';
export default {
    components: {
        banner,
        announce,
        mainContent
    }
}
</script>

<style lang="less">


</style>


