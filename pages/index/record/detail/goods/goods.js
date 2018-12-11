Page({
  data:{
    packageId:"",       //包裹id
    goods:[],           //商品列表
  },
  onLoad(e){
    this.setData({
      packageId:e.id
    });
    //获取包裹内商品列表
    this.getGoods();
  },
  //获取包裹内商品列表
  getGoods(){
    dd.httpRequest({
      url: 'http://erpcs.ppg8090.com/api/package/get_package_info',
      method: 'GET',
      data: {
        package_id: this.data.packageId,
        type:"1"
      },
      dataType: 'json',
      success: (res) => {
        var data = res.data;
        if (data.code == 1) {
          this.setData({
            goods: data.data.goods              //当前包裹的商品列表
          });
        }else {
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