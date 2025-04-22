<template>
    <span v-if="isAnimal" class="animal" :class="[`animal--${version}`]">
        <img class="animal__img" :src="imgSrc" alt="">
    </span>
    <span v-else>
        {{ text }}
    </span>
</template>

<script>
    import { checkChineseKey } from "@/lang";
    import { mapGetters } from "vuex";

    const animal = [{
      img: 'rat.png',
      activeImg: 'rat_ac.png',
      text: '鼠'
    }, {
      img: 'dragon.png',
      activeImg: 'dragon_ac.png',
      text: '龙'
    }, {
      img: 'monkey.png',
      activeImg: 'monkey_ac.png',
      text: '猴'
    }, {
      img: 'ox.png',
      activeImg: 'ox_ac.png',
      text: '牛'
    }, {
      img: 'snake.png',
      activeImg: 'snake_ac.png',
      text: '蛇'
    }, {
      img: 'rooster.png',
      activeImg: 'rooster_ac.png',
      text: '鸡'
    }, {
      img: 'tiger.png',
      activeImg: 'tiger_ac.png',
      text: '虎'
    }, {
      img: 'horse.png',
      activeImg: 'horse_ac.png',
      text: '马'
    }, {
      img: 'dog.png',
      activeImg: 'dog_ac.png',
      text: '狗'
    }, {
      img: 'rabbit.png',
      activeImg: 'rabbit_ac.png',
      text: '兔'
    }, {
      img: 'goat.png',
      activeImg: 'goat_ac.png',
      text: '羊'
    }, {
      img: 'pig.png',
      activeImg: 'pig_ac.png',
      text: '猪'
    }];

  export default {
    name: "Animal",
    props: {
      text: {
        type: String,
        default: ''
      },
      active: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      ...mapGetters(['pageTemplate']),
      version() {
        const { index } = this.pageTemplate;
        return index || '1';
      },
      isAnimal() {
        return !checkChineseKey() && this.curAnimalIndex !== -1;
      },
      curAnimalIndex() {
        const unTranslate = animal.map(item => item.text);
        const translate = unTranslate.map(text => this.$tex(text));
        if (unTranslate.includes(this.text)) {
          return unTranslate.findIndex(text => text === this.text)
        }
        if (translate.includes(this.text)) {
          return translate.findIndex(text => text === this.text)
        }
        return -1;
      },
      imgSrc() {
        if (!this.isAnimal) {
          return;
        }
        const { img, activeImg } = animal[this.curAnimalIndex];
        if (this.active) {
          return require(`@/assets/images/animal/${activeImg}`);
        }
        return require(`@/assets/images/animal/${img}`);
      }
    }
  }
</script>

<style scoped lang="less">
    .animal__img {
        float: none;
        width: auto;
        vertical-align: middle;
    }
</style>
