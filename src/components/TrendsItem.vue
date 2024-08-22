<template>
    <div class="q-pa-md" style="max-width: 350px">
      <q-list bordered separator>
        <q-item clickable v-ripple
            v-for="trend in trends"
            v-bind:key="trend.id"
        >
          <q-item-section>
            <router-link :to="{ name: 'Trend', params: { id: trend.hashtag }}">
              <q-item-label>{{trend.hashtag}}</q-item-label>
            </router-link>
            <q-item-label caption>{{trend.occurences}}</q-item-label>
          </q-item-section>
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