// detail.js
var util = require('../../utils/util.js');

const app = getApp();

const date = new Date();
const years = []
const months = []
const days = []
const remarks = ['上午', '下午']

for (let i = 2017; i <= 2099; i++) {
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
    currentType: '',
    tempFiles: [],   
    years: years,
    year: 2,
    months: months,
    month: 2,
    days: days,
    remarks: remarks,
    value: [0, date.getMonth(), date.getDate() - 1, 0],
    showModalStatus: false,
    imgBaseUrl: app.globalData.baseUrl,
    selected: false,
    selected1: false,
    selected2: false,
    selected3: false,
    editSelected: false,
    selectedReason: false,
    selectedTransport: false,
    selectedDestination: false,
    selectedCustomerName: false,
    selectedCustomerContacts: false,
    selectedCustomerPhone: false,
    selectedDate: false,
    createBy: '',
    createDate: '',
    businessDays: '',
    destination: '',
    transport: '',
    customerName: '',
    customerContacts: '',
    customerPhone: '',
    reason: '',
    temporaryReason: '',
    startDate: '',
    endDate: '',
    startDate_m: '',
    endDate_m: '',
    comment: '',
    deptId: '',
    taskName: '',
    procDefId: '',
    procInsId: '',
    taskId: '',
    taskDefKey: 'modifyApply',
    businessAuditId: '',
    myHeadImg: '',
    actBaseInfos: '',
    isTicketIndex: 0,
    isTicketArea: ['是', '否'],
    isTicket: '是'
  },
  bomb: function (e) {
    var that = this;
    var flag = e.currentTarget.dataset.flag;
    var loginId = wx.getStorageSync('loginId');

    var _startTime = new Date(this.data.startDate.replace(/-/g, "\/"));
    var _endTime = new Date(this.data.endDate.replace(/-/g, "\/"));
    if (this.data.startDate_m == '上午') {
      var startDate_m = 'am'
    } else {
      var startDate_m = 'pm'
    }
    if (this.data.endDate_m == '上午') {
      var endDate_m = 'am'
    } else {
      var endDate_m = 'pm'
    }
   
    var data = {
      businessAuditId: this.data.businessAuditId,
      userId: loginId,
      destination: this.data.destination,
      transport: this.data.transport,
      customerName: this.data.customerName,
      customerContacts: this.data.customerContacts,
      customerPhone: this.data.customerPhone,
      isTicket: this.data.isTicket,
      startDate: this.data.startDate,
      endDate: this.data.endDate,
      startDate_m: startDate_m,
      endDate_m: endDate_m,
      businessDays: this.data.businessDays,
      reason: this.data.reason,
      procDefId: this.data.procDefId,
      procInsId: this.data.procInsId,
      taskId: this.data.taskId,
      taskName: this.data.taskName,
      taskDefKey: this.data.taskDefKey,
      loginId: loginId,     
      flag: flag
    }


    if (_startTime > _endTime) {
      this.wetoast.toast({
        title: '开始时间不能大于结束时间'
      })
      return;
    } 
   

    if (this.data.tempFiles.length > 0 && this.data.tempFiles[0].path.indexOf("http") == -1) {
          
      wx.uploadFile({
        url: app.globalData.baseUrl + 'BusinessInterface/complete.if',
        header: {         
          "content-type": "multipart/form-data"
        },
        method: 'POST',
        filePath: this.data.tempFiles[0].path,
        name: 'file',
        formData: data,
        success: function (res) {
          console.log(res)
          that.wetoast.toast({
            title: '处理成功',
            success: function (e) {
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

    }else{

      wx.request({
        url: app.globalData.baseUrl + 'BusinessInterface/complete.if',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        data: data,
        success: function (res) {
          console.log(res)
          that.wetoast.toast({
            title: '处理成功',
            success: function (e) {
              wx.navigateBack({

              })
            }
          })
        },
        fail: function (res) {
          console.log(res)
        }
      })
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
      isTicket: this.data.isTicket,
      loginId: loginId,
      flag: flag
    };
    wx.setStorageSync('approvalData', data);
    wx.navigateTo({
      url: '../businessApproval/businessApproval',
    })
  },
  submitReport: function (e) {
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
      url: '../businessReport/businessReport',
    })
  },
  submitTicket: function (e) {
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
      url: '../businessTicket/businessTicket',
    })
  },
 
  editType: function (e) {
    this.setData({
      isTicketIndex: e.detail.value,
      isTicket: this.data.isTicketArea[e.detail.value]
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
    var id = e.currentTarget.dataset.attid;

    

    wx.request({
      url: app.globalData.baseUrl + 'BusinessInterface/delAttachment.if',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {"id":id},
      success: function (res) {
        console.log(res)
       
      },
      fail: function (res) {
        console.log(res)
      }
    })

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
        if (this.data.tempFiles.length < 1) {
          that.setData({
            selectedAttachment: true
          })
        }
      }
    }
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
    console.log(currentStatu);
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
  transportBlur: function (e) {
    this.setData({
      transport: e.detail.value
    })
    console.log(e);
  },
  destinationBlur: function (e) {
    this.setData({
      destination: e.detail.value
    })
    console.log(e);
  },
  customerNameBlur: function (e) {
    this.setData({
      customerName: e.detail.value
    })
    console.log(e);
  },
  customerContactsBlur: function (e) {
    this.setData({
      customerContacts: e.detail.value
    })
    console.log(e);
  },
  customerPhoneBlur: function (e) {
    this.setData({
      customerPhone: e.detail.value
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
          selectedTransport: false,
          selectedDestination: false,
          selectedCustomerName: false,
          selectedCustomerContacts: false,
          selectedCustomerPhone: false,
          selectedDate: false,          
          showModalStatus: false
        });
      }
      if (currentStatu == 'sure') {
        console.log(this.data.currentType)
        if (this.data.currentType == 'reason') {
          this.setData({
            selectedReason: false,
            selectedTransport: false,
            selectedDestination: false,
            selectedCustomerName: false,
            selectedCustomerContacts: false,
            selectedCustomerPhone: false,
            selectedDate: false,
            reason: this.data.temporaryReason,
            showModalStatus: false
          });
          
        } else if (this.data.currentType == 'startTime') {
          var businessDays = util.getBusinessDays(this.data.temporaryStartDate, this.data.endDate, this.data.temporaryStartDate_m, this.data.endDate_m);
          this.setData({
            startDate: this.data.temporaryStartDate,
            startDate_m: this.data.temporaryStartDate_m,
            businessDays: businessDays,
            selectedReason: false,
            selectedTransport: false,
            selectedDestination: false,
            selectedCustomerName: false,
            selectedCustomerContacts: false,
            selectedCustomerPhone: false,
            selectedDate: false,
            showModalStatus: false
          });
        } else if (this.data.currentType == 'endTime') {

          var businessDays = util.getBusinessDays(this.data.startDate, this.data.temporaryEndDate, this.data.startDate_m, this.data.temporaryEndDate_m);
          this.setData({
            endDate: this.data.temporaryEndDate,
            endDate_m: this.data.temporaryEndDate_m,
            businessDays: businessDays,
            selectedReason: false,
            selectedTransport: false,
            selectedDestination: false,
            selectedCustomerName: false,
            selectedCustomerContacts: false,
            selectedCustomerPhone: false,
            selectedDate: false,
            showModalStatus: false
          });
        } else if (this.data.currentType == 'transport') {
          this.setData({
            selectedReason: false,
            selectedTransport: false,
            selectedDestination: false,
            selectedCustomerName: false,
            selectedCustomerContacts: false,
            selectedCustomerPhone: false,
            selectedDate: false,
            transport: this.data.transport,
            showModalStatus: false
          });
        } else if (this.data.currentType == 'destination') {
          this.setData({
            selectedReason: false,
            selectedTransport: false,
            selectedDestination: false,
            selectedCustomerName: false,
            selectedCustomerContacts: false,
            selectedCustomerPhone: false,
            selectedDate: false,
            destination: this.data.destination,
            showModalStatus: false
          });
        } else if (this.data.currentType == 'customerName') {
          this.setData({
            selectedReason: false,
            selectedTransport: false,
            selectedDestination: false,
            selectedCustomerName: false,
            selectedCustomerContacts: false,
            selectedCustomerPhone: false,
            selectedDate: false,
            customerName: this.data.customerName,
            showModalStatus: false
          });
        } else if (this.data.currentType == 'customerContacts') {
          this.setData({
            selectedReason: false,
            selectedTransport: false,
            selectedDestination: false,
            selectedCustomerName: false,
            selectedCustomerContacts: false,
            selectedCustomerPhone: false,
            selectedDate: false,
            customerContacts: this.data.customerContacts,
            showModalStatus: false
          });
        } else if (this.data.currentType == 'customerPhone') {
          this.setData({
            selectedReason: false,
            selectedTransport: false,
            selectedDestination: false,
            selectedCustomerName: false,
            selectedCustomerContacts: false,
            selectedCustomerPhone: false,
            selectedDate: false,
            customerContacts: this.data.customerPhone,
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

    // 显示  
    if (currentStatu == "transport") {
      this.setData({
        selectedTransport: true,
        showModalStatus: true
      });
    }
    
    // 显示  
    if (currentStatu == "destination") {
      this.setData({
        selectedDestination: true,
        showModalStatus: true
      });
    }
    // 显示  
    if (currentStatu == "customerName") {
      this.setData({
        selectedCustomerName: true,
        showModalStatus: true
      });
    }
    // 显示  
    if (currentStatu == "customerContacts") {
      this.setData({
        selectedCustomerContacts: true,
        showModalStatus: true
      });
    }
    // 显示  
    if (currentStatu == "customerPhone") {
      this.setData({
        selectedCustomerPhone: true,
        showModalStatus: true
      });
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
      } else if (options.taskName == '填写出差报告') {
        that.setData({
          selected2: true,          
        })
      } else if (options.taskName == '商务部订票') {
        that.setData({
          selected3: true
        })
      }  else {
        that.setData({
          selected: true
        })
      }
      wx.request({
        url: app.globalData.baseUrl + 'BusinessInterface/viewAudit.if',
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
          if (res.data.actBaseInfos.length > 0) {
            
            for (var i = 0; i < res.data.actBaseInfos.length; i++) {
              var obj = {};
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

          var startDate = new Date(parseInt(res.data.BusinessAudit.startDate)).toLocaleDateString();
          var endDate = new Date(parseInt(res.data.BusinessAudit.endDate)).toLocaleDateString();
          var startTime_m = res.data.BusinessAudit.remarks.substring(0, res.data.BusinessAudit.remarks.indexOf(":"));
          var endTime_m = res.data.BusinessAudit.remarks.substring(res.data.BusinessAudit.remarks.indexOf(":") + 1);
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
            myHeadImg: app.globalData.baseUrl + res.data.BusinessAudit.headImage,
            createBy: res.data.actBaseInfos[0].createBy,
            createDate: res.data.actBaseInfos[0].createDate,
            destination: res.data.BusinessAudit.destination,
            transport: res.data.BusinessAudit.transport,
            isTicket: res.data.BusinessAudit.isTicket,
            customerName: res.data.BusinessAudit.customerName,
            customerContacts: res.data.BusinessAudit.customerContacts,
            customerPhone: res.data.BusinessAudit.customerPhone,
            businessDays: res.data.BusinessAudit.businessDays,
            reason: res.data.BusinessAudit.reason,
            startDate: startDate,
            endDate: endDate,
            startDate_m: startDate_m,
            endDate_m: endDate_m,
            comment: res.data.actBaseInfos[0].comment,
            deptId: res.data.BusinessAudit.deptId,
            taskName: res.data.taskName,
            procDefId: res.data.procDefId,
            procInsId: res.data.procInsId,
            taskId: res.data.taskId,
            businessAuditId: res.data.BusinessAudit.id,
            actBaseInfos: actBaseInfos
          })
        },
        fail: function (res) {
          console.log(res)
        }
      })
    } else {
      console.log(options.pDefId, options.taskId, options.pInstId);
      wx.request({
        url: app.globalData.baseUrl + 'BusinessInterface/taskdetail.if',
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

          if (res.data.attachment != null ){
            if (res.data.attachment.length < 1) {
              that.setData({
                selectedAttachment: true
              })
            }
            for (var i = 0; i < res.data.attachment.length; i++) {
              var obj = {};
              obj.path = res.data.httpServer + res.data.attachment[i].filePath;
              tempFiles[i] = obj;
            }

          }
          

          var actBaseInfos = [];
          for (var i = 0; i < res.data.actBaseInfos.length; i++) {
            var obj = {};
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

          var startDate = new Date(parseInt(res.data.BusinessAudit.startDate)).toLocaleDateString();
          var endDate = new Date(parseInt(res.data.BusinessAudit.endDate)).toLocaleDateString();
          var startTime_m = res.data.BusinessAudit.remarks.substring(0, res.data.BusinessAudit.remarks.indexOf(":"));
          var endTime_m = res.data.BusinessAudit.remarks.substring(res.data.BusinessAudit.remarks.indexOf(":") + 1);
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
            myHeadImg: app.globalData.baseUrl + res.data.BusinessAudit.headImage,
            selected: false,
            createBy: res.data.actBaseInfos[0].createBy,
            createDate: res.data.actBaseInfos[0].createDate,
            destination: res.data.BusinessAudit.destination,
            transport: res.data.BusinessAudit.transport,
            isTicket: res.data.BusinessAudit.isTicket,
            customerName: res.data.BusinessAudit.customerName,
            customerContacts: res.data.BusinessAudit.customerContacts,
            customerPhone: res.data.BusinessAudit.customerPhone,
            businessDays: res.data.BusinessAudit.businessDays,
            reason: res.data.BusinessAudit.reason,
            startDate: startDate,
            endDate: endDate,
            startDate_m: startDate_m,
            endDate_m: endDate_m,
            comment: res.data.actBaseInfos[0].comment,
            deptId: res.data.BusinessAudit.deptId,
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