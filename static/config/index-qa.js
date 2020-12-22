/**
 * 測試環境
 */
; (function () {
  window.SITE_CONFIG = {};

  // api接口請求地址
  window.SITE_CONFIG['baseUrl'] = 'http://localhost:8080/cloudmall-admin';

  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain'] = './'; // 域名
  window.SITE_CONFIG['version'] = '';   // 版本号(年月日時分)
  window.SITE_CONFIG['cdnUrl'] = window.SITE_CONFIG.domain + window.SITE_CONFIG.version;
})();
