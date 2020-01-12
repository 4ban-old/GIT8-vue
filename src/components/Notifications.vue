<template>
  <q-page padding class="bg-accent">
    <q-list dense dark v-if="notifications.length">
      <div class="row">
        <div class="col text-right">
          <q-btn dense outline size="sm" icon="ion-checkmark" label="Mark all as read" color="info" @click="$notifications.markAllNotifications()">
            <q-tooltip content-class="bg-secondary text-info" content-style="font-size: 16px" :offset="[10, 10]">
              Mark all downloaded notifications as read
            </q-tooltip>
          </q-btn>
        </div>
      </div>
      <q-item v-for="notification in notifications" :key="notification.id" class="rounded-borders bg-primary text-info q-my-xs">
        <q-item-section side>
          <q-icon :name="iconSet[notification.subject.type]" color="info"/>
        </q-item-section>

        <q-item-section>
          <q-item-label><div class="cursor-pointer link-hover" @click="openNotification(notification.id, notification.subject.url)">{{ notification.subject.title}}</div></q-item-label>
          <q-item-label caption class="text-info"><div class="cursor-pointer link-hover" @click="$helpers.openExternal(notification.repository.html_url)"><q-icon name="ion-git-branch"/> {{ notification.repository.full_name}}</div></q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption class="text-info">{{ $helpers.formatTime(notification.updated_at )}} <q-icon name="ion-time"/></q-item-label>
          <q-item-label caption class="text-info">{{notification.reason.replace('_', ' ')}} <q-icon name="ion-bulb"/></q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-btn round dense flat outline size="sm" icon="ion-checkmark" color="info" @click="markRead(notification)" />
        </q-item-section>
      </q-item>
    </q-list>
    <div v-else class="text-center text-white text-weight-bolder text-h6">
      Amazing! You've read all your notifications.
    </div>
    <div v-show="notifications.length" class="text-center q-pt-lg">
      <!-- <q-linear-progress dark indeterminate track-color="primary" color="positive" v-if="!notifications.length" /> -->
      <q-btn color="primary" square label="More?" icon="fas fa-chevron-down" @click="$notifications.notificationServiceNext()" class="full-width no-border-radius" />
    </div>
    <q-page-scroller expand position="top" :scroll-offset="150" :offset="[0, 0]">
      <div class="col cursor-pointer q-pa-sm bg-secondary text-white text-center">
        <q-icon name="fas fa-chevron-up"/> To top...
      </div>
    </q-page-scroller>
  </q-page>
</template>

<script>
import * as types from '@/store/mutation-types'
export default {
  name: 'Notifications',
  data () {
    return {
      iconSet: {
        'Commit': 'ion-git-commit',
        'Issue': 'fas fa-exclamation-circle',
        'PullRequest': 'ion-git-pull-request',
        'Release': 'fas fa-tag',
        'RepositoryVulnerabilityAlert': 'fas fa-exclamation-triangle'
      }
    }
  },
  computed: {
    username () {
      return this.$store.getters.username
    },
    notifications () {
      return this.$store.getters.notifications
    }
  },
  mounted () {
  },
  beforeDestroy () {},
  watch: {},
  methods: {
    openNotification (id, url) {
      this.$store.commit(types.DELETE_NOTIFICATION, id)
      this.$helpers.openExternal(url.replace('api.github.com/repos/', 'github.com/'))
    },
    markRead (notification) {
      this.$notifications.markNotification(notification.id)
    }
  } // end of methods
}
</script>

<style scoped>
</style>
