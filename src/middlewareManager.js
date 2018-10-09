import {Middleware} from './middleware';
import {MiddlewareContext} from './middlewareContext';

const lastMiddleware = new Middleware();

function buildMiddlewareChains(registedItems, index = 0) {
    if (index === registedItems.length) {
        return lastMiddleware;
    }
    if (registedItems[index].type === 'type') {
        return Reflect.construct(registedItems[index].target, [buildMiddlewareChains(registedItems, index + 1)].concat(registedItems[index].args));
    }
    if (registedItems[index].type === 'instance') {
        registedItems[index].target.setNextMiddleware(buildMiddlewareChains(registedItems, index + 1));
        return registedItems[index].target;
    }
}

const privateNames = {
    registedItems: Symbol("registedItems")
}

export class MiddlewareManager {
    constructor() {
        this[privateNames.registedItems] = [];
    }

    registerType(type, ...args) {
        if (typeof (type) !== 'function' ||
            (type != Middleware && !Middleware.prototype.isPrototypeOf(type.prototype))) {
            throw 'type is not extends from Middleware';
        }
        this[privateNames.registedItems].push({
            type: 'type',
            target: type,
            args: args
        });
        return this;
    }

    registerInstance(instance) {
        if (!(instance instanceof Middleware)) {
            throw 'type is not a Middleware';
        }
        this[privateNames.registedItems].push({
            type: 'instance',
            target: instance,
            args: []
        });
        return this;
    }

    clear() {
        this[privateNames.registedItems].length = 0;
    }

    async request(data = {}) {
        const middlewareContext = new MiddlewareContext(this, data);
        const firstMiddleware = buildMiddlewareChains(this[privateNames.registedItems]);
        await firstMiddleware.invoke(middlewareContext);
        return data;
    }
}
