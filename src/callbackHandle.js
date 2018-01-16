import instances from  './instances';

/**
 * 调用原生客户端方法后执行的回调函数
 * @param  {String} method 方法名
 * @param  {Object|String} res 回调响应信息
 */
window.WebViewBridgeCallback = (method, res) => {
    if (typeof res === 'string') {
        try {
            res = JSON.parse(res);
        } catch(e) {
            // ...
        }
    }
    instances.forEach(instance => {
        if (method && instance.callQueue[method]) {
            instance.callQueue[method](res);
        }
    });
};
