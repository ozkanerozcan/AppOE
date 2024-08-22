import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from 'boot/axios'
import { Notify, Loading } from 'quasar'
import { router } from 'src/router'
import { notifyError } from './helper'

export const useTaskStore = defineStore('task', () => {
  const groups = ref([])
  const lists = ref([])
  const posts = ref([])
  const filter = ref({
    cmdSearch: false,
    search  : '',
    dateRangeFrom : '', 
    dateRangeTo : '', 
    list : [],
    createdBy : [],
    status : [],
    workedOn: [],
    obj: {}
  })

  function initStore() {
    posts.value= []
    lists.value = []
    groups.value = []
  }

  function getUncheckedPost(list_id) {

    let _posts = this.posts.filter(x => x.list.id == list_id && !x.status )
      return _posts.length
  }

  function getCheckedPost(list_id) {
    let _posts = this.posts.filter(x => x.list.id == list_id && x.status )
      return _posts.length
  }

  function getFormattedPost(post_id) {
    console.log("post_id", post_id)
    let _post = this.posts.find(x => x.id == post_id)
    console.log("_post", _post)
    return {
      ..._post, 
      created_by: _post.created_by.username, 
      created_at: new Date(_post.created_at).toLocaleString("tr-TR"), 
      updated_at: new Date(_post.updated_at).toLocaleString("tr-TR"),
      list: {label:_post.list?.title, value: _post.list?.id}
    }
  }
  function getFormattedList(list_id) { 
    let _list = lists.value.find(x => x.id == list_id)
    return {
      ..._list, 
      created_by: _list.created_by.username, 
      created_at: new Date(_list.created_at).toLocaleString("tr-TR"), 
      updated_at: new Date(_list.updated_at).toLocaleString("tr-TR"),
      group: _list.group ? {label:_list.group?.title, value: _list.group?.id} : null
    }
  }

  function getFormattedGroup(group_id) { 
    let _group = groups.value.find(x => x.id == group_id)
    return {
      ..._group, 
      created_by: _group.created_by.username, 
      created_at: new Date(_group.created_at).toLocaleString("tr-TR"), 
      updated_at: new Date(_group.updated_at).toLocaleString("tr-TR"),
    }
  }

  async function getPost(id, loading=true) { 
    loading && Loading.show()
    await api.get(`/tasks/${id}`)
    .then(async response => {
      // Check if posts contains an object with the same ID as post
      const existingIndex = this.posts.findIndex(obj => obj.id === response.data.id);

      if (existingIndex !== -1) {
        // Update the existing object
        this.posts[existingIndex] = response.data;
      } else {
        // Add post to posts
        await this.getPosts()
      }
    })
    .catch(error => {
      notifyError(error) 
    })
    .finally(() => {
      loading && Loading.hide()
    })
  }

  async function patchPost(id, obj, loading=true) { 
    loading && Loading.show()
    await api.patch(`/tasks/${id}/`, obj)
    .then(async response => {
        await this.getPost(response.data.id, false)
    
        Notify.create({
          type: 'positive',
          position: 'top',
          message: 'Saved changes successfully'
        })
    })
    .catch(error => {
      notifyError(error) 
    })
    .finally(() => {
      loading && Loading.hide()
    })
  }

  async function deletePost(id, loading=true) { 
    loading && Loading.show()
    await api.delete(`/tasks/${id}/`)
    .then(async response => {
      Notify.create({
        type: 'positive',
        position: 'top',
        message: 'Deleted successfully'
      })
      await this.getPosts(false)
    })
    .catch(error => {
      notifyError(error) 
    })
    .finally(() => {
      loading && Loading.hide()
    });
  }

  async function getPosts(loading=true) {
    loading && Loading.show()
    await api.get('/tasks/')
    .then(response => {
      posts.value= response.data.results
    })
    .catch(error => {
      notifyError(error) 
    })
    .finally(() => {
      loading && Loading.hide()
    })
  }
  async function postSearchPost(obj, loading=true) { 
    loading && Loading.show()
    let searchedPost
    await api.post('/tasks/search/', obj)
    .then(response => {
      searchedPost = response.data.results
    })
    .catch(error => {
      notifyError(error) 
    })
    .finally(() => {
      loading && Loading.hide()
    })
    return searchedPost
  }

  async function postPost(obj, loading=true) { 
    loading && Loading.show()
    await  api.post('/tasks/', obj)
    .then(async response => {
      await this.getPosts(false)
      Notify.create({
        type: 'positive',
        position: 'top',
        message: 'Created successfully'
      })
      router.push({ name: 'TaskPost', params: { id: response.data.id }})
    })
    .catch(error => {
      notifyError(error) 
    })
    .finally(() => {
      loading && Loading.hide()
    })
  }

  async function getLists(loading=true) { 
    loading && Loading.show()
    await api.get('/tasks/lists/')
    .then(response => {
      lists.value = response.data.results
    })
    .catch(error => {
      notifyError(error) 
    })
    .finally(() => {
      loading && Loading.hide()
    })
  }

  async function getList(id, loading=true) { 
    loading && Loading.show()
    await api.get(`/tasks/lists/${id}`)
    .then(async response => {
      // Check if lists contains an object with the same ID as list
      const existingIndex = lists.value.findIndex(obj => obj.id === response.data.id);

      if (existingIndex !== -1) {
        // Update the existing object
        lists.value[existingIndex] = response.data;
      } else {
        // Add list to lists
        await this.getLists(false)
      }
    })
    .catch(error => {
      notifyError(error) 
    })
    .finally(() => {
      loading && Loading.hide()
    })
  }

  async function postList(obj, loading=true) { 
    loading && Loading.show()
    await  api.post('/tasks/lists/', obj)
    .then(async response => {
      await this.getLists(false)
    })
    .catch(error => {
      notifyError(error) 
    })
    .finally(() => {
      loading && Loading.hide()
    })
  }

  async function deleteList(id, loading=true) {
    loading && Loading.show() 
    await api.delete(`/tasks/lists/${id}/`)
    .then(async response => {
      Notify.create({
        type: 'positive',
        position: 'top',
        message: 'Deleted successfully'
      })
      await this.getLists(false)
      await this.getPosts(false)
      router.push({ name: 'TaskLists' })
    })
    .catch(error => {
      notifyError(error) 
    })
    .finally(() => {
      loading && Loading.hide()
    });
  }

  async function patchList(id, obj, loading=true) {
    loading && Loading.show()
    await api.patch(`/tasks/lists/${id}/`, obj)
    .then(async response => {
        await this.getList(response.data.id, false)
    
        Notify.create({
          type: 'positive',
          position: 'top',
          message: 'Saved changes successfully'
        })
    })
    .catch(error => {
      notifyError(error) 
    })
    .finally(() => {
      loading && Loading.hide()
    });
  }
  async function getGroups(loading=true) { 
    loading && Loading.show()
    await api.get('/tasks/groups/')
    .then(response => {
      groups.value = response.data.results
    })
    .catch(error => {
      notifyError(error) 
    })
    .finally(() => {
      loading && Loading.hide()
    })
  }

  async function getGroup(id, loading=true) { 
    loading && Loading.show()
    await api.get(`/tasks/groups/${id}`)
    .then(async response => {
      // Check if lists contains an object with the same ID as list
      const existingIndex = lists.value.findIndex(obj => obj.id === response.data.id);

      if (existingIndex !== -1) {
        // Update the existing object
        lists.value[existingIndex] = response.data;
      } else {
        // Add list to lists
        await this.getGroups(false)
      }
    })
    .catch(error => {
      notifyError(error) 
    })
    .finally(() => {
      loading && Loading.hide()
    })
  }
  async function postGroup(obj, loading=true) { 
    loading && Loading.show()
    await  api.post('/tasks/groups/', obj)
    .then(async response => {
      await this.getGroups(false)
    })
    .catch(error => {
      notifyError(error) 
    })
    .finally(() => {
      loading && Loading.hide()
    })
  }

  async function deleteGroup(id, loading=true) { 
    loading && Loading.show()
    await api.delete(`/tasks/groups/${id}/`)
    .then(async response => {
      Notify.create({
        type: 'positive',
        position: 'top',
        message: 'Deleted successfully'
      })
      await this.getGroups(false)
      await this.getLists(false)
      router.push({ name: 'TaskGroups' })
    })
    .catch(error => {
      notifyError(error) 
    })
    .finally(() => {
      loading && Loading.hide()
    });
  }

  async function patchGroup(id, obj, loading=true) {
    loading && Loading.show()
    await api.patch(`/tasks/groups/${id}/`, obj)
    .then(async response => {
        await this.getGroup(response.data.id, false)
    
        Notify.create({
          type: 'positive',
          position: 'top',
          message: 'Saved changes successfully'
        })
    })
    .catch(error => {
      notifyError(error) 
    })
    .finally(() => {
      loading && Loading.hide()
    });
  }

  async function deletePostImage(id, loading=true) { 
    loading && Loading.show()
    await api.delete(`/tasks/attachments/${id}/`)
    .then(async response => {
      Notify.create({
        type: 'positive',
        position: 'top',
        message: 'Deleted successfully'
      })
      await this.getPosts(false)
    })
    .catch(error => {
      notifyError(error) 
    })
    .finally(() => {
      loading && Loading.hide()
    });
  }



  return { 
    groups,
    lists,
    posts,
    filter,
    //Functions
    initStore,
    getUncheckedPost,
    getCheckedPost,
    getFormattedPost,
    getFormattedList,
    getFormattedGroup,
    patchPost,
    deletePost,
    getPost,
    getPosts,
    postSearchPost,
    postPost,
    getLists, 
    getList,
    postList,
    deleteList,
    patchList,
    getGroups,
    getGroup,
    postGroup,
    deleteGroup,
    patchGroup,
    deletePostImage,

  }
}, {persist: true})