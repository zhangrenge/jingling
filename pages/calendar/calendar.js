var util = require('../../utils/util.js')
var d = require('date.js')
var CN_Date = require('getCNDate.js');
var utilHttpRequest = require('../../utils/request.js');

var app = getApp()
var t = new Date();

Page({
  data: {
    monthNum: t.getMonth() + 1,
    yearNum: t.getFullYear(),
    MonthDayArray: [],
    toDate: t.getDate(),
    toMonth: t.getMonth() + 1,
    toYear: t.getFullYear(),
    fromToday: '今天',
    nongliDetail: CN_Date(t.getFullYear(), t.getMonth() + 1, t.getDate()),
    spreadStyle1: '',
    spreadText1: '',
    spreadImage1: '',
    level: ""
  },
  spread1: function(e) {
    if (this.data.spreadText1 == "展开") {
      this.setData({
        spreadStyle1: 'view-show',
        spreadText1: '收起',
        spreadImage1: '../../image/retract.png'
      })
    } else if (this.data.spreadText1 == "收起") {
      this.setData({
        spreadStyle1: 'view-hide',
        spreadText1: '展开',
        spreadImage1: '../../image/spread.png'
      })
    }
  },
  onShow: function() {
    console.log('onShow');
    this.calcMonthDayArray();
  },

  help: function(e) {
    wx.navigateTo({
      url: '../help/help'
    })
  },
  record: function (e) {
    wx.navigateTo({
      url: '../record/record'
    })
  },
  dateClick: function(e) {
    console.log(e)
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
    var strUrl = "signForMobile/userDaySignInfo.if"
    var loginId = wx.getStorageSync("loginId")
    var signDate = currentDate;

    var key = ["loginId", "signDate"]
    var value = [loginId, signDate]

    utilHttpRequest.httpRequest(strUrl, key, value,
      function(res) {
        var signObject = res.data.res;

        if (signObject != null) {
          that.data.signAddr = (signObject.signAddr == null) ? '无' : signObject.signAddr
          that.data.xbSignAddr = (signObject.xbSignAddr == null) ? '无' : signObject.xbSignAddr
          that.data.signStateM = (signObject.signStateM == 1) ? '正常签到' : '异常签到'
          that.data.signStateA = (signObject.signStateA == 1) ? '正常签到' : '异常签到'
          that.data.startWorkTime = (signObject.startWorkTime == null || signObject.startWorkTime == '') ? '' : signObject.startWorkTime
          that.data.endWorkTime = (signObject.endWorkTime == null || signObject.endWorkTime == '') ? '' : signObject.endWorkTime

        } else {
          that.data.signAddr = '无';
          that.data.xbSignAddr = '无';
          that.data.signStateM = '';
          that.data.signStateA = '';
          that.data.startWorkTime = '';
          that.data.endWorkTime = '';
        }

        that.setData(that.data);


      },
      function(res) {

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

  calcMonthDayArray: function() {
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

    this.setData({
      MonthDayArray: dateArray,
      toYear: notToday ? this.data.yearNum : t.getFullYear(),
      toMonth: notToday ? this.data.monthNum : t.getMonth() + 1,
      toDate: notToday ? 1 : t.getDate(),
      fromToday: notToday ? d.getFromTodayDays(1, data.monthNum - 1, data.yearNum) : '今天',
      nongliDetail: notToday ? CN_Date(data.yearNum, data.monthNum, 1) : CN_Date(t.getFullYear(), t.getMonth() + 1, t.getDate()),
    })
  },

  //  点击日期组件确定事件  
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })

  },

  onLoad(options) {
    this.setData({
      // level: wx.getStorageSync('level')
      level: 20
    })
    this.setData({
      spreadStyle1: 'view-hide',
      spreadText1: '展开',
      spreadImage1: '../../image/spread.png',

    })

    var that = this;

    var loginId = wx.getStorageSync("loginId")
    var signDate = util.formatDate()

    //月统计
    var strUrlMonth = "signForMobile/userMonthSignInfo.if"
    var keyMonth = ["loginId", "signDate"]
    var valueMonth = [loginId, signDate]

    utilHttpRequest.httpRequest(strUrlMonth, keyMonth, valueMonth,
      function(res) {

        var signObject = res.data.res[0];

        if (signObject != null) {
          that.data.chidao = signObject.cd;
          that.data.zaotui = signObject.zt;
          that.data.chuqin = signObject.cq;
          that.data.kuanggong = signObject.kg;
          that.data.queka = signObject.qk;
          that.data.zhengchang = signObject.zc;
          that.data.qingjia = signObject.qj;

        } else {
          that.data.chidao = '0';
          that.data.zaotui = '0';
          that.data.chuqin = '0';
          that.data.kuanggong = '0';
          that.data.zhengchang = '0';
          that.data.queka = '0';
          that.data.qingjia = '0';


        }

        that.setData(that.data);

      },
      function(res) {

      })


    //日统计
    var strUrl = "signForMobile/userDaySignInfo.if"
    var key = ["loginId", "signDate"]
    var value = [loginId, signDate]

    utilHttpRequest.httpRequest(strUrl, key, value,
      function(res) {
        var signObject = res.data.res;
        if (signObject != null) {
          that.data.signAddr = (signObject.signAddr == null) ? '无' : signObject.signAddr
          that.data.xbSignAddr = (signObject.xbSignAddr == null) ? '无' : signObject.xbSignAddr
          that.data.signStateM = (signObject.signStateM == 1) ? '正常签到' : '异常签到'
          that.data.signStateA = (signObject.signStateA == 1) ? '正常签到' : '异常签到'
          that.data.startWorkTime = (signObject.startWorkTime == null || signObject.startWorkTime == '') ? '' : signObject.startWorkTime
          that.data.endWorkTime = (signObject.endWorkTime == null || signObject.endWorkTime == '') ? '' : signObject.endWorkTime

        } else {
          that.data.signAddr = '无';
          that.data.xbSignAddr = '无';
          that.data.signStateM = '';
          that.data.signStateA = '';
          that.data.startWorkTime = '';
          that.data.endWorkTime = '';
        }


        that.setData(that.data);

      },
      function(res) {

      })


  }

})