var app = getApp();
Page({
    data: {
      fileShareUrl: app.globalData.routerUrl +":7698"
    },
    onLoad: function (options) {
      console.log(this.data.fileShareUrl)
    }
    
})