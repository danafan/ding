Page({
  data: {
    packageId: "",               //扫描的包裹id
    packageObj: {},              //包裹详情
  },
  onLoad() {
    //获取扫描的包裹id
    this.setData({
      packageId: getApp().globalData.codeObj.id
    })
    //获取包裹信息
    this.getPackage();
  },
  //获取包裹信息
  getPackage() {
    dd.httpRequest({
      url: getApp().globalData.baseurl + 'arrive/getpackageinfo',
      method: 'GET',
      data: {
        packageId: this.data.packageId,
        type: "1"
      },
      dataType: 'json',
      success: (res) => {
        var data = res.data;
        if (data.code == 1) {
          this.setData({
            packageObj: data.data
          });
        } else {
          dd.showToast({
            type: 'none',
            content: data.msg,
            duration: 2000,
            success: res => {
              dd.navigateBack({
                delta: 1
              })
            }
          });
        }
      }
    });
  },
  //提交确认到达
  ok() {
    dd.showLoading({
      content: '正在提交，请稍后...'
    });
    dd.httpRequest({
      url: getApp().globalData.baseurl + 'arrive/confirmarrive',
      method: 'GET',
      data: {
        packageId: this.data.packageId
      },
      dataType: 'json',
      success: (res) => {
        dd.hideLoading();
        var data = res.data;
        if (data.code == 1) {
          dd.showToast({
            type: 'none',
            content: "已到达",
            duration: 2000,
            success: () => {
              dd.navigateBack({
                delta: 1
              })
            }
          });
        } else {
          dd.showToast({
            type: 'none',
            content: data.msg,
            duration: 2000
          });
        }
      }
    });
  }
});