<template>
    <q-card 
        class="q-ma-md"
        v-if="post.id"
    >
        <FeedItem v-bind:post="post" />
    </q-card>

    <q-card flat bordered class="q-ma-md"
        v-for="comment in post.comments"
        v-bind:key="comment.id"
    >
        <CommentItem v-bind:comment="comment" />
    </q-card>

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

  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { api } from 'src/boot/axios'
  import { useQuasar } from 'quasar'
  import FeedItem from '../components/FeedItem.vue'
  import CommentItem from '../components/CommentItem.vue'
  import { useRoute } from 'vue-router'


  const route = useRoute()
  
  const $q = useQuasar()

  const post = ref({
    id: null,
    comments: []
  })
  const body = ref('')
  const loading = ref(false)
  
  async function onSubmit() {
    loading.value = true
      await api.post(`/api/posts/${route.params.id}/comment/`, {'body': body.value})
      .then(response => {
        post.value.comments.unshift(response.data)
        post.value.comments_count += 1
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
  
  function getPost() {
    api.get(`/api/posts/${route.params.id}`)
      .then(response => {
        post.value = response.data.post
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
    getPost()
  })
  
  
  </script>