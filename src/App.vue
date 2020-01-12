<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { githubOauthSuccess } from './services/auth'

export default {
  name: 'App',
  mounted () {
    this.initApp()
  },
  methods: {
    initApp () {
      this.$store.dispatch('initApp').then(() => {
        this.$configManager.config()
        this.$helpers.toggleSettings()
        this.$helpers.toggleDonations()
        githubOauthSuccess(this.$store)
      }, error => {
        // TODO add error notification
        console.log('Error while initializing', error)
      })
    }
  }
}
</script>
