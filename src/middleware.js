const privateNames = {
    nextMiddleware: Symbol('nextMiddleware')
};

export class Middleware {
    constructor(nextMiddleware) {
        if (nextMiddleware) {
            this.setNextMiddleware(nextMiddleware);
        }
    }

    setNextMiddleware(nextMiddleware) {
        if (nextMiddleware) {
            if (!(nextMiddleware instanceof Middleware)) {
                throw 'nextMiddleware is not Middleware';
            }
        }
        this[privateNames.nextMiddleware] = nextMiddleware;
    }

    async next(middlewareContext) {
        if (this[privateNames.nextMiddleware]) {
            await this[privateNames.nextMiddleware].invoke(middlewareContext);
        }
    }

    invoke(){
        
    }
}
