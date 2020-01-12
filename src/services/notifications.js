import store from '@/store'
import * as types from '@/store/mutation-types'

export function getParams () {
  return {
    'participating': !!store.getters.preferences.participating,
    'per_page': store.getters.preferences.perPage
  }
}

let page

export function notificationService () {
  page = 1
  let params = getParams()
  store.dispatch('getNotifications', params).then(response => {
    console.log('response:', response)
    store.commit(types.UPDATE_NOTIFICATIONS, response)
  })
}

export function notificationServiceNext () {
  page += 1
  let params = getParams()
  store.dispatch('getNotificationsNext', { page, params }).then(response => {
    store.commit(types.UPDATE_NOTIFICATIONS, [...store.getters.notifications, ...response])
  })
}

export function markNotification (id) {
  store.dispatch('markNotification', id).then(response => {
    if (response.status === 205) {
      store.commit(types.DELETE_NOTIFICATION, id)
    } else {
      // TODO add error notification
      console.log('Can\'t mark this notification as read.')
    }
  })
}

export function markAllNotifications () {
  store.dispatch('markAllNotification').then(response => {
    if (response.status === 205) {
      store.commit(types.DELETE_ALL_NOTIFICATIONS)
    } else {
      // TODO add error notification
      console.log('Can\'t mark all notifications as read.')
    }
  })
}
