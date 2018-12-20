Page({
  data: {
    sku: "",            //唯一码
    cause: "",          //退货原因
    title: "",           //顶部标题
  },
  onLoad(e) {
    let sku = getApp().globalData.codeObj;
    //验证商品唯一码
    this.verify(sku);
  },
  //验证商品唯一码
  verify(sku) {
    dd.httpRequest({
      url: getApp().globalData.baseurl + 'goods/check_code',
      method: 'GET',
      data: {
        unique_no: sku
      },
      dataType: 'json',
      success: (res) => {
        var data = res.data;
        if (data.code == 1) {
          this.setData({
            sku: getApp().globalData.codeObj
          })
        } else {
          dd.showToast({
            type: 'none',
            content: data.msg,
            duration: 2000,
            success: () => {
              dd.navigateBack({
                delta: 1
              })
            }
          });
        }
      }
    });
  },
  //监听输入的退错原因
  inputKey(e) {
    this.setData({
      cause: e.detail.value
    });
  },
  //点击提交
  submit() {
    if (this.data.cause == "") {
      dd.showToast({
        type: 'none',
        content: '请输入退错原因',
        duration: 2000
      });
    } else {
      dd.showLoading({
        content: '正在提交...'
      });
      dd.httpRequest({
        url: getApp().globalData.baseurl + 'goods/commit_return_reason',
        method: 'POST',
        data: {
          unique_no: this.data.sku,
          reason: this.data.cause
        },
        dataType: 'json',
        success: (res) => {
          dd.hideLoading();
          var data = res.data;
          if (data.code == 1) {
            dd.showToast({
              type: 'none',
              content: "退回成功",
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
    }
  }
})