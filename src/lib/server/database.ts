import { getRequestEvent } from '$app/server';

export function db(): D1Database {
    const req = getRequestEvent();
    return req.platform?.env.DB;
}

export function sql(strings: TemplateStringsArray, ...values: unknown[]) {
    const query = strings.join('?');
    const stmt = db().prepare(query);
    return values.length ? stmt.bind(...values) : stmt;
}
