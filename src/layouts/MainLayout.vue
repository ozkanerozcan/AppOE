<template>
  <q-layout view="hHh LpR fFf" class="overflow-hidden-y">

    <q-header bordered class="bg-white text-grey-7">
      <q-toolbar>
        <q-btn dense flat round icon="fa-solid fa-indent" @click="globalStore.toggleLeftDrawer" />
        <q-toolbar-title class="text-center">
          {{route.meta.title}}
        </q-toolbar-title>
        <q-btn label="Subscribe to Notifications" @click="subscribeToNotifications" />
        <q-btn dense flat round icon="fa-solid fa-outdent" @click="globalStore.toggleRightDrawer" :class="{ 'invisible': !Boolean(route.meta.sidebar) }"/>
      </q-toolbar>
    </q-header>

    <LeftSidebar></LeftSidebar>

    <RightSidebar></RightSidebar>



<q-page-container>
  <q-page class="column no-wrap" :style-fn="getPageStyle">
  <router-view :key="$route.path"></router-view>
</q-page>
</q-page-container>



    <Footer></Footer>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import LeftSidebar from '../components/layout/LeftSidebar.vue'
import Footer from '../components/layout/FooterLayout.vue'
import { useGlobalStore } from '../stores/global'
import RightSidebar from 'src/components/layout/RightSidebarHome.vue'
import { useRoute } from 'vue-router';
import { api } from 'boot/axios'

const globalStore = useGlobalStore()

const route = useRoute()

function getPageStyle(offset, height) {
  return {
          height: `${ height - offset }px`
        }
}


async function subscribeToNotifications() {

const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      // Proceed with subscription logic

      // Register the service worker
      const registration = await navigator.serviceWorker.ready;

      // Subscribe the user to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BNBOultYHhk1w_R620xJRqy76tDdmqF9llrkuJW2XzvWD9d6UOxLQKo08xeh2y0tNDe4L5gnn8WkQZeymfigAYU'
      });

      // Send subscription details to your backend
      await api.post('/tasks/subscribe/', {
        subscription: subscription.toJSON()
      });
      console.log('User is subscribed:', subscription);



    } else {
      console.log('Permission not granted for notifications');
    }


  }
</script>