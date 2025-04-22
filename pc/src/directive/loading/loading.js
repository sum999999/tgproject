import Vue from 'vue';
const toggleLoading = (el, togValue, flag) => {
    let flagItm = false;
    Array.prototype.slice.call(el.children).forEach(itm => {
        itm.className.split(' ').forEach(item => {
            flagItm = item == 'lee-globaloading' ? true : false
        })
    });
    if (togValue == flagItm) {
        return false
    } else if (togValue) {
        let dom = document.createElement('div')
        dom.className = 'lee-globaloading'
        dom.innerHTML = `    <div class="contsalrufds"><div class="wrapp"><div class="load-3"><div class="k-line2 k-line12-1"></div><div class="k-line2 k-line12-2"></div><div class="k-line2 k-line12-3"></div><div class="k-line2 k-line12-4"></div><div class="k-line2 k-line12-5"></div><div class="k-line2 k-line12-6"></div><div class="k-line2 k-line12-7"></div><div class="k-line2 k-line12-8"></div></div></div></div>`
        let elPosition = getStyle(el, 'position')
        dom.addEventListener('click', stopPop)
        if (elPosition == 'static') {
            el.className += ' posRel'
        }
        nextIndex(dom, el)
    } else if (!togValue) {
        setTimeout(() => {
            let dom = document.getElementsByClassName('lee-globaloading')[0]
            dom.remove();
        }, 850)
    }
}
const nextIndex = (cdom, el) => {
    let zdx = getStyle(el, 'z-index')
    zdx = zdx == 'auto' ? 1000 : zdx * 1 + 1000
    cdom.style['z-index'] = zdx
    el.appendChild(cdom)
}
const stopPop = e => {
    e.stopPropagation()
}
const getStyle = (e, a) => {
    if (e.currentStyle) {
        return e.currentStyle[a]
    } else {
        return getComputedStyle(e)[a]
    }
}

export default {
    inserted: function(el, binding, vnode) {
        toggleLoading(el, binding.value, true)
    },
    update(el, binding) {
        if (binding.oldValue !== binding.value) {
            toggleLoading(el, binding.value, false)
        }
    },
    unbind(el, binding) {
        toggleLoading(el, binding.value, false)
    }
};
