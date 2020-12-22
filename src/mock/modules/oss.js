import Mock from 'mockjs'

// 生成資料列表
var dataList = []
for (let i = 0; i < Math.floor(Math.random() * 10 + 1); i++) {
  dataList.push(Mock.mock({
    'id': '@increment',
    'url': 'http://oapk0ekso.bkt.clouddn.com/upload/@date("yyyyMMdd")/@guid().png',
    'createDate': '@datetime'
  }))
}

// 取得檔案列表
export function list() {
  return {
    // isOpen: false,
    url: '/sys/oss/list',
    type: 'get',
    data: {
      'msg': 'success',
      'code': 0,
      'page': {
        'totalCount': dataList.length,
        'pageSize': 10,
        'totalPage': 1,
        'currPage': 1,
        'list': dataList
      }
    }
  }
}

// 取得雲端存儲配置信息
export function config() {
  return {
    // isOpen: false,
    url: '/sys/oss/config',
    type: 'get',
    data: {
      'msg': 'success',
      'code': 0,
      'config': {
        'type': 1,
        'qiniuDomain': 'http:// oapk0ekso.bkt.clouddn.com',
        'qiniuPrefix': 'upload',
        'qiniuAccessKey': '2fIEkyYuNXatF4HIXlMbUY6dA-rDQpuADPxtnAHZ',
        'qiniuSecretKey': 'G4F9gqYRJd5K56pDGaWQrGIzV8me4rT7mQQUKfmk',
        'qiniuBucketName': 'xiaolu-vido',
        'aliyunDomain': '',
        'aliyunPrefix': '',
        'aliyunEndPoint': '',
        'aliyunAccessKeyId': '',
        'aliyunAccessKeySecret': '',
        'aliyunBucketName': '',
        'qcloudDomain': '',
        'qcloudPrefix': '',
        'qcloudAppId': null,
        'qcloudSecretId': '',
        'qcloudSecretKey': '',
        'qcloudBucketName': '',
        'qcloudRegion': null
      }
    }
  }
}

// 保存雲端存儲配置信息
export function addConfig() {
  return {
    // isOpen: false,
    url: '/sys/oss/saveConfig',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0
    }
  }
}

// 删除檔案
export function del() {
  return {
    // isOpen: false,
    url: '/sys/oss/delete',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0
    }
  }
}
