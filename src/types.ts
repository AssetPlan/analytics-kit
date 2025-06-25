export interface AnalyticsProvider {
  track: (event: string, properties?: Record<string, any>) => void | Promise<void>;
  identify: (userId: string, traits?: Record<string, any>) => void | Promise<void>;
  page: (name: string, properties?: Record<string, any>) => void | Promise<void>;
  reset: () => void | Promise<void>;
  alias: (newId: string, previousId: string) => void | Promise<void>;
  ready: (callback?: () => void) => void | Promise<void>;
}

export interface ProviderWrapper {
  track: (event: string, properties?: Record<string, any>) => void | Promise<void>;
  identify: (userId: string, traits?: Record<string, any>) => void | Promise<void>;
  page: (name: string, properties?: Record<string, any>) => void | Promise<void>;
  reset: () => void | Promise<void>;
  alias: (newId: string, previousId: string) => void | Promise<void>;
  ready: (callback?: () => void) => void | Promise<void>;
}

export type ScopeMap = Record<string, () => AnalyticsProvider>;

export interface ScopedAnalytics {
  for: (scope: string) => AnalyticsProvider;
}