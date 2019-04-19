// drawDetail.js
var util = require('../../utils/util.js');

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected: false,
    applyText: '',
    name: '',
    loginId: '',
    tempFiles: [],
    headImg: '../../image/draw-head.png',
    description: '',
    info: ''
  },
  next: function (e) {
    this.setData({
      selected: true
    })
  },
  textAreaBlur: function (e) {
    this.setData({
      description: e.detail.value
    })
    console.log(this.data.description)
  },
  upLoadHeadImg: function (e) {
    var that = this;
    var loginId = wx.getStorageSync('loginId');
    var userName = wx.getStorageSync('userName');
    var companyId = wx.getStorageSync('companyId');
    var signTime = new Date().toString();
    var data = {
      userId: loginId,
      userName: userName,
      companyId: companyId,
      signTime: signTime
    }
    wx.showActionSheet({
      itemList: ['从相册选取', '拍照'],
      success: function (res) {
        if (res.tapIndex == 0) {
          wx.chooseImage({
            count: 1,
            sourceType: ['album'],
            success: function (res) {
              console.log(res);
              that.setData({
                tempFiles: that.data.tempFiles.concat(res.tempFiles),
                headImg: res.tempFilePaths[0]
              })
              wx.uploadFile({
                url: app.globalData.baseUrl + 'ActivitySignController/sign.if',
                header: {
                  "content-type": "multipart/form-data"
                },
                method: 'POST',
                filePath: that.data.tempFiles[0].path,
                name: 'file',
                formData: data,
                success: function (res) {
                  that.wetoast.toast({
                    title: '上传成功'
                  })
                },
                fail: function (res) {
                  that.wetoast.toast({
                    title: '上传失败'
                  })
                }
              })
            },
            fail: function (res) {

            }
          })
        } else if (res.tapIndex == 1) {
          wx.chooseImage({
            count: 1,
            sourceType: ['camera'],
            success: function (res) {
              console.log(res);
              that.setData({
                tempFiles: that.data.tempFiles.concat(res.tempFiles),
                headImg: res.tempFilePaths[0]
              })
              wx.uploadFile({
                url: app.globalData.baseUrl + 'ActivitySignController/sign.if',
                header: {
                  "content-type": "multipart/form-data"
                },
                method: 'POST',
                filePath: that.data.tempFiles[0].path,
                name: 'file',
                formData: data,
                success: function (res) {
                  that.wetoast.toast({
                    title: '上传成功'
                  })
                },
                fail: function (res) {
                  that.wetoast.toast({
                    title: '上传失败'
                  })
                }
              })
            },
            fail: function (res) {

            }
          })
        }
      },
      fail: function (res) {

      }
    })

  },
  evaSubmit: function (e) {
    var that = this;
    var loginId = wx.getStorageSync('loginId');
    var userName = wx.getStorageSync('userName');
    var companyId = wx.getStorageSync('companyId');
    var signTime = new Date().toString();
    var description = this.data.description;
    var data = {
      userId: loginId,
      userName: userName,
      companyId: companyId,
      signTime: signTime,
      description: description
    }
    console.log(data);
    if (this.data.applyText == '签到') {
      if (this.data.tempFiles.length > 0) {
        wx.uploadFile({
          url: app.globalData.baseUrl + 'ActivitySignController/sign.if',
          header: {
            "content-type": "multipart/form-data"
          },
          method: 'POST',
          filePath: this.data.tempFiles[0].path,
          name: 'file',
          formData: data,
          success: function (res) {
            console.log(res)
            that.wetoast.toast({
              title: '签到成功'
            })
            that.setData({
              applyText: '发表祝福语'
            })
            console.log(data);
          },
          fail: function (res) {
            console.log(res)
            that.wetoast.toast({
              title: '签到失败'
            })
          }
        })
      } else {
        that.wetoast.toast({
          title: '头像不能为空'
        })
      }
    } else {
      if (description == '') {
        that.wetoast.toast({
          title: '祝福语不能为空'
        })
      } else {
        wx.request({
          url: app.globalData.baseUrl + 'lottery/sendBombScreenMsg.if',
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          data: {
            msg: description,
            phone: loginId
          },
          success: function (res) {
            console.log(res)
            that.wetoast.toast({
              title: '发送成功'
            })
            that.setData({
              info: ''
            })
          },
          fail: function (res) {
            console.log(res)
          }
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.WeToast();
    var that = this;
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#c80405',
    })
    var loginId = wx.getStorageSync('loginId');
    //var loginId = 13818266659;
    var companyId = wx.getStorageSync('companyId');
    var userName = wx.getStorageSync('userName');
    this.setData({
      name: userName,
      loginId: loginId
    })
    wx.request({
      url: app.globalData.baseUrl + 'ActivitySignController/selectByUserIdAndCompanyId.if',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        userId: loginId,
        companyId: companyId
      },
      success: function (res) {
        console.log(res)
        if (res.data == '') {
          that.setData({
            applyText: '签到'
          })
        } else {

          var time = new Date().getTime();
          var url = res.data.imgHttp + '?t='+time;

          setTimeout(function(){
            that.setData({
              applyText: '发表祝福语',
              headImg: url
            })

          },500)
          
        }
      },
      fail: function (res) {
        console.log(res)
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
})