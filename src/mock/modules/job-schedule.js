import Mock from 'mockjs'

// 生成資料列表
var dataList = []
for (let i = 0; i < Math.floor(Math.random() * 10 + 1); i++) {
  let name = Mock.Random.name()
  dataList.push(Mock.mock({
    'jobId': '@increment',
    'beanName': name,
    'methodName': name,
    'params': '-',
    'cronExpression': '0 0/30 * * * ?',
    'status': 1,
    'remark': '@csentence',
    'createTime': '@datetime'
  }))
}

// 取得定時任務列表
export function list() {
  return {
    // isOpen: false,
    url: '/sys/schedule/list',
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

// 取得定時任務信息
export function info() {
  return {
    // isOpen: false,
    url: '/sys/schedule/info',
    type: 'get',
    data: {
      'msg': 'success',
      'code': 0,
      'user': dataList[0]
    }
  }
}

// 添加定時任務
export function add() {
  return {
    // isOpen: false,
    url: '/sys/schedule/save',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0
    }
  }
}

// 修改定時任務
export function update() {
  return {
    // isOpen: false,
    url: '/sys/schedule/update',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0
    }
  }
}

// 删除定時任務
export function del() {
  return {
    // isOpen: false,
    url: '/sys/schedule/delete',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0
    }
  }
}

// 运行定時任務
export function run() {
  return {
    // isOpen: false,
    url: '/sys/schedule/run',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0
    }
  }
}

// 暫停定時任務
export function pause() {
  return {
    // isOpen: false,
    url: '/sys/schedule/pause',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0
    }
  }
}

// 恢復定時任務
export function resume() {
  return {
    // isOpen: false,
    url: '/sys/schedule/resume',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0
    }
  }
}
