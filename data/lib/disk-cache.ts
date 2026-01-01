// https://writer.dek-d.com/Wiweksikkaram/writer/view.php?id=2485901
// https://writer.dek-d.com/dekdee/writer/viewlongc.php?id=2485901&chapter=1
import * as Bun from 'bun';

export class DiskCache<T> {
    static async has(key: string) {
        return await Bun.file(key).exists();
    }
    static async get(key: string) {
        return Bun.file(key).text();
    }
    static async set(key: string, content: string) {
        await Bun.file(key).write(content);
    }
    static async get_or_assign(
        key: string,
        fn: () => Promise<string>
    ): Promise<[string, 'cache' | 'assign']> {
        try {
            return [await this.get(key), 'cache'];
        } catch {
            const content = await fn();
            await this.set(key, content);
            return [content, 'assign'];
        }
    }

    public readonly encode: (val: T) => string;
    public readonly decode: (str: string) => T;
    constructor(opt: { encode: (val: T) => string; decode: (str: string) => T }) {
        this.encode = opt.encode;
        this.decode = opt.decode;
    }
    async get(key: string) {
        return this.decode(await DiskCache.get(key));
    }
    async set(key: string, value: T) {
        return await DiskCache.set(key, this.encode(value));
    }
    async has(key: string) {
        return await DiskCache.has(key);
    }
    async get_or_assign(key: string, fn: () => Promise<T>): Promise<[T, 'cache' | 'assign']> {
        try {
            return [await this.get(key), 'cache'];
        } catch {
            const content = await fn();
            await this.set(key, content);
            return [content, 'assign'];
        }
    }
}
export const DiskCacheJson = new DiskCache<any>({
    encode: (a) => JSON.stringify(a),
    decode: (a) => JSON.parse(a)
});

export async function get_json_cache<T>(key: string, init: () => Promise<T>): Promise<T> {
    const [out] = await DiskCacheJson.get_or_assign(key, init);
    return out as T;
}
