const path = require('path')

module.exports = function (ctx) {
  return {
    boot: ['configManager', 'notifications', 'statistics', 'i18n', 'axios', 'helpers', 'errorNotifier', 'successNotifier'],
    css: ['app.sass'],
    extras: [
      'ionicons-v4',
      'fontawesome-v5',
      'roboto-font',
      'material-icons'
    ],
    framework: {
      iconSet: 'fontawesome-v5',
      all: false,

      components: [
        'QLayout',
        'QHeader',
        'QDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QList',
        'QItem',
        'QItemSection',
        'QItemLabel',
        'QBadge',
        'QImg',
        'QLinearProgress',
        'QSpinner',
        'QPageSticky',
        'QScrollArea',
        'QTooltip',
        'QSeparator',
        'QAvatar',
        'QDialog',
        'QCard',
        'QCardSection',
        'QCardActions',
        'QBar',
        'QSpace',
        'QToggle',
        'QBanner',
        'QPageScroller',
        'QInput'
      ],

      directives: ['Ripple', 'ClosePopup'],
      plugins: ['Notify', 'Dialog']
    },

    supportIE: false,
    build: {
      scopeHoisting: true,
      // vueRouterMode: 'history',
      // showProgress: false,
      // gzip: true,
      // analyze: true,
      // preloadChunks: false,
      // extractCSS: false,

      extendWebpack (cfg) {
        cfg.resolve.alias = {
          ...cfg.resolve.alias,
          '@': path.resolve(__dirname, './src')
        }
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: {
            formatter: require('eslint').CLIEngine.getFormatter('stylish')
          }
        })
      }
    },

    devServer: {
      // https: true,
      // port: 8080,
      open: true
    },

    animations: [],

    ssr: {
      pwa: false
    },

    pwa: {
      manifest: {
        name: 'GIT8',
        short_name: 'GIT8',
        description: 'GitHub notification tool',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            src: 'statics/icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    },

    cordova: {
    },

    capacitor: {
    },

    electron: {
      bundler: 'builder',
      builder: {
        productName: 'GIT8',
        appId: 'io.git8.git8',
        /* eslint-disable */
        artifactName: "${name}-${os}-${version}.${ext}",
        /* eslint-enable */
        // "directories": {
        //   "output": "build"
        // },
        // "files": [
        //   "dist/electron/**/*"
        // ],
        extraResources: ['resources/**'],
        dmg: {
          background: 'src-electron/icons/background.tiff',
          /* eslint-disable */
          title: "${productName}-${version}",
          /* eslint-enable */
          contents: [
            {
              x: 520,
              y: 225,
              type: 'link',
              path: '/Applications'
            },
            {
              x: 280,
              y: 230,
              type: 'file'
            }
          ]
        },
        mac: {
          target: ['zip', 'dmg'],
          extendInfo: {
            NSAppTransportSecurity: {
              NSAllowsArbitraryLoads: false
            },
            NSExceptionDomains: {
              localhost: {
                NSTemporaryExceptionAllowsInsecureHTTPSLoads: false,
                NSIncludesSubdomains: false,
                NSTemporaryExceptionAllowsInsecureHTTPLoads: true,
                NSTemporaryExceptionMinimumTLSVersion: '1.0',
                NSTemporaryExceptionRequiresForwardSecrecy: false
              }
            }
          }
        },
        win: {
          target: 'nsis',
          publisherName: 'GIT8, Inc'
        },
        linux: {
          category: 'Network',
          description: 'Git8',
          desktop: {
            Name: 'Git8',
            GenericName: 'git8',
            'X-GNOME-FullName': 'Git8',
            Comment: 'Git8',
            Type: 'Application',
            Terminal: 'false',
            StartupNotify: 'false',
            Categories: 'Network;'
          },
          target: ['deb', 'AppImage']
        },
        publish: [
          {
            owner: '4ban',
            provider: 'github',
            releaseType: 'draft',
            url: 'https://github.com/4ban/git8.git'
          }
        ]
      },

      nodeIntegration: true,

      extendWebpack (cfg) {
      }
    }
  }
}
