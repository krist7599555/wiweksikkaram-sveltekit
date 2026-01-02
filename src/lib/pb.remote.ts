import { query } from '$app/server';
import { pb } from './pocketbase';
import type { PostsResponse, TagsRecord } from './pocketbase/pb_types';

export const getPosts = query(async () => {
    return await pb()
        .collection('posts')
        .getList<PostsResponse & { expand: { tags: TagsRecord[] } }>(1, 50, {
            sort: '-published',
            expand: 'tags'
        });
});
