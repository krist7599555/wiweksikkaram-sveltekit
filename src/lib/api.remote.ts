import { query } from '$app/server';
import { error } from '@sveltejs/kit';
import type { Post } from './model';
import { sql } from './server/database';
import * as v from 'valibot';

function guard(cond: unknown): asserts cond {
    if (!cond) {
        throw error(400, 'Guard Error');
    }
}

export const getPosts = query(async () => {
    const res = await sql`SELECT * FROM posts`.all<Post>();
    guard(res.success);
    return res.results;
});
export const getPost = query(v.number(), async (id) => {
    const res = await sql`SELECT * FROM posts WHERE id = ${id}`.first<Post>();
    guard(res);
    return res;
});
