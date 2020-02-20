<template>
  <q-dialog full-width ref="dialog" @hide="onDialogHide" persistent transition-show="flip-down" transition-hide="flip-up">
    <q-card class="q-dialog-plugin bg-primary text-info">
      <q-bar>
        <q-icon name="ion-settings" />
        <div>Settings</div>
        <q-space />
        <q-badge color="warning" outline>
          <q-icon name="fas fa-server" class="q-mr-xs" />{{ requestLimit }}
          <q-tooltip content-class="bg-warning text-black" content-style="font-size: 16px" :offset="[10, 10]">
            Number of requests per hour left to the server.
          </q-tooltip>
        </q-badge>
        <q-space />
        <q-btn size="sm" :flat="theme === 'Dark' ? false : true" outline dense color="warning" class="q-mx-xs" icon="ion-moon" @click="setTheme('Dark')" />
        <q-btn size="sm" :flat="theme === 'Light' ? false : true" outline dense color="warning" class="q-mx-xs" icon="ion-sunny" @click="setTheme('Light')" />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip content-class="bg-secondary text-info">Close</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section>
        <q-list>
          <q-item-label header class="text-warning">General settings</q-item-label>
          <q-item tag="label" v-ripple>
            <q-item-section>
              <q-item-label>Open at startup</q-item-label>
              <q-item-label caption>Run the GIT8 when you login into the system</q-item-label>
            </q-item-section>
            <q-item-section side top>
              <q-toggle color="dark" v-model="autostart"/>
            </q-item-section>
          </q-item>
          <q-separator spaced />
          <q-item-label header class="text-warning">Notifications</q-item-label>
          <div class="row">
            <div class="col">
              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label>Notifications</q-item-label>
                  <q-item-label caption>If disabled, the system notifications will not appear. (i.e. silence mode)</q-item-label>
                </q-item-section>
                <q-item-section side >
                  <q-toggle color="dark" v-model="notification"/>
                </q-item-section>
              </q-item>
            </div>
            <div class="col">
              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label>Participating only</q-item-label>
                  <q-item-label caption>If enabled, only shows notifications in which the user is directly participating or mentioned</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle color="dark" v-model="participating" />
                </q-item-section>
              </q-item>
            </div>
          </div>
          <q-item tag="label" v-ripple>
            <q-item-section>
              <q-item-label>Notifications per page</q-item-label>
              <q-item-label caption>Allowed: 5, 10, 15 ... 100</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-input dark dense v-model="perPage" ref="input" filled color="dark" :rules="[ val => (!isNaN(val) && val <= 100 && val > 0 && val%5==0) || 'Wrong number']">
              </q-input>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="primary" label="OK" @click="onOKClick" />
        <q-btn color="primary" label="Cancel" @click="onCancelClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import store from '@/store'

export default {
  props: {
  },
  data () {
    return {
      perPage: parseInt(store.getters.preferences.perPage),
      participating: !!store.getters.preferences.participating,
      autostart: !!store.getters.preferences.autostart,
      sound: !!store.getters.preferences.sound,
      notification: !!store.getters.preferences.notification
    }
  },
  computed: {
    theme () {
      return store.getters.preferences.theme
    },
    requestLimit () {
      return store.getters.requestLimit
    }
  },
  methods: {
    setTheme (theme) {
      store.dispatch('setTheme', theme)
    },
    show () {
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },
    onDialogHide () {
      this.$emit('hide')
    },
    onOKClick () {
      this.$emit('ok')
      this.hide()
      store.dispatch('setPerPage', parseInt(this.perPage))
      store.dispatch('setParticipating', this.participating)
      store.dispatch('setSound', this.sound)
      store.dispatch('setNotification', this.notification)
      store.dispatch('setAutostart', this.autostart)
      this.$notifications.notificationService()
    },
    onCancelClick () {
      this.hide()
    }
  }
}
</script>
