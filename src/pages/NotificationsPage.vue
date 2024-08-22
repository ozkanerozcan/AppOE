<template>
    <template
    v-if="notifications.length"
    >
    <q-card 
      class="q-ma-md"
      v-for="notification in notifications"
      v-bind:key="notification.id"
    >
    {{ notification.body }}
    <q-btn push color="grey" icon="person" @click="readNotification(notification)">Read More</q-btn>
  </q-card>
    </template>
  <div
  v-else
  >
 You dont have any messages.
  </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { api } from 'src/boot/axios'
  import { useQuasar } from 'quasar'
  import { useRoute} from 'vue-router'
  import { useUserStore } from '../stores/user'
  import { useRouter} from 'vue-router'

  const $q = useQuasar()
  const route = useRoute()
  const userStore = useUserStore()
  const router = useRouter()

  const notifications = ref([])
  

  
  function getNotifications() {
    api.get('/api/notifications/')
      .then(response => {
        notifications.value = response.data

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

  async function readNotification(notification) {
    
    await api.post(`/api/notifications/read/${notification.id}/`)
      .then(response => {
        notification.value = response.data

      })
      .catch(error => {
        $q.notify({
            type: 'negative',
            position: 'top',
            message: 'Somethings went wrong. Please try again'
        })
        console.log('error', error)
      })

    if (notification.type_of_notification == 'post_list' || notification.type_of_notification == 'post_comment') {
        router.push({ name: 'Post', params: { id: notification.post_id } })
    } else {
        router.push({ name: 'Friends', params: { id: notification.created_for_id } })
    }
  }
  
  onMounted(() => {
    getNotifications()
  })

  
  
  </script>