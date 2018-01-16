import Bridge from './bridge';
import instances from  './instances';
import './callbackHandle';

export default class extends Bridge {
    constructor(urlScheme) {
        super(urlScheme);
        instances.push(this);
    }
}
