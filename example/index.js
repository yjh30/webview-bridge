import './index.css';
import Bridge from '../src/index';

const WebViewBridge = new Bridge('qq://');

WebViewBridge.on('aa', () => {
    console.log('触发了一个事件！');
});

WebViewBridge.emit('aa');

const button = document.querySelector('.button');
const methodInput = document.querySelector('.method');
const paramsInput = document.querySelector('.params');

button.addEventListener('click', () => {
    const method = methodInput.value.trim();
    const params = paramsInput.value.trim();

    WebViewBridge.call(method, params);
});
