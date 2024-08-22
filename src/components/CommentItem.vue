<template>
    <q-card-section class="q-pa-xs">
      <div class="row items-center no-wrap">
        <div class="col">
          <q-item>
            <q-item-section avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <router-link :to="{ name: 'Profile', params: { id: comment.created_by.id }}">
                <q-item-label>{{comment.created_by.name}}</q-item-label>
              </router-link>
              <q-item-label caption>
                {{comment.created_at_formatted}} ago
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </div>
    </q-card-section>
    <q-separator />

    <q-card-section class="q-pt-xs">
      <div v-html="comment.body" class="text-h5 q-mt-sm q-mb-xs"></div>
      <div class="text-caption text-grey">
        {{post.body}}
      </div>
    </q-card-section>
</template>

<script setup>
import { ref } from 'vue'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const props = defineProps(['comment'])

const post = ref(props.comment)

const loading = ref(false)


</script>