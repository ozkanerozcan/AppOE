<template>
    <div class="q-pa-md row justify-center" >
      <q-date
        v-model="date"
        mask="DD/MM/YYYY"
        today-btn
        class="full-width"
      />
    </div>


    <q-card class="q-ma-md">
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
                <q-item-label>Özkan ERÖZCAN</q-item-label>
                <q-item-label caption>
                    @ozkanerozcan
                </q-item-label>
            </q-item-section>
        </q-item>
          </div>

          <div class="col-auto">
            <q-btn color="grey-7" round flat icon="more_vert">
              <q-menu anchor="bottom left" self="top middle" cover auto-close>
                <q-list>
                  <q-item clickable>
                    <q-item-section>Details</q-item-section>
                  </q-item>
                  <q-item clickable>
                    <q-item-section>Delete</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>
      </q-card-section>
      <q-separator />

        <q-card-section class="q-pt-xs">
            <div class="text-h5 q-mt-sm q-mb-xs">Title</div>
            <div class="text-caption text-grey">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </div>
        </q-card-section>

        <q-separator />

        <q-card-actions class="q-pa-xs">
          <q-chip clickable @click="onClick" icon="bookmark">
      Chip 1
    </q-chip>
    <q-chip clickable @click="onClick" color="teal" text-color="white" icon="bookmark">
      Chip 2
    </q-chip>
    <q-chip clickable @click="onClick" color="red" text-color="white" icon="alarm" label="Chip 4" />
    <q-chip clickable @click="onClick" color="orange" text-color="white" icon="directions">
      Chip 3
    </q-chip>
        </q-card-actions>
    </q-card>
</template>





<script setup>
import { ref } from 'vue'
import { useGlobalStore } from '../stores/global'
import { api } from 'src/boot/axios'

const globalStore = useGlobalStore()

const date = ref('04/03/2024')


api.get('/blogs/posts/')
    .then(function (response) {
      console.log(response)

    })

</script>