Page({
  data: {
    packageId: 0,                       //扫码进入的第一个包裹id
    packageList: [],                    //包裹列表   
  },
  onLoad() {
    //获取扫描的车辆id
    this.setData({
      packageList: [],
      packageId: getApp().globalData.codeObj.id
    })
    //获取包裹信息
    this.getPackage();
  },
  //获取包裹信息
  getPackage() {
    dd.httpRequest({
      url: getApp().globalData.baseurl + 'getoff/getpackageinfo',
      method: 'GET',
      data: {
        packageId: this.data.packageId,
        type: 1
      },
      dataType: 'json',
      success: (res) => {
        var data = res.data;
        if (data.code == 1) {
          let arr = this.data.packageList;
          arr.push(data.data);
          this.setData({
            packageList: arr
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
  delete(e) {
    dd.confirm({
      title: '提示',
      content: '确认删除该包裹吗？',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm == true) {
          let index = e.currentTarget.dataset.index;
          let arr = this.data.packageList;
          arr.splice(index, 1);
          this.setData({
            packageList: arr
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
  //点击继续扫描
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
            this.setData({
              packageId: codeObj.id
            });
            //判断是否重复扫描
            if (this.judge(this.data.packageId) == false) {
              dd.showToast({
                type: 'none',
                content: "请勿重复扫描",
                duration: 2000
              });
            } else {
              //获取包裹信息
              this.getPackage();
            }
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
  //判断是否重复扫描
  judge(id) {
    let aa = true;
    for (var i = 0; i < this.data.packageList.length; i++) {
      if (this.data.packageList[i].id == id) {
        return aa = false;
      } else {
        aa = true;
      }
    }
    return aa;
  },
  //点击下车返回首页
  goIndex() {
    if (this.data.packageList.length > 0) {
      dd.confirm({
        title: '提示',
        content: '确定下车？',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        success: (result) => {
          if (result.confirm == true) {
            dd.showLoading({
              content: '正在下车...'
            });
            let arr = [];
            this.data.packageList.map(item => {
              arr.push(item.id);
            });
            dd.httpRequest({
              url: getApp().globalData.baseurl + 'getoff/getoffcar',
              method: 'POST',
              data: {
                packageIds: arr.join("-")
              },
              dataType: 'json',
              success: (res) => {
                var data = res.data;
                if (data.code == 1) {
                  dd.hideLoading();
                  dd.showToast({
                    type: 'none',
                    content: "已下车",
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
              content: "取消下车",
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
})