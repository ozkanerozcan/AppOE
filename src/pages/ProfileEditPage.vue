<template>
  <q-card class="q-ma-lg">
    <q-card-section class="row justify-between">
      <div class="text-h6">Edit Personal Details</div>
    </q-card-section>

    <q-separator inset />

    <q-card-section>
      <div class="q-gutter-md">
        <q-input outlined v-model="form.first_name" label="First Name" clearable/>
        <q-input outlined v-model="form.last_name" label="Last Name" clearable/>
        <q-input outlined v-model="form.bio" label="Bio" autogrow clearable/>
        <div>
          <q-btn label="Save Changes" type="submit" color="primary" class="full-width" @click="onSubmitPersonalDetails"/>
        </div>
      </div>
    </q-card-section>
  </q-card>

  <q-card class="q-ma-lg">
    <q-card-section class="row justify-between">
      <div class="text-h6">Change Avatar</div>
    </q-card-section>

    <q-separator inset />

    <q-card-section>
      <div class="q-gutter-md">
        <q-file v-model="form.avatar" label="Avatar" accept=".jpg, image/*"/>

        <div>
          <q-btn label="Save Changes" type="submit" color="primary" class="full-width" @click="onSubmitChangeAvatar"/>
        </div>
      </div>
    </q-card-section>
  </q-card>

  <q-card class="q-ma-lg">
    <q-card-section class="row justify-between">
      <div class="text-h6">Change Password</div>
    </q-card-section>

    <q-separator inset />

    <q-card-section>
      <div class="q-gutter-md">
        <q-input  
          v-model="form.old_password" 
          label="Old Password" 
          placeholder="Please enter old password." 
          :type="isPwd1 ? 'password' : 'text'"
          bottom-slots
          dense
        >
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="isPwd1 ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd1 = !isPwd1"
            />
            <q-icon name="close" @click="form.old_password = '';" class="cursor-pointer" />
          </template>
        </q-input>
        <q-input  
          v-model="form.new_password" 
          label="New Password" 
          placeholder="Please enter password." 
          :type="isPwd2 ? 'password' : 'text'"
          bottom-slots
          dense
        >
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="isPwd2 ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd2 = !isPwd2"
            />
            <q-icon name="close" @click="form.new_password = '';" class="cursor-pointer" />
          </template>
        </q-input>
        <q-input  
          v-model="form.new_password_confirm" 
          label="Password" 
          placeholder="Please enter password." 
          :type="isPwd3 ? 'password' : 'text'"
          bottom-slots
          dense
        >
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="isPwd3 ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd3 = !isPwd3"
            />
            <q-icon name="close" @click="form.new_password_confirm = '';" class="cursor-pointer" />
          </template>
        </q-input>

        <div>
          <q-btn label="Save Changes" type="submit" color="primary" class="full-width" @click="onSubmitChangePassword"/>
        </div>
      </div>
    </q-card-section>
  </q-card>

  
</template>

<script setup>
import { ref , watchEffect} from 'vue'
import { useGlobalStore } from '../stores/global'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'
import { useRouter} from 'vue-router'
import { useUserStore } from 'src/stores/user'

const $q = useQuasar()
const router = useRouter()

const globalStore = useGlobalStore()
const userStore = useUserStore()

const form = ref({
  first_name: '',
  last_name: '',
  bio: '',
  avatar: null,
  old_password: '',
  new_password: '',
  new_password_confirm: ''
})

const isPwd1 = ref(true)
const isPwd2 = ref(true)
const isPwd3 = ref(true)

watchEffect(() => {
  if (userStore.user) {
    form.value.first_name = userStore.user.first_name
    form.value.last_name = userStore.user.last_name
    form.value.bio = userStore.user.bio
  }
})


function onSubmitPersonalDetails() {
  $q.loading.show()
  let obj = {
    first_name: form.value.first_name,
    last_name: form.value.last_name,
    bio: form.value.bio
  }
    api.patch('/user/edit/', obj)
    .then(async response => {
      $q.notify({
          type: 'positive',
          position: 'top',
          message: 'Personal details changed successfull.'
        })
        await userStore.getMe()
    })
    .catch(error => {
      $q.notify({
          type: 'negative',
          position: 'top',
          message: 'Somethings went wrong. Please try again'
      })
      console.log('error', error)
    })
    .finally(() => {
      $q.loading.hide()
    })
}

function onSubmitChangeAvatar() {
  $q.loading.show()
  let formData = new FormData()
  formData.append('avatar', form.value.avatar)
    api.patch('/user/change-avatar/', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    })
    .then(async response => {
      $q.notify({
          type: 'positive',
          position: 'top',
          message: 'Avatar changed successfull.'
        })
        await userStore.getMe()
    })
    .catch(error => {
      $q.notify({
          type: 'negative',
          position: 'top',
          message: 'Somethings went wrong. Please try again'
      })
      console.log('error', error)
    })
    .finally(() => {
      $q.loading.hide()
    })
}

function onSubmitChangePassword() {
  $q.loading.show()
  let obj = {
    old_password: form.value.old_password,
    new_password: form.value.new_password,
    new_password_confirm: form.value.new_password_confirm
  }
    api.post('/user/change-password/', obj)
    .then(async response => {
      $q.notify({
          type: 'positive',
          position: 'top',
          message: 'Password changed successfull.'
        })
        await userStore.postLogout()
    })
    .catch(error => {
      console.log('error', error)
      if (error.response.status == 400) {
        Object.entries(error.response.data).forEach(([key, value]) => {
          console.log("key:", key)
          console.log("value:", value)
              $q.notify({
                type: 'negative',
                position: 'top',
                message: key + ': ' + value
              })
        })
      } else if (error.response.status == 401 || error.response.status === 403) {
        $q.notify({
          type: 'negative',
          position: 'top',
          message: error.response.data.detail
        })
      } else {
        $q.notify({
          type: 'negative',
          position: 'top',
          message: 'Somethings went wrong. Please try again'
        })
        console.log('error', error)
      }
    })
    .finally(() => {
      $q.loading.hide()
    })
}



</script>