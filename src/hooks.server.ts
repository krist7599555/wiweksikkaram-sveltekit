import { createPocketbase } from '$lib/pocketbase/pb';
import type { Handle } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
    event.locals.pb = createPocketbase();
    const response = await resolve(event);
    return response;
}) satisfies Handle;
