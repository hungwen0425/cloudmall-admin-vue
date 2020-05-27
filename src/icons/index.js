/**
 * 字體圖標, 统一使用SVG Sprite矢量圖標(http://www.iconfont.cn/）
 *
 * 使用:
 *  1. 在阿里矢量圖標站創建一個專案, 並添加圖標(這一步非必須, 創建方便專案圖標管理)
 *  2-1. 添加icon, 選中新增的icon圖標, 複製程式碼 -> 下載 -> SVG下載 -> 粘贴程式碼(重命名)
 *  2-2. 添加icons, 下載圖標庫對應[iconfont.js]文件, 替換專案[./iconfont.js]文件
 *  3. 組件模版中使用 [<icon-svg name="canyin"></icon-svg>]
 *
 * 注意:
 *  1. 通過2-2 添加icons, getNameList方法無法返回對應資料
 */
import Vue from 'vue'
import IconSvg from '@/components/icon-svg'
import './iconfont.js'

Vue.component('IconSvg', IconSvg)

const svgFiles = require.context('./svg', true, /\.svg$/)
const iconList = svgFiles.keys().map(item => svgFiles(item))

export default {
  // 取得圖標icon-(*).svg名稱列表, 例如[shouye, xitong, zhedie, ...]
  getNameList() {
    return iconList.map(item => item.default.id.replace('icon-', ''))
  }
}
