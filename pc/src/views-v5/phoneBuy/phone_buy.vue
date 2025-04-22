<template>
    <div class="content phone-buy-wp">
        <div class="phone-buy">
            <div class="section-lf">
            </div>
            <div class="section-rt">
                <h2><span>娱乐手游的</span>领导者</h2>
                <h3><span>随时随地</span>想玩就玩</h3>
                <ul v-if="qrcodes[0] && qrcodes[1]">
                    <li>
                        <div class="code">
                            <img :src="qrcodes[1].img">
                            <i></i>
                        </div>
                        <p class="btn"></p>
                    </li>
                    <li>
                        <div class="code ios">
                            <img :src="qrcodes[0].img">
                            <i></i>
                        </div>
                        <p class="btn"></p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    computed:{
        qrcodes() {
            return this.$store.state.qrcodes;
        }
    }
}
</script>

<style lang="less">
  .phone-buy-wp {
    //   height: 1142px;
      .phone-buy {
        display: flex;
        justify-content: space-between;
        height: 660px;
        padding: 50px 178px 0 66px;
        background: url('~@/assets/images-v4/phoneBuy/bg.png') no-repeat;
      }
      .section-lf {
          width: 512px;
          height: 575px;
          background: url('~@/assets/images-v4/phoneBuy/machine.png') no-repeat;
          background-size: 512px 575px;
      }
      .section-rt {
          position: relative;
          margin-top: 44px;
          &:before{
              position: absolute;
              display: block;
              content: '';
              width: 53px;
              height: 45px;
              left: -41px;
              top:  -24px;
              background:url('~@/assets/images-v4/phoneBuy/rightadd.png') no-repeat;
          }
          &:after {
              position: absolute;
              display: block;
              content: '';
              width: 45px;
              height: 47px;
              right: -50px;
              top: 252px;
              background:url('~@/assets/images-v4/phoneBuy/leftadd.png') no-repeat;
          }
          h2 {
              font-family: 'PingFangSC Semibold';
              font-size: 48px;
              font-weight:normal;
              color: #fff;
              span {
                    color: @textLightColor;
              }
          }
          h3 {
              padding-left: 5px;
              font-family: 'PingFangSC Medium';
              font-size: 30px;
              font-weight: normal;
              color: #fff;
              margin-bottom: 43px;
              span {
                  margin-right: 15px;
              }
          }
         .btn {
              height: 46px;
              border-radius: 3px;
              margin-top: 35px;
              background-image: url('~@/assets/images-v4/phoneBuy/andcode.png');
              background-repeat: no-repeat;
              background-size: cover;
          }
          li {
              float: left;
              width: 177px;
              &:first-child {
                  margin-right: 30px;
              }
          }
          .code {
              position: relative;
              width: 150px;
              height: 150px;
              margin-left: 12px;
              border: 3px solid #fff;
              img {
                  width: 144px;
                  height: 144px;
              }
              i {
                  position: absolute;
                  left: 48px;
                  top: 48px;
                  display: block;
                  width: 51px;
                  height: 51px;
                  background-image: url('~@/assets/images-v4/index/andicon.png');
                  background-repeat: no-repeat;
                  background-size: cover;
              }
              &.ios {
                  i {
                      background-image: url('~@/assets/images-v4/index/iosicon.png');
                  }
                  + .btn {
                      background-image: url('~@/assets/images-v4/phoneBuy/ioscode.png');
                  }
              }
          } 
      }
    }
</style>
