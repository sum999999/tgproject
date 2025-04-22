import Vue from 'vue';

export default {
    inserted(el,binding) {
        el.addEventListener('click',() => {
            if(!el.disabled) {
                el.disabled = true;
                el.clickTimer = setTimeout(() => {
                    el.disabled = false
                },binding.value || 2000);
            }
        });
    },
    unbind(el,binding) {
        if(el.clickTimer) {
            clearTimeout(el.clickTimer);
        }
    }
};
