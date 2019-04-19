var util = require('../../utils/util.js')
var d = require('date.js')
var CN_Date = require('getCNDate.js');
var utilHttpRequest = require('../../utils/request.js');

var app = getApp()
var t = new Date();

Page({
  data: {
    addCancelTxt:"添加日程",
    clientHeight: 500,
    hideBottom: false,
    loadmoretxt: '正在加载...',
    refresh: true,
    curoffset: 0,
    hasdata: 0,
    title: "",
    place: "",
    startDate: "",
    startTime: "10:00",
    endDate: "",
    endTime: "11:00",
    repeatCountries: ["永不", "每天", "每周", "每月"],
    repeatIndex: 0,
    remindCountries: ["无", "日程开始时", "5分钟前", "15分钟前", "30分钟前", "1小时前", "2小时前", "1天前", "2天前", "1周前"],
    remindTime: ["1", "0", "300", "900", "1800", "3600", "7200", "86400", "172800", "604800"],
    remindIndex: 0,
    remarks: "",
    editId:"",
    mptoken: "",
    loginId: "",
    monthNum: t.getMonth() + 1,
    yearNum: t.getFullYear(),
    MonthDayArray: [],
    toDate: t.getDate(),
    toMonth: t.getMonth() + 1,
    toYear: t.getFullYear(),
    fromToday: '今天',
    nongliDetail: CN_Date(t.getFullYear(), t.getMonth() + 1, t.getDate()),
    nocancel: true,
    hiddenmodalput: true,
    scheduleListshow: true,
    scheduleList: [],
    currentMonthArr: [],
    currentArr: [],
    formId:""
  },
  formSubmit:function(e){
    this.setData({
      formId: e.detail.formId
    })
    console.log(" e.detail.formId", e.detail.formId)
  },
  // 主题
  inputTitle: function(e) {
    this.setData({
      title: e.detail.value
    })
  },
  // 地点
  inputPlace: function(e) {
    this.setData({
      place: e.detail.value
    })
  },
  // 开始日期
  bindStartDateChange: function(e) {
    this.setData({
      startDate: e.detail.value
    })
  },
  // 开始时间
  bindStartTimeChange: function(e) {
    this.setData({
      startTime: e.detail.value
    })
  },
  // 结束日期
  bindEndDateChange: function(e) {
    this.setData({
      endDate: e.detail.value
    })
  },
  // 结束时间
  bindEndTimeChange: function(e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  // 重复
  bindRepeatChange: function(e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);

    this.setData({
      repeatIndex: e.detail.value
    })
  },
  // 提醒
  bindRemindChange: function(e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);

    this.setData({
      remindIndex: e.detail.value
    })
  },
  // 备注
  inputRemarks: function(e) {
    this.setData({
      remarks: e.detail.value
    })
  },
  onShow: function() {
    console.log('onShow');
   
  },
  // 添加行程
  addSchedule: function() {
    var that=this;
    this.setData({
      hiddenmodalput: false,
      addCancelTxt:"添加日程",
      title: "",
      place: "",
      startDate: that.GetDateStr(1),
      startTime: "10:00",
      endDate: that.GetDateStr(1),
      endTime: "11:00",
      remarks: "",
      remindIndex:0,
      editId:""
    })

  },
  // 取消
  addCancel: function() {
    this.setData({
      hiddenmodalput: true,
      scheduleListshow:true
    });
  },
  // 确定   增加日程
  addConfirm: function() {
    var that=this;
    var data = this.data;
    var start = (data.startDate + " " + data.startTime).replace(/-/g, "/");
    start = parseInt(new Date(start).getTime() / 1000);
    var end = (data.endDate + " " + data.endTime).replace(/-/g, "/");
    end = parseInt(new Date(end).getTime() / 1000);
    if (data.title == "") {
      wx.showToast({
        title: '请输入主题',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (data.place == "") {
      wx.showToast({
        title: '请输入地点',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (start > end) {
      wx.showToast({
        title: '结束时间不能小于开始时间',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    var remindTime = "";
    if (data.remindIndex == 0) {
      remindTime = "";
    } else {
      remindTime = start - data.remindTime[data.remindIndex];
    }
    console.log(data.startDate, data.startTime, data.endDate, data.endTime, data.remindCountries[data.remindIndex], data.remindTime[data.remindIndex], remindTime, start, end)
    var parame = {
      "start_time": start,
      "end_time": end,
      "title": data.title,
      "place": data.place,
      "invitee_mobile": data.loginId,
      "remark": data.remarks,
      "_mptoken": data.mptoken
    };
    var type='POST';
    if (data.editId){
      parame.id=data.editId;
      type='PUT';
    }else{
      delete parame.id;
    }
    if (remindTime != "") {
      parame.alert_time = remindTime;
    }
    setTimeout(function(){
      parame.form_id = that.data.formId;
      wx.request({
        method: type,
        url: app.globalData.baseURL + "/cal/user/event.json",
        data: parame,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data)
          var data = res.data;
          if (data.code == 1) {
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 1000
            })
            that.setData({
              curoffset: 0,
              scheduleList: []
            })
            that.getSchedule();
          } else {
            wx.showToast({
              title: '提交失败',
              icon: 'none',
              duration: 1000
            })
          }
        },
        fail() {
          wx.showToast({
            title: '提交失败',
            icon: 'none',
            duration: 1000
          })
        }
      })
    },500)
    
  },
  //获取日程
  getSchedule: function(a) {
    var that = this;
    var scheduleList = that.data.scheduleList;
    var o = this.data.curoffset;
    wx.request({
      method: 'GET',
      url: app.globalData.baseURL + "/cal/user/event.json",
      data: {
        "offset": o,
        "limit": 20,
        "_mptoken": that.data.mptoken
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        let dataModel = res.data;
        if (dataModel.code == 211) {
          wx.showModal({
            title: '提示',
            content: '登录过期,请重新登录',
            showCancel: false,
            success: (res) => {
             
            }
          })
          return;
        }
        if (dataModel.code == 1 && dataModel.data[0]) {
          dataModel.data[0].map(function(item, index) {
            dataModel.data[0][index].startTime = that.getStartDate(item.start_time * 1000);
            dataModel.data[0][index].endTime = that.getStartDate(item.end_time * 1000);
            if (!item.alert_time || item.alert_time == "" || item.alert_time==0){
              dataModel.data[0][index].alert = that.data.remindCountries[0];
            }else{
              that.data.remindTime.map(function(a,b){
                if (a == (item.start_time-item.alert_time)){
                  dataModel.data[0][index].alert = that.data.remindCountries[b];
                }
              })
            }
          })
          o += 20;
          scheduleList = that.bubbleSort(scheduleList.concat(dataModel.data[0]));
          that.setData({
            scheduleList: scheduleList,
            curoffset: o,
            hasdata: dataModel.data[0].length,
          })
          console.log("获取行程", that.data.scheduleList)
          if (dataModel.data[0].length < 20) {
            that.setData({
              hideBottom: true,
              loadmoretxt: '',
              refresh: true
            })
          } else {
            that.setData({
              hideBottom: false,
              loadmoretxt: '加载更多...',
              refresh: true
            })
          }
        } else {
          that.setData({
            hideBottom: true,
            loadmoretxt: '暂无数据...',
            refresh: true
          })
        }

      },
      fail() {
        this.setData({
          hideBottom: true,
          loadmoretxt: '网络错误，请重新尝试，点击重新加载',
          refresh: false
        })
      },
      complete(){
        that.calcMonthDayArray(a);
      }
    })
  },
  //获取指定日期日程
  getStartTimeSchedule: function (year, month, dateArr) {
    var that = this;
    var start = year+"/"+month+"/"+1;
    var end = year + "/" + month + "/";
    var startTime = parseInt(new Date(start).getTime()/1000);
    var endTime="";
    if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12){
      end+=31;
    }else if(month==2){
      if (year%4==0){
        end += 29;
      }else{
        end += 28;
      }
    }else{
      end += 30;
    }
    endTime = parseInt(new Date(end).getTime() / 1000)+86400;
    console.log(start,end)
    // var currentArr = that.data.currentArr;currentMonthArr
    wx.request({
      method: 'GET',
      url: app.globalData.baseURL + "/cal/user/event_by_start_time.json",
      data: {
        "offset": 0,
        "limit": 999,
        "start": startTime,
        "end": endTime,
        "_mptoken": that.data.mptoken
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        var dataModel = res.data;
        if (dataModel.code == 1 && dataModel.data) {
          dataModel.data.map(function (item, index) {
            dataModel.data[index].startTime = that.getStartDate(item.start_time * 1000);
            dataModel.data[index].endTime = that.getStartDate(item.end_time * 1000);
            if (!item.alert_time || item.alert_time == "" || item.alert_time == 0) {
              dataModel.data[index].alert = that.data.remindCountries[0];
            } else {
              that.data.remindTime.map(function (a, b) {
                if (a == (item.start_time - item.alert_time)) {
                  dataModel.data[index].alert = that.data.remindCountries[b];
                }
              })
            }
          })
         
          that.setData({
            currentMonthArr: that.bubbleSort(dataModel.data)
          })
          // 获取有行程的日期
          var dateArray = dateArr;
          var current = [];
          that.data.currentMonthArr.map(function (item) {
            var dd = new Date(item.start_time * 1000);
            var y = dd.getFullYear();
            var m = dd.getMonth() + 1; //获取当前月份的日期
            var d = dd.getDate();
            if (y == that.data.yearNum && m == that.data.monthNum) {
              dateArray.map(function (key, index) {
                // console.log("key index", key,index)
                key.map(function (date, i) {
                  if (date.num != "" && d == date.num && !date.isToday) {
                    dateArray[index][i].isSchedule = true;
                    // console.log(dateArray[index])
                  }
                })
              })

              if (y == that.data.yearNum && m == that.data.monthNum && d == that.data.toDate) {
                current.push(item);
              }
            }

          })
          that.setData({
            currentArr: current,
            MonthDayArray: dateArray,
          })
        }
      },
      fail() {

      }
    })
  },
  // 加载更多
  loadmore(e) {
    if (this.data.hasdata < 20) {
      this.setData({
        hideBottom: true,
        loadmoretxt: '',
        refresh: true
      })
      return;
    }
    this.setData({
      hideBottom: false,
      loadmoretxt: '加载更多...',
      refresh: true
    })
    this.getSchedule("more")
  },
  //删除行程
  delSchedule: function(e) {
    var that=this;
    wx.showModal({
      title: '取消行程',
      content: '确定要取消行程？',
      confirmText: "确定",
      cancelText: "取消",
      success: function(res) {
        console.log(res, e.currentTarget.dataset.id);
        if (res.confirm) {
          var id = e.currentTarget.dataset.id;
          console.log('用户点击主确定')
          wx.request({
            method: 'DELETE',
            url: app.globalData.baseURL + "/cal/user/event.json",
            data: {
              "id":id,
              "_mptoken": that.data.mptoken
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res.data)
              if (res.data.code==1){
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1000
                })
                var scheduleList = that.data.scheduleList;
                var currentMonthArr = that.data.currentMonthArr;
                var currentArr = that.data.currentArr;
                scheduleList.map(function(item,index){
                  if(item.id==id){
                    scheduleList.splice(index, 1);
                  }
                })
                currentMonthArr.map(function (item, index) {
                  if (item.id == id) {
                    currentMonthArr.splice(index, 1);
                  }
                })
                currentArr.map(function (item, index) {
                  if (item.id == id) {
                    currentArr.splice(index, 1);
                  }
                })
                that.setData({
                  scheduleList: scheduleList,
                  currentMonthArr: currentMonthArr,
                  currentArr: currentArr
                })
              }else{
                wx.showToast({
                  title: '删除失败',
                  icon: 'none',
                  duration: 1000
                })
              }

            },
            fail() {
              wx.showToast({
                title: '删除失败',
                icon: 'none',
                duration: 1000
              })
            }
          })
        } else {
          console.log('用户点击取消')
        }
      }
    });
  },
  //编辑行程
  editSchedule: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var scheduleList = that.data.scheduleList;
    var editData="";
    scheduleList.map(function (item, index) {
      if (item.id == id) {
        editData = scheduleList[index];
      }
    })
    
    if (!editData.alert_time || editData.alert_time == 0 || editData.alert_time==""){
      that.setData({
        remindIndex: 0
      })
    }else{
      that.data.remindTime.map(function(item,index){
        
        if (item == (editData.start_time-editData.alert_time)){
          that.setData({
            remindIndex: index
          })
        }
      })
    }
    var start = editData.startTime.split(" ");
    var end=editData.endTime.split(" ");
    that.setData({
      scheduleListshow: true,
      hiddenmodalput:false,
      addCancelTxt:"编辑日程",
      title: editData.title,
      place: editData.place,
      startDate: start[0],
      startTime: start[1],
      endDate: end[0],
      endTime: end[1],
      remarks: editData.remark,
      editId: e.currentTarget.dataset.id
    });

    console.log(editData.title, editData.place, start[0], start[1], end[0], end[1], that.data.remindIndex,that.data.remindCountries[that.data.remindIndex],editData.remark)
    
  },
  // 查看行程
  lookList: function() {
    this.setData({
      scheduleListshow: false
    })
  },
  //关闭
  lookConfirm: function() {
    this.setData({
      scheduleListshow: true
    });
  },

  dateClick: function(e) {
    var that = this;
    var eId = e.currentTarget.id;
    var MonArray = this.data.MonthDayArray;
    var data = this.data;
    if (eId == "") return;
    //点击效果 ，且只能选中一个日期
    //FIX 这个遍历算法可以改进
    for (var i = 0; i < MonArray.length; i++) {
      for (var j = 0; j < MonArray[i].length; j++) {
        if (typeof(MonArray[i][j]) == 'string') {
          continue;
        }
        if (MonArray[i][j].num == eId) {
          MonArray[i][j].isShowDayInfo = !MonArray[i][j].isShowDayInfo;
        }
      }
    }

    for (var i = 0; i < MonArray.length; i++) {
      for (var j = 0; j < MonArray[i].length; j++) {
        if (typeof(MonArray[i][j]) == 'string' || MonArray[i][j].num == eId) {
          continue;
        }
        MonArray[i][j].isShowDayInfo = false;
      }
    }
    this.setData({
      MonthDayArray: MonArray,
      toYear: data.yearNum,
      toMonth: data.monthNum,
      toDate: eId,
      fromToday: d.getFromTodayDays(eId, data.monthNum - 1, data.yearNum),
      nongliDetail: CN_Date(data.yearNum, data.monthNum, eId),
    })

    var day = (this.data.toDate > 9) ? this.data.toDate : "0" + this.data.toDate
    var month = (this.data.toMonth > 9) ? this.data.toMonth : "0" + this.data.toMonth

    var currentDate = this.data.toYear + "-" + month + "-" + day


    var that = this;
    var loginId = wx.getStorageSync("loginId")
    var signDate = currentDate;

    var key = ["loginId", "signDate"]
    var value = [loginId, signDate]

    var current = [];
    // 获取有行程的日期
    var clickTime = signDate.split("-");
    this.data.currentMonthArr.map(function(item) {
      var dd = new Date(item.start_time * 1000);
      var y = dd.getFullYear();
      var m = dd.getMonth() + 1;
      var d = dd.getDate();
      if (y == clickTime[0] && m == clickTime[1] && d == clickTime[2]) {
        current.push(item);
      }
    })
    that.setData({
      currentArr: current
    })
  },

  monthTouch: function(e) {
    var beginX = e.target.offsetLeft;
    var endX = e.changedTouches[0].clientX;
    if (beginX - endX > 125) {
      this.nextMonth_Fn();
    } else if (beginX - endX < -125) {
      this.lastMonth_Fn();
    }
  },

  nextMonth_Fn: function() {
    var n = this.data.monthNum;
    var y = this.data.yearNum;
    if (n == 12) {
      this.setData({
        monthNum: 1,
        yearNum: y + 1,
      });
    } else {
      this.setData({
        monthNum: n + 1,
      });
    }
    this.calcMonthDayArray();
  },

  lastMonth_Fn: function() {
    var n = this.data.monthNum;
    var y = this.data.yearNum;
    if (n == 1) {
      this.setData({
        monthNum: 12,
        yearNum: y - 1,
      });
    } else {
      this.setData({
        monthNum: n - 1,
      });
    }
    this.calcMonthDayArray();
  },

  calcMonthDayArray: function(a) {
    var that = this;
   
    var data = this.data;
    var dateArray = d.paintCalendarArray(data.monthNum, data.yearNum);
    //如果不是当年当月，自动选中1号
    var notToday = (data.monthNum != t.getMonth() + 1 || data.yearNum != t.getFullYear());
    if (notToday) {
      for (var i = 0; i < dateArray[0].length; i++) {
        if (dateArray[0][i].num == 1) {
          dateArray[0][i].isShowDayInfo = true;
        }
      }
    }
   
    if(a!="more"){
      that.getStartTimeSchedule(data.yearNum, data.monthNum, dateArray);
    }
    this.setData({
      toYear: notToday ? this.data.yearNum : t.getFullYear(),
      toMonth: notToday ? this.data.monthNum : t.getMonth() + 1,
      toDate: notToday ? 1 : t.getDate(),
      fromToday: notToday ? d.getFromTodayDays(1, data.monthNum - 1, data.yearNum) : '今天',
      nongliDetail: notToday ? CN_Date(data.yearNum, data.monthNum, 1) : CN_Date(t.getFullYear(), t.getMonth() + 1, t.getDate()),
    })


  },
  onLoad(options) {

    var that = this;
    wx.showLoading({
      title: '加载中...',
    })

    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          clientHeight: res.windowHeight - 160
        });
      }
    });
    that.setData({
      mptoken: wx.getStorageSync('mptoken'),
      loginId: wx.getStorageSync('loginId'),
      startDate: that.GetDateStr(1),
      endDate: that.GetDateStr(1)
    })
    
    var loginId = wx.getStorageSync("loginId")
    var signDate = util.formatDate()

    //月统计
    var keyMonth = ["loginId", "signDate"]
    var valueMonth = [loginId, signDate]
    //日统计
    var key = ["loginId", "signDate"]
    var value = [loginId, signDate]
    console.log("dateArray", that.data.monthNum, that.data.yearNum)
    //获取全部日程
    that.getSchedule();
  },
  GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1; //获取当前月份的日期
    var d = dd.getDate();
    if (m < 10) {
      m = "0" + m;
    }
    if (d < 10) {
      d = "0" + d;
    }
    return y + "-" + m + "-" + d;
  },
  //冒泡排序
  bubbleSort: function (arr) {
    var len = arr.length, tmp;
    for (var i = 0; i < len - 1; i++) {
      for (var j = 0; j < len - 1 - i; j++) {
        if (arr[j].start_time > arr[j + 1].start_time) {
          tmp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = tmp;
        }
      }
    }
    return arr;
  },
  getStartDate(time) {
    var dd = new Date(time);
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1; //获取当前月份的日期
    var d = dd.getDate();
    var h = dd.getHours();
    var min = dd.getMinutes();
    if (m < 10) {
      m = "0" + m;
    }
    if (d < 10) {
      d = "0" + d;
    }
    if (h < 10) {
      h = "0" + h;
    }
    if (min < 10) {
      min = "0" + min;
    }
    return y + "-" + m + "-" + d + " " + h + ":" + min;
  }

})