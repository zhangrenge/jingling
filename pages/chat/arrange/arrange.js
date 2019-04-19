var util = require('../../../utils/util.js');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    submitDisabled: false,
    meetingName: '',
    applyPhone: '',
    applyEmail: '',
    roomId: [],
    roomName: '',
    roomIndex: 0,
    pIds: [],
    showView: true,
    showDate: false,
    chooseDate: [],
    dateStart: util.formatDateMine(new Date()),
    dateEnd: util.formatDateMine(new Date()),
    pickerStart: '',
    pickerEnd: '',
    oldStartTime: '',
    oldEndTIme: '',

    cycleStart: util.formatAfterDate(),
    timeStart: util.formatTimeMine(new Date()),
    timeEnd: util.formatTimeMine(new Date()),
    pickerTimeStart: '',
    pickerTimeEnd: '',
    startDate: util.formatDateMine(new Date()) + " " + util.formatTimeMine(new Date()) + ":00",
    endDate: util.formatDateMine(new Date()) + " " + util.formatTimeMine(new Date()) + ":00",
    aggregate:"",
    chooseParticipant: [
    ],
    choosePhone:[],
    aggregatePhone: "",
    roomSize: '50',
    timezone:""
  },
  
  //主题
  meetingNameInput: function (e) {
    this.setData({
      meetingName: e.detail.value
    })
  },
  //地点
  timezoneInput:function(e){
    this.setData({
      timezone: e.detail.value
    })
  },
  addPhoneBtn:function(e){
    var that = this;
    var lists = this.data.choosePhone;
    var applyPhone = this.data.applyPhone;
    if (applyPhone == "") {
      this.wetoast.toast({
        title: '手机号不能为空！'
      })
      return;
    } else if (!(/^1[34578]\d{9}$/.test(applyPhone))) {

      this.wetoast.toast({
        title: '请输入正确的手机号!'
      })
      return;
    }
    var newData = { applyPhone };
    lists.push(newData);//实质是添加lists数组内容，使for循环多一次
    this.setData({
      choosePhone: lists
    })
    var oldData = that.data.choosePhone;
    var choosePhone = [];
    var aggregatePhone = [];
    oldData.forEach(function (e) {
      choosePhone.push({ applyPhone: e.applyPhone });
      aggregatePhone.push(e.applyPhone)
    })
    that.setData({
      choosePhone: choosePhone,
      applyPhone: '',
      aggregatePhone: aggregatePhone
    })
  },
  deletePhone:function(e){
    var userId = e.currentTarget.dataset.remindid;
    var data = this.data.choosePhone;
    var aggregatePhone = this.data.aggregatePhone;
    aggregatePhone.splice(userId, 1);
    data.splice(userId, 1);
    this.setData({
      choosePhone: data,
      aggregatePhone: aggregatePhone
    })
  },
  //电话
  applyPhoneInput: function (e) {
    var aggregatePhone = [];
    aggregatePhone.push(e.detail.value);
    this.setData({
      applyPhone: e.detail.value,
      aggregatePhone: aggregatePhone
    })
  },
  addBtn: function (e) {
    var that=this;
    var lists = this.data.chooseParticipant;
    var applyEmail = this.data.applyEmail;
    if (applyEmail == "") {
      this.wetoast.toast({
        title: '邮箱不能为空！'
      })
      return;
    } else if (!(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(applyEmail))) {

      this.wetoast.toast({
        title: '请输入正确的邮箱!'
      })
      return;
    }
    var newData = {applyEmail};
    lists.push(newData);//实质是添加lists数组内容，使for循环多一次
    this.setData({
      chooseParticipant: lists
    })
    var oldData = that.data.chooseParticipant;
    var chooseParticipant=[];
    var aggregate=[];
    oldData.forEach(function (e) {
      chooseParticipant.push({ applyEmail: e.applyEmail});
      aggregate.push(e.applyEmail)
    })
    that.setData({
      chooseParticipant: chooseParticipant,
      applyEmail:'',
      aggregate: aggregate
    })
  },
  deleteUser: function (e) {
    var userId = e.currentTarget.dataset.remindid;
    var data = this.data.chooseParticipant;
    var aggregate = this.data.aggregate;
    aggregate.splice(userId, 1);
    data.splice(userId, 1);
    this.setData({
      chooseParticipant: data,
      aggregate: aggregate
    })
  },
  //邮箱
  applyEmailInput: function (e) {
    var aggregate = [];
    aggregate.push(e.detail.value);
    this.setData({
      applyEmail: e.detail.value,
      aggregate: aggregate
    })
  },
  //时区
  roomPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      roomIndex: e.detail.value
    })
  },
  
  bindDateChangeStart: function (e) {
    var dateEnd = this.data.dateEnd;
    this.setData({
      dateStart: e.detail.value.replace(/-/g, "/"),
      dateEnd: e.detail.value.replace(/-/g, "/"),
      startDate: e.detail.value.replace(/-/g, "/") + " " + this.data.timeStart + ":00",
      endDate: e.detail.value.replace(/-/g, "/") + " " + this.data.timeEnd + ":00",
      cycleStart: util.formatDaySumOne(e.detail.value).replace(/-/g, "/"),
      chooseDate: [],
      showView: true
    })
  },
  bindDateChangeEnd: function (e) {
    var dateStart = this.data.dateStart;
    var dateEnd = e.detail.value.replace(/-/g, "/");
    var flag = this.data.showView;
    var dates = this.data.chooseDate;
    var dateFlag = this.data.showDate;
    // var choose =this.data.chooses;
    if (dateStart != dateEnd) {
      flag = false;
      dates = [];
      dateFlag = false;
    } else {
      flag = true;
    }
    this.setData({
      // chooses: choose,
      isPeriodicIndex: 0,
      showDate: dateFlag,
      chooseDate: dates,
      showView: flag,
      dateEnd: e.detail.value.replace(/-/g, "/"),
      endDate: e.detail.value.replace(/-/g, "/") + " " + this.data.timeEnd + ":00",
      cycleStart: util.formatDaySumOne(e.detail.value).replace(/-/g, "/")
    })
  },
  bindTimeChangeStart: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      timeStart: e.detail.value,
      // timeEnd: e.detail.value,
      startDate: this.data.dateStart + " " + e.detail.value + ":00",
      endDate: this.data.dateEnd + " " + e.detail.value + ":00"
    })
  },
  bindTimeChangeEnd: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var days = util.getDays(this.data.startDate, this.data.dateEnd + " " + e.detail.value + ":00");

    this.setData({
      timeEnd: e.detail.value,
      endDate: this.data.dateEnd + " " + e.detail.value + ":00",
      businessDays: days
    })
  },
  bindCycleDateChange: function (e) {
    var date = e.detail.value.replace(/-/g, "/");
    var choseDate = this.data.chooseDate;
    var newArr = [];
    for (var i = 0; i < choseDate.length; i++) {
      newArr.push(choseDate[i].date);
    }
    if (newArr.indexOf(date) == -1) {
      var m = { date: date };
      choseDate.push(m);
    }
    this.setData({
      chooseDate: choseDate
    })


  },
  formatDate: function (dateStr) {
    if (dateStr != undefined) {
      var saveDate = new Date(dateStr);
      return saveDate.getTime();
    }
  },
  arrange:function(){
    var that = this;
    var meetingName = that.data.meetingName,
        applyPhone = that.data.applyPhone,
        applyEmail = that.data.applyEmail,
        timezone = that.data.timezone;
    var start_time = that.data.startDate.replace(/-/g, '/');
    start_time = new Date(start_time).getTime() / 1000;
    var end_time = that.data.endDate.replace(/-/g, '/');
    end_time = new Date(end_time).getTime() / 1000;
    if (timezone == "") {
      this.wetoast.toast({
        title: '会议地点不能为空！'
      })
      return;
    }
    if (meetingName == "") {
      this.wetoast.toast({
        title: '会议主题不能为空！'
      })
      return;
    } else if (meetingName.length > 30) {

      this.wetoast.toast({
        title: '会议主题最多输入30个字符!'
      })
      return;
    }
    if (end_time <= start_time) {
      this.wetoast.toast({
        title: '会议结束时间必须大于会议开始时间！'
      })
      return;
    }
    var roomSize = this.data.roomSize;
    var aggregatePhone = that.data.aggregatePhone;
    if (aggregatePhone.length > roomSize) {
      this.wetoast.toast({
        title: '参会人数大于会议室容纳人数，请调整！'
      })
      return;
    }
    var aggregate = that.data.aggregate;
    if (aggregate.length > roomSize) {
      this.wetoast.toast({
        title: '参会人数大于会议室容纳人数，请调整！'
      })
      return;
    }
    wx.request({
      url: app.globalData.baseURL +'/vconf/user_meeting/meeting.json',
      data: {
        "title": meetingName,
        "invitee_email": aggregate,
        "invitee_mobile": aggregatePhone,
        "end_time": end_time,
        "start_time": start_time,
        "timezone": timezone,
        "mobile": wx.getStorageSync('loginId'),
        "_mptoken": wx.getStorageSync('mptoken'),
      },
      method: "POST",
      header: {
        'Content-Type': 'json'
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == "1") {
          that.wetoast.toast({
            title: '预约会议成功!'
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '../choicePage/choicePage'
            })
          }, 1000);
        }
      },
      fail: function () {
        console.log("接口调用失败");
      }
    })
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