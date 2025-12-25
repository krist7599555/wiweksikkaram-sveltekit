import { postFields } from './post';
import { tagFields } from './tag';
import { postTagFields } from './post_tag';
import * as v from 'valibot';
import { mapValue } from '$lib/utils';
import { createSqlTable } from './create_sql_table';

export const postSchema = v.object(mapValue(postFields, 'valibot'));
export const tagSchema = v.object(mapValue(tagFields, 'valibot'));
export const postTagSchema = v.object(mapValue(postTagFields, 'valibot'));

export type Post = v.InferOutput<typeof postSchema>;
export type Tag = v.InferOutput<typeof tagSchema>;
export type PostTag = v.InferOutput<typeof postTagSchema>;

export const sqlTableString = createSqlTable({
    posts: postFields,
    tags: tagFields,
    post_tags: postTagFields
});
