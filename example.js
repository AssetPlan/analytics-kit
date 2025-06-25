import * as analyticsKit from './dist/index.esm.js';

const consoleLogProvider = {
    track: (event, properties) => {
        console.log('Tracking', event, properties);
    },
    identify: (userId, traits) => {
        console.log('Identifying', userId, traits);
    },
    page: (name, properties) => {
        console.log(name, properties);
    },
    reset: () => {
        console.log('reset');
    },
    alias: (newId, previousId) => {
        console.log(newId, previousId);
    },
    ready: () => {
        console.log('ready');
    }
};

// Example of async provider that returns promises
const asyncProvider = {
    track: async (event, properties) => {
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log('Async tracking completed:', event, properties);
        return { success: true, eventId: Math.random() };
    },
    identify: async (userId, traits) => {
        await new Promise(resolve => setTimeout(resolve, 50));
        console.log('Async identify completed:', userId, traits);
        return { success: true, userId };
    },
    ready: () => {
        // Mix of sync and async methods is fine
        console.log('Sync ready called');
    }
};

// Example of async provider that sometimes fails
const flakyAsyncProvider = {
    track: async (event, properties) => {
        if (Math.random() > 0.5) {
            throw new Error('Random async failure');
        }
        return { success: true, event };
    }
};

const syncTracker = analyticsKit.registerProvider(consoleLogProvider);
const asyncTracker = analyticsKit.registerProvider(asyncProvider);
const flakyTracker = analyticsKit.registerProvider(flakyAsyncProvider);

// Sync usage (same as before)
syncTracker.track('sync-event', { data: 'test' });

// Async usage - you can await if you need the result
async function example() {
    try {
        const result = await asyncTracker.track('async-event', { data: 'test' });
        console.log('Got result:', result); // { success: true, eventId: 0.123... }
        
        const identifyResult = await asyncTracker.identify('user123', { name: 'John' });
        console.log('Identify result:', identifyResult); // { success: true, userId: 'user123' }
    } catch (error) {
        // This won't happen because errors are caught internally
        console.log('This rarely runs');
    }
}

// Fire-and-forget async usage (don't await)
asyncTracker.track('fire-and-forget', { background: true });

// Flaky provider - errors are handled gracefully
flakyTracker.track('might-fail', { data: 'test' });

example();

