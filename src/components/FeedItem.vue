<template>
    <q-card-section class="q-pa-xs">
      <div class="row items-center no-wrap">
        <div class="col">
          <q-item>
            <q-item-section avatar>
              <q-avatar>
                <img :src="post.created_by.get_avatar">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <router-link :to="{ name: 'Profile', params: { id: post.created_by.id }}">
                <q-item-label>{{post.created_by.name}}</q-item-label>
              </router-link>
              <q-item-label caption>
                {{post.created_at_formatted}} ago
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>

        <div class="col-auto">
          <q-btn color="grey-7" round flat icon="more_vert">
            <q-menu anchor="bottom left" self="top middle" cover auto-close>
              <q-list>
                <q-item 
                  clickable
                  :to="{ name: 'Post', params: { id: post.id }}"
                >
                  <q-item-section>Details</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section @click="deletePost(post.id)">Delete</q-item-section>
                </q-item>

                <q-item clickable>
                  <q-item-section @click="reportPost(post.id)">Report</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>
    </q-card-section>
    <q-separator />

    <q-card-section class="q-pt-xs">
      <template
        v-if="post.attachments.length"
      >
        <template
        v-for="image in post.attachments"
        v-bind:key="image.id"
        >
        <q-img
          :src="image.get_image"
          spinner-color="white"
          style="height: 140px; max-width: 150px"
        />
        </template>
      </template>
      <div class="text-h5 q-mt-sm q-mb-xs">{{post.body}}</div>
      <div class="text-caption text-grey">
        {{post.body}}
      </div>
    </q-card-section>
    <q-separator />
    <q-card-actions class="q-gutter-x-md">
      <q-btn flat round color="red" icon="favorite" :loading="loading" @click="likePost(post.id)"/> {{ post.likes_count }} likes
      <q-btn flat round color="teal" icon="bookmark" /> {{ post.comments_count }} comments
      <span
      v-if="post.is_private"
      >
      is Private
      </span>
      
    </q-card-actions>
</template>

<script setup>
import { ref } from 'vue'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const props = defineProps(['post'])

const post = ref(props.post)

const loading = ref(false)

function deletePost(id) {
  api.delete(`/api/posts/${id}/delete/`)
    .then(response => {
 
      
      $q.notify({
          type: 'positive',
          position: 'top',
          message: "post deleted"
      })
    })
    .catch(error => {
      $q.notify({
          type: 'negative',
          position: 'top',
          message: 'Somethings went wrong. Please try again'
      })
      console.log('error', error)
    })

}

function reportPost(id) {
  api.post(`/api/posts/${id}/report/`)
    .then(response => {
 
      
      $q.notify({
          type: 'positive',
          position: 'top',
          message: "post reported"
      })
    })
    .catch(error => {
      $q.notify({
          type: 'negative',
          position: 'top',
          message: 'Somethings went wrong. Please try again'
      })
      console.log('error', error)
    })

}


async function likePost(id) {
  loading.value = true
    await api.post(`/api/posts/${id}/like/`)
    .then(response => {
      if (response.data.message = 'like created') {
        post.value.likes_count += 1
      }
      
      $q.notify({
          type: 'positive',
          position: 'top',
          message: response.data.message
      })
    })
    .catch(error => {
      $q.notify({
          type: 'negative',
          position: 'top',
          message: 'Somethings went wrong. Please try again'
      })
      console.log('error', error)
    })
    .finally(() => {
      loading.value = false
    })
}

</script>