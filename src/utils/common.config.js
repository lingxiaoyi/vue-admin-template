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
  logout: `${baseUrl}/user/logout`,
  get_qid_list: `${baseUrl}/get_qid_list`
}
module.exports = moduleExports
