const userAgent = window.navigator.userAgent.toLowerCase();
const canPostMessage = window.webkit && window.webkit.messageHandlers
                        && window.webkit.messageHandlers.WebViewBridge.postMessage;

const isIphone = userAgent.match(/iphone/);
const isAndroid = userAgent.match(/android/);

export default {
    canPostMessage,
    isIphone,
    isAndroid,
};
