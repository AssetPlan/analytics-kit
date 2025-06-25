import type { AnalyticsProvider, ProviderWrapper, ScopeMap, ScopedAnalytics } from './types.js';

function registerProvider(provider: AnalyticsProvider): ProviderWrapper {
    if (!provider || typeof provider !== 'object') {
        throw new Error('Provider must be an object');
    }

    const createMethodWrapper = <K extends keyof AnalyticsProvider>(methodName: K) => {
        return (...args: Parameters<AnalyticsProvider[K]>) => {
            if (typeof provider[methodName] !== 'function') {
                console.warn(`Provider method '${String(methodName)}' is not implemented`);
                return;
            }

            try {
                const result = (provider[methodName] as Function)(...args);

                // Handle promises
                if (result && typeof result.then === 'function') {
                    return result.catch((error: Error) => {
                        console.error(`Analytics provider async error in '${String(methodName)}':`, error);
                    });
                }

                return result;
            } catch (error) {
                console.error(`Analytics provider error in '${String(methodName)}':`, error);
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

function createScopedAnalytics(scopeMap: ScopeMap): ScopedAnalytics {
    const instances: Record<string, AnalyticsProvider> = {};

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
        for(scope: string): AnalyticsProvider {
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

const analyticsKit = {
    registerProvider,
    createScopedAnalytics
};

export { registerProvider, createScopedAnalytics };

export default analyticsKit;

export * from './providers/index.js';
