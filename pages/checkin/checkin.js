const app = getApp()
Page({
  data: {
    nocancel: true,
    listData: [],
    listDatalength: "",
    totalData: [],
    count: "",
    userData: "",
    userName: "",
    detail: true,
    date1: "",
    date2: "",
    modalHeight: "",
    clientHeight: "",
    hideBottom: false,
    loadmoretxt: '正在加载...',
    refresh: true,
    startRow: 0,
    pageNum: 100,
    scrollTop: "",
    modalScrollTop:"",
    status: ["正常", "异常", "迟到", "早退", "未打卡"],
    day: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
    time: ["时", "分"],
    dataLoad:false
  },
  onLoad: function() {
    var that = this;
    that.setData({
      date1: that.GetDateStr(-3),
      date2: that.GetDateStr(-1)
    })
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          clientHeight: res.windowHeight - 62,
          modalHeight: res.windowHeight - 200
        });
      }
    });
    that.getData("ok");
  },
  getData(e) {
    var that = this;
    that.setData({
      dataLoad:true
    })
    var dataObj = {};
    var totalData = [];
    var listData = that.data.listData;
    var startRow = 0;
    var endRow = that.data.pageNum;

    if (e == "ok") {
      listData = [];
      that.setData({
        scrollTop: 0
      })
    } else {
      startRow = that.data.startRow + that.data.pageNum;
      endRow = startRow + that.data.pageNum;
    }
    console.log(" that.data.pageNum getData", that.data.pageNum, startRow, endRow)
    wx.request({
      method: 'POST',
      url: app.globalData.baseUrl + 'restService/selectSignInfo.if',
      data: {
        token: wx.getStorageSync('token').toUpperCase(),
        timestamp: wx.getStorageSync('tokenTime'),
        companyId: wx.getStorageSync('companyId'),
        startSignDate: that.data.date1,
        endSignDate: that.data.date2,
        startRow: startRow,
        endRow: endRow
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res) {
        console.log("aaaaaaaaaaaaaaaaa", res);
        var data = res.data;
        if (data.status && data.count>0) {
          listData = listData.concat(data.data);
          that.setData({
            listData: listData,
            listDatalength: listData.length,
            count: data.count
          })
          if (that.data.listDatalength >= that.data.count && e=="ok") {
            that.setData({
              hideBottom: true,
              loadmoretxt: '',
              refresh: true
            })
          }
          var i = 0;
          listData.map(function(item, index) {
            item.sign_date = item.sign_date.replace(/-/g, "/");
            var daynum = new Date(item.sign_date).getDay();
            item.day = that.data.day[daynum];
            if ((!item.work_time || item.work_time == "") && item.end_work_time != "" && item.start_work_time != ""){
              var fen=parseInt((new Date(item.sign_date + " " + item.end_work_time).getTime() - new Date(item.sign_date + " " + item.start_work_time).getTime())/1000)/60;
              item.duration = parseInt(fen / 60) + that.data.time[0] + (fen % 60) + that.data.time[1];
            } else if (item.sign_state != 0){
              item.duration = parseInt(item.work_time / 60) + that.data.time[0] + (item.work_time % 60) + that.data.time[1];
            }
            if (item.sign_state_m == 1) {
              item.sign_state_m_status = that.data.status[0];
            } else if (item.sign_state_m == 2) {
              item.sign_state_m_status = that.data.status[2];
            } else {
              item.sign_state_m_status = that.data.status[4];
            }
            if (item.sign_state_a == 1) {
              item.sign_state_a_status = that.data.status[0];
            } else if (item.sign_state_a == 2) {
              item.sign_state_a_status = that.data.status[3];
            } else {
              item.sign_state_a_status = that.data.status[4];
            }
            if (dataObj[item.employee_no]) {
              dataObj[item.employee_no].push(item);
            } else {
              dataObj[item.employee_no] = [];
              dataObj[item.employee_no].push(item);
              totalData[i] = {};
              i++;
            }
          })
          console.log("dataObj", dataObj, totalData)

          var n = 0;
          for (var key in dataObj) {
            totalData[n].status = "1";
            totalData[n].data = dataObj[key];
            totalData[n].employee_no = key;
            totalData[n].userName = dataObj[key][0].userName ? dataObj[key][0].userName:"--";
            var len = dataObj[key].length;
            for (var m = 0; m < len; m++) {
              var sign_date = dataObj[key][m].sign_date.replace(/-/g, "/");
              var daynum = new Date(sign_date).getDay();
              if ((dataObj[key][m].sign_state_a != 1 || dataObj[key][m].sign_state_m != 1) && daynum != 0 && daynum!=6) {
                totalData[n].status = "0";
                break;
              }
            }
            n++;
          }
          that.setData({
            totalData: totalData
          })
          console.log("totalData", totalData)
        }else{
          that.setData({
            hideBottom: true,
            loadmoretxt: '暂无数据',
            refresh: true
          })
        }

      },
      fail: function(res) {
        that.setData({
          hideBottom: true,
          loadmoretxt: '网络请求失败，稍后重试',
          refresh: true
        })
      },
      complete: function() {
        that.setData({
          dataLoad: false
        })
      }
    })
  },
  //加载更多
  loadmore() {
    var that = this;
    if (that.data.listDatalength >= that.data.count) {
      that.setData({
        hideBottom: true,
        loadmoretxt: '数据已全部加载',
        refresh: true
      })
    } else {
      that.setData({
        hideBottom: false,
        loadmoretxt: '加载更多...',
      })
      
      if (!that.data.dataLoad){
        this.getData();
      }
      
    }

  },
  startDateChange(e) {
    this.setData({
      date1: e.detail.value
    })
  },
  endDateChange(e) {
    this.setData({
      date2: e.detail.value
    })
  },
  //确定
  okInput() {
    var that = this;
    var newTime = parseInt(new Date().getTime() / 1000);
    var start = that.getTime(that.data.date1);
    var end = that.getTime(that.data.date2);
    console.log(that.data.date1, that.data.date2, start, end, newTime)
    // pageNum

    if (start > end || start > newTime) {
      wx.showToast({
        title: '请重新选择时间',
        icon: 'none',
        duration: 2000
      })
    } else {
      var days = parseInt((end - start) / 86400);
      if (days > 1) {
        that.setData({
          pageNum: 15 * (days + 1) > 100 ? 15 * (days + 1) : 100
        })
      }
      console.log("days", days)
      if (days > 31) {
        wx.showToast({
          title: '最大查询区间为31天',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      this.getData("ok");
    }
  },
  detailCancel() {
    this.setData({
      detail: true
    })
  },
  checkDetail(e) {
    var that = this;
    that.setData({
      userData: that.data.totalData[e.currentTarget.dataset.index].data,
      userName: that.data.totalData[e.currentTarget.dataset.index].userName,
      detail: false,
      modalScrollTop:0
    })
    console.log(that.data.totalData[e.currentTarget.dataset.index])
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
  bubbleSort(arr) {
    var len = arr.length,
      tmp;
    for (var i = 0; i < len - 1; i++) {
      for (var j = 0; j < len - 1 - i; j++) {
        if (arr[j].time > arr[j + 1].time) {
          tmp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = tmp;
        }
      }
    }
    return arr;
  },
  getTime(time) {
    var time = time.replace(/-/g, "/");
    return parseInt(new Date(time).getTime() / 1000)
  }
})