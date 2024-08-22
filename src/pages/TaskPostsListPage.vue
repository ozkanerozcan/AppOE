<template>
  <q-page class="column" :style-fn="styleFn">
      <q-input
        v-model="search"
        debounce="500"
        filled
        placeholder="Search"
        square
        clearable
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      

        <q-scroll-area class="col q-pa-md">


    <q-list 
      separator
    >
    <q-expansion-item
        expand-separator
        icon="check_box_outline_blank"
        :label="`Not Completed - [${searchedItems.filter(x => !x.status).length}]`"
        header-class="bg-red text-white"
        expand-icon-class="text-white"
        default-opened
      >
      <q-item 
        clickable 
        v-ripple
        v-for="item in searchedItems.filter(x => !x.status)"
        v-bind:key="item.id" 
        :to="{ name: 'TaskPost', params: { id: item.id }, query: { list: route.params.id }}"
      > 
        <q-item-section avatar>
          <q-checkbox v-model="item.status" :val="item.id" @click="editStatus(id=item.id)"/>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ item.title }}</q-item-label>
          <q-item-label caption>Tarih: {{ taskStore.getFormattedPost(item.id).updated_at}}</q-item-label>
          <q-item-label caption>
            <div class="ellipsis-3-lines">
              {{ item.body }}
            </div>
          </q-item-label>
        </q-item-section>
      </q-item>
      </q-expansion-item>
      <q-expansion-item
        expand-separator
        icon="check_box"
        :label="`Completed - [${searchedItems.filter(x => x.status).length}]`"
        header-class="bg-teal text-white"
        expand-icon-class="text-white"
      >
      <q-item 
        clickable 
        v-ripple
        v-for="item in searchedItems.filter(x => x.status)"
        v-bind:key="item.id" 
        :to="{ name: 'TaskPost', params: { id: item.id }, query: { list: route.params.id }}"
      > 
        <q-item-section avatar>
          <q-checkbox v-model="item.status" :val="item.id" @click="editStatus(id=item.id)"/>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ item.title }}</q-item-label>
          <q-item-label caption>Tarih: {{ taskStore.getFormattedPost(item.id).updated_at}}</q-item-label>
          <q-item-label caption>
            <div class="ellipsis-3-lines">
              {{ item.body }}
            </div>
          </q-item-label>
        </q-item-section>
      </q-item>
      </q-expansion-item>
    </q-list>
    
    

        </q-scroll-area>
    <q-input rounded standout="bg-teal text-white" v-model="title" @keyup.enter="submit" label="Add a post" class="q-pa-md" :loading="posting" clearable :readonly="posting">
      <template v-slot:prepend>
        <q-icon name="add_circle" />
      </template>
      <template v-slot:append>
        <q-btn round dense flat icon="send" @click="submit"/>
      </template>
    </q-input>
  </q-page>   
  
</template>

<script setup>
import { ref, computed  } from 'vue'
import { useTaskStore } from '../stores/task'
import { useRoute} from 'vue-router'

const taskStore = useTaskStore()
const route = useRoute()

const title = ref('')
const posting = ref(false)
const search = ref('')

const searchedItems = computed(() => {
  if (search.value === null) {
    return taskStore.posts.filter(x => x.list.id == route.params.id)
  } else {
    return taskStore.posts.filter(x => x.list.id == route.params.id && x.title.toLowerCase().includes(search.value.toLowerCase()))
  }
})

async function editStatus(id) {
  let foundIndex = taskStore.posts.findIndex(x => x.id == id);
  await taskStore.patchPost(id, {status:taskStore.posts[foundIndex].status})
}

async function submit() {
  await taskStore.postPost({title: title.value, list: route.params.id})
  title.value = null
}


function styleFn(offset) {
  return { 
    height: offset ? `calc(100vh - ${offset}px)` : '100vh',
  }
}
</script>