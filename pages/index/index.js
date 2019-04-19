// index.js
const app = getApp()
var md5util = require('../../utils/md5.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskNum: 0,
    runningNum: 0,
    finishNum: 0,
    headImgUrls: [
      'http://58.247.178.19:8080/survey/fileServer/_2018020111244028_18015343.png',
      'http://58.247.178.19:8080/survey/fileServer/_2018011811242636_08883485.png',
    ],
    child: [],
    localShow:false,
    localPage: [
      {
        appName: '考勤记录',
        appUrl: '/pages/checkin/checkin',
        appIcon: '/image/checkin.png',
        level: 20
      }
      ,
      {
        appName: '日程安排',
        appUrl: '/pages/schedule/schedule',
        appIcon: '/image/schedule.png'
      },
      {
        appName: '访客邀请',
        appUrl: '/pages/visitor/visitor',
        appIcon: '/image/visitor.png'
      },
      {
        appName: '文件共享',
        appUrl: '/pages/fileSharing/fileSharing',
        appIcon: '/image/package_icon.jpg'
      },
      {
        appName: '环境监测',
        appUrl: '/pages/envinfo/envinfo',
        appIcon: '/image/envinfo.png'
      },
      {
        appName: '视频会议',
        appUrl: '/pages/chat/choicePage/choicePage',
        appIcon: '/image/videochat.png'
      }
      // {
      //   appName: '智慧门店',
      //   appUrl: '/pages/probe/pages/login/index',
      //   appIcon: '/image/probe.png'
      // }
      // ,
      // {
      //   appName: '我的钱包',
      //   appUrl: '/pages/moneyPackage/moneyPackage',
      //   appIcon: '/image/money_icon.png'
      // }
    ]
  },
  computed: {
    textAdd: function () {
      return (parseInt(this.text) + 1);
    }
  },
  test1: function (e) {
    wx.navigateTo({
      url: '../approval/approval?indexType=' + 1,
    })
  },
  test2: function (e) {
    wx.navigateTo({
      url: '../approval/approval?indexType=' + 2,
    })
  },
  test3: function (e) {
    wx.navigateTo({
      url: '../approval/approval?indexType=' + 3,
    })
  },
  // bomb: function (e) {
  //   console.log(e)
  //   wx.navigateTo({
  //     url: '../holiday/holiday',
  //   })
  // },
  biu: function (e) {
    for (var i = 0; i < this.data.child.length; i++) {
      var child = this.data.child[i];
      if (e.currentTarget.dataset.name == child.appName) {
        switch (child.appType) {
          case 0:
            wx.showToast({
              title: '模块建设中...',
              icon: 'loading',
            })
            break
          case 1:
            var appId = child.littelAppId;
            var path = child.littelAppUrl;
            wx.navigateToMiniProgram({
              appId: appId,
              path: path,
              extraData: {
                foo: 'bar'
              },
              envVersion: 'release',
              success(res) {
                // 打开成功
              }
            })
            break
          case 2:
            var path = child.littelAppUrl;
                wx.navigateTo({
                url: path,
                })
            break
          default:
            wx.showToast({
              title: '模块建设中...',
              icon: 'loading',
            })
        }
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res.code)
        wx.request({
          url: app.globalData.baseUrl + 'weChat/weChatVerification.if',
          data: {
            code: res.code
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log("第一个接口请求成功，返回数据")
            console.log(res)
            if (res.data.status == 'success') {
              console.log('success')
              if (res.data.flag == 'true') {
                //loginId为手机号
                var loginId = res.data.loginId;
                //var loginId = 18616687600;
                wx.setStorageSync('loginId', loginId);
                wx.request({
                  url: app.globalData.baseUrl + 'weChat/weChatGetAppInfoList.if',
                  data: {
                    loginId: loginId
                    //loginId: 15720820799
                    //loginId: 15165220216
                  },
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success: function (res) {
                    console.log(res);
                    wx.hideLoading();
                    var companyId = res.data.companyId;
                    var userName = res.data.userName;
                    wx.setStorageSync('companyId', companyId);
                    wx.setStorageSync('userName', userName);
                    res.data.data.map(function(item,index){
                      if (item.appId =="8c797da134a342b2bd972839c37516e0"){
                        res.data.data[index].appName="会议室";
                      }
                    })
                    that.setData({
                      child: res.data.data
                    })
                  },
                  fail: function (res) {

                  },
                  complete:function(){
                    
                  }
                })     
                          
              } else if (res.data.flag == 'false') {
                wx.redirectTo({
                  url: '../login/login',
                })
              }
            } else if (res.data.status == 'failure') {
              console.log('解析失败')
            }
          },
          fail: function (res) {
            console.log("第一个接口请求失败")
            console.log(res.message)
          }
        })
      },
      complete:res=>{
        wx.setStorageSync('mptoken', "");
        wx.setStorageSync('level', "")
        wx.login({
          success: res => {
            console.log(res.code)
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            wx.request({
              url: app.globalData.baseURL+ "/wechat/mp/mptoken/_n/smart_it",
              data: {
                code: res.code,
                mobile: wx.getStorageSync('loginId')
              },
              success: function (data) {
                var data = data.data;
                console.log("data", data)
                if (data.code == 1) {
                  if (data.data.mptoken != "") {
                    wx.setStorageSync('mptoken', data.data.mptoken);
                    wx.setStorageSync('openid', data.data.mpinfo.openid);
                  }
                  if (data.data.level != "") {
                    wx.setStorageSync('level', data.data.level)
                  }
                  if(data.data.token!="" && data.data.ts!=""){
                    wx.setStorageSync('token', data.data.token);
                    wx.setStorageSync('tokenTime', data.data.ts);
                  }
                  console.log(wx.getStorageSync('mptoken'), wx.getStorageSync('level'))
                }

              },
              fail: function (res) {
                console.log("fail get session res", res)
              },
              complete: function () {
                var localPage = that.data.localPage;
                localPage.map(function (item, index) {
                  if(localPage[index].level){
                    localPage[index].level = wx.getStorageSync('level') ? wx.getStorageSync('level'):20;
                  }
                })
                console.log("localPage", that.data.localPage)
                that.setData({
                  localPage: localPage
                })
                that.setData({
                  localShow: true
                })
              }
            })
          }
        })
      }
    })
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var loginId = wx.getStorageSync('loginId');
    wx.request({
      url: app.globalData.baseUrl + 'LeaveInterface/taskNum.if',
      data: {
        loginId: loginId
      },
      success: function (e) {
        console.log(e)
        that.setData({
          taskNum: e.data
        })
      }
    })
    wx.request({
      url: app.globalData.baseUrl + 'LeaveInterface/runingNum.if',
      data: {
        loginId: loginId
      },
      success: function (e) {
        console.log(e)
        that.setData({
          runningNum: e.data
        })
      }
    })
    wx.request({
      url: app.globalData.baseUrl + 'LeaveInterface/finishedNum.if',
      data: {
        loginId: loginId
      },
      success: function (e) {
        console.log(e)
        that.setData({
          finishNum: e.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppname: function () {

  }
})