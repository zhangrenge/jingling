const app = getApp();

// 请求数据
var loadMore = function (that) {
    var regionList = [{ id: "", name: "全部" }];
    var loginId = wx.getStorageSync("loginId");
    wx.request({
        url: app.globalData.baseUrl + "meetingPlatForm/selectPlatFormList.if",
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: "POST",
        data: {
          "loginId": loginId
        },
        success: function (res) {
            if(res.data.length == 0){
                that.setData({
                    regionData : false
                })
            }else{
                res.data.forEach(function (e) {
                    regionList.push({ id: e.platFormId, name: e.platFormName });
                })
                // typeList: [{ id: "", name: "全部" }, { id: "1", name: "部门内部" }, { id: "2", name: "公司" }, { id: "3", name: "内部" }]
                that.setData({
                    regionList: regionList,
                    regionData : true,
                    typeList: []
                })
            }
            
            
        }
    });
}

// 会议室列表
var meetingListLoad = function (that, platFormId, page, rows, success, fail, complete) {
  var loginId = wx.getStorageSync("loginId");
    wx.request({
        url: app.globalData.baseUrl + "wxMeetingInterface/wxMeetingRoom.if",
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: "POST",
        data: {
            "platFormId":platFormId,
            "rows":rows,
            "page":page,
            "loginId": loginId
        },
        success: function (res) {
           success(res);
        },
        fail: function(res) {
            fail(res);
        },
        complete: function(res) {
            complete(res);
        }
    });
}

Page({
    data: {
        content: [], // 假数据
        regionColor: "",  // 存放地区ID，字体换色
        regionList: [], // 存放地区对象
        typeColor: "",  // 存放类别ID，字体换色
        typeList: [], // 存放类别对象
        meetingRoomList:[], // 存放会议列表
        meetingData: false, // 会议室有没有数据
        regionOpen: false,  // 地区点击
        regionShow: false, // 地区显示
        regionData: false, // 地区有没有数据
        typeOpen: false,  // 类别点击
        typeShow: false, // 类别显示
        typeData: false, // 类别有没有数据
        isfull: false, // 涂层
        shownavindex: '', // 地区类别值
        scrollHeight:0, // 高度
        page: 1,   // 设置加载的第几次，默认是第一次  
        rows: 10,      //返回数据的个数  
        searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏 
        upLoadFlag: true
    },
    onLoad: function () {
        var that = this;
        var meetingRoomList = [];
        wx.getSystemInfo({
            success:function(res){
                that.setData({
                   scrollHeight:res.windowHeight - 40
                });
            }
        });
        loadMore(that);
        meetingListLoad(that, "", that.data.page, that.data.rows, function(res){
             if(res.data.rows.length == 0){
                that.setData({
                    meetingData : false
                })
            }else{
                res.data.rows.forEach(function (e) {
                    var equipmentName = e.equipmentName;
                    var startTime = e.startTime;
                    var endTime = e.endTime;
                    if(startTime != null){
                        startTime = startTime.substring(11, 16);
                    }
                    if(endTime != null){
                        endTime = endTime.substring(11, 16);
                    }
                    if(equipmentName != null){
                        if(equipmentName.length > 14){
                            equipmentName = equipmentName.substring(0, 13) + "...";
                        }
                    }
                    meetingRoomList.push({meetingRoomId:e.meetingRoomId, uploadPath:e.uploadPath, meetingRoomName:e.meetingRoomName, meetingState:e.meetingState,meetingRoomSize:e.meetingRoomSize, startTime:startTime, endTime:endTime, equipmentName:equipmentName});
                })
                that.setData({
                    meetingRoomList: meetingRoomList,
                    meetingData: true
                })
            }
        }, function(res){}, function(res){});
    },
    regionList: function (e) {
        if (this.data.regionOpen) {
            this.setData({
                regionOpen: false,
                typeOpen: false,
                regionShow: false,
                typeShow: true,
                isfull: false,
                shownavindex: 0
            })
        } else {
            this.setData({
                content: this.data.regionList,
                regionOpen: true,
                typeOpen: false,
                regionShow: false,
                typeShow: true,
                isfull: true,
                shownavindex: e.currentTarget.dataset.nav
            })
        }
    },
    typeList: function (e) {
        if (this.data.typeOpen) {
            this.setData({
                regionOpen: false,
                typeOpen: false,
                regionShow: true,
                typeShow: false,
                isfull: false,
                shownavindex: 0
            })
        } else {
            this.setData({
                content: this.data.typeList,
                regionOpen: false,
                typeOpen: true,
                regionShow: true,
                typeShow: false,
                isfull: true,
                shownavindex: e.currentTarget.dataset.nav
            })
        }
    },
    hidebg: function (e) {
        this.setData({
            regionOpen: false,
            typeOpen: false,
            regionShow: true,
            typeShow: true,
            isfull: false,
            shownavindex: 0
        })
    },
    // 地区点击事件
    regionClick: function (e) {
        var that = this;
        that.setData({
           regionColor : e.currentTarget.dataset.id,

        });
        var meetingRoomList = [];
        meetingListLoad(that, e.currentTarget.dataset.id, 1, that.data.rows, function(res){
             if(res.data.rows.length == 0){
                that.setData({
                    meetingData : false,
                    page: 1,
                    searchLoadingComplete: false,
                    regionOpen: false,
                    typeOpen: false,
                    regionShow: false,
                    typeShow: true,
                    isfull: false,
                    shownavindex: 0
                })
            }else{
                res.data.rows.forEach(function (e) {
                    var equipmentName = e.equipmentName;
                    var startTime = e.startTime;
                    var endTime = e.endTime;
                    if(startTime != null){
                        startTime = startTime.substring(11, 16);
                    }
                    if(endTime != null){
                        endTime = endTime.substring(11, 16);
                    }
                    if(equipmentName != null){
                        if(equipmentName.length > 14){
                            equipmentName = equipmentName.substring(0, 13) + "...";
                        }
                    }
                    meetingRoomList.push({meetingRoomId:e.meetingRoomId, uploadPath:e.uploadPath, meetingRoomName:e.meetingRoomName, meetingState:e.meetingState,meetingRoomSize:e.meetingRoomSize, startTime:startTime, endTime:endTime, equipmentName:equipmentName});
                })
                that.setData({
                    meetingRoomList: meetingRoomList,
                    meetingData: true,
                    page: 1,
                    searchLoadingComplete: false,
                    regionOpen: false,
                    typeOpen: false,
                    regionShow: false,
                    typeShow: true,
                    isfull: false,
                    shownavindex: 0
                })
            }
        }, function(res){}, function(res){});
    },
    // 类别点击事件
    typeClick: function (e) {
        this.setData({
            typeColor: e.currentTarget.dataset.id
        });
    },
    // 会议室详情
    meetingRoomClick: function(e){
        wx.navigateTo({
            url: '../meetingReserveList/meetingReserveList?roomId=' + e.currentTarget.dataset.id
        })
    },
    // 我的记录事件
    bespeakClick: function(e){
        wx.navigateTo({
            url: '../myRecord/myRecord'
        })
    },
    // 下拉刷新
    bindUpLoad: function(){
        var that = this;
        var meetingRoomList = [];
        wx.showNavigationBarLoading(); //在标题栏中显示加载
    　　wx.showToast({
            title: '刷新中...',
            icon: 'loading',
            duration: 2000
        });
        meetingListLoad(that, that.data.regionColor, 1, that.data.rows, function(res){
            wx.hideToast();
            wx.showToast({
                  title: '刷新成功',
                  icon: 'success',
                  duration: 1000
            })
            if(res.data.rows.length == 0){
                that.setData({
                    meetingData : false,
                    page: 1,
                    searchLoadingComplete: false
                })
            }else{
                res.data.rows.forEach(function (e) {
                    var equipmentName = e.equipmentName;
                    var startTime = e.startTime;
                    var endTime = e.endTime;
                    if(startTime != null){
                        startTime = startTime.substring(11, 16);
                    }
                    if(endTime != null){
                        endTime = endTime.substring(11, 16);
                    }
                    if(equipmentName != null){
                        if(equipmentName.length > 14){
                            equipmentName = equipmentName.substring(0, 13) + "...";
                        }
                    }
                    meetingRoomList.push({meetingRoomId:e.meetingRoomId, uploadPath:e.uploadPath, meetingRoomName:e.meetingRoomName, meetingState:e.meetingState,meetingRoomSize:e.meetingRoomSize, startTime:startTime, endTime:endTime, equipmentName:equipmentName});
                })
                that.setData({
                    meetingRoomList: meetingRoomList,
                    meetingData: true,
                    page: 1, 
                    searchLoadingComplete: false
                })
            }
        }, function(res){}, function(res){
                wx.hideNavigationBarLoading(); //完成停止加载
                wx.stopPullDownRefresh(); //停止下拉刷新
            });
    },
    // 上拉加载
    bindDownLoad: function(){
        var that = this; 
        var meetingRoomList = [];
        if(!that.data.searchLoadingComplete){  
            wx.showToast({
                title: '加载中...',
                icon: 'loading',
                duration: 2000
            })
            that.setData({
                page: that.data.page + 1  //每次触发上拉事件，把page+1 
            }); 
            meetingListLoad(that, that.data.regionColor, that.data.page, that.data.rows, function(res){
               if(res.data.rows.length == 0){
                        that.setData({
                            searchLoadingComplete : true
                        })
                }else{
                    res.data.rows.forEach(function (e) {
                        var equipmentName = e.equipmentName;
                        var startTime = e.startTime;
                        var endTime = e.endTime;
                        if(startTime != null){
                            startTime = startTime.substring(11, 16);
                        }
                        if(endTime != null){
                            endTime = endTime.substring(11, 16);
                        }
                        if(equipmentName != null){
                            if(equipmentName.length > 14){
                                equipmentName = equipmentName.substring(0, 13) + "...";
                            }
                        }
                        meetingRoomList.push({meetingRoomId:e.meetingRoomId, uploadPath:e.uploadPath, meetingRoomName:e.meetingRoomName, meetingState:e.meetingState,meetingRoomSize:e.meetingRoomSize, startTime:startTime, endTime:endTime, equipmentName:equipmentName});
                    })
                    wx.showToast({
                      title: '加载成功',
                      icon: 'success',
                      duration: 1000
                    })
                    that.setData({
                        meetingRoomList: that.data.meetingRoomList.concat(meetingRoomList),
                        meetingData: true
                    })
                }
            }, function(res){}, function(res){
                if(that.data.searchLoadingComplete){
                    wx.showToast({
                        title: '已加载全部',
                        icon: 'success',
                        duration: 1000
                    })
                }
            })
        }else{
            wx.showToast({
                title: '已加载全部',
                icon: 'success',
                duration: 1000
            })
        }
    },
    // 用户点击右上角分享
    onShareAppMessage: function () {

    },
    /**
    * 生命周期函数--监听页面显示
    */
    onShow: function () {
        var that = this;
        var meetingRoomList = [];
        that.setData({
            
        })
        wx.getSystemInfo({
            success:function(res){
                that.setData({
                   scrollHeight:res.windowHeight - 40,
                   searchLoadingComplete: false,
                   page: 1
                });
            }
        });
        loadMore(that);
        meetingListLoad(that, that.data.regionColor, that.data.page, that.data.rows, function(res){
             if(res.data.rows.length == 0){
                that.setData({
                    meetingData : false
                })
            }else{
                res.data.rows.forEach(function (e) {
                    var equipmentName = e.equipmentName;
                    var startTime = e.startTime;
                    var endTime = e.endTime;
                    if(startTime != null){
                        startTime = startTime.substring(11, 16);
                    }
                    if(endTime != null){
                        endTime = endTime.substring(11, 16);
                    }
                    if(equipmentName != null){
                        if(equipmentName.length > 14){
                            equipmentName = equipmentName.substring(0, 13) + "...";
                        }
                    }
                    meetingRoomList.push({meetingRoomId:e.meetingRoomId, uploadPath:e.uploadPath, meetingRoomName:e.meetingRoomName, meetingState:e.meetingState,meetingRoomSize:e.meetingRoomSize, startTime:startTime, endTime:endTime, equipmentName:equipmentName});
                })
                that.setData({
                    meetingRoomList: meetingRoomList,
                    meetingData: true
                })
            }
        }, function(res){}, function(res){});
    }
})