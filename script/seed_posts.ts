import type {} from '../src/app';
import type { PostsRecord } from '../src/lib/pocketbase/pb_types';
import { loadEnv } from 'vite';
import Pocketbase from 'pocketbase';
import { load_rss_feed, type RssFeed } from '../data/podbean/load';
import { get_json_cache } from '../data/lib/disk-cache';

const env = loadEnv('production', process.cwd(), '');
const pb = new Pocketbase(env.PB_URL) as App.TypedPocketBase;

const { items } = await get_json_cache<RssFeed>('.disk-cache/podbean-feed.json', () =>
    load_rss_feed()
);

function process_title(podbean_id: string, s: string) {
    const cp = s;
    let t = s
        .replace('56-2-14', '56-2-24')
        // https://youtu.be/vQ_xGkOCWQE?si=AQnibXPXeEjZjl5W
        // พระอาจารย์วิชัย กัมมสุทโธ 56-2-14 (233) หลักวินิจฉัยความรู้ความเห็น 24ก.พ.56เช้า
        .replace('54-12-30', '54-12-31')
        // https://youtu.be/1ISE3FIqkgU?si=6r3EMWx8jzRcYkd6
        // พระอาจารย์วิชัย กัมมสุทโธ 54-12-30 (150) นิสัยอนุสัย(ปฏิจจสมุปบาท) - 31ธ.ค.54หัวค่ำ
        .replace(/ฟังธรรมะ?/, '')
        .replace('วิช้ย', 'วิชัย')
        .replace('โดยพระอาจารย์วิชัย กัมมสุทโธ', '')
        .replace('พระอาจารย์วิชัย กัมมสุทโธ', '')

        .replace(/["“”|]/g, '')
        .replace(/\s+/, ' ')
        .split(/[[\]]/g)
        .map((s) => s.trim())
        .filter(Boolean)
        .join(' ');

    const attr: any = {
        compute_date: []
    };
    const tok: string[] = [];

    const re = (regex: RegExp, fn: (mat: RegExpMatchArray) => void) => {
        const e = regex.exec(t);
        if (!e) return false;
        fn(e);
        t = t.replace(e[0], '');

        return true;
    };

    let fallback = '';
    const to_date_str = (y: number, m: number, d: number) => {
        y = y < 100 ? y + 2500 - 543 : y - 543;
        return `${`${y}`.padStart(4, '0')}-${`${m}`.padStart(2, '0')}-${`${d}`.padStart(2, '0')}`;
    };
    while (t) {
        re(/^([56]\d)-?(10|11|12|0?[1-9])-?(1\d|2\d|30|31|0?\d)\s*/, (m) => {
            attr.date_1 = m[0];
            attr.compute_date.push(to_date_str(+m[1], +m[2], +m[3]));
        });
        re(/^\((\d{3})[AB]?\)\s*/, (m) => {
            attr.old_id = m[0];
        });
        re(/^\([12]\)\s*/, (m) => {
            attr.part = m[0];
        });
        re(/-\s*/, (m) => {
            attr.dash = m[0];
        });
        re(/(หัวค่ำ|เช้า|เย็น|เที่ยง|บ่าย|ค่ำ)\s*/, (m) => {
            attr.time_1 = m[0];
        });
        re(
            /[[(]?\s*(\d{1,2}) (มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม)+ ((25)?[56]\d)\s*[\])]?\s*/,
            (m) => {
                attr.date_2 = m[0];
                const mon =
                    'มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม'
                        .split('|')
                        .indexOf(m[2]) + 1;
                attr.compute_date.push(to_date_str(+m[3], mon, +m[1]));
            }
        );
        re(
            /\(?(\d{1,2})\s*(ม\.ค\.|ก\.พ\.|มี\.ค\.|เม\.ย\.|พ\.ค\.|มิ\.ย\.|ก\.ค\.|ส\.ค\.|ก\.ย\.|ต\.ค\.|พ\.ย\.|ธ\.ค\.)\s*(\d{4}|\d{2})\)?\s*/,
            (m) => {
                attr.date_3 = m[0];
                const mon =
                    'ม.ค.|ก.พ.|มี.ค.|เม.ย.|พ.ค.|มิ.ย.|ก.ค.|ส.ค.|ก.ย.|ต.ค.|พ.ย.|ธ.ค.'
                        .split('|')
                        .indexOf(m[2]) + 1;
                attr.compute_date.push(to_date_str(+m[3], mon, +m[1]));
            }
        );
        re(/^[ก-๙]+\s*/, (m) => {
            fallback += m[0] + ' ';
        });
        re(/^.+\s*/, (m) => {
            fallback += m[0] + ' ';
        });
    }
    if (attr.compute_date.length > 1 && new Set(attr.compute_date).size != 1) {
        console.error(cp);
        console.error(attr);
        console.error(attr.compute_date);
        throw new Error('date mis match');
    }
    const date_str = attr.compute_date[0];
    delete attr['date_1'];
    delete attr['date_2'];
    delete attr['date_3'];
    delete attr['compute_date'];

    const res = [
        '[[items]]',
        `podbean_id = "${podbean_id}"`,
        `podbean_title = "${cp.replaceAll('"', '\\"')}"`,
        `attribute = ${JSON.stringify(attr)}`,
        `published = "${date_str || ''}"`,
        `title = "${fallback.replace(/\s+/, ' ').trim()}"`,
        `location = ""`,
        `event = ""`,
        `tags = []`,
        ''
    ].join('\n');
    console.log(res);
}

console.log(items.map((i) => process_title(i.id, i.title)).join('\n'));
// for (const item of items) {
//     pb.collection('posts').create({
//         title: item.title,
//         content: '',
//         audio_link: item.enclosures[0].url,
//         audio_duration: item.itunes_duration,
//         location: item.title,
//         published: item.title,
//         youtube_link: '',
//         podbean_id: item.id,
//         tags: []
//     } satisfies Partial<PostsRecord>);
// }
