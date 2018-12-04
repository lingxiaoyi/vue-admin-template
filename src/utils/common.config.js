const moduleExports = {}
let baseUrl = ''
// console.log(process.env)
if (process.env.NODE_ENV) { // 正式环境的
  baseUrl = 'https://msports.eastday.com'
} else { // 测试环境
  baseUrl = 'https://easy-mock.com/mock/5baf6bef8bea6f548f168766/vue-admin'
}
moduleExports.API_URL = {
  login: `${baseUrl}/user/login`, // post登陆
  get_info: `${baseUrl}/user/get_info`, // get 获取信息
  logout: `${baseUrl}/user/logout`, // get 退出
  get_project_list: `${baseUrl}/get_project_list`, // get 获取project列表
  get_page_list: `${baseUrl}/get_page_list`, // get 获取page列表
  get_qid_list: `${baseUrl}/get_qid_list`, // get 获取qid列表
  add_qid: `${baseUrl}/add_qid`, // post
  get_ggid_list: `${baseUrl}/get_ggid_list`, // 获取当前qid下的ggid
  add_ggid: `${baseUrl}/add_ggid`, // post
  update_ggid: `${baseUrl}/update_ggid` // post
}
module.exports = moduleExports
