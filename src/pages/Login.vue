<template>
  <q-layout class="background-gradient">
    <q-page-container>
      <q-page>
        <div class="fixed-top-right q-pa-xs">
          <q-btn flat round color="black" class="q-mx-xs" icon="fab fa-github" @click="$helpers.openExternal('https://github.com/4ban/git8')" />
        </div>
        <div class="row window-height items-center">
          <div class="col text-center ">
            <img src="@/statics/icons/icon-256x256.png" style="height: 256px; max-width: 256px" />
            <div>
              <q-badge outline color="black" transparent>{{ version }}</q-badge>
            </div>
            <div class="text-h3 text-weight-bolder text-black">
              GIT<sup class="text-black">8</sup>
            </div>
            <div class="q-pa-sm">
              <q-btn v-show="!authorizing" outline color="black" icon="fab fa-github" label="Sign in with GitHub" @click.native="login()"/>
              <q-spinner v-show="authorizing" color="black" size="3em" />
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'login',
  data () {
    return {
      authorizing: false,
      version: ''
    }
  },
  mounted () {
    this.version = this.$helpers.getVersion()
  },
  methods: {
    login () {
      this.authorizing = true
      this.$store.dispatch('getToken').then(res => {
        this.$store.getters.onAuthenticated.then(this.onSuccess)
      }, err => {
        // TODO add error notification
        console.log('Error while getting token', err)
      })
    },
    onSuccess () {
      this.authorizing = false
      this.$router.push({ path: '/' })
    }
  }
}
</script>

<style scoped>

</style>
