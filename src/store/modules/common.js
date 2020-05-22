export default {
  namespaced: true,
  state: {
    // 頁面文件可視高度(随窗口改變大小)
    documentClientHeight: 0,
    // 導航條, 布局風格, defalut(默認) / inverse(反向)
    navbarLayoutType: 'default',
    // 側邊欄, 布局皮膚, light(浅色) / dark(黑色)
    sidebarLayoutSkin: 'dark',
    // 側邊欄, 折疊狀態
    sidebarFold: false,
    // 側邊欄, 選單
    menuList: [],
    menuActiveName: '',
    // 内容, 是否需要刷新
    contentIsNeedRefresh: false,
    // 主入口標簽頁
    mainTabs: [],
    mainTabsActiveName: ''
  },
  mutations: {
    updateDocumentClientHeight(state, height) {
      state.documentClientHeight = height
    },
    updateNavbarLayoutType(state, type) {
      state.navbarLayoutType = type
    },
    updateSidebarLayoutSkin(state, skin) {
      state.sidebarLayoutSkin = skin
    },
    updateSidebarFold(state, fold) {
      state.sidebarFold = fold
    },
    updateMenuList(state, list) {
      state.menuList = list
    },
    updateMenuActiveName(state, name) {
      state.menuActiveName = name
    },
    updateContentIsNeedRefresh(state, status) {
      state.contentIsNeedRefresh = status
    },
    updateMainTabs(state, tabs) {
      state.mainTabs = tabs
    },
    updateMainTabsActiveName(state, name) {
      state.mainTabsActiveName = name
    }
  }
}
