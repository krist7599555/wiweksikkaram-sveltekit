export function range(n: number): Array<number>;
export function range(s: number, t: number): Array<number>;
export function range(n_s: number, t: number | undefined = undefined): Array<number> {
    if (typeof t == 'number') {
        if (n_s > t) throw new Error(`range(a, b) fail a > b on ${n_s} > ${t}`);
        return Array.from({ length: t - n_s }).map((_, idx) => n_s + idx);
    } else {
        return Array.from({ length: n_s }).map((_, idx) => idx);
    }
}
