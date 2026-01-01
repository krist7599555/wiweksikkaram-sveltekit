// polynomial hash function using Lucas primes as mod
export const lucas_hash = (str: string, size: number) => {
    const prime = 688846502588399; // Lucas primes
    let i = 0;
    for (const c of str) {
        i = i * 13 + c.charCodeAt(0) * 29;
        i %= prime;
    }
    let out = '';
    while (out.length < size) {
        out += String.fromCharCode('a'.charCodeAt(0) + (i % 26));
        i = Math.floor(i / 26);
    }
    return out;
};
