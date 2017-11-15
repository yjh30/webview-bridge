# Native/Webview bridge for Hybrid


## 安装

``` bash
npm i --save hybride-webview-bridge
```


## 特点
* 支持自定义app URL scheme
* 支持多种处理方式
* 支持Promise处理回调


## 使用

``` js
import Bridge from 'hybride-webview-bridge';

// 如果客户端没有使用URL scheme，则不需要传递参数
const WebViewBridge = new Bridge('qq://');

/**
 * 调用原生方法
 * @param  {String} method 方法名
 * @param  {Object} params 参数
 * @return {Promise}       当收到原生方法执行的返回结果时resolve
 */
// WebViewBridge.call(method, params);

// for instance
WebViewBridge.call('getUserInfo').then(res => {
    // handle response info
});

// for instance
WebViewBridge.call('getLocation', { CacheMode: 0 }).then(res => {
    // handle response info
});

```


## 要求（原理）

1、如果ios开发在ios8及以上系统使用postMessage，请支持js变量window.webkit.messageHandlers.WebViewBridge，内部实现如下：
``` js
window.webkit.messageHandlers.WebViewBridge.postMessage(JSON.stringify({
    method: 'getLocation',
    params: {
        CacheMode: 0,
    },
}));
```

2、客户端注入全局对象 WebViewBridge，并实现call方法，js用法如下：
``` js
window.WebViewBridge.call('getLocation', JSON.stringify({
    CacheMode: 0,
}));
```
如果没有实现call方法，则js内部会调用被注入WebViewBridge对象方法，如：
``` js
window.WebViewBridge.getLocation(JSON.stringify({
    CacheMode: 0,
}));
```

3、如果不支持postMessage发送消息，也没有注入全局js对象，最一种就是使用URL scheme了，客户端url拦截处理，这种方式需要使用setTimeout延时处理，避免后者覆盖前者（同时调用多次）


## callback 回调

当调用 WebViewBridge.call('getUserInfo')成功，要求客户端调用前端 WebViewBridgeCallback 方法进行响应，源码如下：
``` js
/**
 * 调用原生客户端方法后执行的回调函数
 * @param  {String} method 方法名
 * @param  {Object|String} res 回调响应信息
 */
window.WebViewBridgeCallback = (method, res) => {
    if (typeof res === 'String') {
        res = JSON.parse(res);
    }
    window.WebViewBridge.receiveResponse(method, res);
};
```

