/*
import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { Notify } from 'quasar'
import { router } from 'src/router'
import { notifyError } from './helper'

export const useTaskStore = defineStore({
  id: 'task',

  state: () => ({
    groups: [],
    lists: [],
    posts: [],
    initialized : false,
    cmdSearch : false,
    filter: {
      cmdSearch : false,
      search  : '',
      dateRangeFrom : '', 
      dateRangeTo : '', 
      list : [],
      createdBy : [],
      status : []
    },
  }),

  actions: {
      initStore() {
        this.posts = []
        this.lists = []
        this.groups = []
      },
      getUncheckedPost(list_id) {
  
        let _posts = this.posts.filter(x => x.list.id == list_id && !x.status )
          return _posts.length
      },
      getCheckedPost(list_id) {
        let _posts = this.posts.filter(x => x.list.id == list_id && x.status )
          return _posts.length
      },
      getFormattedPost(post_id) {
        let _post = this.posts.find(x => x.id == post_id)
        return {
          ..._post, 
          created_by: _post.created_by.username, 
          created_at: new Date(_post.created_at).toLocaleString("tr-TR"), 
          updated_at: new Date(_post.updated_at).toLocaleString("tr-TR"),
          list: {label:_post.list?.title, value: _post.list?.id}
        }
      },
      getFormattedList(list_id) { 
        let _list = this.lists.find(x => x.id == list_id)
        return {
          ..._list, 
          created_by: _list.created_by.username, 
          created_at: new Date(_list.created_at).toLocaleString("tr-TR"), 
          updated_at: new Date(_list.updated_at).toLocaleString("tr-TR"),
          group: _list.group ? {label:_list.group?.title, value: _list.group?.id} : null
        }
      },
      getFormattedGroup(group_id) { 
        let _group = this.groups.find(x => x.id == group_id)
        return {
          ..._group, 
          created_by: _group.created_by.username, 
          created_at: new Date(_group.created_at).toLocaleString("tr-TR"), 
          updated_at: new Date(_group.updated_at).toLocaleString("tr-TR"),
        }
      },
      async getPost(id) { 
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
        })
      },
      async patchPost(id, obj) { 
        await api.patch(`/tasks/${id}/`, obj)
        .then(async response => {
            await this.getPost(response.data.id)
        
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
        });
      },
      async deletePost(id) { 
        await api.delete(`/tasks/${id}/`)
        .then(async response => {
          Notify.create({
            type: 'positive',
            position: 'top',
            message: 'Deleted successfully'
          })
          await this.getPosts()
        })
        .catch(error => {
          notifyError(error) 
        })
        .finally(() => {
        });
      },
      async getPosts() {
        await api.get('/tasks/')
        .then(response => {
          this.posts = response.data.results
        })
        .catch(error => {
          notifyError(error) 
        })
        .finally(() => {
        })
      },
      async postSearchPost(obj) { 
        let searchedPost
        await api.post('/tasks/search/', obj)
        .then(response => {
          searchedPost = response.data.results
        })
        .catch(error => {
          notifyError(error) 
        })
        .finally(() => {
        })
        return searchedPost
      },
      async postPost(obj) { 
        await  api.post('/tasks/', obj)
        .then(async response => {
          await this.getPosts()
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
        })
      },
      async getLists() { 
        await api.get('/tasks/lists/')
        .then(response => {
          this.lists = response.data.results
        })
        .catch(error => {
          notifyError(error) 
        })
        .finally(() => {
        })
      },
      async getList(id) { 
        await api.get(`/tasks/lists/${id}`)
        .then(async response => {
          // Check if lists contains an object with the same ID as list
          const existingIndex = this.lists.findIndex(obj => obj.id === response.data.id);

          if (existingIndex !== -1) {
            // Update the existing object
            this.lists[existingIndex] = response.data;
          } else {
            // Add list to lists
            await this.getLists()
          }
        })
        .catch(error => {
          notifyError(error) 
        })
        .finally(() => {
        })
      },
      async postList(obj) { 
        await  api.post('/tasks/lists/', obj)
        .then(async response => {
          await this.getLists()
        })
        .catch(error => {
          notifyError(error) 
        })
        .finally(() => {
        })
      },
      async deleteList(id) { 
        await api.delete(`/tasks/lists/${id}/`)
        .then(async response => {
          Notify.create({
            type: 'positive',
            position: 'top',
            message: 'Deleted successfully'
          })
          await this.getLists()
          await this.getPosts()
          router.push({ name: 'TaskLists' })
        })
        .catch(error => {
          notifyError(error) 
        })
        .finally(() => {
        });
      },
      async patchList(id, obj) {
        await api.patch(`/tasks/lists/${id}/`, obj)
        .then(async response => {
            await this.getList(response.data.id)
        
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
        });
      },
      async getGroups() { 
        await api.get('/tasks/groups/')
        .then(response => {
          this.groups = response.data.results
        })
        .catch(error => {
          notifyError(error) 
        })
        .finally(() => {
        })
      },
      async getGroup(id) { 
        await api.get(`/tasks/groups/${id}`)
        .then(async response => {
          // Check if lists contains an object with the same ID as list
          const existingIndex = this.lists.findIndex(obj => obj.id === response.data.id);

          if (existingIndex !== -1) {
            // Update the existing object
            this.lists[existingIndex] = response.data;
          } else {
            // Add list to lists
            await this.getGroups()
          }
        })
        .catch(error => {
          notifyError(error) 
        })
        .finally(() => {
        })
      },
      async postGroup(obj) { 
        await  api.post('/tasks/groups/', obj)
        .then(async response => {
          await this.getGroups()
        })
        .catch(error => {
          notifyError(error) 
        })
        .finally(() => {
        })
      },
      async deleteGroup(id) { 
        await api.delete(`/tasks/groups/${id}/`)
        .then(async response => {
          Notify.create({
            type: 'positive',
            position: 'top',
            message: 'Deleted successfully'
          })
          await this.getGroups()
          await this.getLists()
          router.push({ name: 'TaskGroups' })
        })
        .catch(error => {
          notifyError(error) 
        })
        .finally(() => {
        });
      },
      async patchGroup(id, obj) {
        await api.patch(`/tasks/groups/${id}/`, obj)
        .then(async response => {
            await this.getGroup(response.data.id)
        
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
        });
      },
      async deletePostImage(id) { 
        await api.delete(`/tasks/attachments/${id}/`)
        .then(async response => {
          Notify.create({
            type: 'positive',
            position: 'top',
            message: 'Deleted successfully'
          })
          await this.getPosts()
        })
        .catch(error => {
          notifyError(error) 
        })
        .finally(() => {
        });
      },
      
      
  },
  persist: true,
})
*/