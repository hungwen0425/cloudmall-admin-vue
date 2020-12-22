/**
 * 開發環境
 */
; (function () {
  window.SITE_CONFIG = {};

  // api接口請求地址
  // window.SITE_CONFIG['baseUrl'] = 'http://localhost:8080/cloudmall-admin';
  // 改為給網關發請求 (在 cloudmall-gateway 中的 application.yml 設定)
  window.SITE_CONFIG['baseUrl'] = 'http://localhost:88/api';

  // cdn地址 = 域名 + 版本號
  window.SITE_CONFIG['domain'] = './'; // 域名
  window.SITE_CONFIG['version'] = '';   // 版本號(年月日時分)
  window.SITE_CONFIG['cdnUrl'] = window.SITE_CONFIG.domain + window.SITE_CONFIG.version;
})();
