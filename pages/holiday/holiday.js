var util = require('../../utils/util.js');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeStartArea: ['上午', '下午'],
    timeStart: '上午',
    timeStartIndex: 0,
    timeEndArea: ['上午', '下午'],
    timeEnd: '上午',
    timeEndIndex: 0,
    fresh: '',
    tempFiles: [],
    areaIndex: 0,
    dateStart: util.formatDateMine(new Date()),
    dateEnd: util.formatDateMine(new Date()),
    pickerStart: util.formatDateMine(new Date()),
    pickerEnd: '',
    pickerTimeStart: '',
    pickerTimeEnd: '',
    leaveReason: '',
    leaveType: '事假',
    area: ['事假', '病假', '年假', '婚假', '产假', '陪产假', '丧假', '公务外出'],
    department: '',
    companyId: '',
    userName: '',
    remainLeave: '',
    leaveDays: 0,
    workplace: '',
    proclnsld: '',
    loginId: '',
    startDate: util.formatDateMine(new Date()) + " " + util.formatTimeMine(new Date()) + ":00",
    endDate: util.formatDateMine(new Date()) + " " + util.formatTimeMine(new Date()) + ":00"
  },
  bindPickerChangeReason: function (e) {
    this.setData({
      areaIndex: e.detail.value,
      leaveType: this.data.area[e.detail.value]
    })
    console.log(this.data.leaveType)
  },
  bindDateChangeStart: function (e) {
    this.setData({
      dateStart: e.detail.value.replace(/-/g, "/"),
    })
    var days = util.getHolidayDays(this.data.dateStart, this.data.dateEnd, this.data.timeStart, this.data.timeEnd);
    this.setData({
      leaveDays: days
    })
  },
  bindDateChangeEnd: function (e) {
    this.setData({
      dateEnd: e.detail.value.replace(/-/g, "/"),
    })
    var days = util.getHolidayDays(this.data.dateStart, this.data.dateEnd, this.data.timeStart, this.data.timeEnd);
    this.setData({
      leaveDays: days
    })
  },
  bindTimeChangeStart: function (e) {
    this.setData({
      timeStartIndex: e.detail.value,
      timeStart: this.data.timeStartArea[e.detail.value],
    })
    var days = util.getHolidayDays(this.data.dateStart, this.data.dateEnd, this.data.timeStart, this.data.timeEnd);
    this.setData({
      leaveDays: days
    })
  },
  bindTimeChangeEnd: function (e) {
    this.setData({
      timeEndIndex: e.detail.value,
      timeEnd: this.data.timeEndArea[e.detail.value],
    })
    console.log(this.data.timeEnd);
    var days = util.getHolidayDays(this.data.dateStart, this.data.dateEnd, this.data.timeStart, this.data.timeEnd);
    this.setData({
      leaveDays: days
    })
  },
  textAreaBlur: function (e) {
    this.setData({
      leaveReason: e.detail.value
    })
    console.log(this.data.leaveReason)
  },
  evaSubmit: function (res) {
    console.log(res.detail.formId);
    var that = this;
    var flag = res.detail.target.dataset.flag;
    console.log(flag)
    var form_id = res.detail.formId;
    console.log(JSON.stringify(this.data.tempFiles));
    var remainLeave = this.data.remainLeave - this.data.leaveDays;
    if (this.data.timeStart == '上午') {
      var timeStart = 'am'
    } else {
      var timeStart = 'pm'
    }
    if(this.data.timeEnd == '上午') {
      var timeEnd = 'am'
    } else {
      var timeEnd = 'pm'
    }
    var data = {
      procInsId: this.data.proclnsld,
      userId: this.data.loginId,
      deptId: this.data.department,
      companyId: this.data.companyId,
      applyDate: util.formatDateMine(new Date()) + " " + util.formatTimeMine(new Date()) + ":00",
      workplace: this.data.workplace,
      leaveType: this.data.leaveType,
      startDate: this.data.dateStart,
      endDate: this.data.dateEnd,
      leaveDays: this.data.leaveDays,
      remainLeave: remainLeave,
      reason: this.data.leaveReason,
      userName: this.data.userName,
      startDate_m: timeStart,
      endDate_m: timeEnd,
      formId: form_id,
      flag: flag
    }
    console.log(data)
    if (remainLeave < 0 && this.data.leaveType == '年假') {
      this.wetoast.toast({
        title: '剩余年假天数不足'
      })
    } else if (this.data.leaveReason == '') {
      this.wetoast.toast({
        title: '请假事由不能为空'
      })
    } else {
      if (this.data.tempFiles.length > 0) {
        wx.showModal({
          title: '提示',
          content: '是否申请' + this.data.leaveType + this.data.leaveDays + '天',
          success: function (res) {
            wx.uploadFile({
              url: app.globalData.baseUrl + 'LeaveInterface/start.if',
              header: {
                "content-type": "multipart/form-data"
              },
              method: 'POST',
              filePath: that.data.tempFiles[0].path,
              name: 'file',
              formData: data,
              success: function (res) {
                console.log(res)
                that.wetoast.toast({
                  title: '表单提交成功,请假流程已开启'
                })
                wx.navigateBack({

                })
                console.log(data);
              },
              fail: function (res) {
                console.log('提交失败')
                console.log(res)
                that.wetoast.toast({
                  title: '表单提交失败'
                })
              }
            })
          }
        })
      } else {
        if (this.data.leaveType == '年假' || this.data.leaveType == '事假') {
          wx.showModal({
            title: '提示',
            content: '是否申请' + this.data.leaveType + this.data.leaveDays + '天',
            success: function(res) {
              wx.request({
                url: app.globalData.baseUrl + 'LeaveInterface/start.if',
                header: {
                  "content-type": "application/x-www-form-urlencoded"
                },
                method: 'POST',
                data: data,
                success: function (res) {
                  console.log(res)
                  that.wetoast.toast({
                    title: '表单提交成功,请假流程已开启'
                  })
                  wx.navigateBack({

                  })
                  console.log(data);
                },
                fail: function (res) {
                  console.log('提交失败')
                  that.wetoast.toast({
                    title: '表单提交失败'
                  })
                }
              })
            }
          })
        } else {
          that.wetoast.toast({
            title: '年假与事假以外的请假类型需上传附件才能提交申请'
          })
        }
      }
    }
  },
  uploadAttachment: function (e) {
    var that = this;
    var count = 1 - this.data.tempFiles.length;
    console.log(count)
    if (count <= 0) {
      this.wetoast.toast({
        title: '最多上传1张图片'
      })
    } else {
      wx.showActionSheet({
        itemList: ['从相册选取', '拍照'],
        success: function (res) {
          if (res.tapIndex == 0) {
            wx.chooseImage({
              count: count <= 0 ? 0 : count,
              sourceType: ['album'],
              success: function (res) {
                console.log(res);
                that.setData({
                  tempFiles: that.data.tempFiles.concat(res.tempFiles)
                })
                console.log(that.data.tempFiles)
              },
              fail: function (res) {
                that.wetoast.toast({
                  title: '上传失败'
                })
              }
            })
          } else if (res.tapIndex == 1) {
            wx.chooseImage({
              count: count <= 0 ? 0 : count,
              sourceType: ['camera'],
              success: function (res) {
                console.log(res);
                that.setData({
                  tempFiles: that.data.tempFiles.concat(res.tempFiles)
                })
              },
              fail: function (res) {
                that.wetoast.toast({
                  title: '上传失败'
                })
              }
            })
          }
        },
        fail: function (res) {
          that.wetoast.toast({
            title: '取消上传'
          })
        }
      })
    }
  },
  deleteAttachment: function (e) {
    var that = this;
    console.log(this.data.tempFiles)
    var path = e.currentTarget.dataset.imgpath;
    var tempFiles = this.data.tempFiles;
    console.log(path);
    for (var i = 0; i < that.data.tempFiles.length; i++) {
      var index = that.data.tempFiles[i].path;
      if (path == index) {
        console.log(i)
        tempFiles.splice(i, 1)
        console.log(tempFiles)
        that.setData({
          tempFiles: tempFiles
        })
      }
    }
  },
  previewImg: function(e) {
    var current = e.target.dataset.src;
    var imgList = [];
    for(var i = 0; i < this.data.tempFiles.length; i++) {
      imgList[i] = this.data.tempFiles[i].path;
    }
    wx.previewImage({
      current: current,
      urls: imgList,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.WeToast();
    var that = this;
    var loginId = wx.getStorageSync('loginId');
    console.log(loginId)
    wx.request({
      url: app.globalData.baseUrl + 'LeaveInterface/getPdefId.if',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        userId: loginId,
        appId: 'ac-dgt-leave-workflow'
      },
      success: function (res) {
        //userId为系统分配的唯一标志字符串
        console.log(res)
        console.log('userId=' + res.data);
        var userId = res.data
        wx.setStorageSync('userId', userId);
        that.setData({
          proclnsld: userId,
          loginId: loginId
        })
        wx.request({
          url: app.globalData.baseUrl + 'LeaveInterface/getform.if',
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          data: {
            loginId: loginId,
            pDefId: userId
          },
          success: function (res) {
            console.log(loginId);
            console.log('userId=' + userId);                                    
            console.log(res);
            var department = res.data.uInfo.department;
            var userName = res.data.uInfo.userName;
            var workplace = res.data.uInfo.workplace;
            var remainLeave = 0;
            if (res.data.uInfo.remainLeave){
              remainLeave=res.data.uInfo.remainLeave;
            }
            var companyId = res.data.uInfo.companyId;
            wx.setStorageSync('department', department);
            wx.setStorageSync('userName', userName);
            wx.setStorageSync('workplace', workplace);
            wx.setStorageSync('remainLeave', remainLeave);
            that.setData({
              department: department,
              workplace: workplace,
              userName: userName,
              remainLeave: remainLeave,
              companyId: companyId
            })
          },
          fail: function (res) {
            console.log('请求失败')
          }
        })
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