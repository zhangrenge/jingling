// detail.js
var util = require('../../utils/util.js');

const app = getApp();
const date = new Date();
const years = []
const months = []
const days = []
const remarks = ['上午', '下午']

for (let i = date.getFullYear(); i <= 2099; i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    readHttpImage:'',
    selectedAttachment: false,
    tempFiles: [],
    currentType: '',
    years: years,
    months: months,
    days: days,
    remarks: remarks,
    value: [0, date.getMonth(), date.getDate() - 1, 0],
    showModalStatus: false,
    imgBaseUrl: app.globalData.baseUrl,
    selected: false,
    selected1: false,
    editSelected: false,
    selectedReason: false,
    selectedDate: false,
    createBy: '',
    createDate: '',
    leaveType: '',
    leaveDays: '',
    reason: '',
    temporaryReason: '',
    startDate: '',
    temporaryStartDate: '',
    endDate: '',
    temporaryEndDate: '',
    temporaryStartDate_m: '',
    startDate_m: '',
    temporaryEndDate_m: '',
    endDate_m: '',
    comment: '',
    deptId: '',
    taskName: '',
    procDefId: '',
    procInsId: '',
    taskId: '',
    taskDefKey: 'modifyApply',
    leaveAuditId: '',
    myHeadImg: '',
    actBaseInfos: '',
    areaIndex: '',
    area: ['事假', '病假', '年假', '调休', '婚假', '产假', '陪产假', '其他']
  },
  bomb: function (e) {
    var that = this;
    var flag = e.currentTarget.dataset.flag;
    var loginId = wx.getStorageSync('loginId');
    var _startTime = new Date(this.data.startDate.replace(/-/g, "\/"));
    var _endTime = new Date(this.data.endDate.replace(/-/g, "\/"));
    if(this.data.startDate_m == '上午') {
      var startDate_m = 'am'
    } else {
      var startDate_m = 'pm'
    }
    if(this.data.endDate_m == '上午') {
      var endDate_m = 'am'
    } else {
      var endDate_m = 'pm'
    }
    var data = {
      leaveAuditId: this.data.leaveAuditId,
      userId: loginId,
      leaveType: this.data.leaveType,
      startDate: this.data.startDate,
      endDate: this.data.endDate,
      startDate_m: startDate_m,
      endDate_m: endDate_m,
      leaveDays: this.data.leaveDays,
      reason: this.data.reason,
      procDefId: this.data.procDefId,
      procInsId: this.data.procInsId,
      taskId: this.data.taskId,
      taskName: this.data.taskName,
      taskDefKey: this.data.taskDefKey,
      loginId: loginId,
      flag: flag
    };
    if(_startTime > _endTime) {
      this.wetoast.toast({
        title:'开始时间不能大于结束时间'
      })
    } else {
        wx.showToast({
            title: '处理中',
            icon: 'loading',
            duration: 1000,
            mask: true
        });
        setTimeout(function () { wx.hideToast() }, 2000);
        if (this.data.tempFiles.length > 0) {
            let fi = this.data.tempFiles[0].path;
            if (fi.indexOf('://tmp/') == -1) {
                    that.setData({
                        ["tempFiles"]: []
                    })
            }
        }
       
      if (this.data.tempFiles.length > 0) {
          //readHttpImage
          
        wx.uploadFile({
          url: app.globalData.baseUrl + 'LeaveInterface/complete.if',
          header: {
            //"content-type": "application/x-www-form-urlencoded"
            "content-type": "multipart/form-data"
          },
          method: 'POST',
            filePath: this.data.tempFiles[0].path, //this.data.tempFiles[0].path
          name: 'file',
          formData: data,
          success: function (res) {
            console.log(res)
            that.wetoast.toast({
              title: '处理成功',
              success: function(res) {
                wx.navigateBack({
                   
                })
              }
            })
          },
          fail: function (res) {
            console.log('提交失败')
            console.log(res)
            that.wetoast.toast({
              title: '表单提交失败'
            })
          }
        })
      } else {
        wx.request({
          url: app.globalData.baseUrl + 'LeaveInterface/complete.if',
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          data: data,
          success: function (res) {
            console.log(res)
            that.wetoast.toast({
              title: '处理成功',
              success: function(res) {
                wx.navigateBack({
                  
                })
              }
            })
          },
          fail: function (res) {
            console.log('提交失败')
            that.wetoast.toast({
              title: '表单提交失败'
            })
          }
        })
      }
    }
  },
  biu: function (e) {
    var that = this;
    var flag = e.currentTarget.dataset.flag;
    var loginId = wx.getStorageSync('loginId');
    var data = {
      procDefId: this.data.procDefId,
      procInsId: this.data.procInsId,
      taskId: this.data.taskId,
      taskName: this.data.taskName,
      taskDefKey: this.data.taskDefKey,
      loginId: loginId,
      flag: flag
    };
    wx.setStorageSync('approvalData', data);
    wx.navigateTo({
      url: '../approvalReason/approvalReason',
    })
  },
  editType: function (e) {
    this.setData({
      areaIndex: e.detail.value,
      leaveType: this.data.area[e.detail.value]
    })
  },
  DateChange: function (e) {
    const val = e.detail.value
    var year = years[val[0]];
    var month = months[val[1]];
    var day = days[val[2]];
    var remark = remarks[val[3]];
    var temporaryDate = year + '/' + month + '/' + day;
    var temporaryDate_m = remark;
    if (this.data.currentType == 'startTime') {
      this.setData({
        temporaryStartDate: temporaryDate,
        temporaryStartDate_m: temporaryDate_m
      })
      console.log(this.data.temporaryStartDate);
    } else if (this.data.currentType == 'endTime') {
      this.setData({
        temporaryEndDate: temporaryDate,
        temporaryEndDate_m: temporaryDate_m
      })
      console.log(this.data.temporaryEndDate);
    }
  },
  editAttachment: function (e) {
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
                  tempFiles: that.data.tempFiles.concat(res.tempFiles),
                  selectedAttachment: false
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
                  tempFiles: that.data.tempFiles.concat(res.tempFiles),
                  selectedAttachment: false
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
    var id = e.currentTarget.dataset.id;
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
        if(this.data.tempFiles.length < 1) {
          that.setData({
            selectedAttachment: true
          })
        }
      }
    }
    wx.request({
      url: app.globalData.baseUrl + 'LeaveInterface/delAttachment.if',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        id: id,
      },
      success: function(res) {
        console.log(res);
      },
      fail: function(res) {
        console.log(res);
      },
    })
  },
  previewImg: function (e) {
    var current = e.target.dataset.src;
    var imgList = [];
    for (var i = 0; i < this.data.tempFiles.length; i++) {
      imgList[i] = this.data.tempFiles[i].path;
    }
    wx.previewImage({
      current: current,
      urls: imgList,
    })
  },
  editReason: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    if (currentStatu == 'sure' || currentStatu == 'cancel') {
      this.util(currentStatu);
    } else {
      this.setData({
        currentType: currentStatu
      })
      this.util(currentStatu);
    }
    console.log(this.data.currentType);
  },
  textAreaBlur: function (e) {
    this.setData({
      temporaryReason: e.detail.value
    })
    console.log(e);
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });

    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;

    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })

      //关闭  
      if (currentStatu == "cancel") {
        this.setData({
          selectedReason: false,
          selectedDate: false,
          showModalStatus: false
        });
      }
      if (currentStatu == 'sure') {
        console.log(this.data.currentType)
        if (this.data.currentType == 'reason') {
          this.setData({
            selectedReason: false,
            selectedDate: false,
            reason: this.data.temporaryReason,
            showModalStatus: false
          });
          console.log(this.data.reason);
        } else if (this.data.currentType == 'startTime') {
          var leaveDays = util.getHolidayDays(this.data.temporaryStartDate, this.data.endDate, this.data.temporaryStartDate_m, this.data.endDate_m);
          this.setData({
            selectedReason: false,
            selectedDate: false,
            startDate: this.data.temporaryStartDate,
            startDate_m: this.data.temporaryStartDate_m,
            leaveDays: leaveDays,
            showModalStatus: false
          });
        } else if (this.data.currentType == 'endTime') {
          var leaveDays = util.getHolidayDays(this.data.startDate, this.data.temporaryEndDate, this.data.startDate_m, this.data.temporaryEndDate_m);
          this.setData({
            selectedReason: false,
            selectedDate: false,
            endDate: this.data.temporaryEndDate,
            endDate_m: this.data.temporaryEndDate_m,
            leaveDays: leaveDays,
            showModalStatus: false
          });
        }
      }
    }.bind(this), 200)

    // 显示  
    if (currentStatu == "reason") {
      this.setData({
        selectedReason: true,
        showModalStatus: true
      });
    }
    if (currentStatu == "startTime" || currentStatu == "endTime") {
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var temporaryDate_m = '上午';
      var temporaryDate = year + '/' + month + '/' + day;
      console.log(temporaryDate)
      if (currentStatu == "startTime") {
        this.setData({
          selectedDate: true,
          temporaryStartDate: temporaryDate,
          temporaryStartDate_m: temporaryDate_m,
          showModalStatus: true,
        });
      }
      if (currentStatu == "endTime") {
        this.setData({
          selectedDate: true,
          temporaryEndDate: temporaryDate,
          temporaryEndDate_m: temporaryDate_m,
          showModalStatus: true
        });
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.WeToast();
    var that = this;
    console.log(options)
    if (options.opentype == 'untreated') {
      if (options.taskName == '暂存调整') {
        that.setData({
          selected1: true,
          editSelected: true
        })
      } else {
        that.setData({
          selected: true
        })
      }
      wx.request({
        url: app.globalData.baseUrl + 'LeaveInterface/viewAudit.if',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        data: {
          taskId: options.taskId,
        },
        success: function (res) {
          console.log(res)
          var tempFiles = [];
          if(res.data.attachment.length < 1) {
            that.setData({
              selectedAttachment: true
            })
          }
          for (var i = 0; i < res.data.attachment.length; i++) {
            var obj = {};
            obj.path = res.data.httpServer + res.data.attachment[i].filePath;
            obj.id = res.data.attachment[i].id;
            tempFiles[i] = obj;
          }
          var actBaseInfos = [];
          if (res.data.actBaseInfos.length > 0) {
          
            for (var i = 0; i < res.data.actBaseInfos.length; i++) {
              var obj = {};
              obj.headImage = res.data.actBaseInfos[i].headImage;
              obj.comment = res.data.actBaseInfos[i].comment.match(/[^\[\)]+(?=\])/g);
              obj.reason = res.data.actBaseInfos[i].comment.replace(/\[.*?\]/g, '');
              obj.createBy = res.data.actBaseInfos[i].createBy;
              obj.taskName = res.data.actBaseInfos[i].taskName;
              obj.createDate = res.data.actBaseInfos[i].createDate;
              obj.itemId = i + 1;
              obj.length = res.data.actBaseInfos.length;
              actBaseInfos[i] = obj;
            }
          }
          console.log('start')
          console.log(actBaseInfos);
          console.log('end')
          var startDate = new Date(parseInt(res.data.LeaveAudit.startDate)).toLocaleDateString();
          var endDate = new Date(parseInt(res.data.LeaveAudit.endDate)).toLocaleDateString();
          var startTime_m = res.data.LeaveAudit.remarks.substring(0, res.data.LeaveAudit.remarks.indexOf(":"));
          var endTime_m = res.data.LeaveAudit.remarks.substring(res.data.LeaveAudit.remarks.indexOf(":") + 1);
          if(startTime_m == 'am') {
            var startDate_m = '上午';
          } else {
            var startDate_m = '下午';
          }
          if(endTime_m == 'am') {
            var endDate_m = '上午';            
          } else {
            var endDate_m = '下午';            
          }
          that.setData({
            tempFiles: tempFiles,
            myHeadImg: app.globalData.baseUrl + res.data.LeaveAudit.headImage,
            createBy: res.data.actBaseInfos[0].createBy,
            createDate: res.data.actBaseInfos[0].createDate,
            leaveType: res.data.LeaveAudit.leaveType,
            leaveDays: res.data.LeaveAudit.leaveDays,
            reason: res.data.LeaveAudit.reason,
            startDate: startDate,
            endDate: endDate,
            startDate_m: startDate_m,
            endDate_m: endDate_m,
            comment: res.data.actBaseInfos[0].comment,
            deptId: res.data.LeaveAudit.deptId,
            taskName: res.data.taskName,
            procDefId: res.data.procDefId,
            procInsId: res.data.procInsId,
            taskId: res.data.taskId,
            leaveAuditId: res.data.LeaveAudit.id,
            actBaseInfos: actBaseInfos
          })
            // wx.downloadFile({
            //     url: that.data.tempFiles[0].path, //仅为示例，并非真实的资源
            //     success: function (res) {
            //         that.setData({
            //             readHttpImage: res.tempFilePath
            //         })
            //     }
            // })
        },
        fail: function (res) {
          console.log(res)
        }
      })
    } else {
      console.log(options.pDefId, options.taskId, options.pInstId);
      wx.request({
        url: app.globalData.baseUrl + 'LeaveInterface/taskdetail.if',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        data: {
          pDefId: options.pDefId,
          taskId: options.taskId,
          pInstId: options.pInstId,
        },
        success: function (res) {
          console.log(res)
          var tempFiles = [];
          if (res.data.attachment.length < 1) {
            that.setData({
              selectedAttachment: true
            })
          }
          for (var i = 0; i < res.data.attachment.length; i++) {
            var obj = {};
            obj.path = res.data.httpServer + res.data.attachment[i].filePath;
            obj.id = res.data.attachment[i].id;            
            tempFiles[i] = obj;
          }
          var actBaseInfos = [];
          for (var i = 0; i < res.data.actBaseInfos.length; i++) {
            var obj = {};
            obj.headImage = res.data.actBaseInfos[i].headImage;            
            obj.comment = res.data.actBaseInfos[i].comment.match(/[^\[\)]+(?=\])/g);
            obj.reason = res.data.actBaseInfos[i].comment.replace(/\[.*?\]/g, '');
            obj.createBy = res.data.actBaseInfos[i].createBy;
            obj.taskName = res.data.actBaseInfos[i].taskName;
            obj.createDate = res.data.actBaseInfos[i].createDate;
            obj.itemId = i + 1;
            obj.length = res.data.actBaseInfos.length;
            actBaseInfos[i] = obj;
          }
          console.log('start')
          console.log(actBaseInfos);
          console.log('end')
          var startDate = new Date(parseInt(res.data.LeaveAudit.startDate)).toLocaleDateString();
          var endDate = new Date(parseInt(res.data.LeaveAudit.endDate)).toLocaleDateString();
          var startTime_m = res.data.LeaveAudit.remarks.substring(0, res.data.LeaveAudit.remarks.indexOf(":"));
          var endTime_m = res.data.LeaveAudit.remarks.substring(res.data.LeaveAudit.remarks.indexOf(":") + 1);
          if (startTime_m == 'am') {
            var startDate_m = '上午';
          } else {
            var startDate_m = '下午';
          }
          if (endTime_m == 'am') {
            var endDate_m = '上午';
          } else {
            var endDate_m = '下午';
          }
          that.setData({
            tempFiles: tempFiles,
            myHeadImg: app.globalData.baseUrl + res.data.LeaveAudit.headImage,
            selected: false,
            createBy: res.data.actBaseInfos[0].createBy,
            createDate: res.data.actBaseInfos[0].createDate,
            leaveType: res.data.LeaveAudit.leaveType,
            leaveDays: res.data.LeaveAudit.leaveDays,
            reason: res.data.LeaveAudit.reason,
            startDate: startDate,
            endDate: endDate,
            startDate_m: startDate_m,
            endDate_m: endDate_m,
            comment: res.data.actBaseInfos[0].comment,
            deptId: res.data.LeaveAudit.deptId,
            taskName: res.data.taskName,
            actBaseInfos: actBaseInfos
          })
        },
        fail: function (res) {
          console.log(res)
        }
      })
    }
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