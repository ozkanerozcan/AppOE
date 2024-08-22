<template>
  <q-page class="column" :style-fn="styleFn">
  <q-scroll-area class="col q-pa-md">
    <div class="q-gutter-md">
      <q-input outlined v-model="taskPost.title" label="Title" clearable/>
      <q-input outlined v-model="taskPost.body" label="Body" autogrow clearable/>
      <q-input outlined v-model="taskPost.created_at">
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="taskPost.created_at" mask="DD.MM.YYYY HH:mm" today-btn>
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
              <q-time v-model="taskPost.created_at" mask="DD.MM.YYYY HH:mm" format24h>
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
      <div>
      <q-uploader
        :url="`${apiURL}tasks/attachments/`"
        @uploaded="onUpload"
        field-name="file"
        label="Upload Image"
        accept="image/*"
        multiple
        :headers="[{name: 'Authorization', value: `Bearer ${userStore.user?.tokens?.access}`}]"
        :form-fields="[{name: 'post', value: route.params.id}]"
        style="width: 100%;"
      />
    </div>
      <q-input outlined v-model="taskPost.created_by" label="Created by" readonly/>
      <q-input outlined v-model="taskPost.created_at" label="Created at" readonly/>
      <q-input outlined v-model="taskPost.updated_at" label="Updated at" readonly/>
      <div class="q-pa-md">
        <div class="q-col-gutter-md row items-start">
          <template
            v-for="(item, index) in taskPost.attachments"
            v-bind:key="item.id" 
          >
            <div class="col-4">
              <q-img
                :src="item.file"
                spinner-color="white"
                fit="scale-down"
                ratio="1"
                @click="showImg(taskPost.attachments.map(obj => obj.file), index)"
              />
            </div>
          </template>
        </div>
      </div>
    </div>
  </q-scroll-area>  
  <div class="q-pa-md q-gutter-sm">
    <q-btn outline color="warning" icon="save" label="Save Changes" class="full-width" @click="editConfirm = true"/>
    <q-btn outline color="red" icon="delete" label="Delete" class="full-width" @click="deleteConfirm = true" />
  </div>

      <vue-easy-lightbox
        :visible="visibleRef"
        :imgs="imgsRef"
        :index="indexRef"
        @hide="onHide"
      >
        <template v-slot:toolbar="{ toolbarMethods }">
          <q-btn-group rounded class="footer">
            <q-btn color="primary" icon="fa-solid fa-magnifying-glass-plus"  @click="toolbarMethods.zoomIn"/>
            <q-btn color="primary" icon="fa-solid fa-magnifying-glass-minus" @click="toolbarMethods.zoomOut" />
            <q-btn color="primary" icon="fa-solid fa-rotate-left" @click="toolbarMethods.rotateLeft"/>
            <q-btn color="primary" icon="fa-solid fa-rotate-right" @click="toolbarMethods.rotateRight"/>
            <q-btn color="primary" icon="fa-solid fa-trash-can" @click="deleteImageConfirm=true; visibleRef=false; imageID=taskPost.attachments.find((attachment) => attachment.file == imgsRef[indexRef]).id;"/>
          </q-btn-group>
        </template>
      </vue-easy-lightbox>

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

    <q-dialog v-model="deleteImageConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="negative" text-color="white" />
          <span class="q-ml-sm">Are you sure you want to delete it?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="primary" v-close-popup @click="deleteImage" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style>
.footer {
  position: fixed;
  bottom: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>


<script setup>
import { ref, onBeforeMount, watchEffect  } from 'vue'
import { api } from 'src/boot/axios'
import { useQuasar, QSpinnerGears } from 'quasar'
import { useTaskStore } from '../stores/task'
import { useUserStore } from '../stores/user'
import { useRoute, useRouter } from 'vue-router'

const $q = useQuasar()
const taskStore = useTaskStore()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const taskPost = ref({
  title: '',
  body: '',
  list: '',
  created_at: '',
  updated_at: '',
  created_by: {username: ''},
  status: false,
  worked_on: 0
})
const deleteConfirm = ref(false)
const editConfirm = ref(false)
const deleteImageConfirm = ref(false)

const imageID = ref('')
const imageURL = ref('')

const attachments = ref(null)
const slide = ref(1)
const apiURL = ref(process.env.API_URL)

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

onBeforeMount(() => {
taskPost.value = taskStore.getFormattedPost(route.params.id)
})


async function onUpload() {
  console.log('upload success')
  await taskStore.getPosts()
  taskPost.value = taskStore.getFormattedPost(route.params.id)
}

async function deleteItem() {
  await taskStore.deletePost(route.params.id, route.query.list)
  router.back()
}

async function deleteImage() {
  await taskStore.deletePostImage(imageID.value)
  taskPost.value = taskStore.getFormattedPost(route.params.id)
}

async function editItem() {
  let formData = new FormData()
  if (attachments.value !== null) {
    attachments.value.forEach((element) => formData.append('attachments', element));
  }


  // Split the date and time
  const [datePart, timePart] = taskPost.value.created_at.split(' ');

  // Split the day, month, and year
  const [day, month, year] = datePart.split('.');

  // Split the hour and minute
  const [hour, minute] = timePart.split(':');

  let _editedPost = {
    title: taskPost.value.title,
    body: taskPost.value.body,
    deadline_at: new Date(year, (month-1), day, hour, minute).toISOString(),
    list: taskPost.value.list ? taskPost.value.list.value : null,
    status: taskPost.value.status.value,
    worked_on: taskPost.value.worked_on.value
  }


  await taskStore.patchPost(route.params.id, _editedPost)
}

    const visibleRef = ref(false)
    const indexRef = ref(0) // default 0
    const imgsRef = ref([])
    // Img Url , string or Array of string
    // ImgObj { src: '', title: '', alt: '' }
    // 'src' is required
    // allow mixing

    const onShow = () => {
      visibleRef.value = true
    }
    const showImg = (images, index) => {
      imgsRef.value = images
      // or
      // imgsRef.value  = {
      //   title: 'this is a placeholder',
      //   src: 'http://via.placeholder.com/350x150'
      // }
      indexRef.value = index // index of imgList
      onShow()
    }
    const onHide = () => (visibleRef.value = false)

    function styleFn(offset) {
  return { 
    height: offset ? `calc(100vh - ${offset}px)` : '100vh',
  }
}
</script>