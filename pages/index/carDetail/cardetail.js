Page({
  data: {
    code: "1",
    carObj: {},           //车辆详情      
    packageList: [],      //包裹列表      
  },
  //页面加载完成
  onShow() {
    //获取保存的车辆id
    this.setData({
      code: getApp().globalData.codeObj.id
    })
    //根据车辆id获取车辆信息
    this.getCarinfo();
  },
  //根据车辆id获取车辆信息
  getCarinfo() {
    dd.httpRequest({
      url: getApp().globalData.baseurl + 'car/getcarinfo',
      method: 'GET',
      data: {
        carId: this.data.code,
        type: "2"
      },
      dataType: 'json',
      success: (res) => {
        var data = res.data;
        if (data.code == 0) {
          this.setData({
            code: data.data.id,              //修改当前车辆id
            carObj: data.data,               //车辆信息对象
            packageList: []                  //包裹列表清空
          });
        } else if (data.code == 1) {
          this.setData({
            code: data.data.id,              //修改当前车辆id
            carObj: data.data,               //车辆信息对象
            packageList: data.packageInfo    //包裹列表清空
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
  },
  //点击某一个包裹查看包裹详情
  goodslist(e) {
    let id = e.currentTarget.dataset.id;
    dd.navigateTo({ url: '/pages/index/record/detail/goods/goods?id=' + id });
  }

});