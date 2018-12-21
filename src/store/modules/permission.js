import { asyncRouterMap, constantRouterMap } from '@/router'
import request from '@/utils/request'
import { API_URL } from '@/utils/common.config.js'
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = routers.concat(constantRouterMap)
    },
    editmenuList(state, name) {
      state.parameter = state.menuList.filter(item => {
        return item.name === name
      })[0] || ''
    }
  },
  actions: {
    GenerateRoutes({ commit, rootState }, data) {
      return new Promise(resolve => {
        request(API_URL.get_menu, 'get', '').then(res => {
          let menuList = saveMenuInfo(res)
          rootState.menuList = menuList
          let routes = []
          menuList.forEach((item) => {
            if (item.name === 'indexGg') {
              routes.push({
                path: 'index',
                name: 'eastH5Index',
                meta: { title: `${item.pageType}`, icon: 'page', name: `${item.name}` },
                component: () => import('@/views/east-h5/index')
              })
            } else if (item.name === 'detailList') {
              routes.push({
                path: 'detailList',
                name: 'eastH5detailList',
                meta: { title: `${item.pageType}`, icon: 'page', name: `${item.name}` },
                component: () => import('@/views/east-h5/index')
              })
            } else if (item.name === 'videoList') {
              routes.push({
                path: 'videoList',
                name: 'eastH5videoList',
                meta: { title: `${item.pageType}`, icon: 'page', name: `${item.name}` },
                component: () => import('@/views/east-h5/index')
              })
            } else if (item.name === 'indexGGAddThree') {
              routes.push({
                path: 'indexGGAddThree',
                name: 'indexGGAddThree',
                meta: { title: `${item.pageType}`, icon: 'page', name: `${item.name}` },
                component: () => import('@/views/east-h5/index')
              })
            }
          })
          asyncRouterMap[0].children = routes
          commit('SET_ROUTERS', asyncRouterMap)
          resolve(res)
        })
      })
    }
  }
}
function saveMenuInfo(data) {
  let menuList = []
  const isObj = Object.prototype.toString.call(data) === '[object Object]'
  if (isObj) {
    for (let item in data) {
      let isArr = Object.prototype.toString.call(data[item]) === '[object Array]'
      if (isArr) {
        let list = data[item].some(item => {
          return item.name
        })
        if (list) {
          menuList.push(...data[item])
        }
      }
    }
  }
  return menuList
}
export default permission
