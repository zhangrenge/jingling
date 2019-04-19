//app.js
var utilHttpRequest = require('utils/request.js');
let { WeToast } = require('component/wetoast/wetoast.js')
App({
  WeToast,
  chineseDate: {
    years: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
    months: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    console.log('登录')

    //调用系统API获取设备的信息
    wx.getSystemInfo({
      success: function (res) {
        var kScreenW = res.windowWidth / 375
        var kScreenH = res.windowHeight / 603
        wx.setStorageSync('kScreenW', kScreenW)
        wx.setStorageSync('kScreenH', kScreenH)
      }
    })
   
    console.log('获取用户信息')
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    console.log('结束')
  },
  globalData: {
    userInfo: null,
    baseUrl: 'https://oa.fogpod.com/oneportal/',
    baseURL: 'https://api.fogpod.com',
    baseHtml: 'https://www.fogpod.com',
    routerUrl:'https://router.fogpod.com'
  }
})


  // "pages/probe/pages/login/index",
    // "pages/probe/pages/probe/index",
    // "pages/probe/pages/probedetails/index",
    // "pages/probe/pages/sevenDaysChart/index",
    // "pages/probe/pages/hoursChart/index",
    // "pages/probe/pages/enterChart/index",
    // "pages/probe/pages/stayChart/index",
    // "pages/probe/pages/brandChart/index",