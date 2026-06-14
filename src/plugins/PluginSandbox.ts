import type { PluginAPI } from "./types";
export class PluginSandbox {
  static evaluate(api: PluginAPI, code: string): void {
    const fn = new Function("api", code);
    fn(api);
  }

  static evaluateAsync(api: PluginAPI, code: string): Promise<void> {
    try {
      const asyncFn = new Function("api", `return (async () => { ${code} })()`);
      return Promise.resolve(asyncFn(api));
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
