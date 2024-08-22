<template>
  <q-page class="column" :style-fn="styleFn">
    <p1>DASHBOARD</p1>
   
  </q-page>
</template>

<script setup>
import { ref, computed  } from 'vue'
import { useTaskStore } from '../stores/task'
import { useRoute} from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const taskStore = useTaskStore()
const route = useRoute()
const search = ref('')
const searchedPost = ref('')

/*
const searchedItems = computed(() => {
if (search.value === null) {
return taskStore.posts
} else {
return taskStore.posts.filter(x => x.title.toLowerCase().includes(search.value.toLowerCase()))
}
})
*/



function styleFn(offset) {
  return { 
    height: offset ? `calc(100vh - ${offset}px)` : '100vh',
  }
}

async function refresh (done) {
  search.value = null
  await taskStore.getPosts()
  await taskStore.getLists()
  await taskStore.getGroups()
  done()
}

async function submit() {
  $q.loading.show()
  searchedPost.value = await taskStore.getSearchPost(search.value)
  $q.loading.hide()
}

</script>