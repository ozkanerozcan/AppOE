<template>

    <TrendsItem />
  
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
  import { useRoute } from 'vue-router'
  
  const $q = useQuasar()
  
  const posts = ref([])
  const route = useRoute()

  
  function getFeed() {
    api.get(`/api/posts/?trend=${route.params.id}`)
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