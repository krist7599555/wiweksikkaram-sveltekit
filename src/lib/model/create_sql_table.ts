import { enumerate } from '$lib/utils';

export function createSqlTable(fields: Record<string, Record<string, { sql: string }>>) {
    let o = '';
    for (const [k, v] of enumerate(fields)) {
        o += `CREATE TABLE IF NOT EXISTS ${k} (\n`;
        o += enumerate(v)
            .map(([f, attr]) => `    ${f} ${attr.sql}`)
            .join(',\n');
        o += '\n);\n\n';
    }
    console.log(o);
}
