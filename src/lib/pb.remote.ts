import { query } from '$app/server';
import { pb } from './server/pocketbase';

export const getPosts = query(async () => {
    return await pb.collection('posts').getList(1, 50, {
        // filter: 'someField1 != someField2'
    });
});
