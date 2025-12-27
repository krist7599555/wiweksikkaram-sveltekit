import { range } from '../../src/lib/utils/range';
import { DiskCache } from '../lib/disk-cache';
import { saraban_decode } from './decode_sasraban_content';
import { prettify as html_prettify } from 'htmlfy';
import { htmlToMarkdown } from '@aiquants/html-to-markdown';

const guard: (cond: boolean, err_msg: string) => asserts cond = (cond, err_msg) => {
    if (!cond) throw new Error(err_msg);
};

const urls = range(1, 344).map((i) => ({
    url: `https://writer.dek-d.com/dekdee/writer/viewlongc.php?id=2485901&chapter=${i}`,
    cache_key: {
        raw_html: `.disk-cache/dekd-2485901-${i}.html`,
        clean_html: `.disk-cache/dekd-2485901-${i}-clean.html`,
        clean_md: `.disk-cache/dekd-2485901-${i}-clean.md`,
        clean_json: `.disk-cache/dekd-2485901-${i}-clean.json`
    }
}));

for (const { url, cache_key } of urls) {
    const [raw_html, source] = await DiskCache.get_or_assign(cache_key.raw_html, async () => {
        const res = await Bun.fetch(url);
        guard(res.status === 200, `fetch ${url} got status ${res.status}`);
        const raw = await res.text();
        guard(raw.length >= 100_000, `HTML.length too short got ${raw.length}`);
        guard(raw.includes(`id="story-content"`), 'expect dekd page to have content');
        return raw;
    });

    if (source === 'cache') {
        console.log('SKIP: ', url);
        continue;
    }

    console.log('RUN:  ', url);

    const clean_json = (() => {
        const lines = raw_html.split('\n');
        const idx = lines.findIndex((l) => l.includes(`window.chapterData`));
        const json_str = lines
            .slice(idx, idx + 1)
            .join('\n')
            .trim()
            .replace('window.chapterData = ', '');
        return eval(json_str);
    })();

    const clean_html = html_prettify(
        saraban_decode(clean_json.body)
            .replaceAll('&nbsp;', '')
            .replaceAll('&#8220;', '"')
            .replaceAll('&#8221;', '"')
            .replace(/<p( (id|class|style)="[^"]+")*>/g, '<p>')
            .replace('พระอาจารย์วิชัย กัมมสุทโธ', '')
    );
    const clean_markdown = await htmlToMarkdown('', { htmlContent: clean_html }).then(
        (r) => r.markdown
    );
    await DiskCache.set(cache_key.clean_html, clean_html);
    await DiskCache.set(cache_key.clean_json, JSON.stringify(clean_json, undefined, 2));
    await DiskCache.set(cache_key.clean_md, clean_markdown);
    console.log('DONE');
}

console.log('SUCCESS Dek-D');
