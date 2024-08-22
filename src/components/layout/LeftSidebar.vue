<template>
    <q-drawer
      v-model="globalStore.leftDrawerOpen"
      side="left"
      overlay
      behavior="mobile"
      elevated
    >
      <q-scroll-area style="height: calc(100% - 190px); margin-top: 150px; border-right: 1px solid #ddd">
    <q-list bordered class="rounded-borders">
        <q-item 
          :to="{ name: 'Home' }" 
          clickable 
          v-ripple 
          active-class="text-primary text-weight-bold bg-blue-grey-2"
        >
          <q-item-section avatar top>
            <q-avatar icon="fa-solid fa-house" color="indigo" text-color="white" size="lg" rounded/>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">Home</q-item-label>
          </q-item-section>
        </q-item>

      <q-expansion-item v-model="expandedTask" :to="{ name: 'Task' }" group="leftMenu" active-class="text-primary text-weight-bold bg-blue-grey-2" @click="openTask">
        <template v-slot:header>
          <q-item-section avatar>
            <q-avatar icon="fa-solid fa-list-check" color="indigo" text-color="white" size="lg" rounded />
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">Task</q-item-label>
            <q-item-label caption>Manage tasks.</q-item-label>
          </q-item-section>
        </template>


        <q-item 
          :to="{ name: 'TaskDashboard' }" 
          clickable 
          v-ripple 
          active-class="text-primary text-weight-bold bg-grey-4"
        >
          <q-item-section avatar top>
            <q-avatar icon="fa-solid fa-chart-line" color="indigo" text-color="white" size="md"/>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">Dashboard</q-item-label>
            <q-item-label caption>Visulaize task data.</q-item-label>
          </q-item-section>
        </q-item>

        <q-item 
          :to="{ name: 'TaskSearch' }" 
          clickable 
          v-ripple 
          active-class="text-primary text-weight-bold bg-grey-4"
        >
          <q-item-section avatar top>
            <q-avatar icon="fa-solid fa-magnifying-glass" color="indigo" text-color="white" size="md"/>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">Search</q-item-label>
            <q-item-label caption>Search task posts.</q-item-label>
          </q-item-section>
        </q-item>

        <q-item 
          :to="{ name: 'TaskAdd' }" 
          clickable 
          v-ripple 
          active-class="text-primary text-weight-bold bg-grey-4"
        >
          <q-item-section avatar top>
            <q-avatar icon="fa-solid fa-plus" color="indigo" text-color="white" size="md"/>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">Add</q-item-label>
            <q-item-label caption>Add new task.</q-item-label>
          </q-item-section>
        </q-item>

        <q-item 
          :to="{ name: 'TaskLists' }" 
          clickable 
          v-ripple 
          active-class="text-primary text-weight-bold bg-grey-4"
        >
          <q-item-section avatar top>
            <q-avatar icon="fa-solid fa-rectangle-list" color="indigo" text-color="white" size="md"/>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">List</q-item-label>
            <q-item-label caption>Manage task lists.</q-item-label>
          </q-item-section>
        </q-item>

        <q-item 
          :to="{ name: 'TaskGroups' }" 
          clickable 
          v-ripple 
          active-class="text-primary text-weight-bold bg-grey-4"
        >
          <q-item-section avatar top>
            <q-avatar icon="fa-solid fa-layer-group" color="indigo" text-color="white" size="md"/>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">Group</q-item-label>
            <q-item-label caption>Manage task groups.</q-item-label>
          </q-item-section>
        </q-item>
        
      </q-expansion-item>
    </q-list>

      </q-scroll-area>
      <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img :src="userStore.user?.avatar">
          </q-avatar>
          <div class="text-weight-bold">{{userStore.user?.username}}</div>
          <div>{{ userStore.user?.first_name }} {{ userStore.user?.last_name }}</div>
          <div>{{userStore.user?.email}}</div>
        </div>
      </q-img>
      <q-btn-group
        class="absolute-bottom"
        push
        spread
        square
      >
        <q-btn push class="q-pb-md q-pt-sm" color="grey" icon="person" @click="goProfilePage" />
        <q-btn push class="q-pb-md q-pt-sm" color="grey" icon="settings" :to="{ name: 'ProfileEdit' }" />
        <q-btn push class="q-pb-md q-pt-sm" color="grey" icon="logout" @click="logout" />
      </q-btn-group>
    </q-drawer>
</template>
  
<script setup>
  import { ref } from 'vue'
  import { useGlobalStore } from '../../stores/global'
  import { useUserStore } from '../../stores/user'
  import { useRouter} from 'vue-router'
  import { api } from 'src/boot/axios'

  const globalStore = useGlobalStore()
  const userStore = useUserStore()
  const router = useRouter()

  const expandedTask = ref(false)
  function logout(){
    userStore.postLogout()
  }

  function goProfilePage(){
    router.push({ name: 'Profile', params: { id: userStore.user.id } })
  }

  function openTask (e) {
    expandedTask.value = !expandedTask.value
    e.preventDefault() // we cancel the default navigation
}
</script>