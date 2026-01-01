import * as Toml from 'smol-toml';
import type { Create, PostsRecord } from '../src/lib/pocketbase/pb_types';

const manual_records = await Bun.file(`${import.meta.dir}/manual.toml`)
    .text()
    .then(
        (t) =>
            Toml.parse(t) as {
                items: {
                    podbean_id: '8d5bdac0-fb70-4984-9cdd-a72000a94070';
                    podbean_title: 'พระอาจารย์วิชัย กัมมสุทโธ 52-4-3 (031) ไม่เห็นความจริงของลมหายใจเข้าออก - 03 เม.ย. 52 เช้า';
                    attribute: { time: 'เช้า' };
                    published: '2009-04-03';
                    title: 'ไม่เห็นความจริงของลมหายใจเข้าออก';
                    location: '';
                    event: '';
                    tags: string[];
                }[];
            }
    )
    .then((man) => {
        for (const item of man.items) {
            if (item.location.includes('SCG') && !item.tags.includes('SCG')) {
                item.tags.push('SCG');
            }
        }
        return man.items;
    });

function hash_alphabets(str: string, size: number) {
    let i = 0;
    for (const c of str) {
        i *= 257;
        i += c.charCodeAt(0) * 29;
    }
    let out = '';
    while (out.length < size) {
        out += String.fromCharCode('a'.charCodeAt(0) + (i % 26));
        i = Math.floor(i / 26);
    }
    return out;
}
function hash_podbean(podbean_id: string, published: string) {
    const [y, m, d] = published.split('-');
    return ['y', y, 'm', m, 'd', d, hash_alphabets(podbean_id, 4)].join('');
}

import type {} from '../src/app';
import { loadEnv } from 'vite';
import Pocketbase from 'pocketbase';
import { load_rss_feed, type RssFeed } from '../data/podbean/load';
import { get_json_cache } from '../data/lib/disk-cache';

const env = loadEnv('production', process.cwd(), '');
const pb = new Pocketbase(env.PB_URL) as App.TypedPocketBase;
pb.authStore.save(env.PB_TYPEGEN_TOKEN, null);
const { token } = await pb
    .collection('_superusers')
    .authWithPassword(env.PB_TYPEGEN_USERNAME, env.PB_TYPEGEN_PASSWORD);
// after the above you can also access the auth data from the authStore
// console.log(pb.authStore.isValid);
// console.log(pb.authStore.token);
// console.log(pb.authStore.record);
console.log(pb.authStore.isSuperuser);

pb.autoCancellation(false);

const { items: rss_records } = await get_json_cache<RssFeed>('.disk-cache/podbean-feed.json', () =>
    load_rss_feed()
);

for (const pod of rss_records) {
    const man = manual_records.find((m) => m.podbean_id === pod.id);
    if (!man) throw new Error(`not match id=${pod.id}`);
    const id = hash_podbean(pod.id, man.published);
    console.log('START:', id);
    await pb.collection('posts').delete(id);
    const out = await pb
        .collection('posts')
        .create({
            id: id,
            location: man.location,
            published: man.published,
            title: man.title,
            event: man.event,
            time: man.attribute.time,
            attribute: man.attribute,
            audio_link: pod.enclosures[0].url,
            audio_duration: pod.itunes_duration,
            content: '',
            podbean_id: pod.id,
            podbean_title: pod.title,
            podbean: pod,
            youtube_link: undefined
            // tags: man.tags
        } satisfies Create<'posts'>)
        .catch((e) => {
            console.error(e.data);

            // throw e;
        });
    console.log('END:', out);
}
