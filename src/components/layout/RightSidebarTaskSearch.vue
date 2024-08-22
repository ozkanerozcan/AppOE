<template>
  <div class="q-gutter-md q-pa-md">
    <q-input outlined v-model="taskStore.filter.search" label="Search" clearable/>
    <q-input outlined v-model="taskStore.filter.dateRangeFrom" label="Date From" clearable>
      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="taskStore.filter.dateRangeFrom"  mask="YYYY-MM-DD" today-btn>
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
    </q-input>
    <q-input outlined v-model="taskStore.filter.dateRangeTo" label="Date To" clearable>
      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="taskStore.filter.dateRangeTo"  mask="YYYY-MM-DD" today-btn>
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
    </q-input>
    <q-select
      outlined
      v-model="taskStore.filter.list"
      use-input
      input-debounce="0"
      label="Lists"
      :options="taskPostListOptions"
      @filter="filterFn"
      clearable
      multiple
      use-chips
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            No results
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <q-select
      outlined
      v-model="taskStore.filter.status"
      input-debounce="0"
      label="Status"
      :options="taskPostStatusOptions"
      map-options 
      multiple
      use-chips
      clearable
    >
    </q-select>
    <q-select
      outlined
      v-model="taskStore.filter.createdBy"
      use-input
      input-debounce="0"
      label="User"
      :options="userListOptions"
      @filter="filterUserFn"
      clearable
      multiple
      use-chips
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            No results
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <q-select
      outlined
      v-model="taskStore.filter.workedOn"
      input-debounce="0"
      label="Worked On"
      :options="taskPostWorkedOptions"
      map-options 
      multiple
      use-chips
      clearable
    >
    </q-select>
    <div>
      <q-btn outline color="primary" icon="search" label="Search" class="full-width" @click="submit"/>
    </div>
  </div>
</template>
  
<script setup>
  import { ref, onMounted, watchEffect } from 'vue'
  import { useGlobalStore } from '../../stores/global'
  import { useTaskStore } from '../../stores/task'
  import { useUserStore } from '../../stores/user'
  
  const globalStore = useGlobalStore()
  const taskStore = useTaskStore()
  const userStore = useUserStore()

  const taskPostListOptions = ref([])
  const taskPostList = ref([])
  const userListOptions = ref([])
  const userList = ref([])
  const taskPostStatusOptions = ref([
          {
            label: 'To Do',
            value: false
          },
          {
            label: 'Done',
            value: true
          },
        ])
  const taskPostWorkedOptions = ref([
          {
            label: 'Office',
            value: 0
          },
          {
            label: 'Manufacturer',
            value: 1
          },
          {
            label: 'Customer',
            value: 2
          },
          {
            label: 'Home',
            value: 3
          },
          
        ])


  
  watchEffect(() => {
    taskPostList.value = taskStore.lists ? taskStore.lists.map(v => ({ label: v.title, value: v.id })) : []
    userList.value = userStore.users ? userStore.users.map(v => ({ label: v.username, value: v.id })) : []
    taskPostListOptions.value = taskPostList.value
    userListOptions.value = userList.value
  })


function filterFn (val, update) {
  if (val === '') {
    update(() => {
      taskPostListOptions.value = taskPostList.value
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    taskPostListOptions.value = taskPostList.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  })
}

function filterUserFn (val, update) {
  if (val === '') {
    update(() => {
      userListOptions.value = userList.value
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    userListOptions.value = userList.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  })
}



watchEffect(() => {
  console.log('watch efect cmd')
  taskStore.filter.obj  = {
    search  : taskStore.filter.search ? taskStore.filter.search : null,
    dateRangeFrom : taskStore.filter.dateRangeFrom ? taskStore.filter.dateRangeFrom : null, 
    dateRangeTo : taskStore.filter.dateRangeTo ? taskStore.filter.dateRangeTo : null, 
    list : taskStore.filter.list ? taskStore.filter.list.map(item => item.label) : null,
    createdBy : taskStore.filter.createdBy ? taskStore.filter.createdBy.map(item => item.label) : null,
    status : taskStore.filter.status ? taskStore.filter.status.map(item => item.value) : null,
    workedOn : taskStore.filter.workedOn ? taskStore.filter.workedOn.map(item => item.value) : null
  }
})

async function submit(){
    taskStore.filter.cmdSearch = true
    globalStore.rightDrawerOpen = false
    console.log('taskStore.cmdSearch', taskStore.cmdSearch)
}


</script>