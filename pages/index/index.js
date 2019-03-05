
Page({
  data: {
    username: "",     //用户名
  },
  onLoad() {
    //钉钉获取用户信息
    this.dingInfo();
  },
  //钉钉获取用户信息
  dingInfo() {
    dd.showLoading({
      content: '正在获取用户信息...'
    });
    dd.getAuthCode({
      success: (res) => {
        this.getUserinfo(res.authCode);
      }
    })
  },
  //获取用户信息
  getUserinfo(authCode) {
    dd.httpRequest({
      url: getApp().globalData.baseurl + 'ding/dinglogin',
      method: 'GET',
      data: {
        authCode: authCode
      },
      dataType: 'json',
      success: (res) => {
        dd.hideLoading();
        if (res.data.code == 1) {
          let username = res.data.data.name;
          getApp().globalData.username = username;
          this.setData({
            username: username
          });
        } else {
          dd.alert({
            title: "提示",
            content: res.data.msg,
            buttonText: "重新获取",
            success: () => {
              //钉钉获取用户信息
              this.dingInfo();
            }
          })
        }
      }
    });
  },
  //点击菜单进入详情
  go(e) {
    var type = e.currentTarget.dataset.type;
    switch (type) {
      case "1-1":
        //打包
        dd.navigateTo({ url: '/pages/index/package/package' });
        break;
      case "1-2":
        //装车
        this.scan("1-2");
        break;
      case "1-3":
        //下车
        this.scan("1-3");
        break;
      case "1-4":
        //送达
        this.scan("1-4");
        break;
      case "2-1":
        //商品退回
        this.scan("2-1");
        break;
      case "2-2":
        //扫码获取
        this.scan("2-2");
        break;
      case "2-3":
        //我的记录
        dd.navigateTo({ url: '/pages/index/record/record?type=' + 1 });
        break;
      case "2-4":
        //问题包裹
        dd.navigateTo({ url: '/pages/index/record/record?type=' + 2 });
        break;
      case "2-5":
        //包裹作废
        this.scan("2-5");
        break;
      case "3-1":
        //快递取货
        this.scan("3-1");
        break;
      case "3-2":
        //商家取货
        this.scan("3-2");
        break;
    }
  },
  //打开扫描二维码
  scan(type) {
    //弹出扫描二维码的框
    dd.scan({
      type: 'qr',
      success: (res) => {
        let isGoods = false;
        if (res.code.indexOf("type") > -1) {
          isGoods = false;
          var codeObj = JSON.parse(res.code)
          //扫描成功所得到的数据
          getApp().globalData.codeObj = codeObj;
        } else {
          getApp().globalData.codeObj = res.code;
          isGoods = true;
        }
        switch (type) {
          case "1-2":
            //装车
            if (isGoods == true || codeObj.type != "2") {
              dd.showToast({
                type: 'none',
                content: "请扫描车辆二维码",
                duration: 2000
              });
            } else {
              dd.navigateTo({ url: '/pages/index/truck/truck' });
            }
            break;
          case "1-3":
            //下车
            if (isGoods == true || codeObj.type != "1") {
              dd.showToast({
                type: 'none',
                content: "请扫描包裹二维码",
                duration: 2000
              });
            } else {
              dd.navigateTo({ url: '/pages/index/getoff/getoff' });
            }
            break;
          case "1-4":
            //到达
            if (isGoods == true || codeObj.type != "1") {
              dd.showToast({
                type: 'none',
                content: "请扫描包裹二维码",
                duration: 2000
              });
            } else {
              dd.navigateTo({ url: '/pages/index/reach/reach' });
            }
            break;
          case "2-1":
            //商品退回
            if (isGoods == false) {
              dd.showToast({
                type: 'none',
                content: "请扫描商品二维码",
                duration: 2000
              });
            } else {
              dd.navigateTo({ url: '/pages/index/sendback/sendback' });
            }
            break;
          case "2-2":
            //扫码获取
            if (isGoods == true || (codeObj.type != "1" && codeObj.type != "2")) {
              //扫的是商品码
              dd.navigateTo({ url: '/pages/index/packDetail/packDetail' });
            } else {
              if (codeObj.type == "1") {
                dd.navigateTo({ url: '/pages/index/packageDetail/getdetail' });
              } else {
                dd.navigateTo({ url: '/pages/index/carDetail/cardetail' });
              }
            }
            break;
          case "2-5":
            //包裹作废
            if (isGoods == true || codeObj.type != "1") {
              dd.showToast({
                type: 'none',
                content: "请扫描包裹二维码",
                duration: 2000
              });
            } else {
              dd.navigateTo({ url: '/pages/index/void/void' });
            }
            break;
          case "3-1":
            //快递取货
            if (isGoods == true || codeObj.type != "1") {
              dd.showToast({
                type: 'none',
                content: "请扫描包裹二维码",
                duration: 2000
              });
            } else {
              dd.navigateTo({ url: '/pages/index/claimGoods/claimGoods?type=1' });
            }
            break;
          case "3-2":
            //商家取货
            if (isGoods == true || codeObj.type != "1") {
              dd.showToast({
                type: 'none',
                content: "请扫描包裹二维码",
                duration: 2000
              });
            } else {
              dd.navigateTo({ url: '/pages/index/claimGoods/claimGoods?type=2' });
            }
            break;
        }
      }
    });
  },
});
