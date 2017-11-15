import Bridge from './bridge';
import './callbackHandle';

export default urlScheme => {
    const bridge = new Bridge(urlScheme);
    window.WebViewBridge = bridge;

    return bridge;
}
