Page({
    data: {
        shopId: "",                 //商品码
        shopObj: {},                //商品详情
        qrcode:"",                  //二维码地址
    },
    onLoad() {
        //获取扫描的商品码
        this.setData({
            shopId: getApp().globalData.codeObj
        })
        //根据商品码获取包裹信息
        this.getPackageInfo();
    },
    //获取包裹内商品列表
    getPackageInfo() {
        dd.httpRequest({
            url: getApp().globalData.baseurl + 'goods/get_goods_info',
            method: 'GET',
            data: {
                uniqNum: this.data.shopId
            },
            dataType: 'json',
            success: (res) => {
                var data = res.data;
                if (data.code == 1) {
                    this.setData({
                        shopObj: data.data,              //当前包裹详情
                        qrcode:getApp().globalData.baseurl + 'goods/qrcode?package_id=' + data.data.package_id + "&type=1"
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