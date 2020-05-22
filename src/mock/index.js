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
// 1. 開啟/關閉[業務模塊]攔截, 通過調用fnCreate方法[isOpen参數]設定.
// 2. 開啟/關閉[業務模塊中某個請求]攔截, 通過函數返回物件中的[isOpen屬性]設定.
fnCreate(common, false)
fnCreate(jobSchedule, false)
fnCreate(oss, false)
fnCreate(sysConfig, false)
fnCreate(sysLog, false)
fnCreate(sysMenu, false)
fnCreate(sysRole, false)
fnCreate(sysUser, false)

/**
 * 創建mock模擬資料
 * @param {*} mod 模塊
 * @param {*} isOpen 是否開啟?
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
            console.log('%cmock攔截, 請求: ', 'color:blue', opts)
            console.log('%cmock攔截, 響應: ', 'color:blue', res.data)
            return res.data
          })
        }
      })(mod[key]() || {})
    }
  }
}
