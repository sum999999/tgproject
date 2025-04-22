<template>
  <div class="change-odds">
    <!-- <div class="yuan odd-border">$</div>
        <div class="money">20</div>
        <div class="pre odd-border">-</div>   
        <div class="slider">
            <Slider></Slider>
        </div>
        <div class="add odd-border">+</div> -->
  </div>
</template>

<style>
.change-odds {
  /* height: 50px;
        line-height: 50px;
        background: #f6f4f4; */
}
.change-odds > div {
  margin-left: 10px;
  float: left;
}
.change-odds .odd-border {
  border-radius: 50%;
  border: 1px solid #d2d0d0;
  /* color: #be1204; */
  text-align: center;
}
.change-odds .yuan {
  font-size: 20px;
  width: 25px;
  height: 25px;
  line-height: 25px;
  margin-top: 12px;
}
.change-odds .money {
  font-size: 14px;
}
.change-odds .pre {
  font-size: 26px;
  width: 20px;
  height: 20px;
  line-height: 14px;
  margin-top: 15px;
}
.change-odds .add {
  font-size: 18px;
  width: 20px;
  height: 20px;
  line-height: 18px;
  margin-top: 15px;
}
.change-odds .slider {
  width: 160px;
  margin-top: 7px;
}
</style>
