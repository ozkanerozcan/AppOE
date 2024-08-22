<template>
    <q-drawer v-model="globalStore.rightDrawerOpen" side="right" bordered>
      <q-input
        v-model="search"
        debounce="500"
        filled
        placeholder="Search"
        square
        clearable
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </q-drawer>
</template>
  
<script setup>
  import { ref } from 'vue'
  import { useGlobalStore } from '../../stores/global'
  
  const globalStore = useGlobalStore()

  const search = ref('')
</script>