var util = require('../../../utils/util.js');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    submitDisabled:false,
    deleteUserId:'',
    reserveId:'',
    meetingRoomId:'',
    platFormId:'',
    oldRoomId:'',
    roomSize:'',
    meetingName:'',
    meetingRemark:'',
    companyName:[],
    platformId2:[],
    companyIndex: 0,
    roomId:[],
    roomName:[],
    roomIndex:0,
    relationId:[],
    participantName:[],
    participantId:[],
    participantInfo:[],
    participantIndex:0,
    pIds:[],
    showView:true,
    showDate:false,
    applyDept:'',
    applyUser:'',
    applyPhone:'',
    isPeriodicIndex: 0,
    isPeriodicArea: ['否', '是'],
    isPeriodic: '否',
    isRemindingsIndex:0,
    isRemindingsArea:['站内信','短信','邮箱'],
    isRemindings:'站内信',
   
    chooseParticipant: [
    ],
    originalParticipant:[
    ],
    chooseDate:[],
    dateStart: util.formatDateMine(new Date()),
    dateEnd: util.formatDateMine(new Date()),
    pickerStart:'',
    pickerEnd: '',
    oldStartTime:'',
    oldEndTIme:'',
  
    cycleStart: util.formatAfterDate(),
    timeStart: util.formatTimeMine(new Date()),
    timeEnd: util.formatTimeMine(new Date()),
    pickerTimeStart:'',
    pickerTimeEnd: '',
    userName: '',    
    loginId: '',
    startDate: util.formatDateMine(new Date()) + " " + util.formatTimeMine(new Date()) + ":00",
    endDate: util.formatDateMine(new Date()) + " " + util.formatTimeMine(new Date()) + ":00"
  },
  meetingNameInput:function (e){
    this.setData({
      meetingName: e.detail.value

    })
  },
  bindPickerChangeIsPeriodic: function (e) {
    var selectId = e.detail.value;
    var flag = false;
    if (selectId == "0") {
      flag = false;
      var dates = this.data.chooseDate;
      dates = [];
      this.setData({
        chooseDate: dates

      })

    } else if (selectId == "1") {
      flag = true;
    }
   
    this.setData({
      showDate: flag,
      isPeriodicIndex: e.detail.value,
      isPeriodic: this.data.isPeriodicArea[e.detail.value]
    })
  },
  bindPickerChangeIsRemindings:function(e){
    var selectId = e.detail.value;
    this.setData({
    
      isRemindingsIndex: e.detail.value,
      isRemindings: this.data.isRemindingsArea[e.detail.value]
    })
  },
  companyPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      companyIndex: e.detail.value
     
    })
    //获取选择的平台公司的id
    var roomId = [];
    var roomName = [];
    var platformId2 = this.data.platformId2[e.detail.value];
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + 'meetingReserve/selectInformationList.if',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        platFormId: platformId2,
        loginId: wx.getStorageSync('loginId')
      },
      success: function (res) {
        var data = res.data
        var status = data.status;
        if (status == true) {
          var msg = data.msg;
          for (var i = 0; i < msg.length; i++) {
            roomId.push(msg[i].meetingRoomId)
            roomName.push(msg[i].meetingRoomName)
          }
          that.setData({
            roomName: roomName,
            roomId:roomId,
            roomIndex:0

          })
          //在选的平台公司时初始第一个会议地点限制人数，防止第一会议室地点就是用户所需，用户如果不再次选择，就不触发roomPickerChange，导致没有初始化会议室容纳人数
          wx.request({
            url: app.globalData.baseUrl + 'meetingReserve/selectpeopleNumber.if',
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            data: {
              roomId: roomId[0]
            },
            success: function (res) {
              var data = res.data
              var status = data.status;
              if (status == true) {
                var msg = data.msg;
                var roomSize = msg.meetingRoomSize
                that.setData({
                  roomSize: roomSize

                })

              }
            }
          })


        }
      }
    })
   
  },
  roomPickerChange: function (e) {
    var that = this;//这里添加这句下面的that才能用
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      roomIndex: e.detail.value
    })
    var roomId = this.data.roomId[e.detail.value];
    wx.request({
      url: app.globalData.baseUrl + 'meetingReserve/selectpeopleNumber.if',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        roomId: roomId
      },
      success: function (res) {
        var data = res.data
        var status = data.status;
        if (status == true) {
          var msg = data.msg;
          var roomSize = msg.meetingRoomSize
          that.setData({
            roomSize: roomSize

          })
        
        }
      }
    })

  },
  participantPickerChange:function(e){
    this.setData({
      participantIndex: e.detail.value
    })
    var olddata = this.data.chooseParticipant;
    var userId = this.data.participantId[e.detail.value];
    var userName = this.data.participantName[e.detail.value];
    var userIds = [];
    for(var i=0;i<olddata.length;i++){
      userIds.push(olddata[i].id);
    }

    if (userIds.indexOf(userId)==-1){
      var mess = {
        id: userId,
        name: userName
      }
      olddata.push(mess);
    }
    console.log(olddata)
    this.setData({
      chooseParticipant: olddata
    })
    
  },
  deleteUser:function(e){

    var userId = e.target.dataset.remindid;
    var rid = e.target.dataset.rid;
    var data = this.data.chooseParticipant;
    for(var i=0;i<data.length;i++){
      if (data[i].id == userId){
        data.splice(i,1);
     } 
    }
    var reserveId = this.data.reserveId;
    var deleteUserId=this.data.deleteUserId;
    if (reserveId != '' && rid!=undefined){
      //修改
      if(deleteUserId==''){
        deleteUserId = rid;
      }else{
        deleteUserId = deleteUserId + "," + rid;
      }
      this.setData({
        deleteUserId: deleteUserId
      })

    }
    this.setData({
      chooseParticipant: data
    })
   
  },
  deleteDate:function(e){
    
    var date = e.target.dataset.remindid;
    var dates = this.data.chooseDate;
    for (var i = 0; i < dates.length; i++) {
      if (dates[i].date == date) {
        dates.splice(i, 1);
      }
    }
    this.setData({
      chooseDate: dates
    })
  },
 /** selectOk: function (event) {
    var selectId = event.target.dataset.chooseid;
    var that = this;
  
    for (var i = 0; i < this.data.chooses.length; i++) {
      if (this.data.chooses[i].id == selectId) {
        this.data.chooses[i].isSelect = true
      } else {
        this.data.chooses[i].isSelect = false
      }
    }
    this.setData({
      chooses: this.data.chooses,
      
    })
    var flag = false;
    if (selectId=="0"){
      flag = false;
      var dates = this.data.chooseDate;
      dates = [];
      this.setData({
        chooseDate: dates

      })

    } else if (selectId=="1"){
      flag = true;
    }
    this.setData({
      showDate: flag

    })
  },*/
  bindMultiPickerColumnChange:function(e){
   var that = this;
    var column = e.detail.column;
    if (column=='0'){
       
        var deptId = that.data.deptId[e.detail.value];
      
        //根据部门id查询部门下的人员
        var userId=[];
        var userName = [];
        wx.request({
          url: app.globalData.baseUrl + 'meetingReserveInterface/queryUserFromDept.if',
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          data: {
            deptId: deptId,
            "loginId": wx.getStorageSync('loginId')
          },
          success: function (res) {
            var data = res.data
            var status = data.status;
            if (status == true) {
              var msg = data.msg;
              for (var i = 0; i < msg.length; i++) {
                userId.push(msg[i].loginId)
                userName.push(msg[i].userName)
              }
            
              that.data.multiArray[1] = userName;
            
              that.setData({
                multiArray: that.data.multiArray,

              })
          
            }
          }
        })
    }
  },
  canhuiUser:function(e){
   var val =  e.detail.value;
   var info = this.data.participantInfo;
    var name = [];
    var id = [];
    for(var i=0;i<info.length;i++){
      var pid = info[i].id;
      var pname = info[i].name;
      if(pname.indexOf(val)>-1){
        name.push(pname)
        id.push(pid)
      }
    }
   
    this.setData({
      participantName: name,
      participantId:id,
      participantIndex:0
    })
  },
  applyPhoneInput:function(e){
    this.setData({
      applyPhone:e.detail.value
    })
  },
  /**bindPickerChangeIsTicket: function (e) {
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
  },*/
  bindDateChangeStart: function (e) {
    var dateEnd = this.data.dateEnd;
    this.setData({
      dateStart: e.detail.value.replace(/-/g, "/"),
      dateEnd: e.detail.value.replace(/-/g, "/"),
      startDate: e.detail.value.replace(/-/g, "/") + " " + this.data.timeStart + ":00",
      endDate: e.detail.value.replace(/-/g, "/") + " " + this.data.timeEnd + ":00",
      cycleStart: util.formatDaySumOne(e.detail.value).replace(/-/g, "/"),
      chooseDate:[],
      showView:true
    })
  },
  bindDateChangeEnd: function (e) {
    var dateStart = this.data.dateStart;
    var dateEnd = e.detail.value.replace(/-/g, "/");
    var flag =  this.data.showView;
    var dates = this.data.chooseDate;
    var dateFlag = this.data.showDate;
   // var choose =this.data.chooses;
    if (dateStart != dateEnd){
      flag = false;
      dates = [];
      dateFlag = false;
     // for(var i=0;i<choose.length;i++){
    //  if(choose[i].id=="0"){
     //   choose[i].isSelect = true;
     // }else{
     //   choose[i].isSelect = false;
     // }
      //}
    }else{
      flag = true;
    }
    this.setData({
     // chooses: choose,
      isPeriodicIndex: 0,
      showDate: dateFlag,
      chooseDate:dates,
      showView:flag,
      dateEnd: e.detail.value.replace(/-/g, "/"),
      endDate: e.detail.value.replace(/-/g, "/") + " " + this.data.timeEnd + ":00",
      cycleStart: util.formatDaySumOne(e.detail.value).replace(/-/g, "/")
    })
  },
  bindTimeChangeStart: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      timeStart: e.detail.value,
     // timeEnd: e.detail.value,
      startDate: this.data.dateStart + " " + e.detail.value + ":00",
      endDate: this.data.dateEnd + " " + e.detail.value + ":00"
    })
  },
  bindTimeChangeEnd: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var days = util.getDays(this.data.startDate, this.data.dateEnd + " " + e.detail.value + ":00");
  
    this.setData({
      timeEnd: e.detail.value,
      endDate: this.data.dateEnd + " " + e.detail.value + ":00",
      businessDays: days
    })
  },
  bindCycleDateChange:function (e){
   var date =  e.detail.value.replace(/-/g, "/");
   var choseDate = this.data.chooseDate;
   var newArr = [];
   for(var i=0;i<choseDate.length;i++){
     newArr.push(choseDate[i].date);
   }
   if (newArr.indexOf(date)==-1){
     var m = { date: date };
     choseDate.push(m);
  }
  /** if (choseDate.length==0){
    
   }else{
     var flag = false;
     for (var i = 0; i < choseDate.length; i++) {
       if (choseDate[i].date != date) {
         flag = true;
       }else{
         flag = false;
         break;
       }
     }
      if(flag){
        var m = { date: date };
        choseDate.push(m);
      }
   }*/
   this.setData({
     chooseDate: choseDate
   })
  

  },
  textAreaBlur: function (e) {
    this.setData({
      meetingRemark: e.detail.value
    })
  },
   formatDate:function (dateStr) {
    if(dateStr != undefined) {
      var saveDate = new Date(dateStr);
      return saveDate.getTime();
    }

  },
  evaSubmit: function (res) {
    var reserveId = this.data.reserveId;
    var ntime = new Date().getTime();
   var stime = this.formatDate(this.data.dateStart + " " + this.data.timeStart);
   var etime = this.formatDate(this.data.dateEnd + " " + this.data.timeEnd);
   var after30Time = 0.5*60 * 60 * 1000;


   if(stime<ntime){
     this.wetoast.toast({
       title: '会议开始时间必须大于当前时间！'
     })
     return;
   }
   if (etime<stime){
     this.wetoast.toast({
       title: '会议结束时间必须大于会议开始时间！'
     })
     return;
   }
    //if ((etime - stime) < after30Time) {
      //this.wetoast.toast({
        //title: '会议周期必须大于30分钟！'
      //})
      //return;
    //}


    var that = this;
    var meetingName = that.data.meetingName;
    if (meetingName==""){
      this.wetoast.toast({
        title: '会议主题不能为空！'
      })
      return;
    } else if (meetingName.length>30){

      this.wetoast.toast({
        title: '会议主题最多输入30个字符!'
      })
      return;
    }
    var chooseParticipant = this.data.chooseParticipant;
    if (chooseParticipant.length==0){
      this.wetoast.toast({
        title: '请选择参会人员！'
      })
      return;
    }
    var roomSize = this.data.roomSize;
    if (chooseParticipant.length > roomSize){
      this.wetoast.toast({
        title: '参会人数大于会议室容纳人数，请调整！'
      })
      return;
    }
    //返回之前按钮不可按
    var that = this;
    that.setData({
      submitDisabled: true
    });
   
    var rem = this.data.isRemindingsIndex;
    var sendType="1";
    if (rem=="0"){
      sendType ="1";
    } else if (rem=="1"){
      sendType = "2";
    } else if (rem=="2"){
      sendType = "3";
    }
   
    var chflag = this.data.isPeriodicIndex;
   
    //参会人员
    var participant = [];
   
    for (var i = 0; i < chooseParticipant.length; i++) {
      var loginId = {};
      loginId["loginId"] = chooseParticipant[i].id;
      participant.push(loginId);
    }
    var reserveParam;
    var jsonarray = [];
    var params = {
      meeting_name: this.data.meetingName,
      start_time: this.data.dateStart + " " + this.data.timeStart,
      end_time: this.data.dateEnd + " " + this.data.timeEnd,
      platform_id: this.data.platformId2[this.data.companyIndex],
      meetingroom_id: this.data.roomId[this.data.roomIndex],
      apply_user: wx.getStorageSync('loginId'),
      apply_phone: this.data.applyPhone,
      sendType: sendType,
      remark: this.data.meetingRemark,
      periodic_meeting:"1"
    }
    
  var url = "";
    if(reserveId=='' || reserveId==undefined){
      jsonarray.push(params);
      //添加
      url = app.globalData.baseUrl + 'meetingReserveInterface/addReserveInfo.if';
      //判断是否为周期性会议
      if (chflag == "1") {//周期性会议 批量录入会议室预定信息
     
        var chooseDate = this.data.chooseDate;
        
        if (chooseDate.length > 0) {
          for (var i = 0; i < chooseDate.length; i++) {
            var params1 = {
              meeting_name: this.data.meetingName,
              start_time: this.data.dateStart + " " + this.data.timeStart,
              end_time: this.data.dateEnd + " " + this.data.timeEnd,
              platform_id: this.data.platformId2[this.data.companyIndex],
              meetingroom_id: this.data.roomId[this.data.roomIndex],
              apply_user: wx.getStorageSync('loginId'),
              apply_phone: this.data.applyPhone,
              sendType: sendType,
              remark: this.data.meetingRemark,
              periodic_meeting: "1"
            }
            params1["periodic_meeting"] = "0";
            params1["start_time"] = chooseDate[i].date + " " + this.data.timeStart;
            params1["end_time"] = chooseDate[i].date + " " + this.data.timeEnd;
            jsonarray.push(params1)
          }
        }
      }


      reserveParam = { reserve: JSON.stringify(jsonarray), participant: JSON.stringify(participant), loginId: wx.getStorageSync('loginId') }; 
    }else{
    //修改
      url = app.globalData.baseUrl + 'meetingReserveInterface/editReserveInfo.if';
      params["date_edit_flag"] = "0"
      params["room_edit_flag"] = "0"
      params["etime_edit_flag"] = "0"
      var startTime = this.data.dateStart + " " + this.data.timeStart;
      var endTime = this.data.dateEnd + " " + this.data.timeEnd;
      var meetingroomId= this.data.roomId[this.data.roomIndex];
      var oldStartTime = this.data.oldStartTime;
      var oldEndTime = this.data.oldEndTime;
      var oldRoomId = this.data.oldRoomId;
      var originalParticipant = that.data.originalParticipant;//初始数据，既数据库中已有的参会人员信息
      if(startTime!=oldStartTime){
        params["date_edit_flag"] = "1"
      }
      if (endTime != oldEndTime){
        params["etime_edit_flag"] = "1"
      }
      if (meetingroomId != oldRoomId){
        params["room_edit_flag"] = "1"
      }

      //去除删除字符串deleteUserId中的存在于chooseParticipant中的数据
      var deleteUserIds = [];
      deleteUserIds = this.data.deleteUserId.split(",");
      for (var i = 0;i < deleteUserIds.length;i++){
        //得到对应id
        var id="";
        for (var j = 0; j < originalParticipant.length;j++) {
          if (originalParticipant[j].relationId == deleteUserIds[i]){
            id = originalParticipant[j].id;
          }
        }
        
        if(id!=""){
          var flag = false;
          //根据id判断是否存在于chooseParticipant
          for (var k = 0; k < chooseParticipant.length;k++){
            if (chooseParticipant[k].id == id){
              flag=true;
              break;
            }
          }
          if (flag) {//如果存在，删除对应信息
            deleteUserIds.splice(i, 1);
          }
        }
      }
      //重新拼接成字符串
      var relationIdArr =  deleteUserIds.join(",");
      params["relationIdArr"] = relationIdArr;
      //params["relationIdArr"] = this.data.deleteUserId;
      params["reserve_id"] = reserveId;
      jsonarray.push(params);
      
      //将participant数据中的，数据库中已有的数据除去，不重复添加
      var participant = [];
      for (var i = 0; i < chooseParticipant.length; i++) {
          var flag = true;
          for (var j = 0; j < originalParticipant.length; j++) {
            if (chooseParticipant[i].id == originalParticipant[j].id){
                flag = false;
                break;
              }
          }
          if(flag){
            var loginId = {};
            loginId["loginId"] = chooseParticipant[i].id;
            participant.push(loginId);
          }
      }

      reserveParam = { reserve: JSON.stringify(jsonarray), participant: JSON.stringify(participant)}; 
    }

    console.log(reserveParam)
   
    wx.request({
      url: url,
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: reserveParam,
      complete: function () {
        //让按钮可用
        that.setData({
          submitDisabled: false
        });
      },
      success: function (res) {
        var data = res.data;
        if(data.status==true){
          if (reserveId == '' || reserveId == undefined) {
            if(data.meetingflag == true){
              wx.showModal({
                title: '操作提示',
                content: data.msg,
                confirmText: "确定",
                showCancel:false,
                success: function (res) {
                  if (res.confirm) {
                   
                  } else if (res.cancel) {
                   
                  }
                }
              })
            }else{
              wx.showModal({
                title: '操作提示',
                content: data.msg,
                cancelText: "返回列表",
                confirmText: "继续预定",
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '../meetingReserve/meetingReserve?platFormId=' + that.data.platFormId + '&meetingRoomId=' + that.data.meetingRoomId
                    })
                  } else if (res.cancel) {
                    wx.navigateTo({
                      url: '../meetingReserveList/meetingReserveList?roomId=' + that.data.meetingRoomId
                    })
                  }
                }
              })
            }
            
          }else{
            wx.showModal({
              title: '操作提示',
              content: data.msg,
              showCancel:false,
              confirmText: "返回列表",
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../meetingReserveList/meetingReserveList?roomId=' + that.data.meetingRoomId
                  })
                } 
              }
            })
          }
          
         
        }else{
          wx.showModal({
            title: '操作提示',
            content: data.msg,
            confirmText: "确定",
            showCancel:false,
            success: function (res) {
              if (res.confirm) {
               
              } else if (res.cancel) {
               
              }
            }
          })
        }
       
      },
      fail: function (res) {
        that.wetoast.toast({
          title: '预定失败'
        })
      }
    })
    
  },
 
 
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new app.WeToast();
    var that = this;
    var loginId = wx.getStorageSync('loginId');
    var reserveId = options.reserveId;
    var platFormId = options.platFormId;
    var meetingRoomId = options.meetingRoomId;
    this.setData({
      meetingRoomId: meetingRoomId,
      platFormId: platFormId
    })
    var platformId2 = [];
    var companyName = [];
    var roomId = [];
    var roomName = [];
    if(reserveId!='' && reserveId!=undefined){
      //修改查询会议室预定信息
      wx.request({
        url: app.globalData.baseUrl + 'meetingReserve/queryMeetingReserveInfo.if',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        data: {
          reserve_id: reserveId
        },
        complete:function(){
          //让按钮可用
          that.setData({
            submitDisabled: false
          });
        },
        success: function (res) {
          
          var data = res.data
          var status = data.status;
          if (status == true) {
            var msg = data.msg;
            queryRoomInfo(msg.platform_id, msg.meetingroom_id);
            var reserverUserList = data.reserverUserList;
            var meetingName = msg.meeting_name;//2017-12-21 10:01
            var startDate = msg.start_time.substring(0, 10).replace(/-/g, "/");
            var startTime = msg.start_time.substring(11, msg.start_time.length);
            var endDate = msg.end_time.substring(0, 10).replace(/-/g, "/");
            var endTime = msg.end_time.substring(11, msg.end_time.length);
            var deptName  = msg.deptName;
            var applyUser = msg.apply_user_name;
            var applyPhone = msg.apply_phone;
            var remark = msg.remark;
            var sendType = msg.sendType;
            var isRemindingsIndex='0';
            if (sendType=="1"){
              isRemindingsIndex='0'
            } else if(sendType=="2"){
              isRemindingsIndex='1'
            }else if (sendType=="3"){
              isRemindingsIndex='2'
           }
            var users = [];
            for (var i = 0; i < reserverUserList.length; i++) {
              var  m = {
                id: reserverUserList[i].loginId,
                name: reserverUserList[i].userName,
                relationId: reserverUserList[i].relationId
              }
              users.push(m)
            }
         
    
           
            that.setData({
              meetingName: meetingName,
              dateStart: startDate,
              timeStart:startTime,
              dateEnd:endDate,
              timeEnd:endTime,
              applyDept:deptName,
              applyUser: applyUser,
              applyPhone: applyPhone,
              remark: remark,
              chooseParticipant:users,
              originalParticipant: users,
              showView:false,
              isRemindingsIndex: isRemindingsIndex,
              oldStartTime: msg.start_time.replace(/-/g, "/"),
              oldEndTime: msg.end_time.replace(/-/g, "/"),
              reserveId: reserveId,
              oldRoomId:msg.meetingroom_id
            
            })
          }
        }
      })
    }
   
    //查询平台公司
    var platFlag = false;
    wx.request({
      url: app.globalData.baseUrl + 'meetingReserve/queryCompanyInfo.if',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        "loginId": wx.getStorageSync('loginId')
      },
      success: function (res) {
        var data = res.data
        var status = data.status;
        if (status==true){
          platFlag = true;
          var msg = data.msg;
          for(var i=0;i<msg.length;i++){
            companyName.push(msg[i].platFormName)
            platformId2.push(msg[i].platFormId)
          }

          that.setData({ platformId2: platformId2, companyName: companyName});
          if (platFormId != '' && platFormId!=undefined && meetingRoomId!='' && meetingRoomId!=undefined){
            if (reserveId == '' || reserveId== undefined){
              queryRoomInfo(platFormId, meetingRoomId);
            }
           
          }
        }
      }
    })
    function queryRoomSize(roomId){
      wx.request({
        url: app.globalData.baseUrl + 'meetingReserve/selectpeopleNumber.if',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        data: {
          roomId: roomId
        },
        success: function (res) {
          var data = res.data
          var status = data.status;
          if (status == true) {
            var msg = data.msg;
            var roomSize = msg.meetingRoomSize
            that.setData({
              roomSize: roomSize

            })

          }
        }
      })
    }


    function queryRoomInfo(platId,rId) {
    
      if (platFlag==true){
        var companyIndex = 0;
        for (var i = 0; i < platformId2.length;i++){
          if (platformId2[i] == platId){
            companyIndex = i;
            break;
          }
        }
        that.setData({ companyIndex: companyIndex});
        //查询平台公司下的会议室
        wx.request({
          url: app.globalData.baseUrl + 'meetingReserve/selectInformationList.if',
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          data: {
            platFormId: platId,
            loginId: wx.getStorageSync('loginId')
          },
          success: function (res) {
            var data = res.data;
            console.log(data)
            var status = data.status;
            if (status == true) {
              var msg = data.msg;
              for (var i = 0; i < msg.length; i++) {
                roomId.push(msg[i].meetingRoomId)
                roomName.push(msg[i].meetingRoomName)
              }
              var roomIndex = 0;
              for(var i=0;i<roomId.length;i++){
                if (roomId[i] == rId){
                  roomIndex = i;
                  break;
                }
              }
              queryRoomSize(rId);
              that.setData({ roomId: roomId, roomName: roomName, roomIndex:roomIndex});
            }
          }
        })

      }else{
        setTimeout(function () {
          queryRoomInfo(platId, rId);
        }, 500);
      }
     
    }
    if (reserveId == '' || reserveId==undefined) {
      //查询申请人信息
      wx.request({
        url: app.globalData.baseUrl + 'meetingReserveInterface/queryUserInfo.if',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        data: {
          userId: loginId
        },
        success: function (res) {
          console.log(res)
          var data = res.data
          var status = data.status;
          if (status == true) {
            var msg = data.msg;

            var userName = msg.userName;
            var userPhone = msg.userPhone;
            var deptName = msg.deptName;
            that.setData({
              applyUser: userName,
              applyPhone: userPhone,
              applyDept: deptName
            })
          }
        }
      })
    }

   

    var participantName =[];
    var participantId=[];
    var participantInfo=[];
  //初始化参会人员
    wx.request({
      url: app.globalData.baseUrl + 'meetingReserve/listUserInfo.if',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        loginId: wx.getStorageSync('loginId')
      },
      success: function (res) {
        var data = res.data
        var status = data.status;
        if (status == true) {
          var msg = data.msg;
          for(var i=0;i<msg.length;i++){
            var info={
              id: msg[i].loginId,
              name:msg[i].userName
            }
            participantName.push(msg[i].userName);
            participantId.push(msg[i].loginId);
            participantInfo.push(info)
          }
          that.setData({
            participantInfo: participantInfo,
            participantName: participantName,
            participantId: participantId
          })
        
        }
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