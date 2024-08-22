<template>

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
    <q-list >
      <template
        v-for="group in taskStore.groups"
        :key="group.id"
      >
        <q-expansion-item
          group="groups"
          icon="mdi-format-list-group"
          :label="group.title"
          :content-inset-level="0.2"
          v-if="searchedGroup.includes(group.id)"
        >
          <template
            v-for="list in searchedList"
            :key="list.id"
          >
            <template
              v-if="list.group "
            >           
              <q-item 
                v-if="list.group.id == group.id "
                clickable 
                v-ripple
                :to="{ name: 'TaskPostsList', params: { id: list.id }}"
              >
                <q-item-section avatar>
                  <q-icon name="mdi-format-list-bulleted-square" />
                </q-item-section>
                <q-item-section>{{ list.title }}</q-item-section>
                <q-item-section 
                 side
                 v-if="taskStore.getUncheckedPost(list.id) > 0"
                >
                  <q-badge color="red">
                    {{ taskStore.getUncheckedPost(list.id) }}
                  </q-badge>
                </q-item-section>
                <q-item-section 
                 side
                 v-if="taskStore.getCheckedPost(list.id) > 0"
                >
                  <q-badge color="teal">
                    {{ taskStore.getCheckedPost(list.id) }}
                  </q-badge>
                </q-item-section>
              </q-item>
            </template>
          </template>
        
      </q-expansion-item>
      <q-separator></q-separator>
    </template>
    <template
            v-for="list in searchedList"
            :key="list.id"
          >            
              <q-item 
                v-if="!list.group?.id"
                clickable 
                v-ripple
                :to="{ name: 'TaskPostsList', params: { id: list.id }}"
              >
                <q-item-section avatar>
                  <q-icon name="mdi-format-list-bulleted-square" />
                </q-item-section>
                <q-item-section>{{ list.title }}</q-item-section>
                <q-item-section 
                 side
                 v-if="taskStore.getUncheckedPost(list.id) > 0"
                >
                  <q-badge color="red">
                    {{ taskStore.getUncheckedPost(list.id) }}
                  </q-badge>
                </q-item-section>
                <q-item-section 
                 side
                 v-if="taskStore.getCheckedPost(list.id) > 0"
                >
                  <q-badge color="teal">
                    {{ taskStore.getCheckedPost(list.id) }}
                  </q-badge>
                </q-item-section>
              </q-item>
          </template>
    </q-list>
    <q-btn-group
      class="absolute-bottom"
      push
      spread
      square
    >
      <q-btn push class="q-pb-md q-pt-sm" size="lg" color="grey" icon="mdi-playlist-plus" :to="{ name: 'TaskLists' }"/>
      <q-btn push class="q-pb-md q-pt-sm" size="lg" color="grey" icon="mdi-format-list-group-plus" :to="{ name: 'TaskGroups' }"/>
    </q-btn-group>
</template>
  
<script setup>
  import { ref , computed} from 'vue'
  import { useGlobalStore } from '../../stores/global'
  import { useTaskStore } from '../../stores/task'
  
  const globalStore = useGlobalStore()
  const taskStore = useTaskStore()

  const addList = ref(false)
  const addGroup = ref(false)
  const search = ref('')

  const searchedList = computed(() => {
  if (search.value === null) {
    return taskStore.lists
  } else {
    return taskStore.lists.filter(item => item.title.toLowerCase().includes(search.value.toLowerCase()))
  }
})

const searchedGroup = computed(() => {
  let _group = []
  searchedList.value.forEach((item, index, arr) => {
    if (item.group) {
      _group.push(item.group.id)
    }
  })
  _group = [...new Set(_group)]
  return _group
})




</script>