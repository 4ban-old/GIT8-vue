import store from '@/store'
import { enableTheme } from '@/services/themes'
import { setAutoLaunch } from '@/services/helpers'
const Store = require('electron-store')
const fs = require('fs')

const schema = {
  theme: {
    type: 'string'
  },
  autostart: {
    type: 'boolean'
  },
  sound: {
    type: 'boolean'
  },
  notification: {
    type: 'boolean'
  },
  participating: {
    type: 'boolean'
  },
  perPage: {
    type: 'number'
  }
}
export const configStore = new Store({ schema, name: 'git8' })

export function initConfig () {
  fs.access(configStore.path, error => {
    if (error) {
      configStore.set('theme', 'Dark')
      configStore.set('autostart', false)
      configStore.set('sound', true)
      configStore.set('notification', true)
      configStore.set('participating', false)
      configStore.set('perPage', 30)
    }
  })
}

export function config () {
  enableTheme(store.getters.preferences.theme)
  setAutoLaunch(store.getters.preferences.autostart)
}
