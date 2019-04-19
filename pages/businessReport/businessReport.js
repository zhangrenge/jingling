const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFiles: [],
    comment: '',
    progress: '',
    completion: '',
  },
  textAreaBlur: function (e) {
    this.setData({
      comment: e.detail.value
    })
  },
  progressBlur: function (e) {
    this.setData({
      progress: e.detail.value
    })
  },
  completionBlur: function (e) {
    this.setData({
      completion: e.detail.value
    })
  },

  
  evaSubmit: function (res) {
    var that = this;      
      var form_id = res.detail.formId;    
      var data = wx.getStorageSync('approvalData');
      data.comment = this.data.comment;
      data.progress = this.data.progress;
      data.completion = this.data.completion;
      data.formId = form_id; 
      data.flag = e.currentTarget.dataset.flag;    
      console.log(data)
      if (this.data.tempFiles.length > 0) {
        wx.uploadFile({
          url: app.globalData.baseUrl + 'BusinessInterface/submitReport.if',
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
              title: '审核完成',
              success: function (e) {
                wx.navigateBack({
                  delta: 2
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
          url: app.globalData.baseUrl + 'BusinessInterface/submitReport.if',
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          data: data,
          success: function (res) {
            console.log(res)
            that.wetoast.toast({
              title: '提交成功',
              success: function (e) {
                wx.navigateBack({
                  delta: 2
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