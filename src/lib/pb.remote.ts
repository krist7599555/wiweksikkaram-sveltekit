import { query } from '$app/server';
import { pb } from './pocketbase';
import * as v from 'valibot';

export const getPosts = query(async () => {
    return await pb().collection('posts').getList(1, 50, {
        // filter: 'someField1 != someField2'
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
