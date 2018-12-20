Page({
  data: {
    code: "",             //扫码获得的车辆id
    carObj: {},           //车辆信息对象
    packageList: [],      //当前车辆的包裹列表      
  },
  //页面加载完成
  onLoad() {
    //获取扫描的车辆id
    this.setData({
      code: getApp().globalData.codeObj.id
    })
    //根据扫描车辆的id获取车辆信息
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
          dd.alert({
            title: '提示',
            content: data.msg,
            buttonText: '我知道了'
          });
          this.setData({
            code: data.data.id,              //修改当前车辆id
            carObj: data.data,               //车辆信息对象
            packageList: data.packageInfo    //当前车辆的包裹列表
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
  //扫描包裹二维码增加包裹
  scan() {
    //弹出扫描二维码的框
    dd.scan({
      type: 'qr',
      success: (res) => {
        if (res.code.indexOf("type") > -1) {
          var codeObj = JSON.parse(res.code)
          if (codeObj.type != "1") {    //扫描的不是包裹
            dd.showToast({
              type: 'none',
              content: "请扫描包裹码",
              duration: 2000
            });
          } else {
            //添加包裹
            this.addPackage(codeObj);
          }
        } else {
          dd.showToast({
            type: 'none',
            content: "请扫描包裹码",
            duration: 2000
          });
        }
      }
    });
  },
  //添加包裹
  addPackage(codeObj) {
    //传递包裹id和type添加包裹
    dd.httpRequest({
      url: getApp().globalData.baseurl + 'car/scanpackage',
      method: 'GET',
      data: {
        packageId: codeObj.id,
        carId: this.data.code,
        type: codeObj.type
      },
      dataType: 'json',
      success: (res) => {
        var data = res.data;
        if (data.code == 1) {
          this.setData({
            code: data.data.id,              //修改当前车辆id
            carObj: data.data,               //车辆信息对象
            packageList: data.packageInfo    //当前车辆的包裹列表
          });
          dd.showToast({
            type: 'none',
            content: "扫描成功",
            duration: 1000
          });
          setTimeout(() => {
            //扫描包裹二维码增加包裹
            this.scan();
          }, 1000);
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
  //点击某一条的删除
  deletes(e) {
    dd.confirm({
      title: '提示',
      content: '确认删除该包裹吗？',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm == true) {
          dd.httpRequest({
            url: getApp().globalData.baseurl + 'car/delpackage',
            method: 'GET',
            data: {
              packageId: e.currentTarget.dataset.id
            },
            dataType: 'json',
            success: (res) => {
              var data = res.data;
              if (data.code == 1) {
                dd.showToast({
                  type: 'none',
                  content: "删除成功",
                  duration: 1000,
                  success: () => {
                    let index = e.currentTarget.dataset.index;
                    let arr = this.data.packageList;
                    arr.splice(index, 1);
                    this.setData({
                      packageList: arr
                    });
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
        } else {
          dd.showToast({
            type: 'none',
            content: "取消删除",
            duration: 2000
          });
        };
      },
    });
  },
  //点击完成返回首页
  goIndex() {
    if (this.data.packageList.length > 0) {
      dd.confirm({
        title: '提示',
        content: '确定装车？',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        success: (result) => {
          if (result.confirm == true) {
            dd.showToast({
              type: 'none',
              content: "装车完成",
              duration: 1000,
              success: res => {
                dd.navigateBack({
                  delta: 1
                })
              }
            });
          } else {
            dd.showToast({
              type: 'none',
              content: "取消装车",
              duration: 2000
            });
          }
        },
      });
    } else {
      dd.showToast({
        type: 'none',
        content: "一件包裹都没有",
        duration: 2000
      });
    }
  },
  //点击重置
  reset() {
    if (this.data.packageList.length > 0) {
      dd.confirm({
        title: '提示',
        content: '确定重置并将车上所有包裹清空吗？',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        success: (result) => {
          if (result.confirm == true) {
            let packageids = [];
            this.data.packageList.map(item => {
              packageids.push(item.id);
            })
            dd.httpRequest({
              url: getApp().globalData.baseurl + 'car/reset',
              method: 'POST',
              data: {
                packageIds: packageids.join("-")
              },
              dataType: 'json',
              success: (res) => {
                var data = res.data;
                if (data.code == 1) {
                  dd.showToast({
                    type: 'none',
                    content: "已重置",
                    duration: 1000,
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
          } else {
            dd.showToast({
              type: 'none',
              content: "取消重置",
              duration: 2000
            });
          }
        },
      });
    } else {
      dd.showToast({
        type: 'none',
        content: "一件包裹都没有",
        duration: 2000
      });
    }
  }

});