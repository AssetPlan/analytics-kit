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
                    const result = provider[methodName](...args);

                    // Handle promises
                    if (result && typeof result.then === 'function') {
                        return result.catch(error => {
                            console.error(`Analytics provider async error in '${methodName}':`, error);
                        });
                    }

                    return result;
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

    createScopedAnalytics(scopeMap) {
        const instances = {};

        // Validate the scope map on creation
        for (const scopeName in scopeMap) {
            if (typeof scopeMap[scopeName] !== 'function') {
                throw new Error(`Scope '${scopeName}' must be a function returning an analytics provider`);
            }
        }

        return {
            /**
             * Returns the analytics provider for the given scope.
             * Initializes it if it hasn't been already.
             */
            for(scope) {
                if (!scopeMap[scope]) {
                    throw new Error(`Scope '${scope}' is not registered`);
                }

                if (!instances[scope]) {
                    instances[scope] = scopeMap[scope]();
                }

                return instances[scope];
            }
        };
    }
}

const analyticsKit = new AnalyticsWrapper();

export default analyticsKit;
export * from './providers/index.js';
