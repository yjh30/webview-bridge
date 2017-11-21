import Bridge from './bridge';
import './callbackHandle';

export default class {
    constructor(urlScheme) {
        const bridge = new Bridge(urlScheme);
        window.WebViewBridgeInstance = bridge;

        return bridge;
    }
}
