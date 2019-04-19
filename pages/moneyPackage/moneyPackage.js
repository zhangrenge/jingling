var app = getApp();
Page({
    data: {
        // url: 'https://www.fogpod.com/apps/smart_it/fileShare.html'
        urls: ''
    },
    onLoad: function (options) {
        
      let scene =decodeURIComponent(options.scene);
        // wx.showToast({
        //     title: scene,
        //     icon: 'success',
        //     duration: 3000,
        //     mask: true
        // });
        // setTimeout(function () { wx.hideToast() }, 5000);
        let loginId = wx.getStorageSync('loginId');
        console.log(scene+"--scene");
      let url = app.globalData.baseHtml+"/apps/smart_it/wallet.html";
        // if (scene !='undefined'){
          url = url + "?scene=" + scene + "&loginId=" +loginId;
        // }
        this.setData({ 
            urls: url
        })
      
    }
    
})