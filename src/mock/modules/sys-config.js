import Mock from 'mockjs'

// 生成資料列表
var dataList = []
for (let i = 0; i < Math.floor(Math.random() * 10 + 1); i++) {
  dataList.push(Mock.mock({
    'id': '@increment',
    'paramKey': '@first',
    'paramValue': '@last',
    'remark': '@csentence'
  }))
}

// 取得参數列表
export function list() {
  return {
    // isOpen: false,
    url: '/sys/config/list',
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

// 取得参數信息
export function info() {
  return {
    // isOpen: false,
    url: '/sys/config/info',
    type: 'get',
    data: {
      'msg': 'success',
      'code': 0,
      'config': dataList[0]
    }
  }
}

// 添加参數
export function add() {
  return {
    // isOpen: false,
    url: '/sys/config/save',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0
    }
  }
}

// 修改参數
export function update() {
  return {
    // isOpen: false,
    url: '/sys/config/update',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0
    }
  }
}

// 删除参數
export function del() {
  return {
    // isOpen: false,
    url: '/sys/config/delete',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0
    }
  }
}
