<template>
  <q-layout view="hHh LpR fFf">
    <q-page-container>

      <router-view :key="$route.path"></router-view>
  
    </q-page-container>

    <q-header bordered class="bg-white text-grey-7">
      <q-toolbar>
        <q-btn dense flat round icon="fa-solid fa-indent" @click="globalStore.toggleLeftDrawer" />

        <q-toolbar-title class="text-center">
          {{route.meta.title}}
        </q-toolbar-title>

        <q-btn dense flat round icon="fa-solid fa-outdent" @click="globalStore.toggleRightDrawer" :class="{ 'invisible': !Boolean(route.meta.sidebar) }"/>
      </q-toolbar>
    </q-header>

    <LeftSidebar></LeftSidebar>

    <q-drawer v-model="globalStore.rightDrawerOpen" side="right" bordered>
      <keep-alive>
        <component :is="currentSidebarComponent" />
      </keep-alive>
    </q-drawer>

    <Footer></Footer>
  </q-layout>
</template>

<script setup>
import { ref, onBeforeMount,  computed, defineAsyncComponent  } from 'vue'
import LeftSidebar from '../components/layout/LeftSidebar.vue'
import Footer from '../components/layout/FooterLayout.vue'
import { useGlobalStore } from '../stores/global'
import { useTaskStore } from '../stores/task'
import { useUserStore } from '../stores/user'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router';

const $q = useQuasar()
const route = useRoute()

const globalStore = useGlobalStore()
const taskStore = useTaskStore()
const userStore = useUserStore()
   
const currentSidebarComponent = computed(() => {
  const sidebar = route.meta.sidebar;
  console.log('sidebar',sidebar)
  console.log('sidebar boolean', Boolean(route.meta.sidebar))
  return sidebar ? defineAsyncComponent(() => import(`../components/layout/${sidebar}.vue`)) : defineAsyncComponent(() => import('../components/layout/RightSidebarHome.vue'))
})


onBeforeMount(async() => {
    $q.loading.show()
    await userStore.getUsers()
    console.log("users yüklendi")
    await taskStore.getPosts(false)
    console.log("posts yüklendi")
    await taskStore.getLists(false)
    console.log("lists yüklendi")
    await taskStore.getGroups(false)
    console.log("groups yüklendi")
    $q.loading.hide()
})
</script>