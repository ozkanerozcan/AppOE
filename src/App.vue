<template>
  <router-view />
</template>
<!--
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App'
})
</script>
-->

<script setup>
import { onBeforeMount } from 'vue'
import { useUserStore } from './stores/user'
import { useTaskStore } from './stores/task'
import { api } from 'src/boot/axios'

const userStore = useUserStore()
const taskStore = useTaskStore()

onBeforeMount(async () => {
  //userStore.initStore()
  await userStore.refreshToken()
  await userStore.getUsers()
  await userStore.getMe()
})


</script>