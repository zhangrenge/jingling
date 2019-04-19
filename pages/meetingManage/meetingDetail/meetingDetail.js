// detail.js
const app = getApp();



Page({

  /**
   * 页面的初始数据
   */
  data: {
    meetingroomId: '',
    reserveId: '',
    meetingName: '',
    meetingRoom: '',
    platFormId:'',
    meetingTime: '',
    applyUser: '',
    applyPhone: '',
    meetingUser:'',
    meetingNum:'',
    meetingState: '',
    remark: '',
    stime:'',
    ntime:'',
    state:'',
    operationFlag:'',
    oldStartTime:''
  },
 //取消会议
  bindCancleMeeting:function(e){
    var that = this;
    var reserveId = that.data.reserveId;
    wx.showModal({
      title: '操作提示',
      content: "确定取消当前会议吗",
      cancelText: "取消",
      confirmText: "确定",
      success: function (res) {
        if (res.confirm) {
          if (reserveId != "") {
            wx.request({
              url: app.globalData.baseUrl + 'meetingReserve/updateMeetingState.if',
              header: {
                "content-type": "application/x-www-form-urlencoded"
              },
              method: 'POST',
              data: {
                state: "4",
                reserveId: reserveId
              },
              success: function (res) {
                var data = res.data
               
                var status = data.status;
                if (status == true) {

                  wx.showModal({
                    title: '操作提示',
                    content: "您已成功取消" + that.data.meetingTime + that.data.meetingRoom+"预定的会议",
                    showCancel:false,
                    confirmText: "确定",
                    success: function (res) {
                      if (res.confirm) {
                        that.setData({
                          state: "4",
                          meetingState:"已取消"
                        })
                      } 
                    }
                  })
                }
              }
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //开始会议
  bindStartMeeting: function (e) {
    var that = this;
    var reserveId = that.data.reserveId;
    wx.showModal({
      title: '操作提示',
      content: "确定开始会议吗",
      cancelText: "取消",
      confirmText: "确定",
      success: function (res) {
        if (res.confirm) {
          if (reserveId != "") {
            wx.request({
              url: app.globalData.baseUrl + 'meetingReserve/updateMeetingState.if',
              header: {
                "content-type": "application/x-www-form-urlencoded"
              },
              method: 'POST',
              data: {
                state: "2",
                reserveId: reserveId
              },
              success: function (res) {
                var data = res.data

                var status = data.status;
                if (status == true) {

                  wx.showModal({
                    title: '操作提示',
                    content:"会议已开启！",
                    showCancel: false,
                    confirmText: "确定",
                    success: function (res) {
                      if (res.confirm) {
                       that.setData({
                         state:"2",
                         meetingState: "进行中"
                       })
                      }
                    }
                  })
                }
              }
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  //结束会议
  bindFinishMeeting: function (e) {
    var that = this;
    var reserveId = that.data.reserveId;
    wx.showModal({
      title: '操作提示',
      content: "确定结束会议吗",
      cancelText: "取消",
      confirmText: "确定",
      success: function (res) {
        if (res.confirm) {
          if (reserveId != "") {
            wx.request({
              url: app.globalData.baseUrl + 'meetingReserve/updateMeetingState.if',
              header: {
                "content-type": "application/x-www-form-urlencoded"
              },
              method: 'POST',
              data: {
                state: "3",
                reserveId: reserveId
              },
              success: function (res) {
                var data = res.data

                var status = data.status;
                if (status == true) {

                  wx.showModal({
                    title: '操作提示',
                    content: "会议已结束！",
                    showCancel: false,
                    confirmText: "确定",
                    success: function (res) {
                      if (res.confirm) {
                        that.setData({
                          state: "3",
                          meetingState: "已结束"
                        })
                      }
                    }
                  })
                }
              }
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  updateMeetingReserve:function(e){
    var reserveId = this.data.reserveId;
    var oldStartTime = this.data.oldStartTime;
    var befor5Minute = 5 * 60 * 1000;
    var saveDate = new Date(Date.parse(oldStartTime.replace(/-/g, "/"))).getTime() - befor5Minute;//开始时间前5分钟的时间
     var nowTime = new Date().getTime();
     
     if (nowTime > saveDate){
       this.wetoast.toast({
         title: '会议开始前5分钟不能修改会议！'
       })
     }else{
       wx.navigateTo({
         url: '../meetingReserve/meetingReserve?reserveId=' + reserveId + '&meetingRoomId=' + this.data.meetingroomId + '&platFormId=' + this.data.platFormId
       })
     }

   
   

  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.WeToast();
    var that = this;
   var  reserveId = options.reserveId;
   // reserveId = '41d24c78cb8a4aa6b40271098b775c98';
    wx.request({
      url: app.globalData.baseUrl + 'meetingReserve/queryMeetingReserveInfo.if',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        reserve_id: reserveId
      },
      success: function (res) {
        var data = res.data
        console.log(data)
        var status = data.status;
        if (status == true) {
          var msg = data.msg;
          var reserverUserList = data.reserverUserList;
          var meetingroomId = msg.meetingroom_id;
          var meetingName = msg.meeting_name;
          var meetingRoom = msg.company_name+""+msg.meetingroom_name;
          var platFormId = msg.platform_id;
          var oldStartTime = msg.start_time;
          var startTime = msg.start_time.substring(5, msg.start_time.length);
          var endTime = msg.end_time.substring(5, msg.end_time.length);
          var applyUser =msg.deptName+""+msg.apply_user_name;
          var userId = msg.apply_user;
          var applyPhone = msg.apply_phone;
          var meetingNum = msg.application_num;
          var state = msg.meeting_state;
          var meetingState = "";
          if (state == "1") {
            meetingState = "未开始";
          } else if (state == "2") {
            meetingState = "进行中";
          } else if (state == "3") {
            meetingState = "已结束";
          } else if (state == "4") {
            meetingState = "已取消";
          }
          var remark = msg.remark;
          var users = "";
          for (var i = 0; i < reserverUserList.length;i++){
             users +=reserverUserList[i].userName+"、"
           
          }
          users = users.substring(0,users.length-1)

          var stime = new Date(Date.parse(msg.start_time.replace(/-/g, "/"))).getTime();
          var ntime = new Date().getTime();
          console.log(stime+"--"+ntime)
         var loginId =  wx.getStorageSync('loginId');
         //判断当前人员是否可以操作会议
         var operationFlag = false;
         if(loginId == userId){//代表登录人员操作的是本人的数据
           operationFlag = true;
         }else{
           operationFlag = false;
         }
          that.setData({
            meetingroomId: meetingroomId,
            meetingName: meetingName,
            meetingRoom: meetingRoom,
            platFormId: platFormId,
            applyUser: applyUser,
            applyPhone: applyPhone,
            meetingNum: meetingNum,
            meetingState: meetingState,
            remark: remark,
            meetingTime:startTime+" 至 "+endTime,
            oldStartTime:oldStartTime,
            meetingUser:users,
            stime: stime,
            ntime:ntime,
            state:state,
            operationFlag: operationFlag,
            reserveId:reserveId

          })
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