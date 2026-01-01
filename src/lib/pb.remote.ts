import { query } from '$app/server';
import { pb } from './pocketbase';
import * as v from 'valibot';
import type { PostsResponse, TagsRecord } from './pocketbase/pb_types';

export const getPosts = query(async () => {
    return await pb()
        .collection('posts')
        .getList<PostsResponse & { expand: { tags: TagsRecord[] } }>(1, 50, {
            sort: '-published',
            expand: 'tags'
        });
});
export const getFileUrl = query(
    v.object({
        collectionName: v.string(),
        id: v.string(),
        filename: v.string()
    }),
    ({ collectionName, id, filename }) => {
        return pb().files.getURL({ collectionName, id }, filename);
    }
);
