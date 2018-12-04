import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    parameter: null,
    menuList: null
  },
  modules: {
    app,
    user
  },
  getters,
  mutations: {
    saveMenuInfo(state, payload) {
      const data = payload.data
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
      state.menuList = menuList
      store.commit('editmenuList', payload.name)
    },
    editmenuList(state, name) {
      state.parameter = state.menuList.filter(item => {
        return item.name === name
      })[0] || ''
      console.log(state.parameter)
    }
  }
})

export default store
