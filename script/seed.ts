changeDirToProjectRoot();

const env = await readAndParseEnv();
const pb = await createPocketBase({
    url: env.PB_URL,
    username: env.PB_TYPEGEN_USERNAME,
    password: env.PB_TYPEGEN_PASSWORD
});
const podbeans = await readWiwekPodbeanFeed('https://feed.podbean.com/wiweksikkaram/feed.xml');
const manuals = await readManualToml(`./script/manual.toml`);

const pbMemo = createPocketbaseMemo(pb);

for (const [pod, man] of leftJoinNotNull(podbeans, manuals, ['id', 'podbean_id'])) {
    log('pod:', pod.id, pod.title);
    await upsertRecordByUniqueKey(pb, 'posts', 'id', {
        id: man.published + '-' + lucasHash(man.podbean_id, 4),
        audio_duration: pod.itunes_duration,
        audio_link: pod.enclosures[0].url,
        podbean: pod,
        podbean_id: pod.id,
        podbean_title: pod.title,
        event: man.event,
        location: man.location,
        title: man.title,
        published: man.published,
        time: man.attribute.time || undefined,
        attribute: omit(man.attribute, ['item']),
        tags: await pbMemo.upsertTagsByName(man.tags),
        content: '',
        youtube_link: ''
    });
}
log('DONE');

// END MAIN

import { invariant, omit } from 'es-toolkit';
import { lucasHash } from '../src/lib/lucas_hash';
// Helper
import type { CollectionResponses, Create, TypedPocketBase } from '../src/lib/pocketbase/pb_types';
import Pocketbase from 'pocketbase';
async function createPocketBase(opt: { url: string; username: string; password: string }) {
    const pb = new Pocketbase(opt.url) as TypedPocketBase;
    await pb.collection('_superusers').authWithPassword(opt.username, opt.password);
    return pb;
}

import { loadEnv } from 'vite';
async function readAndParseEnv() {
    const env = loadEnv('production', process.cwd(), '');
    const schema = type({
        PB_URL: 'string',
        PB_TYPEGEN_USERNAME: 'string',
        PB_TYPEGEN_PASSWORD: 'string'
    });
    return schema.assert(env);
}

import readRssFeed from 'rss-to-json';
import { type } from 'arktype';
export async function readWiwekPodbeanFeed(rssFeedUrl: string) {
    const parsedRss = await readRssFeed(rssFeedUrl);
    const schema = type({
        id: 'string',
        title: 'string',
        description: 'string',
        link: 'string.url',
        published: 'number',
        created: 'number',
        category: 'string[]',
        content: 'string',
        enclosures: [{ url: 'string.url', length: 'string.digits', type: "'audio/mpeg'" }],
        content_encoded: 'string?',
        itunes_summary: 'string?',
        itunes_author: "'Wiweksikkaram'",
        itunes_duration: 'number.integer',
        itunes_episode: 'number.integer?',
        itunes_episodeType: "'full'?",
        media: {}
    });
    return type({ items: schema.array() }).assert(parsedRss).items;
}

import * as Toml from 'smol-toml';
import { log } from 'console';
export async function readManualToml(tomlFilePath: string) {
    const rawToml = await Bun.file(tomlFilePath).text();
    const parsedToml = Toml.parse(rawToml);
    const schema = type({
        podbean_id: 'string',
        podbean_title: 'string',
        attribute: 'Record<string, string>',
        published: '/^20\\d\\d-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$/',
        title: 'string',
        location: 'string',
        event: 'string',
        tags: 'string[]'
    });
    const validatedToml = type({ items: schema.array() }).assert(parsedToml).items;
    return validatedToml;
}

async function upsertRecordByUniqueKey<
    T extends 'tags' | 'posts',
    K extends keyof Create<T> & string
>(pb: TypedPocketBase, col: T, search_key: K, data: Create<T>): Promise<CollectionResponses[T]> {
    try {
        const existing = await pb
            .collection(col)
            .getFirstListItem(`${search_key} = "${data[search_key]}"`);

        return await pb.collection(col).update(existing.id, data);
    } catch (err: any) {
        if (err?.status === 404) {
            return await pb.collection(col).create(data);
        }
        console.error(data);
        throw err;
    }
}

function leftJoinNotNull<A, B>(lhs: A[], rhs: B[], [ka, kb]: [keyof A & string, keyof B & string]) {
    return lhs.map((l) => {
        const r = rhs.find((r) => (l[ka] as string) === (r[kb] as string));
        invariant(r, `leftJoinNotNull not match l.${ka} = r.${kb} on l.${ka} = ${l[ka]}`);
        return [l, r] as const;
    });
}

function createPocketbaseMemo(pb: TypedPocketBase) {
    const tagNameToTagId = new Map<string, string>();
    async function upsertTagByName(tagName: string) {
        const tagId = tagNameToTagId.get(tagName);
        if (tagId) return tagId;
        const tag = await upsertRecordByUniqueKey(pb, 'tags', 'name', {
            name: tagName
        });
        tagNameToTagId.set(tagName, tag.id);
        return tag.id;
    }
    return {
        upsertTagsByName: (tagNames: string[]) => Promise.all(tagNames.map(upsertTagByName))
    };
}

import * as fs from 'fs';
import * as path from 'path';
function findProjectRoot(start: string): string {
    let dir = start;
    while (!fs.existsSync(path.join(dir, 'package.json'))) {
        const parent = path.dirname(dir);
        if (parent === dir) {
            throw new Error('project root not found');
        }
        dir = parent;
    }
    return dir;
}

function changeDirToProjectRoot() {
    process.chdir(findProjectRoot(import.meta.dir));
}

function lucasHash(str: string, size: number) {
    const prime = 688846502588399; // Lucas primes
    let i = 0;
    for (const c of str) {
        i = i * 13 + c.charCodeAt(0) * 29;
        i %= prime;
    }
    let out = '';
    while (out.length < size) {
        out += String.fromCharCode('a'.charCodeAt(0) + (i % 26));
        i = Math.floor(i / 26);
    }
    return out;
}
