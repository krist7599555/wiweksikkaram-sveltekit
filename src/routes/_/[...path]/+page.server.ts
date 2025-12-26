import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PB_URL } from '$env/static/private';

export const load: PageServerLoad = ({ params }) => {
    // redirect to production pocketbase endpoint
    throw redirect(302, `${PB_URL}/_/${params.path}`);
};
