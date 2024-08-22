<template>
  <q-page class="column" :style-fn="styleFn">
  <q-scroll-area class="col q-pa-md">

      <div class="q-gutter-md">
        <q-input outlined v-model="taskList.title" label="Title" clearable/>
        <q-input outlined v-model="taskList.body" label="Body" autogrow clearable/>
        <q-select
          outlined
          v-model="taskList.group"
          use-input
          input-debounce="0"
          label="Groups"
          :options="taskListGroupOptions"
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
        <q-input outlined v-model="taskList.created_by" label="Created by" readonly/>
        <q-input outlined v-model="taskList.created_at" label="Created at" readonly/>
        <q-input outlined v-model="taskList.updated_at" label="Updated at" readonly/>
      </div>
</q-scroll-area>
        
  <div class="q-pa-md q-gutter-sm">
    <q-btn outline color="primary" icon="arrow_back_ios" label="Back To Lists" class="full-width" @click="goBack"/>
    <q-btn outline color="warning" icon="save" label="Save Changes" class="full-width" @click="editConfirm = true"/>
    <q-btn outline color="red" icon="delete" label="Delete" class="full-width" @click="deleteConfirm = true" />
  </div>

    <q-dialog v-model="deleteConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="negative" text-color="white" />
          <span class="q-ml-sm">Are you sure you want to delete it?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="primary" v-close-popup @click="deleteItem" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="editConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="edit" color="warning" text-color="white" />
          <span class="q-ml-sm">Are you sure you want to save changes?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Save" color="primary" v-close-popup @click="editItem" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onBeforeMount, computed  } from 'vue'
import { api } from 'src/boot/axios'
import { useQuasar, QSpinnerGears } from 'quasar'
import { useTaskStore } from '../stores/task'
import { useRoute, useRouter } from 'vue-router'

const $q = useQuasar()
const taskStore = useTaskStore()
const route = useRoute()
const router = useRouter()

const taskList = ref({
  title: '',
  body: '',
  group: '',
  created_at: '',
  updated_at: '',
  created_by: {name: ''},
})
const deleteConfirm = ref(false)
const editConfirm = ref(false)

//const taskListGroup = taskStore.groups.map(item => item.title)
const taskListGroup = taskStore.groups.map(v => ({ label: v.title, value: v.id }));
const taskListGroupOptions = ref(taskListGroup)

function goBack() {
  router.push({ name: 'TaskLists'})
}


onBeforeMount(() => {
  taskList.value = taskStore.getFormattedList(route.params.id)
})

function filterFn (val, update) {
        if (val === '') {
          update(() => {
            taskListGroupOptions.value = taskListGroup
          })
          return
        }

        update(() => {
          const needle = val.toLowerCase()
          taskListGroupOptions.value = taskListGroup.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
        })
      }


async function deleteItem() {
  await taskStore.deleteList(route.params.id)
}


async function editItem() {
  let _editedList = {
    title: taskList.value.title, 
    body: taskList.value.body, 
    group: taskList.value.group ? taskList.value.group.value : null
  }
  await taskStore.patchList(route.params.id, _editedList)
}

function styleFn(offset) {
  return { 
    height: offset ? `calc(100vh - ${offset}px)` : '100vh',
  }
}
</script>