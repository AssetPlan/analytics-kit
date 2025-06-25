# Analytics Kit

A complete analytics toolkit with provider wrappers and presets for consistent tracking across different analytics services.

## Installation

```bash
npm install @assetplan/analytics-kit
```

## Usage

### Basic Setup

```javascript
import analyticsKit from '@assetplan/analytics-kit';

// Create a provider
const consoleProvider = {
    track: (event, properties) => {
        console.log('📊 Track:', event, properties);
    },
    identify: (userId, traits) => {
        console.log('👤 Identify:', userId, traits);
    },
    page: (name, properties) => {
        console.log('📄 Page:', name, properties);
    },
    reset: () => {
        console.log('🔄 Reset: User session cleared');
    },
    alias: (newId, previousId) => {
        console.log('🔗 Alias:', { newId, previousId });
    },
    ready: () => {
        console.log('✅ Ready: Console provider initialized');
    }
};

// Register the provider
const tracker = analyticsKit.registerProvider(consoleProvider);

// Use the tracker
tracker.track('button_clicked', { button: 'signup' });
tracker.identify('user123', { email: 'user@example.com' });
```

### Using the Built-in Console Provider

For development and debugging, you can use the built-in console provider:

```javascript
import analyticsKit, { consoleProvider } from '@assetplan/analytics-kit';

// Use the built-in console provider directly
const tracker = analyticsKit.registerProvider(consoleProvider);

tracker.track('button_clicked', { button: 'signup' });
// Output: 📊 Track: button_clicked { button: 'signup' }

tracker.identify('user123', { email: 'user@example.com' });
// Output: 👤 Identify: user123 { email: 'user@example.com' }
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

const asyncTracker = analyticsKit.registerProvider(asyncProvider);

// Can be used with await
const result = await asyncTracker.track('purchase', { amount: 100 });

// Or fire-and-forget
asyncTracker.track('page_view', { page: '/home' });
```

### Multiple Providers

```javascript
// Each provider is independent
const googleTracker = analyticsKit.registerProvider(googleAnalyticsProvider);
const segmentTracker = analyticsKit.registerProvider(segmentProvider);
const consoleTracker = analyticsKit.registerProvider(consoleProvider);

// Track to specific providers
googleTracker.track('conversion', { value: 100 });
segmentTracker.track('user_action', { action: 'click' });
```

### Scoped Analytics

Create multiple analytics contexts with lazy initialization:

```javascript
import analyticsKit from '@assetplan/analytics-kit';

// Define bootstrap functions for different contexts
const bootstrapProductionAnalytics = () => {
    // Initialize PostHog, Segment, etc.
    return analyticsKit.registerProvider(productionProvider);
};

const bootstrapDevelopmentAnalytics = () => {
    return analyticsKit.registerProvider(consoleProvider);
};

// Create scoped analytics
const analytics = analyticsKit.createScopedAnalytics({
    production: bootstrapProductionAnalytics,
    development: bootstrapDevelopmentAnalytics,
    testing: () => analyticsKit.registerProvider(mockProvider)
});

// Use specific scopes - providers are initialized lazily
analytics.for('production').track('user_signup', { plan: 'premium' });
analytics.for('development').identify('user123');

// Environment-based usage
const currentAnalytics = analytics.for(
    process.env.NODE_ENV === 'production' ? 'production' : 'development'
);
currentAnalytics.track('page_view', { page: '/dashboard' });
```

#### Real-world Example

```javascript
import analyticsKit from '@assetplan/analytics-kit';
import posthog from 'posthog-js';

// Define a console-based fallback provider
const bootstrapConsoleAnalytics = () => {
  const consoleProvider = {
    identify(userId, traits) {
      console.log(`[console] identify`, userId, traits);
    },
    track(event, props) {
      console.log(`[console] track`, event, props);
    }
  };

  return analyticsKit.registerProvider(consoleProvider);
};

// Define a PostHog-based analytics provider for 'renter'
const bootstrapRenterAnalytics = () => {
  posthog.init('REPLACE_WITH_RENTER_KEY', {
    autocapture: false,
    person_profiles: 'identified_only'
  }, 'renter');

  const renterInstance = posthog.getInstance('renter');

  const renterProvider = {
    identify(userId, traits) {
      renterInstance.identify(userId, traits);
    },
    track(event, props) {
      renterInstance.capture(event, props);
    }
  };

  return analyticsKit.registerProvider(renterProvider);
};

// Define scoped analytics manager
const isProduction = process.env.NODE_ENV === 'production';

const analytics = analyticsKit.createScopedAnalytics({
  renter: () => isProduction ? bootstrapRenterAnalytics() : bootstrapConsoleAnalytics(),
  owner: () => isProduction ? bootstrapConsoleAnalytics() : bootstrapConsoleAnalytics(), // Stubbed example
  sessionless: () => isProduction ? bootstrapConsoleAnalytics() : bootstrapConsoleAnalytics()
});

// Usage
analytics.for('renter').identify('user123', { plan: 'pro' });
analytics.for('renter').track('page_view', { path: '/dashboard' });
```

**Features:**
- **Lazy initialization**: Providers are only created when first accessed
- **Caching**: Each scope's provider is initialized once and reused
- **Error handling**: Invalid scopes throw clear error messages
- **Flexible**: Bootstrap functions can contain any initialization logic

## Provider Interface

Each provider should implement these methods (all optional):

```javascript
{
    track: (event: string, properties?: object) => void | Promise<void>,
    identify: (userId: string, traits?: object) => void | Promise<void>,
    page: (name: string, properties?: object) => void | Promise<void>,
    reset: () => void | Promise<void>,
    alias: (newId: string, previousId: string) => void | Promise<void>,
    ready: (callback?: () => void) => void | Promise<void>
}
```

## Error Handling

The wrapper handles errors gracefully:

- Missing methods show warnings but don't crash
- Thrown errors are caught and logged
- Promise rejections are handled automatically
- Your app continues running even if analytics fail

## Development

```bash
# Build the package
npm run build

# Build and watch for changes
npm run dev

# Run tests
npm run test
```

## License

MIT