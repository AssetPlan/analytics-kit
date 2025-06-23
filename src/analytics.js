class AnalyticsWrapper {
    registerProvider(provider) {
        if (!provider || typeof provider !== 'object') {
            throw new Error('Provider must be an object');
        }

        const createMethodWrapper = (methodName) => {
            return (...args) => {
                if (typeof provider[methodName] !== 'function') {
                    console.warn(`Provider method '${methodName}' is not implemented`);
                    return;
                }

                try {
                    return provider[methodName](...args);
                } catch (error) {
                    console.error(`Analytics provider error in '${methodName}':`, error);
                }
            };
        };

        return {
            track: createMethodWrapper('track'),
            identify: createMethodWrapper('identify'),
            page: createMethodWrapper('page'),
            reset: createMethodWrapper('reset'),
            alias: createMethodWrapper('alias'),
            ready: createMethodWrapper('ready')
        };
    }
}

const analyticsWrapper = new AnalyticsWrapper();

export default analyticsWrapper;
