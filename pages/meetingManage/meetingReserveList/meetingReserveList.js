const app = getApp();

 var farmatDate=function(date){
  var month = (date.getMonth() + 1);
  if(month <=9){
    month = '0' + month;
  }
  var day =  date.getDate();
  if(day <= 9){
    day = '0' + day;
  }
  var stringTime = date.getFullYear() + "-" + month
    + "-" + day;
  return stringTime;
}
var farmatDateTime = function (date) {
  var stringTime = date.getFullYear() + "/" + (date.getMonth() + 1)
    + "/" + date.getDate() + " " + "00" + ":" + "00" + ":" + "00";
  return stringTime;
}

// 请求数据
var loadMore = function (that, meetingRoomId) {
    wx.request({
        url: app.globalData.baseUrl + "meetingInformation/findMeetingInformationById.if",
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: "POST",
        data: {
          "meetingRoomId": meetingRoomId
        },
        success: function (res) {

          that.setData({
              meetingRoomName: res.data.msg.meetingRoomName,
              platFormId: res.data.msg.platFormId
          })
            
        }
    });
}

/**
 * 当天会议室的预约数据
 * @param  {[type]} that          
 * @param  {[type]} meetingRoomId 会议室ID
 * @param  {[type]} date          日期
 * @param  {[type]} success       成功的回调函数
 * @param  {[type]} fail          失败的回调函数 
 * @param  {[type]} complete      结束的回调函数
 * @return {[type]}               [description]
 */
var meetingReserveByDate = function(that, meetingRoomId, date, success, fail, complete){
    wx.request({
        url: app.globalData.baseUrl + "meetingReserve/queryMeetingReserveByDate.if",
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: "POST",
        data: {
          "meetingroom_id": meetingRoomId,
          "wxDate":date,
          "loginId": wx.getStorageSync('loginId')
        },
        success: function (res) {
          console.log(res);
           success(res);
        },
        fail: function(res) {
            fail(res);
        },
        complete: function(res) {
            complete(res);
        }
    });
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    meetingRoomId: "", // 会议室ID
    meetingRoomName: "", // 会议室名称
    platFormId: "", //平台公司
    meetingReserve: [],
    meetingReserveData : false,
    loginId: wx.getStorageSync('loginId'),
    weeks: ['日','一','二','三','四','五','六'],
    dates: [],
    date: farmatDate(new Date()),
    colorIndex: 0, // 颜色
    scrollHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
        success:function(res){
            that.setData({
               scrollHeight:res.windowHeight - 130
            });
        }
    });
    var dates = [];
    var date = new Date();  
    for (var i = 1; i <= 31; i++) {
      var dateFormat = {week:'',day:'',date:''};
      if(i > 1){
        var stringTime = farmatDateTime(date);
        var millisecond = new Date(stringTime).getTime();
        date = new Date(millisecond + (24 * 60 * 60 * 1000));
      }
     
      var weekStr = date.getDay();
      var day = date.getDate();
      dateFormat.day = day;
      dateFormat.date = farmatDate(date);
      switch (weekStr){
        case 0:
          dateFormat.week='周日';
          break;
        case 1:
          dateFormat.week='周一';
          break;
        case 2:
          dateFormat.week='周二';
          break;
        case 3:
          dateFormat.week='周三';
          break;
        case 4:
          dateFormat.week='周四';
          break;
        case 5:
          dateFormat.week='周五';
          break;
        case 6:
          dateFormat.week='周六';
          break;
      }
      dates.push(dateFormat);
    }
    that.setData({
      meetingRoomId : options.roomId,
      dates: dates
    })
    loadMore(that, options.roomId);
    var meetingReserve = [];
    var startTimeModal = "";
    var endTimeModal = "";
    var meetingNameModal = "";
    var meetingStateModal = false;
    meetingReserveByDate(that, options.roomId, that.data.date, function(res){
      if(res.data.status){
        if(res.data.msg.length == 0){
          that.setData({
            meetingReserveData : false
          })
        }else{
          res.data.msg.forEach(function(e){
            var startTime = e.start_time;
            var endTime = e.end_time;
            if(startTime != null){
                startTime = startTime.substring(5, 16);
            }
            if(endTime != null){
                endTime = endTime.substring(5, 16);
            }
            if(e.meeting_state == '2'){
              startTimeModal = startTime;
              endTimeModal = endTime;
              meetingNameModal = e.meeting_name;
              meetingStateModal = true;
            }
            meetingReserve.push({reserveId:e.reserve_id, meetingName:e.meeting_name, meetingState:e.meeting_state, applyUser:e.apply_user, applyUserName:e.apply_user_name, deptName:e.deptName, startTime:startTime,endTime:endTime});
          })
          that.setData({
            meetingReserve: meetingReserve,
            meetingReserveData : true
          })
          if(meetingStateModal){
            wx.showModal({
              title: '提示',
              content: '当前正在会议中['+meetingNameModal+']('+startTimeModal+' - '+endTimeModal+')',
              showCancel: false
            })
          }
        }
      }
    }, function(res){}, function(res){});
  },
   // 日期选择点击事件
  dateBindtap: function (e) {
    var that = this;
    wx.showToast({
        title: '加载中...',
        icon: 'loading',
        duration: 2000
    });
    var index = e.currentTarget.dataset.id;
    var dateStr= that.data.dates[index].date;
    that.setData({
      date: dateStr,
      colorIndex: index
    });
    var meetingReserve = [];
    var startTimeModal = "";
    var endTimeModal = "";
    var meetingNameModal = "";
    var meetingStateModal = false;
    meetingReserveByDate(that, that.data.meetingRoomId, dateStr, function(res){
      wx.hideToast();
      wx.showToast({
            title: '加载成功',
            icon: 'success',
            duration: 1000
      })
      if(res.data.status){
        if(res.data.msg.length == 0){
          that.setData({
            meetingReserveData : false
          })
        }else{
          res.data.msg.forEach(function(e){
            var startTime = e.start_time;
            var endTime = e.end_time;
            if(startTime != null){
                startTime = startTime.substring(5, 16);
            }
            if(endTime != null){
                endTime = endTime.substring(5, 16);
            }
            if(e.meeting_state == '2'){
              startTimeModal = startTime;
              endTimeModal = endTime;
              meetingNameModal = e.meeting_name;
              meetingStateModal = true;
            }
            meetingReserve.push({reserveId:e.reserve_id, meetingName:e.meeting_name, meetingState:e.meeting_state, applyUser:e.apply_user, applyUserName:e.apply_user_name, deptName:e.deptName, startTime:startTime,endTime:endTime});
          })
          that.setData({
            meetingReserve: meetingReserve,
            meetingReserveData : true
          })
          if(meetingStateModal){
            wx.showModal({
              title: '提示',
              content: '当前正在会议中['+meetingNameModal+']('+startTimeModal+' - '+endTimeModal+')',
              showCancel: false
            })
          }
        }
      }
    }, function(res){}, function(res){});
  },
  // 详情
  meetingReserveClick: function(e){
     wx.navigateTo({
       url: '../meetingDetail/meetingDetail?reserveId=' + e.currentTarget.dataset.id
     })
  },
  // 预定按钮
  reserveClick: function(e){
    var that = this;
    wx.navigateTo({
      url: '../meetingReserve/meetingReserve?meetingRoomId=' + that.data.meetingRoomId + '&platFormId=' + that.data.platFormId
    })
   /** wx.request({
        url: app.globalData.baseUrl + "wxMeetingInterface/checkUserBlack.if",
        data: {
          "loginId": wx.getStorageSync('loginId')
        },
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: "POST",
        success: function(res) {
          if(res.data.status){
            if(res.data.flag == 0){
              wx.showModal({
                title: '提示',
                content: '您本月已有三次预定会议未使用的记录，本月无法再申请预定！',
                showCancel: false
              })
            }else if(res.data.flag == 1){
              wx.navigateTo({
                url: '../meetingReserve/meetingReserve?meetingRoomId=' + that.data.meetingRoomId + '&platFormId=' + that.data.platFormId
              })
            }
          }
        },
        fail: function(res) {},
        complete: function(res) {},
    })**/
    
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  bindUpLoad: function () {
    wx.showNavigationBarLoading(); //在标题栏中显示加载
　　wx.showToast({
      title: '刷新中...',
      icon: 'loading',
      duration: 2000
    });
    var that = this;
    var meetingReserve = [];
    var startTimeModal = "";
    var endTimeModal = "";
    var meetingNameModal = "";
    var meetingStateModal = false;
    meetingReserveByDate(that, that.data.meetingRoomId, that.data.date, function(res){
      wx.hideToast();
      wx.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 1000
      })
      if(res.data.status){
        if(res.data.msg.length == 0){
          that.setData({
            meetingReserveData : false
          })
        }else{
          res.data.msg.forEach(function(e){
            var startTime = e.start_time;
            var endTime = e.end_time;
            if(startTime != null){
                startTime = startTime.substring(5, 16);
            }
            if(endTime != null){
                endTime = endTime.substring(5, 16);
            }
            if(e.meeting_state == '2'){
              startTimeModal = startTime;
              endTimeModal = endTime;
              meetingNameModal = e.meeting_name;
              meetingStateModal = true;
            }
            meetingReserve.push({reserveId:e.reserve_id, meetingName:e.meeting_name, meetingState:e.meeting_state, applyUser:e.apply_user, applyUserName:e.apply_user_name, deptName:e.deptName, startTime:startTime,endTime:endTime});
          })
          that.setData({
            meetingReserve: meetingReserve,
            meetingReserveData : true
          })
          if(meetingStateModal){
            wx.showModal({
              title: '提示',
              content: '当前正在会议中['+meetingNameModal+']('+startTimeModal+' - '+endTimeModal+')',
              showCancel: false
            })
          }
        }
        
      }
    }, function(res){}, function(res){
        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh(); //停止下拉刷新
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})