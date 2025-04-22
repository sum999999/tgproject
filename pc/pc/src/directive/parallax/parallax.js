const parallaxContext = "@@parallaxContext";

export default {
  bind(el, binding) {
    function mousemoveHandler(e) {
      const pEl = el[parallaxContext].pEl;
      pEl.style.transition = 'transform .04s linear';
      var centerX = pEl.offsetWidth / 2,  //div中心点到页面左边距离
        centerY = pEl.offsetTop + pEl.offsetHeight / 2;

      var deltaX = e.pageX - centerX,
        deltaY = e.pageY - centerY;
      var percentageX = deltaX / centerX,  //向左或向右的 偏差率
        percentageY = deltaY / centerY;
      const deg = Number(binding.arg) || 10;  //控制 偏差的 程度
      pEl.style.transform = `translate3d(${-percentageX * deg}px, ${-percentageY * deg}px, 0)`
    }
    el[parallaxContext] = {
      mousemoveHandler,
      pEl: el.querySelector(binding.value)
    };
    console.log()
    el.addEventListener("mousemove", mousemoveHandler);
  },
  update(el, binding) {
    el[parallaxContext].pEl = el.querySelector(binding.value);
  },
  unbind(el, binding) {
    el.removeEventListener("mousemove", el[parallaxContext].mousemoveHandler);
  }
}
