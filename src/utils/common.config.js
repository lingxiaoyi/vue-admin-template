const moduleExports = {}
let baseUrl = ''
// console.log(process.env)
if (process.env.NODE_ENV) { // 正式环境的
  baseUrl = 'https://msports.eastday.com'
} else { // 测试环境
  // baseUrl = 'https://easy-mock.com/mock/5baf6bef8bea6f548f168766/vue-admin'
  baseUrl = 'http://172.20.6.219:3099/api/v1'
}
moduleExports.API_URL = {
  login: `${baseUrl}/user/login`, // post登陆
  get_info: `${baseUrl}/user/get_info`, // get 获取信息
  logout: `${baseUrl}/user/logout`,
  get_qid_list: `${baseUrl}/get_qid_list`, // get 获取渠道数据
  get_menu_info: `${baseUrl}/get_menu`, // get 获取菜单列表
  get_ggid_list: `${baseUrl}/get_ggid_list`, // 渠道号搜索
  add_qid: `${baseUrl}/add_qid`, // 添加渠道号
  update_ggid: `${baseUrl}/update_ggid`, // 修改广告信息
  add_ggid: `${baseUrl}/add_ggid` // 添加广告信息
}
module.exports = moduleExports
