import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout.vue'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/east-H5',
    name: 'Dashboard',
    meta: { title: '仪表板', icon: 'dashboard' },
    hidden: true,
    children: [{
      path: 'dashboard',
      meta: { title: 'Dashboard', icon: 'dashboard' },
      component: () => import('@/views/dashboard/index')
    }]
  },
  {
    path: '/example',
    component: Layout,
    redirect: '/example/qid',
    name: 'Example',
    meta: { title: 'Example', icon: 'example' },
    alwaysShow: false,
    children: [
      {
        path: 'qid',
        name: 'Qidlist',
        component: () => import('@/views/table/index'),
        meta: { title: '渠道管理', icon: 'table', name: 'Qidlist' }
      }
    ]
  },
  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        meta: { title: 'menu2' }
      }
    ]
  },
  {
    path: 'external-link',
    component: Layout,
    name: 'externalLink',
    meta: { title: '东方网址', icon: 'example' },
    children: [
      {
        path: 'https://sports.eastday.com/',
        meta: { title: '东方体育PC', icon: 'link' }
      },
      {
        path: 'https://msports.eastday.com/',
        meta: { title: '东方体育H5', icon: 'link' }
      },
      {
        path: 'https://sports.mop.com/',
        meta: { title: '猫扑体育PC', icon: 'link' }
      },
      {
        path: 'https://msports.mop.com/',
        meta: { title: '猫扑体育H5', icon: 'link' }
      },
      {
        path: 'http://gzh.suixingou.cn',
        meta: { title: '随心购H5', icon: 'link' }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/east-H5',
    component: Layout,
    redirect: '/east-H5/index',
    name: 'EastH5',
    meta: { title: '东方体育H5', icon: 'project' },
    children: []
  },
  { path: '*', redirect: '/404', hidden: true }
]
