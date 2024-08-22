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
      <q-item 
        clickable 
        v-ripple
        v-for="group in searchedItems"
        v-bind:key="group.id" 
        :to="{ name: 'TaskGroup', params: { id: group.id }}"
      >
        <q-item-section>
          <q-item-label>{{ group.title }}</q-item-label>
          <q-item-label caption>
            <div class="ellipsis-3-lines">
              {{ group.body }}
            </div>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    
    
        </q-scroll-area>
    <q-input rounded standout="bg-teal text-white" v-model="title" @keyup.enter="submit" label="Add a group" class="q-pa-md" :loading="posting" clearable :readonly="posting">
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
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'
import { useTaskStore } from '../stores/task'

const $q = useQuasar()
const taskStore = useTaskStore()

const title = ref('')
const posting = ref(false)
const search = ref('')

const searchedItems = computed(() => {
  if (search.value === null) {
    return taskStore.groups
  } else {
    return taskStore.groups.filter(group => group.title.toLowerCase().includes(search.value.toLowerCase()))
  }
})

async function submit() {
  let _group = {
    title: title.value,
  }
  await taskStore.postGroup(_group)
  title.value = null
}

function styleFn(offset) {
  return { 
    height: offset ? `calc(100vh - ${offset}px)` : '100vh',
  }
}
</script>