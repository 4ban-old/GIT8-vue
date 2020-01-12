<template>
  <q-layout view="lHr lpR lFr">
    <q-drawer side="right" v-model="menuPanel" :width="50" behavior="desktop" content-class="bg-dark text-info q-pa-xs">
      <!-- Header -->
      <div class="text-weight-bolder text-center">GIT<sup class="text-secondary">8</sup></div>
      <q-separator dark class="q-mb-xs"/>
      <!-- User -->
      <q-img :src="avatarUrl" :ratio="1" basic spinner-color="info" class="rounded-borders cursor-pointer" @click="$helpers.openExternal('https://github.com/', username)">
        <q-tooltip content-class="bg-secondary text-info" content-style="font-size: 16px" :offset="[10, 10]">
          {{ username }}
        </q-tooltip>
      </q-img>
      <q-separator dark class="q-my-xs"/>
      <!-- Menu -->
      <div>
        <q-btn outline dense class="full-width q-mt-xs" size="sm" color="info" icon="ion-refresh" @click="$notifications.notificationService()">
          <q-tooltip content-class="bg-secondary text-info" content-style="font-size: 16px" :offset="[10, 10]">
            Refresh notifications
          </q-tooltip>
        </q-btn>
        <q-btn class="full-width q-mt-xs" color="secondary" :text-color="this.$router.currentRoute.path === '/' ? 'info': 'dark'" icon="ion-notifications" to="/" >
          <q-badge color="negative" class="text-black" floating v-show="newNotifications > 0">{{ newNotifications }}</q-badge>
        </q-btn>
        <q-btn disable class="full-width q-mt-xs" color="secondary" :text-color="this.$router.currentRoute.path === '/statistics' ? 'info': 'dark'" icon="fas fa-chart-pie" to="/statistics" />
        <q-btn class="full-width q-mt-xs" color="secondary" :text-color="this.$router.currentRoute.path === '/ch' ? 'info': 'dark'" icon="ion-alert" to="/ch" />
      </div>
      <!-- Footer -->
      <div class="absolute-bottom q-pa-xs">
        <q-separator dark class="q-my-xs"/>
        <!-- <q-btn class="full-width q-mt-xs" color="positive" :text-color="this.$router.currentRoute.path === '/settings' ? 'white': 'dark'" icon="ion-settings" to="/settings" /> -->
        <q-btn class="full-width q-mt-xs" color="secondary" text-color="dark" icon="ion-settings" @click="$helpers.openSettings()" />
        <q-btn class="full-width q-mt-xs" color="secondary" text-color="dark" icon="fas fa-donate" @click="$helpers.openDonations()" />
        <q-btn outline class="full-width q-mt-xs" color="negative" text-color="negative" icon="ion-exit" @click="logout()" >
          <q-tooltip content-class="bg-negative text-black" content-style="font-size: 16px" :offset="[10, 10]">
            Sign-out
          </q-tooltip>
        </q-btn>
      </div>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
export default {
  name: 'Default',
  data () {
    return {
      menuPanel: true
    }
  },
  mounted () {
    this.$notifications.notificationService()
    // TODO uncomment for production
    // this.i1 = setInterval(() => this.$notifications.notificationService(), 60000)
  },
  beforeDestroy () {
    clearInterval(this.i1)
  },
  computed: {
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    },
    username () {
      return this.$store.getters.username
    },
    avatarUrl () {
      return this.$store.getters.avatarUrl
    },
    newNotifications () {
      this.$helpers.updateTrayIcon(this.$store.getters.notifications.length)
      return this.$store.getters.notifications.length
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('logout').then(() => {
        this.$helpers.updateTrayIcon()
        this.$router.push({ path: '/login' })
      })
    }
  }
}
</script>
