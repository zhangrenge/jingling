var util = require('../../../utils/util.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgBaseUrl: app.globalData.baseUrl,
    StampAudit: '',
    actBaseInfos: '',
    userId: '',
    userName: '',
    deptId: '',
    stampType: '',
    createTime: util.formatTimeMine(new Date()),
    reason: '',
    status: '',
    headImage: '',
    procDefId: '',
    procInsId: '',
    taskName: '',
    taskDefKey: '',
    taskId: '',
    flag: '',
    comment: '',
    department: '',
    workplace: '',
    applyDate: '',
    commentAudit: '',
    commentReason: '',
    endFlag: 'false',
    delFlag: '0',
    size: 0,
    animationData:{}
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.WeToast();
    var that = this;
    var loginId = wx.getStorageSync('loginId');
    // debugger
      console.log(options);
      wx.request({
        url: app.globalData.baseUrl + 'StampInterface/taskdetail.if',
        data: {
          pInstId: options.pInstId,
          pDefId: options.pDefId,
          taskId: options.taskId
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function (res) {
          // debugger
         if(res.statusCode==200){
           console.log(res);
           var StampAudit = res.data.oaStampAudit;
           var actBaseInfos = res.data.actBaseInfos;
           that.setData({
             userName: StampAudit.userName,
             department: StampAudit.deptId,
             stampType: StampAudit.stampType,
             status: StampAudit.stampAuditStatus,
             reason: StampAudit.reason,
             loginId: loginId,
             StampAudit: StampAudit,
             actBaseInfos: actBaseInfos,
             applyDate: res.data.applyDate,
             taskDefKey: res.data.taskDefKey,
             taskId: res.data.taskId,
             taskName: res.data.taskName,
             procInsId: res.data.procInsId,
             procDefId: res.data.procDefId,
             hrDeprId: res.data.hrDeprId,
             size: res.data.size,
           })
         }else{
           wx.showToast({
             title: '任务已经消失',
             image: '../../../image/sorry.png'
           })
           setTimeout(function () { wx.hideLoading() }, 2000),
             setTimeout(function () {
               wx.redirectTo({
                 url: '../../approval/approval',
               })
             }, 2000)
         }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})