<template>
  <h1>Home Page</h1>


</template>

<script setup>
import { ref, onMounted, computed  } from 'vue'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'
import { useTaskStore } from '../stores/task'
import { useRoute, useRouter } from 'vue-router'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()



</script>