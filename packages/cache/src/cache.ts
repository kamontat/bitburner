export class Cache {
  private static _instance: Cache;

  static get(): Cache {
    if (!Cache._instance) Cache._instance = new Cache(new Map());
    return Cache._instance;
  }

  constructor(private map: Map<string, unknown>) {}

  set(key: string, value: unknown): void {
    this.map.set(key, value);
  }

  get<T>(key: string): T {
    return this.map.get(key) as T;
  }

  delete(key: string): boolean {
    return this.map.delete(key);
  }
}
