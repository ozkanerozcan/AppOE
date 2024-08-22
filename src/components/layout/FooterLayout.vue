<template>
    <q-footer elevated>
        <q-tabs
            align="justify"
            mobile-arrows
            active-color="primary"
            class="bg-white text-grey shadow-2 q-pb-lg"
            switch-indicator
            dense
        >
            <q-route-tab 
                name="home" 
                icon="home" 
                label="Home" 
                :to="{ name: 'Home' }"
                no-caps
            />
            <q-route-tab  
                name="add" 
                icon="fa-solid fa-circle-plus" 
                class="text-indigo" 
            >
            </q-route-tab>
            <q-route-tab 
                name="task" 
                icon="task" 
                label="Task" 
                :to="{ name: 'Task' }"
                no-caps
                @click="openTask" 
            >
              <q-menu fit>
                <q-list bordered padding class="rounded-borders bg-white full-width">
                  <q-item :to="{ name: 'TaskDashboard' }" clickable v-ripple>
                    <q-item-section avatar top>
                      <q-avatar icon="fa-solid fa-chart-line" color="primary" text-color="white" />
                    </q-item-section>

                    <q-item-section>
                      <q-item-label lines="1">Dashboard</q-item-label>
                      <q-item-label caption>Visulaize task data.</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-icon name="fa-solid fa-chevron-right" />
                    </q-item-section>
                  </q-item>
                  
                  <q-item :to="{ name: 'TaskSearch' }" clickable v-ripple>
                    <q-item-section avatar top>
                      <q-avatar icon="fa-solid fa-magnifying-glass" color="red" text-color="white" />
                    </q-item-section>

                    <q-item-section>
                      <q-item-label lines="1">Search</q-item-label>
                      <q-item-label caption>Search task posts.</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                        <q-icon name="fa-solid fa-chevron-right" />
                    </q-item-section>
                  </q-item>

                  <q-item :to="{ name: 'TaskAdd' }" clickable v-ripple>
                    <q-item-section avatar top>
                      <q-avatar icon="fa-solid fa-plus" color="orange" text-color="white" />
                    </q-item-section>

                    <q-item-section>
                      <q-item-label lines="1">Add</q-item-label>
                      <q-item-label caption>Add new task.</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                        <q-icon name="fa-solid fa-chevron-right" />
                    </q-item-section>
                  </q-item>

                </q-list>
              </q-menu>
            </q-route-tab>
        </q-tabs>
    </q-footer>
    <q-dialog v-model="dialogTask" :position="position">
    <q-list bordered padding class="rounded-borders bg-white full-width">
      <q-item-label header>Tasks</q-item-label>

      <q-item :to="{ name: 'TaskPosts' }" clickable v-ripple>
        <q-item-section avatar top>
          <q-avatar icon="fa-solid fa-list-check" color="primary" text-color="white" />
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">Posts</q-item-label>
          <q-item-label caption>Manage your tasks.</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon name="fa-solid fa-chevron-right" />
        </q-item-section>
      </q-item>

      <q-item :to="{ name: 'TaskLists' }" clickable v-ripple>
        <q-item-section avatar top>
          <q-avatar icon="fa-solid fa-list" color="orange" text-color="white" />
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">Lists</q-item-label>
          <q-item-label caption>Manage list of tasks.</q-item-label>
        </q-item-section>

        <q-item-section side>
            <q-icon name="fa-solid fa-chevron-right" />
        </q-item-section>
      </q-item>

      <q-item :to="{ name: 'TaskGroups' }" clickable v-ripple>
        <q-item-section avatar top>
          <q-avatar icon="fa-solid fa-table-list" color="teal" text-color="white" />
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">Groups</q-item-label>
          <q-item-label caption>Manage group of lists.</q-item-label>
        </q-item-section>

        <q-item-section side>
            <q-icon name="fa-solid fa-chevron-right" />
        </q-item-section>
      </q-item>
    </q-list>
    </q-dialog>
</template>
  
<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
const $q = useQuasar()
const router = useRouter()

const dialogTask = ref(false)
const position = ref('bottom')

function openTask (e) {
    e.preventDefault() // we cancel the default navigation
    //dialogTask.value = true
}

  
</script>
  
<style lang="sass">

</style>
  
  