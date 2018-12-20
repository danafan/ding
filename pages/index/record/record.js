Page({
  data: {
    recordList: [],                        //记录列表
    page: 1,                               //当前页码
    title: '',                            //显示标题
    url:''
  },
  onLoad(e) {
    this.setData({
      title: e.type == '1'?"我的记录":"异常包裹",
      url: e.type == '1'?"my/my_operate_record":"my/my_timeout_record"
    });
    //获取我的所有记录
    this.getRecord(this.data.url);
  },
  onShow() {
    dd.setNavigationBar({
      title: this.data.title
    });
  },
  //获取我的所有记录
  getRecord(url) {
    dd.httpRequest({
      url: getApp().globalData.baseurl + url,
      method: 'GET',
      data: {
        page: this.data.page
      },
      dataType: 'json',
      success: (res) => {
        var data = res.data;
        if (data.code == 1) {
          let list = data.data;
          this.setData({
            recordList: this.data.recordList.concat(Array.from(list))
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
  //页面滚动到底部触发（加载下一页）
  lower(e) {
    this.setData({
      page: this.data.page + 1
    });
    //获取我的所有记录
    this.getRecord(this.data.url);
  },
  //点击查看详情
  detail(e) {
    let id = e.currentTarget.dataset.id;
    dd.navigateTo({ url: '/pages/index/record/detail/detail?id=' + id });
  }
})