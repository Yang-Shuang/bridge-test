/**
 * Bridge Test Tool - JavaScript 函数库
 * 所有复杂的 JS Bridge 调用定义在这里，HTML 中通过 onclick 引用
 */

// ==================== 惠买模块 ====================

// 保存图片到相册（百度图片）
function saveImageToGallery() {
  const imgUrl = 'https://image.baidu.com/search/down?&tn=download&word=download&ie=utf8&fr=home&url=https%3A%2F%2Fgips1.baidu.com%2Fit%2Fu%3D3874647369%2C3220417986%26fm%3D3028%26app%3D3028%26f%3DJPEG%26fmt%3Dauto%3Fw%3D720%26h%3D1280&thumbUrl=https%3A%2F%2Fgips1.baidu.com%2Fit%2Fu%3D3874647369%2C3220417986%26fm%3D3028%26app%3D3028%26f%3DJPEG%26fmt%3Dauto%3Fw%3D720%26h%3D1280&iswise=1';
  window.android.saveImageToGallery(imgUrl);
}

// 分享图片（海报类型）
function shareImg() {
  const data = {
    canShareChannels: [{
      posterImg: 'http://img.ugoshop.com/ugoimg/share/img/poster/251226/3c8168b9ffc219825154add6ff5cc21c.jpg',
      shareChannel: 'WECHAT',
      shareContent: '比特兔来测试测试老字1号1 伽玛',
      shareImg: 'http://img.ugoshop.com/ugoimg/share/img/poster/251226/3c8168b9ffc219825154add6ff5cc21c.jpg',
      sharePath: '/pages/goods/index?goodsId=122536',
      shareShowType: 'POSTER',
      shareSubTitle: '',
      shareTitle: '比特兔来测试测试老字1号1 伽玛',
      shareUrl: 'https://m.ugoshop.com/goods-122536?goodsId=122536'
    }],
    shadeSubTitle: '',
    shadeText: '',
    shadeTitle: ''
  };
  window.android.toShareNew(JSON.stringify(data));
}

// 分享链接（链接类型）
function shareLink() {
  const data = {
    canShareChannels: [{
      posterImg: 'http://img.ugoshop.com/ugoimg/share/img/poster/251226/3c8168b9ffc219825154add6ff5cc21c.jpg',
      shareChannel: 'WECHAT',
      shareContent: '比特兔来测试测试老字1号1 伽玛',
      shareImg: 'http://img.ugoshop.com/ugoimg/share/img/poster/251226/3c8168b9ffc219825154add6ff5cc21c.jpg',
      sharePath: '/pages/goods/index?goodsId=122536',
      shareShowType: 'LINK',
      shareSubTitle: '',
      shareTitle: '比特兔来测试测试老字1号1 伽玛',
      shareUrl: 'https://m.ugoshop.com/goods-122536?goodsId=122536'
    }],
    shadeSubTitle: '',
    shadeText: '',
    shadeTitle: ''
  };
  window.android.toShareNew(JSON.stringify(data));
}

function isNotificationEnabled() {
  const res = window.android.isNotificationEnabled();
	alert("通知状态 : " + res);
}

function toOpenNotification() {
  const res = window.android.toOpenNotification();
}

function saveImageToGallery() {
  const res = window.android.saveImageToGallery('http://pic1.win40000.com/wallpaper/8/57c79ee0d5ddf.jpg');
}

// ==================== 示例模块（保留原有测试） ====================

// 获取设备信息并打印到控制台
function getDeviceInfo() {
  const res = window.android.getDeviceInfo();
  console.log('Bridge返回:', res);
}
