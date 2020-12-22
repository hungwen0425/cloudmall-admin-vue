import Mock from 'mockjs'
import * as common from './modules/common'
import * as jobSchedule from './modules/job-schedule'
import * as oss from './modules/oss'
import * as sysConfig from './modules/sys-config'
import * as sysLog from './modules/sys-log'
import * as sysMenu from './modules/sys-menu'
import * as sysRole from './modules/sys-role'
import * as sysUser from './modules/sys-user'

// tips
// 1. 开启/關闭[业务模块]拦截, 通過調用fnCreate方法[isOpen参數]设置.
// 2. 开启/關闭[业务模块中某個請求]拦截, 通過函數返回物件中的[isOpen屬性]设置.
fnCreate(common, false)
fnCreate(jobSchedule, false)
fnCreate(oss, false)
fnCreate(sysConfig, false)
fnCreate(sysLog, false)
fnCreate(sysMenu, false)
fnCreate(sysRole, false)
fnCreate(sysUser, false)

/**
 * 创建mock模拟資料
 * @param {*} mod 模块
 * @param {*} isOpen 是否开启?
 */
function fnCreate(mod, isOpen = true) {
  if (isOpen) {
    for (var key in mod) {
      ((res) => {
        if (res.isOpen !== false) {
          Mock.mock(new RegExp(res.url), res.type, (opts) => {
            opts['data'] = opts.body ? JSON.parse(opts.body) : null
            delete opts.body
            console.log('\n')
            console.log('%cmock拦截, 請求: ', 'color:blue', opts)
            console.log('%cmock拦截, 响應: ', 'color:blue', res.data)
            return res.data
          })
        }
      })(mod[key]() || {})
    }
  }
}
