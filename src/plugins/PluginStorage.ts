const PLUGIN_PREFIX = "plugin:";
export class PluginStorage {
  private namespace: string;
  constructor(pluginId: string) {
    this.namespace = `${PLUGIN_PREFIX}${pluginId}:`;
  }

  private prefixKey(key: string): string {
    return `${this.namespace}${key}`;
  }

  get<T>(key: string): T | undefined {
    try {
      const raw = localStorage.getItem(this.prefixKey(key));
      if (raw === null) return undefined;
      return JSON.parse(raw) as T;
    } catch {
      return undefined;
    }
  }

  set<T>(key: string, value: T): void {
    localStorage.setItem(this.prefixKey(key), JSON.stringify(value));
  }

  remove(key: string): void {
    localStorage.removeItem(this.prefixKey(key));
  }

  clear(): void {
    const prefix = this.prefixKey("");
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(prefix)) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  }
}
