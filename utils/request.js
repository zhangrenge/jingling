function httpRequest(strUrl, key, value, success, fail) {

  var that = this
  
  var obj = {}; 
  for(var i = 0; i < key.length; i++) {
    var paramKey = key[i];
    obj[paramKey] = value[i];
  }

  wx.request({    
    url: getApp().globalData.baseUrl + strUrl,    
    data: obj,
    method: 'GET',
    
    header: {
      'content-type': 'application/json', // 默认值
      'encodeURI': 'UTF-8'
    },
    success: function (res) {
      success(res)
    },
    fail: function (res) {
      fail(res)
    }
  })
}

function httpRequest2(strUrl, key, value, success, fail) {

    var that = this

    var obj = {};
    for (var i = 0; i < key.length; i++) {
        var paramKey = key[i];
        obj[paramKey] = value[i];
    }

    wx.request({
        url: strUrl,
        data: obj,
        method: 'GET',

        header: {
            'content-type': 'application/json', // 默认值
            'encodeURI': 'UTF-8'
        },
        success: function (res) {
            success(res)
        },
        fail: function (res) {
            fail(res)
        }
    })
}
module.exports = {
  httpRequest: httpRequest,
  httpRequest2: httpRequest2
}