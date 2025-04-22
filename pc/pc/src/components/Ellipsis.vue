<template>
    <div ref="sentence" @click="handleClick"></div>
</template>

<script>
  // data	The string data that need to add ellipsis	                                String	-	true
  // line-clamp	Number of lines to display	                                            Number	1	true
  // line-height	Single line height (please calculate the corresponding px value)	String	'22px'	true
  // end-char	String at the end of the sentence	                                    String	'...'	false
  // end-html	HTML element at the end of the sentence	                                String	-	false
  // delayTime	respond to window onresize event delay time	                            Number	20	false
  // click	Click callback function	                                                    Function	-	false
  export default {
    name: "Ellipsis",
    props: {
      data: {
        type: String,
        default: ''
      },
      lineClamp: {
        type: Number,
        default: 1
      },
      lineHeight: {
        type: String,
        default: '22px'
      },
      endChar: {
        type: String,
        default: '...'
      },
      endHtml: {
        type: String,
        default: ''
      },
      delayTime: {
        type: Number,
        default: 20
      },
      debug: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      data: {
        immediate: true,
        deep: true,
        handler(value) {
          this.$nextTick(() => {
            this.handleSubstrSentence();
          })
        }
      }
    },
    mounted () {
      this.onWindowResize();
    },
    methods: {
      handleSubstrSentence () {

        const stNode = this.$refs.sentence;
        const html = this.data;

        if (html.length === 0) {

          if (this.debug) {
            console.info('vue-ellipsis: Skipping empty string.');
          }
          return false;
        }

        if (!stNode) {

          if (this.debug) {
            console.warn('vue-ellipsis: Can not get this dom.');
          }
          return false;
        }

        stNode.innerHTML = html;

        // Start and end positions
        let startPos = 0;
        let endPos = html.length;

        // CSS must set line-height, otherwise it will report an error
        const stNodeLineHeight =  this.lineHeight.slice(0, this.lineHeight.length - 2);
        let stNodeHeight = stNode.getBoundingClientRect().height || stNodeLineHeight;
        const maxHeight = stNodeLineHeight * this.lineClamp;

        if (stNodeHeight > maxHeight) {
          while (Math.abs(endPos - startPos) > 1) {
            const half = Math.ceil((endPos + startPos) / 2);
            const newhtml = html.substring(0, half);
            stNode.innerHTML = newhtml;
            stNodeHeight = stNode.getBoundingClientRect().height || stNodeLineHeight;
            if (stNodeHeight <= maxHeight) {
              startPos = half;
            } else {
              endPos = half;
            }
          }

          while (stNodeHeight > maxHeight) {
            const newHtml = stNode.innerHTML.substring(0, stNode.innerHTML.trimRight().length - 1);
            stNode.innerHTML = newHtml;
            stNodeHeight = stNode.getBoundingClientRect().height || stNodeLineHeight;
          }

          const endStr = !!this.endHtml ? this.endHtml.replace(/<[^>]+>/g,"") : '';
          const endLen = this.endChar === '...' ? 3 : endStr.length + this.endChar.length;
          // Calculate truncated spaces
          const stNodeLen = stNode.innerHTML.trimRight().length;
          const stNodeDelStr = stNode.innerHTML.substring(stNodeLen - endLen, stNodeLen);
          const match = stNodeDelStr.match(/\s+/g);
          const extraLen = match && match.length ? match.length : 0;
          const newHtml = stNode.innerHTML.substring(0, stNodeLen - endLen - extraLen) + this.endChar + this.endHtml;
          stNode.innerHTML = newHtml;
        }
      },
      handleClick(e) {
        this.$emit('click', e);
      },
      onWindowResize() {
        window.addEventListener('resize', () => {
          setTimeout(() => {
            this.handleSubstrSentence();
          }, this.delayTime || 0);
        });
      },
    }
  }
</script>

<style scoped>

</style>
