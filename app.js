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

function jbzYeePay() {
  var dataObj = {
    "type": "message",
    "data": {
      "type": "APP_WX_PAY",
      "data": {
        "paymentNo": "S20261104181305354949050",
        "authCode": {
          "miniProgramPath": "pages/fromAppPay/index",
          "miniProgramOrgId": "gh_241ada54772a",
          "appId": "wxebbfb0c332a64879",
          "prePayTn": "pages/fromAppPay/index?state=688fc734-a53c-4c86-b822-e60a9e2828f6&customerNo=10092187226&goodsName=%E6%B5%8B%E8%AF%95%E2%80%94%E2%80%94%E9%85%B1%E6%B2%B9++%E5%8B%BF%E6%8B%8D%E4%B8%8D%E5%8F%91%E8%B4%A7&customerRequestNo=S20261104181305354949050&orderAmount=3.3&launchSource=SDK_PAY"
        },
        "companay": "yeepay",
        "success": true,
        "bizCode": "S20261104181305354949050",
        "tid": "S20261104181305354949050_2",
        "tutelagePay": true
      }
    }
  };

  // 最终转成符合规范的 JSON 字符串
  var json = JSON.stringify(dataObj);

  window.Android.postMessage(json);
}

// ==================== 示例模块（保留原有测试） ====================

// 获取设备信息并打印到控制台
function getDeviceInfo() {
  const res = window.android.getDeviceInfo();
  console.log('Bridge返回:', res);
}
