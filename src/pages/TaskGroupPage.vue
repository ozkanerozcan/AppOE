<template>
  <q-page class="column" :style-fn="styleFn">
        <q-scroll-area class="col q-pa-md">

      <div class="q-gutter-md">
        <q-input outlined v-model="taskGroup.title" label="Title" clearable/>
        <q-input outlined v-model="taskGroup.body" label="Body" autogrow clearable/>
        <q-input outlined v-model="taskGroup.created_by" label="Created by" readonly/>
        <q-input outlined v-model="taskGroup.created_at" label="Created at" readonly/>
        <q-input outlined v-model="taskGroup.updated_at" label="Updated at" readonly/>
      </div>
        </q-scroll-area>
        
  <div class="q-pa-md q-gutter-sm">
    <q-btn outline color="primary" icon="arrow_back_ios" label="Back To Groups" class="full-width" @click="goBack"/>
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

const taskGroup = ref({
  title: '',
  body: '',
  created_at: '',
  updated_at: '',
  created_by: {name: ''},
})
const deleteConfirm = ref(false)
const editConfirm = ref(false)

function goBack() {
  router.push({ name: 'TaskGroups'})
}

onBeforeMount(() => {
  taskGroup.value = taskStore.getFormattedGroup(route.params.id)
})

async function deleteItem() {
  await taskStore.deleteGroup(route.params.id)
}

async function editItem() {
  let _editedGroup = {
    title: taskGroup.value.title, 
    body: taskGroup.value.body, 
  }
  await taskStore.patchGroup(route.params.id, _editedGroup)
}

function styleFn(offset) {
  return { 
    height: offset ? `calc(100vh - ${offset}px)` : '100vh',
  }
}
</script>