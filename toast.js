(function (window, document) {
    // ==============================
    // 配置参数
    // ==============================
    // Toast 显示时间（毫秒）
    var SHOW_DURATION = 2000;
    // 淡出动画时间（毫秒）
    var FADE_DURATION = 200;
    // ==============================
    // 内部变量
    // ==============================

    // 消息队列
    var toastQueue = [];

    // Toast DOM 对象
    var toastElement = null;

    // 当前是否正在显示 Toast
    var isShowing = false;
    // 定时器
    var hideTimer = null;
    var nextTimer = null;

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
    // 安全设置样式属性，兼容旧浏览器
    function setStyle(style, property, value) {
        try {
            style[property] = value;
        } catch (e) {
            // 忽略不支持的 CSS 属性
        }
    }
    // 设置 Transform
    function setTransform(element, value) {
        var style = element.style;

        setStyle(style, "webkitTransform", value);
        setStyle(style, "MozTransform", value);
        setStyle(style, "msTransform", value);
        setStyle(style, "OTransform", value);
        setStyle(style, "transform", value);
    }
    // 判断浏览器是否支持 Transform
    function hasTransform(style) {
        return typeof style.transform !== "undefined" ||
            typeof style.webkitTransform !== "undefined" ||
            typeof style.MozTransform !== "undefined";
    }
    // 设置文字内容，避免 HTML 注入
    function setText(element, message) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        element.appendChild(document.createTextNode(message));
    }
    // ==============================
    // 创建 Toast DOM
    // ==============================
    function createToast() {
        if (!document.body) {
            return null;
        }
        // 如果已经创建，不重复创建
        if (!toastElement) {
            toastElement = document.createElement("div");
            toastElement.setAttribute("role", "status");
            toastElement.setAttribute("aria-live", "polite");

            var style = toastElement.style;
            style.position = "fixed";
            style.left = "50%";
            style.top = "50%";

            style.zIndex = "2147483647";

            style.maxWidth = "80%";
            style.boxSizing = "border-box";
            style.webkitBoxSizing = "border-box";

            style.padding = "12px 20px";
            style.borderRadius = "8px";

            style.backgroundColor = "rgba(0, 0, 0, 0.8)";
            style.color = "#ffffff";

            style.fontSize = "14px";
            style.lineHeight = "1.5";
            style.fontFamily = "Arial, sans-serif";

            style.textAlign = "center";
            style.wordWrap = "break-word";
            style.wordBreak = "break-word";

            style.opacity = "0";
            style.filter = "alpha(opacity=0)";

            style.visibility = "hidden";
            style.display = "none";
            style.pointerEvents = "none";
            // CSS 动画，不支持时自动降级
            setStyle(style, "transition",
                "opacity 200ms ease, transform 200ms ease");

            setStyle(style, "webkitTransition",
                "opacity 200ms ease, -webkit-transform 200ms ease");
            setTransform(
                toastElement,
                "translate(-50%, -50%) scale(0.95)"
            );
        }
        // 如果 DOM 被外部移除，则重新添加
        if (toastElement.parentNode !== document.body) {
            document.body.appendChild(toastElement);
        }
        return toastElement;
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
                window.removeEventListener("load", loadHandler, false);
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
    // DOM 就绪回调
    function handleBodyReady() {
        if (!document.body) {
            return;
        }
        waitingForBody = false;
        removeReadyListeners();
        displayNext();
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

            document.attachEvent("onreadystatechange", readyStateHandler);
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
    }
    // ==============================
    // 显示下一条消息
    // ==============================
    function displayNext() {
        // 正在显示，或者没有待显示消息
        if (isShowing || toastQueue.length === 0) {
            return;
        }
        // 等待 body 创建
        if (!document.body) {
            waitForBody();
            return;
        }
        var element = createToast();
        if (!element) {
            return;
        }
        // 取出队列中的第一条消息
        var message = toastQueue.shift();
        setText(element, message);
        isShowing = true;
        // 显示 DOM
        element.style.display = "block";
        element.style.visibility = "visible";
        // 设置动画初始状态
        element.style.opacity = "0";
        element.style.filter = "alpha(opacity=0)";

        if (hasTransform(element.style)) {
            setTransform(
                element,
                "translate(-50%, -50%) scale(0.95)"
            );
        } else {
            // 不支持 Transform 时，使用负边距居中
            element.style.marginLeft =
                "-" + Math.round(element.offsetWidth / 2) + "px";
            element.style.marginTop =
                "-" + Math.round(element.offsetHeight / 2) + "px";
        }
        // 强制浏览器完成一次布局，保证动画生效
        element.offsetWidth;
        // 设置动画结束状态
        element.style.opacity = "1";
        element.style.filter = "alpha(opacity=100)";
        if (hasTransform(element.style)) {
            setTransform(
                element,
                "translate(-50%, -50%) scale(1)"
            );
        } else {
            element.style.marginLeft =
                "-" + Math.round(element.offsetWidth / 2) + "px";

            element.style.marginTop =
                "-" + Math.round(element.offsetHeight / 2) + "px";
        }
        // 显示指定时间后开始隐藏
        hideTimer = window.setTimeout(function () {
            hideTimer = null;
            // 开始淡出
            element.style.opacity = "0";
            element.style.filter = "alpha(opacity=0)";
            // 动画结束后显示下一条
            nextTimer = window.setTimeout(function () {
                nextTimer = null;
                element.style.visibility = "hidden";
                element.style.display = "none";
                isShowing = false;
                // 继续处理消息队列
                displayNext();
            }, FADE_DURATION);
        }, SHOW_DURATION);
    }

    // ==============================
    // 对外接口
    // ==============================
    function show(message) {
        // 统一转换为字符串
        if (message === null || typeof message === "undefined") {
            message = "";
        } else {
            try {
                message = String(message);
            } catch (e) {
                message = "";
            }
        }
        // 消息进入队列
        toastQueue.push(message);
        // 尝试显示
        displayNext();
    }
    // 暴露全局接口
    window.Toast = {
        show: show
    };
})(window, document);
