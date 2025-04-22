<template>
  <component :is="view"
             @replace-view="replaceView"
             v-on="$listeners"></component>
</template>

<script>

function AsyncComponent (path) {
  return (resolve) => {
    return import('./' + path).then((_module) => {
      const _default = _module.default
      const mounted = _module.default.mounted || function () { }
      _module.default.mounted = function () {
        this.$emit('handler-spin', false)
        mounted.apply(this, arguments)
      }
      return resolve(_module)
    })
  }
}
const YebView = AsyncComponent('YebView')
const YebTransferIn = AsyncComponent('YebTransferIn')
const YebTransferOut = AsyncComponent('YebTransferOut')
const cacheViews = []

export default {
  name: 'YebDetail',
  components: {
    YebView,
    YebTransferIn,
    YebTransferOut
  },
  data () {
    return {
      view: '',
    }
  },
  mounted () {
    this.showView('YebView')
  },
  methods: {
    handleTabClick () {
      this.showView('YebView')
    },
    replaceView (view) {
      this.showView(view)
    },
    showView (view) {
      if (cacheViews.indexOf(view) === -1) {
        this.$emit('handler-spin', true);
        cacheViews.push(view)
      }
      this.view = view
    },
  }
}

</script>