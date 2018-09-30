<template>
  <div class="main">
    <el-autocomplete
      v-model="qid"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入qid"
      @select="handleSelect"/>
  </div>
</template>
<script>
import request from '@/utils/request'

export default {
  name: 'QidTable',
  data() {
    return {
      qid: 'null',
      qidJson: [
        { 'qid': '111' },
        { 'qid': '222' }
      ]
    }
  },
  mounted() {
    this.qidJson = this.loadAll()
  },
  methods: {
    async loadAll() {
      const qidlist = await request({
        url: '/get_qid_list',
        method: 'get',
        params: { a: 21212 }
      })
      console.log(qidlist)
    },
    querySearchAsync(queryString, cb) {
      const restaurants = this.restaurants
      console.log(queryString)
      const results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants

      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 3000 * Math.random())
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect(item) {
      console.log(item)
    }
  }
}
</script>
<style lang='scss'>
  .main .el-autocomplete {
    margin: 20px 0 0 20px;
  }
</style>
