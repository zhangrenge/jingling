//approvalReason.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    approvalReason: ''
  },
  textAreaBlur: function (e) {
    this.setData({
      approvalReason: e.detail.value
    })
  },
  evaSubmit: function (e) {
    var that = this;
    if (this.data.approvalReason == '') {
      this.wetoast.toast({
        title: '审批理由不能为空'
      })
    } else {
      var data = wx.getStorageSync('approvalData');
      data.comment = this.data.approvalReason;
      console.log(data)
      wx.request({
        url: app.globalData.baseUrl + 'LeaveInterface/complete.if',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        data: data,
        success: function (res) {
          console.log(res)
          that.wetoast.toast({
            title: '审核完成',
            success: function (e) {
              wx.navigateBack({
                delta: 2
              })
              // wx.redirectTo({
              //   url: '../approval/approval'                
              // })
            }
          })
        },
        fail: function (res) {
          console.log(res)
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