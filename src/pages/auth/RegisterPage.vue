<template>
  <q-layout view="lhr lpr lfr">

    <q-page-container>
      <q-page class="flex flex-center">
        <q-card class="auth-card q-ma-lg">
          <q-card-section class="row justify-between">
            <div class="text-h6">Register</div>
            <q-btn to="/login" label="Login"  color="teal" />
          </q-card-section>

          <q-separator inset />

          <q-card-section>
            <q-form
              @submit.prevent.stop="onSubmit"
              class="q-gutter-sm"
            >
              <q-input
                v-model="form.username"
                label="Username"
                placeholder="Please enter username." 
                hint="Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only."
                bottom-slots
                dense
                >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
                <template v-slot:append>
                  <q-icon name="close" @click="form.username = '';" class="cursor-pointer" />
                </template>
              </q-input>

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

              <q-toggle v-model="accept" label="I accept the license and terms" />

              <div>
                <q-btn label="Register" type="submit" color="primary" class="full-width">
                  <template v-slot:loading>
                    <q-spinner-hourglass class="on-left" />
                    Register
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
  username: '',
  email: '',
  password: '',
})

const accept = ref(false)
const isPwd = ref(true)


async function onSubmit() {
if (accept.value === true) {
  await userStore.register(form.value)
  } else {
    $q.notify({
      color: 'negative',
      position: 'top',
      message: 'You need to accept the license and terms first'
    })
  }
}

</script>

<style lang="sass" scoped>
.auth-card
  width: 100%
  max-width: 500px
</style>