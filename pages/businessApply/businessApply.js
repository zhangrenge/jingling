var util = require('../../utils/util.js');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fresh: '',
    businessDate: '',
    tempFiles: [],
    areaIndex: 0,
    pickerStart: util.formatDateMine(new Date()),
    pickerEnd: '',
    destination:'',
    transport:'',
    customerName:'',
    customerContacts:'',
    customerPhone:'',
    isTicketIndex: 0,
    isTicketArea: ['是', '否'],
    isTicket:'是',

    timeStartArea: ['上午', '下午'],
    timeStart: '上午',
    timeStartIndex:0,
   
    timeEndArea: ['上午', '下午'],
    timeEnd: '上午',
    timeEndIndex: 0,

    pickerTimeStart: '',
    pickerTimeEnd: '',
    businessReason: '',    
    department: '',
    userName: '',    
    businessDays: 0,
    workplace: '',
    proclnsld: '',
    loginId: '',
    startDate: util.formatDateMine(new Date()),
    endDate: util.formatDateMine(new Date())
  },

  bindPickerChangeIsTicket: function (e) {
    this.setData({
      isTicketIndex: e.detail.value,
      isTicket: this.data.isTicketArea[e.detail.value]
    })
  },
  destinationInput: function (e) {
    this.setData({
      destination: e.detail.value
    })
  },
  transportInput: function (e) {
    this.setData({
      transport: e.detail.value
    })
  },
  customerNameInput: function (e) {
    this.setData({
      customerName: e.detail.value
    })
  },
  customerContactsInput: function (e) {
    this.setData({
      customerContacts: e.detail.value
    })
  },
  customerPhoneInput: function (e) {
    this.setData({
      customerPhone: e.detail.value
    })
  },

  bindPickerChangeReason: function (e) {
    this.setData({
      areaIndex: e.detail.value,
      businessType: this.data.area[e.detail.value]
    })
    console.log(this.data.businessType)
  },

  bindDateChangeStart: function (e) {  
    this.setData({
      startDate: e.detail.value.replace(/-/g, "/"), 
    })

    var days = util.getBusinessDays(this.data.startDate, this.data.endDate, this.data.timeStart, this.data.timeEnd);
    this.setData({
      businessDays: days
    })

  },
  bindDateChangeEnd: function (e) {   
    this.setData({
      endDate: e.detail.value.replace(/-/g, "/"),    
    })
    var days = util.getBusinessDays(this.data.startDate, this.data.endDate, this.data.timeStart, this.data.timeEnd);
    this.setData({
      businessDays: days
    })
  },

  bindTimeChangeStart: function (e) {
    this.setData({
      timeStartIndex: e.detail.value,
      timeStart: this.data.timeStartArea[e.detail.value],    
    })
    var days = util.getBusinessDays(this.data.startDate, this.data.endDate, this.data.timeStart, this.data.timeEnd);
    this.setData({
      businessDays: days
    })
  },
  bindTimeChangeEnd: function (e) {    

    this.setData({
      timeEndIndex: e.detail.value,
      timeEnd: this.data.timeEndArea[e.detail.value],
    })
    console.log(this.data.timeEnd);
    var days = util.getBusinessDays(this.data.startDate, this.data.endDate, this.data.timeStart, this.data.timeEnd );
    this.setData({
        businessDays: days
    }) 
  },

  textAreaBlur: function (e) {
    this.setData({
      businessReason: e.detail.value
    })
  },
  evaSubmit: function (res) {
    console.log(res.detail.formId);
    var that = this;
    var flag = res.detail.target.dataset.flag;
    console.log(flag)
    var form_id = res.detail.formId;
    console.log(JSON.stringify(this.data.tempFiles));

    if (this.data.timeStart == '上午') {
      var timeStart = 'am'
    } else {
      var timeStart = 'pm'
    }
    if (this.data.timeEnd == '上午') {
      var timeEnd = 'am'
    } else {
      var timeEnd = 'pm'
    }

    var data = {
      procInsId: this.data.proclnsld,
      userId: this.data.loginId,
      deptId: this.data.department,
      applyDate: util.formatDateMine(new Date()) + " " + util.formatTimeMine(new Date()) + ":00",
      destination: this.data.destination,
      workplace: this.data.workplace,
      transport: this.data.transport,
      customerName: this.data.customerName,
      customerContacts: this.data.customerContacts,
      customerPhone: this.data.customerPhone,      
      startDate: this.data.startDate,
      endDate: this.data.endDate,
      startDate_m: timeStart,
      endDate_m: timeEnd,
      businessDays: this.data.businessDays,     
      reason: this.data.businessReason,
      isTicket: this.data.isTicket,
      userName: this.data.userName,
      formId: form_id,
      flag: flag
    }
    console.log(data)
    
    if (validatemobile(this.data.customerPhone) == false) {

      this.wetoast.toast({
        title: '请输入正确的联系方式!'
      })
      return
    }
    
    if (this.data.businessReason == '') {
      this.wetoast.toast({
        title: '出差事由不能为空'
      })
    } else {
      if (this.data.tempFiles.length > 0) {
        wx.uploadFile({
          url: app.globalData.baseUrl + 'BusinessInterface/start.if',
          header: {
            //"content-type": "application/x-www-form-urlencoded"
            "content-type": "multipart/form-data"
          },
          method: 'POST',
          filePath: this.data.tempFiles[0].path,
          name: 'file',
          formData: data,
          success: function (res) {
            console.log(res)
            that.wetoast.toast({
              title: '表单提交成功,出差流程已开启'
            })

            wx.navigateBack({

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
          url: app.globalData.baseUrl + 'BusinessInterface/start.if',
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          data: data,
          success: function (res) {
            console.log(res)
            that.wetoast.toast({
              title: '表单提交成功,出差流程已开启'
            })
            wx.navigateBack({

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
  uploadAttachment: function (e) {
    var that = this;
    var count = 1 - this.data.tempFiles.length;
    console.log(count)

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
      url: app.globalData.baseUrl + 'BusinessInterface/getPdefId.if',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        userId: loginId,
        appId: 'ac-dgt-business-workflow'
      },
      success: function (res) {
        //userId为系统分配的唯一标志字符串
    
        var userId = res.data
        wx.setStorageSync('userId', userId);
        that.setData({
          proclnsld: userId,
          loginId: loginId
        })
        wx.request({
          url: app.globalData.baseUrl + 'BusinessInterface/getform.if',
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          data: {
            loginId: loginId,
            pDefId: userId
          },
          success: function (res) {
            console.log(res)
            var department = res.data.uInfo.department;
            var userName = res.data.uInfo.userName;
            var workplace = res.data.uInfo.workplace;           
            wx.setStorageSync('department', department);
            wx.setStorageSync('userName', userName);
            wx.setStorageSync('workplace', workplace);
           
            that.setData({
              department: department,
              workplace: workplace,
              userName: userName,             
              businessDate: util.formatNowDate()
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


function validatemobile(mobile) {
  
  if (mobile.length != 11){
    return false;
  }
  var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
  if (!myreg.test(mobile)) {
      return false;
  }
  return true;
}