# Native/Webview bridge for Hybrid

## 安装

``` bash
npm i --save webview-bridge
```


## 特点
* 支持自定义app URL scheme
* 支持多种处理方式（全部涵盖）
* 支持Promise处理回调


## 使用

``` js
import Bridge from 'hybride-webview-bridge';

// 如果客户端没有使用URL scheme，则不需要传递参数
const WebViewBridge = new Bridge('mqq://');
WebViewBridge.call(); // 将会唤起手机版qq软件

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

3、如果不支持postMessage发送消息，也没有注入全局js对象，最一种就是使用URL scheme了，客户端url拦截处理，这种方式需要使用setTimeout延时处理，避免后者覆盖前者（同时调用多次）协议地址类似如下：
``` js
const msg = decodeURIComponent(JSON.stringify({
    method: 'getLocation',
    params: {
        CacheMode: 0,
    },
}));
const URLScheme = `qq://${msg}`;
```


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
    window.WebViewBridgeInstance.receiveResponse(method, res);
};
```


## 知识点扩充

##### android
> 安卓通过addJavaScriptInterface方法注入Java对象到js上下文对象window中，由于4.2以下版本中，该方法有漏洞，
解决该漏洞的方法有两种，第一种通过URL scheme解决，第二种通过如下方案解决：
```
webview.loadUrl("javascript:if(window.WebViewBridge === undefined) { window.WebViewBridge = { call: function(jsonString) { window.prompt(jsonString); }}};");
```
在webview中通过loadUrl定义一个window.WebViewBridge及call通用方法，方法体内执行了window.prompt，然后在WebChromeClient类中处理onJsPrompt，设置拦截规则，onJsPrompt返回true，将不处理dialog；

推荐文章：[安卓Webview](http://mp.weixin.qq.com/s/4XRB7nqTVftL5K2jAMGVVg)


##### ios
> ios8系统及以上版本可以通过注入 window.webkit.messageHandlers.XXX.postMessage方法，我们可以使用这个方法直接向 Native 层传值，非常方便。
推荐文章：[postMessage技术](https://lvwenhan.com/ios/461.html) [ios官方webkit网站](https://developer.apple.com/documentation/webkit)

> ios7开始，还可以使用[javascriptcore](https://developer.apple.com/documentation/javascriptcore)注入Java对象到js上下文对象window中
> 最后一种 ios也支持URL scheme

推荐文章：[WKWebview相关](https://www.cnblogs.com/cynthia-wuqian/p/6268359.html)

