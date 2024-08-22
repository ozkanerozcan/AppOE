<template>
    <div class="q-pa-md" style="max-width: 350px">
      <q-list bordered separator>
        <q-item clickable v-ripple
            v-for="user in users"
            v-bind:key="user.id"
        >
        <q-item-section avatar>
          <q-avatar>
            <img :src="user.get_avatar">
          </q-avatar>
        </q-item-section>
        <q-item-section>{{ user.name }}</q-item-section>
        <q-btn push color="grey" icon="person" :to="{ name: 'Profile', params: { id: user.id } }" >Show</q-btn>
        </q-item>
      </q-list>
    </div>
  </template>
<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'

const trends = ref([])

const $q = useQuasar()
const route = useRoute()

function getTrends() {
    api.get(`/api/posts/trends/`)
    .then(response => {
        trends.value = response.data
    })
    .catch(error => {
      $q.notify({
          type: 'negative',
          position: 'top',
          message: 'Somethings went wrong. Please try again'
      })
      console.log('error', error)
    })
}

onMounted(() => {
    getTrends()
  })

</script>