import store from '@/store'
import * as types from '@/store/mutation-types'
import { openExternal } from '@/services/helpers'

export function getParams () {
  return {
    'participating': !!store.getters.preferences.participating,
    'per_page': store.getters.preferences.perPage
  }
}

let page

export function notificationService (refresh = false) {
  page = 1
  let params = getParams()
  if (refresh) {
    store.dispatch('getNotifications', params).then(response => {
      let newNotifications = response.length - store.getters.notifications.length
      if (response.length < 30 && newNotifications) {
        if (newNotifications === 1) {
          showNotification(0, response[0])
        } else {
          showNotification(newNotifications, '')
        }
      }
      store.commit(types.UPDATE_NOTIFICATIONS, response)
    })
  } else {
    store.dispatch('getNotifications', params).then(response => {
      store.commit(types.UPDATE_NOTIFICATIONS, response)
      showNotification(response.length, '')
    })
  }
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

function showNotification (len = 0, last = '') {
  if (store.getters.preferences.notification) {
    if (last) {
      console.log(last)
      let newNotification = new Notification(last.repository.full_name, {
        body: last.subject.title
      })
      newNotification.onclick = () => {
        store.commit(types.DELETE_NOTIFICATION, last.id)
        let u = last.subject.url.replace('/pulls/', '/pull/')
        openExternal(u.replace('api.github.com/repos/', 'github.com/'))
      }
    } else {
      let newNotification = new Notification('You have new notifications', {
        body: len + ' new notifications'
      })
      newNotification.onclick = () => {
        console.log('Notification clicked')
      }
    }
  }
}
