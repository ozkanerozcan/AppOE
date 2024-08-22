import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { LocalStorage, Loading, Notify } from 'quasar'
import { router } from 'src/router'
import { notifyError } from './helper'

export const useUserStore = defineStore({
    id: 'user',

    state: () => ({
        user: null,
        users: null,
        tokens: {access: null, refresh: null},
    }),

    actions: {
        async logout() {
            this.user = null
            LocalStorage.set('user', '')
        },
        async postLogout() {
            Loading.show()
            let _refreshToken = LocalStorage.getItem('user')?.tokens?.refresh
            await api.post('/logout/',{refresh: _refreshToken })
            .then(response => {
                this.logout()
            })
            .catch(error => {
              console.log('error', error)
            })
            .finally(() => {
                this.user = null
                LocalStorage.set('user', '')
                router.push({ name: 'Login'})
                Loading.hide()
            })
        },
        async login(obj) {
            Loading.show()
            await api.post('/login/', obj)
            .then(response => {
                this.user= response.data
                LocalStorage.set('user', this.user)
                api.defaults.headers.common["Authorization"] = "Bearer " + this.user.tokens.access
                router.push({ name: 'Home'})
            })
            .catch(error => {
                notifyError(error)
            })
            .finally(() => {
                Loading.hide()
            })
        },
        async register(obj){
            Loading.show()
            await api.post('/register/', obj)
            .then(response => {
                Notify.create({
                    type: 'positive',
                    position: 'top',
                    message: 'Registration successfull. Please verify email.'
                })
                router.push({ name: 'Login'})
            })
            .catch(error => {
                notifyError(error)
            })
            .finally(() => {
                Loading.hide()
            })
        },
        async getMe() {
            Loading.show()
            await api.get('/me/')
            .then((response) =>{
                this.user = response.data
            })
            .catch((error) => {
                console.log(error)

                this.logout()
            })
            .finally(() => {
                Loading.hide()
            })
        },
        async refreshToken() {
            let _refreshToken = LocalStorage.getItem('user')?.tokens?.refresh
            if (_refreshToken) {
                Loading.show()
                await api.post('/token/refresh/', {
                    refresh: _refreshToken
                })
                .then((response) =>{
                    this.user = {
                        ...LocalStorage.getItem('user'),
                        tokens:{
                            access: response.data.access,
                            refresh: response.data.refresh
                        }
                     }
                    api.defaults.headers.common["Authorization"] = "Bearer " + this.user.tokens.access
                    LocalStorage.set('user', this.user)

                })
                .catch((error) => {
                    console.log(error)
    
                    this.postLogout()
                })
                .finally(() => {
                    Loading.hide()
                })
            } else {
                this.logout()
            }
        },
        async getUsers() {
            console.log("get User Caliti")
            await api.get('/user/list/')
            .then((response) =>{
                this.users = response.data
                console.log(this.users)
            })
            .catch((error) => {
                console.log(error)

                this.logout()
            })
            .finally(() => {
            })
        },
    }
})