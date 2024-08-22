<template>
    <q-item>
      <q-item-section side>
        <q-avatar rounded size="48px">
          <img :src="user.get_avatar">
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{user.name}} - {{user.email}}</q-item-label>
        <router-link :to="{ name: 'Friends', params: { id: user.id }}">
          <q-item-label caption>{{user.friends_count}} friends</q-item-label>
        </router-link>
        <q-item-label caption>{{user.posts_count}} posts</q-item-label>
      </q-item-section>
      <q-item-section
        side
        v-if="userStore.user.id !== user.id && can_send_friendship_request"
      >
        <div class="q-gutter-xs">
          <q-btn color="grey-4" text-color="purple" glossy unelevated icon="person_add" label="Follow" @click="sendFriendshipRequest"/>
        <q-btn color="grey-4" text-color="purple" glossy unelevated icon="message" label="Message" @click="sendDirectMessage"/>
        </div>

      </q-item-section>
    </q-item>

    <q-card 
        class="q-ma-md"
        v-if="userStore.user.id === user.id"
    >
    <q-form
        @submit.prevent.stop="onSubmit"
      >
        <q-editor v-model="body" min-height="5rem" square></q-editor>
        <q-file v-model="model" label="Standard" />
        <q-checkbox v-model="is_private" label="Is Private" />
        <q-btn :loading="loading" label="Post" type="submit" color="primary" class="full-width" square>
          <template v-slot:loading>
            <q-spinner-hourglass class="on-left" />
              POST
            <q-spinner-hourglass class="on-right" />
          </template>
        </q-btn>
      </q-form> 
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
  import { useRoute, onBeforeRouteUpdate} from 'vue-router'
  import { useUserStore } from '../stores/user'
  import FeedItem from '../components/FeedItem.vue'
  import FeedForm from '../components/FeedForm.vue'
  import { useRouter} from 'vue-router'

  const $q = useQuasar()
  const route = useRoute()
  const userStore = useUserStore()
  const router = useRouter()
  
  const body = ref('')
  const posts = ref([])
  const user = ref([])
  const loading = ref(false)
  const model = ref(null)
  const is_private = ref(false)

  const can_send_friendship_request = ref(null)
  
  async function onSubmit() {
    loading.value = true
    let formData = new FormData()
    formData.append('image', model.value)
    formData.append('body', body.value)
    formData.append('is_private', is_private.value)
      await api.post('/api/posts/create/', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })
      .then(response => {
        posts.value.unshift(response.data)
        body.value = ''
        model.value = null
        is_private.value = false
        user.value.posts_count += 1
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

    async function sendDirectMessage() {
      await api.get(`/api/chat/${route.params.id}/get-or-create/`)
      .then(response => {
        router.push({ name: 'Chat' })
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

  function sendFriendshipRequest() {
    api.post(`/api/friends/${route.params.id}/request/`)
      .then(response => {
        console.log(response.data)
        if (response.data.message === 'request already sent') {
            $q.notify({
            type: 'positive',
            position: 'top',
            message: 'Request already sent'
        })
        } else {
            $q.notify({
            type: 'positive',
            position: 'top',
            message: 'Request was sent'
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
  }
  
  function getFeed() {
    api.get(`/api/posts/profile/${route.params.id}`)
      .then(response => {
        posts.value = response.data.posts
        user.value = response.data.user
        can_send_friendship_request.value = response.data.can_send_friendship_request
        console.log(user.value)

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

  onBeforeRouteUpdate((to, from) => {
    if (from.name === to.name) {
      getFeed()
    }
  })
  
  
  </script>