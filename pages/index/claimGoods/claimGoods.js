Page({
  data: {
    packageList: [],       //包裹列表 
    type: "",              //类型（1:快递；2:商家）
    verify: false,         //默认没有扫描供应商
    isModel: false,        //默认上传凭证弹框不显示
    imgSrc: "",            //展示的图片地址
    imgObj: {},            //可传递的图片对象
  },
  onLoad(e) {
    this.setData({
      packageList: [],
      type: e.type
    });
    dd.setNavigationBar({
      title: e.type == '1' ? "快递取货" : "商家取货"
    });
    //获取包裹信息（判断是否是同一个供应商,相同就追加列表）
    let obj = {
      package_id1: getApp().globalData.codeObj.id,
      type: "1"
    }
    this.getPackage(obj);
  },
  //获取包裹信息（判断是否是同一个供应商,相同就追加列表）
  getPackage(obj) {
    dd.httpRequest({
      url: getApp().globalData.baseurl + 'supplier/scan_package',
      method: 'GET',
      data: obj,
      dataType: 'json',
      success: (res) => {
        var data = res.data;
        if (data.code == 1) {
          let arr = this.data.packageList;
          arr.push(data.data)
          this.setData({
            packageList: arr
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
  //扫描
  scan() {
    //弹出扫描二维码的框
    dd.scan({
      type: 'qr',
      success: (res) => {
        //扫描成功所得到的数据
        if (res.code.indexOf("type") > -1) {
          var codeObj = JSON.parse(res.code)
          if (codeObj.type != "1") {    //扫描的不是包裹
            dd.showToast({
              type: 'none',
              content: "请扫描包裹码",
              duration: 2000
            });
          } else {                       //扫描的是包裹
            //获取包裹信息（判断是否是同一个供应商）
            let obj = {
              type: "1"
            }
            if (this.data.packageList.length > 0) {
              obj.package_id1 = this.data.packageList[0].id;
              obj.package_id2 = codeObj.id;
            } else {
              obj.package_id1 = codeObj.id;
            }
            //判断是否重复扫描
            if (this.judge(codeObj.id) == false) {
              dd.showToast({
                type: 'none',
                content: "请勿重复扫描",
                duration: 2000
              });
            } else {
              //获取包裹信息（判断是否是同一个供应商,相同就追加列表）
              this.getPackage(obj)
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
  //点击某一条的删除
  delete(index) {
    dd.confirm({
      title: '提示',
      content: '确认删除该包裹吗？',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm == true) {
          let arr = this.data.packageList;
          arr.splice(index, 1)
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
  //点击取货
  ok() {
    if (this.data.packageList.length == 0) {
      dd.showToast({
        type: 'none',
        content: "一个包裹都没有",
        duration: 2000
      })
    } else {
      this.setData({
        isModel: true
      });
    }
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
  //确认取货
  claim() {
    if (this.data.imgSrc == "") {
      dd.showToast({
        type: 'none',
        content: "请上传到达凭证",
        duration: 2000
      });
    } else {
      //上传
      dd.showLoading({
        content: '正在取货...'
      });
      dd.uploadFile({
        url: getApp().globalData.baseurl + 'supplier/upload_evidence',
        fileType: 'image',
        fileName: 'evidence',
        filePath: this.data.imgSrc,
        success: (res) => {
          let data = JSON.parse(res.data);
          if (data.code == '1') {
            //取货
            this.getHuo(data.img_url);
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
  },
  //取货
  getHuo(url) {
    let arr = [];
    this.data.packageList.map(item => {
      arr.push(item.id);
    });
    let obj = {
      img_url: url,
      package_ids: arr.join("_"),
      get_type: this.data.type == '1' ? 3 : 2
    }
    dd.httpRequest({
      url: getApp().globalData.baseurl + 'supplier/get_complete',
      method: 'POST',
      data: obj,
      dataType: 'json',
      success: (res) => {
        dd.hideLoading();
        var data = res.data;
        if (data.code == 1) {
          dd.showToast({
            type: 'none',
            content: "已取货",
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
  },
  //取消取货
  qu() {
    this.setData({
      imgSrc: "",
      imgObj: {},
      isModel: false
    });
  }
})