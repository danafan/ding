Page({
  data: {
    recordList: [],                        //记录列表
    isLoad: true,                          //默认可以加载下一页
    page: 1,                               //当前页码
    title: '',                             //显示标题
    url: '',
    search: "",                            //输入的搜索内容
    searchId: "",                          //选中的商家id
    showShopList: false,                   //默认商家列表不显示
    shopList: [],                          //商家列表
    getList: [],                           //获取的商家列表
  },
  onLoad(e) {
    this.setData({
      title: e.type == '1' ? "我的记录" : "异常包裹",
      url: e.type == '1' ? "my/my_operate_record" : "my/my_timeout_record"
    });
    //获取我的所有记录
    this.getRecord(this.data.url);
    //获取商家列表
    this.getShopList();
  },
  onShow() {
    dd.setNavigationBar({
      title: this.data.title
    });
  },
  //监听输入的搜索内容
  bindKeyInput(value) {
    this.setData({
      shopList: [],
      search:value.detail.value
    });
    let arr = [];
    this.data.getList.map(item => {
      if (item.supplier_name.toLowerCase().indexOf(value.detail.value.toLowerCase()) > -1) {
        arr.push(item);
      }
    });
    this.setData({
      shopList: arr
    });
  },
  //点击搜索按钮
  search() {
    if(this.data.search == ""){
      this.setData({
        searchId:""
      })
    }
    //获取我的所有记录
    this.setData({
      page: 1,
      recordList:[],
      showShopList:false,
      isLoad: true
    })
    this.getRecord(this.data.url);
  },
  //获取商家列表
  getShopList() {
    dd.showLoading({
      content: '正在获取商家列表...'
    });
    dd.httpRequest({
      url: getApp().globalData.baseurl + 'my/get_gys',
      method: 'GET',
      dataType: 'json',
      success: (res) => {
        dd.hideLoading();
        var data = res.data;
        if (data.code == 1) {
          this.setData({
            shopList: data.data,              //商家列表
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
  selShop(e) {
    this.setData({
      searchId: e.currentTarget.dataset.id,
      search: e.currentTarget.dataset.name,
      showShopList: false
    })
  },
  //搜索框获取焦点事件
  onfocus() {
    this.setData({
      showShopList: true
    })
  },
  //获取我的所有记录
  getRecord(url) {
    dd.showLoading({
      content: '正在加载...'
    });
    dd.httpRequest({
      url: getApp().globalData.baseurl + url,
      method: 'GET',
      data: {
        page: this.data.page,
        supplier_id: this.data.searchId
      },
      dataType: 'json',
      success: (res) => {
        dd.hideLoading();
        var data = res.data;
        if (data.code == 1) {
          let list = data.data;
          this.setData({
            recordList: this.data.recordList.concat(Array.from(list))
          });
          if (data.count == this.data.page) {
            this.setData({
              isLoad: false
            })
          }else{
            this.setData({
              isLoad: true
            })
          }
        } else {
          dd.showToast({
            type: 'none',
            content: data.msg,
            duration: 2000
          });
        }
      },
      fail: (res) => {
        dd.hideLoading();
        dd.alert({ content: res });
      },
    });
  },
  //页面滚动到底部触发（加载下一页）
  lower(e) {
    if (this.data.isLoad == true) {
      this.setData({
        page: this.data.page + 1
      });
      //获取我的所有记录
      this.getRecord(this.data.url);
    }
  },
  //点击查看详情
  detail(e) {
    let id = e.currentTarget.dataset.id;
    dd.navigateTo({ url: '/pages/index/record/detail/detail?id=' + id });
  }
})