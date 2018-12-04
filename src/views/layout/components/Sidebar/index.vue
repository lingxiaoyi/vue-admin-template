<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item v-for="route in routes" :key="route.name" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import request from "@/utils/request";
import { API_URL } from "@//utils/common.config.js";

export default {
  components: { SidebarItem },
  data() {
    return {
      menuInfo : {}
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  created(){
    this.get_menu()
    //this.$router.addRoutes()
  },
  methods: {
    async get_menu() {
      try {
        let res = await request(API_URL.get_menu, 'get', {})
        console.log(res)
      } catch (e) {
        console.log(e)
      }

    }
  }
}
</script>
