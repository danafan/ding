Page({
    data: {
        sku: "",            //sku
        cause: "",          //退货原因
    },
    onLoad() {
        this.setData({
            sku: getApp().globalData.codeObj
        })
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
                url: 'http://erpcs.ppg8090.com/api/goods/commit_return_reason',
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