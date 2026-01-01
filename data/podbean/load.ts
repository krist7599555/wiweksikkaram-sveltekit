import rss from 'rss-to-json';
import * as v from 'valibot';

const ItemSchema = v.object({
    id: v.string(),
    title: v.string(),
    description: v.string(),
    link: v.pipe(v.string(), v.url()),
    published: v.pipe(v.number(), v.integer()),
    created: v.pipe(v.number(), v.integer()),
    category: v.array(v.string()),
    content: v.string(),
    enclosures: v.array(
        v.object({
            url: v.pipe(v.string(), v.url()),
            length: v.pipe(v.string(), v.digits()),
            type: v.literal('audio/mpeg')
        })
    ),
    content_encoded: v.optional(v.string(), ''),
    itunes_summary: v.optional(v.string(), ''),
    itunes_author: v.literal('Wiweksikkaram'),
    itunes_duration: v.pipe(v.number(), v.integer()),
    itunes_episode: v.optional(v.pipe(v.number(), v.integer())),
    itunes_episodeType: v.optional(v.literal('full')),
    media: v.object({}) // empty object จริงๆ ไม่มีอะไรข้างใน
});

export const FeedSchema = v.object({
    title: v.literal('วิเวกสิกขาราม'),
    description: v.string(),
    link: v.literal('https://wiweksikkaram.podbean.com'),
    image: v.pipe(v.string(), v.url()),
    category: v.string(),
    items: v.array(ItemSchema)
});
export type RssFeed = v.InferOutput<typeof FeedSchema>;
export async function load_rss_feed(): Promise<RssFeed> {
    const url = 'https://feed.podbean.com/wiweksikkaram/feed.xml';
    const res = await rss(url);
    return v.parse(FeedSchema, res);
}
