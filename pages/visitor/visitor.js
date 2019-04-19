const app = getApp();
var sliderWidth = 110; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    tabs: ["访客邀请", "访客签到"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    name: "",
    mobile: "",
    email: "",
    desc: "",
    date: "",
    time: "10:00",
    mptoken: "",
    level: "",
    loginId: "",
    code: "",
    pageonLoad: false
  },
  onLoad: function() {
    var that = this;
    // wx.getSystemInfo({
    //   success: function (res) {
    //     that.setData({
    //       sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
    //       sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
    //     });
    //   }
    // });
    // that.getUid();
    that.setData({
      level: wx.getStorageSync('level')
    })
    that.setData({
      mptoken: wx.getStorageSync('mptoken')
    })
    that.setData({
      date: that.GetDateStr(1)
    })
    that.setData({
      loginId: wx.getStorageSync('loginId')
    })
   
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
  getUid() {
    var url = app.globalData.baseURL + '/visit/visitor/uid.json';
    wx.request({
      url: url,
      data: {
        "mobile": "17600666577"
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)

      },
      fail() {

      }
    })
  },
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  inputName: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  inputMobile: function(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  inputEmail: function(e) {
    this.setData({
      email: e.detail.value
    })
  },
  inputDesc: function(e) {
    this.setData({
      desc: e.detail.value
    })
  },
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },
  visitorCode: function(e) {
    this.setData({
      code: e.detail.value
    })
  },
  submit: function() {
    var that = this;
    console.log("level", that.data.mptoken)
    console.log(that.data.name, that.data.mobile, that.data.email, that.data.desc, that.data.date, that.data.time)
   
    if (that.data.name == "" || that.data.mobile == "" || that.data.email == "" || that.data.desc == "" || that.data.date == "" || that.data.time == "") {
      wx.showToast({
        title: '信息不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    var mobileReg = /^1[3456789]\d{9}$/;
    var emailReg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    if (!mobileReg.test(that.data.mobile)) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!emailReg.test(that.data.email)) {
      wx.showToast({
        title: '邮箱格式错误',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    
    var startTime = (that.data.date + " " + that.data.time).replace(/-/g, "/");
     console.log("会议时间", that.data.date + " " + that.data.time,new Date(startTime).getTime() < new Date().getTime())
    if (new Date(startTime).getTime() < new Date().getTime()){
      wx.showToast({
        title: '请重新选择时间',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    var start = parseInt(new Date(startTime).getTime() / 1000);
    var url = app.globalData.baseURL + '/visit/invitor/visit.json';

    console.log("所有参数",{
      "cn_id": "",
      "start": start,
      "end": "",
      "company": "",
      "title": that.data.desc,
      "name": that.data.name,
      "mobile": that.data.mobile,
      "visitor_id": that.data.loginId,
      "invite_id": "invite_id",
      "email": that.data.email,
      "_mptoken": that.data.mptoken
    })
    wx.request({
      method: 'POST',
      url: url,
      data: {
        "start": start,
        "title": that.data.desc,
        "name": that.data.name,
        "mobile": that.data.mobile,
        "invite_id": that.data.loginId,
        "email": that.data.email,
        "_mptoken": that.data.mptoken
      },
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
            duration: 3000
          })
        } else {
          wx.showToast({
            title: '提交失败',
            icon: 'none',
            duration: 3000
          })
        }
      },
      fail() {
        wx.showToast({
          title: '提交失败',
          icon: 'none',
          duration: 3000
        })
      }
    })


  },
  scanCode() {
    var that = this;
    console.log("扫一扫")
    wx.scanCode({
      success(res) {
        console.log(res)
        // { result: "https://translate.google.cn", charSet: "UTF-8", errMsg: "scanCode:ok", scanType: "QR_CODE", rawData: "aHR0cHM6Ly90cmFuc2xhdGUuZ29vZ2xlLmNu" }
        if (res.result != "") {
          that.setData({
            code: res.result
          })
          console.log(res.result, that.data.code)
          that.check();
        } else {
          wx.showToast({
            title: '参数为空',
            icon: 'none',
            duration: 3000
          })
        }
      },
      fail() {
        wx.showToast({
          title: '扫码失败',
          icon: 'none',
          duration: 3000
        })

      }
    })
  },
  check() {
    var that = this;
    var url = app.globalData.baseURL + '/visit/visitor/code.json';
    wx.request({
      url: url,
      data: {
        "code": that.data.code,
        "_mptoken": that.data.mptoken
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        var data = res.data;
        if (data.code == 1) {
          wx.showToast({
            title: '签到成功',
            icon: 'success',
            duration: 3000
          })
        } else if (data.code == 1388) {
          if (data.data[1] == "not_started") {
            wx.showToast({
              title: '未到会议日期',
              icon: 'none',
              duration: 3000
            })
          } else if (data.data[1] == "used") {
            wx.showToast({
              title: '邀请码已被使用',
              icon: 'none',
              duration: 3000
            })
          } else if (data.data[1] == "expired") {
            wx.showToast({
              title: '邀请码已过期',
              icon: 'none',
              duration: 3000
            })
          } else {
            wx.showToast({
              title: '邀请码错误',
              icon: 'none',
              duration: 3000
            })
          }

        } else if (data.code == 1112) {
          wx.showToast({
            title: '邀请码格式错误',
            icon: 'none',
            duration: 3000
          })
        } else {
          wx.showToast({
            title: '签到失败',
            icon: 'none',
            duration: 3000
          })
        }
      },
      fail() {
        wx.showToast({
          title: '提交失败',
          icon: 'none',
          duration: 3000
        })
      }
    })
  }
});