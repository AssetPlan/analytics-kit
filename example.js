import analyticsWrapper from './src/analytics.js';

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

// Example of incomplete provider (missing some methods)
const incompleteProvider = {
    track: (event, properties) => {
        console.log('Incomplete provider tracking:', event, properties);
    }
    // Missing other methods - will show warnings
};

// Example of provider that throws errors
const errorProvider = {
    track: (event, properties) => {
        throw new Error('Simulated analytics error');
    }
};

window.consoleLogTrack = analyticsWrapper.registerProvider(consoleLogProvider);
window.incompleteTrack = analyticsWrapper.registerProvider(incompleteProvider);
window.errorTrack = analyticsWrapper.registerProvider(errorProvider);

// This works normally
window.consoleLogTrack.track('test', { test: 'test' });

// This shows warning for missing method
window.incompleteTrack.identify('user123', { name: 'John' });

// This handles the error gracefully
window.errorTrack.track('will-error', { data: 'test' });

