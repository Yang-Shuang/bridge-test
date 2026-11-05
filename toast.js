(function (window, document) {
    // ==============================
    // 配置参数
    // ==============================
    // Toast 显示时间（毫秒）
    var SHOW_DURATION = 2000;
    // 淡出动画时间（毫秒）
    var FADE_DURATION = 200;
    // Toast 之间的垂直间距（像素）
    var STACK_GAP = 8;

    // ==============================
    // 内部变量
    // ==============================

    // 所有 Toast 共用的容器
    var toastContainer = null;

    // DOM 就绪之前暂存的消息
    var pendingMessages = [];

    // 是否正在等待 DOM 就绪
    var waitingForBody = false;

    // DOM 就绪事件处理器
    var domReadyHandler = null;
    var loadHandler = null;
    var readyStateHandler = null;
    var previousOnload = null;

    // ==============================
    // 辅助方法
    // ==============================
    // 安全转换字符串
    function toMessage(message) {
        if (message === null || typeof message === "undefined") {
            return "";
        }
        try {
            return String(message);
        } catch (e) {
            return "";
        }
    }
    // 设置透明度，同时兼容旧版 IE
    function setOpacity(element, opacity) {
        element.style.opacity = String(opacity / 100);
        element.style.filter = "alpha(opacity=" + opacity + ")";
    }
    // 判断是否支持 CSS Transition
    function getTransitionSupport(style) {
        var property;
        if (typeof style.transition !== "undefined") {
            property = "transition";
        } else if (typeof style.webkitTransition !== "undefined") {
            property = "webkitTransition";
        } else if (typeof style.MozTransition !== "undefined") {
            property = "MozTransition";
        } else if (typeof style.msTransition !== "undefined") {
            property = "msTransition";
        } else if (typeof style.OTransition !== "undefined") {
            property = "OTransition";
        }
        if (!property) {
            return false;
        }
        style[property] = "opacity " + FADE_DURATION + "ms ease";
        return true;
    }
    // 安全设置文字，避免 HTML 注入
    function setText(element, message) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        element.appendChild(document.createTextNode(message));
    }
    // 移除 DOM
    function removeElement(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }
    // ==============================
    // 创建公共容器
    // ==============================
    function createContainer() {
        if (!document.body) {
            return null;
        }
        // 如果容器已经存在，直接复用
        if (toastContainer &&
            toastContainer.parentNode === document.body) {
            return toastContainer;
        }
        toastContainer = document.createElement("div");
        var style = toastContainer.style;

        // 容器固定在屏幕中央的下边界
        // 新消息追加到底部，旧消息自然向上移动
        style.position = "fixed";
        style.left = "0";
        style.bottom = "50%";
        style.width = "100%";
        style.zIndex = "2147483647";
        style.textAlign = "center";
        style.margin = "0";
        style.padding = "0";
        // 不影响页面其他元素的点击
        style.pointerEvents = "none";
        toastContainer.setAttribute("aria-live", "polite");
        toastContainer.setAttribute("aria-atomic", "false");
        document.body.appendChild(toastContainer);
        return toastContainer;
    }
    // ==============================
    // 创建单条 Toast
    // ==============================
    function createToast(message) {
        var element = document.createElement("div");
        var style = element.style;
        element.setAttribute("role", "status");
        // 基础布局
        // 使用 display:table 实现内容自适应宽度
        style.display = "table";
        style.position = "relative";
        style.maxWidth = "80%";
        style.margin = STACK_GAP + "px auto 0";
        // 文字与外观
        style.boxSizing = "border-box";
        style.webkitBoxSizing = "border-box";
        style.padding = "12px 20px";
        style.borderRadius = "8px";
        // 先设置普通背景色，兼容不支持 rgba 的旧浏览器
        style.backgroundColor = "#333333";
        style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        style.color = "#ffffff";
        style.fontSize = "14px";
        style.lineHeight = "1.5";
        style.fontFamily = "Arial, sans-serif";
        style.textAlign = "center";
        style.wordWrap = "break-word";
        style.wordBreak = "break-word";
        // 初始透明
        setOpacity(element, 0);
        style.visibility = "visible";
        // 动画兼容
        var transitionSupported = getTransitionSupport(style);
        // 设置文字
        setText(element, message);
        return {
            element: element,
            transitionSupported: transitionSupported
        };
    }
    // ==============================
    // 显示一条 Toast
    // ==============================
    function displayToast(message) {
        var container = createContainer();
        if (!container) {
            return;
        }
        // 每条消息都创建独立 DOM
        var toast = createToast(message);
        var element = toast.element;
        // 添加到公共容器的末尾
        // 新消息出现，旧消息自动向上移动
        container.appendChild(element);
        // 强制浏览器完成布局，确保淡入动画生效
        element.offsetWidth;
        // 显示
        setOpacity(element, 100);
        // 为当前消息单独创建计时器
        window.setTimeout(function () {
            // 开始淡出
            setOpacity(element, 0);
            // 支持动画则等待动画结束
            if (toast.transitionSupported) {
                window.setTimeout(function () {
                    removeElement(element);
                }, FADE_DURATION);
            } else {
                // 不支持动画则直接移除
                removeElement(element);
            }
        }, SHOW_DURATION);
    }
    // ==============================
    // DOM 就绪处理
    // ==============================
    function removeReadyListeners() {
        if (document.removeEventListener) {
            if (domReadyHandler) {
                document.removeEventListener(
                    "DOMContentLoaded",
                    domReadyHandler,
                    false
                );
            }
            if (loadHandler && window.removeEventListener) {
                window.removeEventListener(
                    "load",
                    loadHandler,
                    false
                );
            }
        }
        if (document.detachEvent) {
            if (readyStateHandler) {
                document.detachEvent(
                    "onreadystatechange",
                    readyStateHandler
                );
            }
            if (loadHandler && window.detachEvent) {
                window.detachEvent("onload", loadHandler);
            }
        }
        // 兼容没有事件监听 API 的旧浏览器
        if (
            !document.addEventListener &&
            !document.attachEvent &&
            window.onload === loadHandler
        ) {
            window.onload = previousOnload;
        }
        domReadyHandler = null;
        loadHandler = null;
        readyStateHandler = null;
        previousOnload = null;
    }

    // DOM 就绪
    function handleBodyReady() {
        if (!document.body) {
            return;
        }
        waitingForBody = false;
        removeReadyListeners();
        // 把 DOM 就绪之前的消息一次性显示
        // 这里只是等待 DOM 创建，不是串行消息队列
        var messages = pendingMessages;
        pendingMessages = [];
        for (var i = 0; i < messages.length; i++) {
            displayToast(messages[i]);
        }
    }

    // 等待 body 创建
    function waitForBody() {
        if (waitingForBody) {
            return;
        }
        waitingForBody = true;
        if (typeof document.addEventListener === "function") {
            domReadyHandler = handleBodyReady;
            document.addEventListener(
                "DOMContentLoaded",
                domReadyHandler,
                false
            );
            if (typeof window.addEventListener === "function") {
                loadHandler = handleBodyReady;
                window.addEventListener("load", loadHandler, false);
            }
        } else if (typeof document.attachEvent === "function") {
            readyStateHandler = function () {
                if (document.readyState === "complete") {
                    handleBodyReady();
                }
            };
            loadHandler = handleBodyReady;
            document.attachEvent(
                "onreadystatechange",
                readyStateHandler
            );
            if (typeof window.attachEvent === "function") {
                window.attachEvent("onload", loadHandler);
            }
        } else {
            // 更老的浏览器：使用 onload 回退
            previousOnload = window.onload;
            loadHandler = function () {
                try {
                    if (typeof previousOnload === "function") {
                        previousOnload.apply(window, arguments);
                    }
                } finally {
                    if (window.onload === loadHandler) {
                        window.onload = previousOnload;
                    }
                    handleBodyReady();
                }
            };
            window.onload = loadHandler;
        }
        // 防止注册事件时 DOM 已经就绪
        if (document.body) {
            handleBodyReady();
        }
    }
    // ==============================
    // 对外接口
    // ==============================
    function show(message) {
        message = toMessage(message);
        if (document.body) {
            // body 已经存在，立即显示
            displayToast(message);
        } else {
            // body 尚未创建，暂存到 DOM 就绪
            pendingMessages.push(message);
            waitForBody();
        }
    }
    // ==============================
    // 暴露全局接口
    // ==============================
    window.Toast = {
        show: show
    };
})(window, document);
