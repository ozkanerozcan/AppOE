<template>
<div class="q-pa-md" style="max-width: 350px">
    <q-toolbar class="bg-primary text-white shadow-2">
      <q-toolbar-title>Contacts</q-toolbar-title>
    </q-toolbar>

    <q-list bordered>
      <q-item v-for="conversation in conversations" :key="conversation.id" class="q-my-sm" clickable v-ripple @click="setActiveConversation(conversation.id)">
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
        </q-item-section>

        <template
          v-for="user in conversation.users"
          v-bind:key="user.id"
        >
            <q-item-section
              v-if="user.id !== userStore.user.id"
            >
              <q-item-label>
                {{ user.name }}
              </q-item-label>
              <q-item-label caption lines="1">
                {{ conversation.modified_at_formatted }}
              </q-item-label>
            </q-item-section>
        </template>
        <q-item-section side>
          <q-icon name="chat_bubble" color="green" />
        </q-item-section>
      </q-item>
    </q-list>
  </div>

    <div class="q-pa-md row justify-center">
      <div style="width: 100%; max-width: 400px">
        <q-chat-message
          label="Chat message label"
        />
        <div
        v-for="message in activeConversation.messages"
        v-bind:key="message.id"
        >

        <q-chat-message
          :name="message.created_by.name"
          avatar="https://cdn.quasar.dev/img/avatar3.jpg"
          :text="[message.body]"
          :stamp= message.created_at_formatted
          v-if="message.created_by.id === userStore.user.id"
        />

        <q-chat-message
          :name="message.created_by.name"
          avatar="https://cdn.quasar.dev/img/avatar3.jpg"
          :text="[message.body]"
          :stamp= message.created_at_formatted
          sent
          v-else
        />

        </div>


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
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted} from 'vue'
  import { api } from 'src/boot/axios'
  import { useUserStore } from '../stores/user'

  const userStore = useUserStore()

    const body = ref('')
    const loading = ref(false)
    const conversations = ref([])
    const activeConversation = ref({
      messages: []
    })

    async function onSubmit() {
        api.post(`/api/chat/${activeConversation.value.id}/send/`, {body: body.value})
    .then(response => {
        activeConversation.value.messages.push(response.data)
    })
    .catch(error => {
        console.log('error', error)
    })
  }

  function getConversations() {
    api.get('/api/chat/')
    .then(response => {
        conversations.value = response.data

        if (conversations.value.length) {
            activeConversation.value = conversations.value[0]
        }
    })
    .catch(error => {
        console.log('error', error)
    })
  }

  function getMessages() {
    api.get(`/api/chat/${activeConversation.value}/`)
    .then(response => {
        activeConversation.value = response.data
        console.log('activeConversation', activeConversation.value)

        
    })
    .catch(error => {
        console.log('error', error)
    })
  }

  function setActiveConversation(id) {
        activeConversation.value = id
        getMessages()
  }

  onMounted(() => {
    getConversations()
})

  
  </script>