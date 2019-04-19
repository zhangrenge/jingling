var util = require('../../../utils/util.js');
const app = getApp()
 //服务器上传图片
 var uploadImg=function (stampAuditId,file){
  var data={
    stampAuditId:stampAuditId
  }
   wx.uploadFile({
    url: app.globalData.baseUrl + 'StampInterface/upload.if',
    header: 
      {
            //"content-type": "application/x-www-form-urlencoded"
            "content-type": "multipart/form-data"
      },
      method: 'POST',
      filePath: file.path,
      name: 'file',
      formData: data,
      success: function (res) {
           console.log('图片上传成功')
      },
      fail: function (res) {
        console.log('图片上传失败')  
      }
  })
 }
Page({
  data: {
   //图片数组
    tempFiles: [],
     //用印原因
    reason: '',  
    //部门id  
    deptId: '',
    //申请人姓名
    userName: '',    
    //流程定id
    proclnsld: '',
    //登录id
    loginId: '',
    //申请日期
    applyDate:'',
    disabled:false,
    //类别名称
     picker_arr: [], 
     //类别id
    id_arr: [],
     //picker中value属性值
    picker_index: 0,
  },

  textAreaBlur: function (e) {
    this.setData({
      reason: e.detail.value
    })
  },
  evaSubmit: function (res) {
 
      var that = this;
    var flag = res.detail.target.dataset.flag;
    console.log(flag)
    var form_id = res.detail.formId;
    console.log(JSON.stringify(this.data.tempFiles));
    var data = {
      procInsId: this.data.proclnsld,
      userId: this.data.loginId,
      deptId: this.data.deptId,
      applyDate:this.data.applyDate,
      reason: this.data.reason,
      userName: this.data.userName,
      stampTypeId:this.data.id_arr[this.data.picker_index],
      flag:flag     
    }
    console.log(data)

    if (this.data.reason == '') {
      this.wetoast.toast({
        title: '用印事由不能为空'
      })
    } else {
      this.setData({
        disabled:true
      })
      wx.request({
        url: app.globalData.baseUrl + 'StampInterface/start.if',
        header: {
            "content-type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        data:  data ,
        success: function (res) {
          var oaStampAudit = res.data.oaStampAudit;
          console.log(res)
          //循环将图片上传服务器
          var tempFiles = that.data.tempFiles;
          for (var i = 0; i<tempFiles.length; i++) {
            uploadImg(oaStampAudit.stampAuditId, tempFiles[i]);
          }
          that.wetoast.toast({
            title: '表单提交成功,用印流程已开启'
          })
                setTimeout(function () {
              wx.redirectTo({
                url: '../../index/index',
              })
            }, 2000);
          },
          fail: function (res) {
            console.log('提交失败')
            that.wetoast.toast({
              title: '表单提交失败'
            })
          }
        })
     
    }
  },
  uploadAttachment: function (e) {
    var that = this;
    var count = 5 - this.data.tempFiles.length;
    console.log(count)
    if (count <= 0) {
      this.wetoast.toast({
        title: '最多上传5张图片'
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

 
    
    //获取  用户基础信息   和流程定义id  类别类型列表
    var loginId = wx.getStorageSync('loginId');
   wx.request({
    url: app.globalData.baseUrl + 'StampInterface/getform.if',
    header: {
      "content-type": "application/x-www-form-urlencoded"
      },
    method: 'POST',
    data: {
      loginId: loginId,
      appId: 'ac-dgt-stamp-workflow'
      },
    success: function (res) {
      console.log(res);
            var applyDate=res.data.applyDate;
           var proclnsld = res.data.pDefId;
            var deptId = res.data.uInfo.department;
            var userName = res.data.uInfo.userName;
            var loginId=res.data.uInfo.loginId;
 
              var picker_arr = [];
          var id_arr = [];
           var show_arr=res.data.stampTypeList;
          show_arr.forEach(function (e) {
            picker_arr.push(e.stampTypeName);
            id_arr.push(e.stampTypeId);
           })

            that.setData({
              proclnsld:proclnsld,
              deptId :deptId,
              userName:userName,
              loginId:loginId,
              picker_arr:picker_arr,
              id_arr:id_arr,
              applyDate:applyDate
            })
           },
          fail: function (res) {
            console.log('请求失败')
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

  },
  //选项改变触发事件
   bindPickerChange: function (e) {
    this.setData({
      picker_index: e.detail.value
    })
  }
})