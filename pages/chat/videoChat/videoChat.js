const app = getApp()
//const account = require('../account');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		roomNo: '',
		userName: '',
		tapTime: '',
		template: 'bigsmall',
		index: 0
	},

	// 绑定输房间号入框
	bindRoomNo: function (e) {
		var self = this;
		self.setData({
			roomNo: e.detail.value
		});
	},
	userChange: function (e) {
		this.setData({
			index: e.detail.value
		})
	},
	radioChange: function (e) {
		this.setData({
			template: e.detail.value
		})
		console.log('this.data.template', this.data.template)
	},


	// 进入rtcroom页面
	joinRoom: function () {

		var self = this;
		// 防止两次点击操作间隔太快
		var nowTime = new Date();
		if (nowTime - this.data.tapTime < 1000) {
			return;
		}

		if (!self.data.roomNo) {
			wx.showToast({
				title: '请输入房间号',
				icon: 'none',
				duration: 2000
			})
			return
		}

		if (/^\d\d+$/.test(self.data.roomNo) === false) {
			wx.showToast({
				title: '只能为数字',
				icon: 'none',
				duration: 2000
			})
			return
		}
    wx.request({
      url: app.globalData.baseURL + '/vconf/user_meeting/meeting_code.json',
      data: {
        "code": self.data.roomNo,
        "_mptoken": wx.getStorageSync('mptoken'),
        "username": wx.getStorageSync('openid'),
        "mobile": wx.getStorageSync('loginId'),
      },
      method: "get",
      header: {
        'Content-Type': 'json'
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == "41266") {
            wx.showToast({
              title: '会议已结束,请输入正确的会议号',
              icon: 'none',
              duration: 1000
            })
            return false;
        }
        if (res.data.code == "1"){
          var url = `../room/room?roomID=${self.data.roomNo}&id=${res.data.data[1].id}&template=${self.data.template}&userId=${wx.getStorageSync('openid')}&userSig=${res.data.data[0]}`;
          wx.navigateTo({
            url: url
          });
          wx.showToast({
            title: '进入房间',
            icon: 'success',
            duration: 1000
          })

          self.setData({
            'tapTime': nowTime
          });
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
		return {
			path: '/pages/webrtc-room/index/index',
			imageUrl: 'https://mc.qcloudimg.com/static/img/dacf9205fe088ec2fef6f0b781c92510/share.png'
		}
	}
})