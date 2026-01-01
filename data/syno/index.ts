import * as Bun from 'bun';
import * as Fs from 'fs/promises';
import * as Csv from 'csv-parse/sync';
import * as path from 'path';
import * as Mediabunny from 'mediabunny';
import { $ } from 'zx';
import { findBestMatch } from 'string-similarity';
import { exit } from 'process';

const download_files = await (async () => {
    const { stdout } = await $`find ${import.meta.dir}/download/ -type f -name *.mp3`;
    return stdout
        .split('\n')
        .filter((s) => s.endsWith('.mp3'))
        .reverse()
        .filter((d) => !d.includes('เจริญพระพุทธมนต์'));
})();
console.log(download_files.map((s) => path.basename(s)).filter((s) => s.includes('68-')));
// exit(0);
const podbean = await Bun.file('.disk-cache/podbean-feed.json').json();
let i = 0;
for (const pod of podbean.items.filter((p: any) => !p.title.includes('เจริญพระพุทธมนต์'))) {
    console.log();
    console.log('index:', i);
    i += 1;
    // if (i < 230) {
    //     console.log('skip: index');
    //     continue;
    // }
    let pod_title = pod.title.replace(/[“"]?พระอาจารย์วิชัย กัมมสุทโธ[”"]?( \|)?/, '').trim();
    // if (pod_title.match(/[[(]?(\d{1,2}) (.+) 25(6[0-8])[\])]?/)) {
    // }
    // if (
    //     pod_title.includes(
    //         'ประวัติพระวิชัยปฏิบัติ ตอนที่ 1(เริ่มปฏิบัติ มี.ค.2524 ถึงสำเร็จจักษุแพทย์)'
    //     ) ||
    //     pod_title.includes('ทำวัตรเย็นสวดอัญเชิญพระธาตุ') ||
    //     pod_title.includes('ทำวัตรเช้าสวดอัญเชิญพระธาตุฯ')
    // ) {
    //     continue;
    // }
    // if (pod_title.includes('18 มีนาคม 2568')) {
    //     pod_title = '68-3-18 ' + pod_title;
    // }
    // if (pod_title.includes('หลักธรรมหลักการกฎหมายและการใช้ (18 มีนาคม 2568) กระทรวงยุติธรรม')) {
    //     console.log('REPLACE');
    //     pod_title = '68-3-18-หลักธรรมหลักการกฎหมายและการใช้(เช้า-กระทรวงยธ.).MP3';
    // }

    const mat = findBestMatch(
        pod_title,
        download_files.map((s) => path.basename(s))
    );
    const dow = {
        basename: mat.bestMatch.target,
        filepath: download_files[mat.bestMatchIndex],
        duration: -1
    };
    const rm = () => {
        download_files.splice(mat.bestMatchIndex, 1);
        if (pod_title.includes('กุศล-อกุศลเป็นอย่างไร [3 มีนาคม 2567]')) {
            console.log('rating:', mat.bestMatch.rating);
            console.log('podbean:', pod_title);
            console.log('localfi:', dow.basename);
            console.log('remain:', download_files.length);
        }
    };

    if (pod_title.includes('เจริญพุทธมนต์')) {
        console.log('skip chanting');
        continue;
    }
    if (mat.bestMatch.rating > 0.6) {
        rm();
        console.log('match: best-rating');
        continue;
    }

    dow.duration = await new Mediabunny.Input({
        source: new Mediabunny.FilePathSource(download_files[mat.bestMatchIndex]),
        formats: [Mediabunny.MP3]
    }).computeDuration();

    // if (pod_title.includes('55-11-5 (216) สัจจะหนักแน่นมั่นคงยิ่งกว่าขุนเขา - 5พ.ย.55เช้า')) {
    //     dow.duration -= 18;
    // }
    // if (
    //     pod_title.includes('เจริญพุทธมนต์') ||
    //     pod_title.includes('56-4-4 (238) เจริญพุทธมนต์ปตท.สผ. 4เม.ย.56 ฉันเช้า(ตัดศีล)') ||
    //     pod_title.includes('55-3-16 (171) เจริญพระพุทธมนต์ขึ้นบ้านใหม่(นพ.บำรุง)-16มี.ค.55') ||
    //     pod_title.includes('55-7-7 (171B) เจริญพุทธมนต์บ้าน พ.อ.นพ.อรุษ-7ก.ค.55') ||
    //     pod_title.includes('171A เฉพาะเสียงเจริญพระพุทธมนต์บ้านนพ.บำรุง') ||
    //     pod_title.includes('55-3-10 (170) ทำไมต้องพิจารณาเป็นธาตุ-10 มี.ค.55')
    // ) {
    //     // NOT exists || wrong samplerate
    //     continue;
    // }
    // if (pod_title.includes('คุณธรรมความสามัคคีในการทำงาน 20มิ.ย.56บ่าย')) {
    //     // SKIP ให้พร -> duration will not match
    //     // continue;
    //     dow.duration -= 125;
    // }
    // if (pod_title.includes('55-6-11 (190) ปัญญาพาให้พ้นทุกข์ - 11มิ.ย.55 ปตท.สผ-สวนโมกข์')) {
    //     // SKIP ให้พร -> duration will not match
    //     // continue;
    //     dow.duration -= 133;
    // }
    // if (pod_title.includes('55-6-12 (191) ธรรมะกับความปลอดภัย - 12มิ.ย.55 (ไซด์1SCG ระยอง)')) {
    //     // SKIP ให้พร -> duration will not match
    //     // continue;
    //     dow.duration -= 88;
    // }
    // if (pod_title.includes('55-4-12 (179) บุญอำนวยสุข - 12 เม.ย.55 (ไซด์1SCG)')) {
    //     // SKIP ให้พร -> duration will not match
    //     // continue;
    //     dow.duration -= 226;
    // }
    // if (pod_title.includes('55-2-22 (167) ธรรมะในงานในการดำรงชีพ - 22ก.พ.55บ่าย(ไซด์4 SCG)')) {
    //     // SKIP ให้พร -> duration will not match
    //     // continue;
    //     dow.duration -= 221;
    // }
    if (Math.abs(pod.itunes_duration - dow.duration) > 2) {
        console.error(pod.title);
        console.error(dow.filepath);
        // console.error(mat.ratings.slice(0, 5));
        // console.log(pod);
        throw new Error(`Error Matching duration ${pod.itunes_duration - dow.duration}`);
    }

    rm();
    console.log('match: duration-check', pod.itunes_duration, Math.floor(dow.duration));
}

console.log(download_files.map((d) => d));
