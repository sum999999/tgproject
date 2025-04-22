<template>
    <div class="content">
        <section id="turntable" class="gb-turntable">
            <div class="gb-turntable-container">
                <canvas class="gb-turntable-canvas" width="300" height="300px">{{$tex("抱歉！浏览器不支持。")}}</canvas>
            </div>

            <a class="gb-turntable-btn" href="javascript:;">{{$tex("抽奖")}}</a>
        </section>

    </div>
</template>
<script>
export default {
    data () {
        return {

        }
    },
    mounted () {
        this.$http.post('/api/v2/user/redpacketSetting/info', {}, { unenc: true, userId: true }).then(response => { // 查询活动信息
            if (response.data.code !== 0) return;
            let data = response.data.data, vm = this;

        })
        /*   this.$http.post('/api/v2/user/get/turnTable', { clientType: 'pc' }, { userId: true }).then(response => { // 查询活动信息
              if (response.data.code !== 0) return;
              let list = response.data.data;
              let list2 = list.map(item => {
                  text: item.turnTableName
              })
              gbTurntable.init({
                  id: 'turntable',
                  config: function (callback) {

                      callback && callback(list2)
                  },
                  getPrize: function (callback) {
                      // 获取中奖信息

                      var num = Math.random() * 6 >>> 0, //奖品ID
                          chances = num; // 可抽奖次数
                      callback && callback([num, chances]);
                  },
                  gotBack: function (data) {
                      alert('恭喜抽中' + data);
                  }
              });
          })
   */

    },

    methods: {

    }

}

</script>
  <style>
.wrapper {
    padding: 20px 40px;
}

.fork-github {
    position: fixed;
    right: -100px;
    top: 45px;
    z-index: 9999;
    padding: 2px 100px;
    font-size: 12px;
    background-color: #444;
    border: 1px solid #000;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    text-align: center;
}

.fork-github a {
    color: #fff;
}

.gb-turntable a.gb-turntable-btn {
    border: none;
}
.gb-turntable ul,
.gb-turntable li {
    margin: 0;
    padding: 0;
    list-style: none;
}

.gb-turntable {
    position: relative;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    /*  border: 16px solid #e44025; */
    /* @see http://lea.verou.me/css3patterns/*/
    /* border: 16px solid transparent;
  background:
    radial-gradient(#FFA767 15%, transparent 16%) 0 0,
    radial-gradient(#FFA767 15%, transparent 16%) 8px 8px,
    radial-gradient(rgba(255,255,255,.1) 15%, transparent 20%) 0 1px,
    radial-gradient(rgba(255,255,255,.1) 15%, transparent 20%) 8px 9px;
    background-color:#E44025;
    background-size:16px 16px; */
    box-shadow: 0 2px 3px #333, 0 0 2px #000;
}

.gb-turntable-container {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    width: inherit;
    height: inherit;
    border-radius: inherit;
    background-clip: padding-box;
    background-color: #ffcb3f;
    /*   -webkit-transition: all 6s ease;
    transition: all 6s ease; */
}

.gb-turntable-container canvas {
    width: inherit;
    height: inherit;
    border-radius: 50%;
}

.gb-turntalbe-list {
    position: absolute;
    left: 0;
    top: 0;
    width: inherit;
    height: inherit;
    z-index: 2;
}

.gb-turntable-item {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    color: #e4370e;
    font-weight: bold;
    text-shadow: 0 1px 1px rgba(255, 255, 255, 0.6);
}

.gb-turntable-item span {
    position: relative;
    display: block;
    padding-top: 20px;
    /* width: 50px; */
    margin: 0 auto;
    text-align: center;
    -webkit-transform-origin: 50% 150px;
    -ms-transform-origin: 50% 150px;
    transform-origin: 50% 150px;
}

.gb-turntable-item img {
    width: 50px;
    height: 50px;
}

.gb-turntable-btn {
    position: absolute;
    left: 110px;
    top: 110px;
    z-index: 3;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    color: #f4e9cc;
    background-color: #e44025;
    line-height: 80px;
    text-align: center;
    font-size: 20px;
    text-shadow: 0 -1px 1px rgba(0, 0, 0, 0.6);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.6);
    text-decoration: none;
}

.gb-turntable-btn::after {
    position: absolute;
    display: block;
    content: '';
    left: 10px;
    top: -46px;
    width: 0;
    height: 0;
    overflow: hidden;
    border-width: 30px;
    border-style: solid;
    border-color: transparent;
    border-bottom-color: #e44025;
}

.gb-turntable-btn.disabled {
    pointer-events: none;
    background: #b07a7b;
    color: #ccc;
}

.gb-turntable-btn.disabled::after {
    border-bottom-color: #b07a7b;
}

.gb-run {
    -webkit-transition: all 6s ease;
    transition: all 6s ease;
}
</style>
<style lang="less" scoped>
</style>
