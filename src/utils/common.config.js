const moduleExports = {}
let baseUrl = ''
console.log(process.env)
if (process.env.NODE_ENV) { // 正式环境的
  baseUrl = 'https://msports.eastday.com'
} else { // 测试环境
  baseUrl = 'https://easy-mock.com/project/5baf287fd71a4e533bffcff7/vue-admin'
}
moduleExports.API_URL = {
  login: `${baseUrl}/user/login`,
  get_info: `${baseUrl}/user/info`,
  logout: `${baseUrl}/user/logout`,
  get_qid_list: `${baseUrl}/get_qid_list`
}
module.exports = moduleExports
