import { DiskCache } from '../lib/disk-cache';
import rss from 'rss-to-json';

const url = 'https://feed.podbean.com/wiweksikkaram/feed.xml';
const key_json = '.disk-cache/podbean-feed.json';

await DiskCache.get_or_assign(key_json, async () => {
    const res = await rss(url);
    return JSON.stringify(res, undefined, 2);
});
