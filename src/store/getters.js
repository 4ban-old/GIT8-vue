export const isAuthenticated = state => {
  return !!state.session.access_token
}

export const username = state => {
  return state.session.user.login ? state.session.user.login : ''
}

export const avatarUrl = state => {
  return state.session.user.avatar_url
}

export const onAuthenticated = state => {
  return state.session.ready
}

export const notifications = state => {
  return state.session.notifications ? state.session.notifications : []
}

export const requestLimit = state => {
  return state.session.request_limit ? state.session.request_limit : 0
}

export const lastReadAt = state => {
  return state.session.last_read_at ? state.session.last_read_at : 0
}

export const preferences = state => {
  return state.preferences ? state.preferences : ''
}

export const subscriptions = state => {
  return state.session.subscriptions ? state.session.subscriptions : []
}
