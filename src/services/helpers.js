import { shell, clipboard, ipcRenderer } from 'electron'
import { Dialog } from 'quasar'
import moment from 'moment'
import Settings from '@/components/Settings.vue'
import Donations from '@/components/Donations.vue'
const { app } = require('electron').remote
import { errorNotifier } from '@/services/errorNotifier'
import { successNotifier } from '@/services/successNotifier'

/**
 * Function returns an array with removed duplicates by any field in the object
 * @param {Array} arr - Array of objects to work with.
 * @param {string} comp - Field to check.
 *
 * @return {Array} Array of objects with uremoved duplicates
 *
 * @example
 *
 *    var unique = getUnique([{'key':1}, {'key':2}, {'key':3}, {'key':3}, {'key':3}], 'key')
 *    unique = [{'key':1}, {'key':2}, {'key':3}]
 */
export function getUnique (arr, comp) {
  const unique = arr
    .map(e => e[comp])
    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)
    // eliminate the dead keys & store unique objects
    .filter(e => arr[e])
    .map(e => arr[e])
  return unique
}

/**
 * Sort array of object by key field
 *
 * @param {*} array
 * @param {*} key
 * @returns {Array} Sorted Array
 */
export function sortByKey (array, key) {
  return array.sort(function (a, b) {
    var x = a[key]
    var y = b[key]
    return x < y ? -1 : x > y ? 1 : 0
  })
}

export function openExternal (link, parameter = '') {
  shell.openExternal(link + parameter)
}

export function copyToClipboard (data) {
  try {
    clipboard.writeText(data)
  } catch (error) {
    errorNotifier(error, 'Copy to clipboard')
  } finally {
    successNotifier('Copied')
  }
}

export function getVersion () {
  return app.getVersion()
}

export function getTime () {
  return Math.floor(new Date().getTime() / 1000)
}

export function formatTime (timestamp) {
  return moment(timestamp).startOf('second').fromNow()
  // return moment(timestamp).format('MMM Do, h:mm a')
}

export function formatBytes (bytes, decimals) {
  if (bytes === 0) return '0 Bytes'
  var k = 1024,
    dm = decimals <= 0 ? 0 : decimals || 2,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const toggleSettings = (store) => {
  ipcRenderer.on('toggle-settings', () => {
    Dialog.create({
      component: Settings
      // parent: this,
    }).onOk(() => {
    }).onCancel(() => {
    }).onDismiss(() => {
    })
  })
}

export function openSettings () {
  ipcRenderer.send('open-settings')
}

export const toggleDonations = (store) => {
  ipcRenderer.on('toggle-donations', () => {
    Dialog.create({
      component: Donations
      // parent: this,
    }).onOk(() => {
    }).onCancel(() => {
    }).onDismiss(() => {
    })
  })
}

export function openDonations () {
  ipcRenderer.send('open-donations')
}

export function showWindow () {
  ipcRenderer.send('showWindow')
}

export function setBadge (notificationsLength) {
  ipcRenderer.send('set-badge', notificationsLength)
}

export function updateTrayIcon (notificationsLength = 0) {
  if (notificationsLength > 0) {
    ipcRenderer.send('update-icon', 'TrayActive')
  } else {
    ipcRenderer.send('update-icon')
  }
}

// export function setAutoLaunch (value) {
//   if (value) {
//     ipcRenderer.send('startup-enable')
//   } else {
//     ipcRenderer.send('startup-disable')
//   }
// }
