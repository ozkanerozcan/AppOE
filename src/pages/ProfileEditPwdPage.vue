<template>
<q-card class="q-ma-lg">
          <q-card-section class="row justify-between">
            <div class="text-h6">Edit Password</div>
          </q-card-section>

          <q-separator inset />

          <q-card-section>
            <q-form
              @submit.prevent.stop="onSubmit"
              class="q-gutter-sm"
            >
            <q-input 
                bottom-slots 
                v-model="form.old_password" 
                label="Password" 
                dense
                placeholder="Please enter password." 
                :type="isPwd ? 'password' : 'text'"
                :rules="password1Rules"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                  <q-icon name="close" @click="old_password = ''" class="cursor-pointer" />
                </template>
              </q-input>

              <q-input 
                bottom-slots 
                v-model="form.new_password1" 
                label="Password" 
                dense
                placeholder="Please enter password." 
                :type="isPwd ? 'password' : 'text'"
                :rules="password1Rules"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                  <q-icon name="close" @click="form.new_password1 = ''" class="cursor-pointer" />
                </template>
              </q-input>

              <q-input 
                bottom-slots 
                v-model="form.new_password2" 
                label="Password" 
                dense
                placeholder="Please enter password." 
                :type="isPwd ? 'password' : 'text'"
                :rules="password2Rules"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                  <q-icon name="close" @click="form.new_password2 = ''" class="cursor-pointer" />
                </template>
              </q-input>

              <div>
                <q-btn :loading="loading" label="Edit" type="submit" color="primary" class="full-width">
                  <template v-slot:loading>
                    <q-spinner-hourglass class="on-left" />
                    Edit
                    <q-spinner-hourglass class="on-right" />
                  </template>
                </q-btn>
              </div>
            </q-form> 
          </q-card-section>
        </q-card>
</template>

<script setup>
import { ref } from 'vue'
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
  old_password: '',
  new_password1: '',
  new_password2: '',
})

const loading = ref(false)
const accept = ref(false)

const isPwd = ref(true)

const validatePasswordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;

const password1Rules = [
        val => (val && val.length > 0) || 'Please type something',
        val => (validatePasswordRegex.test(val)) || 'Check your password'
      ]
const password2Rules = [
        val => (val && val.length > 0) || 'Please type something',
        val => (form.value.password1 === form.value.password2) || 'The password does not match',
      ]

function onSubmit() {
  loading.value = true

  
  let formData = new FormData()
  formData.append('old_password', form.value.old_password)
  formData.append('new_password1', form.value.new_password1)
  formData.append('new_password2', form.value.new_password2)
    api.post('/api/editpassword/', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    })
    .then(response => {
      if (response.data.message === 'success') {
        $q.notify({
          type: 'positive',
          position: 'top',
          message: 'Edit successfull.'
        })
        router.push({ name: 'Profile', params: { id: userStore.user.id } })
      } else {
        $q.notify({
          type: 'negative',
          position: 'top',
          message: response.data.message
        })
      }
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
      loading.value = false
    })
}

</script>