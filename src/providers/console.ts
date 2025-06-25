import type { AnalyticsProvider } from '../types.js';

const consoleProvider: AnalyticsProvider = {
    track: function(event: string, properties: Record<string, any> = {}): void {
        console.log('📊 Track:', event, properties);
    },
    
    identify: function(userId: string, traits: Record<string, any> = {}): void {
        console.log('👤 Identify:', userId, traits);
    },
    
    page: function(name: string, properties: Record<string, any> = {}): void {
        console.log('📄 Page:', name, properties);
    },
    
    reset: function(): void {
        console.log('🔄 Reset: User session cleared');
    },
    
    alias: function(newId: string, previousId: string): void {
        console.log('🔗 Alias:', { newId, previousId });
    },
    
    ready: function(callback?: () => void): void {
        console.log('✅ Ready: Console provider initialized');
        if (typeof callback === 'function') {
            callback();
        }
    }
};

export default consoleProvider;