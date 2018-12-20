Page({
  data: {
    packageId: "",
    packageObj: {},
    subname: "",                     //作废说明
  },
  onLoad(e) {
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
      url: getApp().globalData.baseurl + 'cancel/scanpackage',
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
  //监听输入的作废说明
  inputKey(e) {
    this.setData({
      subname: e.detail.value
    })
  },
  //点击提交
  submit() {
    if (this.data.subname == "") {
      dd.showToast({
        type: 'none',
        content: "请填写作废说明",
        duration: 2000
      });
      return
    }
    let obj = {
      packageId: this.data.packageId,
      remark: this.data.subname
    }
    dd.httpRequest({
      url: getApp().globalData.baseurl + 'cancel/confirmCancel',
      method: 'POST',
      data: obj,
      dataType: 'json',
      success: (res) => {
        var data = res.data;
        if (data.code == 1) {
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
})