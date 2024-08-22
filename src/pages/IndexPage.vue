<template>
  <q-card class="q-ma-md">
    <q-form
      @submit.prevent.stop="onSubmit"
    >
      <q-editor v-model="body" min-height="5rem" square></q-editor>
      <q-btn :loading="loading" label="Post" type="submit" color="primary" class="full-width" square>
        <template v-slot:loading>
          <q-spinner-hourglass class="on-left" />
            POST
          <q-spinner-hourglass class="on-right" />
        </template>
      </q-btn>
    </q-form> 
  </q-card>

  <TrendsItem />
  <FriendSuggestItem />

  <q-card 
    class="q-ma-md"
    v-for="post in posts"
    v-bind:key="post.id"
  >
  <FeedItem v-bind:post="post" />
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'
import FeedItem from '../components/FeedItem.vue'
import TrendsItem from '../components/TrendsItem.vue'
import FriendSuggestItem from 'src/components/FriendSuggestItem.vue'

const $q = useQuasar()

const body = ref('')
const posts = ref([])
const loading = ref(false)

async function onSubmit() {
  loading.value = true
    await api.post('/api/posts/create/', {'body': body.value})
    .then(response => {
      posts.value.unshift(response.data)
      body.value = ''
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

function getFeed() {
  api.get('/api/posts/')
    .then(response => {
      posts.value = response.data
      console.log(posts.value)
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
  getFeed()
})


</script>