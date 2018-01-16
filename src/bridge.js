import utils from './utils';

let iframe;

function compatibility(urlScheme, msg) {
    if (!iframe) {
        iframe = window.document.createElement('iframe');
        iframe.setAttribute('style', 'display:none;');
        window.document.documentElement.appendChild(iframe);
    }
    iframe.src = `${urlScheme}${encodeURIComponent(msg)}`;
}

export default class {
    constructor(urlScheme) {
        this.urlScheme = urlScheme;
        this.callQueue = [];
    }

    /**
     * 1、首先判断在ios8及以上系统中，app WebView是否做了对window.webkit.messageHandlers.WebViewBridge的处理，使用postMessage对客户端app发送消息
     * 2、再次判断在WebView中是否在window对象中注入了全局变量，调用客户端原生对象方法
     * 3、最后通过url scheme来调用客户端原生对象方法
     */
    call(method, params) {
        return new Promise(resolve => {
            const msg = JSON.stringify({
                method,
                params,
            });
            if (utils.canPostMessage) {
                window.webkit.messageHandlers.WebViewBridge.postMessage(msg);
            } else if (window.WebViewBridge) {
                if (window.WebViewBridge.call) {
                    window.WebViewBridge.call(msg);
                } else {
                    window.WebViewBridge[method](JSON.stringify(params));
                }
            } else {
                setTimeout(() => {
                    compatibility(this.urlScheme, msg);
                }, 100);
            }
            this.callQueue[method] = res => {
                resolve(res || {});
                delete this.callQueue[method];
            };
        });
    }
}
