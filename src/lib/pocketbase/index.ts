import PocketBase from 'pocketbase';
import type { TypedPocketBase } from './pb_types';
import { getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';

export const createPocketbase = (url: string) => new PocketBase(url) as TypedPocketBase;
export const pb = () => {
    const res = getRequestEvent().locals.pb;
    if (!res) throw error(500, 'expect Pocketbase in event.locals.pb to exists');
    return res;
};
