const moduleExports = {}
let baseUrl = ''
// console.log(process.env)
if (process.env.NODE_ENV) { // 正式环境的
  baseUrl = 'https://msports.eastday.com'
} else { // 测试环境
  // baseUrl = 'https://easy-mock.com/mock/5baf6bef8bea6f548f168766/vue-admin'
  ////172.18.254.39:7001
  baseUrl = '//127.0.0.1:7001/api/v1'
}
moduleExports.API_URL = {
  login: `${baseUrl}/user/login`, // post登陆
  get_info: `${baseUrl}/user/get_info`, // get 获取信息
  logout: `${baseUrl}/user/logout`,
  qid: `${baseUrl}/qid`,
  qid_list: `${baseUrl}/qid_list`,
  get_menu: `${baseUrl}/get_menu`, // get 获取菜单列表
  ad: `${baseUrl}/ad`,
  update_ggid: `${baseUrl}/update_ggid`, // 修改广告信息
  add_ggid: `${baseUrl}/add_ggid` // 添加广告信息
}
module.exports = moduleExports
