import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import * as types from './mutation-types'
import plugins from './plugins'
import mutations from './mutations'
import { configStore, initConfig } from '@/services/configManager'

initConfig()

const state = {
  server: {
    url: 'https://api.github.com'
  },
  session: {
    access_token: window.localStorage.getItem('access_token'),
    ready: false,
    authenticated: false,
    user: {},
    notifications: [],
    request_limit: 0,
    last_read_at: 0,
    subscriptions: []
  },
  preferences: {
    theme: configStore.get('theme') || 'Dark',
    sound: configStore.get('sound') || true,
    autostart: configStore.get('autostart') || false,
    participating: configStore.get('participating') || false,
    perPage: configStore.get('perPage') || 30
  }
}

mutations[types.INIT_SESSION](state)

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  plugins,
  strict: process.env.NODE_ENV !== 'production'
})
