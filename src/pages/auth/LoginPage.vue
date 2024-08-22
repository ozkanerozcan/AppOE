<template>
  <q-layout view="lhr lpr lfr">

    <q-page-container>
      <q-page class="flex flex-center">
        <q-card class="auth-card q-ma-lg">
          <q-card-section class="row justify-between">
            <div class="text-h6">Login</div>
            <q-btn to="/register" label="Register"  color="teal" />
          </q-card-section>

          <q-separator inset />

          <q-card-section>
            <q-form
              @submit.prevent.stop="onSubmit"
              class="q-gutter-sm"
            >
            <q-input  
                v-model="form.email" 
                label="Email" 
                placeholder="Please enter email." 
                bottom-slots
                dense
              >
                <template v-slot:prepend>
                  <q-icon name="mail" />
                </template>
                <template v-slot:append>
                  <q-icon name="close" @click="form.email = '';" class="cursor-pointer" />
                </template>
              </q-input>

              <q-input  
                v-model="form.password" 
                label="Password" 
                placeholder="Please enter password." 
                :type="isPwd ? 'password' : 'text'"
                bottom-slots
                dense
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
                  <q-icon name="close" @click="form.password = '';" class="cursor-pointer" />
                </template>
              </q-input>

              <div>
                <q-btn label="Login" type="submit" color="primary" class="full-width">
                  <template v-slot:loading>
                    <q-spinner-hourglass class="on-left" />
                    Login
                    <q-spinner-hourglass class="on-right" />
                  </template>
                </q-btn>
              </div>
            </q-form> 
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../../stores/user'

const userStore = useUserStore()

const form = ref({
  email: '',
  password: '',
})

const isPwd = ref(true)

async function onSubmit() {
  await userStore.login(form.value)
}

</script>

<style lang="sass" scoped>
.auth-card
  width: 100%
  max-width: 500px
</style>