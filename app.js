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

// 定义 UgoEvent 对象
function createUgoEvent() {
  return {
    onShow: function () {
      console.log("[UgoEvent] onShow 被调用");
      Toast.show('UgoEvent.onShow()');
    },
    onUnload: function () {
      console.log("[UgoEvent] onUnload 被调用");
      Toast.show('UgoEvent.onUnload()');
    },
    onLoginSuccess: function () {
      console.log("[UgoEvent] onLoginSuccess 被调用");
      Toast.show('UgoEvent.onLoginSuccess()');
    },
    onShareSuccess: function () {
      console.log("[UgoEvent] onShareSuccess 被调用");
      Toast.show('UgoEvent.onShareSuccess()');
    }
  };
}

// 初始化：默认开启，与你 HTML 中的初始 UI 保持一致
if (typeof window.UgoEvent === "undefined") {
  window.UgoEvent = createUgoEvent();
}

function updateUgoEventUI(enabled) {
  var desc = document.getElementById("ugo-event-state");

  if (desc) {
    desc.textContent = "当前状态: " + (enabled ? "开启" : "关闭");
  }
}

function switchUgoEvent() {
  var enabled;
  if (typeof window.UgoEvent !== "undefined" && window.UgoEvent !== null) {
    // 当前开启，删除 UgoEvent
    delete window.UgoEvent;
    enabled = false;
  } else {
    // 当前关闭，重新定义 UgoEvent
    window.UgoEvent = createUgoEvent();
    enabled = true;
  }
  updateUgoEventUI(enabled);
  console.log("[UgoEvent] 当前状态:", enabled ? "开启" : "关闭");
};

function jbzYeePay(){
  var json = '{"type":"message","data":{"type":"APP_WX_PAY","data":{"paymentNo":"S20260601103746434140268","authCode":"{\"miniProgramPath\":\"pages/fromAppPay/index\",\"miniProgramOrgId\":\"gh_9457a12cbd73\",\"appId\":\"wxebbfb0c332a64879\",\"prePayTn\":\"pages/fromAppPay/index?state=b653697b-e675-44b0-9f9f-6f536304d726&customerNo=10092187226&goodsName=%E8%87%AA%E7%84%B6%E4%B9%8B%E8%87%BB%E4%B8%AD%E5%AE%81%E7%89%B9%E7%BA%A7%E7%BA%A2%E6%9E%B8%E6%9D%9E%28%E4%BF%9D%E8%B4%A8%E6%9C%9F%E5%88%B02026%E5%B9%B412%E6%9C%88%29&customerRequestNo=S20260601103746434140268&orderAmount=39.9&launchSource=SDK_PAY\"}","companay":"yeepay","success":true,"bizCode":"S20260601103746434140268","tid":"S20260601103746434140268","tutelagePay":true},"tid":"S20260601103746434140268"}}';
  window.Android.postMessage(json);
}

// ==================== 示例模块（保留原有测试） ====================

// 获取设备信息并打印到控制台
function getDeviceInfo() {
  const res = window.android.getDeviceInfo();
  console.log('Bridge返回:', res);
}
