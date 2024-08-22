import { boot } from 'quasar/wrappers'
import { LocalStorage, Loading } from 'quasar'


export default boot(({ router, store }) => {
    router.beforeEach(async (to) => {
        Loading.show()
        let _user = LocalStorage.getItem('user')
        if (!_user && to.name !== 'Login' && to.name !== 'Register') {
            return { name: 'Login' }
        }
    })
    router.afterEach(() => {
        Loading.hide()
    })
})

