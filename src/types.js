/**
 * @typedef {Object} AnalyticsProvider
 * @property {function(string, Object): void} track - Track an event with properties
 * @property {function(string, Object): void} identify - Identify a user with traits
 * @property {function(string, Object): void} page - Track a page view
 * @property {function(): void} reset - Reset the analytics state
 * @property {function(string, string): void} alias - Alias a user ID
 * @property {function(): void} ready - Called when provider is ready
 */

/**
 * @typedef {Object} ProviderWrapper
 * @property {function(string, Object): void} track
 * @property {function(string, Object): void} identify
 * @property {function(string, Object): void} page
 * @property {function(): void} reset
 * @property {function(string, string): void} alias
 * @property {function(): void} ready
 */

export {};