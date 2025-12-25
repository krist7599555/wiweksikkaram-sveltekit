export function mapValue<const K extends string, T extends Record<string, { [key in K]: any }>>(
    value: T,
    key: K
): { [key in keyof T]: T[key][K] };

export function mapValue<T extends Record<string, any>, R>(
    record: T,
    fn: (value: T[keyof T], key: keyof T) => R
): { [K in keyof T]: R };

export function mapValue(
    value: Record<string, any>,
    fn: string | ((it: any, key: any) => any)
): Record<string, any> {
    const result = {} as Record<string, any>;
    for (const key in value) {
        result[key] = typeof fn === 'string' ? value[key][fn] : fn(value[key], key);
    }
    return result;
}
