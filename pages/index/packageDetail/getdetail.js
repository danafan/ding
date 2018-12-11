Page({
    data: {
        packageId: "2",             //包裹id
        packageObj: {}              //包裹详情
    },
    onLoad() {
        //获取扫描的车辆id
        this.setData({
            packageId: getApp().globalData.codeObj.id
        })
        //获取包裹内商品列表
        this.getGoods();
    },
    //获取包裹内商品列表
    getGoods() {
        dd.httpRequest({
            url: 'http://erpcs.ppg8090.com/api/package/get_package_info',
            method: 'GET',
            data: {
                package_id: this.data.packageId,
                type: "1"
            },
            dataType: 'json',
            success: (res) => {
                var data = res.data;
                if (data.code == 1) {
                    this.setData({
                        packageObj: data.data              //当前包裹详情
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