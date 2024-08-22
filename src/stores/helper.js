import { Notify } from 'quasar'


export function notifyError(error) {
  console.log(error)
    if (error.response.status == 400) {
        Object.entries(error.response.data).forEach(([key, value]) => {
          value.map(
            function(item) {
              Notify.create({
                type: 'negative',
                position: 'top',
                message: key[0].toUpperCase() + key.slice(1) + ': ' + item[0].toUpperCase() + item.slice(1)
              })
            }
          )
        })
      } else if (error.response.status == 401 || error.response.status === 403) {
        Notify.create({
          type: 'negative',
          position: 'top',
          message: error.response.data.detail
        })
      } else {
        Notify.create({
          type: 'negative',
          position: 'top',
          message: 'Somethings went wrong. Please try again'
        })
        console.log('error', error)
      }
}
