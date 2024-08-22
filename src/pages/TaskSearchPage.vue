<template>
  <q-page class="column" :style-fn="styleFn">
    <q-list 
      separator
      class="scroll"
    >
      <q-toolbar 
        class="bg-primary text-white shadow-2"
        v-if="count"
      >
        <q-toolbar-title>{{count}} adet içerik bulundu.</q-toolbar-title>
      </q-toolbar>
      <q-toolbar 
        class="bg-red text-white shadow-2"
        v-else
      >
        <q-toolbar-title>Sonuç bulunamadı.</q-toolbar-title>
      </q-toolbar>
      <q-infinite-scroll ref="infiniteScroll" @load="onLoad">
        <template
          v-for="item in searchedPost"
          v-bind:key="item.id" 
        >
          <q-item 
            clickable 
            v-ripple
            :to="{ name: 'TaskPost', params: { id: item.id }}"
          > 
            <q-item-section avatar>
              <q-checkbox v-model="item.status" :val="item.id" disable/>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.title }}</q-item-label>
              <q-item-label caption>
                Deadline: {{new Date(item.deadline_at).toLocaleString("tr-TR")}} 
                <q-badge color="red-6" text-color="white" v-if="(new Date(item.deadline_at) < Date.now()) && !item.status">
                  <q-icon
                    name="warning"
                    size="14px"
                    class="q-ml-xs"
                  />
                  OVERDUE
                </q-badge>
              </q-item-label>
              <q-item-label caption>Proje: {{item.list.title}}</q-item-label>
              <q-item-label caption>
                <div class="ellipsis-3-lines">
                  {{ item.body }}
                </div>
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>
      </q-infinite-scroll>
    </q-list>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect, watch } from 'vue'
import { useTaskStore } from '../stores/task'
import { useRoute} from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import axios from 'axios'

const $q = useQuasar()

const taskStore = useTaskStore()
const route = useRoute()
const search = ref('')
const searchedPost = ref(null)
const nextPage = ref('')
const prevPage = ref('')
const count = ref(0)
const limit = ref(20)

const infiniteScroll = ref()

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


/*
watchEffect(() => {
  console.log('watch efect cmd', taskStore.filter.cmd)
  taskStore.filter.cmd = false
})
  */

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
watch(
  () => taskStore.filter.cmdSearch,
  async  (newValue, oldValue) => {
    if (newValue) {
      $q.loading.show()
      console.log('watch calisti')
      count.value = 0
      searchedPost.value = null
      infiniteScroll.value.stop()
      await timeout(500);
      console.log("Stop delayed for 1 second.");
      infiniteScroll.value.reset()
      await timeout(500);
      console.log("Reset delayed for 1 second.");
      //infiniteScroll.value.trigger()
      //await timeout(500);
      //console.log("Trigger delayed for 1 second.");
      infiniteScroll.value.resume()
      await timeout(500);
      console.log("Resume delayed for 1 second.");
      taskStore.filter.cmdSearch = false
      console.log('taskStore.cmdSearch',taskStore.filter.cmdSearch)
    }
  }
)

async function onLoad (index, done) {
  const start =  (index - 1) * limit.value
  const query = `?limit=${limit.value}&offset=${start}`

  console.log("object", taskStore.filter.obj)
  await api.post(`/tasks/search${query}`, taskStore.filter.obj)
  .then(response => {
    console.log("response", response)
    //searchedPost.value.concat(response.data.results)
    nextPage.value = response.data.next
    count.value = response.data.count
    if(searchedPost.value) {
      searchedPost.value = [...searchedPost.value, ...response.data.results]
    }

    else {
      searchedPost.value = response.data.results
    }
  })
  .catch(error => {
    console.log(error)
  })
  .finally(() => {
    $q.loading.hide()
    if (nextPage.value){
      done()
    } else {
      infiniteScroll.value.stop()
    }
  })

  
}


</script>