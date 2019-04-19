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
    size:'',

  },
  bind_agree: function () {
    new app.WeToast();
    var that = this;
    that.setData({
      flag: 'true'
    });
    // debugger
    var stampAuditId = that.data.StampAudit.stampAuditId;
    var taskId = that.data.taskId;
    var taskName = that.data.taskName;
    var taskDefKey = that.data.taskDefKey;
    var procInsId = that.data.procInsId;
    var procDefId = that.data.procDefId;
    var flag = that.data.flag;
    var userId = that.data.StampAudit.userId;
    var id = that.data.StampAudit.id;
    var delFlag = that.data.delFlag;
    var endFlag = that.data.endFlag;
    var loginId = wx.getStorageSync('loginId')
     wx.showModal({
       title: '用印申请',
       content: '是否同意申请',
       showCancel:true,
       confirmColor:'#5ab9ff',
       cancelColor:'#D8D8D8',
       success:function(res){
         if(res.confirm){
           wx.request({
             method: 'POST',
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
               loginId:loginId,
             },
             header: {
               "content-type": "application/x-www-form-urlencoded"
             },
             url: app.globalData.baseUrl + 'StampInterface/complete.if',
             success: function (res) {
               console.log(res);
             }
           })
           wx.redirectTo({

             url: '../../approval/approval',

           })
         }else if(res.cancel){
           
         }
       }
     })
  },
  bind_rebut: function () {
    new app.WeToast();
    var that = this;
    that.setData({
      flag: 'false'
    });
    // debugger
    var stampAuditId = that.data.StampAudit.stampAuditId;
    var taskId = that.data.taskId;
    var taskName = that.data.taskName;
    var taskDefKey = that.data.taskDefKey;
    var procInsId = that.data.procInsId;
    var procDefId = that.data.procDefId;
    var flag = that.data.flag;
    var userId = that.data.StampAudit.userId;
    var id = that.data.StampAudit.id;
    var delFlag = that.data.delFlag;
    var endFlag = that.data.endFlag;
    var act={
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
      endFlag: endFlag
    }
    var act=JSON.stringify(act);
    wx.navigateTo({
      url: '../stampRebut/stampRebut?act='+act,
    })
  },
  bind_endFlow:function(){
    new app.WeToast();
    var that = this;
    that.setData({
      flag: 'false',
      endFlag:'true'
    });
    // debugger
    var stampAuditId = that.data.StampAudit.stampAuditId;
    var taskId = that.data.taskId;
    var taskName = that.data.taskName;
    var taskDefKey = that.data.taskDefKey;
    var procInsId = that.data.procInsId;
    var procDefId = that.data.procDefId;
    var flag = that.data.flag;
    var userId = that.data.StampAudit.userId;
    var id = that.data.StampAudit.id;
    var delFlag = that.data.delFlag;
    var endFlag = that.data.endFlag;
    var loginId=wx.getStorageSync('loginId')
    wx.showModal({
      title:'用印申请',
      content:'是否结束当前任务',
      showCancel:true,
      confirmColor:'#5ab9ff',
      cancelColor:'#D8D8D8',
      success:function(res){
       if(res.confirm){
         wx.request({
           method: 'POST',
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
             loginId: loginId
           },
           header: {
             "content-type": "application/x-www-form-urlencoded"
           },
           url: app.globalData.baseUrl + 'StampInterface/complete.if',
           success: function (res) {
             wx.redirectTo({
               url: '../../approval/approval',
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
    new app.WeToast();
    var that = this;
    var loginId = wx.getStorageSync('loginId');
    // debugger
    console.log(options);
     // debugger
     wx.request({
       url: app.globalData.baseUrl + 'StampInterface/viewAudit.if',
       header: {
         "content-type": "application/x-www-form-urlencoded"
       },
       method: 'POST',
       data: {
         userId: loginId,
         // appId: 'ac-dgt-stamp-workflow'
         // taskId:'782510'
         taskId: options.taskId
       },

       success: function (res) {
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
            image:'../../../image/sorry.png'
          })
          setTimeout(function () { wx.hideLoading() }, 2000),
          setTimeout(function () {
              wx.redirectTo({
                url: '../../approval/approval',
              })},2000)
         
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