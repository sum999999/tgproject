<template>
    <ul class="base-contact">
        <li v-if="servicerBBM" class="base-contact__item">
            <a :href="servicerBBM" target="_blank">
                <img class="base-contact__icon" src="~@/assets/images-v6/contact/bbm.png" alt="">
            </a>
        </li>
        <li v-if="servicerFaceBook" class="base-contact__item">
            <a :href="servicerFaceBook" target="_blank">
                <img class="base-contact__icon" src="~@/assets/images-v6/contact/fb.png" alt="">
            </a>
        </li>
        <li v-if="servicerInstagram" class="base-contact__item">
            <a :href="servicerInstagram" target="_blank">
                <img class="base-contact__icon" src="~@/assets/images-v6/contact/ig.png" alt="">
            </a>
        </li>
        <li v-if="servicerLine" class="base-contact__item">
            <a :href="servicerLine" target="_blank">
                <img class="base-contact__icon" src="~@/assets/images-v6/contact/line.png" alt="">
            </a>
        </li>
        <li v-if="servicerShareChat" class="base-contact__item">
            <a :href="servicerShareChat" target="_blank">
                <img class="base-contact__icon" src="~@/assets/images-v6/contact/SChat.png" alt="">
            </a>
        </li>
        <li v-if="servicerSkype" class="base-contact__item">
            <a :href="servicerSkype" target="_blank">
                <img class="base-contact__icon" src="~@/assets/images-v6/contact/Skype.png" alt="">
            </a>
        </li>
        <li v-if="servicerWhatsApp" class="base-contact__item">
            <a :href="servicerWhatsApp" target="_blank">
                <img class="base-contact__icon" src="~@/assets/images-v6/contact/whatsapp.png" alt="">
            </a>
        </li>
        <li v-if="servicerZalo" class="base-contact__item">
            <a :href="servicerZalo" target="_blank">
                <img class="base-contact__icon" src="~@/assets/images-v6/contact/zl.png" alt="">
            </a>
        </li>
    </ul>
</template>

<script>
    import { mapGetters } from "vuex";

  export default {
    name: "BaseContact",
    computed: {
      ...mapGetters(["servicerBBM", "servicerFaceBook", "servicerInstagram", "servicerLine", "servicerShareChat", "servicerSkype", "servicerWhatsApp", "servicerZalo"])
    }
  }
</script>

<style scoped lang="less">
    .base-contact {
        display: flex;
        align-items: center;
        font-size: 0;
    }
    .base-contact__icon {
        display: inline-block;
        width: 27px;
        height: 26px;
        float: none;
        cursor: pointer;
        margin: 0 8px;
        object-fit: contain;
    }
</style>
