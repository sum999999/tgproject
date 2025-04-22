<template>
    <div class="my-account">
        <div class="account-content">
            <expand></expand>
        </div>
    </div>
</template>
<script>
import expand from './expand_list'
export default {
    components: {
        expand
    },
    data () {
        return {
        }
    },
    created () {

    }
}
</script>

<style lang = "less">
.my-account {
    .account-content {
        padding-top: 12px;
    }
}
</style>