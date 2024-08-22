<template>
  <q-page class="column" :style-fn="styleFn">
    <q-scroll-area class="col">
      <q-pull-to-refresh @refresh="refresh">
      <q-list 
        separator
      >
        <template
          v-for="(item, index) in taskStore.posts"
          v-bind:key="item.id" 
        >
          <template
              v-if="index < 1"
          >
            <q-toolbar 
              class="bg-primary text-white shadow-2"
            >
              <q-toolbar-title>{{new Date(item.created_at).toLocaleDateString('tr-TR')}} - {{ new Date(item.created_at).toLocaleDateString('tr-TR', { weekday: 'long' }) }}</q-toolbar-title>
            </q-toolbar>
          </template>
          <template
              v-else
          >
            <q-toolbar 
              class="bg-primary text-white shadow-2"
              v-if="new Date(item.created_at).toLocaleDateString() !== new Date(taskStore.posts[index-1]?.created_at).toLocaleDateString() "
            >
              <q-toolbar-title>{{new Date(item.created_at).toLocaleDateString('tr-TR')}} - {{ new Date(item.created_at).toLocaleDateString('tr-TR', { weekday: 'long' }) }}</q-toolbar-title>
            </q-toolbar>
          </template>
          <q-item 
            clickable 
            v-ripple
            :to="{ name: 'TaskPost', params: { id: item.id }, query: { list: route.params.id }}"
          > 
            <q-item-section avatar>
              <q-checkbox v-model="item.status" :val="item.id" disable/>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.title }}</q-item-label>
              <q-item-label caption>Proje: {{item.list.title}}</q-item-label>
              <q-item-label caption>
                <div class="ellipsis-3-lines">
                  {{ item.body }}
                </div>
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-pull-to-refresh>
    </q-scroll-area>
  
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


</script>