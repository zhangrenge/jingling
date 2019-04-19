var util = require('../../../utils/util.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stampAuditId:'',
    taskId:'',
    taskName: '',
    taskDefKey: '',
    procInsId: '',
    procDefId: '',
    flag: '',
    userId: '',
    id: '',
    delFlag: '',
    endFlag: 'false',
    comment:'',
    disabled:false
  },

  bindTextAreaBlur:function(e){
    // debugger
   this.setData({
     comment:e.detail.value
   })
  },
  bindRebutButton:function(){
    // debugger
    new app.WeToast();
    var that = this;
    var stampAuditId = that.data.stampAuditId;
    var taskId = that.data.taskId;
    var taskName = that.data.taskName;
    var taskDefKey = that.data.taskDefKey;
    var procInsId = that.data.procInsId;
    var procDefId = that.data.procDefId;
    var flag = that.data.flag;
    var userId = that.data.userId;
    var id = that.data.id;
    var delFlag = that.data.delFlag;
    var endFlag = that.data.endFlag;
    var comment=that.data.comment;
    var loginId = wx.getStorageSync('loginId', loginId)
   wx.showModal({
     title: '用印申请',
     content: '是否驳回申请',
     showCancel:true,
     cancelColor:'#D8D8D8',
     confirmColor:'#5ab9ff',
     success:function(res){
       if(res.confirm){
         that.setData({
         disabled:true,
         })
         wx.request({
           method: 'POST',
           header: {
             "content-type": "application/x-www-form-urlencoded"
           },
           data: {
             stampAuditId: stampAuditId,
             taskId: taskId,
             taskName: taskName,
             taskDefKey: taskDefKey,
             procInsId: procInsId,
             procDefId: procDefId,
             flag: flag,
             userId: userId,
             id: id,
             delFlag: delFlag,
             endFlag: endFlag,
             comment: comment,
             loginId: loginId,
           },
           url: app.globalData.baseUrl + 'StampInterface/complete.if',
           success: function () {
            wx.navigateBack({
              delta: 2
            })
           }
         })
       }else if(res.cancel){

       }
     }
   })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // debugger
    console.log(options);
    var act=JSON.parse(options.act);
    // new app.WeToast();
    var that = this;
    that.setData({
      stampAuditId: act.stampAuditId,
      taskId: act.taskId,
      taskName: act.taskName,
      taskDefKey: act.taskDefKey,
      procInsId: act.procInsId,
      procDefId: act.procDefId,
      flag: act.flag,
      userId: act.userId,
      id: act.id,
      delFlag: act.delFlag,
      endFlag: act.endFlag
    });
    
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