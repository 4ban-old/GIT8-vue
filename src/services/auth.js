import { BrowserWindow, session, ipcRenderer } from 'electron'
import * as types from '../store/mutation-types'

const queryString = require('querystring')
const fetch = require('node-fetch')

export function githubOauth (oauthConfig, authWindowParams) {
  function getAuthorizationCode (opts) {
    opts = opts || {}
    if (!oauthConfig.redirectUri) {
      oauthConfig.redirectUri = 'urn:ietf:wg:oauth:2.0:oob'
    }

    var urlParams = {
      response_type: 'code',
      redirect_uri: oauthConfig.redirectUri,
      client_id: oauthConfig.clientId
    }

    if (opts.scope) {
      urlParams.scope = opts.scope
    }

    if (oauthConfig.scope) {
      urlParams.scope = oauthConfig.scope
    }

    if (opts.accessType) {
      urlParams.access_type = opts.accessType
    }

    var url = oauthConfig.authorizationUrl + '?' + queryString.stringify(urlParams)

    return new Promise(function (resolve, reject) {
      const authWindow = new BrowserWindow(
        authWindowParams || { 'use-content-size': true }
      )

      authWindow.loadURL(url)
      authWindow.show()

      authWindow.on('closed', () => {
        reject(new Error('window was closed by user'))
      })

      function onCallback (url) {
        var urlObject = new URL(url)
        var params = urlObject.searchParams
        var code = params.get('code')
        // TODO: get error. Difference between url.parse and new URL()
        var error = params.error

        if (error !== undefined) {
          reject(error)
          authWindow.removeAllListeners('closed')
          setImmediate(function () {
            authWindow.close()
          })
        } else if (code) {
          resolve(code)
          authWindow.removeAllListeners('closed')
          setImmediate(function () {
            authWindow.close()
          })
        }
      }

      authWindow.webContents.on('will-navigate', (event, url) => {
        onCallback(url)
      })

      // Deprecated event listener since Electron 4.0.0
      // authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
      //   console.log('did-get-redirect-request', newUrl)
      //   onCallback(newUrl)
      // })

      const filter = {
        urls: [oauthConfig.redirectUri + '*']
      }

      session.defaultSession.webRequest.onBeforeRequest(filter, (details) => {
        const url = details.url
        onCallback(url)
      })
    })
  }

  function tokenRequest (data) {
    const header = {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    if (oauthConfig.useBasicAuthorizationHeader) {
      header.Authorization = 'Basic ' + Buffer.from(oauthConfig.clientId + ':' + oauthConfig.clientSecret).toString('base64')
    } else {
      Object.assign(data, {
        client_id: oauthConfig.clientId,
        client_secret: oauthConfig.clientSecret
      })
    }

    return fetch(oauthConfig.tokenUrl, {
      method: 'POST',
      headers: header,
      body: queryString.stringify(data)
    }).then(res => {
      return res.json()
    })
  }

  function getAccessToken (opts) {
    return getAuthorizationCode(opts).then(authorizationCode => {
      var tokenRequestData = {
        code: authorizationCode,
        grant_type: 'authorization_code',
        redirect_uri: oauthConfig.redirectUri
      }
      tokenRequestData = Object.assign(
        tokenRequestData,
        opts.additionalTokenRequestData
      )
      return tokenRequest(tokenRequestData)
    })
  }

  function refreshToken (refreshToken) {
    // TODO: Unfinished function
    console.log('refresh token')
    return tokenRequest({
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
      redirect_uri: oauthConfig.redirectUri
    })
  }

  return {
    getAuthorizationCode,
    getAccessToken,
    refreshToken
  }
}

export const githubOauthSuccess = (store) => {
  ipcRenderer.on('auth-success', async (event, { access_token }) => {
    console.log('Access token: ', access_token)
    store.commit(types.SET_ACCESS_TOKEN, access_token)
    store.dispatch('getUser').then(user => {
      store.commit(types.AUTHENTICATED, user)
    })
  })
}
