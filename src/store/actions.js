import * as types from './mutation-types'
import * as axios from 'axios'
import { ipcRenderer } from 'electron'
import { configStore } from '@/services/configManager'
import { enableTheme } from '@/services/themes'
import { setAutoLaunch } from '@/services/helpers'

const getAxiosClient = state => {
  return axios.create({
    baseURL: state.server.url,
    headers: {
      'Authorization': 'token ' + state.session.access_token,
      'Content-Type': 'application/json',
      'If-None-Match': ''
    },
    responseType: 'json'
  })
}

export const getToken = ({ commit }) => {
  ipcRenderer.send('github-oauth')
}

export const logout = ({ commit }) => {
  return new Promise(resolve => {
    commit(types.REMOVE_ACCESS_TOKEN)
    commit(types.INIT_SESSION)
    commit(types.REMOVE_USER)
    resolve()
  })
}

export const getUser = ({ commit, state }) => {
  return new Promise((resolve, reject) => {
    getAxiosClient(state).get('/user').then(response => {
      commit(types.SET_USER, response.data)
      resolve(response.data)
    }, err => {
      // TODO add error notification
      console.log(err)
      reject(err)
    })
  })
}

export const getNotifications = ({ commit, state }, params = {}) => {
  return new Promise((resolve, reject) => {
    getAxiosClient(state).get('/notifications', { params: params }).then(response => {
      commit(types.SET_REQUEST_LIMIT, response.headers['x-ratelimit-remaining'])
      commit(types.SET_LAST_READ_AT, response.data[0] ? response.data[0].updated_at : Date.now())
      resolve(response.data)
    }, err => {
      // TODO add error notification
      console.log(err)
      reject(err)
    })
  })
}

export const getNotificationsNext = ({ commit, state }, { page, params = {} }) => {
  return new Promise((resolve, reject) => {
    getAxiosClient(state).get('/notifications?page=' + page, { params: params }).then(response => {
      commit(types.SET_REQUEST_LIMIT, response.headers['x-ratelimit-remaining'])
      resolve(response.data)
    }, err => {
      // TODO add error notification
      console.log(err)
      reject(err)
    })
  })
}

export const markNotification = ({ commit, state }, id = '') => {
  return new Promise((resolve, reject) => {
    getAxiosClient(state).patch(`/notifications/threads/${id}`).then(response => {
      commit(types.SET_REQUEST_LIMIT, response.headers['x-ratelimit-remaining'])
      resolve(response)
    }, err => {
      // TODO add error notification
      console.log(err)
      reject(err)
    })
  })
}

export const markAllNotification = ({ commit, state }) => {
  return new Promise((resolve, reject) => {
    const data = {
      'last_read_at': state.session.last_read_at
    }
    getAxiosClient(state).put('/notifications', data).then(response => {
      commit(types.SET_REQUEST_LIMIT, response.headers['x-ratelimit-remaining'])
      resolve(response)
    }, err => {
      // TODO add error notification
      console.log(err)
      reject(err)
    })
  })
}

// TODO unfinished feature
export const getSubscriptions = ({ commit, state }) => {
  return new Promise((resolve, reject) => {
    getAxiosClient(state).get('/user/subscriptions').then(response => {
      commit(types.SET_REQUEST_LIMIT, response.headers['x-ratelimit-remaining'])
      resolve(response.data)
    }, err => {
      // TODO add error notification
      console.log(err)
      reject(err)
    })
  })
}

export const initApp = ({ commit, state }) => {
  return new Promise(resolve => {
    if (!state.session.access_token) {
      return resolve()
    }

    getUser({ commit, state }).then(user => {
      commit(types.SET_USER, user)
      commit(types.AUTHENTICATED, user)
      resolve()
    }, err => {
      // TODO add error notification
      console.log('Error while getting user from github, user will have to login', err)
      resolve()
    }
    )
  })
}

export const setTheme = ({ commit }, theme = 'Dark') => {
  configStore.set('theme', theme)
  commit(types.SET_THEME, theme)
  enableTheme(theme)
}

export const setAutostart = ({ commit }, autostart = true) => {
  configStore.set('autostart', autostart)
  commit(types.SET_AUTOSTART, autostart)
  setAutoLaunch(autostart)
}

export const setSound = ({ commit }, sound = true) => {
  configStore.set('sound', sound)
  commit(types.SET_SOUND, sound)
  // TODO apply sound setings
}

export const setNotification = ({ commit }, notification = true) => {
  configStore.set('notification', notification)
  commit(types.SET_NOTIFICATION, notification)
}

export const setParticipating = ({ commit }, participating = false) => {
  configStore.set('participating', participating)
  commit(types.SET_PARTICIPATING, participating)
}

export const setPerPage = ({ commit }, perPage = 30) => {
  configStore.set('perPage', perPage)
  commit(types.SET_PERPAGE, perPage)
}
