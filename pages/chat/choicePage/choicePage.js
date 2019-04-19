// pages/schedule/schedule.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canShow: 0,
    tapTime: '',		// 防止两次点击操作间隔太快
    entryInfos: [
      { icon: "../assets/images/play.png", title: "加入会议", navigateTo: "../videoChat/videoChat" },
      { icon: "../assets/images/multiroom.png", title: "安排", navigateTo: "../arrange/arrange" },
      { icon: "../assets/images/debug-tools.png", title: "我的会议", navigateTo: "../myChat/myChat" }
    ]
  },
  onEntryTap: function (e) {
    var toUrl = this.data.entryInfos[e.currentTarget.id].navigateTo;
    console.log(toUrl);
    wx.navigateTo({
      url: toUrl,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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