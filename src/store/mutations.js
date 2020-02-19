import * as types from './mutation-types'
import moment from 'moment'

export default {
  [types.SET_USER] (state, user) {
    state.session.user = user
  },

  [types.UPDATE_NOTIFICATIONS] (state, notifications) {
    state.session.notifications = notifications
  },

  // TODO unfinished feature
  [types.UPDATE_SUBSCRIPTIONS] (state, subscriptions) {
    state.session.subscriptions = subscriptions
  },

  [types.DELETE_NOTIFICATION] (state, id) {
    const itemToDelete = state.session.notifications.find(item => item.id === id)
    const indexToDelete = state.session.notifications.indexOf(itemToDelete)
    state.session.notifications.splice(indexToDelete, 1)
  },

  [types.DELETE_ALL_NOTIFICATIONS] (state) {
    state.session.notifications = []
  },

  [types.SET_THEME] (state, theme) {
    state.preferences.theme = theme
  },

  [types.SET_REQUEST_LIMIT] (state, limit) {
    state.session.request_limit = limit
  },

  [types.SET_LAST_READ_AT] (state, time) {
    // YYYY-MM-DDTHH:MM:SSZ
    state.session.last_read_at = moment(time).add(1, 's').format()
  },

  [types.SET_AUTOSTART] (state, autostart) {
    state.preferences.autostart = autostart
  },

  [types.SET_SOUND] (state, sound) {
    state.preferences.sound = sound
  },

  [types.SET_PARTICIPATING] (state, participating) {
    state.preferences.participating = participating
  },

  [types.SET_PERPAGE] (state, perPage) {
    state.preferences.perPage = perPage
  },

  [types.SET_ACCESS_TOKEN] (state, token) {
    state.session.access_token = token
  },

  [types.REMOVE_ACCESS_TOKEN] (state) {
    state.session.access_token = false
  },

  [types.REMOVE_USER] (state) {
    state.session.user = {}
  },

  [types.AUTHENTICATED] (state) {
    state.session.authenticated()
  },

  [types.INIT_SESSION] (state) {
    let authenticated
    const authPromise = new Promise((resolve, reject) => {
      authenticated = resolve
    })

    state.session.ready = authPromise
    state.session.authenticated = authenticated
  }
}
