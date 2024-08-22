<template>
    <q-item>
      <q-item-section side>
        <q-avatar rounded size="48px">
          <img src="https://cdn.quasar.dev/img/avatar.png">
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{user.name}} - {{user.email}}</q-item-label>
        <q-item-label caption>{{user.friends_count}} friends</q-item-label>
      </q-item-section>

    </q-item>

    <q-card 
        class="q-ma-md"
        v-if="friendshipRequests.length"
    >
    <q-item
        v-for="friendshipRequest in friendshipRequests"
          v-bind:key="friendshipRequest.id"
    >
    <q-item-section side>
        <q-avatar rounded size="48px">
          <img src="https://cdn.quasar.dev/img/avatar.png">
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <router-link :to="{ name: 'Profile', params: { id: friendshipRequest.created_by.id }}">
            <q-item-label>{{friendshipRequest.created_by.name}} - {{friendshipRequest.created_by.email}}</q-item-label>
        </router-link>
        <router-link :to="{ name: 'Friends', params: { id: friendshipRequest.created_by.id }}">
            <q-item-label caption>{{user.friends_count}} friends</q-item-label>
        </router-link>
      </q-item-section>
      <q-item-section side>
        <div class="q-gutter-sm">
            <q-btn color="grey-4" text-color="green" glossy unelevated icon="check_circle" label="Accept" @click="handleRequest('accept', friendshipRequest.created_by.id)"/>
            <q-btn color="grey-4" text-color="red" glossy unelevated icon="cancel" label="Reject" @click="handleRequest('reject', friendshipRequest.created_by.id)"/>
        </div>
      </q-item-section>
    </q-item>
  </q-card>

    <q-card 
        class="q-ma-md"
        v-if="friends.length"
    >
    <q-item
      clickable
      v-ripple
      v-for="user in friends"
      v-bind:key="user.id"
      :to="{ name: 'Profile', params: { id: user.id }}"
    >
      <q-item-section side>
        <q-avatar rounded size="48px">
          <img src="https://cdn.quasar.dev/img/avatar.png">
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{user.name}} - {{user.email}}</q-item-label>
        <q-item-label caption>{{user.friends_count}} friends</q-item-label>
      </q-item-section>
      <q-item-section side>
          <q-icon name="chevron_right" />
      </q-item-section>
    </q-item>
  </q-card>
  </template>
  
  <script setup>
  import { ref, onMounted, onUpdated } from 'vue'
  import { api } from 'src/boot/axios'
  import { useQuasar } from 'quasar'
  import { useRoute, onBeforeRouteUpdate} from 'vue-router'
  import { useUserStore } from '../stores/user'
  import FeedItem from '../components/FeedItem.vue'

  const $q = useQuasar()
  const route = useRoute()
  const userStore = useUserStore()
  
  const user = ref({})
  const friendshipRequests = ref([])
  const friends = ref([])

  function handleRequest(status, pk) {
    api.post(`/api/friends/${pk}/${status}/`)
      .then(response => {
        console.log(response.data)
        
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

  
  function getFriends() {
    api.get(`/api/friends/${route.params.id}/`)
      .then(response => {
        console.log(response.data)
        friendshipRequests.value = response.data.requests
        friends.value = response.data.friends
        user.value = response.data.user

        console.log(friends.value)
        console.log(user.value.id)
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
    getFriends()
  })

  
  
  </script>