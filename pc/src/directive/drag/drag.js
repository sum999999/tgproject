/**
 * v-drag
 * @desc
 * @example
 * ```vue
 * <div v-drag>
 * ```
 */
const dragContext = "@@dragContext";

export default {
  bind(el, binding, vnode) {
    const dragEl = el.firstChild;
    if (!dragEl) {
      return void 0;
    }
    const elementResizeDetectorMaker = require("element-resize-detector");
    const erd = elementResizeDetectorMaker();
    let dragOffsetLeft = null;
    let dragOffsetTop = null;
    let leftEdge = 0;
    let topEdge = 0;
    let elWidth = 0;
    let elHeight = 0;
    const resizeHandler = (element) => {
      if (element.nodeType === 1) {
        elWidth = element.offsetWidth;
        elHeight = element.offsetHeight;
      }
      leftEdge = document.body.offsetWidth - elWidth;
      topEdge = document.body.offsetHeight - elHeight;
    };
    window.addEventListener("resize", resizeHandler);
    erd.listenTo(el, resizeHandler);
    el[dragContext] = {
      erd,
      resizeHandler,
    };
    el.style["will-change"] = "transform";
    dragEl.onmousedown = function(ev) {
      const elInitLeft = el.offsetLeft;
      const elInitTop = el.offsetTop;
      const elLeft = dragOffsetLeft !== null ? dragOffsetLeft : elInitLeft;
      const elTop = dragOffsetTop !== null ? dragOffsetTop : elInitTop;
      const offsetX = ev.clientX - elLeft;
      const offsetY = ev.clientY - elTop;
      const moveHandler = function(ev) {
        dragOffsetLeft = ev.clientX - offsetX;
        dragOffsetLeft = dragOffsetLeft >= 0 ? dragOffsetLeft : 0;
        dragOffsetLeft = dragOffsetLeft >= leftEdge ? leftEdge : dragOffsetLeft;
        dragOffsetTop = ev.clientY - offsetY;
        dragOffsetTop = dragOffsetTop >= 0 ? dragOffsetTop : 0;
        // dragOffsetTop = dragOffsetTop >= topEdge ? topEdge : dragOffsetTop;
        el.style.transform = `translate3d(${dragOffsetLeft -
          elInitLeft}px, ${dragOffsetTop - elInitTop}px, 0)`;
      };
      const removeMoveHandler = () => {
        document.removeEventListener("mousemove", moveHandler);
      };
      el[dragContext].moveHandler = moveHandler;
      el[dragContext].removeMoveHandler = removeMoveHandler;
      document.addEventListener("mousemove", moveHandler);
      dragEl.onmouseup = removeMoveHandler;
      document.addEventListener("mouseup", removeMoveHandler);
      document.addEventListener("mouseleave", removeMoveHandler);
      return false;
    };
  },

  update(el, binding) {},

  unbind(el) {
    const dragEl = el.firstChild;
    if (!dragEl) {
      return void 0;
    }
    dragEl.onmousedown = dragEl.onmouseup = null;
    window.removeEventListener("resize", el[dragContext].resizeHandler);
    el[dragContext].erd.removeListener(el, el[dragContext].resizeHandler);
    document.removeEventListener("mousemove", el[dragContext].moveHandler);
    document.removeEventListener("mouseup", el[dragContext].removeMoveHandler);
    document.removeEventListener(
      "mouseleave",
      el[dragContext].removeMoveHandler
    );
  },
};
