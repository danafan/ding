Page({
  data: {
    packageObj:{},                //包裹详情
    showCate: false,             //默认凭证图片不展示
    id:"",                       //包裹id
  },
  onLoad(e) {
    this.setData({
      id:e.id
    });
    //获取包裹详情
    this.getPackage(e.id);
  },
  //获取包裹详情
  getPackage(id) {
    dd.httpRequest({
      url: 'http://erpcs.ppg8090.com/api/my/get_one_record',
      method: 'GET',
      data:{
        package_id:id
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
  }
})