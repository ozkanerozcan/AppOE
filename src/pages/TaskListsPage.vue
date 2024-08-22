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
      

  <q-scroll-area class="col">

    <q-list 
      separator
    >
      <q-item 
        clickable 
        v-ripple
        v-for="item in searchedItems"
        v-bind:key="item.id" 
        :to="{ name: 'TaskList', params: { id: item.id }}"
      >
        <q-item-section>
          <q-item-label>{{ item.title }}</q-item-label>
          <q-item-label caption>
            <div v-if="item.group">
              Group: {{ item.group.title }}
            </div>
            <div class="ellipsis-3-lines">
              {{ item.body }}
            </div>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    
    
</q-scroll-area>
    <q-input rounded standout="bg-teal text-white" v-model="title" @keyup.enter="submit" label="Add a list" class="q-pa-md" :loading="posting" clearable :readonly="posting">
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
import { ref, onMounted, computed  } from 'vue'
import { useQuasar } from 'quasar'
import { useTaskStore } from '../stores/task'

const $q = useQuasar()
const taskStore = useTaskStore()

const title = ref('')
const posting = ref(false)
const search = ref('')

const searchedItems = computed(() => {
  if (search.value === null) {
    return taskStore.lists
  } else {
    return taskStore.lists.filter(item => item.title.toLowerCase().includes(search.value.toLowerCase()))
  }
})

async function submit() {
  let _list = {
    title: title.value,
  }
  await taskStore.postList(_list)
  title.value = null
}

async function refresh (done) {
  await taskStore.getLists()
  done()
}

function styleFn(offset) {
  return { 
    height: offset ? `calc(100vh - ${offset}px)` : '100vh',
  }
}

</script>