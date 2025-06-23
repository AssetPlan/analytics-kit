# Analytics Interface

A lightweight analytics provider wrapper for consistent tracking across different analytics services.

## Installation

```bash
npm install @assetplan/analytics-interface
```

## Usage

### Basic Setup

```javascript
import analyticsWrapper from '@assetplan/analytics-interface';

// Create a provider
const consoleProvider = {
    track: (event, properties) => {
        console.log('Tracking:', event, properties);
    },
    identify: (userId, traits) => {
        console.log('Identifying:', userId, traits);
    },
    page: (name, properties) => {
        console.log('Page:', name, properties);
    },
    reset: () => {
        console.log('Reset');
    },
    alias: (newId, previousId) => {
        console.log('Alias:', newId, previousId);
    },
    ready: () => {
        console.log('Ready');
    }
};

// Register the provider
const tracker = analyticsWrapper.registerProvider(consoleProvider);

// Use the tracker
tracker.track('button_clicked', { button: 'signup' });
tracker.identify('user123', { email: 'user@example.com' });
```

### Async Providers

```javascript
const asyncProvider = {
    track: async (event, properties) => {
        await fetch('/analytics', {
            method: 'POST',
            body: JSON.stringify({ event, properties })
        });
        return { success: true };
    }
};

const asyncTracker = analyticsWrapper.registerProvider(asyncProvider);

// Can be used with await
const result = await asyncTracker.track('purchase', { amount: 100 });

// Or fire-and-forget
asyncTracker.track('page_view', { page: '/home' });
```

### Multiple Providers

```javascript
// Each provider is independent
const googleTracker = analyticsWrapper.registerProvider(googleAnalyticsProvider);
const segmentTracker = analyticsWrapper.registerProvider(segmentProvider);
const consoleTracker = analyticsWrapper.registerProvider(consoleProvider);

// Track to specific providers
googleTracker.track('conversion', { value: 100 });
segmentTracker.track('user_action', { action: 'click' });
```

## Provider Interface

Each provider should implement these methods (all optional):

```javascript
{
    track: (event: string, properties: object) => void | Promise<any>,
    identify: (userId: string, traits: object) => void | Promise<any>,
    page: (name: string, properties: object) => void | Promise<any>,
    reset: () => void | Promise<any>,
    alias: (newId: string, previousId: string) => void | Promise<any>,
    ready: () => void | Promise<any>
}
```

## Error Handling

The wrapper handles errors gracefully:

- Missing methods show warnings but don't crash
- Thrown errors are caught and logged
- Promise rejections are handled automatically
- Your app continues running even if analytics fail

## License

MIT