
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('pages/HomePage.vue'), meta: { title: 'Home' }},
      { path: 'calendar', name: 'Calendar', component: () => import('pages/CalendarPage.vue')},
      { path: 'profile/:id', name: 'Profile', component: () => import('pages/ProfilePage.vue')},
      { path: 'profile/edit', name: 'ProfileEdit', component: () => import('pages/ProfileEditPage.vue')},
      { path: 'profile/edit/password', name: 'ProfileEditPassword', component: () => import('pages/ProfileEditPwdPage.vue')},
      { path: 'search', name: 'Search', component: () => import('pages/SearchPage.vue')},
      { path: 'profile/:id/friends', name: 'Friends', component: () => import('pages/FriendsPage.vue')},
      { path: '/:id', name: 'Post', component: () => import('pages/PostPage.vue')},
      { path: 'chat', name: 'Chat', component: () => import('pages/ChatPage.vue')},
      { path: 'trends/:id', name: 'Trend', component: () => import('pages/TrendPage.vue')},
      { path: 'notifications', name: 'Notifications', component: () => import('pages/NotificationsPage.vue')},

    ]
  },
  {
    path: '/task',
    component: () => import('layouts/TaskLayout.vue'),
    children: [
      { path: '', name: 'Task', component: () => import('pages/CalendarAddPage.vue')},
      { path: 'posts', name: 'TaskPosts', component: () => import('pages/TaskPostsPage.vue'), meta: { title: 'Posts' }},
      { path: 'posts/list/:id', name: 'TaskPostsList', component: () => import('pages/TaskPostsListPage.vue'), meta: { title: 'Posts of List' }},
      { path: 'post/:id', name: 'TaskPost', component: () => import('pages/TaskPostPage.vue'), meta: { title: 'Post Detail' }},
      { path: 'lists', name: 'TaskLists', component: () => import('pages/TaskListsPage.vue'), meta: { title: 'Lists' }},
      { path: 'list/:id', name: 'TaskList', component: () => import('pages/TaskListPage.vue'), meta: { title: 'List Detail' }},
      { path: 'groups', name: 'TaskGroups', component: () => import('pages/TaskGroupsPage.vue'), meta: { title: 'Groups' }},
      { path: 'group/:id', name: 'TaskGroup', component: () => import('pages/TaskGroupPage.vue'), meta: { title: 'Group Detail' }},
      { path: 'search', name: 'TaskSearch', component: () => import('pages/TaskSearchPage.vue'), meta: { title: 'Search', sidebar: 'RightSidebarTaskSearch' }},
      { path: 'dashboard', name: 'TaskDashboard', component: () => import('pages/TaskDashboardPage.vue'), meta: { title: 'Dashboard' }},
      { path: 'add', name: 'TaskAdd', component: () => import('pages/TaskAddPage.vue'), meta: { title: 'Add Post' }},
    ]
  },
  {
    path: '/login',
    name:'Login',
    component: () => import('pages/auth/LoginPage.vue'),
  },
  {
    path: '/register',
    name:'Register',
    component: () => import('pages/auth/RegisterPage.vue'),
  },

  {
    path: '/test',
    name:'Test',
    component: () => import('pages/testPage.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
