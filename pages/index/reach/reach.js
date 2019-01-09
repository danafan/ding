Page({
  data: {
    packageId: "",               //扫描的包裹id
    packageObj: {},              //包裹详情
    imgSrc: "",                  //展示的图片地址
    imgObj: {},                  //可传递的图片对象
    isVerify: false,             //默认没有验证供应商
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
  //点击上传图片
  uploadImg() {
    dd.chooseImage({
      count: 1,
      success: (res) => {
        this.setData({
          imgObj: res,
          imgSrc: res.apFilePaths[0]
        })
      },
    });
  },
  //点击删除图片
  deleteImg() {
    this.setData({
      imgObj: {},
      imgSrc: ""
    });
  },
  //点击确认到达（上传图片）
  ok() {
    if (this.data.imgSrc == "") {
      dd.showToast({
        type: 'none',
        content: '请上传图片凭证',
        duration: 2000
      });
    } else {
      dd.confirm({
        title: '提示',
        content: '确认到达？',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        success: (result) => {
          if (result.confirm == true) {
            //先上传图片
            dd.showLoading({
              content: '正在提交，请稍后...'
            });
            dd.uploadFile({
              url: getApp().globalData.baseurl + 'arrive/uploadimg',
              fileType: 'image',
              fileName: 'img',
              filePath: this.data.imgSrc,
              success: (res) => {
                let obj = JSON.parse(res.data)
                if (obj.code == "1") {
                  let url = obj.data;
                  //提交确认到达
                  this.arrive(url);
                } else {
                  dd.showToast({
                    type: 'none',
                    content: obj.msg,
                    duration: 2000
                  });
                }
              }
            });
          } else {
            dd.showToast({
              type: 'none',
              content: "取消送达",
              duration: 2000
            });
          }
        },
      });
    }
  },
  //提交确认到达
  arrive(url) {
    dd.httpRequest({
      url: getApp().globalData.baseurl + 'arrive/confirmarrive',
      method: 'GET',
      data: {
        packageId: this.data.packageId,
        url: url
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