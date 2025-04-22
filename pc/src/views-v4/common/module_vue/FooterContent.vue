<template>
    <div class="footer">
        <div class="footer-inner">
          <div class="footer-title">
            <ul>
              <li><a href="javascript:void(0)">网站导航</a></li>
              <li><a href="javascript:void(0)">支持浏览器</a></li>
              <li><a href="javascript:void(0)">监管机构</a></li>
              <li><a href="javascript:void(0)">合作伙伴</a></li>
            </ul>
          </div>
          <div class="footer-list">
            <ul>
              <li>
                <p @click="$router.push('/newsList/announce')">新闻资讯</p>
                <p @click="$router.push('/newsList/guide')">新手指导</p>
                <p @click="$router.push('/helpCenter/register')">帮助中心</p>
                <p @click="$router.push('/role/3')">游戏玩法</p>
                <p @click="$router.push('/phoneBuy')">app下载</p>
              </li>
              <li>
                <img src="../../images/liulanqi.png" alt=""/>
              </li>
              <li>
                <img src="../../images/jianguan.png" alt=""/>
              </li>
              <li>
                <img src="../../images/contact.png" alt=""/>
              </li>
            </ul>
          </div>
        </div>
        <div class="bottom"><span>{{$configText.main}}持有菲律宾PAGCOR合法博彩执照&nbsp;&nbsp;版权为{{$configText.main}}所有&nbsp;&nbsp;PT游戏是由PT&nbsp;&nbsp;TRANSPACIFIC在的授权下部署</span><span class="pagcor"><img src="../../images/pagcor.png" alt=""></span></div>
    </div>
</template>
<style lang="less" scoped>
 @footerTextColor:#818381;
  .footer{
      position: relative;
      width:100%;
      height:421px;
      background: #f3f7fb url(../../images/bottom.png) no-repeat center bottom;
    background-size: cover;
  }
  .footer-inner{
    width:1300px;
    min-width: 1300px;
    margin: auto;
    padding-top:130px;
  }
  .footer-title{
    overflow: hidden;
  }
  .footer-title>ul>li{
    float:left;
    margin-right: 108px;
    &>a{
      display:block;
      font-size: 18px;
      line-height: 18px;
      color:@footerTextColor;
      font-weight: 700;
    }
  }
  .footer-list{
    margin-top:40px;
  }
  .footer-list>ul>li{
    float:left;
    &>img{
      display:block;
    }
    &:first-child{
      width:60px;
      margin-right: 108px;
      &>p{
        font-size: 14px;
        line-height: 14px;
        margin-bottom: 17px;
        color:@footerTextColor;
        cursor: pointer;
      }
    }
    &:nth-child(2){
      margin-right: 95px;
    }
    &:nth-child(3){
      margin-right: 126px;
    }
    &:nth-child(4){
      width:745px;
      &>img{
        width:100%;
        height:158px;
      }
      margin-top:-14px;
    }
  }
  .bottom{
    position: absolute;
    bottom:0;
    left:0;
    right:0;
    font-size: 0;
    text-align: center;
    line-height: 50px;
    height:50px;
    background-color:#fff;
    &>span{
      display:inline-block;
      font-size: 12px;
    }
  }
  .pagcor{
    display:inline-block;
    margin-left: 10px;
    &>img{
      float: initial;
      vertical-align: middle;
      margin-top:-4px;
    }
  }
</style>
