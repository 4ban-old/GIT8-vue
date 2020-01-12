import { Notify } from 'quasar'

class ErrorHandler extends Error {
  constructor (err, point) {
    Notify.setDefaults({
      position: 'top-right',
      textColor: 'white',
      timeout: 10000,
      color: 'negative',
      icon: 'report_problem',
      multiLine: true,
      html: true,
      actions: [
        {
          label: 'Got it',
          color: 'black',
          handler: () => {
            /* console.log('wooow') */
          }
        }
      ]
    })
    const error = super(err)
    error.point = point
    return error
  }
}

export const errorNotifier = (err, point) => {
  const error = new ErrorHandler(err, point)
  Notify.create({ message: error.point + '<br>' + error.message })
}
