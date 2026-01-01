import 'sugar';
import * as v from 'valibot';
import * as rmd from 'remeda';
import * as Toml from 'smol-toml';
import { loadEnv } from 'vite';
import Pocketbase from 'pocketbase';

import type { CollectionResponses, Create, TypedPocketBase } from '../src/lib/pocketbase/pb_types';
import { load_rss_feed } from '../data/podbean/load';

import { apipe } from '../src/lib/utils/apipe';
import { lucas_hash } from '../src/lib/lucas_hash';

const guard_type =
    <T extends v.ObjectEntries>(schema: T) =>
    (inp: any) =>
        v.parse(v.object(schema), inp);

export const panic = (msg: string): never => {
    throw new Error(msg);
};

const wiw = {
    awaited_all: <T>(arr: T[]) => Promise.all(arr),
    awaited_map:
        <I, O>(fn: (data: I) => Promise<O>) =>
        (data: I[]): Promise<O[]> =>
            Promise.all(data.map(fn))
};

const env = rmd.pipe(
    loadEnv('production', process.cwd(), ''),
    guard_type({
        PB_URL: v.string(),
        PB_TYPEGEN_USERNAME: v.string(),
        PB_TYPEGEN_PASSWORD: v.string()
    })
);

const podbean_records = rmd.pipe(await load_rss_feed(), rmd.prop('items'));
const manual_records = rmd.pipe(
    await Bun.file(`${import.meta.dir}/manual.toml`).text(),
    Toml.parse,
    guard_type({
        items: v.array(
            v.object({
                podbean_id: v.string(),
                podbean_title: v.string(),
                attribute: v.record(v.string(), v.string()),
                published: v.pipe(v.string(), v.regex(/^20\d\d-\d{2}-\d{2}$/)),
                title: v.string(),
                location: v.string(),
                event: v.string(),
                tags: v.array(v.string())
            })
        )
    }),
    rmd.prop('items')
);

const table = podbean_records.map((podbean) => {
    const manual =
        manual_records.find((m) => m.podbean_id == podbean.id) ??
        panic(`manual not found podbean_key ${podbean.id}`);
    return {
        id: manual.published + '-' + lucas_hash(podbean.id, 4),
        podbean_id: podbean.id,
        manual,
        podbean
    };
});

const pb = await (async () => {
    const pb = new Pocketbase(env.PB_URL) as App.TypedPocketBase;
    pb.autoCancellation(false);
    await pb
        .collection('_superusers')
        .authWithPassword(env.PB_TYPEGEN_USERNAME, env.PB_TYPEGEN_PASSWORD);
    return pb;
})();

async function upsert<T extends 'tags' | 'posts'>(
    pb: TypedPocketBase,
    col: T,
    search_key: keyof Create<T> & string,
    data: Create<T>
): Promise<CollectionResponses[T]> {
    try {
        const existing = await pb
            .collection(col)
            .getFirstListItem(`${search_key} = "${data[search_key]}"`);

        return await pb.collection(col).update(existing.id, data);
    } catch (err: any) {
        if (err?.status === 404) {
            return await pb.collection(col).create(data);
        }
        throw err;
    }
}

const tagname_tags = await apipe(
    table,
    rmd.flatMap((t) => t.manual.tags),
    rmd.unique(),
    rmd.map((tag) => upsert(pb, 'tags', 'name', { name: tag })),
    wiw.awaited_all,
    rmd.mapToObj((i) => [i.name, i])
);

const _ = await apipe(
    table,
    wiw.awaited_map((rec) =>
        upsert(pb, 'posts', 'id', {
            id: rec.id,

            audio_duration: rec.podbean.itunes_duration,
            audio_link: rec.podbean.enclosures[0].url,
            podbean: rec.podbean,
            podbean_id: rec.podbean.id,
            podbean_title: rec.podbean.title,

            event: rec.manual.event,
            location: rec.manual.location,
            title: rec.manual.title,
            published: rec.manual.published,
            time: rec.manual.attribute.time || undefined,
            attribute: rmd.omit(rec.manual.attribute, ['time']),
            tags: rec.manual.tags.map((t) => tagname_tags[t].id),

            content: '',
            youtube_link: ''
        })
    )
);

console.log(_.length);
console.log('DONE');
