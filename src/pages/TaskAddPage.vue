<template>
  <q-page class="column" :style-fn="styleFn">
    <q-scroll-area class="col q-pa-md">
      <div class="q-gutter-md">
        <q-input outlined v-model="taskPost.title" label="Title" clearable/>
        <q-input outlined v-model="taskPost.body" label="Body" autogrow clearable/>
        <q-input outlined v-model="taskPost.deadline_at">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date ref="deadline" v-model="taskPost.deadline_at" mask="DD.MM.YYYY HH:mm" today-btn>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="taskPost.deadline_at" mask="DD.MM.YYYY HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-select
          outlined
          v-model="taskPost.list"
          use-input
          input-debounce="0"
          label="Lists"
          :options="taskPostListOptions"
          @filter="filterFn"
          behavior="menu"
          clearable
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
          v-model="taskPost.status"
          input-debounce="0"
          label="Status"
          :options="taskPostStatusOptions"
          behavior="menu"
          map-options 
        >
        </q-select>
        <q-select
          outlined
          v-model="taskPost.worked_on"
          input-debounce="0"
          label="Status"
          :options="taskPostWorkedOptions"
          behavior="menu"
          map-options 
        >
        </q-select>
      </div>
    </q-scroll-area>  
    <div class="q-pa-md q-gutter-sm">
      <q-btn outline color="primary" icon="save" label="Create" class="full-width" @click="submit"/>
    </div>
  </q-page>
</template>

<style>
.footer-lightbox {
  position: fixed;
  bottom: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>


<script setup>
import { ref, onMounted, watchEffect} from 'vue'
import { useQuasar } from 'quasar'
import { useTaskStore } from '../stores/task'
import { useUserStore } from '../stores/user'
import { useRoute, useRouter } from 'vue-router'

const $q = useQuasar()
const taskStore = useTaskStore()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

function getDate(){
  const now = new Date();

  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
  const year = now.getFullYear();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const formattedDateTime = `${day}.${month}.${year} ${hours}:${minutes}`;

  return formattedDateTime
}

const taskPost = ref({
  title: '',
  body: '',
  list: '',
  created_at: '',
  updated_at: '',
  deadline_at: getDate(),
  created_by: {username: ''},
  status: false,
  worked_on: 0
})



const taskPostListOptions = ref([])
const taskPostList = ref([])
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
    taskPostListOptions.value = taskPostList.value
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



async function submit() {
// Split the date and time
const [datePart, timePart] = taskPost.value.deadline_at.split(' ');

// Split the day, month, and year
const [day, month, year] = datePart.split('.');

// Split the hour and minute
const [hour, minute] = timePart.split(':');

let _post = {
  title: taskPost.value.title,
  body: taskPost.value.body,
  deadline_at: new Date(year, (month-1), day, hour, minute).toISOString(),
  list: taskPost.value.list ? taskPost.value.list.value : null,
  status: taskPost.value.status.value,
  worked_on: taskPost.value.worked_on.value
}
  $q.loading.show()
  await taskStore.postPost(_post)
  $q.loading.hide()
}


function styleFn(offset) {
  return { 
    height: offset ? `calc(100vh - ${offset}px)` : '100vh',
  }
}
</script>