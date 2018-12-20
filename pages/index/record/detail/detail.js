Page({
  data: {
    packageObj: {},              //包裹详情
    showCate: false,             //默认凭证图片不展示
    id: "",                      //包裹id
  },
  onLoad(e) {
    this.setData({
      id: e.id
    });
    //获取包裹详情
    this.getPackage(e.id);
  },
  //获取包裹详情
  getPackage(id) {
    dd.httpRequest({
      url: getApp().globalData.baseurl + 'my/get_one_record',
      method: 'GET',
      data: {
        package_id: id
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
            duration: 2000
          });
        }
      }
    });
  },
  //点击查看商品详情
  goods() {
    dd.navigateTo({ url: '/pages/index/record/detail/goods/goods?id=' + this.data.id });
  },
  //点击查看凭证
  cate() {
    this.setData({
      showCate: true
    });
  },
  //点击关闭弹框
  close() {
    this.setData({
      showCate: false
    });
  },
  //点击重新打印
  ok() {
    dd.confirm({
      title: '提示',
      content: '确认重新打印包裹码？',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm == true) {
          if (getApp().globalData.printer == "") {
            dd.showToast({
              type: 'none',
              content: '请选择打印机',
              duration: 2000,
              success: () => {
                dd.navigateTo({ url: '/pages/index/printer/printer' });
              }
            });
          } else {
            //正在打印
            dd.showLoading({
              content: '正在打印...'
            });
            dd.httpRequest({
              url: getApp().globalData.baseurl + 'package/reprint',
              method: 'GET',
              data: {
                packageId: this.data.id,
                choose: getApp().globalData.printer
              },
              dataType: 'json',
              success: (res) => {
                var data = res.data;
                dd.hideLoading();
                if (data.code == 1) {
                  dd.showToast({
                    type: 'none',
                    content: "打印成功",
                    duration: 2000
                  });
                } else if (data.code == 100) {
                  dd.showToast({
                    type: 'none',
                    content: '当前打印机已掉线，请重新选择',
                    duration: 2000,
                    success: () => {
                      dd.navigateTo({ url: '/pages/index/printer/printer' });
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

        } else {
          dd.showToast({
            type: 'none',
            content: "取消打印",
            duration: 2000
          });
        }
      },
    });
  }
})