// pages/approval/approval.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgBaseUrl: app.globalData.baseUrl,
    pageType: 1,
    index: 1,
    loginId: wx.getStorageSync('loginId'),
    selected1: true,
    selected2: false,
    selected3: false,
    selected4: false,
    selected5: false,
    untreatedList: '',
    treatingList: '',
    treatedList: ''
  },
  selected1: function (e) {
    var that = this;
    this.setData({
      pageType: 1,
      index: 1,
      selected1: true,
      selected2: false,
      selected3: false,
      selected4: false,
    })
    if (this.data.untreatedList == '') {
      wx.showLoading({
        title: '加载中...',
      })
    }
    wx.request({
      url: app.globalData.baseUrl + 'LeaveInterface/getUntreatedTaskList.if',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        loginId: this.data.loginId,
        //loginId: 13621761774,
        rows: 10,
        page: 1
      },
      success: function (res) {
        console.log(res)
        wx.hideLoading();
        if (res.data.rows.length < 1) {
          that.setData({
            selected4: true
          })
        } else {
          that.setData({
            selected4: false
          })
        }
        that.setData({
          untreatedList: res.data.rows
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  selected2: function (e) {
    var that = this;
    this.setData({
      pageType: 2,
      index: 1,
      selected1: false,
      selected2: true,
      selected3: false,
      selected4: false
    })
    if (this.data.treatingList == '') {
      wx.showLoading({
        title: '加载中...',
      })
    }
    wx.request({
      url: app.globalData.baseUrl + 'LeaveInterface/getRuningTaskList.if',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        loginId: this.data.loginId,
        //loginId: 13621761774,        
        rows: 10,
        page: 1
      },
      success: function (res) {
        console.log(res)
        wx.hideLoading();
        if (res.data.rows.length < 1) {
          that.setData({
            selected4: true
          })
        } else {
          that.setData({
            selected4: false
          })
        }
        that.setData({
          treatingList: res.data.rows
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  selected3: function (e) {
    var that = this;
    this.setData({
      pageType: 3,
      index: 1,
      selected1: false,
      selected2: false,
      selected3: true,
      selected4: false,
    })
    if (this.data.treatedList == '') {
      wx.showLoading({
        title: '加载中...',
      })
    }
    wx.request({
      url: app.globalData.baseUrl + 'LeaveInterface/getFinishedTaskList.if',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        loginId: this.data.loginId,
        rows: 10,
        page: 1
      },
      success: function (res) {
        console.log(res)
        wx.hideLoading();
        if (res.data.rows.length < 1) {
          that.setData({
            selected4: true
          })
        } else {
          that.setData({
            selected4: false
          })
        }
        that.setData({
          treatedList: res.data.rows
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  untreatedItemClick: function (e) {
    var that=this;
    console.log(e)
    console.log(e.currentTarget.dataset.type)
    var processDefName = e.currentTarget.dataset.processdefname;
    if (processDefName == '请假流程') {
      wx.navigateTo({
        url: '../detail/detail?taskId=' + e.currentTarget.dataset.id + '&opentype=untreated&taskName=' + e.currentTarget.dataset.type,
      })
    } else if (processDefName == '出差流程') {
      wx.navigateTo({
        url: '../businessApplyDetail/businessApplyDetail?taskId=' + e.currentTarget.dataset.id + '&opentype=untreated&taskName=' + e.currentTarget.dataset.type,
      })
        } else if (processDefName=='用印申请'){

        if(e.currentTarget.dataset.assignee==null){

           wx.showModal({
              title: '提示',
              content: '当前任务未签收，确定签收此任务',
              showCancel: true,
              success:function(res){
                if(res.confirm){
                  //请求服务器进行签收任务
                   wx.request({
                          url: app.globalData.baseUrl + 'StampInterface/claim.if',
                          header: {
                            "content-type": "application/x-www-form-urlencoded"
                          },
                          method: 'POST',
                          data: {
                            taskId:e.currentTarget.dataset.id,
                            loginId: that.data.loginId 
                          },
                          success: function (res) {
                          if(res.data.status){
                              that.wetoast.toast({
                                confirmColor:'#5ab9ff',
                                cancelColor:'#D8D8D8',
                              title: '流程签出成功'
                            })
                            that.selected1();
                          }else{
                              that.wetoast.toast({
                                confirmColor:'#5ab9ff',
                                cancelColor:'#D8D8D8',
                              title: '流程签出失败'
                            })
                          }
                            
                          },
                          fail: function (res) {
                            console.log(res)
                          }
                        })
                }
              }
            })
       }else{
        wx.navigateTo({
          url: '../stamp/stampAudit/stampAudit?taskId=' + e.currentTarget.dataset.id 
        })
       }

     
    }
  },
  treatingItemClick: function (e) {
    console.log(e)
    var processDefName = e.currentTarget.dataset.processdefname;
    if (processDefName == '请假流程') {
      wx.navigateTo({
        url: '../detail/detail?taskId=' + e.currentTarget.dataset.id + '&pDefId=' + e.currentTarget.dataset.pdefid + '&pInstId=' + e.currentTarget.dataset.pinstid + '&opentype=treating',
      })
    } else if (processDefName == '出差流程') {
      wx.navigateTo({
        url: '../businessApplyDetail/businessApplyDetail?taskId=' + e.currentTarget.dataset.id + '&pDefId=' + e.currentTarget.dataset.pdefid + '&pInstId=' + e.currentTarget.dataset.pinstid + '&opentype=treating',
      })
    }else if (processDefName=='用印申请'){
      wx.navigateTo({
        url: '../stamp/stampDetail/stampDetail?taskId=' + e.currentTarget.dataset.id + '&pDefId=' + e.currentTarget.dataset.pdefid + '&pInstId=' + e.currentTarget.dataset.pinstid
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("当前登录用户 ID  " + this.data.loginId);
    new app.WeToast();
    var that = this;
    var indexType = options.indexType;
    var loginId = wx.getStorageSync('loginId');
    this.setData({
      loginId: loginId
    })
    console.log(this.data.loginId);
    new app.WeToast();
    if (indexType == 1) {
      that.setData({
        pageType: 1,
        index: 1,
        selected1: true,
        selected2: false,
        selected3: false,
        selected4: false,
      })
      wx.showLoading({
        title: '加载中...'
      })
      wx.request({
        url: app.globalData.baseUrl + 'LeaveInterface/getUntreatedTaskList.if',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        data: {
          loginId: this.data.loginId,
          //loginId: 15259209521,
          //loginId: 15165220216,                  
          //loginId: 13621761774,
          //loginId: 15138231640,
          rows: 10,
          page: 1
        },
        success: function (res) {
          console.log(res)
          wx.hideLoading();
          if (res.data.rows.length < 1) {
            that.setData({
              selected4: true
            })
          } else {
            that.setData({
              selected4: false
            })
          }
          that.setData({
            untreatedList: res.data.rows
          })
        },
        fail: function (res) {
          console.log(res)
        }
      })
    } else if(indexType == 2) {
      that.setData({
        pageType: 2,
        index: 1,
        selected1: false,
        selected2: true,
        selected3: false,
        selected4: false
      })
      if (this.data.treatingList == '') {
        wx.showLoading({
          title: '加载中...',
        })
      }
      wx.request({
        url: app.globalData.baseUrl + 'LeaveInterface/getRuningTaskList.if',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        data: {
          loginId: this.data.loginId,
          rows: 10,
          page: 1
        },
        success: function (res) {
          console.log(res)
          wx.hideLoading();
          if (res.data.rows.length < 1) {
            that.setData({
              selected4: true
            })
          } else {
            that.setData({
              selected4: false
            })
          }
          that.setData({
            treatingList: res.data.rows
          })
        },
        fail: function (res) {
          console.log(res)
        }
      })
    } else if (indexType == 3) {
      that.setData({
        pageType: 3,
        index: 1,
        selected1: false,
        selected2: false,
        selected3: true,
        selected4: false,
      })
      if (this.data.treatedList == '') {
        wx.showLoading({
          title: '加载中...',
        })
      }
      wx.request({
        url: app.globalData.baseUrl + 'LeaveInterface/getFinishedTaskList.if',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        data: {
          loginId: this.data.loginId,
          rows: 10,
          page: 1
        },
        success: function (res) {
          console.log(res)
          wx.hideLoading();
          if (res.data.rows.length < 1) {
            that.setData({
              selected4: true
            })
          } else {
            that.setData({
              selected4: false
            })
          }
          that.setData({
            treatedList: res.data.rows
          })
        },
        fail: function (res) {
          console.log(res)
        }
      })
    }
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
    if (this.data.pageType == 1) {
      this.setData({
        pageType: 1,
        index: 1,
        selected1: true,
        selected2: false,
        selected3: false,
        selected4: false,
      })
      if (this.data.untreatedList == '') {
        wx.showLoading({
          title: '加载中...',
        })
      }
      wx.request({
        url: app.globalData.baseUrl + 'LeaveInterface/getUntreatedTaskList.if',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        data: {
          loginId: this.data.loginId,
          //loginId: 15165220216,          
          rows: 10,
          page: 1
        },
        success: function (res) {
          console.log(res)
          wx.hideLoading();
          if (res.data.rows.length < 1) {
            that.setData({
              selected4: true
            })
          } else {
            that.setData({
              selected4: false
            })
          }
          that.setData({
            untreatedList: res.data.rows
          })
        },
        fail: function (res) {
          console.log(res)
        }
      })
    }
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
    new app.WeToast();
    var that = this;
    this.setData({
      selected5: true
    })
    if (this.data.pageType == 1) {
      var strUrl = 'LeaveInterface/getUntreatedTaskList.if';
    } else if (this.data.pageType == 2) {
      var strUrl = 'LeaveInterface/getRuningTaskList.if';
    } else {
      var strUrl = 'LeaveInterface/getFinishedTaskList.if';
    }
    this.data.index += 1;
    wx.request({
      url: app.globalData.baseUrl + strUrl,
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        loginId: this.data.loginId,
        //loginId: 13621761774,
        rows: 10,
        page: this.data.index
      },
      success: function (res) {
        console.log(res)
        console.log(that.data.index)
        if (that.data.index <= res.data.total) {
          if (that.data.pageType == 1) {
            that.setData({
              selected5: false,
              untreatedList: that.data.untreatedList.concat(res.data.rows)
            })
          } else if (that.data.pageType == 2) {
            that.setData({
              selected5: false,
              treatingList: that.data.treatingList.concat(res.data.rows)
            })
          } else {
            that.setData({
              selected5: false,
              treatedList: that.data.treatedList.concat(res.data.rows)
            })
          }
        } else {
          that.setData({
            selected5: false
          })
          that.wetoast.toast({
            title: '没有更多数据了'
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})