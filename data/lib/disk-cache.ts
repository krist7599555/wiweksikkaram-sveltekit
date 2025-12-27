// https://writer.dek-d.com/Wiweksikkaram/writer/view.php?id=2485901
// https://writer.dek-d.com/dekdee/writer/viewlongc.php?id=2485901&chapter=1
import * as Bun from 'bun';

export class DiskCache {
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
}
