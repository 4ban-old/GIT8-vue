<template>
  <q-page padding class="bg-accent">
    <div>You watching for: {{ subscriptions.length }}</div>
    <q-btn label='test' @click="test()"/>
    <!-- Scroller -->
    <q-page-scroller expand position="top" :scroll-offset="150" :offset="[0, 0]">
      <div class="col cursor-pointer q-pa-sm bg-secondary text-white text-center">
        <q-icon name="fas fa-chevron-up"/> To top...
      </div>
    </q-page-scroller>
  </q-page>
</template>

<script>

export default {
  name: 'Statistics',
  data () {
    return {
    }
  },
  mounted () {
    this.$statistics.getSubscriptions()
    this.i1 = setInterval(() => this.$statistics.getSubscriptions(), 60000)
  },
  beforeDestroy () {
    clearInterval(this.i1)
  },
  computed: {
    subscriptions () {
      return this.$store.getters.subscriptions
    }
  },
  watch: {},
  methods: {
    test () {
      let myNotification = new Notification('Title', {
        body: 'Lorem Ipsum Dolor Sit Amet'
      })
      myNotification.onclick = () => {
        console.log('Notification clicked')
      }
    }
  } // end of methods
}
</script>

<style scoped>
</style>
