import Vue from 'vue' // import 'babel-polyfill'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import '@/assets/styles/index.scss' // global css
import App from './App'
import router from './router'
import store from './store'
import '@/assets/icons' // icon
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'
import user from './store/modules/user'
// Progress 进度条样式
// import {getToken} from '@/utils/auth' // 验权
// const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  //   NProgress.start()
  if (store.getters.addRouters.length) {
    next()
    if (to.meta.name === 'Qidlist') {
      store.commit('getActiveParameter', 'indexGg')
    } else {
      store.commit('getActiveParameter', to.meta.name)
    }
  } else {
    store.dispatch('GenerateRoutes', {}).then(() => {
      router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
      if (to.meta.name === 'Qidlist') {
        store.commit('getActiveParameter', 'indexGg')
      } else {
        store.commit('getActiveParameter', to.meta.name)
      }
      next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the
    })
  }
  //   if (getToken()) {
  //     if (to.path === '/login') {
  //       next({ path: '/' })
  //       NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
  //     } else {
  //       if (store.getters.roles.length === 0) {
  //         store.dispatch('GetInfo').then(res => { // 拉取用户信息
  //           next()
  //         }).catch((err) => {
  //           store.dispatch('FedLogOut').then(() => {
  //             ElementUI.Message.error(err || 'Verification failed, please login again')
  //             next({ path: '/' })
  //           })
  //         })
  //       } else {
  //         next()
  //       }
  //     }
  //   } else {
  //     if (whiteList.indexOf(to.path) !== -1) {
  //     } else {
  //       next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
  //       NProgress.done()
  //     }
  //   }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
