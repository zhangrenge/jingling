const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment: '',
    ticketInfo: '',
  },
  textAreaBlur: function (e) {
    this.setData({
      comment: e.detail.value
    })
  },
  ticketInfoBlur: function (e) {
    this.setData({
      ticketInfo: e.detail.value
    })
  },
  evaSubmit: function (e) {
    var that = this;
    if (this.data.comment == '') {
      this.wetoast.toast({
        title: '审批理由不能为空'
      })
    } else {
      var data = wx.getStorageSync('approvalData');
      data.comment = this.data.comment;
      data.ticketInfo = this.data.ticketInfo;
      data.flag = e.currentTarget.dataset.flag;
      console.log(data)
      wx.request({
        url: app.globalData.baseUrl + 'BusinessInterface/submitTicket.if',
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