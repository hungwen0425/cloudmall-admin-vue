<template>
  <div class="mod-home">
    <h3>專案介绍</h3>
    <ul>
      <li>
        renren-fast-vue 基於 vue、element-ui 構建開發，實現
        <a
          href="https://gitee.com/renrenio/renren-fast"
          target="_blank"
        >renren-fast</a> 後台管理前端功能，提供一套更優的前端解决方案
      </li>
      <li>前後端分離，通過 token 進行資料交互，可獨立部署</li>
      <li>主題訂製，通過 scss 變量统一站式訂製</li>
      <li>動態選單，通過選單管理统一管理訪問路由</li>
      <li>資料切換，通過 mock 設定對接口資料／mock模擬資料進行切換</li>
      <li>發佈時，可動態設定 CDN 静態資源／切換新舊版本</li>
      <li>
        演示地址：
        <a
          href="http://demo.open.renren.io/renren-fast"
          target="_blank"
        >http://demo.open.renren.io/renren-fast</a> (帳號密碼：admin/admin)
      </li>
    </ul>
  </div>
</template>

<script>
export default {};
</script>

<style>
.mod-home {
  line-height: 1.5;
}
</style>

