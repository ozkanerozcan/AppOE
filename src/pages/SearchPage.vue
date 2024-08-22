<template>
     <q-card class="q-ma-md">
    <q-form
      @submit.prevent.stop="onSubmit"
    >
    <q-input filled v-model="query"/>
      <q-btn :loading="loading" label="Search" type="submit" color="primary" class="full-width" square>
        <template v-slot:loading>
          <q-spinner-hourglass class="on-left" />
            SEARCH
          <q-spinner-hourglass class="on-right" />
        </template>
      </q-btn>
    </q-form> 
  </q-card>

    <q-card 
      class="q-ma-md"
      v-if="users.length"
    >
      <q-card-section>
        <q-chip
          v-for="user in users"
          v-bind:key="user.id"
        >
        <router-link :to="{ name: 'Profile', params: { id: user.id }}">
          <q-avatar>
          <img src="https://cdn.quasar.dev/img/boy-avatar.png">
        </q-avatar>
        {{user.name}}
        </router-link>
      </q-chip>
      </q-card-section>
  </q-card>

  <q-card 
    class="q-ma-md"
    v-for="post in posts"
    v-bind:key="post.id"
  >
    <FeedItem v-bind:post="post" />
</q-card>


  </template>
  
  <script setup>
  import { ref, onMounted, onUpdated } from 'vue'
  import { api } from 'src/boot/axios'
  import { useQuasar } from 'quasar'
  import { useRoute } from 'vue-router'
  import { useUserStore } from '../stores/user'
  import FeedItem from '../components/FeedItem.vue'

  const $q = useQuasar()
  const route = useRoute()
  const userStore = useUserStore()
  
  const query = ref('')
  const posts = ref([])
  const users = ref([])
  const loading = ref(false)
  
  async function onSubmit() {
    console.log(query.value)
    loading.value = true
      await api.post('/api/search/', {'query': query.value})
      .then(response => {
        users.value = response.data.users
        posts.value = response.data.posts
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