// 重新定义打卡概念，1.本地打卡为GPS指定范围内打卡2.WIFI打卡为连接路由打卡3.远程打卡为GPS任意位置打卡无需连接路由
var app = getApp()
var util = require('../../utils/util.js');
var fetch = require('../../utils/fetch.js'); // 引入外部包
var utilHttpRequest = require('../../utils/request.js');

var md5util = require('../../utils/md5.js')

//获取应用实例
Page({
  data: {
    showModalStatus: 1,
    selected: false,
    toastMsg: '',
    nowDate: '',
    nowTime: '',
    week: '',
    //地图的宽高
    mapHeight: '100%',
    mapWidth: '100%',
    mapTop: '0',
    //用户当前位置
    point: {
      latitude: 0,
      longitude: 0
    },
    //当前地图的缩放级别
    mapScale: 16,
    markers: [],
    //画圆
    circles: [],
    controlsT: [],
    //组件
    controls: [{
        id: 1,
        position: {
          left: 75 * wx.getStorageSync("kScreenW"),
          top: 470 * wx.getStorageSync("kScreenH"), //529
          width: 100 * wx.getStorageSync("kScreenW"),
          height: 49 * wx.getStorageSync("kScreenH"),
        },
        iconPath: '../../image/shangban.png',
        clickable: true,
      },
      //显示说明按钮
      {
        id: 2,
        position: {
          left: 194 * wx.getStorageSync("kScreenW"),
          top: 470 * wx.getStorageSync("kScreenH"), //529
          width: 100 * wx.getStorageSync("kScreenW"),
          height: 49 * wx.getStorageSync("kScreenH"),

        },
        iconPath: '../../image/xiaban.png',
        clickable: true,
      },
      {
        id: 3,
        position: {
          left: 20 * wx.getStorageSync("kScreenW"),
          top: 477 * wx.getStorageSync("kScreenH"), //536
          width: 36 * wx.getStorageSync("kScreenW"),
          height: 36 * wx.getStorageSync("kScreenH"),

        },
        iconPath: '../../image/reposition.png',
        clickable: true,
      },
      {
        id: 4,
        position: {
          left: 313 * wx.getStorageSync("kScreenW"),
          top: 471 * wx.getStorageSync("kScreenH"), //530
          width: 62 * wx.getStorageSync("kScreenW"),
          height: 48 * wx.getStorageSync("kScreenH"),

        },
        iconPath: '../../image/mine.png',
        clickable: true,
      }
    ]
  },
  toastHide: function(e) {
    this.setData({
      selected: false,
      toastMsg: ''
    })
  },
  todaka: function(res, id,msg) { //打卡数据到oneportal整合
    //localhost:8082/oneportal/signForMobile/updateLocalSignInfo.if?loginId=18516779956&signtype=am&signtime=1532598165&location=长沙
    let that = this;
    if(msg!="wifi"){
      wx.showLoading();
    }
    
    wx.request({
      url: getApp().globalData.baseUrl + "signForMobile/updateLocalSignInfo.if",
      data: {
        loginId: wx.getStorageSync("loginId"),
        signtype: id == 1 ? 'am' : 'pm',
        signtime: res.time,
        location: res.loc
      },
      success: function(data) {
        wx.hideLoading();
        console.log(data);
        var daynum = new Date((res.time)*1000).getDay();
        if (daynum == 0 || daynum == 6){
          wx.showToast({
            title: "签到成功！",
            icon: 'none',
            duration: 3000,
            mask: true
          });
        }else{
          wx.showToast({
            title: data.data.msg,
            icon: 'none',
            duration: 3000,
            mask: true
          });
        }
       

      },
      fail: function() {
        wx.hideLoading();
        wx.showToast({
          title: "服务异常",
          icon: 'none',
          duration: 3000,
          mask: true
        });

      }
    })
  },
  //控件的点击事件
  controltap: function(e) {
    var that = this;
    var id = e.controlId;
    console.log("id",id)
    if (that.data.showModalStatus == 2 && (id == 1 || id == 2)) {
      //WIFI打卡
      console.log('wifi打卡');
      //id 1上班 或者下班
      let rxbdurl = app.globalData.routerUrl+":56789/local/checkin/location";
      let time = parseInt(new Date().getTime() / 1000); //"1532655606";
      let apikey = "Gu3ht5ERnP12W98GrrVw5FGG";
      let company = "1532655606260";
      let sign = md5util.md5(company + time + apikey);
      wx.showLoading();
      setTimeout(function() {
        wx.hideToast()
      }, 1000);
      //that.todaka(that.data.rdst, id);
      wx.request({
        url: rxbdurl,
        data: {
          time: time,
          company: company,
          sign: sign
        },
        success: function(res) {
          console.log(res);
          if (res.data.status == 0) {
            that.todaka(res.data, id,"wifi");
          } else {
            wx.hideLoading();
            wx.showToast({
              title: "打卡失败，请检查网络和考勤模式",
              icon: "none",
              duration: 3000,
              mask: true
            });
          }
        },
        fail: function() {
          wx.hideLoading();
          wx.showToast({
            title: "网络异常，或未使用FogPOD路由设备",
            icon: "none",
            duration: 3000,
            mask: true
          });
        }
      })

    } else{
      //本地打卡（GPS圈内打卡） 
      if (id == 1) {
        wx.getLocation({
          type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用wx.openLocation 的坐标
          success: function(res) {
            console.log("value........" + res.latitude + "," + res.longitude)
            var point = {
              latitude: res.latitude,
              longitude: res.longitude
            };
            that.setData({
              'point': point
            })
            fetch.showAddress(res.latitude, res.longitude);
            var strUrl = "signForMobile/updateSignInfo.if"
            var loginId = wx.getStorageSync("loginId")
            var startWorkTime = util.formatNowTime()
            var signFlag = 'am'
            var adrrNumMobile = res.latitude + "," + res.longitude
            var signAddr = wx.getStorageSync('address')
            if (signAddr == null || signAddr == '') {
              wx.showToast({
                title: "无网络连接",
                icon: "none",
                duration: 2000,
                mask: true
              });
              // that.setData({
              //   toastMsg: '无网络连接',
              //   selected: true,
              // })
              // setTimeout(that.toastHide, 2000)
              return;
            }
            var key = ["loginId", "startWorkTime", "signFlag", 'adrrNumMobile', 'signAddr']
            var value = [loginId, startWorkTime, signFlag, adrrNumMobile, signAddr]
            console.log("value........" + value)
            if (that.data.showModalStatus == 1){
              //本地圈内打卡需判断是否在范围内
              utilHttpRequest.httpRequest(strUrl, key, value,
                function (res) {
                  console.log(res)
                  wx.showToast({
                    title: res.data.msg,
                    icon: "none",
                    duration: 2000,
                    mask: true
                  });
                  // that.setData({
                  //   toastMsg: res.data.msg,
                  //   selected: true,
                  // })
                  // setTimeout(that.toastHide, 2000)
                },
                function (res) { })
            } else {
              //远程打卡，无需验证签到范围，直接保存数据
              var parame = {
                "loc": wx.getStorageSync('address'),
                "time": parseInt(new Date().getTime() / 1000)
              }
              console.log("上班",parame)
              that.todaka(parame, id);

            }
            
          },
          fail: function(err) {
            wx.showToast({
              title: "定位失败",
              icon: "none",
              duration: 2000,
              mask: true
            });
            // that.setData({
            //   toastMsg: '定位失败',
            //   selected: true,
            // })
            // setTimeout(that.toastHide, 2000)
          },
        })
      } else if (id == 2) {
        wx.getLocation({
          type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用wx.openLocation 的坐标
          success: function(res) {
            var latitude = res.latitude
            var longitude = res.longitude
            var point = {
              latitude: latitude,
              longitude: longitude
            };
            that.setData({
              'point': point
            })
            fetch.showAddress(res.latitude, res.longitude)
            var strUrl = "signForMobile/updateSignInfo.if"
            var loginId = wx.getStorageSync("loginId")
            var endWorkTime = util.formatNowTime()
            var signFlag = 'pm'
            var adrrNumMobile = latitude + "," + longitude
            var xbSignAddr = wx.getStorageSync('address')

            if (xbSignAddr == null || xbSignAddr == '') {
              wx.showToast({
                title: "无网络连接",
                icon: "none",
                duration: 2000,
                mask: true
              });
              // that.setData({
              //   toastMsg: '无网络连接',
              //   selected: true,
              // })
              // setTimeout(that.toastHide, 2000)
              return;
            }
            var key = ["loginId", "endWorkTime", "signFlag", 'adrrNumMobile', 'xbSignAddr']
            var value = [loginId, endWorkTime, signFlag, adrrNumMobile, xbSignAddr]
            if (that.data.showModalStatus == 1){
              //本地圈内打卡需判断是否在范围内
              utilHttpRequest.httpRequest(strUrl, key, value,
                function (res) {
                  console.log(res)
                  wx.showToast({
                    title: res.data.msg,
                    icon: "none",
                    duration: 2000,
                    mask: true
                  });
                  // that.setData({
                  //   toastMsg: res.data.msg,
                  //   selected: true,
                  // })
                  // setTimeout(that.toastHide, 2000)
                },
                function (res) { })
            }else{
              //远程打卡，无需验证签到范围，直接保存数据
              var parame={
                "loc": wx.getStorageSync('address'),
                "time":parseInt(new Date().getTime()/1000)
              }
              console.log("下班",parame)
              that.todaka(parame, id);

            }
           
          },
          fail: function(err) {
            wx.showToast({
              title: "定位失败",
              icon: "none",
              duration: 2000,
              mask: true
            });
            // that.setData({
            //   toastMsg: '定位失败',
            //   selected: true,
            // })
            // setTimeout(that.toastHide, 2000)
          }
        })
      } else if (id == 3) {
          console.log('定位中。。。。');
        wx.getLocation({
          type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用wx.openLocation 的坐标
          success: function(res) {
            // success
            var latitude = res.latitude
            var longitude = res.longitude
            var point = {
              latitude: latitude,
              longitude: longitude
            };
            that.setData({
              'point': point
            })
          },
          fail: function(err) {
            wx.showToast({
              title: "定位失败",
              icon: "none",
              duration: 2000,
              mask: true
            });
            // that.setData({
            //   toastMsg: '定位失败',
            //   selected: true,
            // })
            // setTimeout(that.toastHide, 2000)
          },
        })
      } else if (id == 4) {
        wx.navigateTo({
          url: '../calendar/calendar'
        })
      }

    }
  },
  //页面加载的函数
  onLoad: function() {
    new app.WeToast();
    var that = this
    that.setData({
      controlsT: that.data.controls
    });
    setInterval(function() {
      var week = new Date().getDay();
      that.setData({
        week: '星期' + app.chineseDate.years[week]
      });
      that.setData({
        nowDate: util.formatNowDate()
      });
      that.setData({
        nowTime: util.formatNowTime()
      });
    }, 1000);

    //获取用户的当前位置位置
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用wx.openLocation 的坐标
      success: function(res) {
        // success
        var latitude = res.latitude
        var longitude = res.longitude
        var point = {
          latitude: latitude,
          longitude: longitude
        };
        that.setData({
          'point': point
        })
        wx.setStorageSync('adrrNumMobile', latitude + "," + longitude)
        fetch.showAddress(res.latitude, res.longitude)
      }
    })
    var strUrl = "signForMobile/userAddrNum.if"
    var loginId = wx.getStorageSync("loginId")
    var key = ["loginId"]
    var value = [loginId]
    utilHttpRequest.httpRequest(strUrl, key, value,
      function(res) {
        console.log(res)
          for (let n = 0; n < res.data.res.length;n++){
            var adress = res.data.res[n].addrNum.split(",");
              let listcs = [{
                  latitude: adress[0],
                  longitude: adress[1],
                  color: '#7cb5ec88',
                  fillColor: '#7cb5ec88',
                  radius: 100,
                  strokeWidth: 1
              }]
              that.setData({
                  circles: that.data.circles.concat(listcs)  
                   
              })
          }
           /*  that.setData({
            circles: [{
                latitude: adress[0],
                longitude: adress[1],
                color: '#7cb5ec88',
                fillColor: '#7cb5ec88',
                radius: 100,
                strokeWidth: 1
            }]
            }) */
      },
      function(res) {})
  },
  onReady: function(e) {
    //通过id获取map,然后创建上下文
    this.mapCtx = wx.createMapContext("myMap");
  },
  onShow: function() {

  },
  onHide: function() {
    // 生命周期函数--监听页面隐藏
    console.log('onHide')
  },
  onUnload: function() {
    // 生命周期函数--监听页面卸载
    console.log('onUnload')
  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
    console.log('onPullDownRefresh')
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
    console.log('onReachBottom')
  },
  onShareAppMessage: function() {
    // 用户点击右上角分享
    console.log('onShareAppMessage')
    return {
      desc: '', // 分享描述
      path: '/index/index' // 分享路径
    }
  },

  dakatap: function(e) {
    let that = this;
    let v = e.currentTarget.dataset.text;
    console.log(v);

    that.setData({
      showModalStatus: v
    })

    if (v == 2) {
      let ctr = [{
        id: 5,
        position: {
          left: -1,
          top: -1, //530
          width: 375 * wx.getStorageSync("kScreenW"),
          height: 560 * wx.getStorageSync("kScreenH"),
        },
        iconPath: '../../image/daka_bk.jpg',

      }];
      that.setData({
        controls: ctr
      });

      let cst = that.data.controlsT;
      that.setData({
        controls: that.data.controls.concat(cst[0]).concat(cst[1]).concat(cst[3]),
      });
    }

    if (v == 1 || v==3) {
      that.setData({
        controls: that.data.controlsT
      })
    }

  }

})