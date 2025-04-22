<template>
    <canvas ref="bubbles"></canvas>
</template>

<script>
  export default {
    name: "index",
    props: {
      resize: {
        type: Function,
        default() {
          return () => {
            return {
              width: 0,
              height: 0
            }
          };
        }
      },
    },
    data() {
      return {
        isEnter: false,
        bubbles: null,
      };
    },
    mounted() {
      this.$nextTick(() => {
        this.handleAnimate();
      })
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.bubbles.debounceResize);
      this.bubbles.stop();
    },
    methods: {
      updateMouse(offsetX, offsetY) {
        this.bubbles.mousex = offsetX;
        this.bubbles.mousey = offsetY;
      },
      debounce(func, wait, immediate) {
        let timeout;
        return function() {
          let context = this,
            args = arguments;
          let later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
          };
          let callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);

          if (callNow) func.apply(context, args);
        }
      },
      handleAnimate() {
        const _t = this;
        let winsize = {};
        this.bubbles = {
            canvas: null,
            ctx: null,
            mousex: winsize.width - 0,
            mousey: winsize.height - 0,
            cntr: 0,
            circleArr: new Array(),
            requestTd: undefined,
            init: function() {
              this.canvas = _t.$refs.bubbles;
              this.ctx = this.canvas.getContext('2d');

              const { width, height } = _t.resize();
              winsize = {
                width,
                height
              };
              this.canvas.width = width;
              this.canvas.height = height;

              var self = this;
              this.debounceResize = _t.debounce(function() {
                const { width, height } = _t.resize();
                winsize = {
                  width,
                  height
                };
                self.canvas.width = width;
                self.canvas.height = height;
              }, 10);
              window.addEventListener('resize', this.debounceResize);
            },
            loop: function() {
              this.requestId = requestAnimationFrame(_t.bubbles.loop.bind(this));
              this.update();
              this.render();
            },
            update: function() {
              if (this.cntr++ % 5 == 0) {
                this.createCircle();
              }

              for (var circle in this.circleArr) {
                circle = this.circleArr[circle];
                var max = 2,
                  min = -2;
                if (this.mousex <= winsize.width / 2) {
                  min = -4;
                } else if (this.mousex >= winsize.width / 2) {
                  max = 4;
                }
                circle.x += Math.floor(Math.random() * (max - min + 2)) + min;
                circle.y -= Math.random() * 10;
              }
              while (this.circleArr.length > 2 && (this.circleArr[0].x + this.circleArr[0].s > winsize.width || this.circleArr[0].x + this.circleArr[0].s < 0 || this.circleArr[0].y + this.circleArr[0].s > winsize.height || this.circleArr[0].y + this.circleArr[0].s < 0)) {
                this.circleArr.shift();
              }
            },
            render: function() {
              this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
              for (var circle in this.circleArr) {
                var current = this.circleArr[circle];
                this.drawCircle(current.x, current.y, current.s);
              }
            },
            createCircle: function() {
              var temp = this.circleArr[this.circleArr.length - 1];
              this.circleArr[this.circleArr.length] = {
                x: this.mousex,
                y: this.mousey,
                s: Math.random() * winsize.height / 50
              };
            },
            drawCircle: function(x, y, radius) {
              this.ctx.fillStyle = "rgba(255,255,255,0.5)";
              this.ctx.beginPath();
              this.ctx.arc(x, y, radius, 0, Math.PI * 2, false);
              this.ctx.fill();
            },
            start: function() {
              if (!this.requestId) {
                this.loop();
              }
            },
            stop: function() {
              if (this.requestId) {
                window.cancelAnimationFrame(this.requestId);
                this.requestId = undefined;
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
              }
            },
          };
        this.bubbles.init();
        this.bubbles.start();
      }
    }
  }
</script>

<style scoped lang="less">
    canvas {
        position: absolute;
    }
</style>
