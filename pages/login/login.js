//login.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 1,
    name: '',
    employNum: '',
    loginId: ''
  },
  name: function (e) {
    this.setData({
      name: e.detail.value
    })
    console.log(this.data.name);
  },
  employNum: function (e) {
    this.setData({
      employNum: e.detail.value
    })
    console.log(this.data.employNum);    
  },
  login: function(e) {
    var that = this;
    wx.login({
      success: res => {
        var code = res.code;
        wx.request({
          url: app.globalData.baseUrl + 'weChat/weChatUpdateUserInfo.if',
          data: {
            userName: this.data.name,
            employeNo: this.data.employNum,
            userPhone: this.data.loginId,
            code: code
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log(e);
            wx.redirectTo({
              url: '../index/index?loginId=' + that.data.loginId,
            })
          },
          fail: function (res) {
            console.log(res.message)
          }
        })      
      }      
    })
  },
  getPhoneNumber: function(res) {
    console.log(res)
    var that = this;
    var iv = res.detail.iv;
    var encryptedData = res.detail.encryptedData;
    var errMsg = res.detail.errMsg;
    if (errMsg == 'getPhoneNumber:fail user deny') {
      console.log("未授权")
    } else {
      wx.login({
        success: res => {
          var code = res.code;
          wx.request({
            url: app.globalData.baseUrl + 'weChat/weChatPhoneNumberLogin.if',
            data: {
              code: code,
              iv: iv,
              encryptedData: encryptedData
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log(res)
              var status = res.data.status;
              var loginId = res.data.loginId;
              that.setData({
                loginId: loginId
              })
              if(status == 'success') {
                wx.redirectTo({
                  url: '../index/index?loginId=' + loginId,
                })
              } else if (status == 'notExist') {
                wx.showModal({
                  title: '提示',
                  content: '该手机号尚未注册,是否使用员工号登录？',
                  success: function (res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                      that.setData({
                        type: 2
                      })
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
              } else {
                that.wetoast.toast({
                  title: res.message
                })
              }
            },
            fail: function (res) {
              console.log(res.message)
            }
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.WeToast();
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
  onShareAppMessage: function () {
    
  }
})