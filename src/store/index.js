import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import getters from './getters'
import permission from './modules/permission'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    activeParameter: {
      projectId: '', // projectid
      id: '' // pageid
    },
    menuList: null,
    asyncRouterMap: null
  },
  modules: {
    app,
    user,
    permission
  },
  getters,
  mutations: {
    getActiveParameter(state, name) {
      state.activeParameter = state.menuList.filter(item => {
        return item.name === name
      })[0] || ''
    }
  }
})

export default store
