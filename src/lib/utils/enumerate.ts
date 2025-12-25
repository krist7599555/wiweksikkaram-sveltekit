export function enumerate<T>(arr: Array<T>): Array<[number, T]>;
export function enumerate<K extends string, T>(arr: Record<K, T>): Array<[K, T]>;
export function enumerate<T extends Record<string, any>>(arr: T): Array<[keyof T, T[keyof T]]>;
// implementation
export function enumerate(value: unknown): Array<[string | number, any]> {
    if (Array.isArray(value)) {
        return value.map((it, idx) => [idx, it]);
    }
    if (typeof value === 'object' && value != null) {
        return Object.entries(value);
    }
    throw new Error(`Can not enumerate ${value}`);
}
