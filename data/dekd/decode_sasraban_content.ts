const [enc, dec] = (() => {
    const map_str = `๮ช๥ก๨ค๬จ๦ข๥ก๦ข๨ค๬จ๭ฉ๮ช๯ซ๰ฌ๱ญ๲ฎ๳ฏ๴ฐ๵ฑ๶ฒ๷ณ๸ด๹ต๺ถ๻ท๼ธ๽น๾บ๿ป๫ง`;
    const enc: string[] = [];
    const dec: string[] = [];
    for (let i = 0; i < map_str.length; ++i) {
        (i % 2 == 0 ? enc : dec).push(map_str[i]);
    }
    return [enc, dec];
})();

export function saraban_decode(str: string) {
    return str
        .split('')
        .map((c) => {
            const idx = enc.findIndex((e) => e == c);
            return idx === -1 ? c : dec[idx];
        })
        .join('');
}
