import store from '@/store'
import * as types from '@/store/mutation-types'

export function getSubscriptions () {
  // TODO autopagination
  store.dispatch('getSubscriptions').then(response => {
    // console.log('subs:', response)
    // console.log('subsl:', response.length)
    store.commit(types.UPDATE_SUBSCRIPTIONS, response)
  })
}
