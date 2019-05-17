
require('./config$.js?appxworker=1');
require('./importScripts$.js?appxworker=1');
function success() {
require('../..//app.js?appxworker=1');
require('../../pages/index/index.js?appxworker=1');
require('../../pages/index/package/package.js?appxworker=1');
require('../../pages/index/truck/truck.js?appxworker=1');
require('../../pages/index/getoff/getoff.js?appxworker=1');
require('../../pages/index/reach/reach.js?appxworker=1');
require('../../pages/index/sendback/sendback.js?appxworker=1');
require('../../pages/index/void/void.js?appxworker=1');
require('../../pages/index/packDetail/packDetail.js?appxworker=1');
require('../../pages/index/packageDetail/getdetail.js?appxworker=1');
require('../../pages/index/carDetail/cardetail.js?appxworker=1');
require('../../pages/index/record/record.js?appxworker=1');
require('../../pages/index/sign/sign.js?appxworker=1');
require('../../pages/index/record/detail/detail.js?appxworker=1');
require('../../pages/index/record/detail/goods/goods.js?appxworker=1');
require('../../pages/index/claimGoods/claimGoods.js?appxworker=1');
require('../../pages/index/printer/printer.js?appxworker=1');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
