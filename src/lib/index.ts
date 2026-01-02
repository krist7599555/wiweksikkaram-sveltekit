// place files you want to import through the `$lib` alias in this folder.
export function formatSecond(sec: number) {
    if (typeof sec !== 'number') sec = 0;
    if (isNaN(sec)) return `-:--:--`;

    const s = Math.floor(sec % 60);
    const m = Math.floor((sec / 60) % 60);
    const h = Math.floor(sec / 3600);
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
