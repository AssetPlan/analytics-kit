import { registerProvider, createScopedAnalytics } from "@/analytics";
import { describe, it, expect, vi } from "vitest";

describe('analytics', () => {
    it('registerProvider should be a function', () => {
        expect(typeof registerProvider).toBe('function');
    });

    it('createScopedAnalytics should be a function', () => {
        expect(typeof createScopedAnalytics).toBe('function');
    });
});

describe('Basic Provider Usage', () => {
    it('should call provider methods with correct arguments', () => {
        const provider = { track: vi.fn(), identify: vi.fn() };
        const tracker = registerProvider(provider);
        
        tracker.track('signup', { plan: 'pro' });
        tracker.identify('user123', { email: 'test@example.com' });
        
        expect(provider.track).toHaveBeenCalledWith('signup', { plan: 'pro' });
        expect(provider.identify).toHaveBeenCalledWith('user123', { email: 'test@example.com' });
    });

    it('should handle scoped analytics', () => {
        const provider = { track: vi.fn() };
        const analytics = createScopedAnalytics({
            test: () => registerProvider(provider)
        });
        
        analytics.for('test').track('event');
        expect(provider.track).toHaveBeenCalledWith('event');
    });

    it('should return all expected methods from registerProvider', () => {
        const provider = { track: vi.fn() };
        const tracker = registerProvider(provider);
        
        expect(tracker).toHaveProperty('track');
        expect(tracker).toHaveProperty('identify');
        expect(tracker).toHaveProperty('page');
        expect(tracker).toHaveProperty('reset');
        expect(tracker).toHaveProperty('alias');
        expect(tracker).toHaveProperty('ready');
    });

    it('should handle missing provider methods gracefully', () => {
        const incompleteProvider = { track: vi.fn() };
        const tracker = registerProvider(incompleteProvider);
        
        // Should not throw, just warn
        expect(() => tracker.identify('user123')).not.toThrow();
        expect(() => tracker.page('HomePage')).not.toThrow();
    });
});
