
Page({
  data: {
    signList: [],            //标记异常列表
    isLoad: true,            //默认可以加载下一页
    page: 1,                 //当前页码
    showModal: false,         //默认选择联系人弹框不展示
    contactsList: [],        //联系人列表
    getList: [],             //用作遍历的列表
    search: "",              //输入的搜索内容
    searchId: "",            //选中的联系人id
    packageInfo: {},          //上一步或者下一步的包裹对象
    url: "",                  //上一步或者下一步的地址
  },
  onLoad(e) {
    //获取标记异常列表
    this.getSignList();
    //获取联系人列表
    this.getContactsList();
  },
  //获取标记异常列表
  getSignList() {
    dd.httpRequest({
      url: getApp().globalData.baseurl + 'markabnormal/abnormalinfo',
      data: {
        page: this.data.page
      },
      method: 'GET',
      dataType: 'json',
      success: (res) => {
        var data = res.data;
        if (data.code == 1) {
          this.setData({
            signList: this.data.signList.concat(Array.from(data.data))
          });
          if (data.count == this.data.page) {
            this.setData({
              isLoad: false
            })
          } else {
            this.setData({
              isLoad: true
            })
          }
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
  //翻页
  lower() {
    if (this.data.isLoad == true) {
      this.setData({
        page: this.data.page + 1
      });
      //获取我的所有记录
      this.getSignList();
    }
  },
  //询问
  inquiry(e) {
    let packageId = e.target.dataset.id;
    let type = e.target.dataset.type;     //0:到达前的询问;1:作废
    let content = "";
    if (type == 0) {
      content = "确认送达该包裹？";
    } else if (type == 1) {
      content = "确认作废该包裹？";
    }
    dd.confirm({
      title: '提示',
      content: content,
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm == true) {
          if (type == 0) {  //确认送达
            this.ok(packageId);
          } else if (type == 1) {
            this.cancellation(packageId);
          }

        }
      },
    });
  },
  //确认送达
  ok(packageId) {
    dd.httpRequest({
      url: getApp().globalData.baseurl + 'arrive/confirmarrive',
      method: 'GET',
      data: {
        packageId: packageId,
        type:1
      },
      dataType: 'json',
      success: (res) => {
        var data = res.data;
        if (data.code == 1) {
          dd.showToast({
            type: 'none',
            content: "已到达",
            duration: 2000,
            success: () => {
              this.setData({
                signList: [],
                page: 1
              })
              //获取标记异常列表
              this.getSignList();
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
  //确认作废
  cancellation(packageId) {
    let obj = {
      packageId: packageId,
      type: 1
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
              this.setData({
                signList: [],
                page: 1
              })
              //获取标记异常列表
              this.getSignList();
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
  //监听输入的搜索内容
  bindKeyInput(value) {
    this.setData({
      contactsList: [],
      search: value.detail.value
    });
    let arr = [];
    this.data.getList.map(item => {
      if (item.name.indexOf(value.detail.value) > -1) {
        arr.push(item);
      }
    });
    this.setData({
      contactsList: arr
    });
  },
  //点击确认按钮
  okSelcon() {
    if (this.data.searchId == "") {
      dd.showToast({
        type: 'none',
        content: "请选择联系人",
        duration: 2000
      });
    } else {
      let e = this.data.getList.find((e) => (e.id == this.data.searchId))
      dd.confirm({
        title: '提示',
        content: '确定将此状态移交给【' + e.name + '】？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        success: (result) => {
          if(result.confirm == true){
             //上一步或下一步接口
            this.comfir();
          }
        },
      });
    }

  },
  //点击取消按钮
  qu(){
    this.setData({
      showModal: false,
      search: "",              //输入的搜索内容
      searchId: "",            //选中的联系人id
    })
  },
  //上一步或下一步接口
  comfir() {
    dd.showLoading({
      content: '正在移交...'
    });
    let obj = {
      button_status: this.data.packageInfo.button_status,
      id: this.data.searchId,
      package_id: this.data.packageInfo.package_id,
      origin_id: this.data.packageInfo.operator_id
    }
    dd.httpRequest({
      url: getApp().globalData.baseurl + this.data.url,
      method: 'GET',
      data:obj,
      dataType: 'json',
      success: (res) => {
        dd.hideLoading();
        var data = res.data;
        if (data.code == 1) {
          dd.showToast({
            type: 'success',
            content: "移交成功",
            duration: 2000,
            success: res => {
              this.setData({
                signList: [],
                page: 1
              })
              //获取标记异常列表
              this.getSignList();
            }
          });
          this.setData({
            showModal: false
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
  //获取联系人列表
  getContactsList() {
    dd.httpRequest({
      url: getApp().globalData.baseurl + 'markabnormal/getuserlist',
      method: 'GET',
      dataType: 'json',
      success: (res) => {
        var data = res.data;
        if (data.code == 1) {
          this.setData({
            contactsList: data.data,              //联系人列表
            getList: data.data
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
  //点击某一个商家
  selContacts(e) {
    this.setData({
      searchId: e.currentTarget.dataset.id,
      search: e.currentTarget.dataset.name
    })
  },
  //上一步或下一步
  previous(e) {
    if (e.currentTarget.dataset.status == '-1') {
      this.setData({
        url: "markabnormal/previous"
      })
    } else if (e.currentTarget.dataset.status == '1') {
      this.setData({
        url: "markabnormal/next"
      })
    }
    this.setData({
      packageInfo: e.currentTarget.dataset.item,
      showModal: true
    })
  }
})