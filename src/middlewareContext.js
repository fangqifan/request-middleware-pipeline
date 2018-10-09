import {MiddlewareManager} from './middlewareManager';

const privateNames = {
    data: Symbol('data'),
    middlewareManager: Symbol('middlewareManager')
};

export class MiddlewareContext {
    constructor(middlewareManager, data = {}) {
        if (!(middlewareManager instanceof MiddlewareManager)) {
            throw 'middlewareManager must be MiddlewareManager';
        }
        this[privateNames.middlewareManager] = middlewareManager;
        this[privateNames.data] = data;
    }

    get middlewareManager() {
        return this[privateNames.middlewareManager];
    }

    get data() {
        return this[privateNames.data];
    }
}
