Page({
  data: {
    recordList: [],                        //记录列表
    page: 1,                                //当前页码
    title: 'abc',
    src: 'http://music.163.com/song/media/outer/url?id=317151.mp3',
    coverImgUrl: 'https://s3.music.126.net/m/s/img/disc_default.png?7c9b3adc16f5485c2bfbe8a540534188',
  },
  onLoad() {
    //获取我的所有记录
    this.getRecord();
  },
  //获取我的所有记录
  getRecord() {
    dd.httpRequest({
      url: 'http://erpcs.ppg8090.com/api/my/my_operate_record',
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
    this.getRecord();
  },
  //点击查看详情
  detail(e) {
    let id = e.currentTarget.dataset.id;
    dd.navigateTo({ url: '/pages/index/record/detail/detail?id=' + id });
  }
})