import { Notify } from 'quasar'

class SuccessHandler {
  constructor (message, stack) {
    Notify.setDefaults({
      position: 'top-right',
      textColor: 'white',
      timeout: 5000,
      color: 'positive',
      icon: 'fas fa-check-circle',
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
    const details = JSON.stringify(stack, null, 2)
    return { message, details }
  }
}

export const successNotifier = (message, stack) => {
  const result = new SuccessHandler(message, stack)
  Notify.create({ message: result.message })
}
