const app = getApp();

// 请求数据
var loadMore = function (that) {
    var loginId = wx.getStorageSync("loginId");
    var placeList = [{ id: "", name: "全部" }];
    wx.request({
        url: app.globalData.baseUrl + "meetingInformation/selectInformationList.if",
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: "POST",
        data: {
          "loginId": loginId
        },
        success: function (res) {
            if(res.data.length == 0){
                that.setData({
                    placeData : false
                })
            }else{
                res.data.forEach(function (e) {
                    placeList.push({ id: e.meetingRoomId, name: e.meetingRoomName });
                })
                that.setData({
                    placeList: placeList,
                    placeData : true
                })
            }
        }
    });
}

/**
 * 我的预约记录
 * @param  {[type]} that          [description]
 * @param  {[type]} meetingRoomId 会议室Id
 * @param  {[type]} meetingName   会议名称
 * @param  {[type]} startTime     开始日期
 * @param  {[type]} endTime       结束日期
 * @param  {[type]} days          会议天数
 * @param  {[type]} page          第几页
 * @param  {[type]} rows          每页几条
 * @param  {[type]} success       成功的回调函数  
 * @param  {[type]} fail          失败的回调函数  
 * @param  {[type]} complete      结束的回调函数 
 * @return {[type]}               [description]
 */
var myBespeakListLoad = function (that, meetingRoomId, meetingName, dateStart, dateEnd, meetingDays, page, rows, success, fail, complete) {
    var dateStart = dateStart;
    if(dateStart == "开始日期"){
        dateStart = "";
    }
    var dateEnd = dateEnd;
    if(dateEnd == "结束日期"){
        dateEnd = "";
    }
    wx.request({
        url: app.globalData.baseUrl + "wxMeetingInterface/meetingReserveRecordList.if",
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: "POST",
        data: {
            "meetingroom_id": meetingRoomId,
            "meeting_name": meetingName,
            "start_time": dateStart,
            "end_time": dateEnd,
            "days": meetingDays,
            "apply_user": wx.getStorageSync('loginId'),
            "rows": rows,
            "page": page,
            "loginId": wx.getStorageSync("loginId")
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
        placeColor: "",  // 存放会议地点ID，字体换色
        placeList: [], // 存放会议地点对象
        myBaspeakList: [], // 存放我的预约记录列表
        meetingName: "", // 会议名称
        meetingDays: "", // 会议天数
        dateStart: '开始日期',
        pickerDateStart: '',
        dateEnd: '结束日期',
        pickerEnd: '',
        meetingData: false, // 会议室有没有数据
        placeOpen: false,  // 会议地点点击
        placeShow: false, // 会议地点显示
        placeData: false, // 会议地点有没有数据
        filterOpen: false,  // 筛选点击
        filterShow: false, // 筛选显示
        isfull: false, // 涂层
        shownavindex: '', // 地区筛选值
        scrollHeight: 0, // 高度
        page: 1,   // 设置加载的第几次，默认是第一次  
        rows: 10,      //返回数据的个数  
        searchLoadingComplete: false  //“没有数据”的变量，默认false，隐藏 
    },
    onLoad: function () {
        var that = this;
        var myBaspeakList = [];
        wx.getSystemInfo({
            success:function(res){
                that.setData({
                   scrollHeight:res.windowHeight - 40
                });
            }
        });
        loadMore(that);
        myBespeakListLoad(that, "", "", "", "", "", that.data.page, that.data.rows, function(res){
            if(res.data.rows.length == 0){
                that.setData({
                    meetingData : false
                })
            }else{
                res.data.rows.forEach(function (e) {
                    myBaspeakList.push({reserveId:e.reserve_id, meetingName:e.meeting_name, meetingRoomName:e.meetingroom_name, startTime:e.start_time, endTime:e.end_time});
                })
                that.setData({
                    myBaspeakList: myBaspeakList,
                    meetingData: true
                })
            }
        }, function(res){}, function(res){});
    },
    placeList: function (e) {
        if (this.data.placeOpen) {
            this.setData({
                placeOpen: false,
                filterOpen: false,
                placeShow: false,
                filterShow: true,
                isfull: false,
                shownavindex: 0
            })
        } else {
            this.setData({
                content: this.data.placeList,
                placeOpen: true,
                filterOpen: false,
                placeShow: false,
                filterShow: true,
                isfull: true,
                shownavindex: e.currentTarget.dataset.nav
            })
        }
    },
    filterClick: function (e) {
        if (this.data.filterOpen) {
            this.setData({
                placeOpen: false,
                filterOpen: false,
                placeShow: true,
                filterShow: false,
                isfull: false,
                shownavindex: 0
            })
        } else {
            this.setData({
                placeOpen: false,
                filterOpen: true,
                placeShow: true,
                filterShow: false,
                isfull: true,
                shownavindex: e.currentTarget.dataset.nav
            })
        }
    },
    hidebg: function (e) {
        this.setData({
            placeOpen: false,
            filterOpen: false,
            placeShow: true,
            filterShow: true,
            isfull: false,
            shownavindex: 0
        })
    },
    // 会议地点点击事件
    placeClick: function (e) {
        var that = this;
        that.setData({
           placeColor : e.currentTarget.dataset.id,

        });
        var myBaspeakList = [];
        myBespeakListLoad(that, e.currentTarget.dataset.id, "", "", "", "", 1, that.data.rows, function(res){
             if(res.data.rows.length == 0){
                that.setData({
                    meetingData : false,
                    page: 1,
                    searchLoadingComplete: false,
                    placeOpen: false,
                    filterOpen: false,
                    placeShow: false,
                    filterShow: true,
                    isfull: false,
                    shownavindex: 0
                })
            }else{
                res.data.rows.forEach(function (e) {
                    myBaspeakList.push({reserveId:e.reserve_id, meetingName:e.meeting_name, meetingRoomName:e.meetingroom_name, startTime:e.start_time, endTime:e.end_time});
                })
                that.setData({
                    myBaspeakList: myBaspeakList,
                    meetingData: true,
                    page: 1,
                    searchLoadingComplete: false,
                    placeOpen: false,
                    filterOpen: false,
                    placeShow: false,
                    filterShow: true,
                    isfull: false,
                    shownavindex: 0
                })
            }
        }, function(res){}, function(res){});
    },
    bindDateChangeStart: function (e) {
        this.setData({
            dateStart: e.detail.value,
            pickerDateStart: e.detail.value
        })
    },
    bindDateChangeEnd: function (e) {
        this.setData({
            dateEnd: e.detail.value,
            pickerEnd: e.detail.value
        })
    },
    bindMeetingNameChange: function (e){
        this.setData({
            meetingName: e.detail.value
        })
    },
    bindMeetingDaysChange: function (e){
        this.setData({
            meetingDays: e.detail.value
        })
    },
    // 筛选条件确定
    filterBtnClick: function (e) {
        var that = this;
        that.setData({
          page: 1
        })
        var myBaspeakList = [];
        myBespeakListLoad(that, that.data.placeColor,  that.data.meetingName, that.data.dateStart, that.data.dateEnd, that.data.meetingDays, that.data.page, that.data.rows, function(res){
            wx.showToast({
                  title: '筛选成功',
                  icon: 'success',
                  duration: 1000
            })
            if(res.data.rows.length == 0){
                that.setData({
                    meetingData : false,
                    placeOpen: false,
                    filterOpen: false,
                    placeShow: true,
                    filterShow: false,
                    isfull: false,
                    shownavindex: 0
                })
            }else{
                res.data.rows.forEach(function (e) {
                    myBaspeakList.push({reserveId:e.reserve_id, meetingName:e.meeting_name, meetingRoomName:e.meetingroom_name, startTime:e.start_time, endTime:e.end_time});
                })  
                that.setData({
                    myBaspeakList: myBaspeakList,
                    meetingData: true,
                    placeOpen: false,
                    filterOpen: false,
                    placeShow: true,
                    filterShow: false,
                    isfull: false,
                    shownavindex: 0,
                    searchLoadingComplete: false
                })
            }
        }, function(res){}, function(res){})
    },
    // 重置按钮点击事件
    resetBtnClick:function(e){
        wx.showToast({
            title: '重置成功',
            icon: 'success',
            duration: 1000
        })
        this.setData({
            meetingName: "",
            meetingDays: "",
            dateStart: "开始日期",
            pickerDateStart: "",
            dateEnd: "结束日期",
            pickerEnd: ""
        })
    },
    // 详情
    meetingReserveClick: function(e){
        wx.navigateTo({
          url: '../meetingDetail/meetingDetail?reserveId=' + e.currentTarget.dataset.id
        })
    },
    // 下拉刷新
    bindUpLoad: function(){
        var that = this;
        var myBaspeakList = [];
        wx.showNavigationBarLoading(); //在标题栏中显示加载
    　　wx.showToast({
            title: '刷新中...',
            icon: 'loading',
            duration: 2000
        });
        myBespeakListLoad(that, that.data.placeColor, that.data.meetingName, that.data.dateStart, that.data.dateEnd, that.data.meetingDays, 1, that.data.rows, function(res){
            wx.hideToast();
            wx.showToast({
                  title: '刷新成功',
                  icon: 'success',
                  duration: 1000
            })
            if(res.data.rows.length == 0){
                that.setData({
                    meetingData : false
                })
            }else{
                res.data.rows.forEach(function (e) {
                    myBaspeakList.push({reserveId:e.reserve_id, meetingName:e.meeting_name, meetingRoomName:e.meetingroom_name, startTime:e.start_time, endTime:e.end_time});
                })
                that.setData({
                    myBaspeakList: myBaspeakList,
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
        var myBaspeakList = [];
        if(!that.data.searchLoadingComplete){  
            wx.showToast({
                title: '加载中...',
                icon: 'loading',
                duration: 2000
            })
            that.setData({
                page: that.data.page + 1  //每次触发上拉事件，把page+1 
            }); 
            myBespeakListLoad(that, that.data.placeColor,  that.data.meetingName, that.data.dateStart, that.data.dateEnd, that.data.meetingDays, that.data.page, that.data.rows, function(res){
               if(res.data.rows.length == 0){
                    that.setData({
                        searchLoadingComplete: true
                    })
                 }else{
                    res.data.rows.forEach(function (e) {
                        myBaspeakList.push({reserveId:e.reserve_id, meetingName:e.meeting_name, meetingRoomName:e.meetingroom_name, startTime:e.start_time, endTime:e.end_time});
                    })  
                    wx.showToast({
                      title: '加载成功',
                      icon: 'success',
                      duration: 1000
                    })
                    that.setData({
                        myBaspeakList: that.data.myBaspeakList.concat(myBaspeakList),
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

    }
})