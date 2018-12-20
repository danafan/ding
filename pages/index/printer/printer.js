Page({
  data: {
    printer: []
  },
  onLoad() {
    //获取打印机列表
    this.getPrinter()
  },
  //获取打印机列表
  getPrinter() {
    dd.httpRequest({
      url: getApp().globalData.baseurl + 'package/printer_list',
      method: 'GET',
      dataType: 'json',
      success: (res) => {
        var data = res.data;
        if (!data) {
          this.setData({
            printer: res
          });
        } else {
          this.setData({
            printer: data
          });
        }
      }
    });
  },
  //点击选择某一个打印机
  selItem(e) {
    dd.confirm({
      title: '提示',
      content: '确认选择该打印机？',
      confirmButtonText: '确认',
      cancelButtonText: '重新选择',
      success: (result) => {
        if (result.confirm == true) {
          getApp().globalData.printer = e.target.dataset.item;
          dd.navigateBack({
            delta: 1
          })
        } else {
          dd.showToast({
            type: 'none',
            content: "请重新选择",
            duration: 2000
          });
        }
      },
    });
  }
})