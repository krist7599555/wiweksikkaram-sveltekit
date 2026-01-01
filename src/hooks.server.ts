import { createPocketbase } from '$lib/pocketbase';
import type { Handle } from '@sveltejs/kit';
import { PB_URL } from '$env/static/private';

export const handle = (async ({ event, resolve }) => {
    event.locals.pb = createPocketbase(PB_URL);
    const response = await resolve(event);
    return response;
}) satisfies Handle;
