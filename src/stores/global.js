import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useGlobalStore = defineStore("global", () =>{
    const leftDrawerOpen = ref(false)
    const rightDrawerOpen = ref(false)

    const toggleLeftDrawer = () =>{
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    const toggleRightDrawer = () =>{
      rightDrawerOpen.value = !rightDrawerOpen.value
    }



    return{
      leftDrawerOpen,
      rightDrawerOpen,
      toggleLeftDrawer,
      toggleRightDrawer,
    }
},{
    //persist: true
})